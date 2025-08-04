import { Router } from "express";
import {
  authorized,
  login,
  logout,
  register,
  resendEmail,
  verifyEmail,
  verifyToken,
} from "../controller/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-otp", resendEmail);
authRouter.post("/login", login);
authRouter.get("/authorized", authorized);
authRouter.get("/logout", logout);
authRouter.post("/verifyToken", verifyToken);
