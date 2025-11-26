const express = require("express");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // Assuming you have this

router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const { keyword, category, minPrice, maxPrice, sortBy } = req.query;

    // Build query object
    let query = {};

    // Keyword search (searches in name, description, brand, category)
    if (keyword) {
      const searchRegex = new RegExp(keyword, 'i'); // case-insensitive
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category filter
    if (category) {
      if (category.includes(',')) {
        const categories = category.split(',').map(c => c.trim());
        query.category = { $in: categories };
      } else {
        query.category = new RegExp(category, 'i');
      }
    }

    // Deals filter
    if (req.query.deals === 'true') {
      query.isOnDiscount = true;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Price range filter
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort.rating = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'popular':
        sort.numberOfViews = -1;
        break;
      default:
        sort.createdAt = -1; // Default: newest first
    }

    // Execute query
    const products = await Product.find(query).sort(sort);

    res.json({
      count: products.length,
      products,
      query: {
        keyword: keyword || 'all',
        category: category || 'all',
        sortBy: sortBy || 'newest',
      }
    });
  })
);

// Get all unique categories
router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const categories = await Product.distinct("category");
    res.json(categories);
  })
);

// Get products by category
router.get(
  "/products/category/:category",
  asyncHandler(async (req, res) => {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  })
);

router.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.numberOfViews = (product.numberOfViews || 0) + 1;
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  })
);

const rateLimit = require('express-rate-limit');
const Order = require('../models/OrderModel');

// Rate limiter for reviews
const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 review requests per windowMs
  message: 'Too many reviews created from this IP, please try again after 15 minutes'
});


// Create new review
router.post(
  "/products/:id/reviews",
  reviewLimiter,
  protect, // Enable auth middleware
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || req.user.email;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user already reviewed this product
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === userId.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      // Check if user has purchased this product (verified purchase)
      const hasPurchased = await Order.findOne({
        User: userId,
        'orderItems.Product': req.params.id,
        orderStatus: { $in: ['Delivered', 'Confirmed', 'Shipped'] }
      });

      const review = {
        name: userName,
        rating: Number(rating),
        comment,
        user: userId,
        product: req.params.id,
        isVerifiedPurchase: !!hasPurchased,
        isApproved: !!hasPurchased, // Auto-approve verified purchases, others need moderation
        helpfulVotes: 0,
        votedBy: []
      };

      product.reviews.push(review);

      // Only count approved reviews
      const approvedReviews = product.reviews.filter(r => r.isApproved);
      product.numReviews = approvedReviews.length;

      product.rating = approvedReviews.length > 0
        ? approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length
        : 0;

      await product.save();

      const message = hasPurchased
        ? "Review added and approved (verified purchase)"
        : "Review submitted for moderation";

      res.status(201).json({
        message,
        isVerifiedPurchase: !!hasPurchased,
        isApproved: !!hasPurchased
      });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

module.exports = router;
