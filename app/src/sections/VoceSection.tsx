import { useMemo } from 'react';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { GalleryCard } from '@/components/gallery/GalleryCard';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import { MasonryGrid } from '@/components/gallery/MasonryGrid';
import { useStaggeredReveal } from '@/hooks/useIntersectionObserver';
import { DURATION } from '@/lib/animations';
import { Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
}



export function VoceSection() {
  const { galleryAlbums } = useData();

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  /* ── Extrai uma amostra randomizada de todos os álbuns ativos ── */
  const displayPhotos = useMemo<PhotoItem[]>(() => {
    const realAlbums = galleryAlbums.filter(a => a.status === 'active' || !a.status);

    const pool: PhotoItem[] = realAlbums.flatMap(album =>
      album.images.map(img => ({
        id: img.id,
        url: img.url,
        caption: album.title,
      }))
    );


    // Fisher-Yates shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 8);
  }, [galleryAlbums]);

  // Hook para revelar com animação
  const { containerRef, isItemVisible } = useStaggeredReveal(displayPhotos.length, DURATION.stagger);

  // Handlers para o lightbox
  const openLight = (i: number) => setLightboxIdx(i);
  const closeLight = () => setLightboxIdx(null);

  // Lightbox photos no formato esperado (url + caption string)
  const lightboxImages = displayPhotos.map(p => ({
    id: p.id,
    url: p.url,
    caption: p.caption,
    downloadAllowed: false as const,
    source: 'url' as const,
  }));

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

      {/* ── Grade mosaico Masonry Responsiva ou Estado Vazio ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" ref={containerRef}>
        {displayPhotos.length === 0 ? (
           <div className="py-20 flex flex-col items-center justify-center opacity-50">
              <ImageIcon className="w-16 h-16 text-gray-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Sem Álbuns</h3>
              <p className="text-gray-500 text-center">Ainda não há fotos publicadas no sistema.</p>
           </div>
        ) : (
          <MasonryGrid>
            {displayPhotos.map((photo, index) => (
               <GalleryCard
                 key={photo.id || index}
                 imageUrl={photo.url}
                 caption={photo.caption}
                 index={index}
                 isVisible={isItemVisible(index)}
                 onClick={() => openLight(index)}
               />
            ))}
          </MasonryGrid>
        )}
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
          images={lightboxImages}
          initialIndex={lightboxIdx}
          isOpen={true}
          onClose={closeLight}
        />
      )}

    </section>
  );
}
