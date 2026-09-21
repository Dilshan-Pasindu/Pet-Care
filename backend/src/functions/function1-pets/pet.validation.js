/**
 * pet.validation.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function1-pets/pet.validation.js
 * Owner: Function 1 — Pet Management
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Input validation rules for pet API endpoints using
 *   express-validator. Applied as middleware in pet.routes.js.
 * ─────────────────────────────────────────────────────────────
 */

const { body, validationResult } = require('express-validator');
const { sendError } = require('../../utils/response');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      400,
      'Validation failed.',
      errors.array().map((err) => ({ field: err.path, message: err.msg }))
    );
  }
  next();
};

/**
 * Validation rules for POST /api/pets (create pet)
 */
const validateCreatePet = [
  body('name')
    .trim()
    .notEmpty().withMessage('Pet name is required')
    .isLength({ min: 1, max: 100 }).withMessage('Pet name must be 1–100 characters'),

  body('species')
    .trim()
    .notEmpty().withMessage('Species is required'),

  body('breed')
    .optional()
    .trim(),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'unknown']).withMessage('Gender must be male, female, or unknown'),

  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),

  body('weight')
    .optional()
    .isFloat({ min: 0 }).withMessage('Weight must be a positive number (kg)'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  handleValidationErrors,
];

/**
 * Validation rules for PUT /api/pets/:id (update pet)
 * Same as create but all fields are optional
 */
const validateUpdatePet = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Pet name must be 1–100 characters'),

  body('species')
    .optional()
    .trim()
    .notEmpty().withMessage('Species cannot be empty'),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'unknown']).withMessage('Gender must be male, female, or unknown'),

  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),

  body('weight')
    .optional()
    .isFloat({ min: 0 }).withMessage('Weight must be a positive number (kg)'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  handleValidationErrors,
];

module.exports = { validateCreatePet, validateUpdatePet };
