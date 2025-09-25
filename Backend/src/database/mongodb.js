// import mongoose from "mongoose";
// import { DB_URI, NODE_ENV } from "../config/env.js";

// if (!DB_URI) {
//   throw new Error(
//     "Please define the DB_URI environment variable inside .env.<development/production>.local"
//   );
// }

// const connectToDB = async () => {
//   try {
//     await mongoose.connect(DB_URI);
//     console.log(`Connected to DB successfully in ${NODE_ENV} mode`);
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);
//   }
// };

// export default connectToDB;
// database/mongodb.js
import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Please define the DB_URI environment variable inside .env.<development/production>.local"
  );
}

const connectToDB = async () => {
  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    // Set connection options
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable buffering
      bufferMaxEntries: 0, // Disable buffering
    };

    await mongoose.connect(DB_URI, options);
    
    console.log(`Connected to DB successfully in ${NODE_ENV} mode`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Don't exit process in production, let the app handle reconnection
    if (NODE_ENV === 'development') {
      process.exit(1);
    }
    throw error;
  }
};

export default connectToDB;