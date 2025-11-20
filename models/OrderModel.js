const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            qty: {
                type: Number,
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
            Product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    shippingAddress: {
        addrress: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        postalCode: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        }
    },
    paymentMethod: {
        type: String,
        required: false
    },
    paymentResult: {
        id: { type: String, },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date,

    },
    isDelieved: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, { timeStmps: true })

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
