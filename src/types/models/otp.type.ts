import { Document, Types } from "mongoose";

export type OTPType = {
  userId: Types.ObjectId;
  code: string;
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET";
  isVerified: boolean;
  expiresAt: Date;
};

export type OTPDocumentType = OTPType & Document;
