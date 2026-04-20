import { ChevronRight, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export function HeroSection() {
  const { t } = useLanguage();
  const { events } = useData();

  // Próximo evento featured
  const featuredEvent = events.find(e => e.featured && e.status === 'active') || events[0];

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">

      {/* Imagem de fundo */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&q=85"
          alt="Quero Mais - Experiência Premium de Eventos"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay gradiente sutil — escurece topo e rodapé para leitura */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />
      </div>

      {/* Conteúdo centralizado */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">

        {/* Logo/Marca — grande, central */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display font-black text-white uppercase tracking-tight leading-none"
            style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
            QUERO<span className="text-[#6ABD45]">+</span>
          </h1>
          <p className="text-white/80 font-display font-semibold uppercase tracking-[0.3em] text-sm sm:text-base mt-2">
            {t({
              pt: 'Experiências que marcam',
              en: 'Experiences that mark',
              es: 'Experiencias que marcan',
            })}
          </p>
        </div>

        {/* Badge de autoridade */}
        <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-white font-display font-black uppercase text-lg sm:text-2xl tracking-wide">
            {t({
              pt: 'O melhor da música eletrônica',
              en: 'The best of electronic music',
              es: 'Lo mejor de la música electrónica',
            })}
          </p>
          <p className="text-[#6ABD45] font-display font-bold uppercase text-base sm:text-xl tracking-wide mt-1">
            {t({
              pt: 'Santa Catarina e além',
              en: 'Santa Catarina and beyond',
              es: 'Santa Catarina y más allá',
            })}
          </p>
        </div>

        {/* CTAs duplos */}
        <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <button
            onClick={() => scrollTo('#eventos')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#4A4A4A] hover:bg-black text-white rounded-full font-semibold font-display text-sm uppercase tracking-wider transition-all duration-200 group"
          >
            {t({ pt: 'Ver Próximos Eventos', en: 'See Events', es: 'Ver Eventos' })}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => scrollTo('#voce')}
            className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/80 text-white hover:bg-white hover:text-black rounded-full font-semibold font-display text-sm uppercase tracking-wider transition-all duration-200"
          >
            {t({ pt: 'Você na Quero Mais?', en: 'See Gallery', es: 'Ver Galería' })}
          </button>
        </div>

      </div>

      {/* Card "Próximo Evento" — canto inferior */}
      {featuredEvent && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 z-10 animate-slide-up"
          style={{ animationDelay: '0.5s' }}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4 shadow-premium flex items-center gap-4 max-w-[320px]">
            <div className="w-10 h-10 rounded-full bg-[#6ABD45]/15 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#6ABD45]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6ABD45] mb-0.5">
                {t({ pt: 'Próximo Evento', en: 'Next Event', es: 'Próximo Evento' })}
              </p>
              <p className="text-sm font-bold text-black truncate">
                {t(featuredEvent.title)}
              </p>
              <p className="text-xs text-[#666666] mt-0.5">
                {new Date(featuredEvent.date).toLocaleDateString(
                  t({ pt: 'pt-BR', en: 'en-US', es: 'es-ES' }),
                  { day: '2-digit', month: 'short' }
                )} · {featuredEvent.time}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 sm:hidden">
        <div className="w-[1px] h-12 bg-white/40 mx-auto animate-pulse" />
      </div>

    </section>
  );
}
