import { handleError } from "../lib/utils.js";
import { financeDB } from "../model/income.model.js";
import {
  AddUserCategories,
  findCategoryByUserId,
} from "../services/category.service.js";
import { findFinanceDatByUserId } from "../services/finance.service.js";

export const getRoot = (req, res) => {
  res.json({
    success: true,
    message: "Welcome to MoneyMate API",
  });
};

export const getUserCategories = async (req, res) => {
  try {
    const userId = req.user._id;

    const userCategories = await findCategoryByUserId(userId);

    res.json({
      success: true,
      categories: userCategories.categories,
    });
  } catch (error) {
    handleError(error, "Error fetching user categories");
  }
};

export const AddCategories = async (req, res) => {
  const { name, emoji, type } = req.body;

  try {
    await AddUserCategories(req.user?._id, { name, emoji, type });

    res.json({
      success: true,
      message: "Added",
    });
  } catch (error) {
    handleError(error, "Add Category Error");
  }
};

export const getUserFinance = async (req, res) => {
  const { income } = req.body;
  try {
    const financeData = await findFinanceDatByUserId(req.user._id);

    // console.log(financeData);

    if (!financeData) {
      return res.json({
        success: true,
        data: [],
      });
    }

    res.json({
      success: true,
      data: income ? financeData.incomeData : financeData.expenseData,
    });
  } catch (error) {
    handleError(error);
  }
};

export const AddUserFinance = async (req, res) => {
  const { amount, emoji, type, income } = req.body;

  try {
    let financedata = await findFinanceDatByUserId(req.user._id);

    if (financedata) {
      income
        ? financedata.incomeData.push({ amount, emoji, type })
        : financedata.expenseData.push({ amount, type, emoji });

      await financedata.save();
      return res.json({
        success: true,
        message: "Added Finance data",
      });
    }

    financedata = new financeDB({
      userId: req.user._id,
      userEmail: req.user.email,
      incomeData: [],
      expenseData: [],
    });

    income
      ? financedata.incomeData.push({ amount, emoji, type })
      : financedata.expenseData.push({ amount, emoji, type });

    await financedata.save();

    res.json({
      success: true,
      message: "Added User finance",
    });
  } catch (error) {
    handleError(error, "Add User Finance Error");
  }
};

export const deleteFinance = async (req, res) => {
  const { id, income } = req.body;
  try {
    let financedata = await financeDB.findOne({ userId: req.user._id });

    if (!financedata) {
      return res.json({
        success: false,
        message: "Finance Not Found",
      });
    }

    if (income) {
      financedata.incomeData = financedata.incomeData.filter(
        (item) => item._id.toString() !== id
      );
    } else {
      financedata.expenseData = financedata.expenseData.filter(
        (item) => item._id.toString() !== id
      );
    }

    await financedata.save();

    res.json({
      success: true,
      message: "deleted",
    });
  } catch (error) {
    handleError(error);
  }
};
