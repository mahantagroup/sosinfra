/**
 * Cloudinary & Image Optimization Utility
 */

const CLOUDINARY_CLOUD_NAME = 'dlsbj8nug';
const DEFAULT_CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Standard widths according to usage context
 */
export const IMAGE_WIDTHS = {
  avatar: 100,
  thumbnail: 150,
  card: 300,
  preview: 600,
  full: 1200,
};

/**
 * Transforms any Cloudinary image URL or public_id into an optimized responsive URL.
 * Automatically adds: f_auto, q_auto, c_limit, w_<width>
 * 
 * @param {string} urlOrPublicId - Cloudinary full URL or public_id
 * @param {number|string} [width=600] - Desired image width (or preset name like 'avatar', 'thumbnail', 'card', 'preview', 'full')
 * @param {Object} [options] - Additional transformation options
 * @returns {string} Optimized URL (or original input if not Cloudinary/invalid)
 */
export const getOptimizedCloudinaryUrl = (urlOrPublicId, width = 600, options = {}) => {
  if (!urlOrPublicId || typeof urlOrPublicId !== 'string') {
    return urlOrPublicId || '';
  }

  // Handle preset width names
  let numericWidth = typeof width === 'string' && IMAGE_WIDTHS[width] ? IMAGE_WIDTHS[width] : Number(width);
  if (!numericWidth || isNaN(numericWidth)) {
    numericWidth = 600;
  }

  let cleanUrl = urlOrPublicId.trim();

  // If local asset, data URI, blob, or non-Cloudinary external URL that isn't a public_id
  if (
    cleanUrl.startsWith('data:') ||
    cleanUrl.startsWith('blob:') ||
    cleanUrl.startsWith('/') ||
    (cleanUrl.startsWith('http') && !cleanUrl.includes('res.cloudinary.com'))
  ) {
    return cleanUrl;
  }

  // Ensure HTTPS
  if (cleanUrl.startsWith('http://res.cloudinary.com/')) {
    cleanUrl = cleanUrl.replace('http://res.cloudinary.com/', 'https://res.cloudinary.com/');
  }

  const transformParams = [`f_auto`, `q_auto`, `c_limit`, `w_${numericWidth}`];
  if (options.quality) transformParams[1] = `q_${options.quality}`;
  if (options.crop) transformParams[2] = `c_${options.crop}`;
  if (options.height) transformParams.push(`h_${options.height}`);
  const transformStr = transformParams.join(',');

  // Case 1: Full Cloudinary URL
  if (cleanUrl.includes('res.cloudinary.com')) {
    const uploadIndex = cleanUrl.indexOf('/image/upload/');
    if (uploadIndex !== -1) {
      const prefix = cleanUrl.substring(0, uploadIndex + '/image/upload/'.length);
      let rest = cleanUrl.substring(uploadIndex + '/image/upload/'.length);

      // Check if there's already a transformation segment before /v... or public_id
      // Transformations in Cloudinary URLs usually contain commas, underscores, or specific flags
      const parts = rest.split('/');

      if (parts.length > 1 && (parts[0].includes(',') || parts[0].startsWith('f_') || parts[0].startsWith('q_') || parts[0].startsWith('w_') || parts[0].startsWith('c_'))) {
        // Replace existing transformations with our optimized set
        parts[0] = transformStr;
        return prefix + parts.join('/');
      } else {
        // Insert optimization transformations
        return prefix + transformStr + '/' + rest;
      }
    }
  }

  // Case 2: Public ID (e.g. "v1782036214/1_kcqtxc.jpg" or "1_kcqtxc")
  const sanitizedPublicId = cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl;
  return `${DEFAULT_CLOUDINARY_BASE}/${transformStr}/${sanitizedPublicId}`;
};

/**
 * Browser-side image compression using HTML5 Canvas API.
 * Resizes large images, compresses quality, targets ~300-500 KB while preserving text clarity.
 * 
 * @param {File} file - Original file object
 * @param {Object} [options] - Compression options
 * @returns {Promise<File>} Compressed File object
 */
export const compressImage = async (file, options = {}) => {
  if (!file || !(file instanceof File) || !file.type.startsWith('image/')) {
    return file; // Return non-image files as-is
  }

  // SVG images shouldn't be canvas-compressed
  if (file.type === 'image/svg+xml') {
    return file;
  }

  const {
    maxWidth = options.isDocument ? 1920 : 1600,
    maxHeight = options.isDocument ? 1920 : 1600,
    maxSizeKB = 450,
    initialQuality = 0.85,
    minQuality = 0.65,
  } = options;

  // Don't process already small files (< 150 KB)
  if (file.size <= 150 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.width;
      let height = img.height;

      // Calculate scaled dimensions while preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      // Fill white background for transparent images converted to JPEG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // High quality smoothing settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      let currentQuality = initialQuality;

      const attemptCompress = (quality) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Iterative compression if size exceeds limit and quality can be reduced
            if (blob.size > maxSizeKB * 1024 && quality > minQuality) {
              currentQuality = Math.max(minQuality, quality - 0.08);
              attemptCompress(currentQuality);
            } else {
              // Create compressed File object retaining original name
              const fileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
              const compressedFile = new File([blob], fileName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            }
          },
          'image/jpeg',
          quality
        );
      };

      attemptCompress(currentQuality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};
