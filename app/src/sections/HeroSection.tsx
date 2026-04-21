import { useEffect, useRef } from 'react';

export function HeroSection() {
  const videoDesktopRef = useRef<HTMLVideoElement>(null);
  const videoMobileRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    // Força o vídeo a carregar seus dados para termos a duração correta
    if (videoDesktopRef.current) {
      videoDesktopRef.current.load();
      videoDesktopRef.current.pause();
    }
    if (videoMobileRef.current) {
      videoMobileRef.current.load();
      videoMobileRef.current.pause();
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // top = distância do topo do container até o topo da tela
      // Quando top = 0, o scroll "começa".
      const scrollDistance = -top;
      const maxScroll = height - windowHeight;
      
      let progress = scrollDistance / maxScroll;
      
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      
      animationFrameId = requestAnimationFrame(() => {
        // Desktop
        if (videoDesktopRef.current && !isNaN(videoDesktopRef.current.duration) && videoDesktopRef.current.duration > 0) {
          videoDesktopRef.current.currentTime = progress * videoDesktopRef.current.duration;
        }
        // Mobile
        if (videoMobileRef.current && !isNaN(videoMobileRef.current.duration) && videoMobileRef.current.duration > 0) {
          videoMobileRef.current.currentTime = progress * videoMobileRef.current.duration;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Hook adicional para caso a duração só carregue um tempo depois:
    const handleLoadedMetadata = () => handleScroll();
    
    const desktopVideo = videoDesktopRef.current;
    const mobileVideo = videoMobileRef.current;
    
    if (desktopVideo) desktopVideo.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (mobileVideo) mobileVideo.addEventListener('loadedmetadata', handleLoadedMetadata);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (desktopVideo) desktopVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (mobileVideo) mobileVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={containerRef} id="home" className="relative w-full h-[200vh] bg-[#050505]">
      {/* Wrapper travado que gruda na tela */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background com vídeo scrolável (VÍDEO DESKTOP) */}
        <div className="hidden md:block absolute inset-0">
          <video
            ref={videoDesktopRef}
            src="/hero-scroll.mp4"
            className="w-full h-full object-cover object-center"
            muted
            playsInline
            preload="auto"
          />
        </div>
        
        {/* Background com vídeo scrolável (VÍDEO MOBILE) */}
        <div className="md:hidden absolute inset-0 bg-[#050505] flex items-center justify-center">
          <video
            ref={videoMobileRef}
            src="/videoversaomobile.mp4"
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
