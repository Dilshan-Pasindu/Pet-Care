/**
 * auth.routes.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/common/authentication/auth.routes.js
 * Owner: Common Group Function — Authentication
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Defines the Express router for authentication endpoints.
 *   Applies validation middleware before controllers.
 *   Applies auth middleware for protected routes.
 *
 * Mounted at: /api/auth (in server.js)
 *
 * Endpoints:
 *   POST /api/auth/register → validateRegister → register
 *   POST /api/auth/login    → validateLogin    → login
 *   GET  /api/auth/me       → protect          → getMe
 *   PUT  /api/auth/me       → protect + upload → updateMe
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const router = express.Router();

const { register, login, getMe, updateMe } = require('./auth.controller');
const { validateRegister, validateLogin, validateProfileUpdate } = require('./auth.validation');
const { protect } = require('../../middleware/authMiddleware');
const { uploadSingle } = require('../../middleware/uploadMiddleware');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes (require valid JWT)
router.get('/me', protect, getMe);
router.put('/me', protect, uploadSingle('profileImage'), validateProfileUpdate, updateMe);

module.exports = router;
