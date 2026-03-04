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
  roomId: z.string(),
  userId: z.string(),
});

export const getMessagesParamsSchema = z.object({
  roomId: z.string(),
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
  id: z.string(),
});

export type SendMessageSchema = z.infer<typeof sendMessageSchema>;
export type GetMessagesParamsSchema = z.infer<typeof getMessagesParamsSchema>;
export type UpdateMessageSchema = z.infer<typeof updateMessageSchema>;
export type DeleteMessageParamsSchema = z.infer<
  typeof deleteMessageParamsSchema
>;
