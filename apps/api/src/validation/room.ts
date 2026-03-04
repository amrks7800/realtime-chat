import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(3).max(255),
  image: z.string().optional(),
  lastMessage: z.string().optional(),
  lastMessageTime: z.date().optional(),
  type: z.enum(["private", "group"]),
});

export const updateRoomSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  image: z.string().optional(),
  lastMessage: z.string().optional(),
  lastMessageTime: z.date().optional(),
  type: z.enum(["private", "group"]).optional(),
});

export const getMyRoomsParamsSchema = z.object({
  userId: z.uuid(),
});

export const getRoomByIdQueriesSchema = z.object({
  search: z.string().optional(),
});

export const getRoomByIdParamsSchema = z.object({
  id: z.uuid(),
});

export type GetMyRoomsParamsSchema = z.infer<typeof getMyRoomsParamsSchema>;
export type GetRoomByIdQueriesSchema = z.infer<typeof getRoomByIdQueriesSchema>;
export type GetRoomByIdParamsSchema = z.infer<typeof getRoomByIdParamsSchema>;
export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
export type UpdateRoomSchema = z.infer<typeof updateRoomSchema>;
