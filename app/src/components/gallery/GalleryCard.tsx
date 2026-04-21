import { useState } from 'react';
import { Camera } from 'lucide-react';
import { EASING, DURATION } from '@/lib/animations';

interface GalleryCardProps {
  imageUrl: string;
  caption?: string;
  index: number;
  isVisible: boolean;
  onClick: () => void;
}

export function GalleryCard({ imageUrl, caption, index, isVisible, onClick }: GalleryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="gallery-card group relative overflow-hidden rounded-none cursor-pointer break-inside-avoid mb-3 md:mb-4"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={caption || `Gallery image ${index + 1}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${DURATION.reveal}ms ${EASING.easeOutExpo} ${index * DURATION.stagger}ms, transform ${DURATION.reveal}ms ${EASING.easeOutExpo} ${index * DURATION.stagger}ms`,
      }}
    >
      {/* Skeleton shimmer while loading */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 rounded-none"
          style={{
            background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-none">
          <Camera className="w-10 h-10 text-gray-300" />
        </div>
      )}

      {/* Image */}
      {!hasError && (
        <img
          src={imageUrl}
          alt={caption || `Gallery photo ${index + 1}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className="w-full h-auto block rounded-none"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: 'scale(1)',
            transition: `opacity 400ms ease, transform ${DURATION.hoverScale}ms ${EASING.easeOutQuart}`,
          }}
        />
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 rounded-none flex items-end"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)',
          opacity: 0,
          transition: `opacity ${DURATION.hover}ms ${EASING.easeOutCubic}`,
        }}
      />

      {/* Zoom icon on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Camera className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Caption on hover */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <p className="text-white text-sm font-medium truncate drop-shadow-lg">
            {caption}
          </p>
        </div>
      )}

      {/* Inject shimmer keyframe */}
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>

      {/* Hover scale on image */}
      <style>{`
        .gallery-card:hover img {
          transform: scale(1.05) !important;
        }
        .gallery-card:hover > div:nth-child(3) {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
