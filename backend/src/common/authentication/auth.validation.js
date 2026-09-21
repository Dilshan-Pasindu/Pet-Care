/**
 * auth.validation.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/common/authentication/auth.validation.js
 * Owner: Common Group Function — Authentication
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Input validation rules using express-validator.
 *   These rules are applied as middleware in auth.routes.js
 *   before the controller runs.
 *
 * How it works:
 *   1. Route uses validateRegister or validateLogin as middleware
 *   2. express-validator checks the request body
 *   3. handleValidationErrors checks if any errors exist
 *   4. If errors exist, returns 400 with error details
 *   5. If no errors, calls next() to reach the controller
 * ─────────────────────────────────────────────────────────────
 */

const { body, validationResult } = require('express-validator');
const { sendError } = require('../../utils/response');

/**
 * Middleware: Check if any validation errors exist and return them.
 * Must be the last item in the validation chain array.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendError(
      res,
      400,
      'Validation failed. Please check your input.',
      errors.array().map((err) => ({ field: err.path, message: err.msg }))
    );
  }

  next();
};

/**
 * Validation rules for POST /api/auth/register
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please provide a valid phone number'),

  body('role')
    .optional()
    .isIn(['owner', 'veterinarian', 'admin'])
    .withMessage('Role must be owner, veterinarian, or admin'),

  handleValidationErrors,
];

/**
 * Validation rules for POST /api/auth/login
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

/**
 * Validation rules for PUT /api/auth/me (profile update)
 */
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please provide a valid phone number'),

  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validateProfileUpdate };
