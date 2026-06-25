import axios from 'axios';

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isExternalImageUrl = (value) =>
  typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));

/**
 * Returns the URL for viewing an image.
 * Since Cloudinary returns full URLs, we just return the value if it's a URL.
 */
export const getImageViewUrl = async (urlOrPublicId) => {
  if (!urlOrPublicId) return null;
  // If it's already a full URL, return it
  if (isExternalImageUrl(urlOrPublicId)) return urlOrPublicId;
  
  // If it's just a public_id, you might want to construct the URL here.
  // But usually, we will store the secure_url in Firestore.
  return urlOrPublicId;
};

/**
 * Uploads a file to Cloudinary and returns the secure_url.
 */
export const uploadToCloudinary = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const { data } = await axios.post(CLOUDINARY_URL, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
