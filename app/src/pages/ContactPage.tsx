import { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Plus, ExternalLink, GlassWater, Landmark } from 'lucide-react';

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Como faço para reservar um camarote ou bistrô?",
      a: "Todas as reservas de espaços VIP (Camarotes, Lounges e Bistrôs) são feitas exclusivamente através do nosso Concierge via WhatsApp. O mapa de disponibilidade é atualizado em tempo real com nossa equipe de vendas."
    },
    {
      q: "Qual é a classificação indicativa dos eventos?",
      a: "Via de regra, todos os eventos da Quero Mais são dedicados estritamente para maiores de 18 anos. É obrigatória a apresentação de documento oficial de identidade (RG, CNH, Passaporte) com foto atualizada na portaria."
    },
    {
      q: "Existe dress-code para entrar na festa?",
      a: "Temos um dress code estilo 'smart clubbing'. Não é permitida a entrada com chinelos, camisas de time (nacional ou internacional), regatas masculinas, correntes grossas ou trajes de banho. Priorize o conforto com elegância."
    },
    {
      q: "Comprei meu ingresso de terceiros, tem problema?",
      a: "A Quero Mais não se responsabiliza por ingressos adquiridos fora das nossas plataformas oficiais (Sympla ou Bilheteria Digital). O uso de ingressos falsos caracteriza crime e resultará em bloqueio na portaria."
    },
    {
      q: "Esqueci um pertence na última edição. Com quem falo?",
      a: "Nosso setor de Achados e Perdidos funciona às terças e quartas-feiras, das 14h às 18h, no mesmo local do evento. Você também pode enviar um e-mail descrevendo o objeto para achados@queromais.com.br."
    }
  ];

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#F2F2F2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header de Atendimento */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 mb-16 text-center">
          <p className="text-[#E91E8C] text-sm font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
             <MessageSquare className="w-5 h-5" /> Concierge & Suporte
          </p>
          <h1 className="font-sans font-black text-5xl sm:text-6xl text-black uppercase tracking-tight leading-none mb-6">
            Como Podemos <br className="sm:hidden" /> <span className="text-[#E91E8C]">Ajudar?</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Lado Esquerdo - FAQ */}
          <div className="lg:col-span-7">
             <div className="flex items-center gap-4 mb-8 border-b border-gray-300 pb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-[#E91E8C] font-black text-xl">?</span>
                </div>
                <h2 className="text-3xl font-black text-black uppercase tracking-tight">Dúvidas Frequentes</h2>
             </div>

             <div className="space-y-4">
               {faqs.map((faq, index) => (
                 <div 
                   key={index} 
                   className={`border ${openFaq === index ? 'border-[#E91E8C] shadow-md' : 'border-gray-200 shadow-sm'} bg-white rounded-2xl overflow-hidden transition-all duration-300`}
                 >
                   <button 
                     onClick={() => setOpenFaq(openFaq === index ? null : index)}
                     className="w-full text-left px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-colors"
                   >
                     <h3 className={`font-bold sm:text-lg pr-4 ${openFaq === index ? 'text-[#E91E8C]' : 'text-black'}`}>
                       {faq.q}
                     </h3>
                     <div className={`w-8 h-8 rounded-full border flex flex-col items-center justify-center shrink-0 transition-all duration-300 ${openFaq === index ? 'bg-[#E91E8C] border-[#E91E8C] text-white rotate-45' : 'border-gray-300 text-gray-400 bg-gray-50'}`}>
                       <Plus className="w-4 h-4" />
                     </div>
                   </button>
                   
                   <div 
                     className={`overflow-hidden transition-all duration-500 ease-in-out bg-white ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                   >
                     <p className="px-6 pb-6 sm:px-8 sm:pb-8 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-100 pt-4 mt-2">
                       {faq.a}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
               <div>
                  <h4 className="text-black font-bold mb-1">Ainda com dúvida?</h4>
                  <p className="text-sm text-gray-500">Nosso time de bilheteria tenta responder em até 2hrs úteis.</p>
               </div>
               <button className="bg-[#4A4A4A] hover:bg-black text-white font-bold uppercase text-xs tracking-wider px-6 py-3 rounded-xl transition-colors shrink-0 shadow-md">
                  Abrir Ticket
               </button>
             </div>
          </div>

          {/* Lado Direito - Contatos Diretos Segmentados */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-8">Setores</h2>

            {/* Setor: VIP */}
            <div className="relative group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm p-8 hover:border-[#E91E8C]/50 hover:shadow-lg transition-all">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-[#E91E8C]">
                  <GlassWater className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#E91E8C]/10 rounded-xl flex items-center justify-center mb-6">
                    <Phone className="w-6 h-6 text-[#E91E8C]" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#E91E8C] mb-1">Privates & Lounges</div>
                  <h3 className="text-2xl font-bold text-black mb-4">Concierge VIP</h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-[280px]">
                    Atendimento exclusivo para reserva de Camarotes, Backstage e Bistrôs.
                  </p>
                  <a href="#" className="inline-flex items-center gap-2 text-white font-bold text-sm bg-black hover:bg-[#E91E8C] px-6 py-3 rounded-xl transition-colors shadow-md">
                    Falar no WhatsApp <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
               </div>
            </div>

            {/* Setor: Imprensa / Comercial */}
            <div className="relative group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm p-8 hover:shadow-lg transition-all">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-[#4A4A4A]">
                  <Landmark className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Corporate</div>
                  <h3 className="text-2xl font-bold text-black mb-4">Imprensa & Parcerias</h3>
                  <p className="text-sm text-gray-600 mb-6 max-w-[280px]">
                    Contato para credenciamento de mídia, patrocínios e propostas comerciais.
                  </p>
                  <a href="mailto:contato@queromais.com.br" className="inline-flex items-center gap-2 text-white font-bold text-sm bg-[#4A4A4A] hover:bg-black px-6 py-3 rounded-xl transition-colors shadow-md">
                    contato@queromais.com.br
                  </a>
               </div>
            </div>

            {/* Localização Mini-mapa (Visual apenas) */}
            <div className="rounded-3xl border border-gray-200 overflow-hidden relative aspect-[21/9] lg:aspect-auto lg:h-48 group shadow-sm bg-white">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Localização" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale group-hover:grayscale-0" />
               <div className="absolute inset-0 bg-white/60 backdrop-blur-sm group-hover:backdrop-blur-0 duration-500 transition-all" />
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-black group-hover:text-white transition-colors duration-500">
                  <div className="bg-white/80 p-3 rounded-full backdrop-blur-md mb-2 shadow-lg">
                    <MapPin className="w-6 h-6 text-[#E91E8C]" />
                  </div>
                  <div className="bg-white/90 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                    <h4 className="font-bold uppercase tracking-wider text-sm mb-0.5">Sede Oficial</h4>
                    <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest">Avenida Principal, 1000 - SP</p>
                  </div>
               </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
