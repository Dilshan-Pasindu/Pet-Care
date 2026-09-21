/**
 * appointment.model.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function3-appointments/appointment.model.js
 * Owner: Function 3 — Appointment Management
 * ─────────────────────────────────────────────────────────────
 *
 * Statuses: pending → confirmed → completed | cancelled
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Pet ID is required'],
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },

    veterinarianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Veterinarian',
      required: [true, 'Veterinarian ID is required'],
    },

    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },

    time: {
      type: String, // e.g. "10:30"
      required: [true, 'Appointment time is required'],
    },

    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },

    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'completed', 'cancelled'],
        message: 'Status must be: pending, confirmed, completed, or cancelled',
      },
      default: 'pending',
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
appointmentSchema.index({ ownerId: 1, status: 1 });
appointmentSchema.index({ veterinarianId: 1, status: 1 });
appointmentSchema.index({ petId: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
