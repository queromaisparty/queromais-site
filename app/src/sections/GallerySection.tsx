import { useState } from 'react';
import { Camera, Video, Download, Grid, X, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

export function GallerySection() {
  const { t } = useLanguage();
  const { galleryAlbums } = useData();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'download'>('photos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Flatten all images from albums
  const allImages = galleryAlbums.flatMap(album => 
    album.images.map(img => ({ ...img, albumTitle: album.title }))
  );

  // Flatten all videos from albums
  const allVideos = galleryAlbums.flatMap(album => album.videos);

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-20 lg:py-32 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#CCFF00]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-full mb-6">
              <Camera className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-[#CCFF00] text-sm font-bold uppercase tracking-wider">
                {t({ pt: 'Memórias', en: 'Memories', es: 'Recuerdos' })}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
              {t(translations.gallery.title)}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t(translations.gallery.description)}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { key: 'photos', label: translations.gallery.photos, icon: ImageIcon },
              { key: 'videos', label: translations.gallery.videos, icon: Video },
              { key: 'download', label: translations.gallery.downloadPhoto, icon: Download },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#CCFF00] text-black'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {t(tab.label)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <div>
                {galleryAlbums.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allImages.slice(0, 12).map((image) => (
                      <div
                        key={image.id}
                        className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                        onClick={() => openLightbox(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={t(image.caption || { pt: 'Foto', en: 'Photo', es: 'Foto' })}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                        {image.downloadAllowed && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fotos de exemplo
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#CCFF00]/50 transition-all cursor-pointer"
                        onClick={() => openLightbox('')}
                      >
                        <Camera className="w-12 h-12 text-white/20 group-hover:text-[#CCFF00] transition-colors" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Albums */}
                {galleryAlbums.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-white text-xl font-bold mb-6">
                      {t({ pt: 'Álbuns', en: 'Albums', es: 'Álbumes' })}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {galleryAlbums.map((album) => (
                        <div
                          key={album.id}
                          className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all cursor-pointer"
                        >
                          <div className="aspect-video overflow-hidden">
                            {album.coverImage ? (
                              <img
                                src={album.coverImage}
                                alt={t(album.title)}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                                <Grid className="w-12 h-12 text-white/30" />
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h4 className="text-white font-bold mb-1">{t(album.title)}</h4>
                            <p className="text-white/50 text-sm">
                              {album.images.length} {t({ pt: 'fotos', en: 'photos', es: 'fotos' })}
                              {album.videos.length > 0 && ` • ${album.videos.length} ${t({ pt: 'vídeos', en: 'videos', es: 'videos' })}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allVideos.length > 0 ? (
                  allVideos.map((video) => (
                    <div
                      key={video.id}
                      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={t(video.caption || { pt: 'Vídeo', en: 'Video', es: 'Video' })}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                            <Video className="w-12 h-12 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center">
                            <Video className="w-8 h-8 text-black" />
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-white font-bold mb-1">
                          {t(video.caption || { pt: 'Vídeo', en: 'Video', es: 'Video' })}
                        </h4>
                        <span className="inline-block px-2 py-1 bg-white/10 rounded text-white/50 text-xs uppercase">
                          {video.type}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  // Vídeos de exemplo
                  <>
                    {[
                      { title: 'Aftermovie 2024', type: 'video' },
                      { title: 'Reels #1', type: 'reel' },
                      { title: 'Reels #2', type: 'reel' },
                    ].map((video, index) => (
                      <div
                        key={index}
                        className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                      >
                        <div className="relative aspect-video bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                          <Video className="w-12 h-12 text-white/30" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center">
                              <Video className="w-8 h-8 text-black" />
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <h4 className="text-white font-bold mb-1">{video.title}</h4>
                          <span className="inline-block px-2 py-1 bg-white/10 rounded text-white/50 text-xs uppercase">
                            {video.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Download Tab */}
            {activeTab === 'download' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-[#CCFF00]/10 rounded-full flex items-center justify-center">
                    <Download className="w-10 h-10 text-[#CCFF00]" />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-4">
                    {t(translations.gallery.downloadPhoto)}
                  </h3>
                  <p className="text-white/60 mb-8">
                    {t({
                      pt: 'Encontre suas fotos dos eventos da Quero Mais. Digite seu nome ou código do evento para buscar.',
                      en: 'Find your photos from Quero Mais events. Enter your name or event code to search.',
                      es: 'Encuentra tus fotos de los eventos de Quero Más. Ingresa tu nombre o código del evento para buscar.'
                    })}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                      type="text"
                      placeholder={t({ 
                        pt: 'Nome ou código do evento', 
                        en: 'Name or event code', 
                        es: 'Nombre o código del evento' 
                      })}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00]"
                    />
                    <button className="px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#b3e600] transition-colors">
                      {t({ pt: 'Buscar', en: 'Search', es: 'Buscar' })}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl bg-black/95 border-white/10 p-0">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="relative">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Gallery"
                className="w-full max-h-[80vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
