import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

//otp for password reset
export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset your password",
    html: `<p>Your OTP for password reset is <b>${otp}. It expires in 5 minutes.</b></p>`,
  });
};

//otp for confirm delivery
export const sendDeliveryOtpMail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Delivery OTP",
    html: `<p>Your OTP for delivery is <b>${otp}. It expires in 5 minutes.</b></p>`,
  });
};
