import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';
import { EASING, DURATION } from '@/lib/animations';

interface LightboxImage {
  url: string;
  caption?: string;
  downloadAllowed?: boolean;
}

interface GalleryLightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryLightbox({ images, initialIndex, isOpen, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const goNext = useCallback(() => {
    if (isAnimating || images.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(prev => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), DURATION.lightbox);
  }, [images.length, isAnimating]);

  const goPrev = useCallback(() => {
    if (isAnimating || images.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), DURATION.lightbox);
  }, [images.length, isAnimating]);

  // Touch/swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipe = 50;
    if (Math.abs(distance) >= minSwipe) {
      if (distance > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleDownload = () => {
    const img = images[currentIndex];
    if (!img?.url) return;
    const a = document.createElement('a');
    a.href = img.url;
    a.download = `quero-mais-${currentIndex + 1}.jpg`;
    a.target = '_blank';
    a.click();
  };

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      style={{
        backgroundColor: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(8px)',
        animation: `fadeIn ${DURATION.lightbox}ms ${EASING.easeOutCubic}`,
      }}
    >
      {/* Inject keyframe */}
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 text-white/60 text-sm font-medium tracking-wide">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Download button */}
      {current?.downloadAllowed && (
        <button
          onClick={handleDownload}
          className="absolute top-4 left-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200"
          aria-label="Download"
        >
          <Download className="w-5 h-5" />
        </button>
      )}

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={goPrev}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={goNext}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image container */}
      <div
        className="w-full h-full flex items-center justify-center px-4 py-16 md:px-20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {current?.url && (
          <img
            key={currentIndex}
            src={current.url}
            alt={current.caption || `Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            style={{
              animation: `scaleIn ${DURATION.lightbox}ms ${EASING.easeOutExpo}`,
            }}
            draggable={false}
          />
        )}
        <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}`}</style>
      </div>

      {/* Caption */}
      {current?.caption && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white/80 text-sm font-medium px-4 py-2 bg-black/40 rounded-full max-w-md text-center truncate">
          {current.caption}
        </div>
      )}
    </div>
  );
}
