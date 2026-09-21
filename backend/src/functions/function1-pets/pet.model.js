/**
 * pet.model.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function1-pets/pet.model.js
 * Owner: Function 1 — Pet Management
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Defines the Mongoose schema and model for the Pet entity.
 *   Pets belong to a User (owner) and are referenced by
 *   Appointments, MedicalRecords, and ServiceBookings.
 *
 * Relationships:
 *   Pet.ownerId           → User._id (owner)
 *   Appointment.petId     → Pet._id
 *   MedicalRecord.petId   → Pet._id
 *   ServiceBooking.petId  → Pet._id
 *
 * Image:
 *   Stores Cloudinary URL (string), uploaded via Function 1's
 *   add/edit pet forms using expo-image-picker + uploadMiddleware.
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },

    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      minlength: [1, 'Pet name must be at least 1 character'],
      maxlength: [100, 'Pet name cannot exceed 100 characters'],
    },

    species: {
      type: String,
      required: [true, 'Species is required'],
      trim: true,
      // Examples: Dog, Cat, Bird, Rabbit, Fish, Hamster, etc.
    },

    breed: {
      type: String,
      trim: true,
      default: null,
    },

    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'unknown'],
        message: 'Gender must be male, female, or unknown',
      },
      default: 'unknown',
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    weight: {
      type: Number, // in kilograms
      min: [0, 'Weight cannot be negative'],
      default: null,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: null,
    },

    image: {
      type: String, // Cloudinary URL
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Index for efficient owner-based queries ──────────────────
// "Get all pets for this owner" is a very common query
petSchema.index({ ownerId: 1 });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
