import { Request, Response } from "express";
import { IRoom, RoomModel } from "../models/room.model";
import {
  createRoomSchema,
  getMyRoomsParamsSchema,
  getRoomByIdParamsSchema,
  getRoomByIdQueriesSchema,
  updateRoomSchema,
} from "../validation/room";
import { ParticipantModel } from "../models/participant.model";
import {
  addParticipantSchema,
  removeParticipantSchema,
} from "../validation/participant";

export const createRoom = async (req: Request, res: Response) => {
  const { name, image, lastMessage, lastMessageTime, type } = req.body;

  const validated = createRoomSchema.safeParse({
    name,
    image,
    lastMessage,
    lastMessageTime,
    type,
  });

  if (!validated.success) {
    return res.status(400).json({ message: validated.error.issues });
  }

  const room = await RoomModel.create(validated.data);

  // Add creator as participant
  if (req.user) {
    await ParticipantModel.create({
      roomId: room.id,
      userId: req.user.id,
    });
  }

  res.status(201).json(room);
};

export const getRooms = async (req: Request, res: Response) => {
  const validatedParams = getMyRoomsParamsSchema.safeParse(req.params);
  const validatedQueries = getRoomByIdQueriesSchema.safeParse(req.query);

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.issues });
  }

  if (!validatedQueries.success) {
    return res.status(400).json({ message: validatedQueries.error.issues });
  }

  const userId = validatedParams.data.userId || req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const userRooms = await ParticipantModel.find({
    userId: userId,
  });

  const roomIds = userRooms.map((p) => p.roomId);

  const query: any = {
    _id: { $in: roomIds },
  };

  if (validatedQueries.data.search) {
    query.name = {
      $regex: validatedQueries.data.search,
      $options: "i",
    };
  }

  const rooms = await RoomModel.find(query);

  const roomsWithParticipants = await Promise.all(
    rooms.map(async (room) => {
      const participants = await ParticipantModel.find({
        roomId: room.id,
      }).populate("userId", "name email username image");
      return { ...room.toJSON(), participants };
    }),
  );

  res.status(200).json(roomsWithParticipants);
};

export const getRoomById = async (req: Request, res: Response) => {
  const validatedParams = getRoomByIdParamsSchema.safeParse(req.params);

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.issues });
  }

  const room = await RoomModel.findById(validatedParams.data.id);

  const participants = await ParticipantModel.find({
    roomId: validatedParams.data.id,
  }).populate("userId", "name email username image");

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  res.status(200).json({ room, participants });
};

export const updateRoom = async (req: Request, res: Response) => {
  const validatedParams = getRoomByIdParamsSchema.safeParse(req.params);
  const validatedBody = updateRoomSchema.safeParse(req.body);

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.issues });
  }

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.issues });
  }

  const room = await RoomModel.findByIdAndUpdate(
    validatedParams.data.id,
    validatedBody.data,
    { new: true },
  );

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  res.status(200).json(room);
};

export const deleteRoom = async (req: Request, res: Response) => {
  const validatedParams = getRoomByIdParamsSchema.safeParse(req.params);

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.issues });
  }

  const room = await RoomModel.findByIdAndDelete(validatedParams.data.id);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  res.status(200).json(room);
};

export const addParticipant = async (req: Request, res: Response) => {
  const validatedParams = getRoomByIdParamsSchema.safeParse(req.params);
  const validatedBody = addParticipantSchema.safeParse(req.body);

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.issues });
  }

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.issues });
  }

  const newParticipant = await ParticipantModel.create({
    roomId: validatedParams.data.id,
    userId: validatedBody.data.userId,
  });

  await newParticipant.populate([
    { path: "userId", select: "name email username image" },
    { path: "roomId", select: "name image" },
  ]);

  res.status(200).json(newParticipant);
};

export const removeParticipant = async (req: Request, res: Response) => {
  // logic to remove a user from a room
  const validatedParams = getRoomByIdParamsSchema.safeParse(req.params);
  const validatedBody = removeParticipantSchema.safeParse(req.body);

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.issues });
  }

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.issues });
  }

  const participant = await ParticipantModel.findOneAndDelete({
    roomId: validatedParams.data.id,
    userId: validatedBody.data.userId,
  });

  if (!participant) {
    return res.status(404).json({ message: "Participant not found" });
  }

  res.status(200).json(participant);
};
