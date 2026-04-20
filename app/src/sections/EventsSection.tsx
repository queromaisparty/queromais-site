import { ChevronRight, MapPin, CalendarDays } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export function EventsSection() {
  const { t } = useLanguage();
  const { events } = useData();

  const activeEvents = events
    .filter(e => e.status === 'active')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Mock de eventos se não houver nenhum no contexto
  const mockEvents = [
    {
      id: 'mock1',
      title: { pt: 'Quero Mais — Edição Especial', en: 'Quero Mais — Special Edition', es: 'Quero Más — Edición Especial' },
      shortDescription: { pt: 'Uma noite inesquecível com o melhor da música eletrônica. Prepare-se para uma experiência única.', en: 'An unforgettable night with the best electronic music.', es: 'Una noche inolvidable con lo mejor de la música electrónica.' },
      date: '2025-05-24',
      time: '23h',
      venue: 'Quero Mais Club',
      city: 'Florianópolis / SC',
      coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=85',
      ticketUrl: '#',
      vipUrl: '#',
      featured: true,
      status: 'active' as const,
      slug: 'edicao-especial',
      order: 1,
    },
    {
      id: 'mock2',
      title: { pt: 'Fica Mais Party — Vol. 12', en: 'Fica Mais Party — Vol. 12', es: 'Fica Más Party — Vol. 12' },
      shortDescription: { pt: 'A festa que não acaba. Fica Mais Party de volta com tudo — os melhores DJs, a melhor experiência.', en: 'The party that never ends. Fica Mais Party is back with everything.', es: 'La fiesta que nunca termina.' },
      date: '2025-06-14',
      time: '23h',
      venue: 'Quero Mais Club',
      city: 'Florianópolis / SC',
      coverImage: 'https://images.unsplash.com/photo-1429962599919-14d18dc9d04f?w=600&q=85',
      ticketUrl: '#',
      vipUrl: '#',
      featured: false,
      status: 'active' as const,
      slug: 'fica-mais-party-vol-12',
      order: 2,
    },
  ];

  const displayEvents = activeEvents.length > 0 ? activeEvents : mockEvents;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    });
  };

  return (
    <section id="eventos" className="py-24 lg:py-32 bg-[#F2F2F2]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header da seção */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6ABD45] mb-3 font-sans">
            {t({ pt: 'Confira a programação', en: 'Check the schedule', es: 'Consulta la programación' })}
          </p>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tight">
            {t({ pt: 'Agenda', en: 'Events', es: 'Agenda' })}
          </h2>
        </div>

        {/* Grid de eventos — 2 colunas no desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl overflow-hidden flex hover:shadow-lg transition-shadow duration-300">

              {/* Imagem do artista — quadrada, lado esquerdo */}
              <div className="w-[180px] sm:w-[220px] flex-shrink-0 overflow-hidden">
                <img
                  src={event.coverImage || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=85'}
                  alt={t(event.title)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Informações — lado direito */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">

                {/* Data + horário */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="w-4 h-4 text-[#6ABD45] flex-shrink-0" />
                    <span className="text-sm font-bold text-black">
                      {formatDate(event.date)} <span className="text-[#666666] font-medium">| {event.time}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg sm:text-xl text-black mb-2 leading-tight uppercase">
                    {t(event.title)}
                  </h3>

                  <p className="text-sm text-[#666666] leading-relaxed line-clamp-3 mb-3">
                    {t(event.shortDescription || { pt: '', en: '', es: '' })}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-[#666666]">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{event.venue} | {event.city}</span>
                  </div>
                </div>

                {/* Botões CTA */}
                <div className="flex flex-col sm:flex-row gap-2 mt-5">
                  <a
                    href={event.ticketUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#4A4A4A] hover:bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all group font-sans"
                  >
                    {t({ pt: 'Ingressos', en: 'Tickets', es: 'Entradas' })}
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <a
                    href={event.vipUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 border border-[#4A4A4A] text-[#4A4A4A] hover:bg-[#4A4A4A] hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all group font-sans"
                  >
                    {t({ pt: 'Mesas e Camarotes', en: 'VIP Tables', es: 'Mesas VIP' })}
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Ver todos os eventos */}
        {activeEvents.length > 2 && (
          <div className="text-center mt-10">
            <button className="flex items-center gap-2 mx-auto px-8 py-3.5 border border-[#4A4A4A] text-[#4A4A4A] hover:bg-[#4A4A4A] hover:text-white rounded-full text-sm font-semibold uppercase tracking-wider transition-all font-sans">
              {t({ pt: 'Ver todos os eventos', en: 'See all events', es: 'Ver todos los eventos' })}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
