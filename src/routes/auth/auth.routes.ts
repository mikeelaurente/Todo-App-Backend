import {
  getMe,
  login,
  logout,
  register,
} from '@/controllers/auth/auth.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/me', authMiddleware, getMe);
