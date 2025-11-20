const express = require("express");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const router = express.Router();

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
      query.category = new RegExp(category, 'i');
    }

    // Deals filter
    if (req.query.deals === 'true') {
      query.isOnDiscount = true;
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
module.exports = router;
