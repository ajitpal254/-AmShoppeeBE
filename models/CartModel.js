const mongoose = require('mongoose')



const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timeStamps: true });

const Cart = mongoose.model('Cart', orderSchema);


module.exports = Cart;

