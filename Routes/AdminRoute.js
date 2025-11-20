const express = require('express');
const adminRouter = express.Router();

const Product = require('../models/ProductModel');
const asyncHandler = require('express-async-handler');

// Upload Product
adminRouter.post('/admin/upload', asyncHandler(async (req, res) => {
    const imgUpload = new Product({
        image: req.body.image,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        rating: req.body.rating,
        brand: req.body.brand,
        countInStock: req.body.countInStock,
        category: req.body.category
    });

    const savedProduct = await imgUpload.save();
    res.status(201).json(savedProduct);
}));

// Get All Products
adminRouter.get('/admin/delete', asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
}));

// Get Single Product by ID
adminRouter.get('/admin/delete/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        if (req.user && req.user.isAdmin) {
            res.json(product);
        } else if (req.user && product.createdBy && product.createdBy.toString() === req.user._id.toString()) {
            res.json(product);
        } else {
            res.status(403).json({ message: "Not authorized" });
        }
    } else {
        res.status(404).json({ message: "Product not found" });
    }
}));

// DELETE Product by ID
adminRouter.delete('/admin/delete/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        if (req.user && (req.user.isAdmin || (product.createdBy && product.createdBy.toString() === req.user._id.toString()))) {
            await Product.findByIdAndDelete(req.params.id);  // Safe deletion
            res.status(200).json({ message: "Product deleted successfully" });
        } else {
            res.status(403).json({ message: "Not authorized to delete this product" });
        }
    } else {
        res.status(404).json({ message: "Product not found" });
    }
}));

// Update Product Discount (Admin)
adminRouter.put('/admin/products/:id/discount', asyncHandler(async (req, res) => {
    const { discountPercentage, isOnDiscount } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.discountPercentage = discountPercentage;
    product.isOnDiscount = isOnDiscount;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
}));

// VENDOR ROUTES
const { protectVendor } = require('../middleware/vendorAuth');

// Get vendor's products only
adminRouter.get('/vendor/products', protectVendor, asyncHandler(async (req, res) => {
    const products = await Product.find({ createdBy: req.vendor.id });
    res.json(products);
}));

// Delete vendor's own product
adminRouter.delete('/vendor/delete/:id', protectVendor, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        if (product.createdBy && product.createdBy.toString() === req.vendor.id) {
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Product deleted successfully" });
        } else {
            res.status(403).json({ message: "Not authorized to delete this product" });
        }
    } else {
        res.status(404).json({ message: "Product not found" });
    }
}));

// Upload product with vendor ID
adminRouter.post('/vendor/upload', protectVendor, asyncHandler(async (req, res) => {
    const imgUpload = new Product({
        image: req.body.image,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        rating: req.body.rating,
        brand: req.body.brand,
        countInStock: req.body.countInStock,
        category: req.body.category,
        createdBy: req.vendor.id,
        createdByModel: 'Vendor'
    });

    const savedProduct = await imgUpload.save();
    res.status(201).json(savedProduct);
}));

// Update Product Discount (Vendor)
adminRouter.put('/vendor/products/:id/discount', protectVendor, asyncHandler(async (req, res) => {
    const { discountPercentage, isOnDiscount } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (product.createdBy.toString() !== req.vendor.id) {
        return res.status(403).json({ message: "Not authorized to update this product" });
    }

    product.discountPercentage = discountPercentage;
    product.isOnDiscount = isOnDiscount;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
}));

// Get vendor's orders (orders containing vendor's products)
const Order = require('../models/OrderModel');
adminRouter.get('/vendor/orders', protectVendor, asyncHandler(async (req, res) => {
    // Get all vendor's products
    const vendorProducts = await Product.find({ createdBy: req.vendor.id }).select('_id');
    const productIds = vendorProducts.map(p => p._id.toString());

    // Find orders containing any of vendor's products
    const orders = await Order.find({
        'orderItems.Product': { $in: productIds.map(id => require('mongoose').Types.ObjectId(id)) }
    }).sort({ createdAt: -1 });

    res.json(orders);
}));

module.exports = adminRouter;

