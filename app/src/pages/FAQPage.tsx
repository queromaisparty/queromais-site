import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export function FAQPage() {
  const { t } = useLanguage();
  const { faqs } = useData();
  const [openId, setOpenId] = useState<string | null>(null);

  const activeFaqs = faqs
    .filter(f => f.status === 'active')
    .sort((a, b) => a.order - b.order);

  // Group by category
  const categories = Array.from(new Set(activeFaqs.map(f => f.category).filter(Boolean)));
  const uncategorized = activeFaqs.filter(f => !f.category);

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  const FAQItem = ({ faq }: { faq: typeof faqs[0] }) => {
    const isOpen = openId === faq.id;
    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <button
          onClick={() => toggle(faq.id)}
          className="w-full flex items-center justify-between py-5 px-1 text-left group"
        >
          <span className={`text-base font-semibold transition-colors ${isOpen ? 'text-qm-magenta' : 'text-[#1A1A2E] group-hover:text-qm-magenta'}`}>
            {t(faq.question)}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-qm-magenta' : ''}`}
          />
        </button>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: isOpen ? '500px' : '0',
            opacity: isOpen ? 1 : 0,
          }}
        >
          <p className="pb-5 px-1 text-gray-600 text-sm leading-relaxed">
            {t(faq.answer)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <main className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FCE7F3] rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-qm-magenta" />
            <span className="text-qm-magenta text-sm font-bold uppercase tracking-wider">
              {t({ pt: 'Tire suas dúvidas', en: 'Get answers', es: 'Resuelve tus dudas' })}
            </span>
          </div>
          <h1 className="font-black text-4xl sm:text-5xl text-black uppercase tracking-tight mb-4">
            {t({ pt: 'Perguntas Frequentes', en: 'FAQ', es: 'Preguntas Frecuentes' })}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {t({
              pt: 'Encontre respostas para as perguntas mais comuns sobre nossos eventos, ingressos e muito mais.',
              en: 'Find answers to the most common questions about our events, tickets and more.',
              es: 'Encuentre respuestas a las preguntas más comunes sobre nuestros eventos, entradas y más.',
            })}
          </p>
        </div>

        {/* FAQ List */}
        {activeFaqs.length === 0 ? (
          <div className="text-center py-20">
            <HelpCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              {t({ pt: 'Em breve!', en: 'Coming soon!', es: '¡Próximamente!' })}
            </h3>
            <p className="text-gray-400 text-sm">
              {t({
                pt: 'Estamos preparando o conteúdo desta seção.',
                en: 'We are preparing the content for this section.',
                es: 'Estamos preparando el contenido de esta sección.',
              })}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Uncategorized FAQs */}
            {uncategorized.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                {uncategorized.map(faq => (
                  <FAQItem key={faq.id} faq={faq} />
                ))}
              </div>
            )}

            {/* Categorized FAQs */}
            {categories.map(category => {
              const categoryFaqs = activeFaqs.filter(f => f.category === category);
              return (
                <div key={category}>
                  <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-qm-magenta mb-4 px-1">
                    {category}
                  </h2>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    {categoryFaqs.map(faq => (
                      <FAQItem key={faq.id} faq={faq} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
