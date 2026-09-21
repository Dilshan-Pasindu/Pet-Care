/**
 * generateToken.js
 * ─────────────────────────────────────────────────────────────
 * JWT token generation helper.
 *
 * Purpose:
 *   Creates a signed JWT containing the user's _id and role.
 *   Used by the auth controller after successful login/register.
 *   The token is returned to the client, which stores it and
 *   sends it in the Authorization header for protected requests.
 *
 * Environment Variables Required:
 *   JWT_SECRET     — Secret key for signing (from .env)
 *   JWT_EXPIRES_IN — Token expiry time, e.g. "7d" (from .env)
 *
 * Usage:
 *   const generateToken = require('../utils/generateToken');
 *   const token = generateToken(user._id, user.role);
 * ─────────────────────────────────────────────────────────────
 */

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a user.
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} role   - User role: 'owner' | 'veterinarian' | 'admin'
 * @returns {string}      - Signed JWT string
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

module.exports = generateToken;
