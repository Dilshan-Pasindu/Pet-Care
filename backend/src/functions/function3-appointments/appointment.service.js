/**
 * appointment.service.js
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function3-appointments/appointment.service.js
 * Owner: Function 3 — Appointment Management
 * ─────────────────────────────────────────────────────────────
 */

const Appointment = require('./appointment.model');

const createAppointment = async (appointmentData, ownerId) => {
  const appointment = await Appointment.create({ ...appointmentData, ownerId });
  return appointment.populate(['petId', 'veterinarianId']);
};

const getAppointments = async (userId, userRole, query = {}) => {
  const filter = {};
  const { status } = query;

  // Role-based filtering
  if (userRole === 'owner') filter.ownerId = userId;
  // For vet: find their veterinarian profile and filter by it
  // (handled in controller — passed as vetId query param by the route if needed)
  if (query.veterinarianId) filter.veterinarianId = query.veterinarianId;

  if (status) filter.status = status;

  const appointments = await Appointment.find(filter)
    .populate('petId', 'name species image')
    .populate('veterinarianId', 'name specialization clinicName')
    .populate('ownerId', 'name email phone')
    .sort({ date: 1 });

  return appointments;
};

const getAppointmentById = async (appointmentId, userId, userRole) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate('petId', 'name species image')
    .populate('veterinarianId', 'name specialization clinicName phone')
    .populate('ownerId', 'name email phone');

  if (!appointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  // Authorization: owner can only view their own; vet and admin can view any
  if (userRole === 'owner' && appointment.ownerId._id.toString() !== userId) {
    const error = new Error('You do not have permission to view this appointment.');
    error.statusCode = 403;
    throw error;
  }

  return appointment;
};

const updateAppointment = async (appointmentId, updateData, userId, userRole) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  // Owners can cancel (status=cancelled) or update reason/notes if pending
  // Vets/admins can change status (confirm, complete, etc.)
  if (userRole === 'owner' && appointment.ownerId.toString() !== userId) {
    const error = new Error('You do not have permission to update this appointment.');
    error.statusCode = 403;
    throw error;
  }

  const updated = await Appointment.findByIdAndUpdate(
    appointmentId,
    updateData,
    { new: true, runValidators: true }
  ).populate(['petId', 'veterinarianId', 'ownerId']);

  return updated;
};

const deleteAppointment = async (appointmentId, userId, userRole) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    const error = new Error('Appointment not found.');
    error.statusCode = 404;
    throw error;
  }

  if (userRole === 'owner' && appointment.ownerId.toString() !== userId) {
    const error = new Error('You do not have permission to cancel this appointment.');
    error.statusCode = 403;
    throw error;
  }

  await Appointment.findByIdAndDelete(appointmentId);
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
