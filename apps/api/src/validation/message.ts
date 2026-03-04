import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.string().min(1),
  attachments: z
    .array(
      z.object({
        type: z.enum(["image", "video", "file", "audio"]),
        url: z.string().url(),
      }),
    )
    .optional(),
  roomId: z.uuid(),
  userId: z.uuid(),
});

export const getMessagesParamsSchema = z.object({
  roomId: z.uuid(),
});

export const updateMessageSchema = z.object({
  content: z.string().optional(),
  attachments: z
    .array(
      z.object({
        type: z.enum(["image", "video", "file", "audio"]),
        url: z.string().url(),
      }),
    )
    .optional(),
});

export const deleteMessageParamsSchema = z.object({
  id: z.uuid(),
});

export type SendMessageSchema = z.infer<typeof sendMessageSchema>;
export type GetMessagesParamsSchema = z.infer<typeof getMessagesParamsSchema>;
export type UpdateMessageSchema = z.infer<typeof updateMessageSchema>;
export type DeleteMessageParamsSchema = z.infer<
  typeof deleteMessageParamsSchema
>;
