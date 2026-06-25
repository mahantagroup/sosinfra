import axios from 'axios';

const API_BASE = import.meta.env.VITE_UPLOAD_API_URL || '';

export const isExternalImageUrl = (value) =>
  typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));

export const getImageViewUrl = async (keyOrUrl) => {
  if (!keyOrUrl) return null;
  
  // If it's already a full URL (Cloudinary or others), return it directly
  if (isExternalImageUrl(keyOrUrl)) return keyOrUrl;

  try {
    const { data } = await axios.get(`${API_BASE}/api/upload/view`, {
      params: { key: keyOrUrl },
    });
    return data.url;
  } catch (error) {
    console.error('Error fetching image URL:', error);
    return null;
  }
};

export const uploadToS3 = async (file, docType, onProgress) => {
  const { data } = await axios.post(`${API_BASE}/api/upload/presign`, {
    fileName: file.name,
    contentType: file.type,
    docType,
  });

  await axios.put(data.uploadUrl, file, {
    headers: { 'Content-Type': file.type },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return data.key;
};
