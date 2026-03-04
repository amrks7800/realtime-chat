import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { bearer } from "better-auth/plugins";
import mongoose from "mongoose";

const db = mongoose.connection;

export const auth = betterAuth({
  database: mongodbAdapter(db as unknown as mongoose.mongo.Db),
  user: {
    additionalFields: {
      username: {
        type: "string",
      },
    },
  },
  plugins: [bearer()],
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
});
