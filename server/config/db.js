import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || (process.env.NODE_ENV !== "production" ? "mongodb://127.0.0.1:27017/studyvault" : null);

  if (!uri) {
    console.error("MongoDB Error: MONGO_URI environment variable is missing in production.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
  }
}

