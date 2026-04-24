import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Headphones, Disc, Star, Upload, Loader2, Image as ImageIcon, Link, ExternalLink } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { DJ, DJSet } from '@/types';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/supabase';
import { optimizeImage } from '@/lib/imageProcessor';
import { fetchSoundCloudOEmbed, sanitizeSoundCloudIframe } from '@/lib/soundcloud';

/* ── Upload de Imagem ── */
function ImageUploadField({ label, value, onChange, folder, fullWidth = false }: {
  label: string; value: string; onChange: (v: string) => void; folder: string; fullWidth?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const optimized = await optimizeImage(file, { maxWidth: 1000, quality: 0.82, format: 'image/webp' });
      const url = await uploadImage(optimized, folder);
      onChange(url);
      toast.success('Imagem enviada!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha no upload.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const previewClass = fullWidth ? 'aspect-square w-full' : 'w-24 h-24';

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1">{label}</label>
      {value ? (
        <div className={`relative ${previewClass} rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-red-500 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className={`${previewClass} rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 bg-slate-50/50 text-slate-400`}>
          <ImageIcon className="w-6 h-6 text-slate-300" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Vazio</span>
        </div>
      )}
      <div className="flex gap-2">
        <input type="url" value={value} onChange={e => onChange(e.target.value)}
          placeholder="Cole uma URL externa..." className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/50 placeholder:text-slate-400" />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold hover:text-admin-accent hover:border-admin-accent transition-all disabled:opacity-50">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Enviando' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
        {label}{required && <span className="text-admin-accent ml-1">*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 text-sm rounded-lg outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 placeholder:text-slate-400" />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-sm rounded-lg outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 cursor-pointer">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ minHeight: '100px' }}
        className="w-full px-4 py-3 text-sm rounded-lg outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 resize-y placeholder:text-slate-400" />
    </div>
  );
}

/* ── Helper social links ── */
const getSocial = (dj: Partial<DJ>, platform: string) =>
  dj.socialLinks?.find(s => s.platform === platform)?.url || '';

const setSocial = (dj: Partial<DJ>, platform: string, url: string): Partial<DJ> => {
  const others = (dj.socialLinks || []).filter(s => s.platform !== platform);
  return { ...dj, socialLinks: url ? [...others, { platform, url }] : others };
};

const DEFAULT_DJ: Partial<DJ> = {
  name: '', bio: { pt: '', en: '', es: '' }, fullBio: { pt: '', en: '', es: '' },
  image: '', category: 'guest', musicStyle: '', socialLinks: [], status: 'active', featured: false, orderIndex: 0,
};

const DEFAULT_SET: Partial<DJSet> = {
  djId: '', title: { pt: '', en: '', es: '' }, description: { pt: '', en: '', es: '' },
  coverImage: '', audioUrl: '', soundcloudUrl: '', externalLink: '',
  status: 'active', featured: false, orderIndex: 0,
};

export function AdminMusic() {
  const { djs, djSets, addDJ, updateDJ, deleteDJ, addDJSet, updateDJSet, deleteDJSet } = useData();

  const [activeTab, setActiveTab] = useState<'djs' | 'sets'>('djs');
  const [isEditing, setIsEditing] = useState(false);
  const [currentDJ, setCurrentDJ] = useState<Partial<DJ>>(DEFAULT_DJ);
  const [currentSet, setCurrentSet] = useState<Partial<DJSet>>(DEFAULT_SET);
  const [isImportingSC, setIsImportingSC] = useState(false);

  const handleImportSoundCloud = async () => {
    if (!currentSet.soundcloudUrl) return toast.error('Cole a URL do SoundCloud primeiro.');
    setIsImportingSC(true);
    try {
      const data = await fetchSoundCloudOEmbed(currentSet.soundcloudUrl);
      setCurrentSet(prev => ({
        ...prev,
        title: { ...prev.title!, pt: data.title || prev.title?.pt || '' },
        description: { ...prev.description!, pt: data.description || prev.description?.pt || '' },
        coverImage: data.thumbnail_url || prev.coverImage,
        metadata: {
          ...prev.metadata,
          soundcloud: {
            author_name: data.author_name,
            author_url: data.author_url,
            html: data.html,
            type: data.type,
            provider_name: data.provider_name,
            provider_url: data.provider_url
          }
        }
      }));
      toast.success('Dados importados com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao importar dados.');
    } finally {
      setIsImportingSC(false);
    }
  };

  const handleClearSCData = () => {
    setCurrentSet(prev => {
      const { soundcloud, ...restMetadata } = prev.metadata || ({} as any);
      return {
        ...prev,
        soundcloudUrl: '',
        metadata: restMetadata
      };
    });
  };

  /* ── Handlers DJ ── */
  const handleSaveDJ = () => {
    if (!currentDJ.name) return toast.error('Nome do DJ é obrigatório');
    if (currentDJ.id) { updateDJ(currentDJ.id, currentDJ); toast.success('DJ atualizado!'); }
    else { addDJ(currentDJ as Omit<DJ, 'id'>); toast.success('DJ cadastrado!'); }
    closeForm();
  };
  const handleEditDJ = (dj: DJ) => { setCurrentDJ(dj); setIsEditing(true); };
  const handleDeleteDJ = (id: string) => { if (window.confirm('Excluir DJ?')) deleteDJ(id); };
  const toggleFeatureDJ = (dj: DJ) => updateDJ(dj.id, { featured: !dj.featured });

  /* ── Handlers Set ── */
  const handleSaveSet = () => {
    if (!currentSet.title?.pt) return toast.error('Título é obrigatório');
    if (currentSet.id) { updateDJSet(currentSet.id, currentSet); toast.success('Set atualizado!'); }
    else { addDJSet(currentSet as Omit<DJSet, 'id' | 'createdAt'>); toast.success('Set publicado!'); }
    closeForm();
  };
  const handleEditSet = (item: DJSet) => { setCurrentSet(item); setIsEditing(true); };
  const handleDeleteSet = (id: string) => { if (window.confirm('Excluir Set?')) deleteDJSet(id); };

  const closeForm = () => {
    setIsEditing(false);
    setCurrentDJ(DEFAULT_DJ);
    setCurrentSet(DEFAULT_SET);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Disc className="w-8 h-8 text-admin-accent" /> Base Musical
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Gerencie o cast de DJs e os live sets oficiais.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl bg-admin-accent hover:brightness-110 shadow-sm transition-all active:scale-[0.98] whitespace-nowrap">
            <Plus className="w-5 h-5" /> {activeTab === 'djs' ? 'Adicionar DJ' : 'Adicionar Set'}
          </button>
        )}
      </div>

      {/* Tabs */}
      {!isEditing && (
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8 w-fit border border-slate-200 shadow-inner">
          {([{ id: 'djs', label: 'Cast de DJs', Icon: Headphones }, { id: 'sets', label: 'Live Sets Oficiais', Icon: Disc }] as const).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-admin-accent shadow' : 'text-slate-500 hover:text-slate-700'}`}>
              <tab.Icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── LISTAGENS ── */}
      {!isEditing ? (
        <div>
          {/* DJs */}
          {activeTab === 'djs' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500">DJ</th>
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500">Categoria</th>
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500">Estilo</th>
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500 text-center">Destaque</th>
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {djs.map(dj => (
                      <tr key={dj.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            {dj.image
                              ? <img src={dj.image} alt={dj.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" />
                              : <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0"><Headphones className="w-4 h-4 text-slate-300" /></div>}
                            <div>
                              <p className="text-slate-900 font-bold text-sm">{dj.name}</p>
                              <p className="text-slate-400 text-[11px]">{(dj.socialLinks || []).length} rede(s)</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                            {dj.category === 'resident' ? 'Residente' : dj.category === 'special' ? 'Headliner' : 'Convidado'}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-sm text-slate-600">{dj.musicStyle || '—'}</td>
                        <td className="py-3 px-6 text-center">
                          <button onClick={() => toggleFeatureDJ(dj)}
                            className={`p-1.5 rounded-lg transition-colors ${dj.featured ? 'bg-amber-50 text-amber-500 border border-amber-200' : 'text-slate-300 hover:text-amber-400'}`}>
                            <Star className={`w-4 h-4 ${dj.featured ? 'fill-current' : ''}`} />
                          </button>
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditDJ(dj)} className="p-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-admin-accent hover:border-admin-accent transition-all shadow-sm"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteDJ(dj.id)} className="p-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm ml-1"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {djs.length === 0 && (
                      <tr><td colSpan={5} className="py-12 text-center text-sm font-medium text-slate-400">Nenhum DJ cadastrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sets — cards 1:1 */}
          {activeTab === 'sets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {djSets.map(set => (
                <div key={set.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group shadow-sm flex flex-col hover:border-slate-300 transition-all">
                  <div className="aspect-square relative bg-slate-100 overflow-hidden">
                    {set.coverImage
                      ? <img src={set.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      : <div className="w-full h-full flex items-center justify-center"><Disc className="w-10 h-10 text-slate-300" /></div>}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white uppercase tracking-wider">Live Set</div>
                    {set.soundcloudUrl && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-[#ff5500]/80 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">SC</div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-slate-900 font-bold text-sm leading-tight line-clamp-2 mb-1.5">{set.title?.pt}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 flex-1">{set.description?.pt || 'Sem detalhes.'}</p>
                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                      <button onClick={() => handleEditSet(set)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-md hover:text-admin-accent hover:border-admin-accent transition-colors"><Edit2 className="w-3 h-3" /> Editar</button>
                      <button onClick={() => handleDeleteSet(set.id)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {djSets.length === 0 && (
                <p className="col-span-full py-16 text-center text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">Nenhum set cadastrado.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ── FORMULÁRIOS ── */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {activeTab === 'djs' ? (currentDJ.id ? 'Editar DJ' : 'Novo DJ') : (currentSet.id ? 'Editar Set' : 'Novo Set')}
            </h3>
            <button onClick={closeForm} className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition-colors bg-white border border-slate-200 shadow-sm">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* ── FORMULÁRIO DJ ── */}
            {activeTab === 'djs' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-7 space-y-5">
                  <Input label="Nome Artístico" required value={currentDJ.name || ''} onChange={v => setCurrentDJ({ ...currentDJ, name: v })} placeholder="Nome do DJ" />
                  <div className="grid grid-cols-2 gap-5">
                    <Select label="Categoria" value={currentDJ.category || 'guest'} onChange={v => setCurrentDJ({ ...currentDJ, category: v as any })} options={[
                      { value: 'guest', label: 'Convidado' },
                      { value: 'resident', label: 'Residente' },
                      { value: 'special', label: 'Headliner' },
                    ]} />
                    <Input label="Estilo Musical" value={currentDJ.musicStyle || ''} onChange={v => setCurrentDJ({ ...currentDJ, musicStyle: v })} placeholder="House, Techno..." />
                  </div>
                  <Select label="Visibilidade" value={currentDJ.status || 'active'} onChange={v => setCurrentDJ({ ...currentDJ, status: v as any })} options={[
                    { value: 'active', label: 'Publicado' },
                    { value: 'inactive', label: 'Oculto' },
                  ]} />
                  <Textarea label="Bio (PT)" value={currentDJ.bio?.pt || ''} onChange={v => setCurrentDJ({ ...currentDJ, bio: { ...currentDJ.bio!, pt: v } })} placeholder="Breve descrição para o card do DJ..." />

                  {/* Redes Sociais */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1 flex items-center gap-1.5"><Link className="w-3 h-3" /> Redes Sociais</label>
                    <Input label="Instagram URL" type="url" value={getSocial(currentDJ, 'instagram')} onChange={v => setCurrentDJ(setSocial(currentDJ, 'instagram', v))} placeholder="https://instagram.com/dj..." />
                    <Input label="SoundCloud URL" type="url" value={getSocial(currentDJ, 'soundcloud')} onChange={v => setCurrentDJ(setSocial(currentDJ, 'soundcloud', v))} placeholder="https://soundcloud.com/dj..." />
                    <Input label="YouTube URL" type="url" value={getSocial(currentDJ, 'youtube')} onChange={v => setCurrentDJ(setSocial(currentDJ, 'youtube', v))} placeholder="https://youtube.com/@dj..." />
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <ImageUploadField label="Foto do DJ (1:1)" value={currentDJ.image || ''} onChange={v => setCurrentDJ({ ...currentDJ, image: v })} folder="djs" fullWidth />
                  </div>
                  <button onClick={handleSaveDJ}
                    className="w-full bg-admin-accent text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-sm transition-all active:scale-[0.98]">
                    <Save className="w-4 h-4" /> Salvar DJ
                  </button>
                </div>
              </div>
            )}

            {/* ── FORMULÁRIO SET ── */}
            {activeTab === 'sets' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-7 space-y-5">
                  <Input label="Título do Set" required value={currentSet.title?.pt || ''} onChange={v => setCurrentSet({ ...currentSet, title: { ...currentSet.title!, pt: v } })} placeholder="Ex: Aftermath Session 001" />
                  <Textarea label="Descrição" value={currentSet.description?.pt || ''} onChange={v => setCurrentSet({ ...currentSet, description: { ...currentSet.description!, pt: v } })} placeholder="Detalhes do set, tracklist, data..." />

                  {/* Links */}
                  <div className="space-y-4 bg-[#ff5500]/5 border border-[#ff5500]/20 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ff5500]">Importar do SoundCloud</label>
                      {currentSet.metadata?.soundcloud && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#ff5500]/10 text-[#ff5500] border border-[#ff5500]/20">
                          Dados Importados
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input label="" type="url" value={currentSet.soundcloudUrl || ''} onChange={v => setCurrentSet({ ...currentSet, soundcloudUrl: v })} placeholder="https://soundcloud.com/queromaisparty/..." />
                      </div>
                      <button type="button" onClick={handleImportSoundCloud} disabled={isImportingSC || !currentSet.soundcloudUrl}
                        className="shrink-0 flex items-center gap-1.5 px-4 py-2 mt-0.5 h-[42px] rounded-lg bg-[#ff5500] text-white text-sm font-bold hover:bg-[#ff5500]/90 transition-all disabled:opacity-50">
                        {isImportingSC ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
                        {isImportingSC ? 'Buscando...' : 'Buscar Dados'}
                      </button>
                    </div>

                    {currentSet.metadata?.soundcloud && (
                      <div className="pt-2 border-t border-[#ff5500]/10">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs text-slate-500">Preview do Embed:</p>
                          <button type="button" onClick={handleClearSCData} className="text-[10px] font-bold uppercase text-red-500 hover:underline">
                            Limpar Dados Importados
                          </button>
                        </div>
                        {(() => {
                          const safeHtml = currentSet.metadata.soundcloud.html ? sanitizeSoundCloudIframe(currentSet.metadata.soundcloud.html) : null;
                          if (safeHtml) {
                            return (
                              <div 
                                className="w-full rounded-lg overflow-hidden border border-[#ff5500]/20 bg-black/5"
                                dangerouslySetInnerHTML={{ __html: safeHtml }}
                              />
                            );
                          }
                          return (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                              <a href={currentSet.soundcloudUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#ff5500] hover:underline flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> Abrir no SoundCloud
                              </a>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <Input label="Link Externo (YouTube / Outro)" type="url" value={currentSet.externalLink || ''} onChange={v => setCurrentSet({ ...currentSet, externalLink: v })} placeholder="https://youtube.com/..." />

                  <div className="grid grid-cols-2 gap-5">
                    <Select label="Status" value={currentSet.status || 'active'} onChange={v => setCurrentSet({ ...currentSet, status: v as any })} options={[
                      { value: 'active', label: 'Publicado' },
                      { value: 'inactive', label: 'Oculto' },
                    ]} />
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <ImageUploadField label="Thumbnail (1:1 quadrado)" value={currentSet.coverImage || ''} onChange={v => setCurrentSet({ ...currentSet, coverImage: v })} folder="sets" fullWidth />
                  </div>
                  <button onClick={handleSaveSet}
                    className="w-full bg-admin-accent text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-sm transition-all active:scale-[0.98]">
                    <Save className="w-4 h-4" /> Salvar Set
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
