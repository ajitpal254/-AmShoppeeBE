const Product = require('../models/ProductModel');
const Vendor = require('../models/VendorModel');
const asyncHandler = require('express-async-handler');

// @route   GET /api/vendor/products
// @desc    Get all products created by the logged-in vendor
// @access  Private (Vendor)
const getVendorProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ createdBy: req.vendor._id })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

    res.json({
        count: products.length,
        products,
    });
});

// @route   GET /api/vendor/:vendorId/products
// @desc    Get all products by a specific vendor (public)
// @access  Public
const getProductsByVendorId = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.params.vendorId).select('name email');

    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    const products = await Product.find({ createdBy: req.params.vendorId })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

    res.json({
        vendor: {
            _id: vendor._id,
            name: vendor.name,
        },
        count: products.length,
        products,
    });
});

// @route   GET /api/vendor/stats
// @desc    Get vendor dashboard statistics
// @access  Private (Vendor)
const getVendorStats = asyncHandler(async (req, res) => {
    const products = await Product.find({ createdBy: req.vendor._id });

    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, product) => {
        return sum + (product.price * product.countInStock);
    }, 0);

    const outOfStock = products.filter(p => p.countInStock === 0).length;
    const lowStock = products.filter(p => p.countInStock > 0 && p.countInStock < 10).length;

    const totalViews = products.reduce((sum, product) => {
        return sum + (product.numberOfViews || 0);
    }, 0);

    res.json({
        totalProducts,
        totalStockValue: totalStockValue.toFixed(2),
        outOfStock,
        lowStock,
        totalViews,
        products: products.slice(0, 5), // Return latest 5 products
    });
});

// @route   POST /api/vendor/products
// @desc    Create a new product (vendor)
// @access  Private (Vendor)
const createVendorProduct = asyncHandler(async (req, res) => {
    const { name, image, images, brand, category, description, price, countInStock } = req.body;

    if (!name || !image || !brand || !category || !description || !price || countInStock === undefined) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Extract imageUrl strings from images array if they are objects
    let processedImages = [];
    if (images && Array.isArray(images)) {
        processedImages = images.map(img => {
            // If it's an object with imageUrl property, extract the URL
            if (typeof img === 'object' && img.imageUrl) {
                return img.imageUrl;
            }
            // If it's already a string, use it as is
            return img;
        }).filter(url => url); // Filter out any null/undefined values
    }

    const product = new Product({
        name,
        image,
        images: processedImages,
        brand,
        category,
        description,
        price,
        countInStock,
        createdBy: req.vendor._id,
        createdByName: req.vendor.name,
        rating: 0,
        numberOfViews: 0,
    });

    const createdProduct = await product.save();

    res.status(201).json({
        message: 'Product created successfully',
        product: createdProduct,
    });
});

// @route   PUT /api/vendor/products/:id
// @desc    Update a product (vendor can only update their own)
// @access  Private (Vendor)
const updateVendorProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Check if vendor owns this product
    if (product.createdBy.toString() !== req.vendor._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Process images array if provided
    let processedImages = product.images;
    if (req.body.images !== undefined) {
        if (Array.isArray(req.body.images)) {
            processedImages = req.body.images.map(img => {
                // If it's an object with imageUrl property, extract the URL
                if (typeof img === 'object' && img.imageUrl) {
                    return img.imageUrl;
                }
                // If it's already a string, use it as is
                return img;
            }).filter(url => url); // Filter out any null/undefined values
        } else {
            processedImages = [];
        }
    }

    // Update fields
    product.name = req.body.name || product.name;
    product.image = req.body.image || product.image;
    product.images = processedImages;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.price = req.body.price !== undefined ? req.body.price : product.price;
    product.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : product.countInStock;

    const updatedProduct = await product.save();

    res.json({
        message: 'Product updated successfully',
        product: updatedProduct,
    });
});

// @route   DELETE /api/vendor/products/:id
// @desc    Delete a product (vendor can only delete their own)
// @access  Private (Vendor)
const deleteVendorProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Check if vendor owns this product
    if (product.createdBy.toString() !== req.vendor._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });
});

module.exports = {
    getVendorProducts,
    getProductsByVendorId,
    getVendorStats,
    createVendorProduct,
    updateVendorProduct,
    deleteVendorProduct
};
