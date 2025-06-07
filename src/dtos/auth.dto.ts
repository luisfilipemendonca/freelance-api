import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerDto = z
  .object({
    username: z.string().min(3, 'Username must have at least 3 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['client', 'freelancer']).transform((val) => val.toUpperCase() as Role),
  })
  .strict();

export const loginDto = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .strict();

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;
