import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Camera, ImageIcon, ChevronLeft, Calendar, Download, Share2, Link2, Youtube, Play, X } from 'lucide-react';
import type { GalleryAlbum } from '@/types';

export function VoceNaQMPage() {
  const { galleryAlbums, galleryVideos } = useData();
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; youtubeId: string; title: { pt?: string; en?: string; es?: string } | string } | null>(null);

  const publishedVideos = useMemo(() => {
    return galleryVideos.filter(v => v.status === 'published').sort((a, b) => (b.displayOrder || 0) - (a.displayOrder || 0));
  }, [galleryVideos]);

  // Filtrar álbuns ativos e ordenar por ordem -> data (Sincronizado com a Home)
  const filteredAlbums = useMemo(() => {
    return galleryAlbums
      .filter(a => a.status === 'active')
      .sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [galleryAlbums]);


  return (
    <main className="pt-32 pb-24 min-h-screen bg-[#F2F2F2]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {!selectedAlbum && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
            <div className="mb-12 border-b border-gray-300 pb-8">
               <p className="text-qm-magenta text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Camera className="w-5 h-5" /> Momentos Eternizados
               </p>
               <h1 className="font-black text-2xl sm:text-4xl lg:text-6xl text-black uppercase tracking-tighter leading-none mb-4">
                 VOCÊ NA <span className="text-qm-magenta">QUERO MAIS</span>
               </h1>
                <p className="text-gray-600 text-lg sm:text-xl max-w-2xl">
                  Encontre suas fotos, relembre edições passadas e veja tudo o que rolou pelos olhos dos nossos fotógrafos oficiais.
                </p>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setActiveTab('photos')}
                    className={`flex items-center gap-2 px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all ${
                      activeTab === 'photos' ? 'bg-[#111] text-white' : 'bg-white text-gray-400 border border-gray-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Fotos
                  </button>
                  <button 
                    onClick={() => setActiveTab('videos')}
                    className={`flex items-center gap-2 px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all ${
                      activeTab === 'videos' ? 'bg-red-600 text-white' : 'bg-white text-gray-400 border border-gray-200'
                    }`}
                  >
                    <Youtube className="w-4 h-4" /> After Movies
                  </button>
                </div>
            </div>

            {activeTab === 'photos' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredAlbums.length === 0 ? (
                  <div className="col-span-full py-24 flex flex-col items-center justify-center opacity-50">
                      <ImageIcon className="w-16 h-16 text-gray-400 mb-6" />
                      <h3 className="text-2xl font-bold text-black mb-2">Sem Álbuns</h3>
                      <p className="text-gray-500 text-center">Ainda não há fotos publicadas no sistema.</p>
                  </div>
                ) : (
                  filteredAlbums.map(album => (
                    <div 
                      key={album.id}
                      onClick={() => {
                          if (album.type === 'external' && album.externalLink) {
                            window.open(album.externalLink, '_blank');
                          } else {
                            setSelectedAlbum(album);
                          }
                      }}
                      className="group cursor-pointer bg-white border border-gray-200 rounded-none overflow-hidden hover:border-qm-magenta/50 transition-colors shadow-sm hover:shadow-xl flex flex-col relative"
                    >
                      {album.type === 'external' && (
                        <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white px-3 py-1 flex items-center gap-2 shadow-lg">
                          <Link2 className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase">Externo</span>
                        </div>
                      )}
                      <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                          
                          {album.type === 'internal' && (
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-none flex items-center gap-2 shadow-lg">
                               <ImageIcon className="w-3.5 h-3.5 text-qm-magenta" />
                               <span className="text-xs font-bold text-black">{album.images?.length || 0} fotos</span>
                            </div>
                          )}
                      </div>
                      <div className="p-6 sm:p-8 flex-1 flex flex-col">
                          <h3 className="text-xl sm:text-2xl font-bold text-black uppercase tracking-tighter mb-2 group-hover:text-qm-magenta transition-colors">{album.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold mb-4 mt-auto">
                             <Calendar className="w-4 h-4 text-qm-magenta" />
                             {new Date(album.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {publishedVideos.length === 0 ? (
                  <div className="col-span-full py-24 flex flex-col items-center justify-center opacity-50 text-center">
                    <Youtube className="w-16 h-16 text-gray-400 mb-6" />
                    <h3 className="text-2xl font-bold text-black mb-2">Sem Vídeos</h3>
                    <p className="text-gray-500">Nossa galeria de vídeos está sendo preparada.</p>
                  </div>
                ) : (
                  publishedVideos.map(video => (
                    <div 
                      key={video.id} 
                      className="group cursor-pointer bg-white p-2 border border-gray-100 hover:border-red-600 transition-colors"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="relative aspect-video overflow-hidden bg-black">
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title.pt} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-8 h-8 fill-white ml-1" />
                          </div>
                        </div>
                        {video.isFeatured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-[#111] px-2 py-1 text-[10px] font-black uppercase">
                            Destaque
                          </div>
                        )}
                      </div>
                      <div className="py-4 px-2">
                        <h3 className="text-lg font-black text-black uppercase tracking-tighter group-hover:text-red-700 transition-colors">{video.title.pt}</h3>
                        <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 flex items-center gap-2">
                          <Youtube className="w-3 h-3" /> Ver no YouTube
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {selectedAlbum && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 mt-4">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-semibold group bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-none w-fit shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Voltar aos Álbuns
              </button>
              
              <div className="text-right">
                <h1 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tighter">{selectedAlbum.title}</h1>
                <p className="text-gray-500 text-sm font-semibold mt-1">
                  {new Date(selectedAlbum.createdAt).toLocaleDateString('pt-BR')} â€¢ {selectedAlbum.images.length} Fotos Oficiais
                </p>
              </div>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
               {selectedAlbum.images.map((img, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => setSelectedPhoto(img.url)}
                   className="break-inside-avoid relative group rounded-none overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
                 >
                    <img src={img.url} alt={`Foto ${idx+1}`} className="w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="bg-white text-black font-bold uppercase text-xs px-4 py-2 rounded-none transform translate-y-4 group-hover:translate-y-0 transition-all">
                         Ampliar
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 w-12 h-12 flex items-center justify-center transition-all"
              >
                <X className="w-8 h-8" />
             </button>
             
             <img src={selectedPhoto} alt="Foto Ampliada" className="max-w-full max-h-full object-contain shadow-2xl" />
             
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-md px-6 py-3 border border-white/10">
               <button className="text-white hover:text-qm-magenta flex items-center gap-2 text-sm font-bold transition-colors">
                 <Download className="w-4 h-4" /> Baixar
               </button>
               <div className="w-px h-4 bg-white/20" />
               <button className="text-white hover:text-qm-magenta flex items-center gap-2 text-sm font-bold transition-colors">
                 <Share2 className="w-4 h-4" /> Compartilhar
               </button>
             </div>
          </div>
        )}

        {selectedVideo && (
           <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 text-white hover:text-red-500 w-12 h-12 flex items-center justify-center"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
           </div>
        )}

      </div>
    </main>
  );
}


