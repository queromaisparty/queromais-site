import { useState } from 'react';
import { Music, Play, Headphones, Disc, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';

export function MusicSection() {
  const { t } = useLanguage();
  const { djs, djSets, playlists } = useData();
  const [activeTab, setActiveTab] = useState<'djs' | 'sets' | 'playlists'>('djs');

  return (
    <section id="music" className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6ABD45] mb-3 font-sans">
            {t({ pt: 'Sons que marcam', en: 'Sounds that leave a mark', es: 'Sonidos que marcan' })}
          </p>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tight">
            QM MUSIC
          </h2>
          <p className="text-black/60 text-lg max-w-2xl mx-auto mt-4 font-medium">
            {t(translations.music.description)}
          </p>
        </div>

        {/* Tabs (estilo GV/Sobre) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { key: 'djs', label: translations.music.djs, icon: Headphones },
            { key: 'sets', label: translations.music.sets, icon: Disc },
            { key: 'playlists', label: translations.music.playlists, icon: Music },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all border ${
                activeTab === tab.key
                  ? 'bg-[#3D4246] border-[#3D4246] text-white'
                  : 'bg-transparent border-[#E5E5E5] text-[#3D4246] hover:bg-[#F2F2F2]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {t(tab.label)}
            </button>
          ))}
        </div>

        {/* Listagens */}
        <div className="min-h-[400px]">
          
          {/* DJs */}
          {activeTab === 'djs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {djs.length > 0 ? (
                djs.map((dj) => (
                  <div key={dj.id} className="group bg-[#F2F2F2] rounded-xl overflow-hidden">
                    <div className="aspect-square overflow-hidden relative">
                      {dj.image ? (
                        <img
                          src={dj.image}
                          alt={dj.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Headphones className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-black text-xl text-black mb-2 uppercase">{dj.name}</h3>
                      <p className="text-black/60 text-sm line-clamp-3 mb-4">
                        {t(dj.bio)}
                      </p>
                      {dj.socialLinks.length > 0 && (
                        <div className="flex gap-3">
                          {dj.socialLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black/40 hover:text-[#6ABD45] transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                /* MOCK DJs */
                ['DJ Alpha', 'DJ Beta', 'DJ Gamma', 'DJ Delta'].map((name, i) => (
                  <div key={i} className="group bg-[#F2F2F2] rounded-xl overflow-hidden">
                    <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                      <Headphones className="w-16 h-16 text-gray-400 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-black text-xl text-black mb-1 uppercase">{name}</h3>
                      <p className="text-[#6ABD45] font-bold text-sm uppercase">House / Techno</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sets Tab */}
          {activeTab === 'sets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {djSets.length > 0 ? (
                djSets.map((set) => (
                  <div key={set.id} className="group bg-[#F2F2F2] rounded-xl overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      {set.coverImage ? (
                        <img
                          src={set.coverImage}
                          alt={t(set.title)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Disc className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-16 h-16 bg-[#6ABD45] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-black text-xl text-black mb-2 uppercase">{t(set.title)}</h3>
                      <p className="text-black/60 text-sm line-clamp-2 mb-4">
                        {t(set.description)}
                      </p>
                      {set.externalLink && (
                        <a
                          href={set.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#6ABD45] font-bold hover:underline text-sm uppercase"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t(translations.buttons.play)}
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                /* MOCK SETS */
                ['Live Set @ Quero Mais 2024', 'Summer Vibes Mix', 'Underground Sessions'].map((title, i) => (
                  <div key={i} className="group bg-[#F2F2F2] rounded-xl overflow-hidden">
                    <div className="relative aspect-video bg-gray-200 flex items-center justify-center overflow-hidden">
                      <Disc className="w-12 h-12 text-gray-400 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-16 h-16 bg-[#6ABD45] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-black text-xl text-black mb-1 uppercase">{title}</h3>
                      <p className="text-[#6ABD45] font-bold text-sm">2:30:00</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <div key={playlist.id} className="group bg-[#3D4246] rounded-xl overflow-hidden relative">
                    <div className="relative aspect-square overflow-hidden">
                      {playlist.coverImage ? (
                        <img
                          src={playlist.coverImage}
                          alt={t(playlist.title)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                          <Music className="w-16 h-16 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-display font-black text-white text-3xl mb-1 uppercase">{t(playlist.title)}</h3>
                        <p className="text-[#6ABD45] font-bold text-sm tracking-widest">{playlist.tracks.length} TRACKS</p>
                      </div>
                    </div>
                    <div className="p-6 absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center">
                      <p className="text-white/80 text-sm line-clamp-3 mb-6 px-4">
                        {t(playlist.description)}
                      </p>
                      {playlist.externalUrl && (
                        <a
                          href={playlist.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-[#6ABD45] text-white font-bold rounded-full hover:bg-[#5aa83b] transition-colors uppercase text-sm"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          {t(translations.buttons.play)}
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                /* MOCK PLAYLISTS */
                ['Quero Mais Official', 'Pre-Party Vibes', 'After Hours'].map((title, i) => (
                  <div key={i} className="group bg-[#3D4246] rounded-xl overflow-hidden relative">
                    <div className="relative aspect-square overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
                      <Music className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-display font-black text-white text-3xl mb-1 uppercase">{title}</h3>
                        <p className="text-[#6ABD45] font-bold text-sm tracking-widest">+50 TRACKS</p>
                      </div>
                    </div>
                    <div className="p-6 absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center">
                      <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#6ABD45] text-white font-bold rounded-full hover:bg-[#5aa83b] transition-colors uppercase text-sm">
                        <Play className="w-4 h-4 fill-current" />
                        {t(translations.buttons.play)}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
