import { generateToken } from "./lib/utils.js";
import { findUserById } from "./services/auth.service.js";

export const userMiddleware = async (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.json({
      success: false,
      message: "Unauthorized access. Please log in.",
    });
  }

  const [_, id] = token.split(".");
  let user = await findUserById(id);

  if (!user) {
    return res.json({
      success: false,
      message: "User not found. Please log in again.",
    });
  }

  const generatedToken = generateToken(user._id, user.username, user.email);

  if (generatedToken !== token) {
    return res.json({
      success: false,
      message: "Invalid token. Please log in again.",
    });
  }

  req.user = user;

  next();
};
