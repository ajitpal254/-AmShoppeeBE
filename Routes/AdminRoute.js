const express = require('express');
const adminRouter = express.Router();
const { protectVendor } = require('../middleware/vendorAuth');
const { protect, admin } = require('../middleware/authMiddleware');
const {
    uploadProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProductDiscount,
    getVendorProducts,
    deleteVendorProduct,
    uploadVendorProduct,
    updateVendorProductDiscount,
    getVendorOrders,
    updateVendorOrderStatus,
    updateVendorOrderPayStatus
} = require('../controllers/productController');

// Upload Product
adminRouter.post('/admin/upload', protect, admin, uploadProduct);

// Get All Products
adminRouter.get('/admin/delete', protect, admin, getAllProducts);

// Get Single Product by ID
adminRouter.get('/admin/delete/:id', protect, admin, getProductById);

// DELETE Product by ID
adminRouter.delete('/admin/delete/:id', protect, admin, deleteProduct);

// Update Product Discount (Admin)
adminRouter.put('/admin/products/:id/discount', protect, admin, updateProductDiscount);

// VENDOR ROUTES

// Get vendor's products only
adminRouter.get('/vendor/products', protectVendor, getVendorProducts);

// Delete vendor's own product
adminRouter.delete('/vendor/delete/:id', protectVendor, deleteVendorProduct);

// Upload product with vendor ID
adminRouter.post('/vendor/upload', protectVendor, uploadVendorProduct);

// Update Product Discount (Vendor)
adminRouter.put('/vendor/products/:id/discount', protectVendor, updateVendorProductDiscount);

// Get vendor's orders (orders containing vendor's products)
adminRouter.get('/vendor/orders', protectVendor, getVendorOrders);

// Update order status to delivered (Vendor)
adminRouter.put('/vendor/orders/:id/deliver', protectVendor, updateVendorOrderStatus);

// Update order status to paid (Vendor)
adminRouter.put('/vendor/orders/:id/pay', protectVendor, updateVendorOrderPayStatus);

module.exports = adminRouter;
