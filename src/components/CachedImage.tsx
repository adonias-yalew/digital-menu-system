import React, { useState, useRef, useEffect } from 'react';
import { useImageCache } from '@/utils/imageCache';

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  preload?: boolean;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==',
  onLoad,
  onError,
  preload = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const { createLazyImage } = useImageCache();

  useEffect(() => {
    if (preload) {
      // Preload the image
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
        setIsError(true);
        onError?.();
      };
      img.src = src;
      return;
    }

    // Use lazy loading for non-preloaded images
    if (imgRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.onload = () => {
                setCurrentSrc(src);
                setIsLoaded(true);
                onLoad?.();
              };
              img.onerror = () => {
                setIsError(true);
                onError?.();
              };
              img.src = src;
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image comes into view
        }
      );

      observer.observe(imgRef.current);

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    } else {
      // Fallback for browsers that don't support Intersection Observer
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
        setIsError(true);
        onError?.();
      };
      img.src = src;
    }
  }, [src, preload, onLoad, onError]);

  if (isError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        role="img"
        aria-label={`Failed to load: ${alt}`}
      >
        <span className="text-xs text-center">Image not available</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-70'} ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
};

export default CachedImage;
