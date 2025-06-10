import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { TypedRequest } from '../types/request';
import * as authService from '../services/auth.service';
import { HttpStatus } from '../constants/http-codes';
import { createSession } from '../services/session.service';

export const register = async (req: TypedRequest<RegisterDto>, res: Response) => {
  try {
    const user = await authService.register(req.body);

    res.status(HttpStatus.CREATE_SUCCESS).json(user);
  } catch (e) {
    console.log(e);
  }
};

export const login = async (req: TypedRequest<LoginDto>, res: Response) => {
  try {
    const { user, refreshToken, accessToken } = await authService.login(req.body);
    const tokenMaxAge = 7 * 24 * 60 * 60 * 1000;

    await createSession({ userId: user.id, refreshToken, ip: req.ip, userAgent: req.get('User-Agent'), expiresAt: new Date(Date.now() + tokenMaxAge) });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokenMaxAge,
    });

    res.status(HttpStatus.READ_SUCCESS).json({ user, accessToken });
  } catch (e) {
    console.log(e);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(HttpStatus.READ_SUCCESS).json({ message: 'Logged out successfully' });
};

export const test = (req: Request) => {
  console.log(req.ip, req.get('User-Agent'));
};
