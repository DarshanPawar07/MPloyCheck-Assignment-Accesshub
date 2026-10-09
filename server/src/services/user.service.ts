import { User, UserRole, UserStatus } from '../models/user.model';
import { hashPassword } from '../utils/password.util';

interface CreateUserInput {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
}

const sanitizeUser = (user: any) => {
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

export const getAllUsers = async () => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });

  return users;
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id)
    .select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const createUser = async (
  input: CreateUserInput
) => {
  const existingUser = await User.findOne({
    $or: [
      { userId: input.userId },
      { email: input.email.toLowerCase() }
    ]
  });

  if (existingUser) {
    if (existingUser.userId === input.userId) {
      throw new Error('User ID already exists');
    }

    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await User.create({
    userId: input.userId,
    name: input.name,
    email: input.email.toLowerCase(),
    password: hashedPassword,
    role: input.role,
    status: input.status || 'ACTIVE'
  });

  return sanitizeUser(user);
};

export const updateUser = async (
  id: string,
  input: UpdateUserInput
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  if (input.email) {
    const existingEmailUser = await User.findOne({
      email: input.email.toLowerCase(),
      _id: { $ne: id }
    });

    if (existingEmailUser) {
      throw new Error('Email already exists');
    }

    user.email = input.email.toLowerCase();
  }

  if (input.name !== undefined) {
    user.name = input.name;
  }

  if (input.password) {
    user.password = await hashPassword(input.password);
  }

  if (input.role) {
    if (
      user.role === 'ADMIN' &&
      input.role !== 'ADMIN'
    ) {
      await ensureAdminWillRemain();
    }

    user.role = input.role;
  }

  if (input.status) {
    if (
      user.role === 'ADMIN' &&
      input.status === 'INACTIVE'
    ) {
      await ensureAdminWillRemain();
    }

    user.status = input.status;
  }

  await user.save();

  return sanitizeUser(user);
};

export const deleteUser = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'ADMIN') {
    await ensureAdminWillRemain();
  }

  await User.findByIdAndDelete(id);

  return {
    message: 'User deleted successfully'
  };
};

export const updateUserStatus = async (
  id: string,
  status: UserStatus
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  if (
    user.role === 'ADMIN' &&
    status === 'INACTIVE'
  ) {
    await ensureAdminWillRemain();
  }

  user.status = status;

  await user.save();

  return sanitizeUser(user);
};

const ensureAdminWillRemain = async (): Promise<void> => {
  const activeAdminCount = await User.countDocuments({
    role: 'ADMIN',
    status: 'ACTIVE'
  });

  if (activeAdminCount <= 1) {
    throw new Error(
      'At least one active Admin account must remain'
    );
  }
};