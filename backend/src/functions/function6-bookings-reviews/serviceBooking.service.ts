/**
 * functions/function6-bookings-reviews/serviceBooking.service.ts
 * Owner: Function 6 — Service Bookings & Reviews
 */

import ServiceBooking from './serviceBooking.model';
import { IServiceBooking, BookingStatus, UserRole } from '../../types/models';

export interface CreateBookingInput {
  petId: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

export interface BookingQuery {
  status?: BookingStatus;
  serviceId?: string;
  date?: string;
}

export const createBooking = async (
  data: CreateBookingInput,
  userId: string
): Promise<IServiceBooking> => {
  const booking = await ServiceBooking.create({ ...data, userId });
  await booking.populate(['petId', 'serviceId', 'userId']);
  return booking;
};

export const getBookings = async (
  userId: string,
  userRole: UserRole,
  query: BookingQuery = {}
): Promise<IServiceBooking[]> => {
  const filter: Record<string, unknown> = {};

  if (userRole === 'owner') {
    filter.userId = userId;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.serviceId) {
    filter.serviceId = query.serviceId;
  }
  if (query.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(query.date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  return ServiceBooking.find(filter)
    .populate('petId', 'name species breed image')
    .populate('serviceId', 'name category price duration image')
    .populate('userId', 'name email phone')
    .sort({ date: -1, createdAt: -1 });
};

export const getBookingById = async (
  bookingId: string,
  userId: string,
  userRole: UserRole
): Promise<IServiceBooking> => {
  const booking = await ServiceBooking.findById(bookingId)
    .populate('petId', 'name species breed image')
    .populate('serviceId', 'name category price duration provider image')
    .populate('userId', 'name email phone');

  if (!booking) {
    throw Object.assign(new Error('Booking not found.'), { statusCode: 404 });
  }

  if (userRole === 'owner' && booking.userId._id.toString() !== userId && booking.userId.toString() !== userId) {
    throw Object.assign(new Error('You do not have permission to view this booking.'), { statusCode: 403 });
  }

  return booking;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  userId: string,
  userRole: UserRole
): Promise<IServiceBooking> => {
  const booking = await ServiceBooking.findById(bookingId);
  if (!booking) {
    throw Object.assign(new Error('Booking not found.'), { statusCode: 404 });
  }

  // Owners can only cancel their own bookings
  if (userRole === 'owner') {
    if (booking.userId.toString() !== userId) {
      throw Object.assign(new Error('You do not have permission to modify this booking.'), { statusCode: 403 });
    }
    if (status !== 'cancelled') {
      throw Object.assign(new Error('Pet owners can only cancel bookings.'), { statusCode: 403 });
    }
  }

  const updated = await ServiceBooking.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true, runValidators: true }
  ).populate(['petId', 'serviceId', 'userId']);

  return updated as IServiceBooking;
};

export const deleteBooking = async (
  bookingId: string,
  userId: string,
  userRole: UserRole
): Promise<void> => {
  const booking = await ServiceBooking.findById(bookingId);
  if (!booking) {
    throw Object.assign(new Error('Booking not found.'), { statusCode: 404 });
  }

  if (userRole === 'owner' && booking.userId.toString() !== userId) {
    throw Object.assign(new Error('You do not have permission to delete this booking.'), { statusCode: 403 });
  }

  await ServiceBooking.findByIdAndDelete(bookingId);
};
