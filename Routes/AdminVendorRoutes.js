const express = require('express');
const router = express.Router();
const Vendor = require('../models/VendorModel');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { sendApprovalEmail } = require('../utils/emailService');

// Middleware to protect admin routes
const protectAdmin = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user || !req.user.isAdmin) {
                return res.status(403).json({ message: 'Not authorized as admin' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

// GET all pending vendors (Admin only)
router.get('/admin/vendors/pending', protectAdmin, asyncHandler(async (req, res) => {
    const pendingVendors = await Vendor.find({ approvalStatus: 'pending' })
        .select('-password')
        .sort({ createdAt: -1 });

    res.json(pendingVendors);
}));

// GET all vendors (Admin only)
router.get('/admin/vendors', protectAdmin, asyncHandler(async (req, res) => {
    const { status } = req.query;

    let filter = {};
    if (status) {
        filter.approvalStatus = status;
    }

    const vendors = await Vendor.find(filter)
        .select('-password')
        .populate('approvedBy', 'name email')
        .sort({ createdAt: -1 });

    res.json(vendors);
}));

// GET single vendor details (Admin only)
router.get('/admin/vendors/:id', protectAdmin, asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.id)
        .select('-password')
        .populate('approvedBy', 'name email');

    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
}));

// APPROVE vendor (Admin only)
router.put('/admin/vendors/:id/approve', protectAdmin, asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    if (vendor.approvalStatus === 'approved') {
        return res.status(400).json({ message: 'Vendor already approved' });
    }

    vendor.approvalStatus = 'approved';
    vendor.approvedBy = req.user._id;
    vendor.approvedAt = Date.now();
    vendor.rejectionReason = null;

    await vendor.save();

    // Send approval email
    await sendApprovalEmail(vendor.email, vendor.name);

    res.json({
        message: 'Vendor approved successfully',
        vendor: {
            _id: vendor._id,
            name: vendor.name,
            email: vendor.email,
            businessCategory: vendor.businessCategory,
            approvalStatus: vendor.approvalStatus,
            approvedAt: vendor.approvedAt
        }
    });
}));

// REJECT vendor (Admin only)
router.put('/admin/vendors/:id/reject', protectAdmin, asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    if (vendor.approvalStatus === 'rejected') {
        return res.status(400).json({ message: 'Vendor already rejected' });
    }

    vendor.approvalStatus = 'rejected';
    vendor.rejectionReason = reason || 'No reason provided';
    vendor.approvedBy = req.user._id;
    vendor.approvedAt = Date.now();

    await vendor.save();

    res.json({
        message: 'Vendor rejected',
        vendor: {
            _id: vendor._id,
            name: vendor.name,
            email: vendor.email,
            approvalStatus: vendor.approvalStatus,
            rejectionReason: vendor.rejectionReason
        }
    });
}));

// DELETE vendor (Admin only)
router.delete('/admin/vendors/:id', protectAdmin, asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    await Vendor.findByIdAndDelete(req.params.id);

    res.json({ message: 'Vendor deleted successfully' });
}));

// Get vendor statistics (Admin only)
router.get('/admin/vendors/stats/overview', protectAdmin, asyncHandler(async (req, res) => {
    const totalVendors = await Vendor.countDocuments();
    const pendingVendors = await Vendor.countDocuments({ approvalStatus: 'pending' });
    const approvedVendors = await Vendor.countDocuments({ approvalStatus: 'approved' });
    const rejectedVendors = await Vendor.countDocuments({ approvalStatus: 'rejected' });

    res.json({
        total: totalVendors,
        pending: pendingVendors,
        approved: approvedVendors,
        rejected: rejectedVendors
    });
}));

module.exports = router;
