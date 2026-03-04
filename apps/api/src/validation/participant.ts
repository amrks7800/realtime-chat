import { z } from "zod";

export const addParticipantSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
});

export const removeParticipantSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
});

export type AddParticipantSchema = z.infer<typeof addParticipantSchema>;
export type RemoveParticipantSchema = z.infer<typeof removeParticipantSchema>;