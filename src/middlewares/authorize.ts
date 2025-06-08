import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from '../types/jwt';
import { HttpStatus } from '../constants/http-codes';

export const authorize = (authorizedRole: JwtPayload['role']) => (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (!user?.role || authorizedRole !== user.role) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized access' });
    return;
  }

  next();
};
