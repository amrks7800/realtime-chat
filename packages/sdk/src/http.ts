import axios, { AxiosInstance } from "axios";
import { Message, Room, Participant } from "@repo/types";

export class HttpSDK {
  public client: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Messages
  async getMessages(roomId: string): Promise<Message[]> {
    const { data } = await this.client.get(`/api/messages/${roomId}`);
    return data;
  }

  // Rooms
  async getRooms(userId: string): Promise<Room[]> {
    const { data } = await this.client.get(`/api/rooms/my/${userId}`);
    return data;
  }

  async getRoom(
    roomId: string,
  ): Promise<{ room: Room }> {
    const { data } = await this.client.get(`/api/rooms/${roomId}`);
    return data;
  }

  async createRoom(roomData: Partial<Room>): Promise<Room> {
    const { data } = await this.client.post("/api/rooms", roomData);
    return data;
  }

  // Upload
  async uploadFile(file: File): Promise<{ url: string; fileName: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await this.client.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  async checkUsername(username: string): Promise<{ available: boolean }> {
    const { data } = await this.client.get("/api/users/check-username", {
      params: { username },
    });
    return data;
  }

  async searchUsers(search: string): Promise<User[]> {
    const { data } = await this.client.get("/api/users/search", {
      params: { search },
    });
    return data;
  }

  // Invitations
  async sendInvitation(invitationData: {
    receiverId: string;
    type: "direct" | "group";
    roomId?: string;
  }): Promise<any> {
    const { data } = await this.client.post("/api/invitations", invitationData);
    return data;
  }

  async getMyInvitations(): Promise<any[]> {
    const { data } = await this.client.get("/api/invitations/my");
    return data;
  }

  async respondToInvitation(
    invitationId: string,
    status: "accepted" | "declined",
  ): Promise<any> {
    const { data } = await this.client.patch(
      `/api/invitations/${invitationId}`,
      { status },
    );
    return data;
  }
}

import { User } from "@repo/types";
