import { MessageModel } from "../models/message.model";
import type { IMessage } from "../models/message.model";

export class MessageRepository {
  async createMessage(message: IMessage) {
    return MessageModel.create(message);
  }
  async getMessageById(id: string) {
    return MessageModel.findById(id);
  }
  async getAllMessagesByRoomId({ roomId, limit = 10, offset = 0 }: { roomId: string; limit?: number; offset?: number }) {
    return MessageModel.find({ roomId }).limit(limit).skip(offset);
  }
  async updateMessage(id: string, message: Partial<IMessage>) {
    return MessageModel.findByIdAndUpdate(id, message, { new: true });
  }
  async deleteMessage(id: string) {
    return MessageModel.findByIdAndDelete(id);
  }
}

export const messageRepository = new MessageRepository();
