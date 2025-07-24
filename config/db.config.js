import mongoose from "mongoose";
import { env } from "../lib/env.js";
import { handleError } from "../lib/utils.js";

const uri = env.mongodbUri;

export const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: "MoneyMate",
    });
    console.log("DB connected successfully");
  } catch (error) {
    handleError(error.message, "Failed to connect to the database");
  }
};
