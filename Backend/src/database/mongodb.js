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
    // Remove bufferCommands: false to allow buffering
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000,
      // Remove bufferCommands: false to allow queries to buffer while connecting
    };

    await mongoose.connect(DB_URI, options);

    console.log(`Connected to DB successfully in ${NODE_ENV} mode`);

    // Connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectToDB;
