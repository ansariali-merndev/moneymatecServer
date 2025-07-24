import { categoryDB } from "../model/category.model.js";

export const saveDefaultCategory = async (id, email) => {
  const defaultCategory = [
    { name: "Salary", emoji: "💰", type: "income" },
    { name: "Bonus", emoji: "🎁", type: "income" },
    { name: "Utility", emoji: "💡", type: "expense" },
    { name: "Groceries", emoji: "🛒", type: "expense" },
    { name: "Cashback", emoji: "💵", type: "income" },
  ];

  const categoryDoc = new categoryDB({
    userId: id,
    userEmail: email,
    categories: defaultCategory,
  });

  await categoryDoc.save();
};

export const findCategoryByUserId = async (userId) => {
  return await categoryDB.findOne({ userId: userId });
};

export const AddUserCategories = async (userId, category) => {
  const userCategories = await findCategoryByUserId(userId);

  if (!userCategories) {
    return;
  }

  userCategories.categories.push(category);

  await userCategories.save();
};
