/**
 * response.js
 * ─────────────────────────────────────────────────────────────
 * Standardized API response helpers.
 *
 * Purpose:
 *   Ensures every API endpoint returns consistent JSON responses.
 *   All controllers use these helpers instead of writing raw
 *   res.json() calls, so the shape is always the same.
 *
 * Standard Success Shape:
 *   { success: true, message: "...", data: {...} }
 *
 * Standard Error Shape:
 *   { success: false, message: "..." }
 *
 * Usage:
 *   const { sendSuccess, sendError } = require('../../utils/response');
 *   sendSuccess(res, 201, 'Pet created successfully', pet);
 *   sendError(res, 404, 'Pet not found');
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Send a successful API response.
 * @param {Object} res       - Express response object
 * @param {number} statusCode - HTTP status code (200, 201, etc.)
 * @param {string} message   - Human-readable success message
 * @param {*}      data      - The payload to return (object, array, etc.)
 * @param {number} [count]   - Optional: total count for paginated lists
 */
const sendSuccess = (res, statusCode, message, data = null, count = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (count !== null) response.count = count;

  return res.status(statusCode).json(response);
};

/**
 * Send an error API response.
 * @param {Object} res       - Express response object
 * @param {number} statusCode - HTTP status code (400, 401, 404, 500, etc.)
 * @param {string} message   - Human-readable error message
 * @param {*}      [errors]  - Optional: validation error details
 */
const sendError = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) response.errors = errors;

  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
