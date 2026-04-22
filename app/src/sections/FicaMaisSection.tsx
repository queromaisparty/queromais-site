import { useState } from 'react';
import { Moon, Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';

export function FicaMaisSection() {
  const { t } = useLanguage();
  const { ficaMaisParty } = useData();
  const [activeTab, setActiveTab] = useState<'about' | 'dates'>('about');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      t({ pt: 'pt-BR', en: 'en-US', es: 'es-ES' }), 
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  return (
    <section id="fica-mais" className="py-20 lg:py-32 bg-gradient-to-b from-black via-[#1a0a2e] to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#E91E8C]/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 rounded-none mb-6">
              <Moon className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-[#8B5CF6] text-sm font-bold uppercase tracking-wider">
                {t({ pt: 'After Party', en: 'After Party', es: 'After Party' })}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
              <span className="text-[#8B5CF6]">FICA</span> MAIS{' '}
              <span className="text-[#E91E8C]">PARTY</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t(translations.ficaMais.description)}
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="relative aspect-square max-w-[500px] mx-auto overflow-hidden rounded-2xl group shadow-2xl">
                {/* Main Image Container */}
                <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 group-hover:opacity-20" />
                <img
                  src={'/fica-mais-provisoria.jpg'}
                  alt="Fica Mais Party"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div>
              {/* Tabs */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-6 py-3 rounded-none font-bold transition-all ${
                    activeTab === 'about'
                      ? 'bg-[#8B5CF6] text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {t({ pt: 'Sobre', en: 'About', es: 'Sobre' })}
                </button>
                <button
                  onClick={() => setActiveTab('dates')}
                  className={`px-6 py-3 rounded-none font-bold transition-all ${
                    activeTab === 'dates'
                      ? 'bg-[#8B5CF6] text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {t(translations.ficaMais.upcomingDates)}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'about' ? (
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-none p-6">
                    <h3 className="text-white text-xl font-bold mb-4">
                      {t({ pt: 'O que é a Fica Mais Party?', en: 'What is Fica Mais Party?', es: '¿Qué es Fica Mais Party?' })}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {ficaMaisParty?.manifestoCurto?.pt ||
                        t({ 
                          pt: 'A Fica Mais Party é o after oficial da Quero Mais. Um espaço onde a festa continua quando o sol nasce, criando momentos únicos e memoráveis para quem não quer que a noite acabe. Música, energia e uma vibe exclusiva que só quem viveu conhece.',
                          en: 'Fica Mais Party is the official Quero Mais after party. A space where the party continues when the sun rises, creating unique and memorable moments for those who don\'t want the night to end.',
                          es: 'Fica Mais Party es el after oficial de Quero Más. Un espacio donde la fiesta continúa cuando sale el sol, creando momentos únicos y memorables para quienes no quieren que la noche termine.'
                        })
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-none p-4 text-center">
                      <div className="text-3xl font-black text-[#E91E8C] mb-1">24h</div>
                      <div className="text-white/50 text-sm">
                        {t({ pt: 'De Festa', en: 'Of Party', es: 'De Fiesta' })}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-none p-4 text-center">
                      <div className="text-3xl font-black text-[#8B5CF6] mb-1">∞</div>
                      <div className="text-white/50 text-sm">
                        {t({ pt: 'Memórias', en: 'Memories', es: 'Recuerdos' })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {ficaMaisParty?.upcomingDates && ficaMaisParty.upcomingDates.length > 0 ? (
                    ficaMaisParty.upcomingDates.map((date) => (
                      <div
                        key={date.id}
                        className="bg-white/5 border border-white/10 rounded-none p-4 flex items-center gap-4 hover:border-[#E91E8C]/50 transition-all"
                      >
                        <div className="w-14 h-14 bg-[#E91E8C] rounded-none flex flex-col items-center justify-center text-white flex-shrink-0">
                          <span className="text-lg font-black leading-none">
                            {new Date(date.date).getDate()}
                          </span>
                          <span className="text-xs font-bold uppercase">
                            {new Date(date.date).toLocaleDateString(t({ pt: 'pt-BR', en: 'en-US', es: 'es-ES' }), { month: 'short' }).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(date.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/50 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{date.location}</span>
                          </div>
                        </div>
                        {date.ticketLink && (
                          <a
                            href={date.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#E91E8C] text-white font-bold rounded-none text-sm hover:bg-[#D81B80] transition-colors"
                          >
                            {t(translations.buttons.buyTickets)}
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-none p-8 text-center">
                      <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
                      <p className="text-white/50">
                        {t({ 
                          pt: 'Nenhuma data programada no momento.',
                          en: 'No dates scheduled at the moment.',
                          es: 'No hay fechas programadas en este momento.'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
