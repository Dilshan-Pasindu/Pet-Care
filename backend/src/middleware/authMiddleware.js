/**
 * authMiddleware.js
 * ─────────────────────────────────────────────────────────────
 * JWT Authentication Middleware.
 *
 * Purpose:
 *   Protects private routes by verifying the JWT token in the
 *   Authorization header. If valid, attaches the decoded user
 *   payload (id, role) to req.user so controllers can use it.
 *
 * Usage (in any route file):
 *   const { protect } = require('../../middleware/authMiddleware');
 *   router.get('/profile', protect, controller.getProfile);
 *
 * Client must send:
 *   Authorization: Bearer <token>
 *
 * On success:
 *   req.user = { id: '...', role: 'owner' }
 *
 * On failure:
 *   401 — No token provided
 *   401 — Invalid or expired token
 * ─────────────────────────────────────────────────────────────
 */

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

/**
 * Middleware: Verify JWT token and attach user to request.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 401, 'Access denied. No token provided.');
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token. Please login again.');
  }
};

module.exports = { protect };
