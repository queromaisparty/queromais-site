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

  // Puxando o vídeo novo diretamente (ignorando o que foi salvo no painel Admin anteriormente para poder visualizar)
  const desktopVideo = '/steampunk.mp4';
  const mobileVideo = '/steampunk.mp4';
  const fallback = ''; // Removendo o poster temporariamente para não mostrar a logo branca
  const videoSrc = isMobile ? mobileVideo : desktopVideo;

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

      const scrollDistance = -top;
      const maxScroll = height - windowHeight;

      let progress = scrollDistance / maxScroll;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      targetProgress = progress;
    };

    const smoothScroll = () => {
      const video = videoRef.current;
      
      // Removemos a checagem de readyState >= 2 porque no celular o navegador 
      // bloqueia o download até que se tente reproduzir ou avançar o vídeo (deadlock)
      if (video && !isNaN(video.duration) && video.duration > 0) {
        // Interpolação Linear (Lerp) para suavizar a transição
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
    
    // Inicia o loop de animação contínuo
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

  return (
    <section ref={containerRef} id="home" className="relative w-full h-[230vh] bg-[#050505]">
      {/* Wrapper travado que gruda na tela */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            poster={fallback}
            className="w-full h-full object-contain md:object-cover object-center"
            muted
            playsInline
            preload="auto"
          />
        </div>
      </div>
    </section>
  );
}
