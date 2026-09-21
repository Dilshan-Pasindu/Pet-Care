/**
 * auth.service.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/common/authentication/auth.service.js
 * Owner: Common Group Function — Authentication
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Contains the business logic for authentication operations.
 *   The controller calls these functions and handles the HTTP
 *   response. Service functions are pure business logic,
 *   making them easier to test independently.
 *
 * Functions:
 *   registerUser()     — Create a new user account
 *   loginUser()        — Authenticate user and return token
 *   getCurrentUser()   — Retrieve authenticated user's profile
 *   updateUserProfile() — Update profile fields
 * ─────────────────────────────────────────────────────────────
 */

const User = require('./user.model');
const generateToken = require('../../utils/generateToken');

/**
 * Register a new user.
 * @param {Object} userData - { name, email, password, phone, role }
 * @returns {Object} { user, token }
 * @throws Error if email already exists
 */
const registerUser = async (userData) => {
  const { name, email, password, phone, role } = userData;

  // Check if a user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  // Create the user — password will be hashed by the pre-save hook in user.model.js
  const user = await User.create({
    name,
    email,
    password,
    phone: phone || null,
    role: role || 'owner',
  });

  // Generate JWT for the new user
  const token = generateToken(user._id, user.role);

  // Return user (without password) and token
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
  };

  return { user: userResponse, token };
};

/**
 * Authenticate a user and return a JWT.
 * @param {string} email
 * @param {string} password
 * @returns {Object} { user, token }
 * @throws Error if credentials are invalid
 */
const loginUser = async (email, password) => {
  // Find user by email — explicitly include password (select: false in schema)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Compare provided password to the stored hash
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT
  const token = generateToken(user._id, user.role);

  // Return user (without password) and token
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
  };

  return { user: userResponse, token };
};

/**
 * Get the currently authenticated user's profile.
 * @param {string} userId - From req.user.id (set by authMiddleware)
 * @returns {Object} User document (no password)
 * @throws Error if user not found
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Update the currently authenticated user's profile.
 * @param {string} userId - From req.user.id
 * @param {Object} updateData - { name, phone }
 * @param {string} [imageUrl] - Cloudinary URL (from upload middleware)
 * @returns {Object} Updated user document
 */
const updateUserProfile = async (userId, updateData, imageUrl = null) => {
  const allowedUpdates = {};

  if (updateData.name) allowedUpdates.name = updateData.name;
  if (updateData.phone) allowedUpdates.phone = updateData.phone;
  if (imageUrl) allowedUpdates.profileImage = imageUrl;

  const user = await User.findByIdAndUpdate(
    userId,
    allowedUpdates,
    { new: true, runValidators: true } // Return updated doc + run schema validators
  );

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { registerUser, loginUser, getCurrentUser, updateUserProfile };
