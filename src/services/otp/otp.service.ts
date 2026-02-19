import { OTP } from "@/models/otp/otp.model";
import crypto from "crypto";
import { Types } from "mongoose";

export const generateOtp = async (
  userId: Types.ObjectId,
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
) => {
  const otp = crypto.randomInt(10000, 100000).toString();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.deleteMany({ userId, type });

  await OTP.create({
    userId,
    code: hashedOtp,
    type,
    expiresAt,
  });

  return otp;
};

export const verifyOtp = async (
  userId: Types.ObjectId,
  inputOtp: string,
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
) => {
  const hashedInput = crypto
    .createHash("sha256")
    .update(inputOtp.trim())
    .digest("hex");

  const otpDoc = await OTP.findOne({
    userId,
    code: hashedInput,
    type,
    expiresAt: { $gt: new Date() },
  });

  if (!otpDoc) {
    throw new Error("Invalid or expired OTP");
  }

  await OTP.deleteOne({ _id: otpDoc._id });

  return true;
};
