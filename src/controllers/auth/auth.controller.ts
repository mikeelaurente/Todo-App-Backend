// libraries
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
// Models
import Account from "@/models/account/account.model";
// Services
import {
  findAccountS,
  pushSessionS,
  registerAccountS,
} from "@/services/account/account.service";
// Utils
import { generateOtp, verifyOtp } from "@/services/otp/otp.service";
import { compareHashed, hashedValue } from "@/utils/bcrypt/bycrypt.util";
import {
  clearRefreshCookie,
  REFRESH_COOKIE_NAME,
  setRefreshCookie,
} from "@/utils/cookie/cookie.util";
import { AppError } from "@/utils/error/app-error.util";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt/jwt.util";
import { sendScheduleConfirmationEmail } from "@/utils/mailer/schedule-confirmation-email";
import { buildSession } from "@/utils/session/session.util";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  // Get the data from request body
  const { username, email, password } = req.body;

  // Validate the data
  if (!username) throw new AppError("Name is required.", 400);
  if (!email) throw new AppError("Email is required.", 400);
  if (!password) throw new AppError("Password is required.", 400);

  // Check if the email already exist
  if (await findAccountS({ email }))
    throw new AppError("Email already exist.", 409);

  // Create the account
  const account = await registerAccountS({
    username,
    email,
    password: await hashedValue(password),
  });
  if (!account) throw new AppError("Failed to create account.", 500);

  // Get uuid
  const sid = uuid();

  // Generate tokens
  const sub = String(account._id);
  const accessToken = signAccessToken(sub);
  const refreshToken = signRefreshToken(sub, sid);

  // Build session and save it in database
  const session = await buildSession(req, refreshToken, sid);

  // Push the session to database
  const updated = await pushSessionS(String(account._id), session);
  if (!updated) throw new AppError("Account not found.", 404);

  // Set the refresh token in cookie
  setRefreshCookie(res, refreshToken);

  // Send response
  return res.status(200).json({
    message: "Account registered successfully.",
    accessToken,
  });
};

export const login = async (req: Request, res: Response) => {
  // Get the data from request body
  const { email, password } = req.body;

  // Validate the data
  if (!email) throw new AppError("Email is required.", 400);
  if (!password) throw new AppError("Password is required.", 400);

  // Find the account by email
  const account = await findAccountS({ email });
  if (!account) throw new AppError("Account not found.", 404);

  // Compare the password with the hashed password in database
  const ok = await compareHashed(password, account.password);
  if (!ok) throw new AppError("Invalid Credentials.", 400);

  // Get uuid
  const sid = uuid();

  // Generate tokens
  const sub = String(account._id);
  const accessToken = signAccessToken(sub);
  const refreshToken = signRefreshToken(sub, sid);

  // Build session and save it in database
  const session = await buildSession(req, refreshToken, sid);

  // Push the session to database
  const updated = await pushSessionS(String(account._id), session);
  if (!updated) throw new AppError("Account not found.", 404);

  // Set the refresh token in cookie
  setRefreshCookie(res, refreshToken);

  // Send response
  return res.status(200).json({
    message: "Login successfully.",
    accessToken,
  });
};

export const logout = async (req: Request, res: Response) => {
  // Get the refresh token from cookie
  const token = req.cookies?.[REFRESH_COOKIE_NAME];

  // Revoke the refresh token by removing the session from database
  if (token) {
    try {
      const payload = verifyRefreshToken(token) as { sub: string; sid: string };

      // revoke ONLY this session (preferred)
      await Account.updateOne(
        { _id: payload.sub },
        { $pull: { sessions: { sid: payload.sid } } },
      );
    } catch (err) {
      // log only in development
      if (process.env.NODE_ENV !== "production")
        console.error("Logout verify failed:", err);
    }
  }

  // Clear the refresh token cookie
  clearRefreshCookie(res);

  // Send response
  return res.status(200).json({ message: "Logged out successfully." });
};

export const sendOtpController = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await Account.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = await generateOtp(user._id, "PASSWORD_RESET");

    await sendScheduleConfirmationEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { otp } = req.body;

  try {
    if (!email) {
      throw new AppError("Email is required.", 400);
    }

    if (!otp) {
      throw new AppError("OTP is required.", 400);
    }

    const user = await Account.findOne({ email });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    await verifyOtp(user._id, otp, "PASSWORD_RESET");

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_RESET_PASSWORD_TOKEN as string,
      { expiresIn: "5m" },
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error.message);

    return res.status(400).json({
      message: error.message || "Invalid or expired OTP",
    });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    if (!token) {
      throw new AppError("Reset token is required.", 401);
    }

    if (!newPassword) {
      throw new AppError("New password is required.", 400);
    }

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_RESET_PASSWORD_TOKEN as string,
    );

    if (typeof decoded !== "object" || !decoded || !("userId" in decoded)) {
      throw new AppError("Invalid or expired reset token.", 401);
    }

    const userId = decoded.userId as string;

    const user = await Account.findById(userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    user.password = await hashedValue(newPassword);
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error.message);

    return res.status(400).json({
      message: error.message || "Invalid or expired reset token",
    });
  }
};
