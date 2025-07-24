import { handleError } from "../lib/utils.js";
import { userDB } from "../model/user.model.js";

export const findUserByEmail = async (email) => {
  try {
    const user = await userDB.findOne({ email });

    return user;
  } catch (error) {
    handleError(error.message, "Failed to find user by email");
  }
};

export const createUser = async (userData) => {
  try {
    const newUser = new userDB(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    handleError(error.message, "Failed to create user");
  }
};

export const findUserById = async (id) => {
  try {
    const user = await userDB.findById(id);
    return user;
  } catch (error) {
    handleError(error.message, "Failed to find user by ID");
  }
};
