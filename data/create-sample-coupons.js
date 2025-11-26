// Sample script to create test discount codes
// Run this after your server is running

const API_URL = 'http://localhost:8080';

const sampleCoupons = [
    {
        code: "WELCOME10",
        discountType: "fixed",
        discountValue: 10,
        description: "Welcome discount - $10 off",
        isActive: true,
        minPurchaseAmount: 50
    },
    {
        code: "SAVE20",
        discountType: "percentage",
        discountValue: 20,
        description: "20% off your entire order",
        isActive: true,
        minPurchaseAmount: 30
    },
    {
        code: "FLASH50",
        discountType: "percentage",
        discountValue: 50,
        description: "Flash sale - 50% off!",
        isActive: true,
        maxUses: 100,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
        code: "FREESHIP",
        discountType: "fixed",
        discountValue: 5,
        description: "Free shipping",
        isActive: true
    }
];

async function createCoupons() {
    console.log('Creating sample discount codes...\n');

    for (const coupon of sampleCoupons) {
        try {
            const response = await fetch(`${API_URL}/api/discount/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coupon)
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`✅ Created coupon: ${coupon.code}`);
                console.log(`   Type: ${coupon.discountType}`);
                console.log(`   Value: ${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '$'}`);
                console.log(`   Description: ${coupon.description}\n`);
            } else {
                console.log(`❌ Failed to create ${coupon.code}: ${data.message}\n`);
            }
        } catch (error) {
            console.error(`❌ Error creating ${coupon.code}:`, error.message, '\n');
        }
    }

    console.log('\n✅ Done! You can now use these coupon codes:');
    sampleCoupons.forEach(c => console.log(`   - ${c.code}`));
}

// Run if this file is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    createCoupons();
} else {
    // Browser environment
    console.log('Run createCoupons() to create sample discount codes');
}

// Export for use in browser console or other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createCoupons, sampleCoupons };
}
