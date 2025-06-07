import { RegisterDto } from '../dtos/auth.dto';
import { hashPassword } from '../utils/hashPassword';
import { createUser, findUserByEmail } from './user.service';

export const register = async ({ username, email, password, role }: RegisterDto) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await hashPassword(password);

  const createdUser = await createUser({ username, email, password: hashedPassword, role });

  return createdUser;
};
