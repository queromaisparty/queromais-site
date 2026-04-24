import { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import type { TimelineItem, StatItem } from '@/types';
import { Plus, Trash2, ChevronUp, ChevronDown, Save, Image, Upload, X, Loader2, Info } from 'lucide-react';
import { uploadImage } from '@/lib/supabase';
import { toast } from 'sonner';

type Tab = 'abertura' | 'stats' | 'origem' | 'essencia' | 'borboleta' | 'narrativa' | 'home' | 'cta';

const TABS: { id: Tab; label: string }[] = [
  { id: 'abertura',  label: 'Abertura' },
  { id: 'stats',     label: 'Stats' },
  { id: 'origem',    label: 'Origem' },
  { id: 'essencia',  label: 'Essência' },
  { id: 'borboleta', label: 'Borboleta' },
  { id: 'narrativa', label: 'Timeline' },
  { id: 'home',      label: 'Home' },
  { id: 'cta',       label: 'Sub-Menu/CTA' },
];

const fieldStyle = {
  input: 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 outline-none transition-all placeholder:text-slate-400',
  textarea: 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 outline-none transition-all custom-scrollbar resize-y placeholder:text-slate-400',
  label: 'block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1',
};

function ImageField({ label, value, onChange, folder = 'storytelling' }: { label: string; value: string; onChange: (v: string) => void; folder?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success('Imagem subida com sucesso.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no processamento.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <label className={fieldStyle.label}>{label}</label>
      <div className="space-y-4">
        {/* Preview */}
        {value ? (
          <div className="relative w-full aspect-video max-h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
            <img src={value} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-100/50 shadow-sm"
              title="Remover imagem"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full aspect-video max-h-56 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
            <Image className="w-10 h-10 text-slate-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Campo de Imagem Vazio</span>
          </div>
        )}

        {/* Input URL / Upload */}
        <div className="flex gap-2">
          <input
            type="url"
            className={fieldStyle.input}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Cole uma URL externa..."
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold hover:text-admin-accent hover:border-admin-accent transition-all shadow-sm disabled:opacity-50 min-w-[120px]"
            title="Upload Local"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin text-admin-accent" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Aguarde' : 'Procurar'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}

export function AdminSobre() {
  const { storytelling, updateStorytelling } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('abertura');

  const save = (data: Parameters<typeof updateStorytelling>[0]) => {
    updateStorytelling(data);
    toast.success('Alterações gravadas no documento institucional.');
  };

  // ── Tab: Abertura ──────────────────────────────────────────
  function TabAbertura() {
    const [heroTitle, setHeroTitle] = useState(storytelling.heroTitle);
    const [heroTagline, setHeroTagline] = useState(storytelling.heroTagline);
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="grid gap-6">
          <div>
            <label className={fieldStyle.label}>Título Central (Hero)</label>
            <input className={fieldStyle.input} value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="Abrace o extraordinário" />
          </div>
          <div>
            <label className={fieldStyle.label}>Tagline Curta / Propósito</label>
            <input className={fieldStyle.input} value={heroTagline} onChange={e => setHeroTagline(e.target.value)} placeholder="Muito mais que uma festa..." />
          </div>
        </div>
        <SaveButton onClick={() => save({ heroTitle, heroTagline })} />
      </div>
    );
  }

  // ── Tab: Stats ────────────────────────────────────────────
  function TabStats() {
    // Initializer function: roda só na montagem — garante id estável mesmo se vier undefined do banco
    const [stats, setStats] = useState<StatItem[]>(() =>
      storytelling.stats.map((s, i) => ({
        ...s,
        id: s.id && s.id !== '' ? s.id : `stat-${i}-${Date.now()}`,
      }))
    );

    const add = () => setStats(prev => [...prev, { id: `stat-new-${Date.now()}`, value: '', label: '', order: prev.length + 1 }]);
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
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6">
           <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
           <p className="text-sm font-medium text-blue-800">
             Não exiba informações desatualizadas. Se não houver clareza nos números, remova-os e a seção ocultará automaticamente.
           </p>
        </div>

        {stats.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center text-sm font-bold text-slate-400">
            Nenhum card analítico. Modulo na interface: Oculto.
          </div>
        )}
        
        <div className="space-y-3">
          {stats.map((stat, idx) => (
            <div key={stat.id} className="flex gap-3 items-stretch rounded-xl border border-slate-200 p-4 bg-white shadow-sm hover:border-slate-300 transition-colors group">
              <div className="flex flex-col gap-1 justify-center border-r border-slate-100 pr-3">
                <button onClick={() => move(idx, -1)} className="p-1 rounded hover:bg-slate-50 text-slate-400 hover:text-admin-accent"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(idx, 1)} className="p-1 rounded hover:bg-slate-50 text-slate-400 hover:text-admin-accent"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Grandeza (Valor)</label>
                  <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm font-bold outline-none focus:border-admin-accent" value={stat.value} onChange={e => update(stat.id, 'value', e.target.value)} placeholder="Ex: +50k" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Significado</label>
                  <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm font-bold outline-none focus:border-admin-accent" value={stat.label} onChange={e => update(stat.id, 'label', e.target.value)} placeholder="Ex: Impactados Positivamente" />
                </div>
              </div>
              <div className="flex items-center justify-center pl-3 border-l border-slate-100 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => remove(stat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={add} className="flex items-center justify-center gap-2 w-full py-3 mt-4 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-admin-accent hover:border-admin-accent transition-colors border-dashed">
          <Plus className="w-4 h-4" /> Registrar Nova Métrica
        </button>
        <div className="mt-8 pt-6 border-t border-slate-100">
           <SaveButton onClick={() => save({ stats })} />
        </div>
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
          <label className={fieldStyle.label}>Título do Bloco</label>
          <input className={fieldStyle.input} value={origemTitle} onChange={e => setOrigemTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Contexto 1 / Estopim (Text Block A)</label>
          <textarea className={fieldStyle.textarea} rows={4} value={origemText1} onChange={e => setOrigemText1(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Contexto 2 / Efeito (Text Block B)</label>
          <textarea className={fieldStyle.textarea} rows={4} value={origemText2} onChange={e => setOrigemText2(e.target.value)} />
        </div>
        <ImageField label="Fotografia Editorial A (Vertical/Retrato preferencial)" value={origemImage} onChange={setOrigemImage} />
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
          <label className={fieldStyle.label}>Título do Bloco</label>
          <input className={fieldStyle.input} value={essenciaTitle} onChange={e => setEssenciaTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Text Block A</label>
          <textarea className={fieldStyle.textarea} rows={4} value={essenciaText1} onChange={e => setEssenciaText1(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Text Block B</label>
          <textarea className={fieldStyle.textarea} rows={4} value={essenciaText2} onChange={e => setEssenciaText2(e.target.value)} />
        </div>
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <label className={fieldStyle.label}>Nuvem de Tags (Valores)</label>
          <div className="flex gap-2 mb-4 flex-wrap mt-2">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-admin-accent/10 border border-admin-accent/20 text-admin-accent text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                {t}
                <button onClick={() => removeTag(t)} className="w-4 h-4 rounded-full bg-white/50 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors ml-1"><X className="w-3 h-3" /></button>
              </span>
            ))}
            {tags.length === 0 && <span className="text-xs font-bold text-slate-400">Nenhum termo ativo.</span>}
          </div>
          <div className="flex gap-2">
            <input className={fieldStyle.input} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Ex: Alegria (Aperte Enter)" />
            <button onClick={addTag} className="px-5 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-admin-accent transition-colors shadow-sm"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
        <ImageField label="Fotografia Editorial B (Vertical/Retrato preferencial)" value={essenciaImage} onChange={setEssenciaImage} />
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
          <label className={fieldStyle.label}>Seção Ícone (A Borboleta)</label>
          <input className={fieldStyle.input} value={simboloTitle} onChange={e => setSimboloTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Significado Principal</label>
          <textarea className={fieldStyle.textarea} rows={4} value={simboloText1} onChange={e => setSimboloText1(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Conclusão Simbólica</label>
          <textarea className={fieldStyle.textarea} rows={4} value={simboloText2} onChange={e => setSimboloText2(e.target.value)} />
        </div>
        <ImageField label="Ilustração/Render do Símbolo Oficial" value={simboloImage} onChange={setSimboloImage} />
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
    const remove = (id: string) => {
        if(window.confirm('Apagar marco cronológico?')){
            setTimeline(prev => prev.filter(t => t.id !== id).map((t, i) => ({ ...t, order: i + 1 })));
        }
    }
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
          <label className={fieldStyle.label}>Título da Jornada</label>
          <input className={fieldStyle.input} value={narrativaTitle} onChange={e => setNarrativaTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Síntese Evolutiva</label>
          <textarea className={fieldStyle.textarea} rows={3} value={narrativaIntro} onChange={e => setNarrativaIntro(e.target.value)} />
        </div>
        
        <div className="pt-4">
          <label className={fieldStyle.label}>Marcos Cronológicos (Pillars)</label>
          <div className="space-y-3 mt-2">
            {timeline.map((item, idx) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all group">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex flex-col gap-0.5 justify-center border-r border-slate-100 pr-3">
                    <button onClick={() => move(idx, -1)} className="p-1 rounded hover:bg-slate-50 text-slate-400 hover:text-admin-accent"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => move(idx, 1)} className="p-1 rounded hover:bg-slate-50 text-slate-400 hover:text-admin-accent"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate tracking-tight">{item.title || 'Data Inominada...'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">{item.year || '----'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity pl-2 border-l border-slate-100">
                    <button onClick={() => setEditing(editing === item.id ? null : item.id)} className={`px-4 py-1.5 text-[11px] font-bold uppercase rounded-lg transition-colors ${editing === item.id ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-admin-accent hover:border-admin-accent'}`}>
                      {editing === item.id ? 'Fechar' : 'Gerir Texto'}
                    </button>
                    <button onClick={() => remove(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 border border-transparent transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {editing === item.id && (
                  <div className="border-t border-slate-200 p-5 space-y-4 bg-slate-50/80 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Chancela Temporal</label>
                        <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-bold outline-none focus:border-admin-accent" value={item.year ?? ''} onChange={e => update(item.id, 'year', e.target.value)} placeholder="Ano/Mês..." />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cunho do Marco</label>
                        <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-bold outline-none focus:border-admin-accent" value={item.title} onChange={e => update(item.id, 'title', e.target.value)} placeholder="O Despertar..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Exposição Textual</label>
                      <textarea className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm outline-none focus:border-admin-accent resize-none h-20" value={item.description} onChange={e => update(item.id, 'description', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={add} className="flex items-center justify-center gap-2 w-full py-3 mt-3 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-admin-accent hover:border-admin-accent transition-colors border-dashed">
            <Plus className="w-4 h-4" /> Somar Evento na Timeline
          </button>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100">
           <SaveButton onClick={() => save({ narrativaTitle, narrativaIntro, timeline })} />
        </div>
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100 mb-2">
           <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
           <p className="text-sm font-medium text-orange-800">
             Cuidado especial: estes campos nutrem a Landing Page. Devem ser magnéticos, curtos e com link que arraste leitores para o `/sobre` definitivo.
           </p>
        </div>

        <div>
          <label className={fieldStyle.label}>Manchete Frontal</label>
          <input className={fieldStyle.input} value={homeTitle} onChange={e => setHomeTitle(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Enredo Sintético A</label>
          <textarea className={fieldStyle.textarea} rows={3} value={homeText1} onChange={e => setHomeText1(e.target.value)} />
        </div>
        <div>
          <label className={fieldStyle.label}>Enredo Sintético B</label>
          <textarea className={fieldStyle.textarea} rows={3} value={homeText2} onChange={e => setHomeText2(e.target.value)} />
        </div>
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <label className={fieldStyle.label}>Ação de Mergulho (Botão Final)</label>
          <input className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-bold focus:border-admin-accent outline-none" value={homeCTA} onChange={e => setHomeCTA(e.target.value)} placeholder="Investigue nosso DNA" />
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
         <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 mb-2">
           <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
           <p className="text-sm font-medium text-blue-800">
             O fecho do `/sobre`. Após ele conhecer sua essência, ele precisa tomar uma ação (Ex: Voltar a Ingressos, Ver Agenda ou Mídia).
           </p>
        </div>
        <div>
          <label className={fieldStyle.label}>Sentença de Disparo (CTA)</label>
          <textarea className={fieldStyle.textarea} rows={3} value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="Agora que conectamos as ondas..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={fieldStyle.label}>Rótulo Operacional</label>
            <input className={fieldStyle.input} value={ctaButtonLabel} onChange={e => setCtaButtonLabel(e.target.value)} placeholder="Garantir Passaporte" />
          </div>
          <div>
            <label className={fieldStyle.label}>Vetor de Viagem (Slug)</label>
            <input className={fieldStyle.input} value={ctaButtonLink} onChange={e => setCtaButtonLink(e.target.value)} placeholder="/tickets" />
          </div>
        </div>
        <SaveButton onClick={() => save({ ctaText, ctaButtonLabel, ctaButtonLink })} />
      </div>
    );
  }

  function SaveButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-admin-accent hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
      >
        <Save className="w-4 h-4" />
        Processar Alterações
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
    <div className="p-6 lg:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Institucional & DNA</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Afinador central de redação, storytelling e linha do tempo oficial Quero Mais.
        </p>
      </div>

      {/* Tabs Layout Modificadas (Vertical in LG +) */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0 rounded-2xl bg-white border border-slate-200 shadow-sm p-2 h-fit">
          <div className="flex overflow-x-auto lg:flex-col lg:overflow-visible gap-1 pb-1 lg:pb-0 custom-scrollbar">
             {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-bold text-left rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-admin-accent/10 text-admin-accent'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 lg:p-8">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
               {TABS.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          {tabContent[activeTab]}
        </div>

      </div>
    </div>
  );
}
