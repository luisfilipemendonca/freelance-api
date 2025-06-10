import { Session, User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/hashPassword';
import { comparePassword } from '../utils/comparePassword';

type CreateSession = {
  userId: User['id'];
  refreshToken: string;
  ip?: Session['ip'];
  userAgent?: Session['userAgent'];
  expiresAt: Session['expiresAt'];
};

type UpdateSession = Pick<Session, 'id' | 'expiresAt' | 'refreshToken'>;

export const createSession = async ({ ip, refreshToken, userAgent, userId, expiresAt }: CreateSession) => {
  const hashedRefreshToken = await hashPassword(refreshToken);

  return await prisma.session.create({
    data: {
      userId,
      userAgent,
      ip,
      refreshToken: hashedRefreshToken,
      expiresAt,
    },
  });
};

export const updateSessionById = async ({ id, refreshToken, expiresAt }: UpdateSession) => {
  const hashedRefreshToken = await hashPassword(refreshToken);

  await prisma.session.update({
    where: { id },
    data: { expiresAt, refreshToken: hashedRefreshToken },
  });
};

export const findSessionByUserId = async (userId: User['id']) => {
  return prisma.session.findMany({
    where: { userId },
  });
};

export const getValidSession = async (userId: User['id'], refreshToken: string) => {
  const sessions = await findSessionByUserId(userId);
  return sessions.find(async (session) => await comparePassword(session.refreshToken, refreshToken));
};

export const deleteSessionById = async (id: Session['id']) => {
  await prisma.session.delete({ where: { id } });
};
