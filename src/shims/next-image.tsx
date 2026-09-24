import React, { useState, useEffect } from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80';

export default function Image({ fill, priority, unoptimized, className = '', style, src, alt, onError, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(typeof src === 'string' && src ? src : DEFAULT_FALLBACK);

  useEffect(() => {
    if (typeof src === 'string' && src) {
      setImgSrc(src);
    }
  }, [src]);

  const fillStyle: React.CSSProperties = fill
    ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'cover' }
    : {};

  return (
    <img
      src={imgSrc}
      alt={alt || ''}
      className={className}
      style={{ ...fillStyle, ...style }}
      onError={(e) => {
        if (imgSrc !== DEFAULT_FALLBACK) {
          setImgSrc(DEFAULT_FALLBACK);
        }
        if (onError) onError(e);
      }}
      {...props}
    />
  );
}
