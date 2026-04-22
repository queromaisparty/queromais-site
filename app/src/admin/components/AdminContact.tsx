import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { MessageSquare, HelpCircle, Mail, Phone, CheckCircle, Trash2, Edit2, X } from 'lucide-react';
import type { FAQ } from '@/types';

type Tab = 'inbox' | 'faq' | 'info';

export function AdminContact() {
  const { 
    contactMessages, updateContactMessage, deleteContactMessage,
    faqs, addFAQ, updateFAQ, deleteFAQ,
    contactInfo, updateContactInfo
  } = useData();

  const [activeTab, setActiveTab] = useState<Tab>('inbox');

  const [faqForm, setFaqForm] = useState<Partial<FAQ>>({});
  const [isEditingFaq, setIsEditingFaq] = useState(false);

  const handleMessageStatus = (id: string, status: 'nova' | 'lida' | 'respondida' | 'arquivada') => {
    updateContactMessage(id, { status });
  };

  const handleSaveFaq = () => {
    if (!faqForm.question || !faqForm.answer) return;
    if (isEditingFaq && faqForm.id) {
      updateFAQ(faqForm.id, faqForm);
    } else {
      addFAQ({
        question: typeof faqForm.question === 'string' ? { pt: faqForm.question, en: faqForm.question, es: faqForm.question } : faqForm.question!,
        answer: typeof faqForm.answer === 'string' ? { pt: faqForm.answer, en: faqForm.answer, es: faqForm.answer } : faqForm.answer!,
        category: faqForm.category || 'Geral',
        order: faqForm.order || faqs.length + 1,
        status: faqForm.status || 'active'
      });
    }
    setFaqForm({});
    setIsEditingFaq(false);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Contato & FAQ</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1">
          Gerencie mensagens recebidas, dúvidas frequentes da comunidade e contatos oficiais.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit mb-8 shadow-sm">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'inbox' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Caixa de Entrada
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'faq' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Gestão de FAQ
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'info' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <Mail className="w-4 h-4" /> Dados Oficiais
        </button>
      </div>

      {/* INBOX SECTION */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Remetente</th>
                  <th className="px-6 py-4">Assunto & Mensagem</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contactMessages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Nenhuma mensagem recebida ainda.</td>
                  </tr>
                ) : (
                  [...contactMessages].reverse().map(msg => (
                    <tr key={msg.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        {msg.status === 'lida' || msg.status === 'respondida' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">Lida</span>
                        ) : msg.status === 'arquivada' ? (
                          <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">Arquivada</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-admin-accent bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm">Nova</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{msg.name}</p>
                        <p className="text-xs text-slate-500">{msg.email}</p>
                        {msg.phone && <p className="text-xs text-slate-400">{msg.phone}</p>}
                      </td>
                      <td className="px-6 py-4 min-w-[300px]">
                        <p className="font-semibold text-slate-900">{msg.subject}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{msg.message}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleMessageStatus(msg.id, msg.status === 'nova' ? 'lida' : 'nova')} 
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                            title={msg.status === 'nova' ? "Marcar como lida" : "Marcar como não lida"}
                          >
                            {msg.status !== 'nova' ? <X className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                          </button>
                          <button 
                            onClick={() => deleteContactMessage(msg.id)} 
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQ SECTION */}
      {activeTab === 'faq' && (
        <div className="grid xl:grid-cols-3 gap-8 items-start">
          
          <div className="xl:col-span-2 space-y-4">
            {faqs.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 font-semibold mb-1">Nenhuma FAQ cadastrada</h3>
                <p className="text-slate-500 text-sm">Adicione perguntas frequentes para ajudar seus usuários.</p>
              </div>
            ) : (
              faqs.map(faq => (
                <div key={faq.id} className="bg-white p-6 rounded-xl border border-slate-200 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex-1">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md border tracking-wider ${faq.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {faq.status === 'active' ? 'Ativa' : 'Inativa'}
                    </span>
                    <h4 className="font-bold text-slate-900 mt-3 text-lg leading-tight">{typeof faq.question === 'string' ? faq.question : faq.question?.pt}</h4>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{typeof faq.answer === 'string' ? faq.answer : faq.answer?.pt}</p>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setFaqForm(faq); setIsEditingFaq(true); }} 
                      className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 hover:border-admin-accent hover:text-admin-accent flex items-center justify-center text-slate-400 transition-all shadow-sm"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteFAQ(faq.id)} 
                      className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white flex items-center justify-center text-red-500 transition-all shadow-sm" 
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-6 text-slate-900 border-b border-slate-100 pb-4">
              {isEditingFaq ? 'Editar Pergunta' : 'Criar Nova Pergunta'}
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pergunta</label>
                <input
                  type="text"
                  placeholder="Escreva a pergunta..."
                  value={typeof faqForm.question === 'string' ? faqForm.question : faqForm.question?.pt || ''}
                  onChange={(e) => setFaqForm({ 
                    ...faqForm, 
                    question: { 
                      pt: e.target.value, 
                      en: typeof faqForm.question === 'object' ? faqForm.question?.en || e.target.value : e.target.value,
                      es: typeof faqForm.question === 'object' ? faqForm.question?.es || e.target.value : e.target.value
                    } 
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Resposta</label>
                <textarea
                  rows={4}
                  placeholder="Escreva a resposta detalhada..."
                  value={typeof faqForm.answer === 'string' ? faqForm.answer : faqForm.answer?.pt || ''}
                  onChange={(e) => setFaqForm({ 
                    ...faqForm, 
                    answer: { 
                      pt: e.target.value, 
                      en: typeof faqForm.answer === 'object' ? faqForm.answer?.en || e.target.value : e.target.value,
                      es: typeof faqForm.answer === 'object' ? faqForm.answer?.es || e.target.value : e.target.value
                    } 
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all resize-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ordem de Exibição / Prioridade</label>
                <input
                  type="number"
                  value={faqForm.order || 0}
                  onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all"
                />
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={handleSaveFaq}
                  className="flex-1 bg-admin-accent text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all shadow-sm active:scale-[0.98]"
                >
                  {isEditingFaq ? 'Atualizar FAQ' : 'Salvar FAQ'}
                </button>
                {isEditingFaq && (
                  <button 
                    onClick={() => { setFaqForm({}); setIsEditingFaq(false); }} 
                    className="px-6 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-all"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INFO MÓDULO */}
      {activeTab === 'info' && (
        <div className="bg-white p-6 md:p-10 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h3 className="font-bold text-xl text-slate-900">Informações Oficiais</h3>
            <p className="text-sm text-slate-500 mt-1">Dados de contato que aparecem no rodapé e páginas públicas.</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> E-mail de Suporte</label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => updateContactInfo({ email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all"
                placeholder="contato@queromaisparty.com.br"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> WhatsApp Atendimento</label>
              <input
                type="text"
                value={contactInfo.whatsapp}
                onChange={(e) => updateContactInfo({ whatsapp: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all"
                placeholder="Ex: 5521999999999"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Instagram (Arroba)</label>
              <input
                type="text"
                value={contactInfo.instagram}
                onChange={(e) => updateContactInfo({ instagram: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all"
                placeholder="@queromaisparty"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cidade / Endereço Visível</label>
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => updateContactInfo({ address: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all"
                placeholder="RIO DE JANEIRO - RJ"
              />
            </div>
            
            <div className="pt-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex gap-3 text-blue-700 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p>As alterações nestes campos são salvas <strong>automaticamente</strong> no banco de dados e entram no ar na mesma hora.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
