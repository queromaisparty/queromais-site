import { useEffect, useRef, useState } from 'react';

// Detecta mobile antes do primeiro render para evitar double-loading
const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop: scroll-controlled video
  useEffect(() => {
    if (isMobile) return; // Mobile usa autoplay, não scroll

    let animationFrameId: number;

    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.pause();
    }

    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const scrollDistance = -top;
      const maxScroll = height - windowHeight;

      let progress = scrollDistance / maxScroll;

      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      if (!isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
        animationFrameId = requestAnimationFrame(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = progress * videoRef.current.duration;
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleLoadedMetadata = () => handleScroll();
    const currentVideo = videoRef.current;

    if (currentVideo) {
      currentVideo.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (currentVideo) {
        currentVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  // Mobile: autoplay com loop
  useEffect(() => {
    if (!isMobile) return;
    const video = videoRef.current;
    if (!video) return;

    video.load();
    // Mobile browsers exigem que o play seja chamado
    const playVideo = () => {
      video.play().catch(() => {
        // Fallback: se autoplay bloqueado, fica parado no primeiro frame
        video.currentTime = 0;
      });
    };

    video.addEventListener('loadeddata', playVideo);
    playVideo();

    return () => {
      video.removeEventListener('loadeddata', playVideo);
    };
  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      id="home"
      className={`relative w-full bg-[#050505] ${isMobile ? 'h-screen' : 'h-[200vh]'}`}
    >
      {/* Wrapper travado que gruda na tela */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            src={isMobile ? "/videoversaomobile.mp4" : "/hero-scroll.mp4"}
            className="w-full h-full object-cover object-center max-md:scale-[1.25]"
            muted
            playsInline
            preload="auto"
            {...(isMobile ? { autoPlay: true, loop: true } : {})}
          />
        </div>
      </div>
    </section>
  );
}
