import { z } from "zod";

export const createInvitationSchema = z.object({
  receiverId: z.string(),
  roomId: z.string().optional(),
  type: z.enum(["direct", "group"]),
});

export const updateInvitationStatusSchema = z.object({
  status: z.enum(["accepted", "declined"]),
});
