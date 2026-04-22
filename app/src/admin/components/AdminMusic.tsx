import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Headphones, Disc, Music, Star, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { DJ, DJSet, Playlist } from '@/types';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/supabase';

/* ── Componente de Upload reutilizável (tema claro) ── */
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
      toast.success('Imagem enviada!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no upload');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      {/* Preview */}
      {value ? (
        <div className={`relative ${aspect === 'video' ? 'aspect-video' : 'w-28 h-28'} rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-2`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-6 h-6 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors"
            title="Remover imagem"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className={`${aspect === 'video' ? 'aspect-video' : 'w-28 h-28'} rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 bg-gray-50 text-gray-400 mb-2`}>
          <ImageIcon className="w-6 h-6" />
          <span className="text-[10px]">Sem imagem</span>
        </div>
      )}
      {/* URL + Upload button */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Colar URL ou fazer upload..."
          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:border-admin-accent outline-none"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-admin-accent text-admin-accent text-sm font-semibold hover:bg-admin-accent hover:text-white transition-colors disabled:opacity-50"
          title="Fazer upload do computador"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Enviando…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
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
      toast.success('DJ atualizado!');
    } else {
      addDJ(currentDJ as Omit<DJ, 'id'>);
      toast.success('DJ criado!');
    }
    closeForm();
  };

  const handleEditDJ = (dj: DJ) => { setCurrentDJ(dj); setIsEditing(true); };
  const handleDeleteDJ = (id: string) => { if (window.confirm('Excluir DJ?')) deleteDJ(id); };
  const toggleFeatureDJ = (dj: DJ) => updateDJ(dj.id, { featured: !dj.featured });

  // ========== SET HANDLERS ==========
  const handleSaveSet = () => {
    if (!currentSet.title?.pt) return toast.error('Título (PT) obrigatório');
    if (currentSet.id) {
      updateDJSet(currentSet.id, currentSet);
      toast.success('Set atualizado!');
    } else {
      addDJSet(currentSet as Omit<DJSet, 'id' | 'createdAt'>);
      toast.success('Set criado!');
    }
    closeForm();
  };

  const handleEditSet = (item: DJSet) => { setCurrentSet(item); setIsEditing(true); };
  const handleDeleteSet = (id: string) => { if (window.confirm('Excluir Set?')) deleteDJSet(id); };

  // ========== PLAYLIST HANDLERS ==========
  const handleSavePlaylist = () => {
    if (!currentPlaylist.title?.pt) return toast.error('Título (PT) obrigatório');
    if (currentPlaylist.id) {
      updatePlaylist(currentPlaylist.id, currentPlaylist);
      toast.success('Playlist atualizada!');
    } else {
      addPlaylist(currentPlaylist as Omit<Playlist, 'id' | 'createdAt'>);
      toast.success('Playlist criada!');
    }
    closeForm();
  };

  const handleEditPlaylist = (item: Playlist) => { setCurrentPlaylist(item); setIsEditing(true); };
  const handleDeletePlaylist = (id: string) => { if (window.confirm('Excluir Playlist?')) deletePlaylist(id); };

  // Global
  const closeForm = () => {
    setIsEditing(false);
    setCurrentDJ({ name: '', bio: { pt: '', en: '', es: '' }, fullBio: { pt: '', en: '', es: '' }, image: '', category: 'guest', musicStyle: '', socialLinks: [], status: 'active', featured: false, orderIndex: 0 });
    setCurrentSet({ djId: '', title: { pt: '', en: '', es: '' }, description: { pt: '', en: '', es: '' }, coverImage: '', audioUrl: '', externalLink: '', playlistUrl: '', status: 'active', featured: false, orderIndex: 0 });
    setCurrentPlaylist({ title: { pt: '', en: '', es: '' }, description: { pt: '', en: '', es: '' }, coverImage: '', tracks: [], externalUrl: '', status: 'active', featured: false, orderIndex: 0 });
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-3" style={{ color: '#1A1A2E' }}>
            <Music className="w-5 h-5 sm:w-6 sm:h-6 text-admin-accent" /> QM Music
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Gerencie o cast oficial, sets gravados e playlists.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 bg-admin-accent text-white px-4 py-2 rounded-lg font-bold hover:bg-admin-accent-dark transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> NOVO {activeTab === 'djs' ? 'DJ' : activeTab === 'sets' ? 'SET' : 'PLAYLIST'}
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      {!isEditing && (
        <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-4 mb-6">
          {[
            { id: 'djs', label: 'CAST & DJS', icon: Headphones },
            { id: 'sets', label: 'LIVE SETS', icon: Disc },
            { id: 'playlists', label: 'PLAYLISTS', icon: Music },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-bold transition-all text-sm ${
                activeTab === tab.id 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
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
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase">
                    <th className="pb-3 pt-4 font-medium px-6">DJ</th>
                    <th className="pb-3 pt-4 font-medium">Categoria</th>
                    <th className="pb-3 pt-4 font-medium">Estilo</th>
                    <th className="pb-3 pt-4 font-medium text-center">Destaque</th>
                    <th className="pb-3 pt-4 font-medium text-right px-6">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {djs.map(dj => (
                    <tr key={dj.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {dj.image ? <img src={dj.image} alt={dj.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 shrink-0" /> : <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><Headphones className="w-4 h-4 text-gray-400" /></div>}
                          <div>
                            <p className="text-gray-900 font-bold">{dj.name}</p>
                            <p className="text-gray-400 text-xs">{(dj.socialLinks || []).length} redes</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600 capitalize">{dj.category}</td>
                      <td className="py-4 text-gray-600">{dj.musicStyle}</td>
                      <td className="py-4 text-center">
                        <button title="Destaque" onClick={() => toggleFeatureDJ(dj)} className={`p-2 rounded-lg transition-colors inline-block ${dj.featured ? 'text-admin-accent bg-pink-50' : 'text-gray-300 hover:text-gray-500'}`}>
                          <Star className={`w-4 h-4 ${dj.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => handleEditDJ(dj)} className="p-2 text-gray-400 hover:text-gray-700 transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteDJ(dj.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {djs.length === 0 && (
                    <tr><td colSpan={5} className="py-12 text-center text-gray-400">Nenhum DJ cadastrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'sets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {djSets.map(set => (
                <div key={set.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group shadow-sm">
                  <div className="aspect-video relative bg-gray-100">
                    {set.coverImage && <img src={set.coverImage} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />}
                    <div className="absolute top-2 right-2 bg-gray-900/70 px-2 py-1 rounded text-[10px] font-bold text-white uppercase backdrop-blur-sm">Audio/Video</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-900 font-bold truncate mb-1">{set.title?.pt}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2">{set.description?.pt}</p>
                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button onClick={() => handleEditSet(set)} className="text-gray-400 hover:text-gray-700 p-1" title="Editar"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteSet(set.id)} className="text-gray-400 hover:text-red-500 p-1" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {djSets.length === 0 && <p className="col-span-full py-12 text-center text-gray-400">Nenhum Set cadastrado.</p>}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map(pl => (
                <div key={pl.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  {pl.coverImage ? <img src={pl.coverImage} className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0" alt="" /> : <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Music className="w-6 h-6 text-gray-300" /></div>}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-bold truncate">{pl.title?.pt}</h3>
                    <p className="text-[#1DB954] text-xs font-bold uppercase shrink-0 mt-1 flex items-center gap-1">Spotify</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button title="Editar Playlist" onClick={() => handleEditPlaylist(pl)} className="text-gray-400 hover:text-gray-700 bg-gray-50 p-2 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button title="Excluir Playlist" onClick={() => handleDeletePlaylist(pl.id)} className="text-gray-400 hover:text-red-500 bg-gray-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {playlists.length === 0 && <p className="col-span-full py-12 text-center text-gray-400">Nenhuma Playlist cadastrada.</p>}
            </div>
          )}
        </div>
      ) : (
        /* ================== FORMULÁRIOS ================== */
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
              {activeTab === 'djs' ? (currentDJ.id ? 'EDITAR DJ' : 'NOVO DJ') : 
               activeTab === 'sets' ? (currentSet.id ? 'EDITAR SET' : 'NOVO SET') :
               (currentPlaylist.id ? 'EDITAR PLAYLIST' : 'NOVA PLAYLIST')}
            </h3>
            <button title="Fechar Formulário" onClick={closeForm} className="text-gray-400 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeTab === 'djs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nome do DJ</label>
                  <input type="text" value={currentDJ.name} onChange={e => setCurrentDJ({...currentDJ, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
                    <select value={currentDJ.category} onChange={e => setCurrentDJ({...currentDJ, category: e.target.value as any})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none">
                      <option value="guest">Convidado</option>
                      <option value="resident">Residente</option>
                      <option value="special">Especial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Estilo Musical</label>
                    <input type="text" value={currentDJ.musicStyle || ''} onChange={e => setCurrentDJ({...currentDJ, musicStyle: e.target.value})} placeholder="Open Format..." className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select value={currentDJ.status} onChange={e => setCurrentDJ({...currentDJ, status: e.target.value as any})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none">
                    <option value="active">Ativo</option>
                    <option value="inactive">Oculto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Bio (Texto Curto Padrão)</label>
                  <textarea value={currentDJ.bio?.pt || ''} onChange={e => setCurrentDJ({...currentDJ, bio: {...currentDJ.bio!, pt: e.target.value}})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none min-h-[100px]" />
                </div>
              </div>
              <div className="space-y-4">
                <ImageUploadField
                  label="Foto do DJ (Quadrado para melhor exibição)"
                  value={currentDJ.image || ''}
                  onChange={v => setCurrentDJ({...currentDJ, image: v})}
                  folder="djs"
                  aspect="square"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Link Instagram</label>
                  <input type="url" value={currentDJ.socialLinks?.[0]?.url || ''} onChange={e => setCurrentDJ({...currentDJ, socialLinks: [{platform: 'instagram', url: e.target.value}]})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none" />
                </div>
                <button onClick={handleSaveDJ} className="w-full bg-admin-accent text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-admin-accent-dark transition-colors">
                  <Save className="w-5 h-5" /> Salvar DJ
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Título do Set</label>
                  <input type="text" value={currentSet.title?.pt || ''} onChange={e => setCurrentSet({...currentSet, title: {...currentSet.title!, pt: e.target.value}})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                  <textarea value={currentSet.description?.pt || ''} onChange={e => setCurrentSet({...currentSet, description: {...currentSet.description!, pt: e.target.value}})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">URL de Streaming (Spotify, Soundcloud, YouTube)</label>
                  <input type="url" value={currentSet.externalLink || ''} onChange={e => setCurrentSet({...currentSet, externalLink: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                 <ImageUploadField
                  label="Capa do Set (16:9)"
                  value={currentSet.coverImage || ''}
                  onChange={v => setCurrentSet({...currentSet, coverImage: v})}
                  folder="sets"
                  aspect="video"
                />
                 <button onClick={handleSaveSet} className="w-full bg-admin-accent text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-admin-accent-dark transition-colors">
                  <Save className="w-5 h-5" /> Salvar Set
                 </button>
              </div>
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nome da Playlist</label>
                  <input type="text" value={currentPlaylist.title?.pt || ''} onChange={e => setCurrentPlaylist({...currentPlaylist, title: {...currentPlaylist.title!, pt: e.target.value}})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Descrição Curta</label>
                  <textarea value={currentPlaylist.description?.pt || ''} onChange={e => setCurrentPlaylist({...currentPlaylist, description: {...currentPlaylist.description!, pt: e.target.value}})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Link do Spotify</label>
                  <input type="url" value={currentPlaylist.externalUrl || ''} onChange={e => setCurrentPlaylist({...currentPlaylist, externalUrl: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-admin-accent outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                 <ImageUploadField
                  label="Capa da Playlist (Quadrado)"
                  value={currentPlaylist.coverImage || ''}
                  onChange={v => setCurrentPlaylist({...currentPlaylist, coverImage: v})}
                  folder="playlists"
                  aspect="square"
                />
                 <button onClick={handleSavePlaylist} className="w-full bg-admin-accent text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-admin-accent-dark transition-colors mt-auto">
                   <Save className="w-5 h-5" /> Salvar Playlist
                 </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
