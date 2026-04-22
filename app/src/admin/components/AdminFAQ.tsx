import { useState } from 'react';
import { useData } from '@/context/DataContext';
import type { FAQ } from '@/types';
import { Plus, Trash2, Save, ChevronUp, ChevronDown, Edit2, X } from 'lucide-react';

const fieldStyle = {
  input: 'w-full px-3 py-2 rounded-lg border border-[#E8E8ED] text-sm text-[#1A1A2E] focus:outline-none focus:border-[#E91E8C] transition-colors',
  textarea: 'w-full px-3 py-2 rounded-lg border border-[#E8E8ED] text-sm text-[#1A1A2E] focus:outline-none focus:border-[#E91E8C] transition-colors resize-none',
  label: 'block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1',
};

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
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>FAQ</h2>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            Gerencie as perguntas frequentes exibidas na página /faq.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: '#E91E8C' }}
        >
          <Plus className="w-4 h-4" /> Nova Pergunta
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-[#E8E8ED] bg-white p-6 mb-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#1A1A2E]">
              {editingId ? 'Editar Pergunta' : 'Nova Pergunta'}
            </h3>
            <button onClick={resetForm} className="p-1 text-[#9CA3AF] hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Question */}
          <div className="rounded-lg border border-[#E8E8ED] p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase">Pergunta</h4>
            <div>
              <label className={fieldStyle.label}>Português</label>
              <input className={fieldStyle.input} value={questionPt} onChange={e => setQuestionPt(e.target.value)} placeholder="Como comprar ingressos?" />
            </div>
            <div>
              <label className={fieldStyle.label}>English</label>
              <input className={fieldStyle.input} value={questionEn} onChange={e => setQuestionEn(e.target.value)} placeholder="How to buy tickets?" />
            </div>
            <div>
              <label className={fieldStyle.label}>Español</label>
              <input className={fieldStyle.input} value={questionEs} onChange={e => setQuestionEs(e.target.value)} placeholder="¿Cómo comprar entradas?" />
            </div>
          </div>

          {/* Answer */}
          <div className="rounded-lg border border-[#E8E8ED] p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase">Resposta</h4>
            <div>
              <label className={fieldStyle.label}>Português</label>
              <textarea className={fieldStyle.textarea} rows={3} value={answerPt} onChange={e => setAnswerPt(e.target.value)} />
            </div>
            <div>
              <label className={fieldStyle.label}>English</label>
              <textarea className={fieldStyle.textarea} rows={3} value={answerEn} onChange={e => setAnswerEn(e.target.value)} />
            </div>
            <div>
              <label className={fieldStyle.label}>Español</label>
              <textarea className={fieldStyle.textarea} rows={3} value={answerEs} onChange={e => setAnswerEs(e.target.value)} />
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={fieldStyle.label}>Categoria</label>
              <select className={fieldStyle.input} value={category} onChange={e => setCategory(e.target.value)} title="Categoria da pergunta">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={fieldStyle.label}>Ordem</label>
              <input type="number" className={fieldStyle.input} value={order} onChange={e => setOrder(Number(e.target.value))} min={1} />
            </div>
            <div>
              <label className={fieldStyle.label}>Status</label>
              <select className={fieldStyle.input} value={status} onChange={e => setStatus(e.target.value as 'active' | 'inactive')} title="Status da pergunta">
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!questionPt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ background: '#E91E8C' }}
          >
            <Save className="w-4 h-4" />
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      )}

      {/* Lista */}
      {sortedFaqs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8E8ED] p-12 text-center text-sm text-[#9CA3AF]">
          Nenhuma pergunta cadastrada. Clique em "Nova Pergunta" para começar.
        </div>
      ) : (
        <div className="space-y-2">
          {sortedFaqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="rounded-xl border border-[#E8E8ED] bg-white p-4 flex items-center gap-4"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    if (idx === 0) return;
                    updateFAQ(faq.id, { order: faq.order - 1 });
                    const prev = sortedFaqs[idx - 1];
                    updateFAQ(prev.id, { order: prev.order + 1 });
                  }}
                  className="p-0.5 hover:text-[#E91E8C] text-[#9CA3AF]"
                  title="Mover para cima"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (idx === sortedFaqs.length - 1) return;
                    updateFAQ(faq.id, { order: faq.order + 1 });
                    const next = sortedFaqs[idx + 1];
                    updateFAQ(next.id, { order: next.order - 1 });
                  }}
                  className="p-0.5 hover:text-[#E91E8C] text-[#9CA3AF]"
                  title="Mover para baixo"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A2E] truncate">{faq.question.pt || faq.question.en}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${faq.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {faq.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                  {faq.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#FCE7F3] text-[#E91E8C] font-semibold">
                      {faq.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => editFaq(faq)}
                  className="p-2 text-[#9CA3AF] hover:text-[#E91E8C] transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm('Remover esta pergunta?')) deleteFAQ(faq.id); }}
                  className="p-2 text-[#9CA3AF] hover:text-red-500 transition-colors"
                  title="Excluir"
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
