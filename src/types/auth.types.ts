export interface AuthUser {
  _id: string;
  username: string;
  email: string;
}

import { Request } from 'express';
export interface AuthRequest extends Request {
  user: AuthUser;
}
