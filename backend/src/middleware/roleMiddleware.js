/**
 * roleMiddleware.js
 * ─────────────────────────────────────────────────────────────
 * Role-Based Authorization Middleware.
 *
 * Purpose:
 *   Restricts access to routes based on the user's role.
 *   Must be used AFTER the `protect` middleware (authMiddleware),
 *   since it relies on req.user.role being set.
 *
 * Available Roles:
 *   'owner'        — Pet owners (general app users)
 *   'veterinarian' — Vets (can create medical records, etc.)
 *   'admin'        — Administrators (full access)
 *
 * Usage (in any route file):
 *   const { protect } = require('../../middleware/authMiddleware');
 *   const { authorize } = require('../../middleware/roleMiddleware');
 *
 *   // Only admin can delete a service
 *   router.delete('/:id', protect, authorize('admin'), controller.delete);
 *
 *   // Both vet and admin can update medical records
 *   router.put('/:id', protect, authorize('veterinarian', 'admin'), controller.update);
 *
 * On failure:
 *   403 — User does not have permission
 * ─────────────────────────────────────────────────────────────
 */

const { sendError } = require('../utils/response');

/**
 * Middleware factory: Restrict route to specific roles.
 * @param {...string} roles - One or more allowed roles
 * @returns {Function} Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`
      );
    }

    next();
  };
};

module.exports = { authorize };
