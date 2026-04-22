import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Calendar, MapPin, Ticket as TicketIcon, Search, ChevronLeft, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Event as SiteEvent } from '@/types'; 

type FilterState = 'all' | 'upcoming' | 'past';

export function EventosPage() {
  const { events } = useData();
  
  const [selectedEvent, setSelectedEvent] = useState<SiteEvent | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterState>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();
  
  const activeEvents = events.filter(e => e.status === 'active');
  const featuredEvent = activeEvents.filter(e => e.featured && new Date(e.date) >= now)[0] || activeEvents[0];

  let filteredList = activeEvents.filter(e => {
    // Normaliza para comparar apenas a data (sem horário) e não sumir com o evento no dia
    const eventDate = new Date(e.date + 'T12:00:00');
    // Para simplificar, vamos remover 24h do "now" para garantir que eventos de hoje fiquem no "upcoming"
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

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#F2F2F2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {!selectedEvent && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
            <div className="mb-12 border-b border-gray-300 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tight leading-none mb-4">
                  Próximos <span className="text-[#E91E8C]">Eventos</span>
                </h1>
                <p className="text-gray-600 text-lg sm:text-xl max-w-2xl">
                  Programe-se para as próximas noites inesquecíveis ou explore nosso histórico de eventos épicos.
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
                    className="w-full sm:w-64 pl-9 pr-4 py-3 bg-white border border-gray-300 rounded-none text-black text-sm focus:border-[#E91E8C] focus:outline-none transition-colors shadow-sm"
                  />
                </div>
                <div className="flex bg-white border border-gray-300 rounded-none p-1 w-full sm:w-auto shadow-sm">
                  <button
                    onClick={() => setActiveFilter('upcoming')}
                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeFilter === 'upcoming' ? 'bg-[#E91E8C] text-white' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                  >
                    Próximos
                  </button>
                  <button
                    onClick={() => setActiveFilter('past')}
                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeFilter === 'past' ? 'bg-[#4A4A4A] text-white' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                  >
                    Histórico
                  </button>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeFilter === 'all' ? 'bg-[#4A4A4A] text-white' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
                  >
                    Todos
                  </button>
                </div>
              </div>
            </div>

            {activeFilter !== 'past' && !searchQuery && featuredEvent && new Date(featuredEvent.date) >= now && (
              <div className="mb-16">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E91E8C] mb-4">Próxima Grande Parada</div>
                <div 
                  onClick={() => setSelectedEvent(featuredEvent)}
                  className="group relative rounded-none overflow-hidden aspect-[16/9] md:aspect-[21/9] cursor-pointer border border-transparent hover:border-[#E91E8C]/50 transition-colors shadow-2xl"
                >
                  <img src={featuredEvent.coverImage} alt={getTitle(featuredEvent.title)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
                     <h2 className="text-3xl sm:text-5xl lg:text-7xl font-sans font-black text-white uppercase tracking-tight leading-none mb-4 group-hover:text-[#E91E8C] transition-colors line-clamp-2">
                       {getTitle(featuredEvent.title)}
                     </h2>
                     <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base font-medium text-gray-200">
                        <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-[#E91E8C]"/> {new Date(featuredEvent.date).toLocaleDateString('pt-BR')}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-[#E91E8C]"/> {featuredEvent.venue || 'A Definir'}</span>
                        <Button className="mt-2 sm:mt-0 bg-[#E91E8C] hover:bg-[#D81B80] text-white font-bold px-8 rounded-none pointer-events-none">
                          Ver Detalhes <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                     </div>
                  </div>
                </div>
              </div>
            )}

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
                  const formatDate = (dateStr: string) => {
                    const d = new Date(dateStr + 'T12:00:00');
                    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
                  };
                  return (
                    <div
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className={`group cursor-pointer bg-[#FAFAFA] flex hover:opacity-95 transition-opacity duration-300 ${isPast ? 'opacity-75' : ''}`}
                    >
                      {/* Imagem — lado esquerdo */}
                      <div className="w-[140px] sm:w-[220px] flex-shrink-0 relative overflow-hidden">
                        <img
                          src={e.coverImage || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=85'}
                          alt={getTitle(e.title)}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPast ? 'grayscale' : ''}`}
                        />
                        <div className="absolute top-3 right-3">
                          <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white ${isPast ? 'bg-[#4A4A4A]' : 'bg-[#E91E8C]'}`}>
                            {new Date(e.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo — lado direito */}
                      <div className="flex-1 p-5 sm:p-7 flex flex-col justify-center min-w-0">
                        <div className="mb-4">
                          <span className="block text-sm font-bold text-[#333333] mb-2">
                            {formatDate(e.date)} | {e.time || '22:00'}
                          </span>
                          <h3 className="font-sans font-black text-lg sm:text-xl text-[#111111] mb-2 leading-tight uppercase line-clamp-2">
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
                                  className="flex items-center justify-between w-full max-w-[200px] px-4 py-2 bg-[#4A4A4A] text-white rounded-full text-xs font-bold tracking-[0.1em] font-sans"
                                >
                                  <span>{link.label}</span>
                                  <ChevronLeft className="w-3.5 h-3.5 rotate-180 ml-2" />
                                </span>
                              ))
                            : !isPast && (
                                <span className="flex items-center justify-between w-full max-w-[200px] px-4 py-2 bg-[#4A4A4A] text-white rounded-full text-xs font-bold tracking-[0.1em] font-sans">
                                  <span>Ver detalhes</span>
                                  <ChevronLeft className="w-3.5 h-3.5 rotate-180 ml-2" />
                                </span>
                              )
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {selectedEvent && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 mt-4">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-semibold group mb-8 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg w-fit shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Voltar à Agenda
            </button>
            
            <div className="grid lg:grid-cols-12 gap-12">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-none overflow-hidden border border-gray-200 aspect-square sm:aspect-[4/3] w-full shadow-lg">
                  <img src={selectedEvent.coverImage} alt={getTitle(selectedEvent.title)} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E91E8C] mb-2 font-sans">
                  {new Date(selectedEvent.date) < now ? 'Edição Histórica' : 'Evento Oficial'}
                </div>
                <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tight leading-none mb-6">
                  {getTitle(selectedEvent.title)}
                </h1>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {getTitle(selectedEvent.description)}
                </p>

                <div className="bg-white border border-gray-200 shadow-sm rounded-none p-6 sm:p-8 space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-none bg-[#F2F2F2] flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-[#E91E8C]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-semibold mb-1">Data e Hora</div>
                      <div className="text-black font-medium text-lg">
                        {new Date(selectedEvent.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">Abertura: {selectedEvent.time || '22:00'}</div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-100" />

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-none bg-[#F2F2F2] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#E91E8C]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-semibold mb-1">Localização</div>
                      <div className="text-black font-medium text-lg">{selectedEvent.venue || 'Local a ser definido'}</div>
                      <div className="text-gray-500 text-sm mt-1">{selectedEvent.address || 'Detalhes em breve'} {selectedEvent.city ? `- ${selectedEvent.city}` : ''}</div>
                    </div>
                  </div>
                </div>

                {new Date(selectedEvent.date) >= now ? (
                  <div className="space-y-4">
                    {(selectedEvent.ticketLinks ?? []).length > 0 ? (
                      <div className="space-y-3">
                        {(selectedEvent.ticketLinks ?? []).map(link => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 text-base font-bold bg-[#E91E8C] hover:bg-[#D81B80] text-white uppercase tracking-wider shadow-lg shadow-[#E91E8C]/20 transition-colors"
                          >
                            <TicketIcon className="w-5 h-5" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <Button disabled className="w-full py-6 text-lg font-bold bg-gray-200 text-gray-400 rounded-none uppercase tracking-wider">
                        Vendas Em Breve
                      </Button>
                    )}
                    <a href="#contato" className="block text-center text-sm font-semibold text-gray-500 hover:text-black transition-colors underline-offset-4 hover:underline">
                      Informações de Reservas / Camarotes
                    </a>
                  </div>
                ) : (
                  <Button className="w-full py-6 text-lg font-bold bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-wider shadow-lg">
                     <ImageIcon className="w-5 h-5 mr-3" />
                     Ver Fotos na Galeria
                  </Button>
                )}

              </div>
            </div>
            
          </div>
        )}

      </div>
    </main>
  );
}
