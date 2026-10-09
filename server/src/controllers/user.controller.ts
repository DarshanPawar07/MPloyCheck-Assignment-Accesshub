import { Request, Response } from 'express';

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus
} from '../services/user.service';

const getParamId = (id: string | string[]): string => {
  return Array.isArray(id) ? id[0] : id;
};

export const getUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

export const getUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getUserById(
  getParamId(req.params.id)
);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch user';

    const statusCode =
      message === 'User not found' ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const create = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      userId,
      name,
      email,
      password,
      role,
      status
    } = req.body;

    if (
      !userId ||
      !name ||
      !email ||
      !password ||
      !role
    ) {
      res.status(400).json({
        success: false,
        message:
          'User ID, name, email, password, and role are required'
      });

      return;
    }

    if (!['ADMIN', 'GENERAL_USER'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role'
      });

      return;
    }

    const user = await createUser({
      userId,
      name,
      email,
      password,
      role,
      status
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to create user';

    const statusCode =
      message.includes('already exists') ? 409 : 400;

    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await updateUser(
  getParamId(req.params.id),
  req.body
);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to update user';

    let statusCode = 400;

    if (message === 'User not found') {
      statusCode = 404;
    } else if (message === 'Email already exists') {
      statusCode = 409;
    }

    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const remove = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await deleteUser(
  getParamId(req.params.id)
);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to delete user';

    const statusCode =
      message === 'User not found' ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const updateStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Status must be ACTIVE or INACTIVE'
      });

      return;
    }

  const user = await updateUserStatus(
  getParamId(req.params.id),
  status
);

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to update user status';

    const statusCode =
      message === 'User not found' ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message
    });
  }
};