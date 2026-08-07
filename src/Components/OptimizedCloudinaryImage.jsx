import React from 'react';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUtils';

/**
 * Reusable Optimized Cloudinary Image Component
 * 
 * Automatically applies:
 * - f_auto (format optimization)
 * - q_auto (quality optimization)
 * - responsive width (w_<width>)
 * - aspect ratio limit (c_limit)
 * - lazy loading (loading="lazy")
 */
const OptimizedCloudinaryImage = ({
  src,
  width = 600,
  alt = '',
  className = '',
  loading = 'lazy',
  style,
  ...props
}) => {
  if (!src) return null;

  const optimizedSrc = getOptimizedCloudinaryUrl(src, width);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      loading={loading}
      style={style}
      {...props}
    />
  );
};

export default OptimizedCloudinaryImage;
