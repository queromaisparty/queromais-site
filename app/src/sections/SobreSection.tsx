import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';

export function SobreSection() {
  const { storytelling } = useData();
  const s = storytelling;
  const stats = [...s.stats].sort((a, b) => a.order - b.order);

  return (
    <section id="sobre" className="bg-white">

      {/* Bloco escuro — resumo institucional */}
      <div className="bg-[#3D4246] py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-qm-magenta mb-6 font-sans">
                Quem somos
              </p>
              <h2 className="font-sans font-black text-white uppercase leading-none tracking-tight"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
                {s.homeTitle}
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-white/80 leading-relaxed text-base lg:text-lg font-sans">
                {s.homeText1}
              </p>
              <div className="w-12 h-px bg-white/30" />
              <p className="text-white/60 leading-relaxed text-sm font-sans">
                {s.homeText2}
              </p>
              <Link
                to="/sobre"
                className="inline-block text-qm-magenta font-sans font-bold uppercase tracking-wide text-sm hover:underline"
              >
                {s.homeCTA} →
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Bloco branco — stats + essência */}
      <div className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Stats — só renderiza se houver dados */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {stats.map(stat => (
                <div key={stat.id} className="text-center">
                  <p className="font-sans font-black text-4xl lg:text-5xl text-black mb-2">{stat.value}</p>
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
                  alt="Quero Mais — essência da marca"
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
              {s.tags.length > 0 && (
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
