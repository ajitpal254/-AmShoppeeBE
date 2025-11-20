const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
// Note: For production, use service account JSON file
// For now, using applicationDefault or environment variables
let firebaseAdmin;

try {
    // Check if already initialized
    if (!admin.apps.length) {
        // Option 1: Using service account file (recommended for production)
        // Uncomment and use this if you have a service account JSON file
        // const serviceAccount = require('./path-to-serviceAccountKey.json');
        // firebaseAdmin = admin.initializeApp({
        //   credential: admin.credential.cert(serviceAccount)
        // });

        // Option 2: Using default credentials or manual config
        // For development, we'll use a minimal setup
        // In production, you should use proper service account credentials

        if (process.env.FIREBASE_PROJECT_ID) {
            firebaseAdmin = admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: process.env.FIREBASE_PROJECT_ID
            });
        } else {
            console.warn('⚠️  Firebase Admin not fully configured. Google login may not work.');
            console.warn('Please set FIREBASE_PROJECT_ID in .env or provide service account credentials.');
            // Initialize with minimal config for basic functionality
            firebaseAdmin = admin.initializeApp();
        }

        console.log('✅ Firebase Admin initialized successfully');
    } else {
        firebaseAdmin = admin.app();
    }
} catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    console.warn('Google authentication will not be available.');
}

module.exports = { admin, firebaseAdmin };
