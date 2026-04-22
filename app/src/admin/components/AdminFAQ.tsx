import { useState } from 'react';
import { useData } from '@/context/DataContext';
import type { FAQ } from '@/types';
import { Plus, Trash2, Save, ChevronUp, ChevronDown, Edit2, X, HelpCircle } from 'lucide-react';

const CATEGORIES = ['Geral', 'Eventos', 'Ingressos', 'Loja', 'Fica Mais', 'Contato'];

export function AdminFAQ() {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [questionPt, setQuestionPt] = useState('');
  const [questionEn, setQuestionEn] = useState('');
  const [questionEs, setQuestionEs] = useState('');
  const [answerPt, setAnswerPt] = useState('');
  const [answerEn, setAnswerEn] = useState('');
  const [answerEs, setAnswerEs] = useState('');
  const [category, setCategory] = useState('Geral');
  const [order, setOrder] = useState(faqs.length + 1);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const resetForm = () => {
    setQuestionPt(''); setQuestionEn(''); setQuestionEs('');
    setAnswerPt(''); setAnswerEn(''); setAnswerEs('');
    setCategory('Geral');
    setOrder(faqs.length + 1);
    setStatus('active');
    setEditingId(null);
    setShowForm(false);
  };

  const editFaq = (faq: FAQ) => {
    setEditingId(faq.id);
    setQuestionPt(faq.question.pt || '');
    setQuestionEn(faq.question.en || '');
    setQuestionEs(faq.question.es || '');
    setAnswerPt(faq.answer.pt || '');
    setAnswerEn(faq.answer.en || '');
    setAnswerEs(faq.answer.es || '');
    setCategory(faq.category || 'Geral');
    setOrder(faq.order);
    setStatus(faq.status);
    setShowForm(true);
  };

  const handleSave = () => {
    const data = {
      question: { pt: questionPt, en: questionEn, es: questionEs },
      answer: { pt: answerPt, en: answerEn, es: answerEs },
      category,
      order,
      status,
    };

    if (editingId) {
      updateFAQ(editingId, data);
    } else {
      addFAQ(data);
    }
    resetForm();
  };

  const sortedFaqs = [...faqs].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Perguntas Frequentes (FAQ)</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Gerencie as centrais de ajuda exibidas no site para tirar dúvidas dos clientes.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-admin-accent hover:brightness-110 text-white font-semibold shadow-sm transition-all active:scale-[0.98] whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Nova Pergunta
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-admin-accent" />
              {editingId ? 'Editando Pergunta' : 'Criar Nova Pergunta'}
            </h3>
            <button onClick={resetForm} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Question */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-admin-accent uppercase tracking-wider mb-2">Pergunta</h4>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">🇧🇷 Português</label>
                <input className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/50 transition-all text-sm font-medium" value={questionPt} onChange={e => setQuestionPt(e.target.value)} placeholder="Como comprar ingressos?" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">🇺🇸 English</label>
                <input className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/50 transition-all text-sm font-medium" value={questionEn} onChange={e => setQuestionEn(e.target.value)} placeholder="How to buy tickets?" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">🇪🇸 Español</label>
                <input className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/50 transition-all text-sm font-medium" value={questionEs} onChange={e => setQuestionEs(e.target.value)} placeholder="¿Cómo comprar entradas?" />
              </div>
            </div>

            {/* Answer */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-admin-accent uppercase tracking-wider mb-2">Resposta</h4>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">🇧🇷 Português</label>
                <textarea className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/50 transition-all text-sm resize-none" rows={3} value={answerPt} onChange={e => setAnswerPt(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">🇺🇸 English</label>
                <textarea className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/50 transition-all text-sm resize-none" rows={2} value={answerEn} onChange={e => setAnswerEn(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">🇪🇸 Español</label>
                <textarea className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/50 transition-all text-sm resize-none" rows={2} value={answerEs} onChange={e => setAnswerEs(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Categoria</label>
              <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-admin-accent text-sm font-semibold" value={category} onChange={e => setCategory(e.target.value)} title="Categoria da pergunta">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Ordem Exibição</label>
              <input type="number" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-admin-accent text-sm font-semibold" value={order} onChange={e => setOrder(Number(e.target.value))} min={1} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status Visibilidade</label>
              <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-admin-accent text-sm font-semibold" value={status} onChange={e => setStatus(e.target.value as 'active' | 'inactive')} title="Status da pergunta">
                <option value="active">Ativo (Visível)</option>
                <option value="inactive">Inativo (Oculto)</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleSave}
              disabled={!questionPt.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-admin-accent hover:brightness-110 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Salvar Edição' : 'Publicar Pergunta'}
            </button>
            <button
              onClick={resetForm}
              className="px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {sortedFaqs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center shadow-sm">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 font-bold mb-1">Central de Ajuda Vazia</h3>
          <p className="text-sm text-slate-500">Nenhuma pergunta cadastrada. Clique em "Nova Pergunta" para começar a ajudar seus clientes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedFaqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col gap-1 items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                <button
                  onClick={() => {
                    if (idx === 0) return;
                    updateFAQ(faq.id, { order: faq.order - 1 });
                    const prev = sortedFaqs[idx - 1];
                    updateFAQ(prev.id, { order: prev.order + 1 });
                  }}
                  className={`p-1 rounded transition-colors ${idx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:bg-white hover:text-admin-accent hover:shadow-sm'}`}
                  disabled={idx === 0}
                  title="Subir posição"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <div className="text-[10px] font-bold text-slate-400">{faq.order}</div>
                <button
                  onClick={() => {
                    if (idx === sortedFaqs.length - 1) return;
                    updateFAQ(faq.id, { order: faq.order + 1 });
                    const next = sortedFaqs[idx + 1];
                    updateFAQ(next.id, { order: next.order - 1 });
                  }}
                  className={`p-1 rounded transition-colors ${idx === sortedFaqs.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:bg-white hover:text-admin-accent hover:shadow-sm'}`}
                  disabled={idx === sortedFaqs.length - 1}
                  title="Descer posição"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-w-0 py-1">
                <p className="text-lg font-bold text-slate-900 truncate leading-tight">{faq.question.pt || faq.question.en}</p>
                <p className="text-sm text-slate-500 line-clamp-1 mt-1 leading-relaxed">{faq.answer.pt || faq.answer.en}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border ${faq.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {faq.status === 'active' ? 'Ativo' : 'Oculto'}
                  </span>
                  {faq.category && (
                    <span className="text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-pink-50 text-admin-accent border border-pink-100">
                      {faq.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => editFaq(faq)}
                  className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-white hover:text-admin-accent hover:border-admin-accent transition-all shadow-sm"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm('Tem certeza que deseja remover esta pergunta?')) deleteFAQ(faq.id); }}
                  className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Excluir Definitivamente"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
