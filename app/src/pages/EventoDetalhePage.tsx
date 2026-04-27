import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Calendar, MapPin, Ticket as TicketIcon, ArrowLeft, ArrowRight, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getTitle(content: string | { pt?: string; en?: string; es?: string } | null | undefined): string {
  if (!content) return '';
  return typeof content === 'string' ? content : content.pt || '';
}

export function EventoDetalhePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { events, contactInfo } = useData();

  const rawPhone = contactInfo?.whatsapp || contactInfo?.phone || '';
  const digits = rawPhone.replace(/\D/g, '');
  const finalPhone = digits ? (digits.startsWith('55') ? digits : `55${digits}`) : '';
  const whatsappUrl = finalPhone
    ? `https://wa.me/${finalPhone}?text=${encodeURIComponent('Olá, gostaria de saber mais sobre reservas e camarotes.')}`
    : '#';

  const event = events.find(e => e.slug === slug && e.status === 'active');
  const now = new Date();

  // SEO dinâmico
  useEffect(() => {
    if (event) {
      const title = getTitle(event.title);
      document.title = `${title} | PRÓXIMAS EXPERIÊNCIAS`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', getTitle(event.shortDescription) || `Confira os detalhes de ${title} na Quero Mais.`);
      }
    }
    
    return () => {
      // Opcional: Restaurar título original ao sair, mas o SiteEngine no App já cuida disso
    };
  }, [event]);

  if (!event) {
    return (
      <main className="pt-32 pb-20 min-h-screen bg-[#F2F2F2] flex flex-col items-center justify-center text-center px-4">
        <Calendar className="w-16 h-16 text-gray-300 mb-6" />
        <h1 className="font-black text-3xl text-black uppercase mb-3">Evento não encontrado</h1>
        <p className="text-gray-500 mb-8">Este evento pode ter sido removido ou não está mais disponível.</p>
        <Link
          to="/eventos"
          className="inline-flex items-center gap-2 px-8 py-3 bg-qm-magenta text-white font-bold uppercase tracking-wider text-sm hover:bg-qm-magenta-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver PRÓXIMAS EXPERIÊNCIAS
        </Link>
      </main>
    );
  }

  const isPast = new Date(event.date) < now;
  const heroImage = event.detailCoverImage || event.coverImage || event.flyer || '';
  
  // Regra de Outros Eventos: Ativos, Exceto o Atual, Ordenados por Data, Limite 4
  const otherEvents = events
    .filter(e => e.status === 'active' && e.id !== event.id) // Incluindo passados ativos ou apenas futuros? User pediu "ativos".
    .sort((a, b) => {
        const distA = Math.abs(new Date(a.date).getTime() - now.getTime());
        const distB = Math.abs(new Date(b.date).getTime() - now.getTime());
        return distA - distB; // Mais próximos de hoje primeiro
    })
    .slice(0, 4);

  const formatDate = (d: string) => {
    const base = d.includes('T') ? d.slice(0, 10) : d;
    return new Date(base + 'T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const formatDateShort = (d: string) => {
    const base = d.includes('T') ? d.slice(0, 10) : d;
    return new Date(base + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short',
    });
  };

  return (
    <main className="min-h-screen bg-[#F2F2F2]">
      {/* â”€â”€ CAPA ANIMADA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden bg-black">
        {heroImage ? (
          <img
            src={heroImage}
            alt={getTitle(event.title)}
            className="w-full h-full object-cover object-center scale-105 animate-[kenburns_12s_ease-in-out_infinite_alternate]"
            style={{ willChange: 'transform' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
        )}

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        {/* Breadcrumb / Voltar */}
        <div className="absolute top-0 left-0 right-0 pt-24 px-4 sm:px-8 lg:px-16">
          <button
            onClick={() => navigate('/eventos')}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            PRÓXIMAS EXPERIÊNCIAS
          </button>
        </div>

        {/* Conteúdo sobreposto na capa */}
        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-8 lg:px-16 pb-10 sm:pb-14">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-qm-magenta mb-3">
              {isPast ? 'Edição Histórica' : 'Evento Oficial'}
            </div>
            <h1 className="font-sans font-black text-2xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tighter leading-none mb-4 max-w-4xl">
              {getTitle(event.title)}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-200">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-qm-magenta flex-shrink-0" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-qm-magenta flex-shrink-0" />
                {event.time || '22:00'}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-qm-magenta flex-shrink-0" />
                {event.venue || 'Local a confirmar'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ CONTEÚDO PRINCIPAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

          {/* â”€â”€ COLUNA PRINCIPAL â”€â”€ */}
          <div className="lg:col-span-7 space-y-8">

            {/* Descrição curta */}
            {getTitle(event.shortDescription) && (
              <p className="text-xl sm:text-2xl font-semibold text-[#333] leading-relaxed border-l-4 border-qm-magenta pl-5">
                {getTitle(event.shortDescription)}
              </p>
            )}

            {/* Descrição longa */}
            {getTitle(event.description) && (
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {getTitle(event.description)}
              </div>
            )}

            {/* Informações detalhadas */}
            <div className="bg-white border border-gray-200 rounded-none shadow-sm divide-y divide-gray-100">
              <div className="flex items-start gap-3 p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F2F2F2] flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-qm-magenta" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Data e Hora</div>
                  <div className="text-black font-semibold text-lg uppercase">{formatDate(event.date)}</div>
                  <div className="text-gray-500 text-sm mt-0.5">Abertura das portões: {event.time || '22:00'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F2F2F2] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-qm-magenta" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Localização</div>
                  <div className="text-black font-semibold text-lg">{event.venue || 'A definir'}</div>
                  {(event.address || event.city) && (
                    <div className="text-gray-500 text-sm mt-0.5">
                      {event.address}{event.city ? ` - ${event.city}` : ''}
                    </div>
                  )}
                </div>
                {event.address && (
                  <a
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(event.address + ' ' + event.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex-shrink-0 mt-1 flex items-center gap-1 text-xs font-bold text-qm-magenta hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Navegar
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* â”€â”€ SIDEBAR DE AÇÕES â”€â”€ */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 sm:top-28 space-y-5">

              {/* Card de ingressos */}
              <div className="bg-white border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-3">
                  {isPast ? 'Evento Encerrado' : 'Garantir Presença'}
                </div>

                {!isPast ? (
                  <>
                    {(event.ticketLinks ?? []).length > 0 ? (
                      <div className="space-y-3">
                        {(event.ticketLinks ?? []).map(link => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 text-sm font-bold bg-qm-magenta hover:bg-qm-magenta-dark text-white uppercase tracking-wider shadow-lg shadow-qm-magenta/20 transition-all hover:-translate-y-0.5"
                          >
                            <TicketIcon className="w-5 h-5" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <Button
                        disabled
                        className="w-full py-5 text-base font-bold bg-gray-100 text-gray-400 rounded-none uppercase tracking-wider"
                      >
                        Vendas Em Breve
                      </Button>
                    )}

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-sm font-semibold text-gray-500 hover:text-black transition-colors py-2 border border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    >
                      Reservas / Camarotes por WhatsApp
                    </a>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Esta edição já aconteceu. Confira a galeria de fotos!</p>
                    <Link
                      to="/#galeria"
                      className="mt-3 inline-block text-sm font-bold text-qm-magenta hover:underline"
                    >
                      Ver galeria do evento &rarr;
                    </Link>
                  </div>
                )}
              </div>

              {/* Flyer */}
              {event.flyer && event.flyer !== heroImage && (
                <div className="overflow-hidden border border-gray-200 shadow-sm">
                  <img src={event.flyer} alt={`Flyer - ${getTitle(event.title)}`} className="w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* â”€â”€ OUTROS EVENTOS â”€â”€ */}
        {otherEvents.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-300">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-qm-magenta mb-2">PRÓXIMAS EXPERIÊNCIAS</div>
                <h2 className="font-black text-3xl sm:text-4xl text-black uppercase tracking-tighter">Outros Eventos</h2>
              </div>
              <Link
                to="/eventos"
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors"
              >
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {otherEvents.map(e => (
                <Link
                  key={e.id}
                  to={`/eventos/${e.slug}`}
                  className="group bg-white border border-gray-200 hover:border-qm-magenta/40 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {(e.flyer || e.coverImage) ? (
                      <img
                        src={e.flyer || e.coverImage}
                        alt={getTitle(e.title)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-gray-200" />
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5 bg-qm-magenta text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                      {formatDateShort(e.date)}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1.5 flex-1">
                    <h3 className="font-black text-sm uppercase text-black leading-tight group-hover:text-qm-magenta transition-colors line-clamp-2">
                      {getTitle(e.title)}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-auto pt-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" /> {e.venue}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link to="/eventos" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black">
                Ver experiências completas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}


