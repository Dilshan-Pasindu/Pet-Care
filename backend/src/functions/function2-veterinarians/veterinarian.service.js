/**
 * veterinarian.service.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function2-veterinarians/veterinarian.service.js
 * Owner: Function 2 — Veterinarian Management
 * ─────────────────────────────────────────────────────────────
 */

const Veterinarian = require('./veterinarian.model');

const createVeterinarian = async (vetData, imageUrl = null) => {
  const vet = await Veterinarian.create({
    ...vetData,
    profileImage: imageUrl,
  });
  return vet;
};

const getAllVeterinarians = async (query = {}) => {
  const { search, specialization, location } = query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
    ];
  }
  if (specialization) filter.specialization = { $regex: specialization, $options: 'i' };
  if (location) filter.location = { $regex: location, $options: 'i' };

  const vets = await Veterinarian.find(filter)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  return vets;
};

const getVeterinarianById = async (vetId) => {
  const vet = await Veterinarian.findById(vetId).populate('userId', 'name email');
  if (!vet) {
    const error = new Error('Veterinarian not found.');
    error.statusCode = 404;
    throw error;
  }
  return vet;
};

const updateVeterinarian = async (vetId, updateData, requesterId, requesterRole, imageUrl = null) => {
  const vet = await Veterinarian.findById(vetId);
  if (!vet) {
    const error = new Error('Veterinarian not found.');
    error.statusCode = 404;
    throw error;
  }

  // Vet can only update their own profile; admin can update any
  if (requesterRole === 'veterinarian' && vet.userId.toString() !== requesterId) {
    const error = new Error('You can only update your own profile.');
    error.statusCode = 403;
    throw error;
  }

  const updates = { ...updateData };
  if (imageUrl) updates.profileImage = imageUrl;

  const updatedVet = await Veterinarian.findByIdAndUpdate(vetId, updates, {
    new: true,
    runValidators: true,
  });

  return updatedVet;
};

const deleteVeterinarian = async (vetId) => {
  const vet = await Veterinarian.findById(vetId);
  if (!vet) {
    const error = new Error('Veterinarian not found.');
    error.statusCode = 404;
    throw error;
  }
  await Veterinarian.findByIdAndDelete(vetId);
};

module.exports = {
  createVeterinarian,
  getAllVeterinarians,
  getVeterinarianById,
  updateVeterinarian,
  deleteVeterinarian,
};
