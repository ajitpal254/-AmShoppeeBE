# AmShoppee Backend API

> A robust and scalable backend API for the **AmShoppee** e-commerce platform, built with modern JavaScript technologies.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Security](#security)

## 🎯 Project Overview

**AmShoppee Backend** is the server-side application that powers the AmShoppee e-commerce platform. It provides comprehensive RESTful APIs for managing products, users, orders, vendors, shopping carts, and more. The backend is designed with scalability, security, and performance in mind.

This application handles:
- User authentication and authorization
- Product catalog management
- Order processing and tracking
- Vendor operations
- Shopping cart functionality
- Discount code management
- Admin panel operations
- Email notifications
- Image uploads via Cloudinary

## 🛠️ Technologies Used

### Core Technologies
- **[Node.js](https://nodejs.org/)** - JavaScript runtime environment
- **[Express.js](https://expressjs.com/)** (v5.1.0) - Fast, minimalist web framework
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** (v8.14.2) - MongoDB object modeling

### Authentication & Security
- **[JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)** (v9.0.2) - Token-based authentication
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** (v5.1.1) - Password hashing
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** (v3.0.2) - Alternative bcrypt implementation
- **[Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)** (v13.3.0) - Google authentication

### Additional Libraries
- **[CORS](https://github.com/expressjs/cors)** (v2.8.5) - Cross-Origin Resource Sharing
- **[dotenv](https://github.com/motdotla/dotenv)** (v16.5.0) - Environment variable management
- **[express-async-handler](https://github.com/Abazhenov/express-async-handler)** (v1.2.0) - Async error handling
- **[SendGrid](https://github.com/sendgrid/sendgrid-nodejs)** (v8.1.5) - Email service integration
- **[Cloudinary](https://cloudinary.com/)** (v2.6.1) - Image and media management
- **[colors](https://github.com/Marak/colors.js)** (v1.4.0) - Console color styling

## ✨ Features

### User Management
- ✅ User registration with email verification
- ✅ User login with JWT authentication
- ✅ Google authentication via Firebase
- ✅ Password hashing with bcrypt
- ✅ User profile management
- ✅ Email verification system

### Product Management
- ✅ Browse products with pagination
- ✅ Search and filter products
- ✅ Product categories and brands
- ✅ Product ratings and reviews
- ✅ Image upload and management
- ✅ Stock tracking

### Vendor Operations
- ✅ Vendor registration and authentication
- ✅ Vendor product management (CRUD)
- ✅ Vendor-specific product listings
- ✅ Vendor order management

### Order Processing
- ✅ Create and manage orders
- ✅ Order status tracking
- ✅ Order history for users
- ✅ Admin order management
- ✅ Vendor order fulfillment

### Shopping Cart
- ✅ Add/remove items from cart
- ✅ Update item quantities
- ✅ Cart persistence

### Discount Management
- ✅ Create and manage discount codes
- ✅ Apply coupons to orders
- ✅ Percentage and fixed amount discounts
- ✅ Discount code validation

### Admin Panel
- ✅ Product management (CRUD operations)
- ✅ User management
- ✅ Order oversight
- ✅ Vendor approval
- ✅ System statistics

### Additional Features
- ✅ Error handling middleware
- ✅ JWT authentication middleware
- ✅ Vendor-specific authentication
- ✅ Email notifications (SendGrid)
- ✅ Image uploads (Cloudinary)
- ✅ CORS enabled for cross-origin requests

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (v4.x or higher) - [Download MongoDB](https://www.mongodb.com/try/download/community)
  - Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud database
- **Git** - [Download Git](https://git-scm.com/downloads)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ajitpal254/-AmShoppeeBE.git
cd -AmShoppeeBE
```

### 2. Install Dependencies

```bash
npm install
```

This will install all the required packages listed in `package.json`.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then edit the `.env` file with your configuration (see [Environment Configuration](#environment-configuration) section).

### 4. Start MongoDB

If using local MongoDB:

```bash
# On macOS/Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

Alternatively, use MongoDB Atlas (cloud) by setting the `MONGO_URI` in your `.env` file.

### 5. Seed the Database (Optional)

If you want to populate the database with sample data:

```bash
node seeders.js
```

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
FIREBASE_PROJECT_ID=loginfirebase234

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

### Configuration Details:

- **MONGO_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for signing JWT tokens (keep this secure!)
- **FIREBASE_PROJECT_ID**: Firebase project ID for Google authentication
- **SENDGRID_API_KEY**: API key for SendGrid email service
- **SENDGRID_FROM_EMAIL**: Verified sender email address
- **CLOUDINARY_***: Cloudinary credentials for image uploads
- **PORT**: Server port (default: 8080)
- **NODE_ENV**: Environment mode (`development` or `production`)

## 🏃 Running the Server

### Development Mode

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 8080).

You should see:

```
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

## 📡 API Endpoints

### Authentication Routes (`/app`)
- `POST /app/signup` - User registration
- `POST /app/login` - User login
- `POST /app/google-login` - Google authentication
- `POST /app/verify-email` - Email verification

### Product Routes
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `GET /products/search/:keyword` - Search products

### Admin Routes (`/admin`)
- `POST /admin/upload` - Upload new product (Admin only)
- `GET /admin/delete` - Get all products
- `GET /admin/delete/:id` - Get product by ID
- `PUT /admin/delete/:id` - Update product
- `DELETE /admin/delete/:id` - Delete product

### Vendor Routes (`/api/vendor`)
- `POST /api/vendor/signup` - Vendor registration
- `POST /api/vendor/login` - Vendor login
- `GET /api/vendor/products` - Get vendor products
- `POST /api/vendor/products` - Create product (Vendor)
- `PUT /api/vendor/products/:id` - Update product (Vendor)
- `DELETE /api/vendor/products/:id` - Delete product (Vendor)

### Order Routes
- `POST /order` - Create new order
- `GET /order/user/:userId` - Get user orders
- `GET /order/:id` - Get single order
- `PUT /order/:id/status` - Update order status

### User Profile Routes (`/api/profile`)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `PUT /api/profile/password` - Change password
- `GET /api/profile/orders` - Get user order history

### Discount Routes (`/api/discount`)
- `POST /api/discount` - Create discount code (Admin)
- `GET /api/discount` - Get all discount codes
- `POST /api/discount/validate` - Validate discount code
- `DELETE /api/discount/:id` - Delete discount code

### Order Management Routes
- `GET /order-management/orders` - Get all orders (Admin)
- `PUT /order-management/orders/:id` - Update order (Admin)
- `GET /order-management/stats` - Get order statistics

## 📁 Project Structure

```
-AmShoppeeBE/
│
├── config/                    # Configuration files
│   ├── db.js                  # MongoDB connection
│   └── firebaseAdmin.js       # Firebase Admin SDK setup
│
├── data/                      # Seed data
│   ├── products.js            # Sample products
│   └── user.js                # Sample users
│
├── middleware/                # Custom middleware
│   ├── errorMiddleware.js     # Error handling
│   ├── jwtauth.js             # JWT authentication
│   ├── vendorAuth.js          # Vendor authentication
│   └── verificationEmail.js   # Email verification utility
│
├── models/                    # Mongoose models
│   ├── CartModel.js           # Shopping cart schema
│   ├── DiscountCodeModel.js   # Discount code schema
│   ├── OrderModel.js          # Order schema
│   ├── ProductModel.js        # Product schema
│   ├── user.js                # User schema
│   ├── UserProfile.js         # User profile schema
│   └── VendorModel.js         # Vendor schema
│
├── Routes/                    # API routes
│   ├── AdminRoute.js          # Admin endpoints
│   ├── discountRoutes.js      # Discount code endpoints
│   ├── LoginRoute.js          # Login endpoints
│   ├── OrderGet.js            # Order retrieval endpoints
│   ├── OrderManagementRoutes.js # Order management endpoints
│   ├── OrderRoute.js          # Order creation endpoints
│   ├── productRoutes.js       # Product endpoints
│   ├── Routes.js              # User authentication endpoints
│   ├── userProfileRoutes.js   # User profile endpoints
│   ├── VendorRoutes.js        # Vendor endpoints
│   └── vendorProductRoutes.js # Vendor product endpoints
│
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore file
├── package.json               # Project dependencies
├── seeders.js                 # Database seeder
├── server.js                  # Application entry point
├── SECURITY.md                # Security policy
└── README.md                  # Project documentation (this file)
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/ajitpal254/-AmShoppeeBE.git
   ```

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
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes in detail

### Contribution Guidelines

- Follow JavaScript best practices and ES6+ syntax
- Write meaningful commit messages
- Update documentation for any API changes
- Ensure all existing tests pass
- Add tests for new features
- Keep pull requests focused on a single feature/fix
- Be respectful and constructive in discussions

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the [Issues](https://github.com/ajitpal254/-AmShoppeeBE/issues) section
2. If not, create a new issue with:
   - A clear title
   - Detailed description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots (if applicable)

## 📄 License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2024, AmShoppee Backend

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

## 🔒 Security

Security is a top priority for this project. Please review our [Security Policy](SECURITY.md) for information on:

- Supported versions
- Reporting vulnerabilities
- Security best practices

### Security Best Practices

- Never commit your `.env` file or expose sensitive credentials
- Always use strong, unique values for `JWT_SECRET`
- Keep dependencies up to date: `npm audit` and `npm update`
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regularly review and update security policies

---

## 📞 Support & Contact

For questions, issues, or support:

- **Repository**: [https://github.com/ajitpal254/-AmShoppeeBE](https://github.com/ajitpal254/-AmShoppeeBE)
- **Issues**: [Report an Issue](https://github.com/ajitpal254/-AmShoppeeBE/issues)

---

## 📝 Additional Notes

### Environment Tips

- **Development**: Use `NODE_ENV=development` for verbose logging and error details
- **Production**: Use `NODE_ENV=production` for optimized performance and minimal logging
- Always restart the server after changing environment variables

### Database Management

- Use MongoDB Compass for GUI-based database management
- Regular backups are recommended for production databases
- Consider using MongoDB Atlas for automatic backups and scaling

### API Testing

You can test the API using:
- **[Postman](https://www.postman.com/)** - Popular API testing tool
- **[Insomnia](https://insomnia.rest/)** - Alternative API client
- **cURL** - Command-line tool for API requests

Example cURL request:
```bash
curl -X GET http://localhost:8080/products
```

---

**Built with ❤️ by the AmShoppee Team**

*Last Updated: November 2024*
