import { User } from '../models/user.model';
import { comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';

interface LoginInput {
  userId: string;
  password: string;
  role: 'ADMIN' | 'GENERAL_USER';
}

export const loginUser = async (input: LoginInput) => {
  const { userId, password, role } = input;

  const user = await User.findOne({
    userId,
    role
  });

  if (!user) {
    throw new Error('Invalid User ID, password, or role');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error('User account is inactive');
  }

  const passwordMatches = await comparePassword(
    password,
    user.password
  );

  if (!passwordMatches) {
    throw new Error('Invalid User ID, password, or role');
  }

  const token = generateToken({
    userId: user.userId,
    role: user.role
  });

  return {
    token,
    user: {
      id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
};