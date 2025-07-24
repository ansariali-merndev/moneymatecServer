import crypto, { createHmac } from "crypto";
import { env } from "./env.js";

export const handleError = (error, message) => {
  console.error(error);
  throw new Error(message || "Internal Server Error");
};

export const generateOTP = () => {
  return crypto.randomInt(1000, 10000);
};

export const generateToken = (id, name, email) => {
  const value = `${name}-${email}`;

  const token = createHmac("sha256", env.hmac_secret)
    .update(value)
    .digest("hex");

  return `${token}.${id}`;
};
