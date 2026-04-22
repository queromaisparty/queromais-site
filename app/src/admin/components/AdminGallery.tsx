import { useState } from 'react';
import {
  Plus, Trash2, Edit3, Image as ImageIcon, Eye, EyeOff,
  Upload, Link2, X, FolderOpen, Camera
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import type { GalleryAlbum, GalleryImage } from '@/types';
import { extractFolderId, getGDriveImageUrl, listGDriveImages } from '@/services/googleDrive';

type ViewMode = 'list' | 'form';

export function AdminGallery() {
  const { galleryAlbums, addGalleryAlbum, updateGalleryAlbum, deleteGalleryAlbum } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    category: '',
    status: 'active' as 'active' | 'inactive',
    images: [] as GalleryImage[],
    gdriveLink: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      coverImage: '', 
      category: '',
      status: 'active', 
      images: [], 
      gdriveLink: '',
    });
    setEditingId(null);
  };

  const handleNew = () => { resetForm(); setViewMode('form'); };

  const handleEdit = (album: GalleryAlbum) => {
    setFormData({
      title: album.title,
      description: album.description,
      coverImage: album.coverImage,
      category: album.category || '',
      status: album.status || 'active',
      images: album.images,
      gdriveLink: '',
    });
    setEditingId(album.id);
    setViewMode('form');
  };

  const handleDelete = (id: string) => {
    deleteGalleryAlbum(id);
    toast.success('Álbum excluído');
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (album: GalleryAlbum) => {
    updateGalleryAlbum(album.id, { status: album.status === 'active' ? 'inactive' : 'active' });
    toast.success(album.status === 'active' ? 'Álbum ocultado' : 'Álbum publicado');
  };

  const [imageUrlInput, setImageUrlInput] = useState('');
  const addImageByUrl = () => {
    if (!imageUrlInput.trim()) return;
    const newImg: GalleryImage = {
      id: Date.now().toString(),
      url: imageUrlInput.trim(),
      downloadAllowed: true,
      source: 'url',
    };
    setFormData(prev => ({ ...prev, images: [...prev.images, newImg] }));
    setImageUrlInput('');
  };

  const [isSyncing, setIsSyncing] = useState(false);

  const addFromGDrive = async () => {
    const folderId = extractFolderId(formData.gdriveLink);
    if (!folderId) {
      toast.error('Link inválido do Google Drive');
      return;
    }
    
    setIsSyncing(true);
    try {
      const gdriveFiles = await listGDriveImages(folderId);
      
      if (gdriveFiles.length === 0) {
        toast.warning('Nenhuma imagem encontrada na pasta. Verifique se é pública.');
        return;
      }

      const newImages = gdriveFiles.map(f => ({
        id: `gdrive-${f.id}`,
        url: f.fullUrl,
        downloadAllowed: true,
        source: 'gdrive' as const,
        gdriveId: f.id,
      }));

      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      toast.success(`${newImages.length} imagens sincronizadas com sucesso!`);
    } catch {
      toast.error('Erro ao sincronizar pasta. Verifique os logs.');
    } finally {
      setIsSyncing(false);
    }
  };

  const [gdriveFileId, setGdriveFileId] = useState('');
  const addSingleGDriveFile = () => {
    if (!gdriveFileId.trim()) return;
    const url = getGDriveImageUrl(gdriveFileId.trim());
    const newImg: GalleryImage = {
      id: Date.now().toString(),
      url,
      downloadAllowed: true,
      source: 'gdrive',
      gdriveId: gdriveFileId.trim(),
    };
    setFormData(prev => ({ ...prev, images: [...prev.images, newImg] }));
    setGdriveFileId('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newImg: GalleryImage = {
          id: Date.now().toString() + Math.random().toString(),
          url: base64,
          downloadAllowed: true,
          source: 'upload',
        };
        setFormData(prev => ({ ...prev, images: [...prev.images, newImg] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
    toast.success('Imagens locais anexadas temporariamente');
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('O Título principal é obrigatório');
      return;
    }
    
    // Convert to the exact GalleryAlbum omitting readonly stuff
    const albumData: Omit<GalleryAlbum, 'id' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      coverImage: formData.coverImage || (formData.images[0]?.url || ''),
      images: formData.images,
      videos: [],
      category: formData.category || undefined,
      order: galleryAlbums.length,
      featured: false, // Hidden logic
      status: formData.status,
    };

    if (editingId) {
      updateGalleryAlbum(editingId, albumData);
      toast.success('Álbum atualizado e salvo');
    } else {
      addGalleryAlbum(albumData);
      toast.success('Novo Álbum publicado com sucesso');
    }
    resetForm();
    setViewMode('list');
  };

  const inputCls = "w-full px-3 py-2 bg-white border border-[#E8E8ED] rounded-lg text-[#1A1A2E] text-sm placeholder:text-[#9CA3AF] focus:border-qm-magenta focus:outline-none transition-colors";

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
              Você na Quero Mais (Galeria)
            </h2>
            <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
              {galleryAlbums.length} Álbuns Cadastrados
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-qm-magenta text-white font-bold rounded-xl hover:bg-qm-magenta-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Álbum
          </button>
        </div>

        {galleryAlbums.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: '#FFFFFF', border: '1px solid #E8E8ED' }}>
            <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
            <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A2E' }}>Nenhum álbum ainda</h3>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#9CA3AF' }}>
              Crie seu primeiro álbum para liberar a prateleira de fotos do público.
            </p>
            <button onClick={handleNew} className="inline-flex items-center gap-2 px-6 py-3 bg-qm-magenta text-white font-bold rounded-xl hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
              Criar Primeiro Álbum
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {galleryAlbums
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(album => (
                <div
                  key={album.id}
                  className="rounded-xl overflow-hidden transition-all group"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${album.status === 'inactive' ? '#F3F4F6' : '#E8E8ED'}`,
                    opacity: album.status === 'inactive' ? 0.6 : 1,
                    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="aspect-[16/10] overflow-hidden relative" style={{ background: '#F9FAFB' }}>
                    {album.coverImage ? (
                      <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10" style={{ color: '#D1D5DB' }} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(album)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors"
                        style={{ background: album.status === 'active' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(0,0,0,0.5)', color: '#FFF' }}
                        title={album.status === 'active' ? 'Ocultar' : 'Publicar'}
                      >
                        {album.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="max-w-[80%]">
                        <span className="text-[10px] font-bold uppercase tracking-wider mb-1 block" style={{ color: 'var(--primary-color)' }}>
                          {album.category || 'Geral'}
                        </span>
                        <h3 className="font-bold text-base truncate" style={{ color: '#1A1A2E' }}>{album.title}</h3>
                        <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{album.description || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs font-medium" style={{ color: '#6B7280' }}>
                        {album.images.length} Fotos
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(album)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: '#F3F4F6', color: '#4B5563' }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        {deleteConfirm === album.id ? (
                          <div className="flex bg-red-50 rounded-lg overflow-hidden border border-red-100">
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1.5 text-xs font-semibold text-gray-500 hover:bg-red-100 transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleDelete(album.id)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                            >
                              Sim, excluir
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(album.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-500"
                            style={{ color: '#9CA3AF' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  // ─────────────── FORM VIEW ───────────────
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
          {editingId ? 'Editar Álbum' : 'Novo Álbum'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: '#4B5563' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-bold bg-qm-magenta text-white rounded-lg hover:bg-qm-magenta-dark transition-colors"
          >
            {editingId ? 'Salvar Alterações' : 'Publicar Álbum'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl" style={{ border: '1px solid #E8E8ED', boxShadow: '0 1px 12px rgba(0,0,0,0.03)' }}>
        <h3 className="text-base font-bold mb-4 border-b pb-2" style={{ color: '#1A1A2E', borderColor: '#F3F4F6' }}>
          Informações Básicas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#4B5563' }}>Título do Álbum (PT-BR) *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Mainstage Quero Mais 2026"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#4B5563' }}>Categoria ou Evento Associado</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Ex: Fica Mais Party"
              className={inputCls}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold mb-1" style={{ color: '#4B5563' }}>Descrição Curta (Opcional)</label>
          <input
            type="text"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Um breve texto para o álbum"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#4B5563' }}>Status de Visibilidade</label>
            <select
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              className={inputCls}
            >
              <option value="active">Ativado (Público)</option>
              <option value="inactive">Desativado (Rascunho / Oculto)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#4B5563' }}>URL da Imagem de Capa (Opcional)</label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={e => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
              placeholder="https://..."
              className={inputCls}
            />
            <p className="text-[10px] mt-1" style={{ color: '#9CA3AF' }}>Se vazio, usa a primeira foto do álbum.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl mt-6" style={{ border: '1px solid #E8E8ED', boxShadow: '0 1px 12px rgba(0,0,0,0.03)' }}>
        <div className="flex items-center justify-between mb-4 border-b pb-2" style={{ borderColor: '#F3F4F6' }}>
          <h3 className="text-base font-bold" style={{ color: '#1A1A2E' }}>
            Repositório de Fotos ({formData.images.length})
          </h3>
          <span className="text-xs font-bold" style={{ color: 'var(--primary-color)' }}>Uploads e Links</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* PAINEL ESQUERDO: UPLOADERS */}
          <div className="space-y-4">
            
            <div className="p-4 rounded-xl border border-dashed" style={{ borderColor: 'var(--primary-color)', background: '#FDF2F8' }}>
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--primary-color)' }}>Upload Local (Direto do PC)</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-qm-magenta file:text-white hover:file:bg-qm-magenta-dark cursor-pointer"
              />
            </div>
            
            <div className="p-4 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E8E8ED' }}>
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span className="text-sm font-bold" style={{ color: '#4B5563' }}>Adicionar por URL Pública</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://sua-imagem.jpg"
                  className={inputCls}
                  value={imageUrlInput}
                  onChange={e => setImageUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addImageByUrl()}
                />
                <button onClick={addImageByUrl} className="px-3 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 font-bold">+</button>
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E8E8ED' }}>
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">Sincronizar Google Drive</span>
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="URL da Pasta do Drive"
                  className={inputCls}
                  value={formData.gdriveLink}
                  onChange={e => setFormData(prev => ({ ...prev, gdriveLink: e.target.value }))}
                />
                <button 
                  onClick={addFromGDrive} 
                  disabled={isSyncing}
                  className={`px-3 ${isSyncing ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} text-sm rounded-lg font-bold items-center flex`}
                >
                  {isSyncing ? 'Lendo...' : 'Sync'}
                </button>
              </div>
              
              {extractFolderId(formData.gdriveLink) && (
                <div className="flex gap-2 border-t pt-2 border-gray-200 mt-2">
                  <input
                    type="text"
                    placeholder="ID ou URL da Imagem exata"
                    className={inputCls}
                    value={gdriveFileId}
                    onChange={e => setGdriveFileId(e.target.value)}
                  />
                  <button onClick={addSingleGDriveFile} className="px-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-bold">+</button>
                </div>
              )}
            </div>
            
          </div>

          {/* PAINEL DIREITO: GRID DE PREVIEW */}
          <div>
            {formData.images.length === 0 ? (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                <span className="text-sm font-medium">Nenhuma foto no álbum.</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.images.map((img, i) => (
                  <div key={img.id || i} className="aspect-square relative rounded-lg overflow-hidden group border border-gray-200">
                    <img src={img.url} alt="Foto" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter(x => x.id !== img.id) }))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-right text-xs text-gray-500 mt-2">
              Total: {formData.images.length} fotos anexadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
