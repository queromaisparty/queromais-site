import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Calendar, MapPin, Search, ChevronLeft } from 'lucide-react';


type FilterState = 'all' | 'upcoming' | 'past';

export function EventosPage() {
  const { events } = useData();

  const [activeFilter, setActiveFilter] = useState<FilterState>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();

  const activeEvents = events.filter(e => e.status === 'active');
  const featuredEvent = activeEvents.filter(
    e => e.featured && new Date(e.date) >= now
  )[0] || activeEvents.find(e => new Date(e.date) >= now);

  let filteredList = activeEvents.filter(e => {
    const eventDate = new Date((e.date.includes('T') ? e.date.slice(0, 10) : e.date) + 'T12:00:00');
    const yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);
    const isPast = eventDate < yesterday;
    if (activeFilter === 'upcoming') return !isPast;
    if (activeFilter === 'past') return isPast;
    return true;
  });

  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredList = filteredList.filter(e => {
      const titleStr = typeof e.title === 'string' ? e.title : e.title.pt || '';
      return titleStr.toLowerCase().includes(lowerQuery);
    });
  }

  filteredList.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return activeFilter === 'past' ? db - da : da - db;
  });

  const getTitle = (content: string | { pt?: string; en?: string; es?: string } | null | undefined) =>
    typeof content === 'string' ? content : content?.pt || '';

  const formatDate = (dateStr: string) => {
    const base = dateStr.includes('T') ? dateStr.slice(0, 10) : dateStr;
    const d = new Date(base + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#F2F2F2]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">

          {/* Header */}
          <div className="mb-12 border-b border-gray-300 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-black text-2xl sm:text-4xl lg:text-6xl text-black uppercase tracking-tight leading-none mb-4">
                Agenda <span className="text-qm-magenta">Quero Mais</span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-lg lg:text-xl max-w-2xl">
                Programe-se para as próximas noites inesquecíveis ou explore nosso histórico de edições épicas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar evento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-3 bg-white border border-gray-300 rounded-none text-black text-sm focus:border-qm-magenta focus:outline-none transition-colors shadow-sm"
                />
              </div>
              <div className="flex bg-white border border-gray-300 rounded-none p-1 w-full sm:w-auto shadow-sm overflow-x-auto">
                <button
                  onClick={() => setActiveFilter('upcoming')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-none transition-colors ${activeFilter === 'upcoming' ? 'bg-qm-magenta text-white' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                >
                  Próximos
                </button>
                <button
                  onClick={() => setActiveFilter('past')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-none transition-colors ${activeFilter === 'past' ? 'bg-[#4A4A4A] text-white' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                >
                  Histórico
                </button>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-none transition-colors ${activeFilter === 'all' ? 'bg-[#4A4A4A] text-white' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                >
                  Todos
                </button>
              </div>
            </div>
          </div>

          {/* Featured Event Hero */}
          {activeFilter !== 'past' && !searchQuery && featuredEvent && new Date(featuredEvent.date) >= now && (
            <div className="mb-16">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-qm-magenta mb-4">Próxima Grande Parada</div>
              <Link
                to={`/eventos/${featuredEvent.slug}`}
                className="group relative rounded-none overflow-hidden aspect-[16/9] md:aspect-[21/9] block border border-transparent hover:border-qm-magenta/50 transition-colors shadow-2xl"
              >
                <img
                  src={featuredEvent.coverImage}
                  alt={getTitle(featuredEvent.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
                  <h2 className="text-3xl sm:text-5xl lg:text-7xl font-sans font-black text-white uppercase tracking-tight leading-none mb-4 group-hover:text-qm-magenta transition-colors line-clamp-2">
                    {getTitle(featuredEvent.title)}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base font-medium text-gray-200">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-qm-magenta" />
                      {new Date(featuredEvent.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-qm-magenta" />
                      {featuredEvent.venue || 'A Definir'}
                    </span>
                    <span className="ml-2 sm:ml-4 px-6 py-2.5 bg-qm-magenta text-white font-bold text-sm uppercase tracking-wider">
                      Ver Detalhes →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Lista de Eventos */}
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Calendar className="w-16 h-16 text-gray-400 mb-6" />
              <h3 className="text-2xl font-bold text-black mb-2">Sem Eventos</h3>
              <p className="text-gray-500 text-center">Não encontramos resultados para este filtro.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {filteredList.map(e => {
                const isPast = new Date(e.date) < now;
                return (
                  <Link
                    key={e.id}
                    to={`/eventos/${e.slug}`}
                    className={`group bg-[#FAFAFA] flex hover:opacity-95 hover:shadow-md transition-all duration-300 ${isPast ? 'opacity-75' : ''}`}
                  >
                    {/* Imagem */}
                    <div className="w-[140px] sm:w-[220px] flex-shrink-0 relative overflow-hidden">
                      {e.coverImage || e.flyer ? (
                        <img
                          src={e.flyer || e.coverImage}
                          alt={getTitle(e.title)}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPast ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${isPast ? 'grayscale' : ''}`}>
                          <Calendar className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-none text-white ${isPast ? 'bg-[#4A4A4A]' : 'bg-qm-magenta'}`}>
                          {new Date(e.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 p-5 sm:p-7 flex flex-col justify-center min-w-0">
                      <div className="mb-4">
                        <span className="block text-sm font-bold text-[#333333] mb-2">
                          {formatDate(e.date)} | {e.time || '22:00'}
                        </span>
                        <h3 className="font-sans font-black text-lg sm:text-xl text-[#111111] mb-2 leading-tight uppercase line-clamp-2 group-hover:text-qm-magenta transition-colors">
                          {getTitle(e.title)}
                        </h3>
                        <div className="text-xs text-[#666666]">
                          {e.venue}{e.city ? ` | ${e.city}` : ''}
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2 mt-auto">
                        {(e.ticketLinks ?? []).length > 0
                          ? (e.ticketLinks ?? []).map(link => (
                              <span
                                key={link.id}
                                className="flex items-center justify-between w-full max-w-[200px] px-4 py-2 bg-[#4A4A4A] text-white rounded-none text-xs font-bold tracking-[0.1em] font-sans"
                              >
                                <span>{link.label}</span>
                                <ChevronLeft className="w-3.5 h-3.5 rotate-180 ml-2" />
                              </span>
                            ))
                          : !isPast && (
                              <span className="flex items-center justify-between w-full max-w-[200px] px-4 py-2 bg-[#4A4A4A] text-white rounded-none text-xs font-bold tracking-[0.1em] font-sans">
                                <span>Ver detalhes</span>
                                <ChevronLeft className="w-3.5 h-3.5 rotate-180 ml-2" />
                              </span>
                            )
                        }
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
