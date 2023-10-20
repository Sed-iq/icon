import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "icon1notification@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
  port: 465,
  host: "smtp.gmail.com",
  secure: true,
});

export default transporter;
