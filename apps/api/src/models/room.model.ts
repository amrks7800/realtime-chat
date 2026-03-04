import mongoose from "mongoose";
import { z } from "zod";

export interface IRoom {
  name: string;
  image?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  type: "private" | "group";
}

const roomSchema = new mongoose.Schema<IRoom>(
  {
    name: { type: String, required: true },
    image: { type: String, required: false },
    lastMessage: { type: String, required: false },
    lastMessageTime: { type: Date, required: false },
    type: { type: String, required: true, enum: ["private", "group"] },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);



export const RoomModel = mongoose.model<IRoom>("room", roomSchema);
