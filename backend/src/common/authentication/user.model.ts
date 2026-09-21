/**
 * common/authentication/user.model.ts
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/common/authentication/user.model.ts
 * Owner: Common Group Function — Authentication
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   Mongoose schema + model for the User entity with full
 *   TypeScript typings via the IUser interface.
 *   Password is hashed in a pre-save hook.
 *   comparePassword() is an instance method typed on IUser.
 * ─────────────────────────────────────────────────────────────
 */

import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../../types/models';

const userSchema = new Schema<IUser>(
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
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries by default
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    role: {
      type: String,
      enum: ['owner', 'veterinarian', 'admin'] as UserRole[],
      default: 'owner' as UserRole,
    },

    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Pre-save: Hash password ──────────────────────────────────
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: Compare passwords ──────────────────────
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password as string);
};

const User = model<IUser>('User', userSchema);

export default User;
