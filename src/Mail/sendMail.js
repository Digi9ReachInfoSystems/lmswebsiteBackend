const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const { getInvoice, getInvoicePDF } = require("../controllers/invoiceController");

// From Digi9
// const transporterAdmin = nodemailer.createTransport({
//   host: "smtp.hostinger.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "Info@gully2global.com",
//     pass: "Shasudigi@217",
//   },
// });
const transporterAdmin = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "info@thetopperacademy.com",
    pass: "Mousumeeray1!",
  },
});

const sendMailFunctionAdmin = async (email, sub, html, pdfPath = "") => {
  try {

    const mailOptions = {
      from: "info@thetopperacademy.com",
      to: email,//email
      subject: sub,
      html: html,
    };
    // Check if the pdfPath is provided and valid
    if (pdfPath) {
      mailOptions.attachments = [
        {
          filename: "Invoice.pdf",
          content: pdfPath, // Buffer can be used directly
          encoding: 'base64',
          contentType: "application/pdf",
        },
      ];
    }


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
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "info@thetopperacademy.com",
    pass: "Mousumeeray1!",
  },
});

const sendMailFunctionTA = async (email, sub, html, pdfPath = "") => {
  try {
    //  const pdfPath1 = await getInvoicePDF("67812e52cb1d90e19f16f422")
    //  console.log(pdfPath1);
    const mailOptions = {
      from: "info@thetopperacademy.com",
      to: email,
      subject: sub,
      html: html,
    };
    // Check if the pdfPath is provided and valid
    if (pdfPath) {
      mailOptions.attachments = [
        {
          filename: "Invoice.pdf",
          content: pdfPath, // Buffer can be used directly
          encoding: 'base64',
          contentType: "application/pdf",
        },
      ];
    }

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