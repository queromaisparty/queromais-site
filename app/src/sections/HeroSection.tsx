import { useEffect, useState } from 'react';
import { ArrowDown, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';

export function HeroSection() {
  const { t } = useLanguage();
  const { getUpcomingEvents } = useData();
  const [nextEvent, setNextEvent] = useState<ReturnType<typeof getUpcomingEvents>[0] | null>(null);

  useEffect(() => {
    const events = getUpcomingEvents();
    if (events.length > 0) {
      setNextEvent(events[0]);
    }
  }, [getUpcomingEvents]);

  const scrollToEvents = () => {
    const element = document.querySelector('#events');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      t({ pt: 'pt-BR', en: 'en-US', es: 'es-ES' }), 
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/10 via-transparent to-[#8B5CF6]/10 animate-pulse" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(204, 255, 0, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(204, 255, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse" />
            <span className="text-[#CCFF00] text-sm font-medium uppercase tracking-wider">
              {t({ pt: 'Experiências Únicas', en: 'Unique Experiences', es: 'Experiencias Únicas' })}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6">
            QUERO{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#8B5CF6]">
              MAIS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl text-white/80 font-light mb-4">
            {t(translations.home.heroSubtitle)}
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t(translations.home.heroDescription)}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              onClick={scrollToEvents}
              className="w-full sm:w-auto px-8 py-6 bg-[#CCFF00] text-black font-bold text-lg rounded-full hover:bg-[#b3e600] transition-all hover:scale-105"
            >
              {t(translations.buttons.buyTickets)}
            </Button>
            <a
              href="#fica-mais"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#fica-mais')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 border border-white/30 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all text-center"
            >
              {t(translations.buttons.learnMore)}
            </a>
          </div>

          {/* Next Event Card */}
          {nextEvent && (
            <div className="inline-block">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:border-[#CCFF00]/50 transition-all">
                <p className="text-[#CCFF00] text-sm font-bold uppercase tracking-wider mb-2">
                  {t({ pt: 'Próximo Evento', en: 'Next Event', es: 'Próximo Evento' })}
                </p>
                <h3 className="text-white text-xl font-bold mb-3">
                  {t(nextEvent.title)}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#CCFF00]" />
                    <span>{formatDate(nextEvent.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#CCFF00]" />
                    <span>{nextEvent.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-white/40" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-[#CCFF00]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-[#8B5CF6]/20 rounded-full blur-3xl" />
    </section>
  );
}
