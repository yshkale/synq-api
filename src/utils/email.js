const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Synq <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === "dev") {
      return "sent";
    }

    send(template, subject);
  }
};

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({});

  const mailOptions = {
    from: `Synq <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
};

module.exports = sendEmail;
