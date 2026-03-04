import { z } from "zod";

export const addParticipantSchema = z.object({
  roomId: z.uuid(),
  userId: z.uuid(),
});

export const removeParticipantSchema = z.object({
  roomId: z.uuid(),
  userId: z.uuid(),
});

export type AddParticipantSchema = z.infer<typeof addParticipantSchema>;
export type RemoveParticipantSchema = z.infer<typeof removeParticipantSchema>;