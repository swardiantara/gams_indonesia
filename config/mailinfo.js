const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    // service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_INFO_UNAME,
        pass: process.env.MAIL_INFO_PASS,
    },
});

module.exports = transporter;
