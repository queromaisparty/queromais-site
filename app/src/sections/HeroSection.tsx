import { useEffect, useRef, useState } from 'react';
import { useData } from '@/context/DataContext';

const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE SCROLL VIDEO
// Vídeo fixo na tela enquanto rola — hero travada até o vídeo terminar.
// Controlado 100% via scroll (currentTime = scroll progress × duration).
// Desktop: ZERO alterações — comportamento original preservado.
// ─────────────────────────────────────────────────────────────────────────────

const MOBILE_SCROLL_VIDEO_SRC = '/videomobile002.mp4';

export function HeroSection() {
  const { siteConfig } = useData();
  const hero = siteConfig.hero;

  // ── Refs ────────────────────────────────────────────────────────────────────
  const videoRef        = useRef<HTMLVideoElement>(null);   // desktop (original)
  const mobileVideoRef  = useRef<HTMLVideoElement>(null);   // mobile scroll video
  const containerRef    = useRef<HTMLDivElement>(null);     // desktop container (original)
  const mobileWrapRef   = useRef<HTMLDivElement>(null);     // mobile outer wrapper (scroll space)

  const [isMobile, setIsMobile] = useState(getIsMobile);

  // Vídeo vem do Admin — upload tem prioridade sobre URL
  const desktopSrc = hero?.desktop?.upload || hero?.desktop?.url || '/steampunk.mp4';
  const mobileSrc  = hero?.mobile?.upload  || hero?.mobile?.url  || desktopSrc;

  // ── Detector de mobile ───────────────────────────────────────────────────────
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

  // ── MOBILE: sem scroll-control, apenas autoplay em loop ──────────────────────
  // Lógica foi removida conforme pedido do usuário (apenas autoplay em HTML5)

  if (hero && hero.active === false) return null;

  // ════════════════════════════════════════════════════════════════════════════
  // MOBILE RENDER
  // Wrapper alto (ex: 350vh) cria o "espaço" de scroll.
  // O vídeo fica sticky, fixo no topo enquanto o wrapper passa pelo viewport.
  // Depois que o usuário termina de scrollar o wrapper, a página continua normal.
  // ════════════════════════════════════════════════════════════════════════════
  if (isMobile) {
    // Vídeo 960×960 (quadrado 1:1, confirmado por ffprobe).
    // Estratégia:
    // NOVO COMPORTAMENTO MOBILE (Para evitar telas pretas e buracos brancos):
    // 1. O vídeo quadrado entra no fluxo NORMAL da página (sem sticky, sem wrappers malucos).
    // 2. Não tem buraco, não tem tarja. A próxima seção entra logo abaixo do vídeo.
    // 3. (Ajuste) Vídeo apenas em loop, sem controle de scroll (pedido do usuário).
    return (
      <div
        ref={mobileWrapRef}
        id="home"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1', // Altura acompanha a largura perfeitamente, sem zoom, sem tarja.
          overflow: 'hidden',
          // Header passa por cima, então não precisa de margem.
        }}
      >
        <video
          ref={mobileVideoRef}
          src={MOBILE_SCROLL_VIDEO_SRC}
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DESKTOP RENDER — 100% original, sem nenhuma alteração
  // ════════════════════════════════════════════════════════════════════════════
  return (
    // Mobile: min-h-[100svh] garante que o hero preencha SEMPRE 100% do viewport
    // Desktop: h-[250vh] cria espaço de scroll para o vídeo controlado
    <section
      ref={containerRef}
      id="home"
      className="relative w-full pt-[calc(3.5rem+env(safe-area-inset-top))] md:block md:pt-0 md:h-[250vh] bg-[#050505]"
    >
      <div className="relative w-full md:sticky md:top-0 md:h-[100dvh] overflow-hidden bg-[#050505]">
        <div className="md:absolute md:inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full md:h-full md:object-cover md:object-center"
            muted
            playsInline
            autoPlay={false}
            loop={false}
            preload="auto"
          />
        </div>
      </div>
    </section>
  );
}
