const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('./../models/user')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')

router.post(
    '/signup',
    asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    })
);

router.get('/test', (req, res) => {
    res.send('Test Route');
});

router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        console.log(`Searching for ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 400, message: 'no_user' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.status(200).json({ status: 200, message: 'ok' });
        } else {
            res.status(400).json({ status: 400, message: 'fail' });
        }
    })
);





module.exports = router;
