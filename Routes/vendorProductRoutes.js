const express = require('express');
const router = express.Router();
const { protectVendor } = require('../middleware/authMiddleware');
const {
    getVendorProducts,
    getProductsByVendorId,
    getVendorStats,
    createVendorProduct,
    updateVendorProduct,
    deleteVendorProduct
} = require('../controllers/vendorProductController');

// @route   GET /api/vendor/products
// @desc    Get all products created by the logged-in vendor
// @access  Private (Vendor)
router.get('/products', protectVendor, getVendorProducts);

// @route   GET /api/vendor/:vendorId/products
// @desc    Get all products by a specific vendor (public)
// @access  Public
router.get('/:vendorId/products', getProductsByVendorId);

// @route   GET /api/vendor/stats
// @desc    Get vendor dashboard statistics
// @access  Private (Vendor)
router.get('/stats', protectVendor, getVendorStats);

// @route   POST /api/vendor/products
// @desc    Create a new product (vendor)
// @access  Private (Vendor)
router.post('/products', protectVendor, createVendorProduct);

// @route   PUT /api/vendor/products/:id
// @desc    Update a product (vendor can only update their own)
// @access  Private (Vendor)
router.put('/products/:id', protectVendor, updateVendorProduct);

// @route   DELETE /api/vendor/products/:id
// @desc    Delete a product (vendor can only delete their own)
// @access  Private (Vendor)
router.delete('/products/:id', protectVendor, deleteVendorProduct);

module.exports = router;
