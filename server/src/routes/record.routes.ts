import { Router } from 'express';

import {
  getAllRecords,
  getRecord
} from '../controllers/record.controller';

import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAllRecords);

router.get('/:id', getRecord);

export default router;