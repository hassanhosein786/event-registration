const nodemailer = require("nodemailer");
const fs = require("fs/promises");
const path = require("path");
const env = require("../config/env");

const hasSmtpConfig = () => Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

const createTransporter = () => {
  if (!hasSmtpConfig()) return null;
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });
};

const sendRegistrationConfirmation = async (registration) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("Email confirmation skipped: SMTP settings are not configured.");
    return { skipped: true, reason: "smtp_not_configured" };
  }

  const attachments = [];
  if (registration.generatedPdf) {
    const absolutePdfPath = path.join(
      path.resolve(__dirname, ".."),
      "public",
      String(registration.generatedPdf).replace(/^\/+/, "")
    );

    try {
      await fs.access(absolutePdfPath);
      attachments.push({
        filename: `${registration.registrationId}.pdf`,
        path: absolutePdfPath
      });
    } catch (error) {
      void error;
    }
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to: registration.email,
    subject: `Registration confirmation - ${registration.registrationId}`,
    text: `Hello ${registration.fullName}, your registration ${registration.registrationId} was received successfully.`,
    html: `<p>Hello <strong>${registration.fullName}</strong>,</p><p>Your registration <strong>${registration.registrationId}</strong> was received successfully.</p><p>The completed registration PDF is attached to this email.</p>`,
    attachments
  });

  return { skipped: false };
};

module.exports = { sendRegistrationConfirmation };
