const mongoose = require('mongoose');
const Product = require('./models/ProductModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));

async function inspectProducts() {
    try {
        console.log('Inspecting product images...\n');
        
        // Find a few recent products with images
        const products = await Product.find({ 
            images: { $exists: true, $ne: [] } 
        })
        .sort({ createdAt: -1 })
        .limit(5);
        
        console.log(`Found ${products.length} recent products with images\n`);
        
        for (const product of products) {
            console.log(`\n======================================`);
            console.log(`Product: ${product.name}`);
            console.log(`ID: ${product._id}`);
            console.log(`Main Image: ${product.image}`);
            console.log(`Images Array Length: ${product.images.length}`);
            console.log(`Images Array Type: ${typeof product.images}`);
            
            if (product.images && product.images.length > 0) {
                console.log(`\nImages Array Contents:`);
                product.images.forEach((img, index) => {
                    console.log(`  [${index}] Type: ${typeof img}`);
                    if (typeof img === 'object') {
                        console.log(`       Object keys: ${Object.keys(img).join(', ')}`);
                        console.log(`       Full object:`, JSON.stringify(img, null, 2));
                    } else {
                        console.log(`       Value: ${img}`);
                    }
                });
            }
        }
        
        console.log('\n======================================\n');
        process.exit(0);
    } catch (error) {
        console.error('Error inspecting products:', error);
        process.exit(1);
    }
}

// Run the inspection
inspectProducts();
