import { findAccountS, registerAccountS } from "@/services/auth/auth.service";
import { compareHashed, hashedValue } from "@/utils/bycrypt";
import { AppError } from "@/utils/error/app-error.utils";
import { Request, Response } from "express";

// Register an Account
export const register = async (req: Request, res: Response) => {
  // Get data from body
  const { username, email, password } = req.body;

  // Check if data exists
  if (!username || !email || !password) {
    throw new AppError("All fields are required.", 400);
  }

  // Find existing email
  if (await findAccountS({ email })) {
    throw new AppError("Email already exists.", 409);
  }

  // Hash password
  const hashedPassword = await hashedValue(password);

  // Create Account
  const newAccount = await registerAccountS({
    username,
    email,
    password: hashedPassword,
  });

  // return response
  res.status(200).json({
    message: "Registered succesfully.",
    newAccount,
  });
};

// Login Account
export const login = async (req: Request, res: Response) => {
  //Get data from body
  const { email, password } = req.body;

  // Check if data exists
  if (!email || !password) {
    throw new AppError("All fields are required", 400);
  }

  // Find Account
  const account = await findAccountS({ email });
  if (!account) {
    throw new AppError("Account not Found.", 404);
  }

  // Check password
  if (!(await compareHashed(password, account.password))) {
    throw new AppError("Incorrect Password", 400);
  }

  // Return response
  res.status(200).json({
    message: "Login successfully.",
    account,
  });
};

// Logout Account
export const logout = async (req: Request, res: Response) => {
  //Get data from body
  const email = req.body.email;

  // Check if data exists
  if (!email) {
    throw new AppError("All fields are required.", 400);
  }

  // Find Account
  const account = await findAccountS({ email });
  if (!account) {
    throw new AppError("User not found.", 404);
  }

  // Return response
  res.status(200).json({
    message: "Logout successfully.",
    account,
  });
};
