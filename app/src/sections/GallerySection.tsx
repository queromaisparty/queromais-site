import { useState, useMemo } from 'react';
import { Camera, Download, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';
import { GalleryCard } from '@/components/gallery/GalleryCard';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import { MasonryGrid } from '@/components/gallery/MasonryGrid';
import { useStaggeredReveal } from '@/hooks/useIntersectionObserver';
import { EASING, DURATION } from '@/lib/animations';

// Demo images for when no albums exist
const DEMO_IMAGES = [
  { id: 'd1', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=800&fit=crop', caption: 'DJ Set', downloadAllowed: false, source: 'url' as const },
  { id: 'd2', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop', caption: 'Crowd Energy', downloadAllowed: false, source: 'url' as const },
  { id: 'd3', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=700&fit=crop', caption: 'Light Show', downloadAllowed: false, source: 'url' as const },
  { id: 'd4', url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=450&fit=crop', caption: 'Dance Floor', downloadAllowed: false, source: 'url' as const },
  { id: 'd5', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=900&fit=crop', caption: 'Festival Vibes', downloadAllowed: false, source: 'url' as const },
  { id: 'd6', url: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&h=500&fit=crop', caption: 'Stage Lights', downloadAllowed: false, source: 'url' as const },
  { id: 'd7', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=600&fit=crop', caption: 'Party Night', downloadAllowed: false, source: 'url' as const },
  { id: 'd8', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop', caption: 'Celebration', downloadAllowed: false, source: 'url' as const },
  { id: 'd9', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=750&fit=crop', caption: 'Music & Lights', downloadAllowed: false, source: 'url' as const },
];

export function GallerySection() {
  const { t } = useLanguage();
  const { galleryAlbums } = useData();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showDownloadSearch, setShowDownloadSearch] = useState(false);

  // Flatten all images from albums, or use demo
  const allImages = useMemo(() => {
    const real = galleryAlbums
      .filter(a => a.status === 'active' || !a.status) // backward compat
      .flatMap(album =>
        album.images.map(img => ({
          ...img,
          albumTitle: t(album.title),
          albumCategory: album.category || 'all',
        }))
      );
    return real.length > 0 ? real : DEMO_IMAGES.map(d => ({ ...d, albumTitle: 'Demo', albumCategory: 'all' }));
  }, [galleryAlbums, t]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allImages.map(img => img.albumCategory));
    return ['all', ...Array.from(cats).filter(c => c !== 'all')];
  }, [allImages]);

  // Filter images
  const filteredImages = useMemo(() => {
    if (selectedFilter === 'all') return allImages;
    return allImages.filter(img => img.albumCategory === selectedFilter);
  }, [allImages, selectedFilter]);

  // Staggered reveal
  const { containerRef, isItemVisible } = useStaggeredReveal(filteredImages.length, DURATION.stagger);

  // Lightbox images
  const lightboxImages = filteredImages.map(img => ({
    url: img.url,
    caption: 'caption' in img && img.caption ? t(img.caption as any) : img.albumTitle,
    downloadAllowed: img.downloadAllowed,
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111] leading-[0.95] tracking-tight">
              {t(translations.gallery.title)}
            </h2>
            <p className="text-gray-400 font-medium text-base mt-4 max-w-lg mx-auto">
              {t(translations.gallery.description)}
            </p>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.length > 1 && categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 py-2 rounded-none text-sm font-semibold transition-all duration-200 ${
                  selectedFilter === cat
                    ? 'bg-[#111] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                {cat === 'all' ? t({ pt: 'Todas', en: 'All', es: 'Todas' }) : cat}
              </button>
            ))}

            {/* Download search toggle */}
            <button
              onClick={() => setShowDownloadSearch(!showDownloadSearch)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-none text-sm font-semibold transition-all duration-200 ${
                showDownloadSearch
                  ? 'bg-[#22c55e] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              {t({ pt: 'Pegue sua foto', en: 'Get your photo', es: 'Obtén tu foto' })}
            </button>
          </div>

          {/* Download search panel */}
          {showDownloadSearch && (
            <div
              className="max-w-xl mx-auto mb-12 bg-gray-50 rounded-none p-6 border border-gray-100"
              style={{
                animation: `fadeInUp 400ms ${EASING.easeOutExpo}`,
              }}
            >
              <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#111] font-bold text-lg">
                  {t({ pt: 'Encontre suas fotos', en: 'Find your photos', es: 'Encuentra tus fotos' })}
                </h3>
                <button onClick={() => setShowDownloadSearch(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {t({
                  pt: 'Digite seu nome ou código do evento para buscar suas fotos.',
                  en: 'Enter your name or event code to find your photos.',
                  es: 'Ingresa tu nombre o código del evento para buscar tus fotos.'
                })}
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={t({ pt: 'Nome ou código...', en: 'Name or code...', es: 'Nombre o código...' })}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors"
                />
                <button className="px-5 py-2.5 bg-[#111] text-white font-semibold text-sm rounded-none hover:bg-[#222] transition-colors">
                  {t({ pt: 'Buscar', en: 'Search', es: 'Buscar' })}
                </button>
              </div>
            </div>
          )}

          {/* Masonry Gallery Grid */}
          <div ref={containerRef}>
            <MasonryGrid>
              {filteredImages.map((image, index) => (
                <GalleryCard
                  key={image.id}
                  imageUrl={image.url}
                  caption={'caption' in image && image.caption ? t(image.caption as any) : undefined}
                  index={index}
                  isVisible={isItemVisible(index)}
                  onClick={() => openLightbox(index)}
                />
              ))}
            </MasonryGrid>
          </div>

          {/* Albums row (if real albums exist) */}
          {galleryAlbums.length > 0 && (
            <div className="mt-16">
              <h3 className="text-[#111] text-xl font-bold mb-6 tracking-tight">
                {t({ pt: 'Álbuns', en: 'Albums', es: 'Álbumes' })}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {galleryAlbums
                  .filter(a => a.status === 'active' || !a.status)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((album) => (
                    <div
                      key={album.id}
                      className="group bg-white border border-gray-100 rounded-none overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        {album.coverImage ? (
                          <img
                            src={album.coverImage}
                            alt={t(album.title)}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Camera className="w-10 h-10 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="text-[#111] font-bold text-sm">{t(album.title)}</h4>
                        <p className="text-gray-400 text-xs mt-1">
                          {album.images.length} {t({ pt: 'fotos', en: 'photos', es: 'fotos' })}
                          {album.videos.length > 0 && ` · ${album.videos.length} ${t({ pt: 'vídeos', en: 'videos', es: 'videos' })}`}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
