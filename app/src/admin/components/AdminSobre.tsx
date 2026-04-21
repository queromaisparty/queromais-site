import { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import type { TimelineItem, StatItem } from '@/types';
import { Plus, Trash2, ChevronUp, ChevronDown, Save, Image, Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/supabase';

type Tab = 'abertura' | 'stats' | 'origem' | 'essencia' | 'borboleta' | 'narrativa' | 'home' | 'cta';

const TABS: { id: Tab; label: string }[] = [
  { id: 'abertura',  label: 'Abertura' },
  { id: 'stats',     label: 'Stats' },
  { id: 'origem',    label: 'Origem' },
  { id: 'essencia',  label: 'Essência' },
  { id: 'borboleta', label: 'A Borboleta' },
  { id: 'narrativa', label: 'Narrativa' },
  { id: 'home',      label: 'Resumo Home' },
  { id: 'cta',       label: 'CTA Final' },
];

const fieldStyle = {
  input: 'w-full px-3 py-2 rounded-lg border border-[#E8E8ED] text-sm text-[#1A1A2E] focus:outline-none focus:border-[#E91E8C] transition-colors',
  textarea: 'w-full px-3 py-2 rounded-lg border border-[#E8E8ED] text-sm text-[#1A1A2E] focus:outline-none focus:border-[#E91E8C] transition-colors resize-none',
  label: 'block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1',
};

function ImageField({ label, value, onChange, folder = 'storytelling' }: { label: string; value: string; onChange: (v: string) => void; folder?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label className={fieldStyle.label}>{label}</label>
      <div className="space-y-2">
        {/* Preview */}
        {value ? (
          <div className="relative w-full aspect-video max-h-48 rounded-lg overflow-hidden border border-[#E8E8ED] bg-gray-50">
            <img src={value} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
              title="Remover imagem"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-full aspect-video max-h-48 rounded-lg border-2 border-dashed border-[#E8E8ED] flex flex-col items-center justify-center gap-2 bg-gray-50 text-[#9CA3AF]">
            <Image className="w-8 h-8" />
            <span className="text-xs">Nenhuma imagem</span>
          </div>
        )}

        {/* Botão upload + input URL */}
        <div className="flex gap-2">
          <input
            type="text"
            className={fieldStyle.input}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Colar URL da imagem..."
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E91E8C] text-[#E91E8C] text-sm font-semibold hover:bg-[#E91E8C] hover:text-white transition-colors disabled:opacity-50"
            title="Fazer upload do computador"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Enviando…' : 'Upload'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export function AdminSobre() {
  const { storytelling, updateStorytelling } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('abertura');
  const [saved, setSaved] = useState(false);

  const save = (data: Parameters<typeof updateStorytelling>[0]) => {
    updateStorytelling(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── Tab: Abertura ──────────────────────────────────────────
  function TabAbertura() {
    const [heroTitle, setHeroTitle] = useState(storytelling.heroTitle);
    const [heroTagline, setHeroTagline] = useState(storytelling.heroTagline);
    return (
      <div className="space-y-5">
        <div>
          <label className={fieldStyle.label}>Título Hero</label>
          <input className={fieldStyle.input} value={heroTitle} onChange={e => setHeroTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Tagline / Propósito</label>
          <input className={fieldStyle.input} value={heroTagline} onChange={e => setHeroTagline(e.target.value)} />
        </div>
        <SaveButton onClick={() => save({ heroTitle, heroTagline })} />
      </div>
    );
  }

  // ── Tab: Stats ────────────────────────────────────────────
  function TabStats() {
    const [stats, setStats] = useState<StatItem[]>(storytelling.stats);

    const add = () => setStats(prev => [...prev, { id: Date.now().toString(), value: '', label: '', order: prev.length + 1 }]);
    const remove = (id: string) => setStats(prev => prev.filter(s => s.id !== id));
    const update = (id: string, field: keyof StatItem, val: string) =>
      setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
    const move = (idx: number, dir: -1 | 1) => {
      const next = [...stats];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      setStats(next.map((s, i) => ({ ...s, order: i + 1 })));
    };

    return (
      <div className="space-y-4">
        <p className="text-xs text-[#9CA3AF]">Deixe vazio enquanto os números reais não estiverem confirmados. O bloco fica oculto na página.</p>
        {stats.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#E8E8ED] p-8 text-center text-sm text-[#9CA3AF]">
            Nenhuma stat adicionada. O bloco ficará oculto na página.
          </div>
        )}
        {stats.map((stat, idx) => (
          <div key={stat.id} className="flex gap-3 items-start rounded-xl border border-[#E8E8ED] p-4 bg-white">
            <div className="flex flex-col gap-1">
              <button onClick={() => move(idx, -1)} className="p-1 hover:text-[#E91E8C] text-[#9CA3AF]"><ChevronUp className="w-4 h-4" /></button>
              <button onClick={() => move(idx, 1)} className="p-1 hover:text-[#E91E8C] text-[#9CA3AF]"><ChevronDown className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className={fieldStyle.label}>Valor</label>
                <input className={fieldStyle.input} value={stat.value} onChange={e => update(stat.id, 'value', e.target.value)} placeholder="50+" />
              </div>
              <div>
                <label className={fieldStyle.label}>Label</label>
                <input className={fieldStyle.input} value={stat.label} onChange={e => update(stat.id, 'label', e.target.value)} placeholder="Eventos realizados" />
              </div>
            </div>
            <button onClick={() => remove(stat.id)} className="p-1 text-[#9CA3AF] hover:text-red-500 mt-1"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 text-sm text-[#E91E8C] font-semibold hover:underline">
          <Plus className="w-4 h-4" /> Adicionar stat
        </button>
        <SaveButton onClick={() => save({ stats })} />
      </div>
    );
  }

  // ── Tab: Origem e Propósito ───────────────────────────────
  function TabOrigem() {
    const [origemTitle, setOrigemTitle] = useState(storytelling.origemTitle);
    const [origemText1, setOrigemText1] = useState(storytelling.origemText1);
    const [origemText2, setOrigemText2] = useState(storytelling.origemText2);
    const [origemImage, setOrigemImage] = useState(storytelling.origemImage);
    return (
      <div className="space-y-5">
        <div>
          <label className={fieldStyle.label}>Título da seção</label>
          <input className={fieldStyle.input} value={origemTitle} onChange={e => setOrigemTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Parágrafo 1 — Origem</label>
          <textarea className={fieldStyle.textarea} rows={3} value={origemText1} onChange={e => setOrigemText1(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Parágrafo 2 — Propósito</label>
          <textarea className={fieldStyle.textarea} rows={3} value={origemText2} onChange={e => setOrigemText2(e.target.value)} />
        </div>
        <ImageField label="Imagem" value={origemImage} onChange={setOrigemImage} />
        <SaveButton onClick={() => save({ origemTitle, origemText1, origemText2, origemImage })} />
      </div>
    );
  }

  // ── Tab: Essência ─────────────────────────────────────────
  function TabEssencia() {
    const [essenciaTitle, setEssenciaTitle] = useState(storytelling.essenciaTitle);
    const [essenciaText1, setEssenciaText1] = useState(storytelling.essenciaText1);
    const [essenciaText2, setEssenciaText2] = useState(storytelling.essenciaText2);
    const [essenciaImage, setEssenciaImage] = useState(storytelling.essenciaImage);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>(storytelling.tags);

    const addTag = () => {
      const t = tagInput.trim();
      if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
      setTagInput('');
    };
    const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));

    return (
      <div className="space-y-5">
        <div>
          <label className={fieldStyle.label}>Título da seção</label>
          <input className={fieldStyle.input} value={essenciaTitle} onChange={e => setEssenciaTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Parágrafo 1</label>
          <textarea className={fieldStyle.textarea} rows={3} value={essenciaText1} onChange={e => setEssenciaText1(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Parágrafo 2</label>
          <textarea className={fieldStyle.textarea} rows={3} value={essenciaText2} onChange={e => setEssenciaText2(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Tags / Palavras-chave</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1 px-3 py-1 bg-[#FCE7F3] text-[#E91E8C] text-xs font-semibold rounded-full">
                {t}
                <button onClick={() => removeTag(t)} className="hover:opacity-70">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className={fieldStyle.input} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Nova tag (Enter para adicionar)" />
            <button onClick={addTag} className="px-3 py-2 rounded-lg bg-[#FCE7F3] text-[#E91E8C] text-sm font-semibold hover:bg-[#E91E8C] hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
        <ImageField label="Imagem" value={essenciaImage} onChange={setEssenciaImage} />
        <SaveButton onClick={() => save({ essenciaTitle, essenciaText1, essenciaText2, essenciaImage, tags })} />
      </div>
    );
  }

  // ── Tab: A Borboleta ──────────────────────────────────────
  function TabBorboleta() {
    const [simboloTitle, setSimboloTitle] = useState(storytelling.simboloTitle);
    const [simboloText1, setSimboloText1] = useState(storytelling.simboloText1);
    const [simboloText2, setSimboloText2] = useState(storytelling.simboloText2);
    const [simboloImage, setSimboloImage] = useState(storytelling.simboloImage);
    return (
      <div className="space-y-5">
        <div>
          <label className={fieldStyle.label}>Título da seção</label>
          <input className={fieldStyle.input} value={simboloTitle} onChange={e => setSimboloTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Parágrafo 1</label>
          <textarea className={fieldStyle.textarea} rows={3} value={simboloText1} onChange={e => setSimboloText1(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Parágrafo 2</label>
          <textarea className={fieldStyle.textarea} rows={3} value={simboloText2} onChange={e => setSimboloText2(e.target.value)} />
        </div>
        <ImageField label="Imagem do símbolo" value={simboloImage} onChange={setSimboloImage} />
        <SaveButton onClick={() => save({ simboloTitle, simboloText1, simboloText2, simboloImage })} />
      </div>
    );
  }

  // ── Tab: Narrativa / Timeline ─────────────────────────────
  function TabNarrativa() {
    const [narrativaTitle, setNarrativaTitle] = useState(storytelling.narrativaTitle);
    const [narrativaIntro, setNarrativaIntro] = useState(storytelling.narrativaIntro);
    const [timeline, setTimeline] = useState<TimelineItem[]>([...storytelling.timeline].sort((a, b) => a.order - b.order));
    const [editing, setEditing] = useState<string | null>(null);

    const add = () => {
      const id = Date.now().toString();
      setTimeline(prev => [...prev, { id, year: '', title: '', description: '', order: prev.length + 1 }]);
      setEditing(id);
    };
    const remove = (id: string) => setTimeline(prev => prev.filter(t => t.id !== id).map((t, i) => ({ ...t, order: i + 1 })));
    const update = (id: string, field: keyof TimelineItem, val: string) =>
      setTimeline(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t));
    const move = (idx: number, dir: -1 | 1) => {
      const next = [...timeline];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      setTimeline(next.map((t, i) => ({ ...t, order: i + 1 })));
    };

    return (
      <div className="space-y-5">
        <div>
          <label className={fieldStyle.label}>Título da seção</label>
          <input className={fieldStyle.input} value={narrativaTitle} onChange={e => setNarrativaTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Texto introdutório</label>
          <textarea className={fieldStyle.textarea} rows={3} value={narrativaIntro} onChange={e => setNarrativaIntro(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Marcos / Edições</label>
          <div className="space-y-3">
            {timeline.map((item, idx) => (
              <div key={item.id} className="rounded-xl border border-[#E8E8ED] bg-white overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => move(idx, -1)} className="p-0.5 hover:text-[#E91E8C] text-[#9CA3AF]"><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => move(idx, 1)} className="p-0.5 hover:text-[#E91E8C] text-[#9CA3AF]"><ChevronDown className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E] truncate">{item.title || 'Novo marco'}</p>
                    {item.year && <p className="text-xs text-[#9CA3AF]">{item.year}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(editing === item.id ? null : item.id)} className="text-xs text-[#E91E8C] font-semibold hover:underline">
                      {editing === item.id ? 'Fechar' : 'Editar'}
                    </button>
                    <button onClick={() => remove(item.id)} className="p-1 text-[#9CA3AF] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {editing === item.id && (
                  <div className="border-t border-[#E8E8ED] p-4 space-y-3 bg-[#FAFAFA]">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className={fieldStyle.label}>Ano (opcional)</label>
                        <input className={fieldStyle.input} value={item.year ?? ''} onChange={e => update(item.id, 'year', e.target.value)} placeholder="2024" />
                      </div>
                      <div className="col-span-2">
                        <label className={fieldStyle.label}>Título / Nome da edição</label>
                        <input className={fieldStyle.input} value={item.title} onChange={e => update(item.id, 'title', e.target.value)} placeholder="Metamorphosis" />
                      </div>
                    </div>
                    <div>
                      <label className={fieldStyle.label}>Descrição</label>
                      <textarea className={fieldStyle.textarea} rows={2} value={item.description} onChange={e => update(item.id, 'description', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={add} className="mt-3 flex items-center gap-2 text-sm text-[#E91E8C] font-semibold hover:underline">
            <Plus className="w-4 h-4" /> Adicionar marco
          </button>
        </div>
        <SaveButton onClick={() => save({ narrativaTitle, narrativaIntro, timeline })} />
      </div>
    );
  }

  // ── Tab: Resumo da Home ───────────────────────────────────
  function TabHome() {
    const [homeTitle, setHomeTitle] = useState(storytelling.homeTitle);
    const [homeText1, setHomeText1] = useState(storytelling.homeText1);
    const [homeText2, setHomeText2] = useState(storytelling.homeText2);
    const [homeCTA, setHomeCTA] = useState(storytelling.homeCTA);
    return (
      <div className="space-y-5">
        <p className="text-xs text-[#9CA3AF]">Versão resumida exibida na seção Sobre da home. Independente dos textos completos da página /sobre.</p>
        <div>
          <label className={fieldStyle.label}>Título</label>
          <input className={fieldStyle.input} value={homeTitle} onChange={e => setHomeTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Parágrafo curto 1</label>
          <textarea className={fieldStyle.textarea} rows={2} value={homeText1} onChange={e => setHomeText1(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Parágrafo curto 2</label>
          <textarea className={fieldStyle.textarea} rows={2} value={homeText2} onChange={e => setHomeText2(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Texto do link CTA</label>
          <input className={fieldStyle.input} value={homeCTA} onChange={e => setHomeCTA(e.target.value)} placeholder="Conheça nossa história" />
        </div>
        <SaveButton onClick={() => save({ homeTitle, homeText1, homeText2, homeCTA })} />
      </div>
    );
  }

  // ── Tab: CTA Final ────────────────────────────────────────
  function TabCTA() {
    const [ctaText, setCtaText] = useState(storytelling.ctaText);
    const [ctaButtonLabel, setCtaButtonLabel] = useState(storytelling.ctaButtonLabel);
    const [ctaButtonLink, setCtaButtonLink] = useState(storytelling.ctaButtonLink);
    return (
      <div className="space-y-5">
        <div>
          <label className={fieldStyle.label}>Texto de encerramento</label>
          <textarea className={fieldStyle.textarea} rows={2} value={ctaText} onChange={e => setCtaText(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Texto do botão</label>
          <input className={fieldStyle.input} value={ctaButtonLabel} onChange={e => setCtaButtonLabel(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Link do botão</label>
          <input className={fieldStyle.input} value={ctaButtonLink} onChange={e => setCtaButtonLink(e.target.value)} placeholder="/eventos" />
        </div>
        <SaveButton onClick={() => save({ ctaText, ctaButtonLabel, ctaButtonLink })} />
      </div>
    );
  }

  function SaveButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
        style={{ background: saved ? '#10B981' : '#E91E8C' }}
      >
        <Save className="w-4 h-4" />
        {saved ? 'Salvo!' : 'Salvar'}
      </button>
    );
  }

  const tabContent = {
    abertura:  <TabAbertura />,
    stats:     <TabStats />,
    origem:    <TabOrigem />,
    essencia:  <TabEssencia />,
    borboleta: <TabBorboleta />,
    narrativa: <TabNarrativa />,
    home:      <TabHome />,
    cta:       <TabCTA />,
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Sobre</h2>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
          Conteúdo institucional da Quero Mais — página /sobre e seção da home.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-8 border-b border-[#E8E8ED]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors"
            style={{
              color: activeTab === tab.id ? '#E91E8C' : '#9CA3AF',
              borderBottom: activeTab === tab.id ? '2px solid #E91E8C' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da tab */}
      <div key={activeTab}>
        {tabContent[activeTab]}
      </div>
    </div>
  );
}
