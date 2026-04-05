const mongoose = require('mongoose');
const Product = require('./models/ProductModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));

async function fixProductImages() {
    try {
        console.log('Starting to fix product images...');
        
        // Find all products
        const products = await Product.find({});
        console.log(`Found ${products.length} products to check`);
        
        let updatedCount = 0;
        
        for (const product of products) {
            let needsUpdate = false;
            let newImages = [];
            
            // Check if images array exists and has items
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                // Check if any image is an object instead of a string
                for (const img of product.images) {
                    if (typeof img === 'object' && img.imageUrl) {
                        newImages.push(img.imageUrl);
                        needsUpdate = true;
                    } else if (typeof img === 'string') {
                        newImages.push(img);
                    }
                }
                
                if (needsUpdate) {
                    product.images = newImages;
                    await product.save();
                    updatedCount++;
                    console.log(`✓ Fixed images for product: ${product.name} (${product._id})`);
                    console.log(`  Old format had ${product.images.length} images, extracted ${newImages.length} URLs`);
                }
            }
        }
        
        console.log(`\n✓ Successfully updated ${updatedCount} products`);
        console.log(`✓ ${products.length - updatedCount} products already had correct format`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error fixing product images:', error);
        process.exit(1);
    }
}

// Run the fix
fixProductImages();
