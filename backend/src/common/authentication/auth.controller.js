/**
 * auth.controller.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/common/authentication/auth.controller.js
 * Owner: Common Group Function — Authentication
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Handles incoming HTTP requests for authentication endpoints.
 *   Controllers are thin — they call the service layer and
 *   return the appropriate HTTP response.
 *
 * Endpoints handled:
 *   POST /api/auth/register → register()
 *   POST /api/auth/login    → login()
 *   GET  /api/auth/me       → getMe()
 *   PUT  /api/auth/me       → updateMe()
 * ─────────────────────────────────────────────────────────────
 */

const authService = require('./auth.service');
const { sendSuccess, sendError } = require('../../utils/response');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 * @body    { name, email, password, phone?, role? }
 */
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.registerUser(req.body);

    return sendSuccess(res, 201, 'Account created successfully.', { user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login with email and password, receive JWT
 * @access  Public
 * @body    { email, password }
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    return sendSuccess(res, 200, 'Login successful.', { user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get the currently authenticated user's profile
 * @access  Private (requires JWT)
 * @header  Authorization: Bearer <token>
 */
const getMe = async (req, res, next) => {
  try {
    // req.user.id is set by authMiddleware after token verification
    const user = await authService.getCurrentUser(req.user.id);

    return sendSuccess(res, 200, 'User profile retrieved successfully.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/me
 * @desc    Update the current user's profile (name, phone, profileImage)
 * @access  Private (requires JWT)
 * @body    { name?, phone? }
 * @file    profileImage (multipart/form-data, optional)
 */
const updateMe = async (req, res, next) => {
  try {
    // If an image was uploaded via Multer/Cloudinary, req.file.path is the URL
    const imageUrl = req.file ? req.file.path : null;

    const user = await authService.updateUserProfile(req.user.id, req.body, imageUrl);

    return sendSuccess(res, 200, 'Profile updated successfully.', user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateMe };
