import { useState, useMemo, useEffect } from 'react';
import { Camera, Download, X, Link2, Youtube, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';
import type { GalleryAlbum, GalleryImage, GalleryVideoYoutube } from '@/types';
import { GalleryCard } from '@/components/gallery/GalleryCard';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import { MasonryGrid } from '@/components/gallery/MasonryGrid';
import { useStaggeredReveal } from '@/hooks/useIntersectionObserver';
import { EASING, DURATION } from '@/lib/animations';

export function GallerySection() {
  const { t } = useLanguage();
  const { galleryAlbums } = useData();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showDownloadSearch, setShowDownloadSearch] = useState(false);
  const { galleryVideos } = useData();
  const [isVideosActive, setIsVideosActive] = useState(false);
  const [activeVideo, setActiveVideo] = useState<GalleryVideoYoutube | null>(null);
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);

  const filteredAlbums = useMemo(() => {
    return galleryAlbums
      .filter(a => a.status === 'active')
      .sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [galleryAlbums]);

  // Pool de fotos (Apenas de álbuns internos)
  const allImages = useMemo(() => {
    return filteredAlbums
      .filter(album => album.type === 'internal' && album.images?.length > 0)
      .flatMap(album =>
        album.images.map(img => ({
          ...img,
          albumTitle: t(album.title),
          albumCategory: album.category || 'all',
        }))
      );
  }, [filteredAlbums, t]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allImages.map(img => img.albumCategory));
    return ['all', ...Array.from(cats).filter(c => c !== 'all')];
  }, [allImages]);

  // Featured and list videos
  const videosData = useMemo(() => {
    const published = galleryVideos.filter(v => v.status === 'published');
    const featured = published.find(v => v.isFeatured) || published[0];
    const rest = published.filter(v => v.id !== featured?.id);
    return { featured, rest };
  }, [galleryVideos]);

  const [randomizedImages, setRandomizedImages] = useState<typeof allImages>([]);

  // Update randomized sample (Memoized to avoid cascading)
  const sourceImages = useMemo(() => {
    if (selectedFilter === 'all') return allImages;
    return allImages.filter(img => img.albumCategory === selectedFilter);
  }, [allImages, selectedFilter]);

  useEffect(() => {
    // Shuffle and slice for Home preview (top 12 randomized)
    const shuffled = [...sourceImages].sort(() => Math.random() - 0.5);
    setRandomizedImages(shuffled.slice(0, 12));
  }, [sourceImages]);

  useEffect(() => {
    document.body.style.overflow = activeVideo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo]);

  // Staggered reveal
  const { containerRef, isItemVisible } = useStaggeredReveal(randomizedImages.length, DURATION.stagger);

  // Lightbox images
  const lightboxImages = randomizedImages.map(img => ({
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
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-[#111] leading-[0.95] tracking-tight">
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

            {/* Vídeos Tab */}
            <button
              onClick={() => { setIsVideosActive(v => { if (v) setIsHeroPlaying(false); return !v; }); setSelectedFilter('all'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-none text-sm font-semibold transition-all duration-200 ${
                isVideosActive
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              <Youtube className="w-4 h-4" />
              {t({ pt: 'Você Não Quer Mais', en: 'You Don\'t Want More', es: 'No Quieres Más' })}
            </button>

            {/* Download search toggle */}
            {!isVideosActive && (
              <button
                onClick={() => setShowDownloadSearch(!showDownloadSearch)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-none text-sm font-semibold transition-all duration-200 ${
                  showDownloadSearch
                    ? 'bg-qm-magenta text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                {t({ pt: 'Pegue sua foto', en: 'Get your photo', es: 'Obtén tu foto' })}
              </button>
            )}
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
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-qm-magenta focus:ring-1 focus:ring-qm-magenta transition-colors"
                />
                <button className="px-5 py-2.5 bg-[#111] text-white font-semibold text-sm rounded-none hover:bg-[#222] transition-colors">
                  {t({ pt: 'Buscar', en: 'Search', es: 'Buscar' })}
                </button>
              </div>
            </div>
          )}

          {/* Content Area: Photos or Videos */}
          {!isVideosActive ? (
            <div ref={containerRef}>
              <MasonryGrid>
                {randomizedImages.map((image, index) => (
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
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Hero Video */}
              {videosData.featured && (
                <div className="max-w-4xl mx-auto">
                  <div className="aspect-video bg-black relative shadow-2xl border border-white/10">
                    {isHeroPlaying ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videosData.featured.youtubeId}?rel=0&modestbranding=1&autoplay=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${t({ pt: 'Vídeo After Movie', en: 'After Movie Video', es: 'Video After Movie' })} - ${t(videosData.featured.title)}`}
                      />
                    ) : (
                      <button
                        type="button"
                        className="w-full h-full relative group"
                        onClick={() => setIsHeroPlaying(true)}
                        aria-label="Reproduzir vídeo"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${videosData.featured.youtubeId}/hqdefault.jpg`}
                          alt={t(videosData.featured.title)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 fill-white text-white ml-1" />
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-[#111] font-black text-xl uppercase tracking-tight">{t(videosData.featured.title)}</h3>
                    {videosData.featured.eventDate && (
                      <p className="text-gray-400 text-xs font-bold uppercase mt-1">{new Date(videosData.featured.eventDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Grid of Other Videos */}
              {videosData.rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videosData.rest.map(video => (
                    <div 
                      key={video.id} 
                      className="group cursor-pointer"
                      onClick={() => setActiveVideo(video)}
                    >
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        <img 
                          src={video.thumbnailUrl} 
                          alt={t(video.title)} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-red-600 fill-red-600 ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="text-[#111] font-bold text-sm uppercase tracking-tight group-hover:text-qm-magenta transition-colors">{t(video.title)}</h4>
                        <p className="text-gray-400 text-[10px] font-bold uppercase mt-1">VER AFTER MOVIE</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Albums row (if real albums exist) */}
          {filteredAlbums.length > 0 && (
            <div className="mt-16">
              <h3 className="text-[#111] text-xl font-bold mb-6 tracking-tight">
                {t({ pt: 'Álbuns', en: 'Albums', es: 'Álbumes' })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredAlbums.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => {
                        if (album.type === 'external' && album.externalLink) {
                          window.open(album.externalLink, '_blank');
                        } else {
                          window.location.href = '/vocenaqm'; // O DataContext lida com a navegação se selecionado, mas aqui redirecionamos para a página
                        }
                      }}
                      className="group bg-white border border-gray-100 rounded-none overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
                    >
                      {album.type === 'external' && (
                        <div className="absolute top-3 right-3 z-20 bg-blue-600 text-white p-1.5 shadow-lg">
                          <Link2 className="w-4 h-4" />
                        </div>
                      )}
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
                        <h4 className="text-[#111] font-bold text-sm uppercase tracking-tight">{t(album.title)}</h4>
                        <p className="text-gray-400 text-[10px] font-bold uppercase mt-1">
                          {album.type === 'external' ? (
                            <span className="text-blue-600">Álbum Externo</span>
                          ) : (
                            <>
                              {album.images.length} {t({ pt: 'fotos', en: 'photos', es: 'fotos' })}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Link para página completa */}
      {allImages.length > 0 && (
        <div className="flex justify-center mt-12 px-4">
          <Link
            to="/vocenaqm"
            className="flex items-center gap-3 px-8 py-4 bg-[#111] hover:bg-qm-magenta transition-colors text-white font-bold rounded-none shadow-lg hover:shadow-xl hover:shadow-qm-magenta/20 uppercase text-sm tracking-wider"
          >
            <Camera className="w-5 h-5" />
            {t({ pt: 'Ver Todos os Álbuns', en: 'See All Albums', es: 'Ver Todos los Álbumes' })}
          </Link>
        </div>
      )}

      {/* Lightbox */}
      <GalleryLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Video Modal Interface */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-md" 
            onClick={() => setActiveVideo(null)} 
          />
          <div className="relative w-full max-w-6xl aspect-video bg-black shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 md:-right-12 md:top-0 p-2 text-white hover:text-qm-magenta transition-colors"
              title={t({ pt: 'Fechar vídeo', en: 'Close video', es: 'Cerrar video' })}
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={t(activeVideo.title)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
