const express = require('express');
const router = express.Router();
const DiscountCode = require('../models/DiscountCodeModel');
const asyncHandler = require('express-async-handler');
const { protectVendor } = require('../middleware/vendorAuth');
const { protect } = require('../middleware/jwtauth');

// @route   POST /api/discount/validate
// @desc    Validate a discount code
// @access  Public
router.post('/validate', asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Please provide a coupon code' });
    }

    const discountCode = await DiscountCode.findOne({
        code: code.toUpperCase()
    });

    if (!discountCode) {
        return res.status(404).json({ message: 'Invalid coupon code' });
    }

    // Validate if discount is still valid
    if (!discountCode.isValid()) {
        return res.status(400).json({ message: 'This coupon code has expired or is no longer valid' });
    }

    res.json({
        code: discountCode.code,
        discountType: discountCode.discountType,
        discountValue: discountCode.discountValue,
        description: discountCode.description,
        minPurchaseAmount: discountCode.minPurchaseAmount
    });
}));

// @route   POST /api/discount/apply
// @desc    Apply a discount code to an order (increment usage)
// @access  Public
router.post('/apply', asyncHandler(async (req, res) => {
    const { code } = req.body;

    const discountCode = await DiscountCode.findOne({
        code: code.toUpperCase()
    });

    if (!discountCode) {
        return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!discountCode.isValid()) {
        return res.status(400).json({ message: 'This coupon code has expired or is no longer valid' });
    }

    // Increment usage
    discountCode.currentUses += 1;
    await discountCode.save();

    res.json({
        message: 'Discount applied successfully',
        code: discountCode.code,
        discountType: discountCode.discountType,
        discountValue: discountCode.discountValue
    });
}));

// @route   POST /api/discount/create
// @desc    Create a new discount code (admin)
// @access  Private (Admin)
router.post('/create', protect, asyncHandler(async (req, res) => {
    const {
        code,
        discountType,
        discountValue,
        description,
        startDate,
        endDate,
        maxUses,
        minPurchaseAmount,
        applicableCategories,
        applicableProducts
    } = req.body;

    if (!code || !discountType || !discountValue) {
        return res.status(400).json({ message: 'Please provide code, discount type, and discount value' });
    }

    // Check if code already exists
    const existingCode = await DiscountCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
        return res.status(400).json({ message: 'This coupon code already exists' });
    }

    const discountCode = new DiscountCode({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        description,
        startDate,
        endDate,
        maxUses,
        minPurchaseAmount,
        applicableCategories,
        applicableProducts,
        createdBy: req.user.id,
        createdByModel: 'User'
    });

    const createdCode = await discountCode.save();

    res.status(201).json({
        message: 'Discount code created successfully',
        discountCode: createdCode
    });
}));

// @route   POST /api/discount/vendor/create
// @desc    Create a new discount code (vendor)
// @access  Private (Vendor)
router.post('/vendor/create', protectVendor, asyncHandler(async (req, res) => {
    const {
        code,
        discountType,
        discountValue,
        description,
        startDate,
        endDate,
        maxUses,
        minPurchaseAmount,
        applicableCategories,
        applicableProducts
    } = req.body;

    if (!code || !discountType || !discountValue) {
        return res.status(400).json({ message: 'Please provide code, discount type, and discount value' });
    }

    // Check if code already exists
    const existingCode = await DiscountCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
        return res.status(400).json({ message: 'This coupon code already exists' });
    }

    const discountCode = new DiscountCode({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        description,
        startDate,
        endDate,
        maxUses,
        minPurchaseAmount,
        applicableCategories,
        applicableProducts,
        createdBy: req.vendor._id,
        createdByModel: 'Vendor'
    });

    const createdCode = await discountCode.save();

    res.status(201).json({
        message: 'Discount code created successfully',
        discountCode: createdCode
    });
}));

// @route   GET /api/discount/vendor/my-coupons
// @desc    Get all coupons created by vendor
// @access  Private (Vendor)
router.get('/vendor/my-coupons', protectVendor, asyncHandler(async (req, res) => {
    const discountCodes = await DiscountCode.find({
        createdBy: req.vendor._id,
        createdByModel: 'Vendor'
    }).sort({ createdAt: -1 });

    res.json(discountCodes);
}));

// @route   GET /api/discount/all
// @desc    Get all discount codes
// @access  Private (Admin)
router.get('/all', protect, asyncHandler(async (req, res) => {
    const discountCodes = await DiscountCode.find({}).sort({ createdAt: -1 });
    res.json(discountCodes);
}));

// @route   DELETE /api/discount/:id
// @desc    Delete a discount code
// @access  Private (Admin)
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const discountCode = await DiscountCode.findById(req.params.id);

    if (!discountCode) {
        return res.status(404).json({ message: 'Discount code not found' });
    }

    await discountCode.deleteOne();
    res.json({ message: 'Discount code deleted successfully' });
}));

// @route   DELETE /api/discount/vendor/:id
// @desc    Delete a discount code (vendor can only delete their own)
// @access  Private (Vendor)
router.delete('/vendor/:id', protectVendor, asyncHandler(async (req, res) => {
    const discountCode = await DiscountCode.findById(req.params.id);

    if (!discountCode) {
        return res.status(404).json({ message: 'Discount code not found' });
    }

    // Check if vendor owns this coupon
    if (discountCode.createdBy.toString() !== req.vendor._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this coupon' });
    }

    await discountCode.deleteOne();
    res.json({ message: 'Discount code deleted successfully' });
}));

module.exports = router;
