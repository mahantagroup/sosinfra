import React, { useState, useEffect } from 'react';
import { getImageViewUrl } from './Firebase/s3UploadService';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUtils';
import { Loader2 } from 'lucide-react';

const S3Image = ({ src, width = 600, alt = '', className = '', loading = 'lazy', ...props }) => {
  const [url, setUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUrl = async () => {
      if (!src) {
        setIsLoading(false);
        return;
      }
      
      // If src is already a full URL, use it directly
      if (typeof src === 'string' && (src.startsWith('http') || src.startsWith('blob:'))) {
        if (isMounted) {
          setUrl(src);
          setIsLoading(false);
        }
        return;
      }

      try {
        const viewUrl = await getImageViewUrl(src);
        if (isMounted) {
          setUrl(viewUrl);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching S3/Cloudinary image:', error);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUrl();
    return () => { isMounted = false; };
  }, [src]);

  if (isLoading) {
    return (
      <div className={`${className} d-flex align-items-center justify-center bg-slate-100`}>
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!url) {
    return (
      <div className={`${className} d-flex align-items-center justify-center bg-slate-100 text-slate-400 text-[10px]`}>
        No Image
      </div>
    );
  }

  const optimizedUrl = getOptimizedCloudinaryUrl(url, width);

  return <img src={optimizedUrl} alt={alt} className={className} loading={loading} {...props} />;
};

export default S3Image;
