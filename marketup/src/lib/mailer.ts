import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(to: string, token: string) {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  const link = `${baseUrl}/password/reset?token=${encodeURIComponent(token)}`;

  // In production, configure real SMTP creds
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: Number(process.env.SMTP_PORT || 1025),
    secure: false,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@marketup.app",
    to,
    subject: "Reset your MarketUp password",
    html: `
      <p>We received a request to reset your password.</p>
      <p><a href="${link}">Reset password</a> (valid for 1 hour)</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}


