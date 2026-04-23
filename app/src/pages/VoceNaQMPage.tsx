import { useState, useMemo, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Camera, Image as ImageIcon, ChevronLeft, Calendar, Download, Share2, Link2 } from 'lucide-react';
import type { GalleryAlbum } from '@/types';

export function VoceNaQMPage() {
  const { galleryAlbums } = useData();
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Filtrar álbuns ativos e ordenar por ordem -> data (Sincronizado com a Home)
  const filteredAlbums = useMemo(() => {
    return galleryAlbums
      .filter(a => a.status === 'active')
      .sort((a, b) => (a.order || 0) - (b.order || 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [galleryAlbums]);

  // Efeito para tratar álbuns externos (se vier selecionado do contexto)
  useEffect(() => {
    if (selectedAlbum?.type === 'external' && selectedAlbum.externalLink) {
      window.open(selectedAlbum.externalLink, '_blank');
      setSelectedAlbum(null);
    }
  }, [selectedAlbum]);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#F2F2F2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nível 2: Prateleira de Álbuns */}
        {!selectedAlbum && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
            <div className="mb-12 border-b border-gray-300 pb-8">
               <p className="text-qm-magenta text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Camera className="w-5 h-5" /> Momentos Eternizados
               </p>
               <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tight leading-none mb-4">
                 VOCÊ NA <span className="text-qm-magenta">QUERO MAIS</span>
               </h1>
               <p className="text-gray-600 text-lg sm:text-xl max-w-2xl">
                 Encontre suas fotos, relembre edições passadas e veja tudo o que rolou pelos olhos dos nossos fotógrafos oficiais.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredAlbums.length === 0 ? (
                 <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-50">
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
                        <h3 className="text-xl sm:text-2xl font-bold text-black uppercase tracking-tight mb-2 group-hover:text-qm-magenta transition-colors">{album.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold mb-4 mt-auto">
                           <Calendar className="w-4 h-4 text-qm-magenta" />
                           {new Date(album.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                     </div>
                   </div>
                 ))
              )}
            </div>
          </div>
        )}

        {/* Nível 3: Visualizador do Álbum Específico */}
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
                <h1 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">{selectedAlbum.title}</h1>
                <p className="text-gray-500 text-sm font-semibold mt-1">
                  {new Date(selectedAlbum.createdAt).toLocaleDateString('pt-BR')} • {selectedAlbum.images.length} Fotos Oficiais
                </p>
              </div>
            </div>

            {/* Grid Mansory para as fotos */}
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

        {/* Modal de Tela Cheia Nível 4 */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 w-12 h-12 rounded-none flex items-center justify-center transition-all"
              >
               ✕
             </button>
             
             <img src={selectedPhoto} alt="Foto Ampliada" className="max-w-full max-h-full object-contain rounded-none shadow-2xl" />
             
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-md px-6 py-3 rounded-none border border-white/10">
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

      </div>
    </main>
  );
}
