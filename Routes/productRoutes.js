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
