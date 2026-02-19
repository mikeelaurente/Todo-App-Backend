import { OTPDocumentType } from "@/types/models/otp.type";
import { Schema, model } from "mongoose";

const otpSchema = new Schema<OTPDocumentType>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    code: { type: String, required: true },
    type: {
      type: String,
      enum: ["EMAIL_VERIFICATION", "PASSWORD_RESET"],
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = model<OTPDocumentType>("OTP", otpSchema);
