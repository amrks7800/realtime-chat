import { Server, Socket } from "socket.io";
import { auth } from "../../lib/auth";
import { ParticipantModel } from "../../models/participant.model";
import { Events } from "@repo/types";
import { MessageModel } from "../../models/message.model";
import { RoomModel } from "../../models/room.model";

export async function setupIOHandlers(io: Server) {
  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const session = await auth.api.getSession({
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });

    if (!session) {
      return next(new Error("Authentication error"));
    }

    const allUserRooms = await ParticipantModel.find({
      userId: session.user.id,
    }).select("roomId");

    allUserRooms.forEach((room) => {
      socket.join(room.roomId);
    });

    socket.userId = session.user.id;

    next();
  });
  io.on("connection", (socket: Socket) => {
    console.log("a user connected", socket.id);

    const handleSendMessage: Events["send-message"] = async (data) => {
      try {
        // Basic security check: ensure the user is in the room
        if (!socket.rooms.has(data.roomId)) {
          return;
        }

        const message = await MessageModel.create({
          userId: socket.userId,
          roomId: data.roomId,
          content: data.content,
          attachments: data.attachments,
        });

        const populatedMessage = await MessageModel.findById(message._id)
          .populate("userId", "name username image")
          .exec();

        if (populatedMessage) {
          // Update room with last message
          await RoomModel.findByIdAndUpdate(data.roomId, {
            lastMessage: data.content,
            lastMessageTime: new Date(),
          });

          io.to(data.roomId).emit(
            "receive-message",
            populatedMessage.toJSON({ virtuals: true }),
          );
        }
      } catch (error) {
        console.error("send-message error:", error);
      }
    };

    const handleJoinRoom: Events["join-room"] = async (data) => {
      // Security check: verify user is actually a participant in this room
      const isParticipant = await ParticipantModel.exists({
        userId: socket.userId,
        roomId: data.roomId,
      });

      if (isParticipant) {
        socket.join(data.roomId);
      }
    };

    const handleLeaveRoom: Events["leave-room"] = (data) => {
      socket.leave(data.roomId);
    };

    socket.on("send-message", handleSendMessage);
    socket.on("join-room", handleJoinRoom);
    socket.on("leave-room", handleLeaveRoom);

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
}
