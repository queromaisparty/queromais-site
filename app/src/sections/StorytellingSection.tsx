import { BookOpen, Target, Heart, Star, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';

export function StorytellingSection() {
  const { t } = useLanguage();
  const { storytelling } = useData();

  const values = [
    {
      icon: Heart,
      title: { pt: 'Paixão', en: 'Passion', es: 'Pasión' },
      description: {
        pt: 'Fazemos tudo com amor e dedicação.',
        en: 'We do everything with love and dedication.',
        es: 'Hacemos todo con amor y dedicación.'
      }
    },
    {
      icon: Star,
      title: { pt: 'Excelência', en: 'Excellence', es: 'Excelencia' },
      description: {
        pt: 'Buscamos sempre o melhor em cada detalhe.',
        en: 'We always seek the best in every detail.',
        es: 'Buscamos siempre lo mejor en cada detalle.'
      }
    },
    {
      icon: Users,
      title: { pt: 'Comunidade', en: 'Community', es: 'Comunidad' },
      description: {
        pt: 'Criamos conexões verdadeiras entre pessoas.',
        en: 'We create true connections between people.',
        es: 'Creamos conexiones verdaderas entre personas.'
      }
    }
  ];

  return (
    <section id="storytelling" className="py-20 lg:py-32 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CCFF00]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-[#CCFF00] text-sm font-bold uppercase tracking-wider">
                {t({ pt: 'Nossa História', en: 'Our Story', es: 'Nuestra Historia' })}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
              {t(translations.storytelling.title)}
            </h2>
          </div>

          {/* History Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold text-white mb-6">
                {t({ pt: 'Como Tudo Começou', en: 'How It All Started', es: 'Cómo Todo Comenzó' })}
              </h3>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  {storytelling?.history?.pt || t({
                    pt: 'A Quero Mais nasceu de um sonho: criar experiências que fossem além da festa comum. Fundada em 2018 por um grupo de amigos apaixonados por música e entretenimento, começamos com pequenos eventos em São Paulo.',
                    en: 'Quero Mais was born from a dream: to create experiences that went beyond the common party. Founded in 2018 by a group of friends passionate about music and entertainment, we started with small events in São Paulo.',
                    es: 'Quero Más nació de un sueño: crear experiencias que fueran más allá de la fiesta común. Fundada en 2018 por un grupo de amigos apasionados por la música y el entretenimiento, comenzamos con pequeños eventos en São Paulo.'
                  })}
                </p>
                <p>
                  {t({
                    pt: 'Com o tempo, nossa comunidade cresceu e nossos eventos se tornaram referência na cena noturna. Hoje, a Quero Mais é sinônimo de qualidade, energia e momentos inesquecíveis.',
                    en: 'Over time, our community grew and our events became a reference in the nightlife scene. Today, Quero Mais is synonymous with quality, energy and unforgettable moments.',
                    es: 'Con el tiempo, nuestra comunidad creció y nuestros eventos se convirtieron en referencia en la escena nocturna. Hoy, Quero Más es sinónimo de calidad, energía y momentos inolvidables.'
                  })}
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                  {storytelling?.images?.[0] ? (
                    <img
                      src={storytelling.images[0]}
                      alt="Nossa História"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                      <BookOpen className="w-20 h-20 text-white/20" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#CCFF00] text-black px-6 py-3 rounded-xl font-bold">
                  2018 - {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {/* Mission */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#CCFF00] rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {t(translations.storytelling.mission)}
                </h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                {storytelling?.mission?.pt || t({
                  pt: 'Criar experiências únicas que conectem pessoas através da música, da energia e de momentos inesquecíveis. Queremos que cada evento seja uma memória para toda a vida.',
                  en: 'Create unique experiences that connect people through music, energy and unforgettable moments. We want every event to be a memory for a lifetime.',
                  es: 'Crear experiencias únicas que conecten personas a través de la música, la energía y momentos inolvidables. Queremos que cada evento sea un recuerdo para toda la vida.'
                })}
              </p>
            </div>

            {/* Values */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#8B5CF6] rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {t(translations.storytelling.values)}
                </h3>
              </div>
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <value.icon className="w-5 h-5 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-bold">{t(value.title)}:</span>
                      <span className="text-white/70 ml-2">{t(value.description)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Founder Section */}
          {storytelling?.founder && (
            <div className="bg-gradient-to-r from-[#CCFF00]/10 to-[#8B5CF6]/10 border border-white/10 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#CCFF00]">
                    {storytelling.founder.image ? (
                      <img
                        src={storytelling.founder.image}
                        alt={storytelling.founder.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <Users className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 text-center md:text-left">
                  <p className="text-[#CCFF00] text-sm font-bold uppercase tracking-wider mb-2">
                    {t(translations.storytelling.founder)}
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {storytelling.founder.name}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {t(storytelling.founder.bio)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
