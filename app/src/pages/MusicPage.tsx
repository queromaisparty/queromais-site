import { Play, Headphones, Disc, ExternalLink, ArrowRight } from 'lucide-react';
import { useData } from '@/context/DataContext';

export function MusicPage() {
  const { djs, djSets, playlists, siteConfig } = useData();

  return (
    <main className="pt-24 min-h-screen bg-white">
      
      {/* NÃ­vel 2: Header da SeÃ§Ã£o de MÃºsica */}
      <section className="w-full bg-[#F2F2F2] py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-300">
            <div>
              <p className="text-qm-magenta text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Headphones className="w-4 h-4" /> Som Oficial
              </p>
              <h1 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tighter leading-none mb-4">
                QM <span className="text-qm-magenta">MUSIC</span>
              </h1>
              <p className="text-gray-600 text-lg sm:text-xl max-w-2xl">
                Nossa gravadora espiritual. Escute os sets originais dos nossos residentes e reviva as ediÃ§Ãµes atravÃ©s das playlists oficiais.
              </p>
            </div>
            
            <div className="flex gap-4">
              {siteConfig.socialLinks?.map((link, i) => {
                if (link.platform.toLowerCase() === 'spotify') return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">
                    Spotify <ExternalLink className="w-4 h-4" />
                  </a>
                );
                if (link.platform.toLowerCase() === 'soundcloud') return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#FF5500]/10 hover:bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">
                    SoundCloud <ExternalLink className="w-4 h-4" />
                  </a>
                );
                return null;
              })}
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sets / Podcasts */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-12 flex items-center gap-3">
            <Disc className="w-8 h-8 text-qm-magenta" /> Live Sets Originais
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {djSets.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center text-center">
                <Headphones className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-black font-bold mb-1">Nenhum set cadastrado</h3>
                <p className="text-gray-500 text-sm">Os administradores ainda nÃ£o disponibilizaram os Ãºltimos sets gravados.</p>
              </div>
            ) : (
              djSets.map(set => (
                <div key={set.id} className="group flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0 transition-all hover:bg-gray-50 p-4 -mx-4 rounded-xl">
                      <div className="w-32 h-32 rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                        {set.coverImage ? (
                          <img src={set.coverImage} alt={typeof set.title === 'string' ? set.title : set.title.pt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200"><Disc className="w-8 h-8 text-gray-400" /></div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-qm-magenta flex items-center justify-center">
                            <Play className="w-4 h-4 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-qm-magenta mb-1">
                          DJ SET COMPLETO
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2 line-clamp-1">
                          {typeof set.title === 'string' ? set.title : set.title.pt}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {typeof set.description === 'string' ? set.description : set.description.pt}
                        </p>
                      </div>
                      
                      {(set.externalLink || set.audioUrl) && (
                        <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                          <a 
                            href={set.externalLink || set.audioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#4A4A4A] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-transparent shadow-md w-full"
                          >
                            Ouvir Mix <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
          </div>
        </div>
      </section>

      {/* Playlists de Esquenta */}
      <section className="w-full py-20 bg-black">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-3">
            <Headphones className="w-8 h-8 text-[#1DB954]" /> Playlists Oficiais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {playlists.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center text-center">
                <Disc className="w-12 h-12 text-gray-800 mb-4" />
                <h3 className="text-white font-bold mb-1">Nenhuma playlist selecionada</h3>
                <p className="text-gray-400 text-sm">Em breve, nossa seleÃ§Ã£o musical oficial aqui.</p>
              </div>
            ) : (
              playlists.map((pl, i) => (
                 <a key={pl.id || i} href={pl.externalUrl} target="_blank" rel="noopener noreferrer" className="group overflow-hidden aspect-[4/3] relative block bg-[#111]">
                      {pl.coverImage ? (
                        <img src={pl.coverImage} alt={typeof pl.title === 'string' ? pl.title : pl.title.pt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#222]"><Headphones className="w-12 h-12 text-white/20" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between">
                        <div>
                          <div className="text-[#1DB954] text-[10px] font-bold uppercase tracking-wider mb-1">Spotify Playlist</div>
                          <h3 className="text-xl font-bold text-white uppercase">{typeof pl.title === 'string' ? pl.title : pl.title.pt}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center shrink-0 shadow-lg shadow-[#1DB954]/20 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                          <Play className="w-4 h-4 text-white ml-1" />
                        </div>
                      </div>
                  </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* PAINEL DIREITO: Curados e Residentes */}
      <section className="w-full py-20 bg-[#F2F2F2]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter">
                Nosso Cast Oficial
              </h2>
            </div>
            <div className="p-4 rounded-xl bg-white border-l-4 border-qm-magenta min-w-[280px]">
              <h3 className="font-bold text-black uppercase text-sm mb-1">Agenciamento GIGs</h3>
              <p className="text-xs text-gray-500 mb-2">Interessado em ter um de nossos DJs?</p>
              <a href="/contato" className="text-qm-magenta font-bold text-xs uppercase hover:underline">
                Falar com Booker &rarr;
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {djs.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center text-center">
                <Headphones className="w-10 h-10 text-gray-300 mb-3" />
                <h3 className="text-black font-bold mb-1">Line-up em construÃ§Ã£o</h3>
                <p className="text-gray-500 text-sm">Os DJs residentes serÃ£o listados aqui em breve.</p>
              </div>
            ) : (
              djs.map(dj => (
                <div key={dj.id} className="flex items-center gap-4 group cursor-pointer bg-white p-4">
                  <div className="w-16 h-16 overflow-hidden border-2 border-transparent group-hover:border-qm-magenta transition-colors shrink-0 grayscale group-hover:grayscale-0 rounded-full bg-gray-200">
                        {dj.image ? (
                          <img src={dj.image} alt={dj.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-qm-magenta/20"><Headphones className="w-6 h-6 text-gray-400" /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-black font-bold uppercase group-hover:text-qm-magenta transition-colors">
                          {dj.name}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{dj.musicStyle || 'Open Format'}</p>
                      </div>
                      <button title="Ver DJ" className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-qm-magenta flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                      </button>
                    </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

