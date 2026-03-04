import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import {
  searchUsersQueriesSchema,
  getProfileParamsSchema,
  updateProfileSchema,
  checkUsernameSchema,
} from "../validation/user";

export const searchUsers = async (req: Request, res: Response) => {
  const validated = searchUsersQueriesSchema.safeParse(req.query);

  if (!validated.success) {
    return res.status(400).json({ message: validated.error.issues });
  }

  const query: any = {};

  if (validated.data.search) {
    query.$or = [
      { name: { $regex: validated.data.search, $options: "i" } },
      { username: { $regex: validated.data.search, $options: "i" } },
    ];
  }

  // Exclude current user from search
  if (req.user?.id) {
    query._id = { $ne: req.user.id };
  }

  const users = await UserModel.find(query).limit(10);

  res.status(200).json(users);
};

export const getProfile = async (req: Request, res: Response) => {
  const validated = getProfileParamsSchema.safeParse(req.params);

  if (!validated.success) {
    return res.status(400).json({ message: validated.error.issues });
  }

  const user = await UserModel.findById(validated.data.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

export const updateProfile = async (req: Request, res: Response) => {
  const validatedParams = getProfileParamsSchema.safeParse(req.params);
  const validatedBody = updateProfileSchema.safeParse(req.body);

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.issues });
  }

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.issues });
  }

  const user = await UserModel.findByIdAndUpdate(
    validatedParams.data.userId,
    validatedBody.data,
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

export const checkUsername = async (req: Request, res: Response) => {
  const validated = checkUsernameSchema.safeParse(req.query);

  if (!validated.success) {
    return res.status(400).json({ message: validated.error.issues });
  }

  const user = await UserModel.findOne({ username: validated.data.username });

  res.status(200).json({ available: !user });
};
