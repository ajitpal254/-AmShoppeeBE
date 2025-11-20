// Quick diagnostic check for Firebase Admin configuration
require('dotenv').config();

console.log('\n========================================');
console.log('🔍 FIREBASE CONFIGURATION CHECK');
console.log('========================================\n');

// Check environment variables
console.log('1️⃣  Environment Variables:');
console.log('   FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || '❌ NOT SET');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ SET' : '❌ NOT SET');
console.log('');

// Try to initialize Firebase Admin
console.log('2️⃣  Firebase Admin SDK Test:');
try {
    const { admin } = require('./config/firebaseAdmin');
    console.log('   ✅ Firebase Admin initialized successfully');
    console.log('   Project ID:', admin.app().options.projectId || 'Not configured');
} catch (error) {
    console.log('   ❌ Firebase Admin initialization failed');
    console.log('   Error:', error.message);
}
console.log('');

// Summary
console.log('========================================');
console.log('📋 SUMMARY');
console.log('========================================');

if (!process.env.FIREBASE_PROJECT_ID) {
    console.log('❌ ACTION REQUIRED:');
    console.log('   Add this line to your .env file:');
    console.log('   FIREBASE_PROJECT_ID=loginfirebase234');
    console.log('');
} else {
    console.log('✅ Environment variables configured');
    console.log('');
}

console.log('Next steps:');
console.log('1. Make sure .env has FIREBASE_PROJECT_ID=loginfirebase234');
console.log('2. Restart backend server after adding env variable');
console.log('3. Enable Google sign-in in Firebase Console');
console.log('4. Test Google login again');
console.log('');
