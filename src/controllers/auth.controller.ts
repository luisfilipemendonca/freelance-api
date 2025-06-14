import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { TypedRequest } from '../types/request';
import * as authService from '../services/auth.service';
import { HttpStatus } from '../constants/http-codes';
import { createSession, deleteSessionById, getValidSession, updateSessionById } from '../services/session.service';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { JwtPayload, JwtRefreshPayload } from '../types/jwt';
import { Role } from '@prisma/client';

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
    const { user } = await authService.login(req.body);

    const tokenMaxAge = 7 * 24 * 60 * 60 * 1000;
    const jwtRefreshPayload: JwtRefreshPayload = { sub: user.id.toString(), role: user.role.toUpperCase() as Role };
    const refreshToken = signRefreshToken(jwtRefreshPayload);

    const session = await createSession({ userId: user.id, refreshToken, ip: req.ip, userAgent: req.get('User-Agent'), expiresAt: new Date(Date.now() + tokenMaxAge) });

    const jwtPayload: JwtPayload = { ...jwtRefreshPayload, sid: session.id };
    const accessToken = signAccessToken(jwtPayload);

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

export const logout = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (user) {
      await deleteSessionById(user.sid);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(HttpStatus.READ_SUCCESS).json({ message: 'Logged out successfully' });
  } catch (e) {
    console.log(e);
  }
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
    const newJwtRefreshPayload: JwtRefreshPayload = { sub: payload.sub, role: payload.role.toUpperCase() as Role };
    const newJwtPayload: JwtPayload = { ...newJwtRefreshPayload, sid: currentSession.id };

    const newAccessToken = signAccessToken(newJwtPayload);
    const newRefreshToken = signRefreshToken(newJwtRefreshPayload);

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
