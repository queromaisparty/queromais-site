import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Mail, Phone, MessageSquare, Plus, Send } from 'lucide-react';
import { toast } from 'sonner';

export function ContactPage() {
  const { faqs, contactInfo, addContactMessage } = useData();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeFaqs = faqs.filter(f => f.status === 'active').sort((a, b) => a.order - b.order);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addContactMessage({
      ...formData,
      status: 'nova'
    });

    toast.success('Mensagem enviada com sucesso! Nossa equipe retornará em breve.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const getTitle = (content: string | { pt: string }) => typeof content === 'string' ? content : content?.pt || '';

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#F2F2F2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header de Atendimento */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 mb-16 text-center">
          <p className="text-qm-magenta text-sm font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
             <MessageSquare className="w-5 h-5" /> Atendimento Oficial
          </p>
          <h1 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tight leading-none mb-6">
            Fale com a <br className="sm:hidden" /> <span className="text-qm-magenta">Quero Mais</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Lado Esquerdo - FAQ */}
          <div className="lg:col-span-6">
             <div className="flex items-center gap-4 mb-8 border-b border-gray-300 pb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-none flex items-center justify-center shadow-sm">
                  <span className="text-qm-magenta font-black text-xl">?</span>
                </div>
                <h2 className="text-3xl font-black text-black uppercase tracking-tight">Dúvidas Frequentes</h2>
             </div>

             <div className="space-y-4">
               {activeFaqs.length === 0 ? (
                 <p className="text-gray-500">Nenhuma dúvida cadastrada no momento.</p>
               ) : (
                 activeFaqs.map((faq) => (
                   <div 
                     key={faq.id} 
                     className={`border ${openFaq === faq.id ? 'border-qm-magenta shadow-md' : 'border-gray-200 shadow-sm'} bg-white rounded-none overflow-hidden transition-all duration-300`}
                   >
                     <button 
                       onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                       className="w-full text-left px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-colors"
                     >
                       <h3 className={`font-bold sm:text-lg pr-4 ${openFaq === faq.id ? 'text-qm-magenta' : 'text-black'}`}>
                         {getTitle(faq.question)}
                       </h3>
                       <div className={`w-8 h-8 rounded-none border flex flex-col items-center justify-center shrink-0 transition-all duration-300 ${openFaq === faq.id ? 'bg-qm-magenta border-qm-magenta text-white rotate-45' : 'border-gray-300 text-gray-400 bg-gray-50'}`}>
                         <Plus className="w-4 h-4" />
                       </div>
                     </button>
                     
                     <div 
                       className={`overflow-hidden transition-all duration-500 ease-in-out bg-white ${openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                     >
                       <p className="px-6 pb-6 sm:px-8 sm:pb-8 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-100 pt-4 mt-2">
                         {getTitle(faq.answer)}
                       </p>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>

          {/* Lado Direito - Contatos Diretos e Formulário */}
          <div className="lg:col-span-6 space-y-8">
            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-8 hidden lg:block">Canais Diretos</h2>

            {/* Formulario */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-none p-8">
               <h3 className="text-xl font-bold text-black uppercase tracking-tight mb-6">Envie uma Mensagem</h3>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nome completo"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none text-black focus:outline-none focus:border-qm-magenta transition-colors"
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none text-black focus:outline-none focus:border-qm-magenta transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="WhatsApp / Telefone"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none text-black focus:outline-none focus:border-qm-magenta transition-colors"
                    />
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Assunto"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none text-black focus:outline-none focus:border-qm-magenta transition-colors"
                    />
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Sua mensagem detalhada..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none text-black focus:outline-none focus:border-qm-magenta transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-qm-magenta text-white font-bold uppercase tracking-wider rounded-none hover:bg-qm-magenta-dark transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Enviar Contato
                      </>
                    )}
                  </button>
               </form>
            </div>

            {/* Infos Adicionais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href={`https://wa.me/${contactInfo.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 p-6 rounded-none flex items-center gap-4 hover:border-qm-magenta transition-colors group">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-none flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">WhatsApp</p>
                  <p className="text-black font-semibold">{contactInfo.whatsapp}</p>
                </div>
              </a>
              
              <a href={`mailto:${contactInfo.email}`} className="bg-white border border-gray-200 p-6 rounded-none flex items-center gap-4 hover:border-qm-magenta transition-colors group">
                <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-none flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">E-mail Oficial</p>
                  <p className="text-black font-semibold truncate max-w-[140px]">{contactInfo.email}</p>
                </div>
              </a>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
