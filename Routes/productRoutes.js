const express = require("express");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const router = express.Router();

router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
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
      product.views = (product.views || 0) + 1;
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  })
);
module.exports = router;
