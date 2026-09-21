/**
 * veterinarian.controller.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function2-veterinarians/veterinarian.controller.js
 * Owner: Function 2 — Veterinarian Management
 * ─────────────────────────────────────────────────────────────
 */

const vetService = require('./veterinarian.service');
const { sendSuccess } = require('../../utils/response');

const createVeterinarian = async (req, res, next) => {
  try {
    const imageUrl = req.file ? req.file.path : null;
    const vet = await vetService.createVeterinarian(req.body, imageUrl);
    return sendSuccess(res, 201, 'Veterinarian profile created successfully.', vet);
  } catch (error) { next(error); }
};

const getVeterinarians = async (req, res, next) => {
  try {
    const vets = await vetService.getAllVeterinarians(req.query);
    return sendSuccess(res, 200, 'Veterinarians retrieved successfully.', vets, vets.length);
  } catch (error) { next(error); }
};

const getVeterinarian = async (req, res, next) => {
  try {
    const vet = await vetService.getVeterinarianById(req.params.id);
    return sendSuccess(res, 200, 'Veterinarian retrieved successfully.', vet);
  } catch (error) { next(error); }
};

const updateVeterinarian = async (req, res, next) => {
  try {
    const imageUrl = req.file ? req.file.path : null;
    const vet = await vetService.updateVeterinarian(req.params.id, req.body, req.user.id, req.user.role, imageUrl);
    return sendSuccess(res, 200, 'Veterinarian updated successfully.', vet);
  } catch (error) { next(error); }
};

const deleteVeterinarian = async (req, res, next) => {
  try {
    await vetService.deleteVeterinarian(req.params.id);
    return sendSuccess(res, 200, 'Veterinarian deleted successfully.');
  } catch (error) { next(error); }
};

module.exports = { createVeterinarian, getVeterinarians, getVeterinarian, updateVeterinarian, deleteVeterinarian };
