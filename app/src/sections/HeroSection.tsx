import { useEffect, useRef, useState } from 'react';
import { useData } from '@/context/DataContext';

// Detecta mobile antes do primeiro render para evitar double-loading
const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export function HeroSection() {
  const { siteConfig } = useData();
  const hero = siteConfig.hero;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Puxando o vídeo novo diretamente
  const desktopVideo = '/steampunk.mp4';
  const mobileVideo = '/steampunk.mp4';
  const videoSrc = isMobile ? mobileVideo : desktopVideo;

  // ── DESKTOP: scroll-controlled video (lerp) ──
  useEffect(() => {
    if (isMobile) return; // No mobile, o vídeo dá autoplay normal

    let animationFrameId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.pause();
    }

    const handleScroll = () => {
      if (!containerRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const scrollDistance = -top;
      const maxScroll = height - windowHeight;

      let progress = scrollDistance / maxScroll;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      targetProgress = progress;
    };

    const smoothScroll = () => {
      const video = videoRef.current;
      
      if (video && !isNaN(video.duration) && video.duration > 0) {
        currentProgress += (targetProgress - currentProgress) * 0.08;

        if (Math.abs(targetProgress - currentProgress) > 0.0001) {
          const maxTime = video.duration - 0.05;
          let newTime = currentProgress * video.duration;
          if (newTime > maxTime) newTime = maxTime;
          if (newTime < 0) newTime = 0;
          
          video.currentTime = newTime;
        }
      }
      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(smoothScroll);

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
  }, [isMobile, videoSrc]);

  if (hero && hero.active === false) return null;

  // ═══════════════════════════════════════════════════════
  // MOBILE: vídeo normal, autoplay, sem scroll-control
  // Suporta qualquer aspect ratio (1920x1080 ou 1080x1920)
  // O vídeo se ajusta automaticamente à largura da tela
  // ═══════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <section id="home" className="relative w-full bg-[#050505] overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-auto block"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        />
      </section>
    );
  }

  // ═══════════════════════════════════════════════════════
  // DESKTOP: vídeo controlado pelo scroll (sticky + lerp)
  // ═══════════════════════════════════════════════════════
  return (
    <section ref={containerRef} id="home" className="relative w-full max-w-[100vw] h-[230vh] bg-[#050505] overflow-x-hidden">
      {/* Wrapper travado que gruda na tela */}
      <div className="sticky top-0 w-full max-w-[100vw] h-[100dvh] overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-cover object-center"
            muted
            playsInline
            preload="auto"
          />
        </div>
      </div>
    </section>
  );
}
