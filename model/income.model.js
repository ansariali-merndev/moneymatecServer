import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userEmail: { type: String, required: true },
  incomeData: [
    {
      amount: { type: String, required: true },
      emoji: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  expenseData: [
    {
      amount: { type: String, required: true },
      emoji: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
});

export const financeDB = mongoose.model("finance", financeSchema);
