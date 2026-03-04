import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  mongoose.connection.on("connected", () => {
    console.log("🟢 MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("🔴 MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("🟡 MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🟢 MongoDB reconnected");
  });

  try {
    if (!env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(env.MONGO_URI);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
