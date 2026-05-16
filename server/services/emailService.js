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
  const htmlContent = `<p>Hello <strong>${registration.fullName}</strong>,</p><p>Your registration <strong>${registration.registrationId}</strong> was received successfully.</p><p>The completed registration PDF is attached to this email.</p>`;
  const textContent = `Hello ${registration.fullName}, your registration ${registration.registrationId} was received successfully. The completed registration PDF is attached to this email.`;

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
