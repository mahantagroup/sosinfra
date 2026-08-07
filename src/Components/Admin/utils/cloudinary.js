import { uploadToCloudinary } from '../../Firebase/cloudinaryService';

export const uploadMediaToCloudinary = async (file, onProgress, options = {}) => {
  return uploadToCloudinary(file, onProgress, options);
};

