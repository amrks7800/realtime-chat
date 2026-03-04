import mongoose from "mongoose";

export interface IInvitation {
  senderId: string;
  receiverId: string;
  roomId?: string; // Optional if it's a direct chat invitation
  status: "pending" | "accepted" | "declined";
  type: "direct" | "group";
}

const invitationSchema = new mongoose.Schema<IInvitation>(
  {
    senderId: { type: String, required: true, ref: "user" },
    receiverId: { type: String, required: true, ref: "user" },
    roomId: { type: String, ref: "room" },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

export const InvitationModel = mongoose.model<IInvitation>(
  "invitation",
  invitationSchema,
);
