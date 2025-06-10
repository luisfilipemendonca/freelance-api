import { Role, Session } from '@prisma/client';

export type JwtRefreshPayload = {
  sub: string;
  role: Role;
};

export type JwtPayload = JwtRefreshPayload & {
  sid: Session['id'];
};
