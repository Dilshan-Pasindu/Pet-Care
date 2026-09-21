/**
 * user.model.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/common/authentication/user.model.js
 * Owner: Common Group Function — Authentication
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Defines the Mongoose schema and model for the User entity.
 *   This is the core authentication model shared by all functions.
 *
 * Relationships:
 *   - Pet.ownerId         → User._id
 *   - Appointment.ownerId → User._id
 *   - ServiceBooking.userId → User._id
 *   - Review.userId       → User._id
 *   - Veterinarian.userId → User._id (for vet role users)
 *
 * Security:
 *   - Password is hashed with bcrypt before saving (pre-save hook)
 *   - Password field is excluded from queries by default (select: false)
 *   - comparePassword() method for login verification
 *   - profileImage URL is stored (from Cloudinary), not the actual file
 *
 * Roles:
 *   'owner'        — Regular pet owner users
 *   'veterinarian' — Veterinarians (linked to Veterinarian model)
 *   'admin'        — Platform administrators
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // NEVER returned in API responses by default
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    role: {
      type: String,
      enum: {
        values: ['owner', 'veterinarian', 'admin'],
        message: 'Role must be owner, veterinarian, or admin',
      },
      default: 'owner',
    },

    profileImage: {
      type: String, // Cloudinary URL
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Pre-save Hook: Hash password before saving ───────────────
userSchema.pre('save', async function (next) {
  // Only hash if the password field was modified (new user or password change)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ─── Instance Method: Compare plain password to hashed ────────
/**
 * Compares a plain-text password to the stored hashed password.
 * @param {string} enteredPassword - The password from the login form
 * @returns {Promise<boolean>} - true if passwords match
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
