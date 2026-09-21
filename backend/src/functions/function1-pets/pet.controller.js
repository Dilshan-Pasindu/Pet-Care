/**
 * pet.controller.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function1-pets/pet.controller.js
 * Owner: Function 1 — Pet Management
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Handles HTTP requests for the pet API endpoints.
 *   Delegates business logic to pet.service.js.
 *   Returns standardized HTTP responses.
 *
 * Endpoints:
 *   POST   /api/pets       → createPet
 *   GET    /api/pets       → getPets
 *   GET    /api/pets/:id   → getPet
 *   PUT    /api/pets/:id   → updatePet
 *   DELETE /api/pets/:id   → deletePet
 * ─────────────────────────────────────────────────────────────
 */

const petService = require('./pet.service');
const { sendSuccess, sendError } = require('../../utils/response');

/**
 * @route   POST /api/pets
 * @desc    Create a new pet for the authenticated owner
 * @access  Private (owner)
 * @body    { name, species, breed?, gender?, dateOfBirth?, weight?, description? }
 * @file    image (multipart/form-data, optional)
 */
const createPet = async (req, res, next) => {
  try {
    const imageUrl = req.file ? req.file.path : null;
    const pet = await petService.createPet(req.body, req.user.id, imageUrl);

    return sendSuccess(res, 201, 'Pet created successfully.', pet);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/pets
 * @desc    Get all pets belonging to the authenticated owner
 * @access  Private (owner)
 */
const getPets = async (req, res, next) => {
  try {
    const pets = await petService.getPetsByOwner(req.user.id);

    return sendSuccess(res, 200, 'Pets retrieved successfully.', pets, pets.length);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/pets/:id
 * @desc    Get a single pet by ID
 * @access  Private (owner can only view their own; vet/admin can view any)
 * @param   id — Pet's MongoDB ObjectId
 */
const getPet = async (req, res, next) => {
  try {
    const pet = await petService.getPetById(req.params.id, req.user.id, req.user.role);

    return sendSuccess(res, 200, 'Pet retrieved successfully.', pet);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/pets/:id
 * @desc    Update a pet (owner only)
 * @access  Private (owner)
 * @body    { name?, species?, breed?, gender?, dateOfBirth?, weight?, description? }
 * @file    image (multipart/form-data, optional)
 * @param   id — Pet's MongoDB ObjectId
 */
const updatePet = async (req, res, next) => {
  try {
    const imageUrl = req.file ? req.file.path : null;
    const pet = await petService.updatePet(req.params.id, req.body, req.user.id, imageUrl);

    return sendSuccess(res, 200, 'Pet updated successfully.', pet);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/pets/:id
 * @desc    Delete a pet (owner only)
 * @access  Private (owner)
 * @param   id — Pet's MongoDB ObjectId
 */
const deletePet = async (req, res, next) => {
  try {
    await petService.deletePet(req.params.id, req.user.id);

    return sendSuccess(res, 200, 'Pet deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = { createPet, getPets, getPet, updatePet, deletePet };
