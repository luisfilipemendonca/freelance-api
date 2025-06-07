import { User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { RegisterDto } from '../dtos/auth.dto';

export const createUser = async ({ email, role, password, username }: RegisterDto) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      password,
      role,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });
};

export const findUserByEmail = async (email: User['email']) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });
};

export const findUserByEmailWithCredentials = async (email: User['email']) => {
  return await prisma.user.findUnique({ where: { email } });
};
