import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { JwtPayload } from '../types/jwt';
import { comparePassword } from '../utils/comparePassword';
import { hashPassword } from '../utils/hashPassword';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { createUser, findUserByEmail, findUserByEmailWithCredentials } from './user.service';

export const register = async ({ username, email, password, role }: RegisterDto) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await hashPassword(password);

  const createdUser = await createUser({ username, email, password: hashedPassword, role });

  return createdUser;
};

export const login = async ({ email: userEmail, password }: LoginDto) => {
  const user = await findUserByEmailWithCredentials(userEmail);

  if (!user) throw new Error('Invalid credentials');

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) throw new Error('Invalid credentials');

  const { email, id, role, username } = user;

  return {
    user: {
      email,
      id,
      role: role.toLowerCase(),
      username,
    },
  };
};
