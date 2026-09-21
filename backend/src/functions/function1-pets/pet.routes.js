/**
 * pet.routes.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function1-pets/pet.routes.js
 * Owner: Function 1 — Pet Management
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Defines the Express router for pet endpoints.
 *   Middleware chain per route:
 *     protect → [uploadSingle?] → [validate?] → controller
 *
 * Mounted at: /api/pets (in server.js)
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const router = express.Router();

const { createPet, getPets, getPet, updatePet, deletePet } = require('./pet.controller');
const { validateCreatePet, validateUpdatePet } = require('./pet.validation');
const { protect } = require('../../middleware/authMiddleware');
const { uploadSingle } = require('../../middleware/uploadMiddleware');

// All pet routes require authentication
router.use(protect);

// POST /api/pets — Create a new pet (with optional image upload)
router.post('/', uploadSingle('image'), validateCreatePet, createPet);

// GET /api/pets — Get all pets for the authenticated owner
router.get('/', getPets);

// GET /api/pets/:id — Get a single pet by ID
router.get('/:id', getPet);

// PUT /api/pets/:id — Update a pet (with optional image update)
router.put('/:id', uploadSingle('image'), validateUpdatePet, updatePet);

// DELETE /api/pets/:id — Delete a pet
router.delete('/:id', deletePet);

module.exports = router;
