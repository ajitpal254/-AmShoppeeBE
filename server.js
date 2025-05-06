const express = require('express');
const products = require('./data/products');
require('colors');
const dotenv = require('dotenv');
const conectDb = require('./config/db')
const productRoutes = require('./Routes/productRoutes')
const {errorHandler} = require('./middleware/errorMiddleware')
const userRoute = require('./Routes/Routes')
const cors = require('cors')
const OrderRoute = require('./Routes/OrderRoute')
const OrderGet = require('./Routes/OrderGet')
const admin = require('./Routes/AdminRoute')


dotenv.config();
conectDb();
const app= express()

app.get('/',(req,res) =>{
    res.send('<h1> Welcome to Node Server</h1>')
})
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(productRoutes)
app.use(OrderGet)
app.use(OrderRoute)
app.use(admin)
app.use('/app',userRoute)
app.use(errorHandler);

const PORT = 8080;
app.listen(process.env.PORT || PORT , ()=>{
    console.log('Server Running in '.inverse +process.env.NODE_ENV + ' Made on Port '.inverse +process.env.PORT)
});
