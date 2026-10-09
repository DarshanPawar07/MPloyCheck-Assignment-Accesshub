import { Request, Response } from 'express';

import {
  getRecords,
  getRecordById
} from '../services/record.service';

const getParamId = (id: string | string[]): string => {
  return Array.isArray(id) ? id[0] : id;
};

export const getAllRecords = async (
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

    const requestedDelay = Number(req.query.delay ?? 0);

    if (
      Number.isNaN(requestedDelay) ||
      requestedDelay < 0
    ) {
      res.status(400).json({
        success: false,
        message: 'Delay must be a non-negative number'
      });

      return;
    }

    // Protect the API from unreasonable delay values.
    const delayMs = Math.min(requestedDelay, 10000);

    const records = await getRecords({
      userId: req.user.userId,
      role: req.user.role,
      delayMs
    });

    res.status(200).json({
      success: true,
      meta: {
        requestedDelay: delayMs,
        processedAsynchronously: delayMs > 0
      },
      data: records
    });
  } catch (error) {
    console.error('Get records error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch records';

    const statusCode =
      message === 'User not found' ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const getRecord = async (
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

 const record = await getRecordById(
  getParamId(req.params.id),
  req.user.userId,
  req.user.role
);

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch record';

    let statusCode = 400;

    if (message === 'Record not found') {
      statusCode = 404;
    }

    if (message.includes('do not have access')) {
      statusCode = 403;
    }

    res.status(statusCode).json({
      success: false,
      message
    });
  }
};