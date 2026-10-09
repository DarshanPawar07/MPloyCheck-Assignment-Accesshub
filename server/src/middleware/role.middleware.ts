import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../models/user.model';

export const requireRole = (
  requiredRole: UserRole
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });

      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json({
        success: false,
        message: `${requiredRole} access required`
      });

      return;
    }

    next();
  };
};