const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true", // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
  const from = `${process.env.APP_NAME || "App"} <${process.env.SMTP_USER}>`;
  await transporter.sendMail({ from, to, subject, html });
}

module.exports = { sendEmail };
