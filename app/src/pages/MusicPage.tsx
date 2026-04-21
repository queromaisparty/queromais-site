import { Play, Headphones, Disc, ExternalLink, ArrowRight } from 'lucide-react';
import { useData } from '@/context/DataContext';

export function MusicPage() {
  const { djs, djSets, playlists } = useData();

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#F2F2F2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nível 2: Header da Seção de Música */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-300 pb-8">
            <div>
              <p className="text-[#E91E8C] text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Headphones className="w-4 h-4" /> Som Oficial
              </p>
              <h1 className="font-sans font-black text-5xl sm:text-6xl lg:text-7xl text-black uppercase tracking-tighter leading-none mb-4">
                QM <span className="text-[#E91E8C]">MUSIC</span>
              </h1>
              <p className="text-gray-600 text-lg sm:text-xl max-w-2xl">
                Nossa gravadora espiritual. Escute os sets originais dos nossos residentes e reviva as edições através das playlists oficiais.
              </p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="flex items-center gap-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">
                Spotify <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#" className="flex items-center gap-2 bg-[#FF5500]/10 hover:bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">
                SoundCloud <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* PAINEL ESQUERDO: Mixes & Sets */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Live Sets / Podcasts */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Disc className="w-6 h-6 text-[#E91E8C]" /> Live Sets Originais
              </h2>
              
              <div className="space-y-4">
                {djSets.length === 0 ? (
                  <div className="p-8 border border-gray-300 border-dashed rounded-2xl flex flex-col items-center text-center bg-white">
                    <Headphones className="w-10 h-10 text-gray-400 mb-4" />
                    <h3 className="text-black font-bold mb-1">Nenhum set cadastrado</h3>
                    <p className="text-gray-500 text-sm">Os administradores ainda não disponibilizaram os últimos sets gravados.</p>
                  </div>
                ) : (
                  djSets.map(set => (
                    <div key={set.id} className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#E91E8C]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 transition-all shadow-sm">
                      <div className="w-32 h-32 rounded-xl overflow-hidden relative shrink-0">
                        <img src={set.coverImage} alt={typeof set.title === 'string' ? set.title : set.title.pt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-[#E91E8C] flex items-center justify-center">
                            <Play className="w-4 h-4 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#E91E8C] mb-1">
                          DJ SET COMPLETO
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2 line-clamp-1">
                          {typeof set.title === 'string' ? set.title : set.title.pt}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {typeof set.description === 'string' ? set.description : set.description.pt}
                        </p>
                      </div>
                      
                      {set.soundcloudUrl && (
                        <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                          <a 
                            href={set.soundcloudUrl} 
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

            {/* Playlists de Esquenta */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <Headphones className="w-6 h-6 text-[#1DB954]" /> Playlists Oficiais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playlists.length === 0 ? (
                  <div className="col-span-full p-8 border border-[#1DB954]/20 border-dashed rounded-2xl flex flex-col items-center text-center bg-white">
                    <h3 className="text-black font-bold mt-2">Nenhuma playlist selecionada.</h3>
                  </div>
                ) : (
                  playlists.map((pl, i) => (
                    <a key={pl.id || i} href={pl.spotifyUrl} target="_blank" rel="noopener noreferrer" className="group rounded-2xl overflow-hidden aspect-[4/3] relative border border-gray-200 block shadow-sm">
                      <img src={pl.coverImage} alt={typeof pl.title === 'string' ? pl.title : pl.title.pt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

          </div>

          {/* PAINEL DIREITO: Curados e Residentes */}
          <div className="lg:col-span-4 mt-12 lg:mt-0">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-6">
              Nosso Cast Oficial
            </h2>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              {djs.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">DJs da casa não configurados.</p>
              ) : (
                <div className="space-y-6">
                  {djs.slice(0, 5).map(dj => (
                    <div key={dj.id} className="flex items-center gap-4 group cursor-pointer border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#E91E8C] transition-colors shrink-0 grayscale group-hover:grayscale-0">
                        <img src={dj.imageUrl} alt={typeof dj.name === 'string' ? dj.name : dj.name.pt} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-black font-bold uppercase group-hover:text-[#E91E8C] transition-colors">
                          {typeof dj.name === 'string' ? dj.name : dj.name.pt}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{dj.genre || 'Open Format'}</p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#E91E8C] flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-6 p-6 rounded-3xl border border-[#E91E8C]/20 bg-gradient-to-tr from-[#E91E8C]/5 to-transparent shadow-sm">
              <h3 className="font-bold text-black mb-2 uppercase">Agenciamento GIGs</h3>
              <p className="text-sm text-gray-600 mb-4">Interessado em levar um dos nossos DJs para o seu evento?</p>
              <a href="/contato" className="bg-[#E91E8C] text-white font-bold uppercase text-xs tracking-wider px-4 py-2.5 rounded-lg w-full block text-center hover:bg-[#D81B80] transition-colors shadow-md">
                Falar com Booker
              </a>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
