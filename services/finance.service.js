import { financeDB } from "../model/income.model.js";

export const findFinanceDatByUserId = async (userId) => {
  return await financeDB.findOne({ userId: userId });
};
