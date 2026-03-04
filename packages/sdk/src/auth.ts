import { createAuthClient } from "better-auth/react";
import { bearer } from "better-auth/plugins";

export const createClient = (baseUrl: string) => {
  return createAuthClient({
    baseURL: baseUrl,
    plugins: [bearer()],
  });
};
