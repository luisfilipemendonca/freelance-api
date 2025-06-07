import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRATION, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION, REFRESH_TOKEN_SECRET } from '../constants/jwt';
import { JwtPayload } from '../types/jwt';

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

export const signRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
