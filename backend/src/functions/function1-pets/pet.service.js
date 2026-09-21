/**
 * pet.service.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function1-pets/pet.service.js
 * Owner: Function 1 — Pet Management
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Contains all business logic for pet operations.
 *   Called by pet.controller.js. Isolated for testability.
 *
 * Authorization rules implemented here:
 *   - Only the pet's owner can update or delete it
 *   - Owners can only see their own pets
 *   - Vets and admins can view any pet (for appointment/record purposes)
 * ─────────────────────────────────────────────────────────────
 */

const Pet = require('./pet.model');

/**
 * Create a new pet for the authenticated owner.
 * @param {Object} petData - Pet fields from request body
 * @param {string} ownerId - From req.user.id
 * @param {string} [imageUrl] - Cloudinary URL (optional)
 * @returns {Object} Created pet document
 */
const createPet = async (petData, ownerId, imageUrl = null) => {
  const pet = await Pet.create({
    ...petData,
    ownerId,
    image: imageUrl,
  });

  return pet;
};

/**
 * Get all pets for the authenticated owner.
 * @param {string} ownerId - From req.user.id
 * @returns {Array} Array of pet documents
 */
const getPetsByOwner = async (ownerId) => {
  const pets = await Pet.find({ ownerId }).sort({ createdAt: -1 });
  return pets;
};

/**
 * Get a single pet by ID.
 * Access: Owner (their pet), Vet/Admin (any pet for records).
 * @param {string} petId
 * @param {string} userId - From req.user.id
 * @param {string} userRole - From req.user.role
 * @returns {Object} Pet document
 * @throws Error if not found or unauthorized
 */
const getPetById = async (petId, userId, userRole) => {
  const pet = await Pet.findById(petId).populate('ownerId', 'name email phone');

  if (!pet) {
    const error = new Error('Pet not found.');
    error.statusCode = 404;
    throw error;
  }

  // Owners can only view their own pets; vets and admins can view any
  if (userRole === 'owner' && pet.ownerId._id.toString() !== userId) {
    const error = new Error('You do not have permission to view this pet.');
    error.statusCode = 403;
    throw error;
  }

  return pet;
};

/**
 * Update a pet. Only the owner can update their own pet.
 * @param {string} petId
 * @param {Object} updateData - Fields to update
 * @param {string} ownerId - From req.user.id
 * @param {string} [imageUrl] - New Cloudinary URL (optional)
 * @returns {Object} Updated pet document
 * @throws Error if not found or unauthorized
 */
const updatePet = async (petId, updateData, ownerId, imageUrl = null) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    const error = new Error('Pet not found.');
    error.statusCode = 404;
    throw error;
  }

  if (pet.ownerId.toString() !== ownerId) {
    const error = new Error('You do not have permission to update this pet.');
    error.statusCode = 403;
    throw error;
  }

  // Build update object
  const updates = { ...updateData };
  if (imageUrl) updates.image = imageUrl;

  const updatedPet = await Pet.findByIdAndUpdate(
    petId,
    updates,
    { new: true, runValidators: true }
  );

  return updatedPet;
};

/**
 * Delete a pet. Only the owner can delete their own pet.
 * @param {string} petId
 * @param {string} ownerId - From req.user.id
 * @throws Error if not found or unauthorized
 */
const deletePet = async (petId, ownerId) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    const error = new Error('Pet not found.');
    error.statusCode = 404;
    throw error;
  }

  if (pet.ownerId.toString() !== ownerId) {
    const error = new Error('You do not have permission to delete this pet.');
    error.statusCode = 403;
    throw error;
  }

  await Pet.findByIdAndDelete(petId);
};

module.exports = { createPet, getPetsByOwner, getPetById, updatePet, deletePet };
