/**
 * errorMiddleware.js
 * ─────────────────────────────────────────────────────────────
 * Global Error Handling Middleware.
 *
 * Purpose:
 *   Catches any unhandled errors thrown in controllers or
 *   middleware and returns a consistent JSON error response.
 *   This prevents Express from sending HTML error pages.
 *
 *   Must be registered LAST in server.js after all routes.
 *
 * Usage (in server.js):
 *   const { errorHandler } = require('./src/middleware/errorMiddleware');
 *   // Register after all routes:
 *   app.use(errorHandler);
 *
 * Error types handled:
 *   - Mongoose CastError (invalid ObjectId) → 400
 *   - Mongoose ValidationError              → 422
 *   - Mongoose duplicate key (11000)        → 409
 *   - Multer errors (file upload)           → 400
 *   - All other errors                      → 500
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Global error handler middleware.
 * @param {Error}    err  - The error object
 * @param {Object}   req  - Express request
 * @param {Object}   res  - Express response
 * @param {Function} next - Express next function (required signature)
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose: Invalid ObjectId (e.g., /api/pets/not-an-id)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose: Validation error (required fields missing, enum mismatch, etc.)
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Mongoose: Duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value: ${field} already exists.`;
  }

  // Multer: File upload error
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Maximum file size is 5MB.';
    } else {
      message = err.message;
    }
  }

  // JWT: Malformed token (should be caught in authMiddleware, but just in case)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please login again.';
  }

  // Log the full error in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 ERROR:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorHandler };
