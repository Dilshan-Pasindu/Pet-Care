/**
 * common/authentication/auth.controller.ts
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/common/authentication/auth.controller.ts
 * Owner: Common Group Function — Authentication
 * ─────────────────────────────────────────────────────────────
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, token } = await authService.registerUser(req.body as {
      name: string;
      email: string;
      password: string;
      phone?: string;
      role?: import('../../types/models').UserRole;
    });
    sendSuccess(res, 201, 'Account created successfully.', { user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { user, token } = await authService.loginUser(email, password);
    sendSuccess(res, 200, 'Login successful.', { user, token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.getCurrentUser(req.user!.id);
    sendSuccess(res, 200, 'User profile retrieved successfully.', user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const imageUrl = req.file?.path ?? null;
    const user = await authService.updateUserProfile(req.user!.id, req.body as { name?: string; phone?: string }, imageUrl);
    sendSuccess(res, 200, 'Profile updated successfully.', user);
  } catch (error) {
    next(error);
  }
};
