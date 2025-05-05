const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { EMAIL_CONFIGS } = require('../helper/utlis');
const { error } = require('console');
const transporter = nodemailer.createTransport({
    service: EMAIL_CONFIGS.service,
    auth: {
        user: EMAIL_CONFIGS.user,
        pass: EMAIL_CONFIGS.password, // Use an App Password
    }
})

const sendMail = async (to, emailType, mailData) => {
    const mailOptions = {
        from: EMAIL_CONFIGS.user,
        to: to,
        subject: emailType.subject || '',
        html,
    };
    if (!to) return { success: false, result: null, error: 'To address is missing!' };
    const templatePath = path.join(__dirname, `${emailType.template}.html`);
    let html = fs.readFileSync(templatePath, 'utf8');

    // Simple variable replacement (you can use a templating engine for more features)
    Object.keys(mailData).forEach(key => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), mailData[key]);
    });

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, result: info, error: null }; //success
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, result: null, error }//fail
    }
}

module.exports = {sendMail}