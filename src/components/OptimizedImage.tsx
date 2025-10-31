import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onClick?: () => void;
}

/**
 * OptimizedImage Component
 * 
 * Provides optimized image loading with:
 * - Lazy loading for non-priority images
 * - WebP format support via Sanity urlFor
 * - Blur placeholder effect while loading
 * - Smooth fade-in transition
 * - Error handling with fallback
 * 
 * @param src - Image URL (from Sanity urlFor)
 * @param alt - Alt text for accessibility
 * @param priority - If true, loads immediately (for above-fold images)
 * @param className - Additional CSS classes
 * @param onError - Error handler callback
 * @param onClick - Click handler
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  onError,
  onClick,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder URL (tiny version)
  const blurDataURL = src ? `${src.split('?')[0]}?w=20&blur=50` : '';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  if (hasError || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900',
          className
        )}
        aria-label="Image failed to load"
      >
        <div className="text-center text-white/40">
          <div className="text-4xl mb-2" aria-hidden="true">
            📷
          </div>
          <div className="text-xs">Image unavailable</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {!isLoaded && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
        />
      )}

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          onClick && 'cursor-pointer'
        )}
      />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800/50 animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
}
