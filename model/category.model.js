import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userEmail: { type: String, required: true },
  categories: [
    {
      name: { type: String, required: true },
      emoji: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
});

export const categoryDB = mongoose.model("Category", categorySchema);
