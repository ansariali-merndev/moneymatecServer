import nodemailer from "nodemailer";
import { env } from "../lib/env.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.gmailId,
    pass: env.gmailPass,
  },
});

export const sendMail = async (email, name, otp) => {
  await transport.sendMail({
    from: env.gmailId,
    to: email,
    subject: "OTP Verification by MoneyMate",
    text: `Hello ${name}
    
    We received a request to verify your email address. 
    Please use the following One-Time Password (OTP) to proceed:

    Your OTP is: ${otp}

    This OTP is valid for the next 10 minutes.  
    If you did not request this, you can safely ignore this email.

    Best regards,
    Team MoneyMate
    `,
  });
};
