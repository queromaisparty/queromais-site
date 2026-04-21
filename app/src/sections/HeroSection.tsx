import { useEffect, useRef } from 'react';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    // Força o vídeo a carregar seus dados para termos a duração correta
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.pause();
    }

    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // top = distância do topo do container até o topo da tela
      // Quando top = 0, o scroll "começa".
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
    
    // Hook adicional para caso a duração só carregue um tempo depois:
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
  }, []);

  return (
    <section ref={containerRef} id="home" className="relative w-full h-[200vh] bg-[#050505]">
      {/* Wrapper travado que gruda na tela */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background com vídeo scrolável */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src="/hero-scroll.mp4"
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
