const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
  try {
    // MongoDB Atlas connection URI
  const url = process.env.MONGODB_URL ;
  console.log(url)

    // Connect to MongoDB Atlas
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
