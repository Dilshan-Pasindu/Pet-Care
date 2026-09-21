/**
 * middleware/uploadMiddleware.ts
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/middleware/uploadMiddleware.ts
 * ─────────────────────────────────────────────────────────────
 *
 * Purpose:
 *   File upload middleware using Multer + Cloudinary.
 *   Supports image uploads for pets, vets, services, and users.
 *   Images stored on Cloudinary (not local filesystem).
 *
 * Note:
 *   multer-storage-cloudinary lacks official @types.
 *   We use a local type declaration to keep type safety without @ts-ignore.
 * ─────────────────────────────────────────────────────────────
 */

import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { Request } from 'express';
import cloudinaryV2 from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const cloudinary = cloudinaryV2.v2;

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'petcare',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  } as Record<string, unknown>,
}) as StorageEngine;

// File type filter
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * Upload a single image file.
 * @param fieldName - The multipart form field name (e.g. 'image', 'profileImage')
 */
export const uploadSingle = (fieldName: string): ReturnType<typeof upload.single> =>
  upload.single(fieldName);

export { cloudinary };
