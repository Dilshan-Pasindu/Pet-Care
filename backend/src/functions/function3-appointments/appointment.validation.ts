/**
 * functions/function3-appointments/appointment.validation.ts
 * Owner: Function 3 — Appointment Management
 */

import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { sendError } from '../../utils/response';

type ValidationMiddleware = ValidationChain | ((req: Request, res: Response, next: NextFunction) => void);

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 400, 'Validation failed.', errors.array().map((e) => ({ field: (e as { path: string }).path, message: e.msg as string })));
    return;
  }
  next();
};

export const validateCreateAppointment: ValidationMiddleware[] = [
  body('petId').notEmpty().withMessage('Pet ID is required').isMongoId().withMessage('Invalid Pet ID'),
  body('veterinarianId').notEmpty().withMessage('Veterinarian ID is required').isMongoId().withMessage('Invalid Veterinarian ID'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
  body('time').notEmpty().withMessage('Time is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:MM format'),
  body('reason').trim().notEmpty().withMessage('Reason is required').isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  handleValidationErrors,
];

export const validateUpdateAppointment: ValidationMiddleware[] = [
  body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:MM format'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  handleValidationErrors,
];
