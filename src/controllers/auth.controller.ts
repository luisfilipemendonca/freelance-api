import { Response } from 'express';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { TypedRequest } from '../types/request';
import * as authService from '../services/auth.service';
import { HttpStatus } from '../constants/http-codes';

export const register = async (req: TypedRequest<RegisterDto>, res: Response) => {
  try {
    const user = await authService.register(req.body);

    res.status(HttpStatus.CREATE_SUCCESS).json(user);
  } catch (e) {
    console.log(e);
  }
};

export const login = (req: TypedRequest<LoginDto>, res: Response) => {
  res.send('User login');
};
