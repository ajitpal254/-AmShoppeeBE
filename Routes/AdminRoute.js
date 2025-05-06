const express = require('express')
const adminRouter = express.Router()

const Product = require('../models/ProductModel')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')

adminRouter.post('/products/upload',async (req, res) => {


        const imgUpload = new Product ({
            //user:req.body.user,
          image:req.body.image,
            name:req.body.name,
            price:req.body.price,
            description:req.body.description,
            rating:req.body.rating,
          //  numReviews:req.body.numReviews,
            brand:req.body.brand,
            countInStock:req.body.countInStock,
            category:req.body.category


        })
        imgUpload.save()
            .then(data =>{
                res.json(data)
            })
            .catch(err =>{
                res.json(err)
            })
    }
)
adminRouter.get('/admin/delete',asyncHandler(async (req,res) =>{
        const products = await Product.find({}).then(data =>
            res.json(data)
        ).catch(err =>console.log(err))
        // res.json(products);
    })
);
adminRouter.get('/admin/delete/:id',asyncHandler(async (req,res) =>{
    const product = await Product.findById(req.params.id);
    if(product){
        res.json(product)
    }
    else{
        res.status(404).json({message:"Product not found"})
    }
}));

adminRouter.delete("/admin/delete/:id", (req, res)=>{
    console.log(req)
    Product.findByIdAndRemove(req.params.id)
        .exec()
        .then(() => {
            console.log("cartOrder: OK")
            res.sendStatus(200)
        }).catch(()=>{
        req.sendStatus(400)
    })

})


module.exports = adminRouter;
