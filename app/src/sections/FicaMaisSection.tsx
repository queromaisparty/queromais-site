import { useState } from 'react';
import { Moon, Calendar, MapPin, Music, Sparkles } from 'lucide-react';
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
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#CCFF00]/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 rounded-full mb-6">
              <Moon className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-[#8B5CF6] text-sm font-bold uppercase tracking-wider">
                {t({ pt: 'After Party', en: 'After Party', es: 'After Party' })}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
              <span className="text-[#8B5CF6]">FICA</span> MAIS{' '}
              <span className="text-[#CCFF00]">PARTY</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t(translations.ficaMais.description)}
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Main Image Container */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-[#CCFF00] rounded-3xl rotate-3 opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] to-black rounded-3xl -rotate-3 overflow-hidden border border-white/10">
                  {ficaMaisParty?.images?.[0] ? (
                    <img
                      src={ficaMaisParty.images[0]}
                      alt="Fica Mais Party"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Moon className="w-24 h-24 text-[#8B5CF6] mb-4" />
                      <Sparkles className="w-12 h-12 text-[#CCFF00]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#CCFF00] rounded-2xl flex items-center justify-center rotate-12 shadow-lg shadow-[#CCFF00]/30">
                  <Music className="w-10 h-10 text-black" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#8B5CF6] rounded-full flex items-center justify-center -rotate-12 shadow-lg shadow-[#8B5CF6]/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              {/* Tabs */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-6 py-3 rounded-full font-bold transition-all ${
                    activeTab === 'about'
                      ? 'bg-[#8B5CF6] text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {t({ pt: 'Sobre', en: 'About', es: 'Sobre' })}
                </button>
                <button
                  onClick={() => setActiveTab('dates')}
                  className={`px-6 py-3 rounded-full font-bold transition-all ${
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
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white text-xl font-bold mb-4">
                      {t({ pt: 'O que é a Fica Mais Party?', en: 'What is Fica Mais Party?', es: '¿Qué es Fica Mais Party?' })}
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      {ficaMaisParty?.description?.pt || 
                        t({ 
                          pt: 'A Fica Mais Party é o after oficial da Quero Mais. Um espaço onde a festa continua quando o sol nasce, criando momentos únicos e memoráveis para quem não quer que a noite acabe. Música, energia e uma vibe exclusiva que só quem viveu conhece.',
                          en: 'Fica Mais Party is the official Quero Mais after party. A space where the party continues when the sun rises, creating unique and memorable moments for those who don\'t want the night to end. Music, energy and an exclusive vibe that only those who lived it know.',
                          es: 'Fica Mais Party es el after oficial de Quero Más. Un espacio donde la fiesta continúa cuando sale el sol, creando momentos únicos y memorables para quienes no quieren que la noche termine. Música, energía y una vibra exclusiva que solo quienes la vivieron conocen.'
                        })
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-3xl font-black text-[#CCFF00] mb-1">24h</div>
                      <div className="text-white/50 text-sm">
                        {t({ pt: 'De Festa', en: 'Of Party', es: 'De Fiesta' })}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
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
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-[#CCFF00]/50 transition-all"
                      >
                        <div className="w-14 h-14 bg-[#CCFF00] rounded-xl flex flex-col items-center justify-center text-black flex-shrink-0">
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
                            className="px-4 py-2 bg-[#CCFF00] text-black font-bold rounded-lg text-sm hover:bg-[#b3e600] transition-colors"
                          >
                            {t(translations.buttons.buyTickets)}
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
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
