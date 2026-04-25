import { useState } from 'react';
import { Music, Play, Headphones, Disc, ExternalLink, Instagram } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p === 'instagram') return <Instagram className="w-4 h-4" />;
  if (p === 'soundcloud') return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-label="SoundCloud">
      <path d="M1.175 12.225c-.016 0-.024.013-.024.027l-.312 2.137.312 2.036c0 .016.008.025.024.025.015 0 .023-.009.023-.025l.351-2.036-.351-2.137c0-.014-.008-.027-.023-.027zm-.8.548c-.02 0-.031.015-.031.035l-.27 1.581.27 1.492c0 .02.011.035.031.035s.031-.015.031-.035l.308-1.492-.308-1.581c0-.02-.011-.035-.031-.035zm-.375.44c-.022 0-.038.016-.038.04l-.231 1.14.231 1.06c0 .024.016.04.038.04.023 0 .039-.016.039-.04l.264-1.06-.264-1.14c0-.024-.016-.04-.039-.04zm10.918-7.87c-.385 0-.753.08-1.087.224C9.56 3.63 8.016 2.5 6.2 2.5c-.507 0-.991.101-1.43.285-.163.065-.207.132-.208.19v9.24c.001.063.051.114.115.12h7.011c.063-.006.113-.057.115-.12V7.41c-.001-.47-.378-.867-.85-.867zm1.19.463c-.078 0-.152.013-.223.034-.217-1.73-1.7-3.07-3.5-3.07-.316 0-.619.044-.907.124-.112.033-.142.067-.143.096v7.33c.001.032.025.058.058.063h4.715c.034-.005.06-.031.06-.063V5.87c0-.582-.47-1.064-1.06-1.064z"/>
    </svg>
  );
  if (p === 'spotify') return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-label="Spotify">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.972c3.632-1.102 8.147-.568 11.233 1.328a.78.78 0 01.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 11-.543-1.793c3.526-1.07 9.37-.863 13.066 1.37a.937.937 0 01-.906 1.58z"/>
    </svg>
  );
  if (p === 'youtube') return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-label="YouTube">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
  return <ExternalLink className="w-4 h-4" />;
}

export function MusicSection() {
  const { t } = useLanguage();
  const { djs, djSets } = useData();
  const [activeTab, setActiveTab] = useState<'djs' | 'sets'>('djs');

  return (
    <section id="music" className="py-12 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção */}
        <div className="text-center mb-8 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-color)] mb-3">
            {t({ pt: 'Sons que marcam', en: 'Sounds that leave a mark', es: 'Sonidos que marcan' })}
          </p>
          <h2 className="font-black text-2xl sm:text-4xl lg:text-6xl text-black uppercase tracking-tighter">
            QM MUSIC
          </h2>
          <p className="text-black/60 text-sm sm:text-lg max-w-2xl mx-auto mt-4 font-medium">
            {t(translations.music.description)}
          </p>
        </div>

        {/* Tabs (estilo GV/Sobre) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { key: 'djs', label: translations.music.djs, icon: Headphones },
            { key: 'sets', label: translations.music.sets, icon: Disc },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-none font-bold transition-all border ${
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {djs.length > 0 ? (
                djs.map((dj) => (
                  <div key={dj.id} className="group bg-[#F2F2F2] rounded-none overflow-hidden">
                    <div className="aspect-square overflow-hidden relative bg-[#1A1A2E]">
                      {dj.image ? (
                        <img
                          src={dj.image}
                          alt={dj.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A2E] to-qm-magenta/20">
                          <Headphones className="w-16 h-16 text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-6">
                      <h3 className="font-black text-sm sm:text-xl text-black mb-1 uppercase">{dj.name}</h3>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-color)] mb-3">
                        {dj.category === 'resident' ? 'DJ Residente' : dj.category === 'guest' ? 'Convidado Especial' : 'Atração Especial'}
                        {dj.musicStyle && ` • ${dj.musicStyle}`}
                      </div>
                      <p className="text-black/60 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-4">
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
                              title={link.platform}
                              className="text-black/40 hover:text-[var(--primary-color)] transition-colors"
                            >
                              <SocialIcon platform={link.platform} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center flex flex-col items-center justify-center bg-[#F2F2F2] rounded-none border border-dashed border-gray-300">
                  <Headphones className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="font-black text-xl text-black uppercase">Cast em Breve</h3>
                  <p className="text-black/50 text-sm mt-1">Nosso catálogo de residentes está sendo atualizado.</p>
                </div>
              )}
            </div>
          )}

          {/* Sets Tab */}
          {activeTab === 'sets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {djSets.length > 0 ? (
                djSets.map((set) => (
                  <div key={set.id} className="group bg-[#F2F2F2] rounded-none overflow-hidden">
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
                      {(() => {
                        const playUrl = set.externalLink || set.soundcloudUrl || set.audioUrl || set.playlistUrl;
                        return playUrl ? (
                          <a 
                            href={playUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <button className="w-16 h-16 bg-qm-magenta rounded-none flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                              <Play className="w-8 h-8 text-white ml-1 pointer-events-none" />
                            </button>
                          </a>
                        ) : null;
                      })()}
                    </div>
                    <div className="p-6">
                      <h3 className="font-black text-xl text-black mb-2 uppercase">{t(set.title)}</h3>
                      <p className="text-black/60 text-sm line-clamp-2 mb-4">
                        {t(set.description)}
                      </p>
                      {set.externalLink && (
                        <a
                          href={set.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[var(--primary-color)] font-bold hover:underline text-sm uppercase"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t(translations.buttons.play)}
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center flex flex-col items-center justify-center bg-[#F2F2F2] rounded-none border border-dashed border-gray-300">
                  <Disc className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="font-black text-xl text-black uppercase">Sets em Breve</h3>
                  <p className="text-black/50 text-sm mt-1">Novos sets sendo processados na nossa base.</p>
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    </section>
  );
}



