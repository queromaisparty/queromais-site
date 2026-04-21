import { useState, useMemo, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { GalleryCard } from '@/components/gallery/GalleryCard';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import { MasonryGrid } from '@/components/gallery/MasonryGrid';
import { useStaggeredReveal } from '@/hooks/useIntersectionObserver';
import { DURATION } from '@/lib/animations';
import { Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ───────────────────────────────────────────────────────────────────
   FOTOS DEMO — usadas quando o CMS está vazio
─────────────────────────────────────────────────────────────────── */
const DEMO_PHOTOS = [
  { id: 'd1', url: 'https://images.unsplash.com/photo-1429962599919-14d18dc9d04f?w=900&q=90', caption: 'DJ Set' },
  { id: 'd2', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=700&q=85', caption: 'Festival' },
  { id: 'd3', url: 'https://images.unsplash.com/photo-1571266028243-d220c13c7d0e?w=700&q=85', caption: 'Crowd' },
  { id: 'd4', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=90', caption: 'Showtime' },
  { id: 'd5', url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=700&q=85', caption: 'Vibes' },
  { id: 'd6', url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=700&q=85', caption: 'Nightlife' },
  { id: 'd7', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=85', caption: 'Music' },
  { id: 'd8', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=900&q=90', caption: 'Stage' },
];

export function VoceSection() {
  const { galleryAlbums } = useData();

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [displayPhotos, setDisplayPhotos] = useState<typeof DEMO_PHOTOS>([]);

  /* ── Extrai uma amostra randomizada de todos os álbuns ativos ── */
  useEffect(() => {
    const realAlbums = galleryAlbums.filter(a => a.status === 'active' || !a.status);
    
    let pool = realAlbums.flatMap(album => 
      album.images.map(img => ({
        ...img,
        caption: album.title // Usando o título limpo em vez de TranslatableContent
      }))
    );

    if (pool.length === 0) {
      pool = DEMO_PHOTOS;
    }

    // Fisher-Yates shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Seleciona as primeiras 8 fotos como preview aleatório
    setDisplayPhotos(shuffled.slice(0, 8));
  }, [galleryAlbums]);

  // Hook para revelar com animação
  const { containerRef, isItemVisible } = useStaggeredReveal(displayPhotos.length, DURATION.stagger);
  
  // Handlers para o lightbox
  const openLight = (i: number) => setLightboxIdx(i);
  const closeLight = () => setLightboxIdx(null);

  return (
    <section id="vocenaqm" className="bg-[#050505] relative overflow-hidden py-20 lg:py-32">

      {/* ── Cabeçalho da seção ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E91E8C] mb-3 font-sans">
            Memórias e experiências
          </p>
          <h2 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none mb-6">
            Você na Quero Mais?
          </h2>
          <p className="max-w-2xl text-gray-400 text-sm sm:text-base">
            A energia transcende. Reviva cada segundo das melhores noites do mundo com essas imagens.
          </p>
        </div>
      </div>

      {/* ── Grade mosaico Masonry Responsiva ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <MasonryGrid>
          {displayPhotos.map((photo, index) => (
             <GalleryCard
               key={photo.id || index}
               imageUrl={photo.url}
               caption={'caption' in photo && photo.caption ? photo.caption : undefined}
               index={index}
               isVisible={isItemVisible(index)}
               onClick={() => openLight(index)}
             />
          ))}
        </MasonryGrid>
      </div>

      {/* ── Botão Ver Mais Álbuns ── */}
      <div className="flex justify-center mt-12 px-4">
        <Link 
          to="/vocenaqm"
          className="flex items-center gap-3 px-8 py-4 bg-[#E91E8C] hover:bg-[#D81B80] transition-colors text-white font-bold rounded-none shadow-lg hover:shadow-xl hover:shadow-[#E91E8C]/20"
        >
          <ImageIcon className="w-5 h-5" />
          Encontre Sua Foto
        </Link>
      </div>

      {/* ── Lightbox Profissional ── */}
      {lightboxIdx !== null && (
        <GalleryLightbox
          images={displayPhotos as any}
          initialIndex={lightboxIdx}
          isOpen={true}
          onClose={closeLight}
        />
      )}
      
    </section>
  );
}
