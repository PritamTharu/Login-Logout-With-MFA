const nodemailer = require('nodemailer');
const userRegisterdMailStruct = require('../utils/userRegisteredMail')
require('dotenv').config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});
const sendEmail = async(email,url) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        html: userRegisterdMailStruct(email),
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

module.exports = sendEmail;
