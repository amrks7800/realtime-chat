import { Request, Response } from "express";
import { InvitationModel } from "../models/invitation.model";
import { ParticipantModel } from "../models/participant.model";
import { RoomModel } from "../models/room.model";
import {
  createInvitationSchema,
  updateInvitationStatusSchema,
} from "../validation/invitation";

export const sendInvitation = async (req: Request, res: Response) => {
  const validated = createInvitationSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({ errors: validated.error.issues });
  }

  // Check if invitation already exists
  const existing = await InvitationModel.findOne({
    senderId: req.user.id,
    receiverId: validated.data.receiverId,
    roomId: validated.data.roomId,
    status: "pending",
  });

  if (existing) {
    return res.status(400).json({ message: "Invitation already pending" });
  }

  const invitation = await InvitationModel.create({
    ...validated.data,
    senderId: req.user.id,
  });

  res.status(201).json(invitation);
};

export const getMyInvitations = async (req: Request, res: Response) => {
  const invitations = await InvitationModel.find({
    receiverId: req.user.id,
    status: "pending",
  })
    .populate("senderId", "name username image")
    .populate("roomId", "name image");

  res.status(200).json(invitations);
};

export const respondToInvitation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const validated = updateInvitationStatusSchema.safeParse(req.body);

  if (!validated.success) {
    return res.status(400).json({ errors: validated.error.issues });
  }

  const invitation = await InvitationModel.findById(id);
  if (!invitation) {
    return res.status(404).json({ message: "Invitation not found" });
  }

  if (invitation.receiverId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  invitation.status = validated.data.status;
  await invitation.save();

  if (validated.data.status === "accepted") {
    let roomId = invitation.roomId;

    // If it's a direct invitation without a room, create one
    if (invitation.type === "direct" && !roomId) {
      const room = await RoomModel.create({
        name: "Direct Chat",
        type: "private",
      });
      roomId = room.id;

      // Add sender
      await ParticipantModel.create({
        roomId: room.id,
        userId: invitation.senderId,
      });
    }

    // Add receiver to the room
    if (roomId) {
      await ParticipantModel.create({
        roomId,
        userId: req.user.id,
      });
    }
  }

  res.status(200).json(invitation);
};
