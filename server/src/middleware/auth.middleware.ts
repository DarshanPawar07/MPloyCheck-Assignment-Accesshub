import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.util';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      });

      return;
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      res.status(401).json({
        success: false,
        message: 'Invalid authorization format'
      });

      return;
    }

    const payload = verifyToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token'
    });
  }
};