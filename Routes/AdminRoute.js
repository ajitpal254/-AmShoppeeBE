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

module.exports = adminRouter;
