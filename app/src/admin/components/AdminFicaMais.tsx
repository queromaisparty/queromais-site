import { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import type { PartyDate } from '@/types';
import { Plus, Trash2, Save, Image, Upload, X, Loader2, Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { uploadImage } from '@/lib/supabase';

type Tab = 'manifesto' | 'dates' | 'media';

const TABS: { id: Tab; label: string }[] = [
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'dates',     label: 'Próximas Datas' },
  { id: 'media',     label: 'Mídia' },
];

const fieldStyle = {
  input: 'w-full px-3 py-2 rounded-lg border border-[#E8E8ED] text-sm text-[#1A1A2E] focus:outline-none focus:border-qm-magenta transition-colors',
  textarea: 'w-full px-3 py-2 rounded-lg border border-[#E8E8ED] text-sm text-[#1A1A2E] focus:outline-none focus:border-qm-magenta transition-colors resize-none',
  label: 'block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1',
};

function ImageField({ label, value, onChange, folder = 'fica-mais' }: { label: string; value: string; onChange: (v: string) => void; folder?: string }) {
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
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-qm-magenta text-qm-magenta text-sm font-semibold hover:bg-qm-magenta hover:text-white transition-colors disabled:opacity-50"
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

export function AdminFicaMais() {
  const { ficaMaisParty, updateFicaMaisParty } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('manifesto');
  const [saved, setSaved] = useState(false);

  const save = (data: Parameters<typeof updateFicaMaisParty>[0]) => {
    updateFicaMaisParty(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── Tab: Manifesto ──────────────────────────────────────
  function TabManifesto() {
    const [manifestoCurtoPt, setManifestoCurtoPt] = useState(ficaMaisParty?.manifestoCurto?.pt || '');
    const [manifestoCurtoEn, setManifestoCurtoEn] = useState(ficaMaisParty?.manifestoCurto?.en || '');
    const [manifestoCurtoEs, setManifestoCurtoEs] = useState(ficaMaisParty?.manifestoCurto?.es || '');
    const [manifestoCompletoPt, setManifestoCompletoPt] = useState(ficaMaisParty?.manifestoCompleto?.pt || '');
    const [manifestoCompletoEn, setManifestoCompletoEn] = useState(ficaMaisParty?.manifestoCompleto?.en || '');
    const [manifestoCompletoEs, setManifestoCompletoEs] = useState(ficaMaisParty?.manifestoCompleto?.es || '');
    const [showInHome, setShowInHome] = useState(ficaMaisParty?.showInHome ?? true);
    const [isActivePage, setIsActivePage] = useState(ficaMaisParty?.isActivePage ?? true);

    return (
      <div className="space-y-6">
        {/* Switches */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-4 rounded-xl border border-[#E8E8ED] bg-white cursor-pointer">
            <input
              type="checkbox"
              checked={showInHome}
              onChange={e => setShowInHome(e.target.checked)}
              className="w-4 h-4 accent-qm-magenta"
            />
            <div>
              <span className="text-sm font-semibold text-[#1A1A2E]">Exibir na Home</span>
              <p className="text-xs text-[#9CA3AF]">Mostra a seção Fica Mais na página principal</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 rounded-xl border border-[#E8E8ED] bg-white cursor-pointer">
            <input
              type="checkbox"
              checked={isActivePage}
              onChange={e => setIsActivePage(e.target.checked)}
              className="w-4 h-4 accent-qm-magenta"
            />
            <div>
              <span className="text-sm font-semibold text-[#1A1A2E]">Página Ativa</span>
              <p className="text-xs text-[#9CA3AF]">Ativa a página /fica-mais no menu</p>
            </div>
          </label>
        </div>

        {/* Manifesto Curto (PT / EN / ES) */}
        <div className="rounded-xl border border-[#E8E8ED] p-5 bg-white space-y-4">
          <h4 className="text-sm font-bold text-[#1A1A2E]">Manifesto Curto (Home)</h4>
          <p className="text-xs text-[#9CA3AF]">Texto exibido na seção da Home e no início da página /fica-mais.</p>
          <div>
            <label className={fieldStyle.label}>Português</label>
            <textarea className={fieldStyle.textarea} rows={3} value={manifestoCurtoPt} onChange={e => setManifestoCurtoPt(e.target.value)} placeholder="A Fica Mais Party é o after oficial da Quero Mais..." />
          </div>
          <div>
            <label className={fieldStyle.label}>English</label>
            <textarea className={fieldStyle.textarea} rows={3} value={manifestoCurtoEn} onChange={e => setManifestoCurtoEn(e.target.value)} placeholder="Fica Mais Party is the official Quero Mais after party..." />
          </div>
          <div>
            <label className={fieldStyle.label}>Español</label>
            <textarea className={fieldStyle.textarea} rows={3} value={manifestoCurtoEs} onChange={e => setManifestoCurtoEs(e.target.value)} placeholder="Fica Mais Party es el after oficial de Quero Más..." />
          </div>
        </div>

        {/* Manifesto Completo (PT / EN / ES) */}
        <div className="rounded-xl border border-[#E8E8ED] p-5 bg-white space-y-4">
          <h4 className="text-sm font-bold text-[#1A1A2E]">Manifesto Completo (Página)</h4>
          <p className="text-xs text-[#9CA3AF]">Texto completo exibido na página /fica-mais.</p>
          <div>
            <label className={fieldStyle.label}>Português</label>
            <textarea className={fieldStyle.textarea} rows={4} value={manifestoCompletoPt} onChange={e => setManifestoCompletoPt(e.target.value)} placeholder="Quando a noite termina para a maioria, a nossa verdadeira jornada começa..." />
          </div>
          <div>
            <label className={fieldStyle.label}>English</label>
            <textarea className={fieldStyle.textarea} rows={4} value={manifestoCompletoEn} onChange={e => setManifestoCompletoEn(e.target.value)} />
          </div>
          <div>
            <label className={fieldStyle.label}>Español</label>
            <textarea className={fieldStyle.textarea} rows={4} value={manifestoCompletoEs} onChange={e => setManifestoCompletoEs(e.target.value)} />
          </div>
        </div>

        <SaveButton onClick={() => save({
          showInHome,
          isActivePage,
          manifestoCurto: { pt: manifestoCurtoPt, en: manifestoCurtoEn, es: manifestoCurtoEs },
          manifestoCompleto: { pt: manifestoCompletoPt, en: manifestoCompletoEn, es: manifestoCompletoEs },
        })} />
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

    const remove = (id: string) => setDates(prev => prev.filter(d => d.id !== id));

    const update = (id: string, field: keyof PartyDate, val: string) =>
      setDates(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d));

    return (
      <div className="space-y-4">
        <p className="text-xs text-[#9CA3AF]">Adicione as próximas datas da Fica Mais Party. Elas aparecem na aba "Próximas Datas" da home e na página.</p>

        {dates.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#E8E8ED] p-8 text-center text-sm text-[#9CA3AF]">
            Nenhuma data adicionada. A aba "Próximas Datas" exibirá "Nenhuma data programada".
          </div>
        )}

        {dates.map(d => (
          <div key={d.id} className="rounded-xl border border-[#E8E8ED] p-5 bg-white space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldStyle.label}>
                  <Calendar className="w-3 h-3 inline mr-1" />Data
                </label>
                <input
                  type="date"
                  className={fieldStyle.input}
                  value={d.date}
                  onChange={e => update(d.id, 'date', e.target.value)}
                />
              </div>
              <div>
                <label className={fieldStyle.label}>Horário</label>
                <input
                  type="time"
                  className={fieldStyle.input}
                  value={d.time}
                  onChange={e => update(d.id, 'time', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={fieldStyle.label}>
                <MapPin className="w-3 h-3 inline mr-1" />Local
              </label>
              <input
                className={fieldStyle.input}
                value={d.location}
                onChange={e => update(d.id, 'location', e.target.value)}
                placeholder="Ex: HIGH CLUB | São Paulo"
              />
            </div>
            <div>
              <label className={fieldStyle.label}>
                <LinkIcon className="w-3 h-3 inline mr-1" />Link do Ingresso (opcional)
              </label>
              <input
                className={fieldStyle.input}
                value={d.ticketLink || ''}
                onChange={e => update(d.id, 'ticketLink', e.target.value)}
                placeholder="https://sympla.com.br/..."
              />
            </div>
            <button
              onClick={() => remove(d.id)}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remover data
            </button>
          </div>
        ))}

        <button onClick={add} className="flex items-center gap-2 text-sm text-qm-magenta font-semibold hover:underline">
          <Plus className="w-4 h-4" /> Adicionar data
        </button>

        <SaveButton onClick={() => save({ upcomingDates: dates })} />
      </div>
    );
  }

  // ── Tab: Mídia ──────────────────────────────────────────
  function TabMedia() {
    const [homeMedia, setHomeMedia] = useState(ficaMaisParty?.homeMedia || '');
    const [pageMedia, setPageMedia] = useState(ficaMaisParty?.pageMedia || '');

    return (
      <div className="space-y-6">
        <ImageField
          label="Imagem da Home (seção Fica Mais)"
          value={homeMedia}
          onChange={setHomeMedia}
        />
        <ImageField
          label="Imagem da Página /fica-mais (hero)"
          value={pageMedia}
          onChange={setPageMedia}
        />
        <SaveButton onClick={() => save({ homeMedia, pageMedia })} />
      </div>
    );
  }

  function SaveButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
        style={{ background: saved ? '#10B981' : 'var(--primary-color)' }}
      >
        <Save className="w-4 h-4" />
        {saved ? 'Salvo!' : 'Salvar'}
      </button>
    );
  }

  const tabContent = {
    manifesto: <TabManifesto />,
    dates:     <TabDates />,
    media:     <TabMedia />,
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Fica Mais Party</h2>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
          Gerencie o manifesto, datas e mídia da Fica Mais Party — after oficial da Quero Mais.
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
              color: activeTab === tab.id ? 'var(--primary-color)' : '#9CA3AF',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary-color)' : '2px solid transparent',
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
