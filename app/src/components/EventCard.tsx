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
    <div className="flex flex-col sm:flex-row gap-8 items-center lg:items-stretch mb-16 last:mb-0">
      {/* Imagem do artista (Formato 3:4) */}
      <Link to={`/eventos/${event.slug}`} className="block w-full sm:w-[320px] lg:w-[400px] aspect-[3/4] flex-shrink-0 relative overflow-hidden">
        {event.coverImage || event.flyer ? (
          <img
            src={event.flyer || event.coverImage}
            alt={t(event.title)}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <ChevronRight className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </Link>

      {/* Informações */}
      <div className="flex-1 flex flex-col justify-center min-w-0 py-4 sm:pl-4">
        {/* Data + horário */}
        <span className="block text-2xl font-bold text-[#333333] mb-4">
          {formatDate(event.date)} | {event.time}
        </span>

        {/* Título / Descrição */}
        {event.shortDescription ? (
          <p className="text-lg text-[#444444] leading-relaxed mb-4 font-medium">
            {t(event.shortDescription)}
          </p>
        ) : (
          <h3 className="text-xl text-[#333333] leading-relaxed mb-4 font-bold">
            {t(event.title)}
          </h3>
        )}

        {/* Local */}
        <div className="text-lg text-[#444444] font-medium mb-10">
          <span className="truncate">{event.venue}{event.city ? ` | ${event.city}` : ''}</span>
        </div>

        {/* Botões CTA */}
        <div className="flex flex-col items-start gap-4 w-full">
          {hasTicketLinks ? (
            (event.ticketLinks ?? []).map((link: any) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full max-w-[320px] px-6 sm:px-8 py-3.5 sm:py-4 bg-[#555555] hover:bg-[#444444] text-white rounded-lg text-sm sm:text-base font-bold tracking-wider transition-colors font-sans"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-5 h-5 ml-4" />
              </a>
            ))
          ) : hasFallbackTicket ? (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full max-w-[320px] px-6 sm:px-8 py-3.5 sm:py-4 bg-[#555555] hover:bg-[#444444] text-white rounded-lg text-sm sm:text-base font-bold tracking-wider transition-colors font-sans"
            >
              <span>{t({ pt: 'Ingressos', en: 'Tickets', es: 'Entradas' })}</span>
              <ChevronRight className="w-5 h-5 ml-4" />
            </a>
          ) : null}

          {/* Lista de desconto */}
          <div className="w-full max-w-[320px]">
            <EventListForm eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
