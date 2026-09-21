/**
 * veterinarian.routes.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function2-veterinarians/veterinarian.routes.js
 * Owner: Function 2 — Veterinarian Management
 * ─────────────────────────────────────────────────────────────
 *
 * Mounted at: /api/veterinarians (in server.js)
 *
 * GET /api/veterinarians           → Public (browse all, search, filter)
 * GET /api/veterinarians/:id       → Public (vet details)
 * POST /api/veterinarians          → Admin/Vet (create profile)
 * PUT /api/veterinarians/:id       → Vet (own profile) / Admin (any)
 * DELETE /api/veterinarians/:id    → Admin only
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const router = express.Router();

const {
  createVeterinarian,
  getVeterinarians,
  getVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
} = require('./veterinarian.controller');
const { validateCreateVeterinarian, validateUpdateVeterinarian } = require('./veterinarian.validation');
const { protect } = require('../../middleware/authMiddleware');
const { authorize } = require('../../middleware/roleMiddleware');
const { uploadSingle } = require('../../middleware/uploadMiddleware');

// Public routes
router.get('/', getVeterinarians);
router.get('/:id', getVeterinarian);

// Protected routes
router.post('/', protect, authorize('veterinarian', 'admin'), uploadSingle('profileImage'), validateCreateVeterinarian, createVeterinarian);
router.put('/:id', protect, authorize('veterinarian', 'admin'), uploadSingle('profileImage'), validateUpdateVeterinarian, updateVeterinarian);
router.delete('/:id', protect, authorize('admin'), deleteVeterinarian);

module.exports = router;
