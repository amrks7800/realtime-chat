import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { env } from "./lib/env";
import { createServer, Server } from "node:http";

import userRoutes from "./routes/user.routes";
import roomRoutes from "./routes/room.routes";
import messageRoutes from "./routes/message.routes";
import uploadRoutes from "./routes/upload.routes";

export const createServerExpress = (): Server => {
  const expressApp = express();
  const httpServer = createServer(expressApp);

  expressApp
    .all("/api/auth/*", toNodeHandler(auth.handler))
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(
      cors({
        origin: env.BASE_URL,
        credentials: true,
      }),
    )
    .use("/api/users", userRoutes)
    .use("/api/rooms", roomRoutes)
    .use("/api/messages", messageRoutes)
    .use("/api/upload", uploadRoutes)
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });

  return httpServer;
};
