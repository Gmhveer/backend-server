const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { EMAIL_CONFIGS } = require('../configs/utlis');
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
    };
    if (!to) return { success: false, result: null, error: 'Sending mail address is missing!' };
    const templatePath = path.join(__dirname, `/emailTemplate/${emailType.template}.html`);
    console.log(templatePath, '${result.address.city}');

    let html = fs.readFileSync(templatePath, 'utf8');

    // Simple variable replacement (you can use a templating engine for more features)
    Object.keys(mailData).forEach(key => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), mailData[key]);
    });
    mailOptions.html = html;
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', to, emailType.subject, info.messageId, new Date());
        return { success: true, result: info, error: null }; //success
    } catch (error) {
        console.error('Error sending email:', to, emailType.subject, error);
        return { success: false, result: null, error }//fail
    }
}

module.exports = { sendMail }