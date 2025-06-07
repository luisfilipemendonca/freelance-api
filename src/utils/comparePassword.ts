import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

export const comparePassword = async (password: User['password'], hashedPassword: User['password']) => {
  return await bcrypt.compare(password, hashedPassword);
};
