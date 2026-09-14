const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to DB for seeding products...');

    // Get categories to assign to products
    const rings = await Category.findOne({ name: 'Rings' });
    const necklaces = await Category.findOne({ name: 'Necklaces' });
    const earrings = await Category.findOne({ name: 'Earrings' });
    const bracelets = await Category.findOne({ name: 'Bracelets' });
    
    const fallbackCategory = await Category.findOne(); // Fallback if specific names don't match
    const getCatId = (cat) => cat ? cat._id : fallbackCategory._id;

    const newProducts = [
      {
        name: 'The Imperial Moissanite Ring',
        description: 'A breathtaking 2-carat equivalent moissanite stone set in 18k white gold plating. Exhibits more fire and brilliance than a natural diamond.',
        price: 24999,
        discount: 15,
        stock: 12,
        category: getCatId(rings),
        material: '18k White Gold Plated',
        color: 'Silver',
        featured: true,
        imageUrls: ['https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=1000&auto=format&fit=crop']
      },
      {
        name: 'Aurora Pearl Drop Earrings',
        description: 'Lustrous freshwater cultured pearls dropping from a delicate cubic zirconia studded arch. Perfect for evening wear and bridal ensembles.',
        price: 8500,
        discount: 0,
        stock: 25,
        category: getCatId(earrings),
        material: 'Sterling Silver Base',
        color: 'Rose Gold',
        featured: false,
        imageUrls: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop']
      },
      {
        name: 'Eternity Tennis Bracelet',
        description: 'A continuous line of flawlessly matched, brilliant-cut AAAA cubic zirconias. A timeless classic that adds sophisticated sparkle to any wrist.',
        price: 18000,
        discount: 20,
        stock: 8,
        category: getCatId(bracelets),
        material: 'Platinum Plated',
        color: 'Silver',
        featured: true,
        imageUrls: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop']
      },
      {
        name: 'Celeste Sapphire Pendant',
        description: 'A deep oceanic blue lab-created sapphire surrounded by a halo of micro-pave stones. Hangs on a delicate 18-inch cable chain.',
        price: 12500,
        discount: 10,
        stock: 15,
        category: getCatId(necklaces),
        material: '14k Yellow Gold Plated',
        color: 'Gold / Blue',
        featured: true,
        imageUrls: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop']
      },
      {
        name: 'Vintage Emerald Cut Ring',
        description: 'An architectural marvel featuring a 3-carat emerald cut simulated diamond, accented by tapered baguettes. Vintage glamour meets modern ethical fashion.',
        price: 28000,
        discount: 0,
        stock: 5,
        category: getCatId(rings),
        material: '18k Yellow Gold Plated',
        color: 'Gold',
        featured: false,
        imageUrls: ['https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=1000&auto=format&fit=crop']
      },
      {
        name: 'Nova Chandelier Earrings',
        description: 'Cascading tiers of brilliant cut stones that catch the light with every movement. The ultimate statement piece for black-tie events.',
        price: 15000,
        discount: 25,
        stock: 10,
        category: getCatId(earrings),
        material: 'Rhodium Plated',
        color: 'Silver',
        featured: false,
        imageUrls: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop']
      },
      {
        name: 'The Royal Kundan Choker',
        description: 'Inspired by royal heritage, this heavy bridal piece features uncut glass stones and faux pearls. Exquisitely handcrafted for the modern bride.',
        price: 45000,
        discount: 5,
        stock: 3,
        category: getCatId(necklaces),
        material: '22k Gold Plated Brass',
        color: 'Gold / Kundan',
        featured: true,
        imageUrls: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop']
      }
    ];

    await Product.insertMany(newProducts);
    
    console.log('Successfully added 7 luxury products!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedProducts();
