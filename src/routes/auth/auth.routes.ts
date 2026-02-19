import {
  login,
  logout,
  register,
  resetPasswordController,
  sendOtpController,
  verifyOtpController,
} from "@/controllers/auth/auth.controller";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/forgot-password", sendOtpController);
authRouter.post("/verify-reset-otp", verifyOtpController);
authRouter.post("/reset-password", resetPasswordController);
