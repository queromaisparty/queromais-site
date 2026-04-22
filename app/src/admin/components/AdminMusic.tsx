import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Headphones, Disc, Music, Star, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { DJ, DJSet, Playlist } from '@/types';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/supabase';

/* ── Componente de Upload reutilizável (tema Premium Light) ── */
function ImageUploadField({ label, value, onChange, folder, aspect = 'square' }: {
  label: string; value: string; onChange: (v: string) => void; folder: string; aspect?: 'square' | 'video';
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success('Imagem enviada com sucesso!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha no processamento da imagem.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1">{label}</label>
      
      {/* Preview */}
      {value ? (
        <div className={`relative ${aspect === 'video' ? 'aspect-video' : 'w-24 h-24'} rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm border border-red-100/50"
            title="Remover imagem"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className={`${aspect === 'video' ? 'aspect-video' : 'w-24 h-24'} rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 bg-slate-50/50 text-slate-400`}>
          <ImageIcon className="w-6 h-6 text-slate-300" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Vazio</span>
        </div>
      )}
      
      {/* URL + Upload button */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Cole uma URL externa se preferir..."
          className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/50 transition-all placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold hover:text-admin-accent hover:border-admin-accent transition-all shadow-sm disabled:opacity-50"
          title="Fazer upload do computador"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin text-admin-accent" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Processando' : 'Navegar'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

// ── Input padronizado
function Input({ label, value, onChange, placeholder, type = 'text', required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean; }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
        {label}{required && <span className="text-admin-accent ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 text-sm rounded-lg outline-none transition-all bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 placeholder:text-slate-400"
      />
    </div>
  );
}

// ── Select padronizado
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: {value: string; label: string}[] }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-sm rounded-lg outline-none transition-all bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 cursor-pointer"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── Textarea padronizado
function Textarea({ label, value, onChange, placeholder, minHeight = "100px" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; minHeight?: string; }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ minHeight }}
        className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-all bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 custom-scrollbar resize-y placeholder:text-slate-400"
      />
    </div>
  );
}

export function AdminMusic() {
  const { 
    djs, djSets, playlists, 
    addDJ, updateDJ, deleteDJ, 
    addDJSet, updateDJSet, deleteDJSet,
    addPlaylist, updatePlaylist, deletePlaylist
  } = useData();

  const [activeTab, setActiveTab] = useState<'djs' | 'sets' | 'playlists'>('djs');
  const [isEditing, setIsEditing] = useState(false);

  // DJs State
  const [currentDJ, setCurrentDJ] = useState<Partial<DJ>>({
    name: '',
    bio: { pt: '', en: '', es: '' },
    fullBio: { pt: '', en: '', es: '' },
    image: '',
    category: 'guest',
    musicStyle: '',
    socialLinks: [],
    status: 'active',
    featured: false,
    orderIndex: 0
  });

  // DJ Sets State
  const [currentSet, setCurrentSet] = useState<Partial<DJSet>>({
    djId: '',
    title: { pt: '', en: '', es: '' },
    description: { pt: '', en: '', es: '' },
    coverImage: '',
    audioUrl: '',
    externalLink: '',
    playlistUrl: '',
    status: 'active',
    featured: false,
    orderIndex: 0
  });

  // Playlists State
  const [currentPlaylist, setCurrentPlaylist] = useState<Partial<Playlist>>({
    title: { pt: '', en: '', es: '' },
    description: { pt: '', en: '', es: '' },
    coverImage: '',
    tracks: [],
    externalUrl: '',
    status: 'active',
    featured: false,
    orderIndex: 0
  });

  // ========== DJ HANDLERS ==========
  const handleSaveDJ = () => {
    if (!currentDJ.name) return toast.error('Nome do DJ é obrigatório');
    if (!currentDJ.image) return toast.error('Foto/Avatar é obrigatória');

    if (currentDJ.id) {
      updateDJ(currentDJ.id, currentDJ);
      toast.success('Registro de DJ atualizado!');
    } else {
      addDJ(currentDJ as Omit<DJ, 'id'>);
      toast.success('Novo DJ cadastrado na base!');
    }
    closeForm();
  };

  const handleEditDJ = (dj: DJ) => { setCurrentDJ(dj); setIsEditing(true); };
  const handleDeleteDJ = (id: string) => { if (window.confirm('Excluir dados deste DJ definitivamente?')) deleteDJ(id); };
  const toggleFeatureDJ = (dj: DJ) => updateDJ(dj.id, { featured: !dj.featured });

  // ========== SET HANDLERS ==========
  const handleSaveSet = () => {
    if (!currentSet.title?.pt) return toast.error('Título central (PT) é obrigatório');
    if (currentSet.id) {
      updateDJSet(currentSet.id, currentSet);
      toast.success('Dados do Set atualizados!');
    } else {
      addDJSet(currentSet as Omit<DJSet, 'id' | 'createdAt'>);
      toast.success('Novo Set publicado!');
    }
    closeForm();
  };

  const handleEditSet = (item: DJSet) => { setCurrentSet(item); setIsEditing(true); };
  const handleDeleteSet = (id: string) => { if (window.confirm('Excluir Set Musical?')) deleteDJSet(id); };

  // ========== PLAYLIST HANDLERS ==========
  const handleSavePlaylist = () => {
    if (!currentPlaylist.title?.pt) return toast.error('Nome da Playlist obrigatório');
    if (currentPlaylist.id) {
      updatePlaylist(currentPlaylist.id, currentPlaylist);
      toast.success('Playlist atualizada!');
    } else {
      addPlaylist(currentPlaylist as Omit<Playlist, 'id' | 'createdAt'>);
      toast.success('Playlist lançada!');
    }
    closeForm();
  };

  const handleEditPlaylist = (item: Playlist) => { setCurrentPlaylist(item); setIsEditing(true); };
  const handleDeletePlaylist = (id: string) => { if (window.confirm('Apagar atalho desta Playlist?')) deletePlaylist(id); };

  // Global
  const closeForm = () => {
    setIsEditing(false);
    setCurrentDJ({ name: '', bio: { pt: '', en: '', es: '' }, fullBio: { pt: '', en: '', es: '' }, image: '', category: 'guest', musicStyle: '', socialLinks: [], status: 'active', featured: false, orderIndex: 0 });
    setCurrentSet({ djId: '', title: { pt: '', en: '', es: '' }, description: { pt: '', en: '', es: '' }, coverImage: '', audioUrl: '', externalLink: '', playlistUrl: '', status: 'active', featured: false, orderIndex: 0 });
    setCurrentPlaylist({ title: { pt: '', en: '', es: '' }, description: { pt: '', en: '', es: '' }, coverImage: '', tracks: [], externalUrl: '', status: 'active', featured: false, orderIndex: 0 });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Music className="w-8 h-8 text-admin-accent" /> Base Musical
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Gerencie a identidade sonora, Djs residentes, sets oficiais e curadoria em playlists.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl bg-admin-accent hover:brightness-110 shadow-sm transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Adicionar {activeTab === 'djs' ? 'DJ' : activeTab === 'sets' ? 'Novo Set' : 'Playlist'}
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      {!isEditing && (
        <div className="flex md:inline-flex bg-slate-100 p-1 rounded-xl mb-8 overflow-x-auto custom-scrollbar w-full md:w-auto border border-slate-200 shadow-inner">
          {[
            { id: 'djs', label: 'Cast de DJs', icon: Headphones },
            { id: 'sets', label: 'Live Sets Oficiais', icon: Disc },
            { id: 'playlists', label: 'Canais e Playlists', icon: Music },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-admin-accent shadow flex-shrink-0' 
                  : 'text-slate-500 hover:text-slate-700 flex-shrink-0'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* LISTAGENS */}
      {!isEditing ? (
        <div className="w-full">
          {activeTab === 'djs' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500">Perfil Profissional (DJ)</th>
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500">Categoria</th>
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500">Gênero</th>
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500 text-center">Presilha</th>
                      <th className="py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right">Gerência</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {djs.map(dj => (
                      <tr key={dj.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3 w-max">
                            {dj.image ? <img src={dj.image} alt={dj.name} className="w-10 h-10 rounded-full object-cover bg-slate-100 shrink-0 border border-slate-200" /> : <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0"><Headphones className="w-4 h-4 text-slate-300" /></div>}
                            <div>
                              <p className="text-slate-900 font-bold text-sm tracking-tight">{dj.name}</p>
                              <p className="text-slate-400 text-[11px] font-medium">Cadastrado · {(dj.socialLinks || []).length} Redes</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                             {dj.category === 'resident' ? 'Residente' : dj.category === 'special' ? 'Headliner' : 'Convidado'}
                           </span>
                        </td>
                        <td className="py-3 px-6 text-sm font-medium text-slate-600 line-clamp-1">{dj.musicStyle || 'Eletrônica'}</td>
                        <td className="py-3 px-6 text-center">
                          <button title="Exibir fixado aos destaques" onClick={() => toggleFeatureDJ(dj)} className={`p-1.5 rounded-lg transition-colors inline-block ${dj.featured ? 'bg-amber-50 text-amber-500 border border-amber-200' : 'text-slate-300 hover:text-amber-400'}`}>
                            <Star className={`w-4 h-4 ${dj.featured ? 'fill-current' : ''}`} />
                          </button>
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditDJ(dj)} className="p-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-admin-accent hover:border-admin-accent transition-all shadow-sm" title="Editar DJ"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteDJ(dj.id)} className="p-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm ml-1" title="Apagar Registro"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {djs.length === 0 && (
                      <tr><td colSpan={5} className="py-12 text-center text-sm font-medium text-slate-400">Nenhum artista na listagem.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {djSets.map(set => (
                <div key={set.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group shadow-sm flex flex-col hover:border-slate-300 transition-all">
                  <div className="aspect-video relative bg-slate-100 overflow-hidden">
                    {set.coverImage ? (
                       <img src={set.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center"><Disc className="w-10 h-10 text-slate-300" /></div>
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white uppercase tracking-wider">Live Set</div>
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col bg-white">
                    <h3 className="text-slate-900 font-bold text-sm leading-tight line-clamp-2 mb-1.5 group-hover:text-admin-accent transition-colors">{set.title?.pt}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 flex-1 leading-relaxed">{set.description?.pt || 'Sem detalhes.'}</p>
                    
                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                      <button onClick={() => handleEditSet(set)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-md hover:text-admin-accent hover:border-admin-accent transition-colors"><Edit2 className="w-3 h-3" /> Editar</button>
                      <button onClick={() => handleDeleteSet(set.id)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Apagar Registro"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {djSets.length === 0 && <p className="col-span-full py-16 text-center text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">Bandeja de Sets vazia.</p>}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {playlists.map(pl => (
                <div key={pl.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-slate-300 transition-all group">
                  <div className="shrink-0 overflow-hidden rounded-xl border border-slate-100">
                     {pl.coverImage ? <img src={pl.coverImage} className="w-16 h-16 object-cover bg-slate-50 transition-transform duration-500 group-hover:scale-110" alt="" /> : <div className="w-16 h-16 bg-slate-50 flex items-center justify-center"><Music className="w-6 h-6 text-slate-300" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 font-bold text-sm truncate mb-0.5">{pl.title?.pt}</h3>
                    <p className="text-[#1DB954] text-[10px] font-bold uppercase tracking-wider shrink-0 mt-1 flex items-center gap-1.5 bg-[#1DB954]/10 w-fit px-2 py-0.5 rounded-full border border-[#1DB954]/20"><Disc className="w-3 h-3" /> Spotify App</p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Atualizar Links" onClick={() => handleEditPlaylist(pl)} className="w-8 h-8 bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center rounded-lg hover:text-admin-accent hover:border-admin-accent transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button title="Excluir Curadoria" onClick={() => handleDeletePlaylist(pl.id)} className="w-8 h-8 bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center rounded-lg hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {playlists.length === 0 && <p className="col-span-full py-16 text-center text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">Bandeja de Playlists vazia.</p>}
            </div>
          )}
        </div>
      ) : (
        /* ================== FORMULÁRIOS ================== */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {activeTab === 'djs' ? (currentDJ.id ? 'EDITAR DADOS DO ARTISTA' : 'ADICIONAR NOVO DJ') : 
               activeTab === 'sets' ? (currentSet.id ? 'EDITAR VÍNCULO DE SET' : 'PUBLICAR NOVO SET') :
               (currentPlaylist.id ? 'EDITAR PARÂMETROS DA PLAYLIST' : 'LANÇAR NOVA PLAYLIST')}
            </h3>
            <button title="Abortar e Fechar" onClick={closeForm} className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition-colors bg-white border border-slate-200 shadow-sm">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 md:p-8">
             {activeTab === 'djs' && (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                 <div className="lg:col-span-7 space-y-5">
                   <Input label="DJ / Nome Artístico" value={currentDJ.name || ''} onChange={v => setCurrentDJ({...currentDJ, name: v})} required placeholder="John Doe" />
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                     <Select label="Categoria de Base" value={currentDJ.category || ''} onChange={v => setCurrentDJ({...currentDJ, category: v as any})} options={[
                       {value: 'guest', label: 'Convidado (Padrão)'},
                       {value: 'resident', label: 'Residente / Staff'},
                       {value: 'special', label: 'Atração Especial'},
                     ]} />
                     <Input label="Vertente Principal" value={currentDJ.musicStyle || ''} onChange={v => setCurrentDJ({...currentDJ, musicStyle: v})} placeholder="House, Techno..." />
                   </div>
                   
                   <Select label="Visibilidade" value={currentDJ.status || 'active'} onChange={v => setCurrentDJ({...currentDJ, status: v as any})} options={[
                       {value: 'active', label: 'Artística: Ativo e Publicado'},
                       {value: 'inactive', label: 'Mapeamento Interno (Oculto)'},
                   ]} />
                   
                   <Textarea label="Resumo Biográfico" value={currentDJ.bio?.pt || ''} onChange={v => setCurrentDJ({...currentDJ, bio: {...currentDJ.bio!, pt: v}})} placeholder="Uma breve descrição que acompanhe a exibição card." minHeight="120px" />
                 </div>
                 
                 <div className="lg:col-span-5 space-y-6">
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                     <ImageUploadField
                       label="Presskit / Foto Avatar"
                       value={currentDJ.image || ''}
                       onChange={v => setCurrentDJ({...currentDJ, image: v})}
                       folder="djs"
                       aspect="square"
                     />
                   </div>
                   
                   <div className="pt-2">
                     <Input label="Centralização de Redes: Instagam URL" type="url" value={currentDJ.socialLinks?.[0]?.url || ''} onChange={v => setCurrentDJ({...currentDJ, socialLinks: [{platform: 'instagram', url: v}]})} placeholder="https://instagram.com/dj..." />
                   </div>
                   
                   <div className="pt-6 border-t border-slate-100 mt-2">
                     <button onClick={handleSaveDJ} className="w-full bg-admin-accent text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-sm transition-all active:scale-[0.98]">
                       <Save className="w-4 h-4" /> Salvar DJ no Catálogo
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'sets' && (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                 <div className="lg:col-span-7 space-y-5">
                   <Input label="Nomenclatura do Gravado" value={currentSet.title?.pt || ''} onChange={v => setCurrentSet({...currentSet, title: {...currentSet.title!, pt: v}})} required placeholder="Ex: Aftermath Session 001" />
                   <Textarea label="Logline / Call to Action Descritiva" value={currentSet.description?.pt || ''} onChange={v => setCurrentSet({...currentSet, description: {...currentSet.description!, pt: v}})} placeholder="Detalhes mínimos sobre o set, data de gravação, tracklist principal..." minHeight="120px" />
                   <Input label="Link Externo da Coleta (Soundcloud / YouTube)" type="url" value={currentSet.externalLink || ''} onChange={v => setCurrentSet({...currentSet, externalLink: v})} placeholder="https://" />
                 </div>
                 
                 <div className="lg:col-span-5 flex flex-col h-full">
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                      <ImageUploadField
                       label="Thumbnail Frontal (Landscape/16:9)"
                       value={currentSet.coverImage || ''}
                       onChange={v => setCurrentSet({...currentSet, coverImage: v})}
                       folder="sets"
                       aspect="video"
                     />
                   </div>
                   <div className="mt-auto pt-6 border-t border-slate-100">
                     <button onClick={handleSaveSet} className="w-full bg-admin-accent text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-sm transition-all active:scale-[0.98]">
                       <Save className="w-4 h-4" /> Lançar na Biblioteca
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'playlists' && (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                 <div className="lg:col-span-7 space-y-5">
                   <Input label="Identificação do Curador/Playlist" value={currentPlaylist.title?.pt || ''} onChange={v => setCurrentPlaylist({...currentPlaylist, title: {...currentPlaylist.title!, pt: v}})} required placeholder="Ex: Warm Up Quero Mais" />
                   <Textarea label="Release / Orientação Musical" value={currentPlaylist.description?.pt || ''} onChange={v => setCurrentPlaylist({...currentPlaylist, description: {...currentPlaylist.description!, pt: v}})} placeholder="Por que ouvir essa seleção?" minHeight="120px" />
                   <Input label="Target URL — Link Direto Spotify" type="url" value={currentPlaylist.externalUrl || ''} onChange={v => setCurrentPlaylist({...currentPlaylist, externalUrl: v})} placeholder="https://open.spotify.com/playlist/..." />
                 </div>
                 
                 <div className="lg:col-span-5 flex flex-col h-full">
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                      <ImageUploadField
                       label="Artwork (Formato Spotify Quadrado)"
                       value={currentPlaylist.coverImage || ''}
                       onChange={v => setCurrentPlaylist({...currentPlaylist, coverImage: v})}
                       folder="playlists"
                       aspect="square"
                     />
                   </div>
                   <div className="mt-auto pt-6 border-t border-slate-100">
                     <button onClick={handleSavePlaylist} className="w-full bg-admin-accent text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-sm transition-all active:scale-[0.98]">
                       <Save className="w-4 h-4" /> Acoplar Playlist
                     </button>
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
