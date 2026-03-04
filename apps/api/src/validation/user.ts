import { z } from "zod";

export const searchUsersQueriesSchema = z.object({
  search: z.string().optional(),
});

export const getProfileParamsSchema = z.object({
  userId: z.uuid(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  image: z.string().optional(),
  username: z.string().min(3).max(255).optional(),
});

export type SearchUsersQueriesSchema = z.infer<typeof searchUsersQueriesSchema>;
export type GetProfileParamsSchema = z.infer<typeof getProfileParamsSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
