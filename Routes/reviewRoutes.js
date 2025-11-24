const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all reviews (with optional approval filter for admin)
// @route   GET /api/reviews
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const { status } = req.query;

    // Get all products with their reviews
    const products = await Product.find({}).populate('reviews.user', 'name email');

    // Extract all reviews from all products
    let allReviews = [];
    products.forEach(product => {
        product.reviews.forEach(review => {
            allReviews.push({
                ...review.toObject(),
                productId: product._id,
                productName: product.name,
                productImage: product.image
            });
        });
    });

    // Filter by approval status if specified
    if (status === 'pending') {
        allReviews = allReviews.filter(review => !review.isApproved);
    } else if (status === 'approved') {
        allReviews = allReviews.filter(review => review.isApproved);
    }

    res.json(allReviews);
}));

// @desc    Approve a review
// @route   PUT /api/reviews/:productId/:reviewId/approve
// @access  Private/Admin
router.put('/:productId/:reviewId/approve', protect, admin, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);

    if (product) {
        const review = product.reviews.id(req.params.reviewId);

        if (review) {
            review.isApproved = true;
            await product.save();
            res.json({ message: 'Review approved' });
        } else {
            res.status(404);
            throw new Error('Review not found');
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Delete a review
// @route   DELETE /api/reviews/:productId/:reviewId
// @access  Private/Admin
router.delete('/:productId/:reviewId', protect, admin, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);

    if (product) {
        const review = product.reviews.id(req.params.reviewId);

        if (review) {
            review.deleteOne();

            // Recalculate product rating
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.length > 0
                ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
                : 0;

            await product.save();
            res.json({ message: 'Review deleted' });
        } else {
            res.status(404);
            throw new Error('Review not found');
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Vote helpful on a review
// @route   POST /api/reviews/:productId/:reviewId/vote
// @access  Private
router.post('/:productId/:reviewId/vote', protect, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);

    if (product) {
        const review = product.reviews.id(req.params.reviewId);

        if (review) {
            // Check if user already voted
            const alreadyVoted = review.votedBy.find(
                userId => userId.toString() === req.user._id.toString()
            );

            if (alreadyVoted) {
                res.status(400);
                throw new Error('You have already voted on this review');
            }

            review.votedBy.push(req.user._id);
            review.helpfulVotes = review.votedBy.length;

            await product.save();
            res.json({ message: 'Vote recorded', helpfulVotes: review.helpfulVotes });
        } else {
            res.status(404);
            throw new Error('Review not found');
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Get user's reviews
// @route   GET /api/reviews/user/:userId
// @access  Private
router.get('/user/:userId', protect, asyncHandler(async (req, res) => {
    // Only allow users to see their own reviews, or admins to see any
    if (req.user._id.toString() !== req.params.userId && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to view these reviews');
    }

    // Get all products with reviews by this user
    const products = await Product.find({ 'reviews.user': req.params.userId });

    // Extract user's reviews from all products
    let userReviews = [];
    products.forEach(product => {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.params.userId) {
                userReviews.push({
                    ...review.toObject(),
                    productId: product._id,
                    productName: product.name,
                    productImage: product.image
                });
            }
        });
    });

    res.json(userReviews);
}));

module.exports = router;
