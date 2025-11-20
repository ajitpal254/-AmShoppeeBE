const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    address: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    postalCode: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    preferences: {
        type: Map,
        of: String,
        default: {}
    }
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
