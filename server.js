const express = require('express');
const products = require('./data/products');
require('colors');
const dotenv = require('dotenv');
const conectDb = require('./config/db')
const productRoutes = require('./Routes/productRoutes')
const { errorHandler } = require('./middleware/errorMiddleware')
const userRoute = require('./Routes/Routes')
const cors = require('cors')
const OrderRoute = require('./Routes/OrderRoute')
const OrderGet = require('./Routes/OrderGet')
const admin = require('./Routes/AdminRoute')
const vendor = require('./Routes/VendorRoutes')
const verificationEmail = require('./middleware/verificationEmail')
const orderManagement = require('./Routes/OrderManagementRoutes')
const userProfileRoutes = require('./Routes/userProfileRoutes')
const vendorProductRoutes = require('./Routes/vendorProductRoutes')
const discountRoutes = require('./Routes/discountRoutes')


dotenv.config();
conectDb();
const app = express()

app.get('/', (req, res) => {
    res.send('<h1> Welcome to Node Server</h1>')
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(productRoutes)
app.use(OrderGet)
app.use(OrderRoute)
app.use(admin)
app.use(vendor)
app.use('/app', userRoute)
app.use(orderManagement)
// app.use(verificationEmail) - REMOVED: This is a utility function, not middleware!
app.use('/api/profile', userProfileRoutes)  // User profile routes
app.use('/api/vendor', vendorProductRoutes)  // Vendor product routes
app.use('/api/discount', discountRoutes)  // Discount/coupon routes
app.use(errorHandler);

const PORT = 8080;
app.listen(process.env.PORT || PORT, '0.0.0.0', () => {
    console.log('Server Running in '.inverse + process.env.NODE_ENV + ' Made on Port '.inverse + process.env.PORT)
});

