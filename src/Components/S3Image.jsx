import React, { useState, useEffect } from 'react';
import { getImageViewUrl } from './Firebase/s3UploadService';
import { Loader2 } from 'lucide-react';

const S3Image = ({ src, alt, className, ...props }) => {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUrl = async () => {
      if (!src) {
        setLoading(false);
        return;
      }
      
      // If src is already a full URL, use it directly
      if (typeof src === 'string' && (src.startsWith('http') || src.startsWith('blob:'))) {
        if (isMounted) {
          setUrl(src);
          setLoading(false);
        }
        return;
      }

      try {
        const viewUrl = await getImageViewUrl(src);
        if (isMounted) {
          setUrl(viewUrl);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching S3 image:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchUrl();
    return () => { isMounted = false; };
  }, [src]);

  if (loading) {
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

  return <img src={url} alt={alt} className={className} {...props} />;
};

export default S3Image;
