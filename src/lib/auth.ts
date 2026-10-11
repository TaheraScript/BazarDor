import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string);
const db = client.db('bazar_mart');

export const auth = betterAuth({
  // REQUIREMENT: on Vercel this must be your live domain (set BETTER_AUTH_URL in Vercel).
  // Without it, auth falls back to localhost, which caused your CORS errors.
  baseURL: process.env.BETTER_AUTH_URL,

  // REQUIREMENT: allow both the deployed site and local development
  trustedOrigins: [
    "https://bazar-mart-next-js.vercel.app",
    "http://localhost:3000",
  ],

  emailAndPassword: {
    enabled: true,
    // REQUIREMENT: after signup the user goes to the login page, so don't auto sign them in
    autoSignIn: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: ["user:email"], // REQUIREMENT: GitHub users with a private email would otherwise get no email
    },
  },

  // REQUIREMENT: fixes unable_to_link_account when the same email already exists
  // (for example from email sign-up) and the user then logs in with Google or GitHub
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
});