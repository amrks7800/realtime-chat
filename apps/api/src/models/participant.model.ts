import mongoose from "mongoose";

export interface IParticipant {
  userId: string;
  roomId: string;
}

const participantSchema = new mongoose.Schema<IParticipant>(
  {
    userId: { type: String, required: true, ref: "user" },
    roomId: { type: String, required: true, ref: "room" },
  },
  { timestamps: true },
);

export const ParticipantModel = mongoose.model<IParticipant>(
  "participant",
  participantSchema,
);
