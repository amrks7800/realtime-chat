import { Request, Response } from "express";
import { MessageModel } from "../models/message.model";
import {
  sendMessageSchema,
  getMessagesParamsSchema,
  updateMessageSchema,
  deleteMessageParamsSchema,
} from "../validation/message";

export const sendMessage = async (req: Request, res: Response) => {
  const validated = sendMessageSchema.safeParse(req.body);

  if (!validated.success) {
    return res.status(400).json({ message: validated.error.issues });
  }

  const message = await MessageModel.create(validated.data);

  res.status(201).json(message);
};

export const getMessages = async (req: Request, res: Response) => {
  const validated = getMessagesParamsSchema.safeParse(req.params);

  if (!validated.success) {
    return res.status(400).json({ message: validated.error.issues });
  }

  const messages = await MessageModel.find({
    roomId: validated.data.roomId,
  })
    .sort({ createdAt: 1 })
    .populate("userId", "name username image");

  res.status(200).json(messages);
};

export const updateMessage = async (req: Request, res: Response) => {
  const validatedParams = deleteMessageParamsSchema.safeParse(req.params);
  const validatedBody = updateMessageSchema.safeParse(req.body);

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.issues });
  }

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.issues });
  }

  const message = await MessageModel.findByIdAndUpdate(
    validatedParams.data.id,
    validatedBody.data,
    { new: true },
  );

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.status(200).json(message);
};

export const deleteMessage = async (req: Request, res: Response) => {
  const validated = deleteMessageParamsSchema.safeParse(req.params);

  if (!validated.success) {
    return res.status(400).json({ message: validated.error.issues });
  }

  const message = await MessageModel.findByIdAndDelete(validated.data.id);

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.status(200).json(message);
};
