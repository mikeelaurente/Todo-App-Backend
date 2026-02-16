import { findAccountS } from "@/services/auth/auth.service";
import { compareHashed } from "@/utils/bycrypt";
import { AppError } from "@/utils/error/app-error.utils";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic")) {
    throw new AppError("Unauthorized. Missing authorization header.", 401);
  }

  const base64Credentials = authHeader.split(" ")[1];

  console.log("AUTH HEADER:", authHeader);
  console.log("BASE64:", base64Credentials);

  const decoded = Buffer.from(base64Credentials, "base64").toString("utf-8");

  const [email, password] = decoded.split(":");

  if (!email || !password) {
    throw new AppError("Invalid Authorization format.", 401);
  }

  const account = await findAccountS({ email });
  if (!account) {
    throw new AppError(`Account with email ${email} not found.`, 404);
  }

  const passwordCorrect = await compareHashed(password, account.password);
  if (!passwordCorrect) {
    throw new AppError("Invalid Credentials.", 401);
  }

  (req as any).user = account;

  next();
};
