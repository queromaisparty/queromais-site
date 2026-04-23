import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { EventListForm } from '@/components/EventListForm';
import { EventCard } from '@/components/EventCard';

export function EventsSection() {
  const { t } = useLanguage();
  const { events } = useData();

  const activeEvents = events
    .filter(e => e.status === 'active')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());



  return (
    <section id="eventos" className="pt-10 pb-24 md:py-32 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header da seção */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-sans font-black text-xl sm:text-3xl lg:text-5xl text-[#555555] tracking-tighter uppercase">{t({ pt: 'Agenda Quero Mais', en: 'Quero Mais Schedule', es: 'Agenda Quero Más' })}
          </h2>
        </div>

        {/* Estado vazio ââ‚¬â€ nenhum evento cadastrado */}
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

        {/* Grid de eventos ââ‚¬â€ 2 colunas no desktop */}
        {activeEvents.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Ver todos ââ‚¬â€ botão em estilo diferente se houver mais de 2 */}
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





