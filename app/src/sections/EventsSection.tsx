import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { EventListForm } from '@/components/EventListForm';

export function EventsSection() {
  const { t } = useLanguage();
  const { events } = useData();

  const activeEvents = events
    .filter(e => e.status === 'active')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    const base = dateStr.includes('T') ? dateStr.slice(0, 10) : dateStr;
    const date = new Date(base + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    });
  };

  return (
    <section id="eventos" className="py-14 sm:py-20 lg:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header da seção */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-sans font-black text-xl sm:text-3xl lg:text-5xl text-[#555555] tracking-tight capitalize">
            {t({ pt: 'Agenda Quero Mais', en: 'Quero Mais Schedule', es: 'Agenda Quero Más' })}
          </h2>
        </div>

        {/* Estado vazio — nenhum evento cadastrado */}
        {activeEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="font-sans font-black text-2xl text-black uppercase mb-3">
              {t({ pt: 'Em breve!', en: 'Coming soon!', es: '¡Próximamente!' })}
            </h3>
            <p className="text-[#666666] text-base max-w-sm">
              {t({
                pt: 'Estamos preparando novos eventos incríveis. Fique de olho!',
                en: 'We are preparing amazing new events. Stay tuned!',
                es: '¡Estamos preparando nuevos eventos increíbles. ¡Estate atento!',
              })}
            </p>
          </div>
        )}

        {/* Grid de eventos — 2 colunas no desktop */}
        {activeEvents.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeEvents.map((event) => (
              <div key={event.id} className="flex flex-col sm:flex-row gap-8 items-center lg:items-stretch mb-16 last:mb-0">

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

                {/* Informações (Alinhadas conforme o print) */}
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

                  {/* Botões CTA — organizados verticalmente como no print */}
                  <div className="flex flex-col items-start gap-4 w-full">

                    {/* Fonte principal: eventos novos criados pelo admin */}
                    {(event.ticketLinks ?? []).length > 0 ? (
                      (event.ticketLinks ?? []).map((link) => (
                        <a
                           key={link.id}
                           href={link.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center justify-between w-full max-w-[320px] px-8 py-4 bg-[#5D2C45] hover:bg-[#4A1F35] text-white rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-colors font-sans"
                         >
                           <span>{link.label}</span>
                           <ChevronRight className="w-5 h-5 ml-4" />
                         </a>
                      ))
                    ) : (
                      /* Fallback: eventos antigos sem configurar ticketLinks no novo admin */
                      <a
                        href={event.ticketUrl && event.ticketUrl !== '#' ? event.ticketUrl : '#'}
                        target={event.ticketUrl && event.ticketUrl !== '#' ? '_blank' : undefined}
                        rel={event.ticketUrl && event.ticketUrl !== '#' ? 'noopener noreferrer' : undefined}
                        className="flex items-center justify-between w-full max-w-[320px] px-8 py-4 bg-[#5D2C45] hover:bg-[#4A1F35] text-white rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-colors font-sans"
                      >
                        <span>{t({ pt: 'Ingressos', en: 'Tickets', es: 'Entradas' })}</span>
                        <ChevronRight className="w-5 h-5 ml-4" />
                      </a>
                    )}

                    {/* Lista de desconto */}
                    <div className="w-full max-w-[320px]">
                      <EventListForm eventId={event.id} />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ver todos — botão em estilo diferente se houver mais de 2 */}
        {activeEvents.length > 2 && (
          <div className="text-center mt-12">
            <Link to="/eventos" className="inline-block px-10 py-3 bg-[#111111] hover:bg-black text-white text-sm font-bold tracking-widest uppercase transition-colors rounded-none">
              {t({ pt: 'Ver Agenda Completa', en: 'See Full Schedule', es: 'Ver Agenda Completa' })}
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
