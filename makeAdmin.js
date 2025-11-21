const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

const makeAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Find user by email
        const adminEmail = 'ajitpal353@gmail.com';
        const user = await User.findOne({ email: adminEmail });

        if (!user) {
            console.log(`User with email ${adminEmail} not found.`);
            process.exit(1);
        }

        // Update user to admin
        user.isAdmin = true;
        user.role = 'admin';
        await user.save();

        console.log(`Successfully made ${adminEmail} an admin!`);
        console.log('User details:', {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role
        });

        process.exit(0);
    } catch (error) {
        console.error('Error making user admin:', error);
        process.exit(1);
    }
};

makeAdmin();
