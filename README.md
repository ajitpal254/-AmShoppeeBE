# AmShoppee Backend

A robust and scalable e-commerce backend application built with Node.js and Express.js. This backend powers the AmShoppee platform, providing comprehensive REST APIs for managing products, users, orders, vendors, and more.

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AmShoppee Backend is a full-featured e-commerce API built with JavaScript (Node.js). It provides a complete solution for managing an online shopping platform with support for user authentication, product management, order processing, vendor operations, discount codes, and more.

The application is designed with security, scalability, and maintainability in mind, utilizing industry-standard practices and modern technologies.

## 🛠 Technologies

This project is built with the following technologies:

- **Node.js** - JavaScript runtime environment
- **Express.js** (v5.1.0) - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** (v8.14.2) - MongoDB object modeling tool
- **JWT (jsonwebtoken)** - Authentication and authorization
- **bcrypt/bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing
- **Firebase Admin** - Google authentication integration
- **SendGrid** - Email service integration
- **Cloudinary** - Cloud-based image management
- **Express Async Handler** - Async error handling

## ✨ Features

### Authentication & Authorization
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Email verification system
- Google authentication via Firebase
- Role-based access control (Admin, Vendor, User)

### Product Management
- CRUD operations for products
- Product search with keyword filtering
- Category-based product filtering
- Price range filtering
- Product sorting (by rating, date, popularity)
- Product view tracking
- Product image management

### Order Management
- Create and manage orders
- Order status tracking
- Order history for users
- Admin order management dashboard

### Vendor System
- Vendor registration and authentication
- Vendor-specific product management
- Vendor dashboard capabilities

### Discount & Promotions
- Create and manage discount codes
- Apply coupons to orders
- Promotional code validation

### User Profiles
- User profile management
- Update user information
- Order history tracking

### Admin Features
- Admin dashboard
- User management
- Product management
- Order oversight
- Vendor management

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher recommended)
- **npm** (v6.x or higher)
- **MongoDB** (v4.x or higher) - Local installation or MongoDB Atlas account

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/ajitpal254/-AmShoppeeBE.git
cd -AmShoppeeBE
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual configuration values (see [Environment Configuration](#environment-configuration) section below).

## ⚙️ Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/3amshoppme
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/3amshoppme?retryWrites=true&w=majority

# JWT Secret Key (REQUIRED - Change this to a random string!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Firebase Configuration (for Google Login)
FIREBASE_PROJECT_ID=your_firebase_project_id

# SendGrid Email Configuration (Optional - for sending emails)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your_verified_sender_email@domain.com

# Cloudinary Configuration (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=8080
NODE_ENV=development
```

### Important Notes:

- **MONGO_URI**: Connection string for your MongoDB database (required)
- **JWT_SECRET**: Secret key for JWT token generation - **MUST** be changed in production (required)
- **Firebase**: Required only if you want to enable Google authentication
- **SendGrid**: Required only if you want to send verification/notification emails
- **Cloudinary**: Required only if you want to enable image upload functionality
- **PORT**: The application will run on this port (default: 8080)

## 🏃 Running the Application

### Development Mode

Start the server:

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 8080).

You should see output similar to:

```
Db connected <your-mongodb-host>
Server Running in development Made on Port 8080
```

### Access the API

Once the server is running, you can access it at:

```
http://localhost:8080
```

The root endpoint will display:
```
Welcome to Node Server
```

## 🔌 API Endpoints

### Authentication Routes (`/app`)
- `POST /app/signup` - User registration
- `POST /app/login` - User login
- `POST /app/google-login` - Google authentication
- `POST /app/verify-email` - Email verification
- `POST /app/forgot-password` - Request password reset
- `POST /app/reset-password` - Reset password

### Product Routes
- `GET /products` - Get all products with optional filters (keyword, category, price range, sort)
- `GET /products/:id` - Get product by ID
- `GET /categories` - Get all product categories
- `GET /products/category/:category` - Get products by category

### Order Routes
- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order by ID

### Admin Routes (`/admin`)
- Admin authentication and dashboard access
- User management
- Product management
- Order management

### Vendor Routes (`/vendor`)
- Vendor registration and authentication
- Vendor product management
- Vendor dashboard

### User Profile Routes (`/api/profile`)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/orders` - Get user order history

### Vendor Product Routes (`/api/vendor`)
- Vendor-specific product CRUD operations

### Discount Routes (`/api/discount`)
- `POST /api/discount` - Create discount code
- `GET /api/discount` - Get all discount codes
- `POST /api/discount/validate` - Validate discount code

## 📁 Project Structure

```
-AmShoppeeBE/
├── config/
│   ├── db.js                      # Database connection configuration
│   └── firebaseAdmin.js           # Firebase admin configuration
├── data/
│   ├── products.js                # Sample product data
│   └── user.js                    # Sample user data
├── middleware/
│   ├── errorMiddleware.js         # Error handling middleware
│   ├── jwtauth.js                 # JWT authentication middleware
│   ├── vendorAuth.js              # Vendor authentication middleware
│   └── verificationEmail.js       # Email verification utility
├── models/
│   ├── CartModel.js               # Shopping cart model
│   ├── DiscountCodeModel.js       # Discount code model
│   ├── OrderModel.js              # Order model
│   ├── ProductModel.js            # Product model
│   ├── UserProfile.js             # User profile model
│   ├── VendorModel.js             # Vendor model
│   └── user.js                    # User model
├── Routes/
│   ├── AdminRoute.js              # Admin routes
│   ├── LoginRoute.js              # Login routes
│   ├── OrderGet.js                # Order retrieval routes
│   ├── OrderManagementRoutes.js   # Order management routes
│   ├── OrderRoute.js              # Order creation routes
│   ├── Routes.js                  # User authentication routes
│   ├── VendorRoutes.js            # Vendor routes
│   ├── discountRoutes.js          # Discount/coupon routes
│   ├── productRoutes.js           # Product routes
│   ├── userProfileRoutes.js       # User profile routes
│   └── vendorProductRoutes.js     # Vendor product routes
├── .env.example                   # Example environment variables
├── .gitignore                     # Git ignore file
├── package.json                   # Project dependencies
├── seeders.js                     # Database seeding script
├── server.js                      # Application entry point
└── README.md                      # This file
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, maintainable code
   - Follow the existing code style
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git commit -m "Add: description of your feature"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues

### Code Style Guidelines

- Use consistent indentation (2 spaces)
- Follow JavaScript best practices
- Use meaningful variable and function names
- Add error handling for async operations
- Document complex logic with comments

### Reporting Issues

If you find a bug or have a suggestion, please open an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment details (Node version, OS, etc.)

## 📄 License

This project is licensed under the ISC License. See the repository for more details.

## 📧 Contact

For questions or support, please open an issue on the [GitHub repository](https://github.com/ajitpal254/-AmShoppeeBE/issues).

---

**Note**: This is a backend API server. You'll need a separate frontend application to interact with these endpoints. Make sure to configure CORS appropriately for your frontend domain in production environments.
