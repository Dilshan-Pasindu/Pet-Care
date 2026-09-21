/**
 * veterinarian.model.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function2-veterinarians/veterinarian.model.js
 * Owner: Function 2 — Veterinarian Management
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Defines the Mongoose schema for the Veterinarian entity.
 *   A Veterinarian profile is linked to a User account (userId).
 *   When a user registers with role 'veterinarian', an admin
 *   can create their Veterinarian profile via this model.
 *
 * Relationships:
 *   Veterinarian.userId     → User._id (the vet's login account)
 *   Appointment.veterinarianId → Veterinarian._id
 *   MedicalRecord.veterinarianId → Veterinarian._id
 *   Review.veterinarianId   → Veterinarian._id
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String, // e.g. "09:00"
    required: true,
  },
  endTime: {
    type: String, // e.g. "17:00"
    required: true,
  },
}, { _id: false });

const veterinarianSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // One vet profile per user account
    },

    name: {
      type: String,
      required: [true, 'Veterinarian name is required'],
      trim: true,
    },

    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
      // e.g. Small Animals, Exotic Animals, Surgery, Dermatology
    },

    qualification: {
      type: String,
      trim: true,
      default: null,
      // e.g. BVSc, MVSc, PhD
    },

    experience: {
      type: Number, // years of experience
      min: [0, 'Experience cannot be negative'],
      default: 0,
    },

    clinicName: {
      type: String,
      trim: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    location: {
      type: String,
      trim: true,
      default: null,
      // e.g. "123 Main St, Colombo"
    },

    consultationFee: {
      type: Number,
      min: [0, 'Consultation fee cannot be negative'],
      default: 0,
    },

    availability: {
      type: [availabilitySlotSchema],
      default: [],
    },

    profileImage: {
      type: String, // Cloudinary URL
      default: null,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search/filter queries
veterinarianSchema.index({ specialization: 'text', name: 'text' });
veterinarianSchema.index({ location: 1 });

const Veterinarian = mongoose.model('Veterinarian', veterinarianSchema);

module.exports = Veterinarian;
