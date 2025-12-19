import nodemailer from "nodemailer"
import dotenv from 'dotenv';
dotenv.config();

// config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
});

// send email function

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  
  console.log(process.env.EMAIL_ADDRESS as string)
  console.log(process.env.EMAIL_PASSWORD as string)
  
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email templates

export const verificationEmailTemplate = (code: string): string => {
  return `
    <h2>Verify your email</h2>
    <p>Your verification code is <b>${code}</b></p>
    <p>Enter this code to verify your email address.</p>
  `;
};

export const welcomeEmailTemplate = (username: string): string => {
  return `
    <h2>Welcome, ${username}!</h2>
    <p>Thank you for registering with us. We’re excited to have you onboard.</p>
  `;
};

export const resetPasswordEmailTemplate = (resetLink: string): string => {
  return `
    <h2>Reset your password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;
};
