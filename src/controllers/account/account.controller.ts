import { Request, Response } from 'express';
import { AuthRequest } from '@/types/auth.types';

// Get Account
export const getAccount = async (req: AuthRequest, res: Response) => {
  const authReq = req as AuthRequest;
  const user = authReq.user;

  res.status(200).json({
    message: 'User fetched successfully',
    user,
  });
};
