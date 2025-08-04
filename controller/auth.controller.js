import { sendMail } from "../config/nodemailer.config.js";
import { hashedPassword, comparePassword } from "../lib/bcrpt.js";
import { generateOTP, generateToken, handleError } from "../lib/utils.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/auth.service.js";
import { saveDefaultCategory } from "../services/category.service.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const username = name;
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.json({
          success: false,
          message: "This account is already verified. Please log in.",
        });
      } else {
        return res.json({
          success: false,
          message: "This user is already registered but not verified.",
        });
      }
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const hashing = await hashedPassword(password);

    const userData = {
      username,
      email,
      password: hashing,
      otp,
      otpExpires,
    };

    await sendMail(email, username, otp);
    let user = await createUser(userData);

    res.json({
      success: true,
      message:
        "Registration successful. Please verify your email using the OTP sent.",
    });
  } catch (error) {
    handleError(error.message, "Failed to register user");
  }
};

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    let user = await findUserByEmail(email);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found, Please Register First",
      });
    }

    if (user.isVerified) {
      return res.json({
        success: false,
        message: "This account is already verified please login",
      });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.json({
        success: false,
        message: "Invalid OTP or OTP has expired. Please try again.",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    const { _id, email: savedEmail } = await user.save();
    await saveDefaultCategory(_id, savedEmail);

    const token = generateToken(user._id, user.username, user.email);

    res.cookie("auth_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    res.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    handleError(error.message, "Failed to verify email");
  }
};

export const resendEmail = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await findUserByEmail(email);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    if (user.isVerified) {
      return res.json({
        success: false,
        message: "This account is already verified. Please log in.",
      });
    }

    const resendOtp = generateOTP();

    await sendMail(email, user.username, resendOtp);
    user.otp = resendOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    res.json({
      success: true,
      message: "OTP resent successfully. Please check your email.",
    });
  } catch (error) {
    handleError(error.message, "Failed to resend email verification");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await findUserByEmail(email);

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Credentials, Please try again.",
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "Invalid Credentials, Please try again.",
      });
    }

    const token = generateToken(user._id, user.username, user.email);

    res.cookie("auth_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    res.json({
      success: true,
      message: "Login successful.",
    });
  } catch (error) {
    handleError(error.message, "Failed to login user");
  }
};

export const authorized = async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized access. Please log in.",
      });
    }

    const [_, id] = token.split(".");
    const user = await findUserById(id);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    const genratedToken = generateToken(user._id, user.username, user.email);

    if (genratedToken !== token) {
      return res.json({
        success: false,
        message: "Invalid Credentials. Please log in again.",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    handleError(error.message, "Failed to authorize user");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("auth_token", { path: "/" });
    res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    handleError(error.message, "Failed to log out user");
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.body;
  try {
    const _id = token.split(".")[1];
    const user = await findUserById(_id);
    return res.json({
      success: user ? true : false,
    });
  } catch (error) {
    handleError(error, "Unable to verify Token");
  }
};
