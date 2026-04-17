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
    <section id="music" className="py-20 lg:py-32 bg-gradient-to-b from-black via-[#0a1a0a] to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[80px]" />
        
        {/* Sound wave pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-[#CCFF00]"
              style={{ top: `${10 + i * 8}%` }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-full mb-6">
              <Music className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-[#CCFF00] text-sm font-bold uppercase tracking-wider">
                {t({ pt: 'Música', en: 'Music', es: 'Música' })}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
              <span className="text-[#CCFF00]">QM</span> MUSIC
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t(translations.music.description)}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { key: 'djs', label: translations.music.djs, icon: Headphones },
              { key: 'sets', label: translations.music.sets, icon: Disc },
              { key: 'playlists', label: translations.music.playlists, icon: Music },
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
            {/* DJs Tab */}
            {activeTab === 'djs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {djs.length > 0 ? (
                  djs.map((dj) => (
                    <div
                      key={dj.id}
                      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                    >
                      <div className="aspect-square overflow-hidden">
                        {dj.image ? (
                          <img
                            src={dj.image}
                            alt={dj.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                            <Headphones className="w-16 h-16 text-white/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-white text-lg font-bold mb-2">{dj.name}</h3>
                        <p className="text-white/50 text-sm line-clamp-2 mb-4">
                          {t(dj.bio)}
                        </p>
                        {dj.socialLinks.length > 0 && (
                          <div className="flex gap-2">
                            {dj.socialLinks.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/40 hover:text-[#CCFF00] transition-colors"
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
                  // DJ de exemplo
                  <>
                    {[
                      { name: 'DJ Alpha', style: 'House / Techno' },
                      { name: 'DJ Beta', style: 'Deep House' },
                      { name: 'DJ Gamma', style: 'Tech House' },
                      { name: 'DJ Delta', style: 'Progressive' },
                    ].map((dj, index) => (
                      <div
                        key={index}
                        className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                      >
                        <div className="aspect-square bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                          <Headphones className="w-16 h-16 text-white/30 group-hover:text-[#CCFF00] transition-colors" />
                        </div>
                        <div className="p-5">
                          <h3 className="text-white text-lg font-bold mb-1">{dj.name}</h3>
                          <p className="text-[#CCFF00] text-sm">{dj.style}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Sets Tab */}
            {activeTab === 'sets' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {djSets.length > 0 ? (
                  djSets.map((set) => (
                    <div
                      key={set.id}
                      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {set.coverImage ? (
                          <img
                            src={set.coverImage}
                            alt={t(set.title)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                            <Disc className="w-12 h-12 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-black ml-1" />
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-white text-lg font-bold mb-2">{t(set.title)}</h3>
                        <p className="text-white/50 text-sm line-clamp-2 mb-4">
                          {t(set.description)}
                        </p>
                        {set.externalLink && (
                          <a
                            href={set.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#CCFF00] hover:underline text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {t(translations.buttons.play)}
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Sets de exemplo
                  <>
                    {[
                      { title: 'Live Set @ Quero Mais 2024', duration: '2:34:00' },
                      { title: 'Summer Vibes Mix', duration: '1:45:30' },
                      { title: 'Underground Sessions', duration: '3:12:00' },
                    ].map((set, index) => (
                      <div
                        key={index}
                        className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                      >
                        <div className="relative aspect-video bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                          <Disc className="w-12 h-12 text-white/30" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                              <Play className="w-8 h-8 text-black ml-1" />
                            </button>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-white text-lg font-bold mb-1">{set.title}</h3>
                          <p className="text-[#CCFF00] text-sm">{set.duration}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Playlists Tab */}
            {activeTab === 'playlists' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        {playlist.coverImage ? (
                          <img
                            src={playlist.coverImage}
                            alt={t(playlist.title)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6]/30 to-[#CCFF00]/30 flex items-center justify-center">
                            <Music className="w-16 h-16 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-xl font-bold">{t(playlist.title)}</h3>
                          <p className="text-white/60 text-sm">{playlist.tracks.length} tracks</p>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-white/50 text-sm line-clamp-2 mb-4">
                          {t(playlist.description)}
                        </p>
                        {playlist.externalUrl && (
                          <a
                            href={playlist.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00] text-black font-bold rounded-lg hover:bg-[#b3e600] transition-colors text-sm"
                          >
                            <Play className="w-4 h-4" />
                            {t(translations.buttons.play)}
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Playlists de exemplo
                  <>
                    {[
                      { title: 'Quero Mais Official', tracks: 50 },
                      { title: 'Pre-Party Vibes', tracks: 32 },
                      { title: 'After Hours', tracks: 45 },
                    ].map((playlist, index) => (
                      <div
                        key={index}
                        className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                      >
                        <div className="relative aspect-square bg-gradient-to-br from-[#8B5CF6]/30 to-[#CCFF00]/30 flex items-center justify-center">
                          <Music className="w-16 h-16 text-white/30" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white text-xl font-bold">{playlist.title}</h3>
                            <p className="text-white/60 text-sm">{playlist.tracks} tracks</p>
                          </div>
                        </div>
                        <div className="p-5">
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00] text-black font-bold rounded-lg hover:bg-[#b3e600] transition-colors text-sm">
                            <Play className="w-4 h-4" />
                            {t(translations.buttons.play)}
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
