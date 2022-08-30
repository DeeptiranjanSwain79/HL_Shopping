const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    //Creating a fake email id for testing whether the email is going properly to the specified mail or not
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,        //Simple Mail Transfer Protocol
            pass: process.env.SMPT_PASSWORD,
        }
    })

    const mailOptions = {
        form: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;