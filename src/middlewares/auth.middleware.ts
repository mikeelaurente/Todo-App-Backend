import { Request, Response, NextFunction } from 'express';
import { findAccountS } from '@/services/auth/auth.service';
import { compareHashed } from '@/utils/bycrypt';

// Authentication Middleware: Basic Auth
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const base64 = authHeader.split(' ')[1];
  const decoded = Buffer.from(base64, 'base64').toString('utf-8');
  const [email, password] = decoded.split(':');

  const account = await findAccountS({ email });

  if (!account) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!(await compareHashed(password, account.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  (req as any).user = {
    _id: account._id,
    username: account.username,
    email: account.email,
  };

  next();
};
