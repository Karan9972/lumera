const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const categories = [
  { name: 'Necklaces' },
  { name: 'Rings' },
  { name: 'Earrings' },
  { name: 'Bracelets' },
  { name: 'Bridal Sets' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to DB');
    
    // Clear existing (if any) and insert new
    await Category.deleteMany();
    await Category.insertMany(categories);
    
    console.log('Successfully added 5 luxury categories!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedCategories();
