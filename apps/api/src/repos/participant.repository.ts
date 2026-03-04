import { ParticipantModel } from "../models/participant.model";
import type { IParticipant } from "../models/participant.model";

export class ParticipantRepository {
  async addParticipant(roomId: string, userId: string): Promise<IParticipant> {
    return ParticipantModel.create({ roomId, userId });
  }

  async removeParticipant(roomId: string, userId: string): Promise<IParticipant | null> {
    return ParticipantModel.findOneAndDelete({ roomId, userId });
  }

  async getParticipantsByRoomId(roomId: string): Promise<IParticipant[]> {
    return ParticipantModel.find({ roomId });
  }

  async isUserInRoom(roomId: string, userId: string): Promise<boolean> {
    const participant = await ParticipantModel.findOne({ roomId, userId });
    return !!participant;
  }

  async getRoomsByUserId(userId: string): Promise<IParticipant[]> {
    return ParticipantModel.find({ userId });
  }
}

export const participantRepository = new ParticipantRepository();
