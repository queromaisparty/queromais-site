import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { MessageSquare, HelpCircle, Mail, Phone, MapPin, CheckCircle, Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import { ContactMessage, FAQ } from '@/types';

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

  const handleMessageStatus = (id: string, read: boolean) => {
    updateContactMessage(id, { read });
  };

  const handleSaveFaq = () => {
    if (!faqForm.question || !faqForm.answer) return;
    if (isEditingFaq && faqForm.id) {
      updateFAQ(faqForm.id, faqForm);
    } else {
      addFAQ({
        question: faqForm.question,
        answer: faqForm.answer,
        category: faqForm.category || 'Geral',
        order: faqForm.order || faqs.length + 1,
        status: faqForm.status || 'active'
      });
    }
    setFaqForm({});
    setIsEditingFaq(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Contato & FAQ</h2>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
          Gerencie mensagens recebidas, dúvidas frequentes e os dados oficiais de contato.
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b pb-4" style={{ borderColor: '#E8E8ED' }}>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'inbox' ? 'bg-[#E91E8C] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Caixa de Entrada</div>
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'faq' ? 'bg-[#E91E8C] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Gestão de FAQ</div>
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'info' ? 'bg-[#E91E8C] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> Dados Oficiais</div>
        </button>
      </div>

      {activeTab === 'inbox' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F9FAFB] border-b border-gray-200 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Remetente</th>
                <th className="px-6 py-4">Assunto</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contactMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhuma mensagem recebida.</td>
                </tr>
              ) : (
                [...contactMessages].reverse().map(msg => (
                  <tr key={msg.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {msg.read ? (
                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold">Lida</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#E91E8C] bg-[#E91E8C]/10 px-2 py-1 rounded-md text-xs font-bold">Nova</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-black">{msg.name}</p>
                      <p className="text-xs">{msg.email}</p>
                      {msg.phone && <p className="text-xs">{msg.phone}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-black">{msg.subject}</p>
                      <p className="text-xs truncate max-w-xs">{msg.message}</p>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <button onClick={() => handleMessageStatus(msg.id, !msg.read)} className="text-gray-400 hover:text-green-600" title="Marcar lido/não lido">
                        {msg.read ? <X className="w-5 h-5"/> : <CheckCircle className="w-5 h-5"/>}
                      </button>
                      <button onClick={() => deleteContactMessage(msg.id)} className="text-gray-400 hover:text-red-600" title="Excluir">
                        <Trash2 className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {faqs.map(faq => (
              <div key={faq.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-start gap-4 shadow-sm">
                <div className="flex-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${faq.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {faq.status}
                  </span>
                  <h4 className="font-bold text-black mt-1">{typeof faq.question === 'string' ? faq.question : faq.question?.pt}</h4>
                  <p className="text-sm text-gray-600 mt-1">{typeof faq.answer === 'string' ? faq.answer : faq.answer?.pt}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setFaqForm(faq); setIsEditingFaq(true); }} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#E91E8C] hover:text-white flex items-center justify-center text-gray-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteFAQ(faq.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white flex items-center justify-center text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 h-fit">
            <h3 className="font-bold text-lg mb-4 text-black">{isEditingFaq ? 'Editar FAQ' : 'Nova Pergunta'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Pergunta</label>
                <input
                  type="text"
                  value={typeof faqForm.question === 'string' ? faqForm.question : faqForm.question?.pt || ''}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:border-[#E91E8C] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Resposta</label>
                <textarea
                  rows={4}
                  value={typeof faqForm.answer === 'string' ? faqForm.answer : faqForm.answer?.pt || ''}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:border-[#E91E8C] focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Ordem de Exibição</label>
                <input
                  type="number"
                  value={faqForm.order || 0}
                  onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:border-[#E91E8C] focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveFaq}
                  className="flex-1 bg-[#E91E8C] text-white font-bold py-2 rounded-lg hover:bg-[#D81B80] transition-colors"
                >
                  Salvar
                </button>
                {isEditingFaq && (
                  <button onClick={() => { setFaqForm({}); setIsEditingFaq(false); }} className="px-4 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200">
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 max-w-xl">
          <h3 className="font-bold text-lg mb-6 text-black">Informações Oficiais</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Mail className="w-3 h-3"/> E-mail</label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => updateContactInfo({ email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black mt-1 focus:border-[#E91E8C] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Phone className="w-3 h-3"/> WhatsApp</label>
              <input
                type="text"
                value={contactInfo.whatsapp}
                onChange={(e) => updateContactInfo({ whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black mt-1 focus:border-[#E91E8C] focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-4">* As alterações são salvas automaticamente no banco de dados.</p>
          </div>
        </div>
      )}

    </div>
  );
}
