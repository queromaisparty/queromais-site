
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';

export function EventsSection() {
  const { t } = useLanguage();
  const { getUpcomingEvents, events } = useData();
  const upcomingEvents = getUpcomingEvents();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString(t({ pt: 'pt-BR', en: 'en-US', es: 'es-ES' }), { month: 'short' }).toUpperCase(),
      full: date.toLocaleDateString(t({ pt: 'pt-BR', en: 'en-US', es: 'es-ES' }), { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    };
  };

  if (events.length === 0) {
    // Criar eventos de exemplo se não houver nenhum
    return (
      <section id="events" className="py-20 lg:py-32 bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="text-[#CCFF00] text-sm font-bold uppercase tracking-wider">
                {t({ pt: 'Agenda', en: 'Schedule', es: 'Agenda' })}
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
                {t(translations.events.title)}
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                {t(translations.events.subtitle)}
              </p>
            </div>

            {/* Empty State */}
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-white/30" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">
                {t(translations.events.noEvents)}
              </h3>
              <p className="text-white/50">
                {t({ 
                  pt: 'Fique atento às nossas redes sociais!',
                  en: 'Stay tuned to our social media!',
                  es: '¡Mantente atento a nuestras redes sociales!'
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-20 lg:py-32 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[#CCFF00] text-sm font-bold uppercase tracking-wider">
              {t({ pt: 'Agenda', en: 'Schedule', es: 'Agenda' })}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
              {t(translations.events.title)}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t(translations.events.subtitle)}
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 6).map((event) => {
              const date = formatDate(event.date);
              return (
                <div
                  key={event.id}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {event.coverImage ? (
                      <img
                        src={event.coverImage}
                        alt={t(event.title)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-[#CCFF00] text-black px-3 py-2 rounded-lg text-center">
                      <span className="block text-2xl font-black leading-none">{date.day}</span>
                      <span className="block text-xs font-bold uppercase">{date.month}</span>
                    </div>

                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-4 right-4 bg-[#8B5CF6] text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {t({ pt: 'Destaque', en: 'Featured', es: 'Destacado' })}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-white text-xl font-bold mb-3 group-hover:text-[#CCFF00] transition-colors">
                      {t(event.title)}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {t(event.description)}
                    </p>

                    {/* Info */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Clock className="w-4 h-4 text-[#CCFF00]" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <MapPin className="w-4 h-4 text-[#CCFF00]" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Button */}
                    {event.ticketLink && (
                      <a
                        href={event.ticketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-[#CCFF00] hover:text-black transition-all"
                      >
                        <Ticket className="w-4 h-4" />
                        {t(translations.buttons.buyTickets)}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          {upcomingEvents.length > 6 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="px-8 py-6 border-white/30 text-white hover:bg-white/10 rounded-full"
              >
                {t(translations.buttons.seeAll)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
