/**
 * common/authentication/auth.routes.ts
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/common/authentication/auth.routes.ts
 * Owner: Common Group Function — Authentication
 * ─────────────────────────────────────────────────────────────
 *
 * Mounted at: /api/auth (in server.ts)
 * ─────────────────────────────────────────────────────────────
 */

import { Router } from 'express';
import { register, login, getMe, updateMe } from './auth.controller';
import { validateRegister, validateLogin, validateProfileUpdate } from './auth.validation';
import { protect } from '../../middleware/authMiddleware';
import { uploadSingle } from '../../middleware/uploadMiddleware';

const router = Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, uploadSingle('profileImage'), validateProfileUpdate, updateMe);

export default router;
