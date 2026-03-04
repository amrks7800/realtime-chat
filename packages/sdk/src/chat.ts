import { io, Socket } from "socket.io-client";
import type {
  Events,
  Message,
  JoinRoomPayload,
  MessagePayload,
} from "@repo/types";
import { useEffect, useMemo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { HttpSDK } from "./http";

export class ChatSDK {
  public socket: Socket;
  public http: HttpSDK;

  constructor(baseUrl: string, token: string) {
    this.http = new HttpSDK(baseUrl, token);
    this.socket = io(baseUrl, {
      auth: {
        token,
      },
    });
  }

  onMessage(callback: (data: Message) => void): () => void {
    this.socket.on("receive-message", callback);
    return () => this.socket.off("receive-message", callback);
  }

  sendMessage(data: MessagePayload) {
    this.socket.emit("send-message", data);
  }

  joinRoom(data: JoinRoomPayload) {
    this.socket.emit("join-room", data);
  }

  leaveRoom(data: JoinRoomPayload) {
    this.socket.emit("leave-room", data);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export function useChat(baseUrl: string, token: string) {
  const queryClient = useQueryClient();
  const sdk = useMemo(() => new ChatSDK(baseUrl, token), [baseUrl, token]);

  useEffect(() => {
    if (!token) return;

    const cleanup = sdk.onMessage((newMessage) => {
      const roomId = newMessage.roomId;
      queryClient.setQueryData(
        ["messages", roomId],
        (old: Message[] | undefined) => {
          if (!old) return [newMessage];
          const msgId = newMessage.id || (newMessage as any)._id;
          if (old.find((m) => (m.id || (m as any)._id) === msgId)) return old;
          return [...old, newMessage];
        },
      );
    });

    return () => {
      cleanup();
    };
  }, [sdk, queryClient, token]);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      sdk.disconnect();
    };
  }, [sdk]);

  return sdk;
}

export function useMessages(
  sdk: ChatSDK,
  roomId: string,
): UseQueryResult<Message[]> {
  useEffect(() => {
    if (!roomId) return;
    sdk.joinRoom({ roomId });
    return () => {
      sdk.leaveRoom({ roomId });
    };
  }, [sdk, roomId]);

  return useQuery({
    queryKey: ["messages", roomId],
    queryFn: () => sdk.http.getMessages(roomId),
    enabled: !!roomId,
  });
}

export function useRooms(sdk: ChatSDK, userId: string) {
  return useQuery({
    queryKey: ["rooms", userId],
    queryFn: () => sdk.http.getRooms(userId),
    enabled: !!userId,
  });
}

export function useSendMessage(sdk: ChatSDK) {
  return useMutation({
    mutationFn: async (payload: MessagePayload) => {
      sdk.sendMessage(payload);
      return payload;
    },
    // Note: In real-time apps, we usually wait for the socket "receive-message"
    // to update the UI, but we could do optimistic updates here if needed.
  });
}

export function useUpload(sdk: ChatSDK) {
  return useMutation({
    mutationFn: (file: File) => sdk.http.uploadFile(file),
  });
}
