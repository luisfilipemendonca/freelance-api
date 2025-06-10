import { Session, User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/hashPassword';

type CreateSession = {
  userId: User['id'];
  refreshToken: string;
  ip?: Session['ip'];
  userAgent?: Session['userAgent'];
  expiresAt: Session['expiresAt'];
};

export const createSession = async ({ ip, refreshToken, userAgent, userId, expiresAt }: CreateSession) => {
  const hashedRefreshToken = await hashPassword(refreshToken);

  return prisma.session.create({
    data: {
      userId,
      userAgent,
      ip,
      refreshToken: hashedRefreshToken,
      expiresAt,
    },
  });
};
