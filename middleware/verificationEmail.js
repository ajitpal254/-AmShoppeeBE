// utils/sendVerificationEmail.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Store in .env

const sendVerificationEmail = async (to, link) => {
    const msg = {
        to,
        from: 'testingpurposeap@gmail.com',
        subject: 'Verify your vendor account',
        html: `
            <h2>Welcome to 3AmShopp!</h2>
            <p>Please verify your account by clicking the link below:</p>
            <a href="${link}">Verify Account</a>
            <p>This link will expire in 24 hours.</p>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Verification email sent to:', to);
    } catch (error) {
        console.error('Error sending email:', error.response?.body || error.message);
    }
};

module.exports = sendVerificationEmail;
