const mongoose = require('mongoose')

const reviewScema = mongoose.Schema({
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
    }
}, { timeStamps: true })

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
    reviews: [reviewScema],
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
    // numReviews:{
    //   type: Number,
    // required: true
    //  },
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

