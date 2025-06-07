import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export const hashPassword = async (password: User['password']) => {
  return await bcrypt.hash(password, 10);
};
