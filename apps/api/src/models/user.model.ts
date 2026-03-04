import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, required: true, default: false },
  image: { type: String },
  username: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export const UserModel = mongoose.model("user", userSchema);
