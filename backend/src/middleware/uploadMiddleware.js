/**
 * uploadMiddleware.js
 * ─────────────────────────────────────────────────────────────
 * File Upload Middleware using Multer + Cloudinary.
 *
 * Purpose:
 *   Handles image uploads for:
 *     - Pet profile images       (Function 1)
 *     - Veterinarian profile images (Function 2)
 *     - Service images           (Function 5)
 *     - User profile images      (Common Auth)
 *
 *   Files are uploaded directly to Cloudinary.
 *   The Cloudinary URL is stored in the database (not a local path).
 *
 * Environment Variables Required:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Usage (in any route file):
 *   const { uploadSingle } = require('../../middleware/uploadMiddleware');
 *
 *   // Upload a single image with field name 'image'
 *   router.post('/', protect, uploadSingle('image'), controller.create);
 *
 * After upload, the Cloudinary URL is available at:
 *   req.file.path       — Cloudinary secure URL
 *   req.file.filename   — Cloudinary public_id
 *
 * Allowed file types: JPEG, JPG, PNG, WEBP
 * Max file size: 5MB
 * ─────────────────────────────────────────────────────────────
 */

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'petcare',        // All PetCare images go into 'petcare' folder on Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto' },
    ],
  },
});

// File filter — only allow image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

// Multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

/**
 * Middleware: Upload a single image.
 * @param {string} fieldName - The form field name for the file input
 * @returns {Function} Multer middleware
 */
const uploadSingle = (fieldName) => upload.single(fieldName);

module.exports = { uploadSingle, cloudinary };
