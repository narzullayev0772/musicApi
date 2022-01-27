const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // define email options

  const mailOptions = {
    from: "WEBERS.UZ",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // actualy send to the email
  await transport.sendMail(mailOptions);
};
module.exports = sendEmail;
