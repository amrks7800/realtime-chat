import { createClient } from "@repo/sdk";

export const authClient = createClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
);

export const { signIn, signUp, signOut, useSession } = authClient;
