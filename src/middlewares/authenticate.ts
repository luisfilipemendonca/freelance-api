import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { JwtPayload } from '../types/jwt';
import { HttpStatus } from '../constants/http-codes';
import { TokenExpiredError } from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authorization header missing or malformed' });
      return;
    }

    const [, token] = authorization?.split(' ');

    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Access token missing' });
      return;
    }

    const user = verifyAccessToken(token) as JwtPayload;

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
      return;
    }

    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized request' });
  }
};
