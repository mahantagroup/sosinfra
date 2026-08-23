import axios from 'axios';
import { compressImage } from '../../utils/cloudinaryUtils';

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL || 'https://api.cloudinary.com/v1_1/dlsbj8nug/image/upload';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Mahanta_group';

// WeakMap to prevent duplicate uploads for the exact same File instance
const fileUploadCache = new WeakMap();

export const isExternalImageUrl = (value) =>
  typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));

/**
 * Returns the URL for viewing an image.
 */
export const getImageViewUrl = async (urlOrPublicId) => {
  if (!urlOrPublicId) return null;
  return urlOrPublicId;
};

/**
 * Uploads a file to Cloudinary with browser-side compression and duplicate prevention.
 * 
 * @param {File} file - File object to upload
 * @param {Function|Object} [onProgressOrOptions] - Progress callback or options object
 * @param {Object} [extraOptions] - Upload configuration options
 * @returns {Promise<string>} Cloudinary secure_url
 */
export const uploadToCloudinary = async (file, onProgressOrOptions, extraOptions = {}) => {
  if (!file) return '';

  let onProgress = typeof onProgressOrOptions === 'function' ? onProgressOrOptions : null;
  let options = typeof onProgressOrOptions === 'object' ? onProgressOrOptions : extraOptions;

  // Deduplication check: reuse active or completed upload promise for this File reference
  if (fileUploadCache.has(file)) {
    console.log('⚡ Reusing cached Cloudinary upload for file:', file.name);
    return fileUploadCache.get(file);
  }

  const uploadPromise = (async () => {
    // Step 1: Compress image on client side (targets 300-500 KB while preserving text clarity)
    const compressedFile = await compressImage(file, {
      isDocument: options.isDocument,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      maxSizeKB: options.maxSizeKB || 450,
    });

    // Step 2: Prepare FormData
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    // Prevent duplicate asset creation if customPublicId is provided
    if (options.customPublicId) {
      formData.append('public_id', options.customPublicId);
    }

    const { data } = await axios.post(CLOUDINARY_URL, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return data.secure_url;
  })();

  fileUploadCache.set(file, uploadPromise);

  try {
    const url = await uploadPromise;
    return url;
  } catch (error) {
    fileUploadCache.delete(file);
    console.error('Cloudinary upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
