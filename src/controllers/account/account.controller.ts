import { Request, Response } from 'express';
// Get Account
export const getAccount = async (req: Request, res: Response) => {
  const user = (req as any).user;

  res.status(200).json({
    message: 'User fetched successfully',
    user,
  });
};
