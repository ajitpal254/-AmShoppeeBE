const sgMail = require('@sendgrid/mail');
require("dotenv").config();

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
    console.warn("SENDGRID_API_KEY is not set. Emails will not be sent.");
}

const sendVerificationEmail = async (to, link, isVendor = false) => {
    if (!process.env.SENDGRID_API_KEY) return;

    const subject = isVendor ? 'Verify your vendor account' : 'Verify your 3AmShopp account';
    const title = isVendor ? 'Welcome to 3AmShopp Vendor Portal!' : 'Welcome to 3AmShopp!';

    const msg = {
        to,
        from: 'testingpurposeap@gmail.com', // Ensure this sender is verified in SendGrid
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">${title}</h2>
                <p>Please verify your account by clicking the link below:</p>
                <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Account</a>
                <p style="margin-top: 20px; color: #666;">This link will expire in 24 hours.</p>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Verification email sent to:', to);
    } catch (error) {
        console.error('Error sending verification email:', error.response ? error.response.body : error.message);
    }
};

const sendApprovalEmail = async (to, name) => {
    if (!process.env.SENDGRID_API_KEY) return;

    const loginLink = process.env.NODE_ENV === 'production'
        ? 'https://3amShoppme.netlify.app/vendor/login'
        : 'http://localhost:3000/vendor/login';

    const msg = {
        to,
        from: 'testingpurposeap@gmail.com',
        subject: 'Your Vendor Account is Approved!',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Congratulations, ${name}!</h2>
                <p>Your vendor account has been approved by the admin.</p>
                <p>You can now log in to your dashboard and start selling.</p>
                <a href="${loginLink}" style="background-color: #008CBA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Vendor Dashboard</a>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Approval email sent to:', to);
    } catch (error) {
        console.error('Error sending approval email:', error.response ? error.response.body : error.message);
    }
};

module.exports = { sendVerificationEmail, sendApprovalEmail };
