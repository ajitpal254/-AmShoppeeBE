const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');

// @desc    Upload Product
// @route   POST /admin/upload
// @access  Admin
const uploadProduct = asyncHandler(async (req, res) => {
    // Extract imageUrl strings from images array if they are objects
    let processedImages = [];
    if (req.body.images) {
        // Handle both array and single object cases
        const imagesArray = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        
        processedImages = imagesArray.map(img => {
            // If it's an object with imageUrl property, extract the URL
            if (typeof img === 'object' && img.imageUrl) {
                return img.imageUrl;
            }
            // If it's already a string, use it as is
            return img;
        }).filter(url => url); // Filter out any null/undefined values
    }

    const imgUpload = new Product({
        image: req.body.image,
        images: processedImages,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        rating: req.body.rating || 0,
        brand: req.body.brand,
        countInStock: req.body.countInStock,
        category: req.body.category
    });

    const savedProduct = await imgUpload.save();
    res.status(201).json(savedProduct);
});

// @desc    Get All Products
// @route   GET /admin/delete
// @access  Admin
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Get Single Product by ID
// @route   GET /admin/delete/:id
// @access  Admin/Vendor
const getProductById = asyncHandler(async (req, res) => {
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
});

// @desc    Delete Product by ID
// @route   DELETE /admin/delete/:id
// @access  Admin/Vendor
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        if (req.user && (req.user.isAdmin || (product.createdBy && product.createdBy.toString() === req.user._id.toString()))) {
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Product deleted successfully" });
        } else {
            res.status(403).json({ message: "Not authorized to delete this product" });
        }
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

// @desc    Update Product Discount (Admin)
// @route   PUT /admin/products/:id/discount
// @access  Admin
const updateProductDiscount = asyncHandler(async (req, res) => {
    const { discountPercentage, isOnDiscount } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.discountPercentage = discountPercentage;
    product.isOnDiscount = isOnDiscount;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
});

// @desc    Get vendor's products
// @route   GET /vendor/products
// @access  Vendor
const getVendorProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ createdBy: req.vendor.id });
    res.json(products);
});

// @desc    Delete vendor's product
// @route   DELETE /vendor/delete/:id
// @access  Vendor
const deleteVendorProduct = asyncHandler(async (req, res) => {
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
});

// @desc    Upload product (Vendor)
// @route   POST /vendor/upload
// @access  Vendor
const uploadVendorProduct = asyncHandler(async (req, res) => {
    // Extract imageUrl strings from images array if they are objects
    let processedImages = [];
    if (req.body.images) {
        // Handle both array and single object cases
        const imagesArray = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        
        processedImages = imagesArray.map(img => {
            // If it's an object with imageUrl property, extract the URL
            if (typeof img === 'object' && img.imageUrl) {
                return img.imageUrl;
            }
            // If it's already a string, use it as is
            return img;
        }).filter(url => url); // Filter out any null/undefined values
    }

    const imgUpload = new Product({
        image: req.body.image,
        images: processedImages,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        rating: req.body.rating || 0,
        brand: req.body.brand,
        countInStock: req.body.countInStock,
        category: req.body.category,
        createdBy: req.vendor.id,
        createdByModel: 'Vendor'
    });

    const savedProduct = await imgUpload.save();
    res.status(201).json(savedProduct);
});

// @desc    Update Product Discount (Vendor)
// @route   PUT /vendor/products/:id/discount
// @access  Vendor
const updateVendorProductDiscount = asyncHandler(async (req, res) => {
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
});

// @desc    Get vendor's orders
// @route   GET /vendor/orders
// @access  Vendor
const getVendorOrders = asyncHandler(async (req, res) => {
    const vendorProducts = await Product.find({ createdBy: req.vendor.id }).select('_id');
    const productIds = vendorProducts.map(p => p._id.toString());

    const orders = await Order.find({
        'orderItems.Product': { $in: productIds.map(id => new mongoose.Types.ObjectId(id)) }
    })
        .populate('User', 'name email')
        .sort({ createdAt: -1 });

    res.json(orders);
});

// @desc    Update order status to delivered (Vendor)
// @route   PUT /vendor/orders/:id/deliver
// @access  Vendor
const updateVendorOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelieved = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

// @desc    Update order status to paid (Vendor)
// @route   PUT /vendor/orders/:id/pay
// @access  Vendor
const updateVendorOrderPayStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

// @desc    Update Product (Admin)
// @route   PUT /admin/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
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
        }
    }

    // Update fields
    product.name = req.body.name !== undefined ? req.body.name : product.name;
    product.price = req.body.price !== undefined ? req.body.price : product.price;
    product.description = req.body.description !== undefined ? req.body.description : product.description;
    product.image = req.body.image !== undefined ? req.body.image : product.image;
    product.images = processedImages;
    product.brand = req.body.brand !== undefined ? req.body.brand : product.brand;
    product.category = req.body.category !== undefined ? req.body.category : product.category;
    product.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : product.countInStock;

    const updatedProduct = await product.save();

    res.json({
        message: 'Product updated successfully',
        product: updatedProduct,
    });
});

module.exports = {
    uploadProduct,
    updateProduct,
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
};
