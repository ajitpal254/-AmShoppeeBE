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
},{timeStamps:true})

const productSchema = mongoose.Schema({
    //user: {
      //  type: mongoose.Schema.Types.ObjectId,
        //required: true,
        //ref:'User'
    //},
    name :{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    reviews: [reviewScema],
    rating:{
        type: Number,
        required: true
    },
   // numReviews:{
     //   type: Number,
       // required: true
  //  },
    price:{
        type: Number,
        required: true
    },
    countInStock:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
},{timeStamps:true});

const Product = mongoose.model('Product',productSchema);


module.exports = Product;

