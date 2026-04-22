import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Headphones, Disc, Music, Star } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { DJ, DJSet, Playlist } from '@/types';
import { toast } from 'sonner';

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
    <div className="space-y-6 max-w-[1200px] mx-auto w-full px-4 sm:px-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Music className="w-5 h-5 sm:w-6 sm:h-6 text-[#E91E8C]" /> QM Music
          </h2>
          <p className="text-white/60 mt-1 text-sm sm:text-base">Gerencie o cast oficial, sets gravados e playlists.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 bg-[#E91E8C] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#D81B80] transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> NOVO {activeTab === 'djs' ? 'DJ' : activeTab === 'sets' ? 'SET' : 'PLAYLIST'}
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      {!isEditing && (
        <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-4 mb-6 custom-scrollbar">
          {[
            { id: 'djs', label: 'CAST & DJS', icon: Headphones },
            { id: 'sets', label: 'LIVE SETS', icon: Disc },
            { id: 'playlists', label: 'PLAYLISTS', icon: Music },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#3D4246] text-white' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
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
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs uppercase">
                    <th className="pb-3 font-medium px-4">DJ</th>
                    <th className="pb-3 font-medium">Categoria</th>
                    <th className="pb-3 font-medium">Estilo</th>
                    <th className="pb-3 font-medium text-center">Destaque</th>
                    <th className="pb-3 font-medium text-right px-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {djs.map(dj => (
                    <tr key={dj.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img src={dj.image || 'https://via.placeholder.com/50'} alt={dj.name} className="w-10 h-10 rounded-full object-cover bg-gray-800 shrink-0" />
                          <div>
                            <p className="text-white font-bold">{dj.name}</p>
                            <p className="text-white/50 text-xs">{(dj.socialLinks || []).length} redes</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-white/70 capitalize">{dj.category}</td>
                      <td className="py-4 text-white/70">{dj.musicStyle}</td>
                      <td className="py-4 text-center">
                        <button title="Destaque" onClick={() => toggleFeatureDJ(dj)} className={`p-2 rounded-lg transition-colors inline-block ${dj.featured ? 'text-[#E91E8C] bg-[#E91E8C]/10' : 'text-white/20 hover:text-white/60'}`}>
                          <Star className={`w-4 h-4 ${dj.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button onClick={() => handleEditDJ(dj)} className="p-2 text-white/40 hover:text-white transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteDJ(dj.id)} className="p-2 text-white/40 hover:text-red-500 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {djs.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-white/40">Nenhum DJ cadastrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'sets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {djSets.map(set => (
                <div key={set.id} className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden group">
                  <div className="aspect-video relative bg-black">
                    {set.coverImage && <img src={set.coverImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />}
                    <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-white uppercase backdrop-blur-sm">Audio/Video</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold truncate mb-1">{set.title?.pt}</h3>
                    <p className="text-white/50 text-xs line-clamp-2">{set.description?.pt}</p>
                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-white/10">
                      <button onClick={() => handleEditSet(set)} className="text-white/40 hover:text-white p-1" title="Editar"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteSet(set.id)} className="text-white/40 hover:text-red-500 p-1" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {djSets.length === 0 && <p className="col-span-full py-8 text-center text-white/40">Nenhum Set cadastrado.</p>}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map(pl => (
                <div key={pl.id} className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                  <img src={pl.coverImage || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-lg object-cover bg-gray-800 shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">{pl.title?.pt}</h3>
                    <p className="text-[#1DB954] text-xs font-bold uppercase shrink-0 mt-1 flex items-center gap-1">Spotify</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button title="Editar Playlist" onClick={() => handleEditPlaylist(pl)} className="text-white/40 hover:text-white bg-white/5 p-2 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button title="Excluir Playlist" onClick={() => handleDeletePlaylist(pl.id)} className="text-white/40 hover:text-red-500 bg-white/5 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {playlists.length === 0 && <p className="col-span-full py-8 text-center text-white/40">Nenhuma Playlist cadastrada.</p>}
            </div>
          )}
        </div>
      ) : (
        /* ================== FORMULÁRIOS ================== */
        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 sm:p-6 mb-20 md:mb-0">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase">
              {activeTab === 'djs' ? (currentDJ.id ? 'EDITAR DJ' : 'NOVO DJ') : 
               activeTab === 'sets' ? (currentSet.id ? 'EDITAR SET' : 'NOVO SET') :
               (currentPlaylist.id ? 'EDITAR PLAYLIST' : 'NOVA PLAYLIST')}
            </h3>
            <button title="Fechar Formulário" onClick={closeForm} className="text-white/50 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeTab === 'djs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Nome do DJ</label>
                  <input type="text" value={currentDJ.name} onChange={e => setCurrentDJ({...currentDJ, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-1">Categoria</label>
                    <select value={currentDJ.category} onChange={e => setCurrentDJ({...currentDJ, category: e.target.value as any})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none">
                      <option value="guest">Convidado</option>
                      <option value="resident">Residente</option>
                      <option value="special">Especial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-1">Estilo Musical</label>
                    <input type="text" value={currentDJ.musicStyle || ''} onChange={e => setCurrentDJ({...currentDJ, musicStyle: e.target.value})} placeholder="Open Format..." className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Status</label>
                  <select value={currentDJ.status} onChange={e => setCurrentDJ({...currentDJ, status: e.target.value as any})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none">
                    <option value="active">Ativo</option>
                    <option value="inactive">Oculto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Bio (Texto Curto Padrão)</label>
                  <textarea value={currentDJ.bio?.pt || ''} onChange={e => setCurrentDJ({...currentDJ, bio: {...currentDJ.bio!, pt: e.target.value}})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none min-h-[100px]" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">URL da Foto (Quadrado para melhor exibição)</label>
                  <input type="url" value={currentDJ.image || ''} onChange={e => setCurrentDJ({...currentDJ, image: e.target.value})} placeholder="https://..." className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none mb-2" />
                  {currentDJ.image && <img src={currentDJ.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-white/10" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Link Instagram</label>
                  <input type="url" value={currentDJ.socialLinks?.[0]?.url || ''} onChange={e => setCurrentDJ({...currentDJ, socialLinks: [{platform: 'instagram', url: e.target.value}]})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none" />
                </div>
                <button onClick={handleSaveDJ} className="w-full bg-[#E91E8C] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#D81B80]">
                  <Save className="w-5 h-5" /> Salvar DJ
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Título do Set</label>
                  <input type="text" value={currentSet.title?.pt || ''} onChange={e => setCurrentSet({...currentSet, title: {...currentSet.title!, pt: e.target.value}})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Descrição</label>
                  <textarea value={currentSet.description?.pt || ''} onChange={e => setCurrentSet({...currentSet, description: {...currentSet.description!, pt: e.target.value}})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">URL de Streaming (Spotify, Souncloud, YouTube)</label>
                  <input type="url" value={currentSet.externalLink || ''} onChange={e => setCurrentSet({...currentSet, externalLink: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">URL da Capa do Set (16:9)</label>
                  <input type="url" value={currentSet.coverImage || ''} onChange={e => setCurrentSet({...currentSet, coverImage: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none mb-2" />
                  {currentSet.coverImage && <img src={currentSet.coverImage} alt="Preview" className="w-full aspect-video object-cover rounded-lg border border-white/10" />}
                 </div>
                 <button onClick={handleSaveSet} className="w-full bg-[#E91E8C] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#D81B80]">
                  <Save className="w-5 h-5" /> Salvar Set
                 </button>
              </div>
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Nome da Playlist</label>
                  <input type="text" value={currentPlaylist.title?.pt || ''} onChange={e => setCurrentPlaylist({...currentPlaylist, title: {...currentPlaylist.title!, pt: e.target.value}})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Descrição Curta</label>
                  <textarea value={currentPlaylist.description?.pt || ''} onChange={e => setCurrentPlaylist({...currentPlaylist, description: {...currentPlaylist.description!, pt: e.target.value}})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Link do Spotify</label>
                  <input type="url" value={currentPlaylist.externalUrl || ''} onChange={e => setCurrentPlaylist({...currentPlaylist, externalUrl: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-white/50 mb-1">Capa da Playlist (Aspect Square)</label>
                  <input type="url" value={currentPlaylist.coverImage || ''} onChange={e => setCurrentPlaylist({...currentPlaylist, coverImage: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#E91E8C] outline-none mb-2" />
                  {currentPlaylist.coverImage && <img src={currentPlaylist.coverImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-white/10" />}
                 </div>
                 <button onClick={handleSavePlaylist} className="w-full bg-[#E91E8C] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#D81B80] mt-auto">
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
