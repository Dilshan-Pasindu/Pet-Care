/**
 * functions/function5-services/service.routes.ts
 * Owner: Function 5 — Pet Service Management
 * Mounted at: /api/services
 */

import { Router } from 'express';
import { createService, getServices, getService, updateService, deleteService } from './service.controller';
import { validateCreateService, validateUpdateService } from './service.validation';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';
import { uploadSingle } from '../../middleware/uploadMiddleware';

const router = Router();

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, authorize('admin'), uploadSingle('image'), validateCreateService, createService);
router.put('/:id', protect, authorize('admin'), uploadSingle('image'), validateUpdateService, updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

export default router;
