const nodemailer = require('nodemailer');
require("dotenv").config();

console.log("Initializing Email Service...");

// Create a reusable transporter object using the default SMTP transport
// HARDCODED to Brevo (Port 2525) to ensure connection works
const smtpHost = 'smtp-relay.brevo.com';
const smtpPort = 2525;
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const senderEmail = process.env.EMAIL_USER || smtpUser; // The actual email address to show in "From"

console.log(`Configuring Email Service: Host=${smtpHost}, Port=${smtpPort}, User=${smtpUser}, Sender=${senderEmail}`);

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {
        user: smtpUser,
        pass: smtpPass
    },
    // Force IPv4 to avoid timeouts on some cloud providers
    family: 4,
    logger: true,
    debug: true,
    connectionTimeout: 10000
});

// Verify connection configuration - REMOVED to prevent startup timeouts on Render
// We will handle errors during the actual sending process.
console.log("Email Service initialized (Lazy verification)");

const sendVerificationEmail = async (to, link, isVendor = false) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("EMAIL_USER or EMAIL_PASS is not set. Emails will not be sent.");
        return;
    }

    const subject = isVendor ? 'Verify your vendor account' : 'Verify your 3AmShopp account';
    const title = isVendor ? 'Welcome to 3AmShopp Vendor Portal!' : 'Welcome to 3AmShopp!';

    const mailOptions = {
        from: `"3AmShopp Support" <${senderEmail}>`,
        to: to,
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
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', to);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

const sendApprovalEmail = async (to, name) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const loginLink = process.env.NODE_ENV === 'production'
        ? 'https://3amShoppme.netlify.app/vendor/login'
        : 'http://localhost:3000/vendor/login';

    const mailOptions = {
        from: `"3AmShopp Support" <${senderEmail}>`,
        to: to,
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
        await transporter.sendMail(mailOptions);
        console.log('Approval email sent to:', to);
    } catch (error) {
        console.error('Error sending approval email:', error);
    }
};

const sendPasswordResetEmail = async (to, link) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const mailOptions = {
        from: `"3AmShopp Support" <${smtpUser}>`,
        to: to,
        subject: 'Reset your 3AmShopp password',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested to reset your password. Click the link below to proceed:</p>
                <a href="${link}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p style="margin-top: 20px; color: #666;">This link will expire in 1 hour.</p>
                <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', to);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};

module.exports = { sendVerificationEmail, sendApprovalEmail, sendPasswordResetEmail };
