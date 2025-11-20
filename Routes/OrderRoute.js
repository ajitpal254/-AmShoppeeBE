const express = require('express');
const routerOrder = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addToCart } = require('../controllers/orderController');

routerOrder.post('/addCart', protect, addToCart);

module.exports = routerOrder;
