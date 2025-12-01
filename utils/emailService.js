const nodemailer = require('nodemailer');
require("dotenv").config();

console.log("Initializing Email Service...");

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your App Password (not your login password)
    },
    // Force IPv4 to avoid timeouts on some cloud providers (Render/AWS)
    family: 4,
    // Add timeouts and logging for debugging
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 15000,
    socketTimeout: 30000,
    logger: true,
    debug: true
});

// Verify connection configuration
console.log("Verifying Email Service connection...");
transporter.verify(function (error, success) {
    if (error) {
        console.log("Email Service Error:", error);
    } else {
        console.log("Email Service is ready to take our messages");
    }
});

const sendVerificationEmail = async (to, link, isVendor = false) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("EMAIL_USER or EMAIL_PASS is not set. Emails will not be sent.");
        return;
    }

    const subject = isVendor ? 'Verify your vendor account' : 'Verify your 3AmShopp account';
    const title = isVendor ? 'Welcome to 3AmShopp Vendor Portal!' : 'Welcome to 3AmShopp!';

    const mailOptions = {
        from: `"3AmShopp Support" <${process.env.EMAIL_USER}>`,
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
        from: `"3AmShopp Support" <${process.env.EMAIL_USER}>`,
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
        from: `"3AmShopp Support" <${process.env.EMAIL_USER}>`,
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
