import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { EventListForm } from '@/components/EventListForm';

export function EventCard({ event }: { event: any }) {
  const { t } = useLanguage();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const base = dateStr.includes('T') ? dateStr.slice(0, 10) : dateStr;
    const date = new Date(base + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    });
  };

  const hasTicketLinks = (event.ticketLinks ?? []).length > 0;
  const hasFallbackTicket = event.ticketUrl && event.ticketUrl !== '#';

  return (
    <div className="flex flex-row gap-4 sm:gap-8 items-center lg:items-stretch w-full max-w-full lg:max-w-[680px]">
      {/* Imagem do artista (Formato 3:4) */}
      <Link to={`/eventos/${event.slug}`} className="block w-[110px] sm:w-[280px] aspect-[3/4] flex-shrink-0 relative overflow-hidden rounded-md sm:rounded-none">
        {event.coverImage || event.flyer ? (
          <img
            src={event.flyer || event.coverImage}
            alt={t(event.title)}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
        )}
      </Link>

      {/* Informações */}
      <div className="flex-1 flex flex-col justify-center min-w-0 py-2 sm:py-4">
        {/* Data + horário */}
        <span className="block text-sm sm:text-2xl font-bold text-[#333333] mb-1 sm:mb-4">
          {formatDate(event.date)} | {event.time}
        </span>

        {/* Título / Descrição */}
        {event.shortDescription ? (
          <p className="text-sm sm:text-lg text-[#444444] leading-snug sm:leading-relaxed mb-2 sm:mb-4 font-medium line-clamp-2">
            {t(event.shortDescription)}
          </p>
        ) : (
          <h3 className="text-base sm:text-xl text-[#333333] leading-snug sm:leading-relaxed mb-2 sm:mb-4 font-bold line-clamp-2">
            {t(event.title)}
          </h3>
        )}

        {/* Local */}
        <div className="text-xs sm:text-lg text-[#444444] font-medium mb-4 sm:mb-10">
          <span className="truncate block">{event.venue}{event.city ? ` | ${event.city}` : ''}</span>
        </div>

        {/* Botões CTA */}
        <div className="flex flex-col items-start gap-2 sm:gap-4 w-full">
          {hasTicketLinks ? (
            (event.ticketLinks ?? []).map((link: any) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full sm:w-[240px] px-3 py-2 sm:px-6 sm:py-3 bg-[#555555] hover:bg-[#444444] text-white rounded-md sm:rounded-lg text-sm sm:text-base font-bold tracking-wider transition-colors font-sans"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-4" />
              </a>
            ))
          ) : hasFallbackTicket ? (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full sm:w-[240px] px-3 py-2 sm:px-6 sm:py-3 bg-[#555555] hover:bg-[#444444] text-white rounded-md sm:rounded-lg text-sm sm:text-base font-bold tracking-wider transition-colors font-sans"
            >
              <span>{t({ pt: 'Ingressos', en: 'Tickets', es: 'Entradas' })}</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-4" />
            </a>
          ) : null}

          {/* Lista de desconto */}
          <div className="w-full sm:w-[240px]">
            <EventListForm eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
