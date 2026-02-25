import nodemailer from "nodemailer";
import "dotenv/config";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const verifyEmail = async (token, email) => {
  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const verifyLink = `${FRONTEND_URL.replace(/\/$/, "")}/verify/${token}`;

  const mailDetails = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
      <p>Hi there, thanks for signing up.</p>
      <p>Please click the link below to verify your email:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `,
  };

  await mailTransporter.sendMail(mailDetails);
};



