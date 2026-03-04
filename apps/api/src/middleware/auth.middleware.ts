import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = session.user;
  next();
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}
