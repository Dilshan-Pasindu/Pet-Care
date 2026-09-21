/**
 * veterinarian.validation.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function2-veterinarians/veterinarian.validation.js
 * Owner: Function 2 — Veterinarian Management
 * ─────────────────────────────────────────────────────────────
 */

const { body, validationResult } = require('express-validator');
const { sendError } = require('../../utils/response');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, 'Validation failed.', errors.array().map((e) => ({ field: e.path, message: e.msg })));
  }
  next();
};

const validateCreateVeterinarian = [
  body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid User ID'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be non-negative'),
  handleValidationErrors,
];

const validateUpdateVeterinarian = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('specialization').optional().trim().notEmpty().withMessage('Specialization cannot be empty'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be non-negative'),
  handleValidationErrors,
];

module.exports = { validateCreateVeterinarian, validateUpdateVeterinarian };
