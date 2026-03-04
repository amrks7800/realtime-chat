import { RoomModel, IRoom } from "../models/room.model";
import { ParticipantModel } from "../models/participant.model";

export class RoomRepository {
  async createRoom(room: IRoom) {
    return RoomModel.create(room);
  }
  async getRoomById(id: string) {
    return RoomModel.findById(id);
  }
  async getAllRoomsByUserId({ userId, limit = 10, offset = 0 }: { userId: string; limit?: number; offset?: number }) {
    const participants = await ParticipantModel.find({ userId });
    return RoomModel.find({ _id: { $in: participants.map((p) => p.roomId) } }).limit(limit).skip(offset);
  }
  async updateRoom(id: string, room: Partial<IRoom>) {
    return RoomModel.findByIdAndUpdate(id, room, { new: true });
  }
  async deleteRoom(id: string) {
    return RoomModel.findByIdAndDelete(id);
  }
}

export const roomRepository = new RoomRepository();