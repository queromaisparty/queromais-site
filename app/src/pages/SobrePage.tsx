import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';

export function SobrePage() {
  const { storytelling } = useData();
  const s = storytelling;

  const timeline = [...s.timeline].sort((a, b) => a.order - b.order);
  const stats = [...s.stats].sort((a, b) => a.order - b.order);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-white overflow-hidden">
      
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* BLOCO 1 — Hero */}
        <div className="text-center mt-8 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="font-black text-5xl sm:text-7xl lg:text-8xl text-black uppercase tracking-tighter leading-[0.9] mb-6">
            {s.heroTitle.split(' ').map((word, i, arr) =>
              i === arr.length - 1
                ? <span key={i} className="text-[#E91E8C]"> {word}</span>
                : word + ' '
            )}
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
            {s.heroTagline}
          </p>
        </div>

        {/* BLOCO 2 — Stats (oculto se vazio) */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {stats.map(stat => (
              <div key={stat.id} className="bg-[#F8F8F8] border border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center">
                <div className="text-4xl font-black text-black mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-[#4A4A4A] font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* BLOCO 3 — Origem e Propósito */}
        <div className="mb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E91E8C] mb-5 font-sans">
                Origem e Propósito
              </p>
              <h2 className="font-sans font-black text-black uppercase leading-tight tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                {s.origemTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">{s.origemText1}</p>
              <p className="text-gray-500 leading-relaxed text-sm">{s.origemText2}</p>
            </div>
            {s.origemImage ? (
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img src={s.origemImage} alt="Origem da Quero Mais" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[#F8F8F8] rounded-2xl flex items-center justify-center">
                <span className="text-gray-300 text-sm">Imagem em breve</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BLOCO 4 — Essência da Marca */}
      <section className="w-full bg-[#3D4246] py-20 mb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E91E8C] mb-5">
              {s.essenciaTitle}
            </p>
            <p className="text-white/90 text-lg leading-relaxed mb-4">{s.essenciaText1}</p>
            <div className="w-12 h-px bg-white/20 my-6" />
            <p className="text-white/60 leading-relaxed text-sm mb-8">{s.essenciaText2}</p>
            {s.essenciaImage && (
              <div className="mb-8 aspect-[16/7] overflow-hidden rounded-2xl">
                <img src={s.essenciaImage} alt="Essência da Quero Mais" className="w-full h-full object-cover" />
              </div>
            )}
            {s.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {s.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* BLOCO 5 — O Símbolo: A Borboleta */}
        <div className="mb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {s.simboloImage ? (
              <div className="aspect-square overflow-hidden rounded-3xl">
                <img src={s.simboloImage} alt="A borboleta — símbolo da Quero Mais" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-square bg-[#F8F8F8] rounded-3xl flex items-center justify-center">
                <span className="text-gray-300 text-sm">Imagem em breve</span>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E91E8C] mb-5">
                O Símbolo
              </p>
              <h2 className="font-sans font-black text-black uppercase leading-tight tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {s.simboloTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">{s.simboloText1}</p>
              <p className="text-gray-500 leading-relaxed text-sm">{s.simboloText2}</p>
            </div>
          </div>
        </div>

        {/* BLOCO 6 — Narrativa Contínua */}
        {timeline.length > 0 && (
          <div className="mb-24">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E91E8C] mb-3">
                {s.narrativaTitle}
              </p>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
                {s.narrativaIntro}
              </p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              <div className="absolute top-0 bottom-0 left-[15px] sm:left-1/2 w-px bg-gradient-to-b from-transparent via-[#E91E8C]/30 to-transparent sm:-translate-x-1/2" />

              <div className="space-y-12">
                {timeline.map((item, idx) => (
                  <div key={item.id}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-16 ${idx % 2 === 0 ? 'sm:flex-row-reverse sm:text-right' : ''}`}>
                    <div className="absolute left-[11px] sm:left-1/2 w-2 h-2 bg-[#E91E8C] rounded-full sm:-translate-x-1/2 shadow-[0_0_12px_rgba(233,30,140,0.5)]" />
                    <div className="flex-1 ml-10 sm:ml-0">
                      {item.year && (
                        <div className="text-3xl font-black text-gray-100 mb-1 leading-none">{item.year}</div>
                      )}
                      <h3 className="text-lg font-bold text-black mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex-1 hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BLOCO 7 — CTA Final */}
        <div className="text-center border-t border-gray-100 pt-16">
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">{s.ctaText}</p>
          <Link
            to={s.ctaButtonLink}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E91E8C] text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-[#D81B80] transition-colors"
          >
            {s.ctaButtonLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
