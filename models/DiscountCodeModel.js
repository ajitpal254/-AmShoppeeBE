const mongoose = require('mongoose');

const discountCodeSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: false
    },
    maxUses: {
        type: Number,
        required: false
    },
    currentUses: {
        type: Number,
        default: 0
    },
    minPurchaseAmount: {
        type: Number,
        required: false,
        default: 0
    },
    applicableCategories: [{
        type: String
    }],
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        refPath: 'createdByModel'
    },
    createdByModel: {
        type: String,
        required: false,
        enum: ['Vendor', 'User']
    }
}, { timestamps: true });

// Method to check if discount code is valid
discountCodeSchema.methods.isValid = function () {
    const now = new Date();

    // Check if active
    if (!this.isActive) return false;

    // Check date range
    if (this.startDate && now < this.startDate) return false;
    if (this.endDate && now > this.endDate) return false;

    // Check max uses
    if (this.maxUses && this.currentUses >= this.maxUses) return false;

    return true;
};

const DiscountCode = mongoose.model('DiscountCode', discountCodeSchema);

module.exports = DiscountCode;
