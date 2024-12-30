const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: "Info@gully2global.com",
      pass: "Shasudigi@217",
    },
  });

  
  export const sendMailFunction = async ( email, sub ,html) => {
    try {
  
      const mailOptions = {
        from: "Info@gully2global.com",
        to: email,
        subject: sub, 
        html: html,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Email sent successfully" }); 
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Server error" });
    }
  };