import { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, ArrowRight, Video, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   FOTOS DEMO â€” usadas quando o CMS estÃ¡ vazio
   Layout GV: 3 colunas, coluna central maior (row-span-2)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const DEMO_PHOTOS = [
  {
    id: 'd1',
    url: 'https://images.unsplash.com/photo-1429962599919-14d18dc9d04f?w=900&q=90',
    credit: 'Quero Mais',
    span: 'row-span-2',   // foto alta â€” ocupa 2 linhas na coluna
  },
  {
    id: 'd2',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=700&q=85',
    credit: 'Quero Mais',
    span: '',
  },
  {
    id: 'd3',
    url: 'https://images.unsplash.com/photo-1571266028243-d220c13c7d0e?w=700&q=85',
    credit: 'Quero Mais',
    span: '',
  },
  {
    id: 'd4',
    url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=90',
    credit: 'Quero Mais',
    span: 'row-span-2',
  },
  {
    id: 'd5',
    url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=700&q=85',
    credit: 'Quero Mais',
    span: '',
  },
  {
    id: 'd6',
    url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=700&q=85',
    credit: 'Quero Mais',
    span: '',
  },
  {
    id: 'd7',
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=85',
    credit: 'Quero Mais',
    span: '',
  },
  {
    id: 'd8',
    url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=900&q=90',
    credit: 'Quero Mais',
    span: 'row-span-2',
  },
  {
    id: 'd9',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=700&q=85',
    credit: 'Quero Mais',
    span: '',
  },
];

type Tab = 'photos' | 'videos' | 'download';

export function VoceSection() {
  const { t } = useLanguage();
  const { galleryAlbums } = useData();

  const [activeTab, setActiveTab]       = useState<Tab>('photos');
  const [lightboxIdx, setLightboxIdx]   = useState<number | null>(null);
  const [searchQuery, setSearchQuery]   = useState('');

  /* â”€â”€ flat list de fotos do CMS ou demo â”€â”€ */
  const allImages = galleryAlbums.flatMap(a =>
    a.images.map(img => ({ id: img.id, url: img.url, credit: 'Quero Mais', span: '' }))
  );
  const allVideos   = galleryAlbums.flatMap(a => a.videos);
  const photos      = allImages.length > 0 ? allImages : DEMO_PHOTOS;

  /* â”€â”€ lightbox navigation â”€â”€ */
  const openLight  = useCallback((i: number) => setLightboxIdx(i), []);
  const closeLight = useCallback(() => setLightboxIdx(null),        []);
  const prevPhoto  = useCallback(() => setLightboxIdx(i => i != null ? (i - 1 + photos.length) % photos.length : null), [photos.length]);
  const nextPhoto  = useCallback(() => setLightboxIdx(i => i != null ? (i + 1) % photos.length : null),                 [photos.length]);

  /* â”€â”€ keyboard handler â”€â”€ */
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape')    closeLight();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  }, [closeLight, prevPhoto, nextPhoto]);

  const tabs: { key: Tab; label: { pt: string; en: string; es: string } }[] = [
    { key: 'photos',   label: { pt: 'Fotos',          en: 'Photos',      es: 'Fotos'       } },
    { key: 'videos',   label: { pt: 'VÃ­deos',         en: 'Videos',      es: 'Videos'      } },
    { key: 'download', label: { pt: 'Pegue sua foto', en: 'Get my photo', es: 'Mi foto'    } },
  ];

  return (
    <section id="voce" className="bg-white" onKeyDown={handleKey}>

      {/* â”€â”€ CabeÃ§alho da seÃ§Ã£o â”€â”€ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C2185B] mb-3 font-sans">
              {t({ pt: 'MemÃ³rias e experiÃªncias', en: 'Memories & experiences', es: 'Recuerdos y experiencias' })}
            </p>
            <h2 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tight leading-none">
              {t({ pt: 'VocÃª na Quero Mais?', en: 'Were You There?', es: 'Â¿Estuviste AhÃ­?' })}
            </h2>
          </div>

          {/* Tabs â€” pill style */}
          <div className="flex items-center gap-2 shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 font-sans whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-[#3D4246] text-white'
                    : 'border border-[#DDDDDD] text-[#666] hover:border-[#3D4246] hover:text-black'
                }`}
              >
                {t(tab.label)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          FOTOS â€” Grade mosaico idÃªntica ao GV
          3 colunas, gap mÃ­nimo, alturas variadas
      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'photos' && (
        <div
          className="w-full"
          style={{
            columnCount: 3,
            columnGap: '3px',
          }}
        >
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLight(idx)}
              className="group relative overflow-hidden cursor-pointer bg-[#1a1a1a] break-inside-avoid"
              style={{ marginBottom: '3px' }}
            >
              <img
                src={photo.url}
                alt="Quero Mais"
                loading="lazy"
                className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-110 origin-center"
                style={{ display: 'block' }}
              />
              {/* Overlay hover â€” escurece levemente + Ã­cone cÃ¢mera */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-400 flex items-center justify-center">
                <div className="w-12 h-12 rounded-md flex items-center justify-center transition-all duration-300 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-sm">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          VÃDEOS
      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'videos' && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {allVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allVideos.map(video => (
                <div key={video.id} className="group overflow-hidden cursor-pointer bg-[#0A0A0A] aspect-video relative">
                  {video.thumbnail && (
                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center shadow-lg">
                      <Video className="w-6 h-6 text-[#3D4246] ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm font-semibold font-sans">{t(video.caption || { pt: 'Ver vÃ­deo', en: 'Watch video', es: 'Ver video' })}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <Video className="w-16 h-16 text-[#E5E5E5] mx-auto mb-6" />
              <p className="text-[#999] font-sans text-lg">
                {t({ pt: 'VÃ­deos em breve', en: 'Videos coming soon', es: 'Videos prÃ³ximamente' })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          PEGUE SUA FOTO
      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'download' && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-lg mx-auto py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-[#E91E8C]/10 rounded-md flex items-center justify-center">
              <Download className="w-9 h-9 text-[#C2185B]" />
            </div>
            <h3 className="font-sans font-black text-3xl uppercase text-black mb-4">
              {t({ pt: 'Pegue sua foto', en: 'Get your photo', es: 'Tu foto' })}
            </h3>
            <p className="text-[#666] font-sans mb-8 leading-relaxed">
              {t({
                pt: 'Esteve em um evento? Encontre suas fotos digitando seu nome ou o cÃ³digo do evento.',
                en: 'Were you at an event? Find your photos by typing your name or event code.',
                es: 'Â¿Estuviste en un evento? Encuentra tus fotos escribiendo tu nombre o cÃ³digo del evento.',
              })}
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t({ pt: 'Nome ou cÃ³digo do evento', en: 'Name or event code', es: 'Nombre o cÃ³digo del evento' })}
                className="flex-1 px-4 py-3 border border-[#E5E5E5] rounded-md text-sm focus:outline-none focus:border-[#E91E8C] focus:ring-2 focus:ring-[#E91E8C]/20 transition-all font-sans"
              />
              <button className="flex items-center gap-2 px-6 py-3 bg-[#3D4246] hover:bg-black text-white rounded-md text-sm font-bold uppercase tracking-wider transition-all font-sans group">
                {t({ pt: 'Buscar', en: 'Search', es: 'Buscar' })}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LIGHTBOX â€” Estilo GV: fundo branco claro,
          foto centralizada, setas laterais,
          X no canto superior direito, crÃ©dito no rodapÃ©
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-white/97 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLight}
        >
          {/* BotÃ£o fechar */}
          <button
            onClick={closeLight}
            className="absolute top-5 right-6 z-10 p-1 text-[#333] hover:text-black transition-colors"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Seta esquerda */}
          <button
            onClick={e => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 z-10 w-11 h-11 flex items-center justify-center text-[#333] hover:text-black transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Seta direita */}
          <button
            onClick={e => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 z-10 w-11 h-11 flex items-center justify-center text-[#333] hover:text-black transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Foto */}
          <div
            className="relative max-w-5xl max-h-[88vh] w-full mx-16"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIdx].url}
              alt="Quero Mais"
              className="w-full max-h-[82vh] object-contain select-none"
              draggable={false}
            />
            {/* CrÃ©dito â€” canto inferior esquerdo como no GV */}
            <p className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest text-[#333]/60 font-sans select-none">
              {photos[lightboxIdx].credit}
            </p>
            {/* Contador */}
            <p className="absolute bottom-2 right-2 text-[10px] text-[#333]/50 font-sans tabular-nums select-none">
              {lightboxIdx + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
