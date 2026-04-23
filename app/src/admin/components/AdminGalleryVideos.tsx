import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Youtube, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Star, 
  Trash2, 
  Edit2, 
  ExternalLink,
  Eye,
  CheckCircle,
  Layout,
  Play,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import type { GalleryVideoYoutube } from '@/types';

export function AdminGalleryVideos() {
  const { t } = useLanguage();
  const { galleryVideos, addGalleryVideo, updateGalleryVideo, deleteGalleryVideo } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<GalleryVideoYoutube, 'id' | 'createdAt'>>({
    title: { pt: '', en: '', es: '' },
    youtubeUrl: '',
    youtubeId: '',
    thumbnailUrl: '',
    category: 'voce-nao-quer-mais',
    isFeatured: false,
    description: { pt: '', en: '', es: '' },
    eventDate: new Date().toISOString().split('T')[0],
    status: 'published',
    displayOrder: 0
  });

  // Extract YouTube ID Helper
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleUrlChange = (url: string) => {
    const id = getYouTubeId(url);
    if (id) {
      setFormData(prev => ({
        ...prev,
        youtubeUrl: url,
        youtubeId: id,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
      }));
    } else {
      setFormData(prev => ({ ...prev, youtubeUrl: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.youtubeId) {
      toast.error('URL do YouTube inválida');
      return;
    }

    if (formData.isFeatured) {
      const existingFeatured = galleryVideos.find(v => v.isFeatured && v.category === formData.category && v.id !== editingId);
      if (existingFeatured) {
        if (!confirm(`Já existe um vídeo em destaque nesta categoria. Deseja substituir?`)) {
          return;
        }
        await updateGalleryVideo(existingFeatured.id, { isFeatured: false });
      }
    }

    try {
      if (isEditing && editingId) {
        await updateGalleryVideo(editingId, formData);
        toast.success('Vídeo atualizado com sucesso!');
      } else {
        await addGalleryVideo(formData);
        toast.success('Vídeo cadastrado com sucesso!');
      }
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar vídeo');
    }
  };

  const resetForm = () => {
    setFormData({
      title: { pt: '', en: '', es: '' },
      youtubeUrl: '',
      youtubeId: '',
      thumbnailUrl: '',
      category: 'voce-nao-quer-mais',
      isFeatured: false,
      description: { pt: '', en: '', es: '' },
      eventDate: new Date().toISOString().split('T')[0],
      status: 'published',
      displayOrder: 0
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (video: GalleryVideoYoutube) => {
    setFormData({
      title: video.title,
      youtubeUrl: video.youtubeUrl,
      youtubeId: video.youtubeId,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category,
      isFeatured: video.isFeatured,
      description: video.description || { pt: '', en: '', es: '' },
      eventDate: video.eventDate || new Date().toISOString().split('T')[0],
      status: video.status,
      displayOrder: video.displayOrder
    });
    setEditingId(video.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este vídeo?')) {
      await deleteGalleryVideo(id);
      toast.success('Vídeo removido');
    }
  };

  const filteredVideos = useMemo(() => {
    return galleryVideos
      .filter(v => {
        const matchesSearch = v.title.pt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [galleryVideos, searchTerm, filterStatus]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600" />
            Gestão de After Movies (YouTube)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Cadastre os vídeos do YouTube para a seção "Você Não Quer Mais"
          </p>
        </div>
        <button 
          onClick={resetForm}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#111] text-white hover:bg-qm-magenta transition-colors font-bold uppercase text-xs tracking-wider"
        >
          <Plus className="w-4 h-4" />
          Novo Vídeo
        </button>
      </div>

      <div className="bg-white border border-gray-100 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Idiomas */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Títulos e Traduções</label>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5">Português (PT)*</label>
                    <input 
                      type="text" required value={formData.title.pt}
                      onChange={e => setFormData(prev => ({ ...prev, title: { ...prev.title, pt: e.target.value } }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-sm focus:border-red-600 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5">Inglês (EN)</label>
                      <input 
                        type="text" value={formData.title.en}
                        onChange={e => setFormData(prev => ({ ...prev, title: { ...prev.title, en: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-sm focus:border-red-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5">Espanhol (ES)</label>
                      <input 
                        type="text" value={formData.title.es}
                        onChange={e => setFormData(prev => ({ ...prev, title: { ...prev.title, es: e.target.value } }))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-sm focus:border-red-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* YouTube URL */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">URL do YouTube*</label>
                <div className="relative">
                  <input 
                    type="url" required value={formData.youtubeUrl}
                    onChange={e => handleUrlChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-sm outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <Youtube className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                </div>
              </div>

              {/* Configurações Adicionais */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5">Data do Evento</label>
                  <input 
                    type="date" value={formData.eventDate}
                    onChange={e => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5">Ordem de Exibição</label>
                  <input 
                    type="number" value={formData.displayOrder}
                    onChange={e => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Descrições */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Breve Descrição</label>
                <div className="space-y-3">
                  <textarea 
                    placeholder="Descrição em Português..."
                    value={formData.description?.pt}
                    onChange={e => setFormData(prev => ({ ...prev, description: { ...prev.description!, pt: e.target.value } }))}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-xs h-16 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <textarea 
                      placeholder="English description..."
                      value={formData.description?.en}
                      onChange={e => setFormData(prev => ({ ...prev, description: { ...prev.description!, en: e.target.value } }))}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-xs h-16 outline-none"
                    />
                    <textarea 
                      placeholder="Descripción en Español..."
                      value={formData.description?.es}
                      onChange={e => setFormData(prev => ({ ...prev, description: { ...prev.description!, es: e.target.value } }))}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-xs h-16 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status e Destaque */}
              <div className="flex items-center gap-6 p-4 bg-gray-50 border border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" checked={formData.isFeatured}
                    onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-qm-magenta border-gray-300 rounded"
                  />
                  <span className="text-[10px] font-black uppercase text-gray-600 flex items-center gap-1">
                    <Star className={`w-3 h-3 ${formData.isFeatured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    Destaque (Hero)
                  </span>
                </label>

                <div className="flex-1">
                  <select 
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-transparent border-0 border-b border-gray-200 text-[10px] font-black uppercase py-1 outline-none"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="aspect-video bg-gray-100 border border-gray-200 overflow-hidden relative group">
                {formData.thumbnailUrl ? (
                  <>
                    <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layout className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button 
              type="button" onClick={resetForm}
              className="px-6 py-2.5 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-qm-magenta text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
            >
              {isEditing ? 'Atualizar Vídeo' : 'Salvar Vídeo'}
            </button>
          </div>
        </form>
      </div>

      {/* Listagem */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" placeholder="Buscar por título..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 text-xs outline-none"
            />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-left">Vídeo</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-left">Título PT</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-left">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredVideos.map(video => (
              <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-24 aspect-video bg-black relative group cursor-pointer" onClick={() => setShowPreview(video.youtubeId)}>
                    <img src={video.thumbnailUrl} className="w-full h-full object-cover opacity-80" />
                    <Play className="absolute inset-0 m-auto w-4 h-4 text-white fill-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#111] uppercase">{video.title.pt}</span>
                    <span className="text-[10px] text-gray-400 font-mono mt-1">{video.youtubeId}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${video.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {video.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(video)} className="p-2 text-gray-400 hover:text-[#111] transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(video.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowPreview(null)} />
          <div className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl">
            <button onClick={() => setShowPreview(null)} className="absolute -top-12 right-0 p-2 text-white hover:text-red-500"><X className="w-8 h-8" /></button>
            <iframe src={`https://www.youtube.com/embed/${showPreview}?autoplay=1`} className="w-full h-full border-0" allowFullScreen />
          </div>
        </div>
      )}
    </div>
  );
}
