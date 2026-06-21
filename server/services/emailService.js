const nodemailer = require("nodemailer");
const dns = require("dns");
const fs = require("fs/promises");
const path = require("path");
const env = require("../config/env");

dns.setDefaultResultOrder("ipv4first");

const hasSmtpConfig = () => Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

const parseSender = (senderValue) => {
  const value = String(senderValue || "").trim();
  const match = value.match(/^(.*)<([^<>]+)>$/);

  if (match) {
    return {
      name: match[1].trim().replace(/^["']|["']$/g, ""),
      email: match[2].trim()
    };
  }

  return {
    name: "Event Registration",
    email: value
  };
};

const sendViaBrevoApi = async ({ registration, attachments, htmlContent, textContent }) => {
  const sender = parseSender(env.smtp.from);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": env.brevoApiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender,
        to: [
          {
            email: registration.email,
            name: registration.fullName
          }
        ],
        subject: `Registration confirmation - ${registration.registrationId}`,
        htmlContent,
        textContent,
        attachment: attachments
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo API error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

const createTransporter = () => {
  if (!hasSmtpConfig()) return null;
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure || env.smtp.port === 465,
    requireTLS: !env.smtp.secure && env.smtp.port === 587,
    family: 4,
    lookup: (hostname, options, callback) => {
      dns.lookup(hostname, { ...options, family: 4 }, callback);
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });
};

const sendRegistrationConfirmation = async (registration) => {
  const eventTitle = registration.eventName || "Montrose Muslim Association Islamic Summer Camp 2026";
  const htmlContent = `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
      <div style="max-width:640px;margin:0 auto;padding:24px">
        <div style="background:linear-gradient(135deg,#1d4ed8 0%,#0f172a 100%);border-radius:20px 20px 0 0;padding:24px 28px;color:#fff">
          <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;opacity:.85">Registration Confirmation</div>
          <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2">${eventTitle}</h1>
        </div>
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 20px 20px;padding:28px">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6">Hello <strong>${registration.fullName}</strong>,</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155">
            Your registration has been received successfully. Please keep your registration ID for reference.
          </p>
          <div style="margin:20px 0;padding:16px 18px;border-radius:14px;background:#eff6ff;border:1px solid #bfdbfe">
            <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#1d4ed8;margin-bottom:6px">Registration ID</div>
            <div style="font-size:20px;font-weight:700;color:#0f172a">${registration.registrationId}</div>
          </div>
          <div style="margin:20px 0;padding:16px 18px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0;color:#334155;line-height:1.7">
            <strong style="color:#0f172a">What’s attached:</strong> the completed registration PDF for your records.
          </div>
          <p style="margin:0;color:#475569;line-height:1.7">
            If you have any questions, please contact the camp organizers.
          </p>
        </div>
      </div>
    </div>
  `;
  const textContent = [
    `${eventTitle}`,
    "",
    `Hello ${registration.fullName},`,
    "",
    `Your registration ${registration.registrationId} has been received successfully.`,
    "Please keep your registration ID for reference.",
    "",
    "Attached: completed registration PDF",
    "",
    "If you have any questions, please contact the camp organizers."
  ].join("\n");

  const attachments = [];
  if (registration.generatedPdf) {
    const absolutePdfPath = path.join(
      path.resolve(__dirname, ".."),
      "public",
      String(registration.generatedPdf).replace(/^\/+/, "")
    );

    try {
      const pdfBuffer = await fs.readFile(absolutePdfPath);
      if (env.brevoApiKey) {
        attachments.push({
          name: `${registration.registrationId}.pdf`,
          content: pdfBuffer.toString("base64")
        });
      } else {
        attachments.push({
          filename: `${registration.registrationId}.pdf`,
          path: absolutePdfPath
        });
      }
    } catch (error) {
      void error;
    }
  }

  if (env.brevoApiKey) {
    await sendViaBrevoApi({
      registration,
      attachments,
      htmlContent,
      textContent
    });
    return { skipped: false, provider: "brevo_api" };
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.warn("Email confirmation skipped: SMTP settings are not configured.");
    return { skipped: true, reason: "smtp_not_configured" };
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to: registration.email,
    subject: `Registration confirmation - ${registration.registrationId}`,
    text: textContent,
    html: htmlContent,
    attachments
  });

  return { skipped: false, provider: "smtp" };
};

module.exports = { sendRegistrationConfirmation };
