import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { env } from "./lib/env";
import { createServer, Server } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { setupIOHandlers } from "./routes/socket/handlers";

import userRoutes from "./routes/user.routes";
import roomRoutes from "./routes/room.routes";
import messageRoutes from "./routes/message.routes";
import uploadRoutes from "./routes/upload.routes";
import invitationRoutes from "./routes/invitation.routes";

export const createServerExpress = (): Server => {
  const expressApp = express();
  const httpServer = createServer(expressApp);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  setupIOHandlers(io);

  expressApp
    .disable("x-powered-by")
    .use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      }),
    )
    .use(morgan("dev"))
    .all("/api/auth/*", toNodeHandler(auth.handler))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use("/api/users", userRoutes)
    .use("/api/rooms", roomRoutes)
    .use("/api/messages", messageRoutes)
    .use("/api/upload", uploadRoutes)
    .use("/api/invitations", invitationRoutes)
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });

  return httpServer;
};
