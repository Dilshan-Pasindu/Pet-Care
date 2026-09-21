/**
 * middleware/authMiddleware.ts
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/middleware/authMiddleware.ts
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   JWT Authentication Middleware.
 *   Verifies the Bearer token and attaches decoded user
 *   payload to req.user (typed via src/types/express.d.ts).
 * ─────────────────────────────────────────────────────────────
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';
import { JwtPayload } from '../types/models';

/**
 * Middleware: Verify JWT and attach user to req.
 */
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    sendError(res, 401, 'Access denied. No token provided.');
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    sendError(res, 500, 'Server configuration error.');
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch {
    sendError(res, 401, 'Invalid or expired token. Please login again.');
  }
};
