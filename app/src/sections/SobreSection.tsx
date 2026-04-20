import { useLanguage } from '@/context/LanguageContext';

export function SobreSection() {
  const { t } = useLanguage();

  const stats = [
    { value: '5+', label: { pt: 'Anos de história', en: 'Years of history', es: 'Años de historia' } },
    { value: '50+', label: { pt: 'Eventos realizados', en: 'Events held', es: 'Eventos realizados' } },
    { value: '100k+', label: { pt: 'Pessoas impactadas', en: 'People impacted', es: 'Personas impactadas' } },
    { value: '#1', label: { pt: 'Experiência em SC', en: 'Experience in SC', es: 'Experiencia en SC' } },
  ];

  return (
    <section id="sobre" className="bg-white">

      {/* ── BLOCO CARVÃO — estilo GV ── */}
      <div className="bg-[#3D4246] py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Esquerda: Texto grande uppercase */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6ABD45] mb-6 font-sans">
                {t({ pt: 'Quem somos', en: 'Who we are', es: 'Quiénes somos' })}
              </p>
              <h2 className="font-display font-black text-white uppercase leading-none tracking-tight"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                {t({
                  pt: 'A QUERO MAIS SACUDIU AS BASES DA MÚSICA ELETRÔNICA EM SC.',
                  en: 'QUERO MAIS SHOOK THE FOUNDATIONS OF ELECTRONIC MUSIC IN SC.',
                  es: 'QUERO MAIS SACUDIÓ LAS BASES DE LA MÚSICA ELECTRÓNICA EN SC.',
                })}
              </h2>
            </div>

            {/* Direita: Parágrafo + linha separadora + chamada verde */}
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed text-base lg:text-lg font-sans">
                {t({
                  pt: 'Com anos de história e uma trajetória construída em eventos que marcaram gerações, a QUERO MAIS ocupa sua própria categoria no universo do entretenimento premium.',
                  en: 'With years of history and a trajectory built on events that marked generations, QUERO MAIS occupies its own category in the universe of premium entertainment.',
                  es: 'Con años de historia y una trayectoria construida en eventos que marcaron generaciones, QUERO MAIS ocupa su propia categoría en el universo del entretenimiento premium.',
                })}
              </p>

              <div className="w-12 h-px bg-white/30" />

              <p className="text-white/60 leading-relaxed text-sm font-sans">
                {t({
                  pt: 'Cada edição é pensada ao milímetro para entregar uma experiência que vai além da festa — é música, atmosfera, comunidade e memória.',
                  en: 'Each edition is planned to the millimeter to deliver an experience that goes beyond the party — it\'s music, atmosphere, community and memory.',
                  es: 'Cada edición se planifica al milímetro para ofrecer una experiencia que va más allá de la fiesta — es música, atmósfera, comunidad y memoria.',
                })}
              </p>

              <p className="text-[#6ABD45] font-display font-bold uppercase tracking-wide text-sm">
                {t({
                  pt: 'E segue como referência absoluta.',
                  en: 'And continues as an absolute reference.',
                  es: 'Y sigue siendo una referencia absoluta.',
                })}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ── BLOCO BRANCO — Manifesto + Stats ── */}
      <div className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display font-black text-4xl lg:text-5xl text-black mb-2">{stat.value}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#666666] font-sans">
                  {t(stat.label)}
                </p>
              </div>
            ))}
          </div>

          {/* Foto + missão */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1571266028243-d220c13c7d0e?w=800&q=85"
                alt="Quero Mais — Nossa história"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6ABD45] font-sans">
                {t({ pt: 'Nossa missão', en: 'Our mission', es: 'Nuestra misión' })}
              </p>
              <h3 className="font-display font-black text-3xl lg:text-4xl text-black uppercase leading-tight">
                {t({
                  pt: 'Criar experiências que as pessoas carregam para sempre.',
                  en: 'Create experiences people carry forever.',
                  es: 'Crear experiencias que las personas llevan para siempre.',
                })}
              </h3>
              <p className="text-[#666666] leading-relaxed font-sans">
                {t({
                  pt: 'Acreditamos que um bom evento não é só músicas boas — é ambiente, cuidado com cada detalhe, segurança, conforto e uma energia que ninguém consegue reproduzir em casa.',
                  en: 'We believe a great event is not just good music — it\'s atmosphere, care for every detail, safety, comfort and an energy no one can reproduce at home.',
                  es: 'Creemos que un buen evento no es solo buena música — es ambiente, cuidado en cada detalle, seguridad, confort y una energía que nadie puede reproducir en casa.',
                })}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {['Música', 'Experiência', 'Comunidade', 'Memória'].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-[#F2F2F2] text-[#4A4A4A] text-xs font-semibold uppercase tracking-wider rounded-full font-sans">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
