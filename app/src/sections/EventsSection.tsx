import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export function EventsSection() {
  const { t } = useLanguage();
  const { events } = useData();

  const activeEvents = events
    .filter(e => e.status === 'active')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    });
  };

  return (
    <section id="eventos" className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header da seção */}
        <div className="text-center mb-16">
          <h2 className="font-sans font-black text-4xl sm:text-5xl lg:text-5xl text-[#555555] tracking-tight capitalize">
            {t({ pt: 'Próximos Eventos', en: 'Upcoming Events', es: 'Próximos Eventos' })}
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
              <div key={event.id} className="bg-[#FAFAFA] flex hover:opacity-95 transition-opacity duration-300">

                {/* Imagem do artista — lado esquerdo */}
                <div className="w-[160px] sm:w-[240px] flex-shrink-0">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={t(event.title)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ChevronRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Informações — lado direito */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center min-w-0">

                  {/* Data + horário */}
                  <div className="mb-5">
                    <span className="block text-sm sm:text-base font-bold text-[#333333] mb-2">
                      {formatDate(event.date)} | {event.time}
                    </span>

                    {/* Título do Evento */}
                    <h3 className="font-sans font-black text-xl sm:text-2xl text-[#111111] mb-3 leading-tight uppercase">
                      {t(event.title)}
                    </h3>

                    {event.shortDescription && (
                      <p className="text-sm text-[#333333] leading-relaxed line-clamp-3 mb-4">
                        {t(event.shortDescription)}
                      </p>
                    )}

                    <div className="text-sm text-[#333333]">
                      <span className="truncate">{event.venue}{event.city ? ` | ${event.city}` : ''}</span>
                    </div>
                  </div>

                  {/* Botões CTA — organizados verticalmente */}
                  <div className="flex flex-col items-start gap-3 mt-2">

                    {/* Fonte principal: eventos novos criados pelo admin */}
                    {(event.ticketLinks ?? []).map((link) => (
                      <a
                         key={link.id}
                         href={link.url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center justify-between w-full max-w-[220px] px-5 py-2.5 bg-[#4A4A4A] hover:bg-[#333] text-white rounded-full text-xs font-bold tracking-[0.1em] transition-colors font-sans"
                       >
                         <span>{link.label}</span>
                         <ChevronRight className="w-4 h-4 ml-2" />
                       </a>
                    ))}

                    {/* Fallback: eventos antigos sem configurar ticketLinks no novo admin */}
                    {(event.ticketLinks ?? []).length === 0 && (
                      <>
                        <a
                          href={event.ticketUrl && event.ticketUrl !== '#' ? event.ticketUrl : '#'}
                          target={event.ticketUrl && event.ticketUrl !== '#' ? '_blank' : undefined}
                          rel={event.ticketUrl && event.ticketUrl !== '#' ? 'noopener noreferrer' : undefined}
                          className="flex items-center justify-between w-full max-w-[220px] px-5 py-2.5 bg-[#4A4A4A] hover:bg-[#333] text-white rounded-full text-xs font-bold tracking-[0.1em] transition-colors font-sans"
                        >
                          <span>{t({ pt: 'Ingressos', en: 'Tickets', es: 'Entradas' })}</span>
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </a>

                        <a
                          href={event.vipUrl && event.vipUrl !== '#' ? event.vipUrl : '#'}
                          target={event.vipUrl && event.vipUrl !== '#' ? '_blank' : undefined}
                          rel={event.vipUrl && event.vipUrl !== '#' ? 'noopener noreferrer' : undefined}
                          className="flex items-center justify-between w-full max-w-[220px] px-5 py-2.5 bg-[#4A4A4A] hover:bg-[#333] text-white rounded-full text-xs font-bold tracking-[0.1em] transition-colors font-sans"
                        >
                          <span>{t({ pt: 'Listas', en: 'Guest List', es: 'Listas' })}</span>
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </a>
                      </>
                    )}
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
              {t({ pt: 'Ver todos os eventos', en: 'See all events', es: 'Ver todos los eventos' })}
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
