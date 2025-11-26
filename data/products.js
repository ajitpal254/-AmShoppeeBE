const products = [
  // --- SNEAKERS ---
  {
    name: "Nike Air Jordan 1 High",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80"
    ],
    description: "The legendary Air Jordan 1 High. Premium leather construction with iconic color blocking.",
    brand: "Nike",
    category: "Sneakers",
    price: 179.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: "Adidas Ultraboost 22",
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80"
    ],
    description: "Experience ultimate energy return with the Adidas Ultraboost 22. Perfect for running and casual wear.",
    brand: "Adidas",
    category: "Sneakers",
    price: 159.99,
    countInStock: 20,
    rating: 4.7,
    numReviews: 18,
  },
  {
    name: "Nike Air Force 1 '07",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
    ],
    description: "The classic Air Force 1 '07. Crisp leather edges and a timeless look.",
    brand: "Nike",
    category: "Sneakers",
    price: 110.00,
    countInStock: 30,
    rating: 4.9,
    numReviews: 45,
  },
  {
    name: "Puma RS-X",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"
    ],
    description: "Bold and retro-inspired, the Puma RS-X stands out with its chunky silhouette.",
    brand: "Puma",
    category: "Sneakers",
    price: 110.00,
    countInStock: 12,
    rating: 4.5,
    numReviews: 10,
  },

  // --- TECH ---
  {
    name: "Apple iPhone 14 Pro",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80",
      "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800&q=80",
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80"
    ],
    description: "The ultimate iPhone. Dynamic Island, 48MP camera, and A16 Bionic chip.",
    brand: "Apple",
    category: "Electronics",
    price: 999.00,
    countInStock: 10,
    rating: 4.9,
    numReviews: 50,
  },
  {
    name: "MacBook Pro 16-inch",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"
    ],
    description: "Supercharged by M2 Pro or M2 Max. The most powerful MacBook Pro ever.",
    brand: "Apple",
    category: "Electronics",
    price: 2499.00,
    countInStock: 5,
    rating: 5.0,
    numReviews: 15,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
    ],
    description: "Industry-leading noise cancellation and exceptional sound quality.",
    brand: "Sony",
    category: "Electronics",
    price: 348.00,
    countInStock: 25,
    rating: 4.8,
    numReviews: 32,
  },
  {
    name: "Samsung Galaxy S23 Ultra",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
      "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&q=80"
    ],
    description: "Epic Nightography, 200MP camera, and the fastest Snapdragon chip.",
    brand: "Samsung",
    category: "Electronics",
    price: 1199.00,
    countInStock: 8,
    rating: 4.7,
    numReviews: 20,
  },

  // --- WATCHES ---
  {
    name: "Apple Watch Ultra",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80"
    ],
    description: "The most rugged and capable Apple Watch ever. Designed for exploration.",
    brand: "Apple",
    category: "Watches",
    price: 799.00,
    countInStock: 15,
    rating: 4.9,
    numReviews: 12,
  },
  {
    name: "Classic Leather Chronograph",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80"
    ],
    description: "A timeless classic. Genuine leather strap with a precision chronograph movement.",
    brand: "Fossil",
    category: "Watches",
    price: 129.00,
    countInStock: 40,
    rating: 4.5,
    numReviews: 8,
  },

  // --- FASHION ---
  {
    name: "Denim Trucker Jacket",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d8c9230c?w=800&q=80"
    ],
    description: "The original jean jacket since 1967. A blank canvas for self-expression.",
    brand: "Levi's",
    category: "Fashion",
    price: 89.50,
    countInStock: 25,
    rating: 4.6,
    numReviews: 30,
  },
  {
    name: "Essential Cotton Hoodie",
    image: "https://images.unsplash.com/photo-1556906781-9a412961d28c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556906781-9a412961d28c?w=800&q=80",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80"
    ],
    description: "Soft, comfortable, and durable. The perfect everyday hoodie.",
    brand: "H&M",
    category: "Fashion",
    price: 39.99,
    countInStock: 50,
    rating: 4.4,
    numReviews: 42,
  },
  {
    name: "Ray-Ban Aviator Classic",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"
    ],
    description: "Originally designed for U.S. Aviators in 1937. Timeless style.",
    brand: "Ray-Ban",
    category: "Fashion",
    price: 163.00,
    countInStock: 18,
    rating: 4.8,
    numReviews: 25,
  },

  // --- HOME & BEAUTY ---
  {
    name: "Aesop Resurrection Hand Balm",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-280553fd1e56?w=800&q=80"
    ],
    description: "A blend of fragrant botanicals and skin-softening emollients.",
    brand: "Aesop",
    category: "Beauty",
    price: 31.00,
    countInStock: 35,
    rating: 4.9,
    numReviews: 15,
  },
  {
    name: "Modern Ceramic Vase",
    image: "https://images.unsplash.com/photo-1581783342308-f792ca43d5b1?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581783342308-f792ca43d5b1?w=800&q=80",
      "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&q=80"
    ],
    description: "Minimalist ceramic vase to elevate your home decor.",
    brand: "HomeGoods",
    category: "Home & Kitchen",
    price: 24.99,
    countInStock: 22,
    rating: 4.3,
    numReviews: 9,
  }
];

// Duplicate the list to reach ~50 items with slight variations
const generatedProducts = [];
const variations = ["Pro", "Max", "Lite", "Edition", "v2"];

products.forEach(p => {
    // Add the original
    generatedProducts.push({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    // Create 2 variations
    for(let i=0; i<2; i++) {
        generatedProducts.push({
            ...p,
            name: `${p.name} ${variations[i]}`,
            price: Number((p.price * (1 + (Math.random() * 0.2))).toFixed(2)), // Slightly different price
            countInStock: Math.floor(Math.random() * 40),
            rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
            numReviews: Math.floor(Math.random() * 50),
            isOnDiscount: Math.random() > 0.8,
            discountPercentage: 15,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
});

module.exports = generatedProducts;
