// utils/sendVerificationEmail.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Store in .env

const sendVerificationEmail = async (to, link, isVendor = false) => {
    const subject = isVendor ? 'Verify your vendor account' : 'Verify your 3AmShopp account';
    const title = isVendor ? 'Welcome to 3AmShopp Vendor Portal!' : 'Welcome to 3AmShopp!';

    const msg = {
        to,
        from: 'testingpurposeap@gmail.com',
        subject: subject,
        html: `
            <h2>${title}</h2>
            <p>Please verify your account by clicking the link below:</p>
            <a href="${link}">Verify Account</a>
            <p>This link will expire in 24 hours.</p>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Verification email sent to:', to);
    } catch (error) {
        // Don't try to log the full error object - it has circular references
        console.error('Error sending email:', error.message || 'Unknown error');
        // Email failure shouldn't crash the app
    }
};

module.exports = sendVerificationEmail;
