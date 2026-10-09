import { Request, Response } from 'express';
import { loginUser } from '../services/auth.service';
import { User } from '../models/user.model';

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      res.status(400).json({
        success: false,
        message: 'User ID, password, and role are required'
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

    const result = await loginUser({
      userId,
      password,
      role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Authentication failed';

    res.status(401).json({
      success: false,
      message
    });
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });

      return;
    }

    const user = await User.findOne({
      userId: req.user.userId
    }).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
};