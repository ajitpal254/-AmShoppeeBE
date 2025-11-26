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

const orderManagement = require('./Routes/OrderManagementRoutes')
const userProfileRoutes = require('./Routes/userProfileRoutes')
const vendorProductRoutes = require('./Routes/vendorProductRoutes')
const discountRoutes = require('./Routes/discountRoutes')
const adminVendorRoutes = require('./Routes/AdminVendorRoutes')


const { sanitizeNoSQL, sanitizeXSS } = require('./middleware/sanitizationMiddleware');
const wishlistRoutes = require('./Routes/wishlistRoutes');
const reviewRoutes = require('./Routes/reviewRoutes');

dotenv.config();
conectDb();
const app = express()

app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.2.33:3000', 'https://three-am-shop.web.app', 'https://threeamshoppeebe.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('<h1> Welcome to Node Server</h1>')
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Prevent Parameter Pollution
app.use(hpp());

// Data Sanitization against NoSQL query injection (custom middleware)
app.use(sanitizeNoSQL);

// Data Sanitization against XSS (custom middleware)
app.use(sanitizeXSS);
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
app.use('/api/wishlist', wishlistRoutes) // Wishlist routes
app.use('/api', adminVendorRoutes)  // Admin vendor management routes
app.use('/api/reviews', reviewRoutes)  // Review management routes
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

app.use('/api/payment', require('./Routes/paymentRoutes'));

app.use(errorHandler);

const PORT = 8080;
app.listen(process.env.PORT || PORT, '0.0.0.0', () => {
    console.log('Server Running in '.inverse + process.env.NODE_ENV + ' Made on Port '.inverse + process.env.PORT)
});

