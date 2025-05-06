const express = require('express')
const orderSchema = require('../models/CartModel')
const asyncHandler = require('express-async-handler')
const cartOrder = express.Router();
const Cart = require('../models/CartModel')
const mongoose = require("mongoose");



cartOrder.get('/cart', async (req,res) =>{
        const cart = await Cart.find({})
        res.json(cart);
    }
);
cartOrder.get('/cart/:id',asyncHandler(async (req,res) =>{
    const product = await Cart.findById(req.params.id);
    if(product){
        res.json(product)
    }
    else{
        res.status(404).json({message:"Product not found"})
    }
}));

cartOrder.delete("/cart/:id", (req, res)=>{
    console.log(req)
    Cart.findByIdAndRemove(req.params.id)
        .exec()
        .then(() => {
            console.log("cartOrder: OK")
            res.sendStatus(200)
        }).catch(()=>{
            req.sendStatus(400)
        })

})


module.exports = cartOrder;
