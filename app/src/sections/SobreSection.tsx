import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';

const translateDynamic = (val: string, t: any) => {
  const map: Record<string, { pt: string, en: string, es: string }> = {
    'VIVA A SUA MELHOR VERSÃO': { pt: 'VIVA A SUA MELHOR VERSÃO', en: 'LIVE YOUR BEST VERSION', es: 'VIVE TU MEJOR VERSIÓN' },
    'Nascida no Rio de Janeiro, a Quero Mais é uma celebração itinerante que redefine o conceito de Day Party.': { pt: 'Nascida no Rio de Janeiro, a Quero Mais é uma celebração itinerante que redefine o conceito de Day Party.', en: 'Born in Rio de Janeiro, Quero Mais is a wandering celebration that redefines the Day Party concept.', es: 'Nacida en Río de Janeiro, Quero Mais es una celebración itinerante que redefine el concepto de Day Party.' },
    'Estética impecável, curadoria musical de alto nível e um público que pulsa na mesma frequência.': { pt: 'Estética impecável, curadoria musical de alto nível e um público que pulsa na mesma frequência.', en: 'Impeccable aesthetics, high-level musical curation, and an audience that pulses at the same frequency.', es: 'Estética impecable, curaduría musical de alto nivel y un público que vibra en la misma frecuencia.' },
    'Conheça nossa história': { pt: 'Conheça nossa história', en: 'Discover our story', es: 'Conoce nuestra historia' }
  };
  return map[val] ? t(map[val]) : val;
};

export function SobreSection() {
  const { storytelling } = useData();
  const { t } = useLanguage();
  const s = storytelling;
  const stats = Array.isArray(s?.stats) ? [...s.stats].sort((a, b) => a.order - b.order) : [];

  return (
    <section id="sobre" className="bg-white">

      {/* Bloco escuro â€” resumo institucional */}
      <div className="bg-[#3D4246] py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-6 font-sans">
                {t({ pt: 'Quem somos', en: 'About us', es: 'Quiénes somos' })}
              </p>
              <h2 className="font-sans font-black text-white uppercase leading-none tracking-tighter"
                  style={{ fontSize: 'clamp(1.6rem, 5vw, 4rem)' }}>
                {translateDynamic(s.homeTitle, t)}
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-white/80 leading-relaxed text-base lg:text-lg font-sans">
                {translateDynamic(s.homeText1, t)}
              </p>
              <div className="w-12 h-px bg-white/30" />
              <p className="text-white/60 leading-relaxed text-sm font-sans">
                {translateDynamic(s.homeText2, t)}
              </p>
              <Link
                to="/sobre"
                className="inline-block text-white/70 hover:text-white font-sans font-bold uppercase tracking-wide text-sm hover:underline transition-colors"
              >
                {translateDynamic(s.homeCTA, t)} &rarr;
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Bloco branco â€” stats + essência */}
      <div className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Stats â€” só renderiza se houver dados */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-20">
              {stats.map(stat => (
                <div key={stat.id} className="text-center">
                  <p className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl text-black mb-1 sm:mb-2">{stat.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#666666] font-sans">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Imagem + essência */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {s.essenciaImage ? (
              <div className="overflow-hidden aspect-[4/3]">
                <img
                  src={s.essenciaImage}
                  alt="Quero Mais â€” essência da marca"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[#F8F8F8] flex items-center justify-center">
                <span className="text-gray-300 text-sm">Imagem em breve</span>
              </div>
            )}

            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-qm-magenta font-sans">
                {s.essenciaTitle}
              </p>
              <h3 className="font-sans font-black text-2xl lg:text-3xl text-black uppercase leading-tight">
                {s.essenciaText1}
              </h3>
              <p className="text-[#666666] leading-relaxed font-sans text-sm">
                {s.essenciaText2}
              </p>
              {Array.isArray(s?.tags) && s.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {s.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-[#F2F2F2] text-[#4A4A4A] text-xs font-semibold uppercase tracking-wider font-sans">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}



