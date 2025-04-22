const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const options = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 10000,
  ssl: true
};

async function connectdb() {
  try {
    console.log("Attempting MongoDB connection...");
    mongoose.set('debug', true);
    await mongoose.connect(uri, options);
    console.log("Successfully connected to MongoDB Atlas via Mongoose!");
  } catch (err) {
    console.log("Error connecting to MongoDB Atlas:", err);
  }
}

// connectdb().catch(console.dir);

module.exports = connectdb;
