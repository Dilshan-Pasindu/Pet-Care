/**
 * database.js
 * ─────────────────────────────────────────────────────────────
 * MongoDB Atlas connection using Mongoose.
 *
 * Purpose:
 *   Establishes and manages the connection to the MongoDB Atlas
 *   database. Called once at server startup from server.js.
 *
 * Environment Variable Required:
 *   MONGODB_URI — Full Atlas connection string from .env
 *
 * Usage:
 *   const connectDB = require('./src/config/database');
 *   await connectDB();
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options prevent deprecation warnings in newer Mongoose versions
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit process with failure — server cannot run without a database
    process.exit(1);
  }
};

module.exports = connectDB;
