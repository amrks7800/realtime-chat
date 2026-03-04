import mongoose from "mongoose";

export interface IMessage {
  userId: string;
  roomId: string;
  content: string;
  attachments?: {
    type: "image" | "video" | "file" | "audio";
    url: string;
  }[];
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    userId: { type: String, required: true, ref: "user" },
    roomId: { type: String, required: true, ref: "room" },
    content: { type: String, required: true },
    attachments: {
      type: [
        {
          type: {
            type: String,
            enum: ["image", "video", "file", "audio"],
            required: true,
          },
          url: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const MessageModel = mongoose.model<IMessage>("message", messageSchema);
