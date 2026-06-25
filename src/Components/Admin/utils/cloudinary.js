import axios from 'axios';

export const uploadMediaToCloudinary = async (file, onProgress) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'Mahanta_group');

  const response = await axios.post(
    'https://api.cloudinary.com/v1_1/dlsbj8nug/auto/upload',
    data,
    {
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    }
  );

  return response.data.secure_url;
};
