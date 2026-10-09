import { Router } from 'express';

import {
  getUsers,
  getUser,
  create,
  update,
  remove,
  updateStatus
} from '../controllers/user.controller';

import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/', create);

router.put('/:id', update);

router.delete('/:id', remove);

router.patch('/:id/status', updateStatus);

export default router;