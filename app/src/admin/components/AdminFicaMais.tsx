import { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import type { PartyDate } from '@/types';
import { Plus, Trash2, Save, Image, Upload, X, Loader2, Calendar, MapPin, Link as LinkIcon, Info } from 'lucide-react';
import { uploadImage } from '@/lib/supabase';
import { optimizeImage } from '@/lib/imageProcessor';
import { toast } from 'sonner';

type Tab = 'manifesto' | 'dates' | 'media';

const TABS: { id: Tab; label: string }[] = [
  { id: 'manifesto', label: 'Cultura & Texto' },
  { id: 'dates',     label: 'Agenda e Rotas' },
  { id: 'media',     label: 'Arquivos Locais' },
];

const fieldStyle = {
  input: 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 outline-none transition-all placeholder:text-slate-400',
  textarea: 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 outline-none transition-all custom-scrollbar resize-y placeholder:text-slate-400',
  label: 'block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1',
};

function ImageField({ label, value, onChange, folder = 'fica-mais' }: { label: string; value: string; onChange: (v: string) => void; folder?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const optimizedFile = await optimizeImage(file, { maxWidth: 1600, quality: 0.82, format: 'image/webp' });
      const url = await uploadImage(optimizedFile, folder);
      onChange(url);
      toast.success('Material de mídia processado.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha na inserção visual.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
      <label className={fieldStyle.label}>{label}</label>
      <div className="space-y-4 pt-1">
        
        {value ? (
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
            <img src={value} alt="Preview Fica Mais" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-100/50 shadow-sm"
              title="Remover Arte"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full aspect-[21/9] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 bg-white text-slate-400">
            <Image className="w-10 h-10 text-slate-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Ausência de Mídia Principal</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="url"
            className={fieldStyle.input}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Forneça ligação URL direto, ou suba do PC..."
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="shrink-0 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:text-admin-accent hover:border-admin-accent transition-all shadow-sm disabled:opacity-50 min-w-[130px]"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin text-admin-accent" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Codificando' : 'Trazer Arquivo'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}

export function AdminFicaMais() {
  const { ficaMaisParty, updateFicaMaisParty } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('manifesto');

  const save = (data: Parameters<typeof updateFicaMaisParty>[0]) => {
    updateFicaMaisParty(data);
    toast.success('Configurações do selo Fica Mais injetadas.');
  };

  // ── Tab: Manifesto ──────────────────────────────────────
  function TabManifesto() {
    const [manifestoCurto, setManifestoCurto] = useState(ficaMaisParty?.manifestoCurto?.pt || '');
    const [manifestoCompleto, setManifestoCompleto] = useState(ficaMaisParty?.manifestoCompleto?.pt || '');
    const [showInHome, setShowInHome] = useState(ficaMaisParty?.showInHome ?? true);
    const [isActivePage, setIsActivePage] = useState(ficaMaisParty?.isActivePage ?? true);
    // Stats dos cards (24h / ∞)
    const [stat1Value, setStat1Value] = useState((ficaMaisParty as any)?.stat1Value ?? '24h');
    const [stat1Label, setStat1Label] = useState((ficaMaisParty as any)?.stat1Label ?? 'De Festa');
    const [stat2Value, setStat2Value] = useState((ficaMaisParty as any)?.stat2Value ?? '∞');
    const [stat2Label, setStat2Label] = useState((ficaMaisParty as any)?.stat2Label ?? 'Memórias');

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Toggle Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${showInHome ? 'bg-admin-accent/5 border-admin-accent/20' : 'bg-white border-slate-200'}`}>
             <div className="relative inline-block w-11 h-6 shrink-0 rounded-full bg-slate-200 transition-colors duration-200 ease-in-out">
                <input type="checkbox" checked={showInHome} onChange={e => setShowInHome(e.target.checked)} className="peer sr-only" />
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showInHome ? 'translate-x-5 bg-admin-accent' : ''}`}></div>
             </div>
            <div>
              <span className={`text-sm font-black ${showInHome ? 'text-admin-accent' : 'text-slate-800'}`}>Widget na Home</span>
              <p className="text-[11px] font-medium text-slate-500 leading-tight block mt-0.5">Mostra fita de chamada no root do site</p>
            </div>
          </label>
          
          <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${isActivePage ? 'bg-admin-accent/5 border-admin-accent/20' : 'bg-white border-slate-200'}`}>
             <div className="relative inline-block w-11 h-6 shrink-0 rounded-full bg-slate-200 transition-colors duration-200 ease-in-out">
                <input type="checkbox" checked={isActivePage} onChange={e => setIsActivePage(e.target.checked)} className="peer sr-only" />
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActivePage ? 'translate-x-5 bg-admin-accent' : ''}`}></div>
             </div>
            <div>
               <span className={`text-sm font-black ${isActivePage ? 'text-admin-accent' : 'text-slate-800'}`}>Navegação /fica-mais</span>
              <p className="text-[11px] font-medium text-slate-500 leading-tight block mt-0.5">Destrava e abre URL na estrutura superior</p>
            </div>
          </label>
        </div>

        {/* Texto resumido */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Expressão Resumida (Widget/Home)</h4>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Aparece no bloco da home. Tradução automática pelo navegador.</p>
          </div>
          <textarea className={`${fieldStyle.textarea} min-h-[90px]`} value={manifestoCurto} onChange={e => setManifestoCurto(e.target.value)} placeholder="Ex: A festa continua quando o sol nasce..." />
        </div>

        {/* Texto completo da página */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Escopo Profundo (Página /fica-mais)</h4>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Texto principal da landing do After. Tradução automática pelo navegador.</p>
          </div>
          <textarea className={`${fieldStyle.textarea} min-h-[140px]`} value={manifestoCompleto} onChange={e => setManifestoCompleto(e.target.value)} placeholder="Ex: Quando a noite termina para a maioria..." />
        </div>

        {/* Cards de Stats */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Cards de Destaque</h4>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Os dois cards com número/ícone e rótulo que aparecem abaixo do texto na home.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <label className={fieldStyle.label}>Card 1 — Valor <span className="text-admin-accent">*</span></label>
              <input className={fieldStyle.input} value={stat1Value} onChange={e => setStat1Value(e.target.value)} placeholder="Ex: 24h" />
              <label className={fieldStyle.label}>Card 1 — Rótulo</label>
              <input className={fieldStyle.input} value={stat1Label} onChange={e => setStat1Label(e.target.value)} placeholder="Ex: De Festa" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <label className={fieldStyle.label}>Card 2 — Valor <span className="text-admin-accent">*</span></label>
              <input className={fieldStyle.input} value={stat2Value} onChange={e => setStat2Value(e.target.value)} placeholder="Ex: ∞" />
              <label className={fieldStyle.label}>Card 2 — Rótulo</label>
              <input className={fieldStyle.input} value={stat2Label} onChange={e => setStat2Label(e.target.value)} placeholder="Ex: Memórias" />
            </div>
          </div>
        </div>

        <SaveButton onClick={() => save({
          showInHome, isActivePage,
          manifestoCurto:    { pt: manifestoCurto,   en: '', es: '' },
          manifestoCompleto: { pt: manifestoCompleto, en: '', es: '' },
          stat1Value, stat1Label, stat2Value, stat2Label,
        } as any)} />
      </div>
    );
  }

  // ── Tab: Próximas Datas ─────────────────────────────────
  function TabDates() {
    const [dates, setDates] = useState<PartyDate[]>(ficaMaisParty?.upcomingDates || []);

    const add = () => {
      setDates(prev => [...prev, {
        id: Date.now().toString(),
        date: '',
        time: '',
        location: '',
        ticketLink: '',
      }]);
    };

    const remove = (id: string) => {
      if(window.confirm('Exterminar compromisso na agenda do Fica Mais?')) {
        setDates(prev => prev.filter(d => d.id !== id));
      }
    }

    const update = (id: string, field: keyof PartyDate, val: string) =>
      setDates(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d));

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100 mb-2">
           <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
           <p className="text-sm font-medium text-orange-800">
             Tabela específica para braço "Fica Mais Party". Modificações aqui não interferem na Main Event List global do sistema. Use links Sympla independentes se os ingressos forem separados.
           </p>
        </div>

        {dates.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center text-sm font-bold text-slate-400">
            Nenhum compromisso engatilhado. <br/>A página esconderá as grids informativas temporais.
          </div>
        )}

        <div className="space-y-4">
          {dates.map((d, index) => (
            <div key={d.id} className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm hover:border-admin-accent/30 transition-colors relative group">
              <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-slate-900 text-white font-black flex items-center justify-center border-4 border-white shadow-sm z-10 text-xs">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                <div className="md:col-span-4 space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-5">
                  <div>
                    <label className={fieldStyle.label}><Calendar className="w-3 h-3 inline mr-1" />Cronologia (Data)</label>
                    <input type="date" className={fieldStyle.input} value={d.date} onChange={e => update(d.id, 'date', e.target.value)} />
                  </div>
                  <div>
                    <label className={fieldStyle.label}>Fuso (Hora Inicial)</label>
                    <input type="time" className={fieldStyle.input} value={d.time} onChange={e => update(d.id, 'time', e.target.value)} />
                  </div>
                </div>
                
                <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                  <div>
                    <label className={fieldStyle.label}><MapPin className="w-3 h-3 inline mr-1" />Arena / GPS Ponto Geográfico</label>
                    <input className={fieldStyle.input} value={d.location} onChange={e => update(d.id, 'location', e.target.value)} placeholder="Ex: HIGH CLUB - Zona Norte" />
                  </div>
                  <div>
                    <label className={fieldStyle.label}><LinkIcon className="w-3 h-3 inline mr-1" />Atalho de Vendas (External Checkout)</label>
                    <input className={fieldStyle.input} value={d.ticketLink || ''} onChange={e => update(d.id, 'ticketLink', e.target.value)} placeholder="https://..." />
                  </div>
                </div>
              </div>
              
              <button onClick={() => remove(d.id)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button onClick={add} className="flex items-center justify-center gap-2 w-full py-4 text-sm font-bold text-slate-600 bg-slate-50 border-2 border-slate-200 rounded-xl hover:bg-slate-100 hover:text-admin-accent hover:border-admin-accent transition-colors border-dashed mt-4">
          <Plus className="w-4 h-4" /> Alocar Nova Data de After
        </button>

        <div className="pt-6 border-t border-slate-100 mt-6">
          <SaveButton onClick={() => save({ upcomingDates: dates })} />
        </div>
      </div>
    );
  }

  // ── Tab: Mídia ──────────────────────────────────────────
  function TabMedia() {
    const [homeMedia, setHomeMedia] = useState(ficaMaisParty?.homeMedia || '');
    const [pageMedia, setPageMedia] = useState(ficaMaisParty?.pageMedia || '');

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
         <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
           <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
           <p className="text-sm font-medium text-blue-800">
             Cenografia Digital. Estas imagens envelopam as caídas do braço. Alta qualidade retangular (paisagem) sugerida.
           </p>
        </div>
        <ImageField
          label="Cobertura para Módulo Inferior da Home"
          value={homeMedia}
          onChange={setHomeMedia}
        />
        <ImageField
          label="Pano de Fundo Fullscreen (Hero /fica-mais)"
          value={pageMedia}
          onChange={setPageMedia}
        />
        <div className="pt-2 border-t border-slate-100">
           <SaveButton onClick={() => save({ homeMedia, pageMedia })} />
        </div>
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
        Processar Injeções
      </button>
    );
  }

  const tabContent = {
    manifesto: <TabManifesto />,
    dates:     <TabDates />,
    media:     <TabMedia />,
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">After Fica Mais</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Configuração do eixo de ramificação (Afterparty/Label).
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
