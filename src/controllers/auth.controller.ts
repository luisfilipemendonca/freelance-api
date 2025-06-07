import { Response } from 'express';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { TypedRequest } from '../types/request';

export const register = (req: TypedRequest<RegisterDto>, res: Response) => {
  console.log(req);
  res.send('user register');
};

export const login = (req: TypedRequest<LoginDto>, res: Response) => {
  res.send('User login');
};
