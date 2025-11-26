const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const connectDB = require('./config/db');
require('colors');

dotenv.config();
connectDB();

const checkUsers = async () => {
    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) [Admin: ${u.isAdmin}] [ID: ${u._id}]`);
        });
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
