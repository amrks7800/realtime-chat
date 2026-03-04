export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  image?: string;
  _id?: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string | User;
  roomId: string;
  attachments?: {
    type: "image" | "video" | "file" | "audio";
    url: string;
  }[];
  createdAt: string;
  _id?: string;
}

export interface Room {
  id: string;
  name: string;
  image?: string;
  type: "group" | "private";
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt: string;
  participants?: Participant[];
  _id?: string;
}

export interface Participant {
  id: string;
  userId: User;
  roomId: string;
  role: "admin" | "member";
  _id?: string;
}

export interface MessagePayload {
  roomId: string;
  content: string;
  attachments?: {
    type: "image" | "video" | "file" | "audio";
    url: string;
  }[];
}

export interface JoinRoomPayload {
  roomId: string;
}

export type Events = {
  "send-message": (data: MessagePayload) => void;
  "receive-message": (data: Message) => void;
  "join-room": (data: JoinRoomPayload) => void;
  "leave-room": (data: JoinRoomPayload) => void;
};
