const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to DB');
    
    // Update all users to have the ADMIN role
    const result = await User.updateMany({}, { $set: { role: 'ADMIN' } });
    
    console.log(`Successfully upgraded ${result.modifiedCount} user(s) to ADMIN!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();
