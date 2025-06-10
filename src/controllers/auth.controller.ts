import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { TypedRequest } from '../types/request';
import * as authService from '../services/auth.service';
import { HttpStatus } from '../constants/http-codes';
import { createSession, deleteSessionById, getValidSession, updateSessionById } from '../services/session.service';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { JwtPayload } from '../types/jwt';

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

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Refresh token missing' });
      return;
    }

    const payload = verifyRefreshToken(refreshToken) as JwtPayload;

    if (!payload.sub) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
      return;
    }

    const currentSession = await getValidSession(+payload.sub, refreshToken);

    if (currentSession === undefined) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
      return;
    }

    const isTokenExpired = new Date() > new Date(currentSession.expiresAt);

    if (isTokenExpired) {
      await deleteSessionById(currentSession.id);
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Expired refresh token' });
      return;
    }

    const tokenMaxAge = 7 * 24 * 60 * 60 * 1000;
    const newJwtPayload: JwtPayload = { sub: payload.sub, role: payload.role };

    const newAccessToken = signAccessToken(newJwtPayload);
    const newRefreshToken = signRefreshToken(newJwtPayload);

    await updateSessionById({ ...currentSession, refreshToken: newRefreshToken, expiresAt: new Date(Date.now() + tokenMaxAge) });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokenMaxAge,
    });

    res.status(HttpStatus.CREATE_SUCCESS).json({ accessToken: newAccessToken });
  } catch (e) {
    console.log(e);
  }
};

export const test = (req: Request) => {
  console.log(req.ip, req.get('User-Agent'));
};
