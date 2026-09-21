/**
 * functions/function1-pets/pet.validation.ts
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function1-pets/pet.validation.ts
 * Owner: Function 1 — Pet Management
 * ─────────────────────────────────────────────────────────────
 */

import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { sendError } from '../../utils/response';

type ValidationMiddleware = ValidationChain | ((req: Request, res: Response, next: NextFunction) => void);

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(
      res,
      400,
      'Validation failed.',
      errors.array().map((e: any) => ({ field: e.path || '', message: e.msg || '' }))
    );
    return;
  }
  next();
};

export const validateCreatePet: ValidationMiddleware[] = [
  body('name').trim().notEmpty().withMessage('Pet name is required').isLength({ min: 1, max: 100 }).withMessage('Pet name must be 1–100 characters'),
  body('species').trim().notEmpty().withMessage('Species is required'),
  body('breed').optional().trim(),
  body('gender').optional().isIn(['male', 'female', 'unknown']).withMessage('Gender must be male, female, or unknown'),
  body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number (kg)'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('imageUrl').optional({ nullable: true }),
  handleValidationErrors,
];

export const validateUpdatePet: ValidationMiddleware[] = [
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Pet name must be 1–100 characters'),
  body('species').optional().trim().notEmpty().withMessage('Species cannot be empty'),
  body('gender').optional().isIn(['male', 'female', 'unknown']).withMessage('Gender must be male, female, or unknown'),
  body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number (kg)'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('imageUrl').optional({ nullable: true }),
  handleValidationErrors,
];
