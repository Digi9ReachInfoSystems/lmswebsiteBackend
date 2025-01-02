const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

// From Digi9
const transporterAdmin = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "Info@gully2global.com",
    pass: "Shasudigi@217",
  },
});

const sendMailFunctionAdmin = async (email, sub, html) => {
  try {

    const mailOptions = {
      from: "Info@gully2global.com",
      to: "jayanthbychana@gmail.com",//email
      subject: sub,
      html: html,
    };

    await transporterAdmin.sendMail(mailOptions);

    return {
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error
  }
};

// From Toppers Academy
const transporterTA = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "Info@gully2global.com",
    pass: "Shasudigi@217",
  },
});

const sendMailFunctionTA = async (email, sub, html) => {
  try {

    const mailOptions = {
      from: "Info@gully2global.com",
      to: email,
      subject: sub,
      html: html,
    };

    await transporterTA.sendMail(mailOptions);

    return {
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error
  }
};

module.exports = {
  sendMailFunctionAdmin,
  sendMailFunctionTA,
};