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

  // ── SCROLL-CONTROLLED VIDEO (Mobile e Desktop) ──
  useEffect(() => {

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

      let progress = 0;

      if (isMobile) {
        // Mobile: container está no topo absoluto da página.
        // O vídeo começa visível em top = 0 (progress = 0)
        // E termina exatamente quando sai da tela (top = -height)
        progress = -top / height;
      } else {
        // Desktop: container tem 250vh e o vídeo é sticky
        const scrollDistance = -top;
        const maxScroll = height - windowHeight;
        progress = maxScroll > 0 ? scrollDistance / maxScroll : 0;
      }

      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      targetProgress = progress;
    };

    const smoothScroll = () => {
      const video = videoRef.current;
      
      if (video && video.readyState >= 2 && !isNaN(video.duration) && video.duration > 0) {
        const maxTime = video.duration - 0.05;
        let newTime = targetProgress * video.duration;
        if (newTime > maxTime) newTime = maxTime;
        if (newTime < 0) newTime = 0;
        
        video.currentTime = newTime;
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

  // ════════════════════════════════════════════════════════════════════════════
  // RENDERIZAÇÃO DO VÍDEO
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <section ref={containerRef} id="home" className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-auto md:h-[250vh] bg-[#050505]">
      {/* Wrapper travado no desktop, mas fluxo normal no mobile */}
      <div className="w-full h-full md:sticky md:top-0 md:h-[100dvh] overflow-hidden bg-[#050505]">
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


