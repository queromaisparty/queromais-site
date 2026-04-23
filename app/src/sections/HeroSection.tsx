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

  // ── MOBILE: toque controla o vídeo; scroll travado até completar ──
  useEffect(() => {
    if (!isMobile) return;

    progressRef.current = 0;

    // Sensibilidade: quantos px de swipe para completar o vídeo (ajustável)
    const SENSITIVITY = 220;

    let startY = 0;
    let gestureBaseProgress = 0;

    const setVideoProgress = (p: number) => {
      const clamped = Math.min(1, Math.max(0, p));
      progressRef.current = clamped;
      const video = videoRef.current;
      if (video && video.readyState >= 2 && !isNaN(video.duration) && video.duration > 0) {
        video.currentTime = clamped * (video.duration - 0.05);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      gestureBaseProgress = progressRef.current;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!containerRef.current) return;

      // Só trava se o hero ainda estiver visível (topo dentro da viewport)
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top > 20 || rect.bottom <= 0) return;

      // Vídeo já completo: deixa scroll livre
      if (progressRef.current >= 1) return;

      const deltaY = startY - e.touches[0].clientY;

      // Swipe para cima (sair do hero): bloqueia e avança vídeo
      if (deltaY > 0) {
        e.preventDefault();
        setVideoProgress(gestureBaseProgress + deltaY / SENSITIVITY);
      }
      // Swipe para baixo (voltar): permite retroceder o vídeo normalmente
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [isMobile, videoSrc]);

  if (hero && hero.active === false) return null;

  return (
    // Mobile: aspect-[4/3] — visual normal sem espaço extra
    // Desktop: h-[250vh] — espaço de scroll para o vídeo controlado pelo scroll
    <section
      ref={containerRef}
      id="home"
      className="relative w-full pt-14 md:pt-0 aspect-[4/3] md:aspect-auto md:h-[250vh] bg-[#050505]"
    >
      {/* Desktop: sticky para o vídeo ficar fixo durante os 250vh de scroll */}
      {/* Mobile: wrapper normal, sem sticky — o touch lock cuida do comportamento */}
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
