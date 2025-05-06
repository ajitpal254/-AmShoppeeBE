const express = require('express')


const routerOrder = express.Router();
const Cart = require('../models/CartModel')




routerOrder.post('/addCart',async(req,res)=>{


        const addToCart = new Cart ({
            id:req.body.id,
            name:req.body.name,
            image:req.body.image,
            price:req.body.price,
            quantity:req.body.quantity

        })

        addToCart.save()
            .then(data =>{
                res.json(data)
            })
            .catch(err =>{
                res.json(err)
            })



})
module.exports = routerOrder;
