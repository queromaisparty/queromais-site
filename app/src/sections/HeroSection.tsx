import { useEffect, useRef, useState } from 'react';
import { useData } from '@/context/DataContext';

const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export function HeroSection() {
  const { siteConfig } = useData();
  const hero = siteConfig.hero;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(getIsMobile);

  // Progresso acumulado do vídeo no mobile (ref para não re-renderizar)
  const progressRef = useRef(0);

  // Vídeo vem do Admin — upload tem prioridade sobre URL
  const desktopSrc = hero?.desktop?.upload || hero?.desktop?.url || '/steampunk.mp4';
  const mobileSrc  = hero?.mobile?.upload  || hero?.mobile?.url  || desktopSrc;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const videoSrc = isMobile ? mobileSrc : desktopSrc;

  // ── DESKTOP: scroll-controlled video (comportamento original, inalterado) ──
  useEffect(() => {
    if (isMobile) return;

    let animationFrameId: number;
    let targetProgress = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollDistance = -top;
      const maxScroll = height - windowHeight;
      let progress = maxScroll > 0 ? scrollDistance / maxScroll : 0;
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
    if (currentVideo) currentVideo.addEventListener('loadedmetadata', handleLoadedMetadata);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (currentVideo) currentVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile, videoSrc]);

  // Removemos a lógica de toque controlada para celular, 
  // pois restrições do iOS/Android causam tela preta sem interação clara do usuário.
  // No mobile, o vídeo tocará em background via autoPlay + loop nativo do HTML5.
  
  if (hero && hero.active === false) return null;

  return (
    // Mobile: aspect-[4/3] — visual normal sem espaço extra e scroll livre
    // Desktop: h-[250vh] — espaço de scroll para o vídeo controlado
    <section
      ref={containerRef}
      id="home"
      className="relative w-full pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-0 aspect-[4/3] md:aspect-auto md:h-[250vh] bg-[#050505]"
    >
      {/* Desktop: sticky para o vídeo ficar fixo durante os 250vh de scroll */}
      {/* Mobile: wrapper normal, ocupando o container com scroll livre */}
      <div className="relative w-full h-full md:sticky md:top-0 md:h-[100dvh] overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-cover object-[center_top] md:object-center"
            muted
            playsInline
            autoPlay={isMobile}
            loop={isMobile}
            preload="auto"
          />
        </div>
      </div>
    </section>
  );
}
