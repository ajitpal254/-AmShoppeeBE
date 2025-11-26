const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })

const productSchema = mongoose.Schema({
    //user: {
    //  type: mongoose.Schema.Types.ObjectId,
    //required: true,
    //ref:'User'
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Vendor'  // Reference to Vendor model
    },
    createdByName: {
        type: String,
        required: false
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numberOfViews: {
        type: Number,
        required: false,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        required: false
    },
    discountPercentage: {
        type: Number,
        required: false,
        default: 0,
        min: 0,
        max: 100
    },
    isOnDiscount: {
        type: Boolean,
        required: false,
        default: false
    },
    countInStock: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);


module.exports = Product;

