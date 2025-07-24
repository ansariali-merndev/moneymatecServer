import { configDotenv } from "dotenv";

configDotenv();
export const env = {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  gmailId: process.env.GMAIL_ID,
  gmailPass: process.env.GMAIL_PASS,
  hmac_secret: process.env.HMAC_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
};
