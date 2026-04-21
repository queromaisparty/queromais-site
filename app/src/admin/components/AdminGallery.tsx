import { useState } from 'react';
import {
  Plus, Trash2, Edit3, Image as ImageIcon, Eye, EyeOff,
  Star, StarOff, Upload, Link2, X, FolderOpen, Camera
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import type { GalleryAlbum, GalleryImage } from '@/types';
import { extractFolderId, getGDriveImageUrl } from '@/services/googleDrive';

type ViewMode = 'list' | 'form';

export function AdminGallery() {
  const { t } = useLanguage();
  const { galleryAlbums, addGalleryAlbum, updateGalleryAlbum, deleteGalleryAlbum } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titlePt: '', titleEn: '', titleEs: '',
    descPt: '', descEn: '', descEs: '',
    coverImage: '',
    category: '',
    featured: false,
    status: 'active' as 'active' | 'inactive',
    images: [] as GalleryImage[],
    gdriveLink: '',
  });

  const resetForm = () => {
    setFormData({
      titlePt: '', titleEn: '', titleEs: '',
      descPt: '', descEn: '', descEs: '',
      coverImage: '', category: '', featured: false,
      status: 'active', images: [], gdriveLink: '',
    });
    setEditingId(null);
  };

  const handleNew = () => { resetForm(); setViewMode('form'); };

  const handleEdit = (album: GalleryAlbum) => {
    setFormData({
      titlePt: album.title.pt, titleEn: album.title.en || '', titleEs: album.title.es || '',
      descPt: album.description.pt, descEn: album.description.en || '', descEs: album.description.es || '',
      coverImage: album.coverImage,
      category: album.category || '',
      featured: album.featured || false,
      status: album.status || 'active',
      images: album.images,
      gdriveLink: '',
    });
    setEditingId(album.id);
    setViewMode('form');
  };

  const handleDelete = (id: string) => {
    deleteGalleryAlbum(id);
    toast.success(t({ pt: 'Álbum excluído', en: 'Album deleted', es: 'Álbum eliminado' }));
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (album: GalleryAlbum) => {
    updateGalleryAlbum(album.id, { status: album.status === 'active' ? 'inactive' : 'active' });
    toast.success(t({
      pt: album.status === 'active' ? 'Álbum desativado' : 'Álbum ativado',
      en: album.status === 'active' ? 'Album deactivated' : 'Album activated',
      es: album.status === 'active' ? 'Álbum desactivado' : 'Álbum activado',
    }));
  };

  const handleToggleFeatured = (album: GalleryAlbum) => {
    updateGalleryAlbum(album.id, { featured: !album.featured });
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

  const addFromGDrive = () => {
    const folderId = extractFolderId(formData.gdriveLink);
    if (!folderId) {
      toast.error(t({ pt: 'Link inválido do Google Drive', en: 'Invalid Google Drive link', es: 'Enlace inválido de Google Drive' }));
      return;
    }
    toast.info(t({ pt: 'Pasta conectada! Cole os IDs dos arquivos individuais abaixo.', en: 'Folder connected! Paste individual file IDs below.', es: 'Carpeta conectada! Pega los IDs individuales abajo.' }));
  };

  const [gdriveFileId, setGdriveFileId] = useState('');
  const addGDriveImage = () => {
    if (!gdriveFileId.trim()) return;
    const fileId = gdriveFileId.trim();
    const newImg: GalleryImage = {
      id: `gdrive-${fileId}`,
      url: getGDriveImageUrl(fileId, 'full'),
      downloadAllowed: true,
      source: 'gdrive',
      gdriveId: fileId,
    };
    setFormData(prev => ({ ...prev, images: [...prev.images, newImg] }));
    setGdriveFileId('');
    toast.success(t({ pt: 'Imagem do Drive adicionada', en: 'Drive image added', es: 'Imagen del Drive agregada' }));
  };

  const removeImage = (imgId: string) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(i => i.id !== imgId) }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 1200;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) { height = (height / width) * maxSize; width = maxSize; }
            else { width = (width / height) * maxSize; height = maxSize; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.8);
          const newImg: GalleryImage = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            url: compressed,
            downloadAllowed: true,
            source: 'upload',
            width,
            height,
          };
          setFormData(prev => ({ ...prev, images: [...prev.images, newImg] }));
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
    toast.success(t({ pt: 'Imagens carregadas', en: 'Images uploaded', es: 'Imágenes cargadas' }));
  };

  const handleSave = () => {
    if (!formData.titlePt.trim()) {
      toast.error(t({ pt: 'Título é obrigatório', en: 'Title is required', es: 'El título es obligatorio' }));
      return;
    }
    const albumData: Omit<GalleryAlbum, 'id' | 'createdAt'> = {
      title: { pt: formData.titlePt, en: formData.titleEn || formData.titlePt, es: formData.titleEs || formData.titlePt },
      description: { pt: formData.descPt, en: formData.descEn || formData.descPt, es: formData.descEs || formData.descPt },
      coverImage: formData.coverImage || (formData.images[0]?.url || ''),
      images: formData.images,
      videos: [],
      category: formData.category || undefined,
      order: galleryAlbums.length,
      featured: formData.featured,
      status: formData.status,
    };
    if (editingId) {
      updateGalleryAlbum(editingId, albumData);
      toast.success(t({ pt: 'Álbum atualizado', en: 'Album updated', es: 'Álbum actualizado' }));
    } else {
      addGalleryAlbum(albumData);
      toast.success(t({ pt: 'Álbum criado', en: 'Album created', es: 'Álbum creado' }));
    }
    resetForm();
    setViewMode('list');
  };

  // ── INPUT CLASSES (light theme) ──
  const inputCls = "w-full px-3 py-2 bg-white border border-[#E8E8ED] rounded-lg text-[#1A1A2E] text-sm placeholder:text-[#9CA3AF] focus:border-[#E91E8C] focus:outline-none";

  // ─────────────── LIST VIEW ───────────────
  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
              {t({ pt: 'Você na Quero Mais', en: 'You at QM', es: 'Usted en QM' })}
            </h2>
            <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
              {galleryAlbums.length} {t({ pt: 'álbuns', en: 'albums', es: 'álbumes' })}
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E91E8C] text-white font-bold rounded-xl hover:bg-[#D81B80] transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t({ pt: 'Novo Álbum', en: 'New Album', es: 'Nuevo Álbum' })}
          </button>
        </div>

        {galleryAlbums.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: '#FFFFFF', border: '1px solid #E8E8ED' }}>
            <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
            <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A2E' }}>
              {t({ pt: 'Nenhum álbum ainda', en: 'No albums yet', es: 'Sin álbumes aún' })}
            </h3>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#9CA3AF' }}>
              {t({ pt: 'Crie seu primeiro álbum para exibir fotos na área Você na QM.', en: 'Create your first album to display photos on the website.', es: 'Crea tu primer álbum para mostrar fotos en el sitio.' })}
            </p>
            <button onClick={handleNew} className="inline-flex items-center gap-2 px-6 py-3 bg-[#E91E8C] text-white font-bold rounded-xl">
              <Plus className="w-4 h-4" />
              {t({ pt: 'Criar Álbum', en: 'Create Album', es: 'Crear Álbum' })}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {galleryAlbums
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(album => (
                <div
                  key={album.id}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${album.status === 'inactive' ? '#F3F4F6' : '#E8E8ED'}`,
                    opacity: album.status === 'inactive' ? 0.6 : 1,
                    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="aspect-[16/10] overflow-hidden relative" style={{ background: '#F9FAFB' }}>
                    {album.coverImage ? (
                      <img src={album.coverImage} alt={album.title.pt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10" style={{ color: '#D1D5DB' }} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      {album.featured && (
                        <span className="px-2 py-0.5 bg-yellow-500/90 text-black text-[10px] font-bold rounded-full uppercase">Destaque</span>
                      )}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${album.status === 'active' ? 'bg-[#E91E8C]/90 text-white' : 'bg-red-500/90 text-white'}`}>
                        {album.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold truncate" style={{ color: '#1A1A2E' }}>{album.title.pt}</h4>
                    <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                      {album.images.length} fotos{album.category && ` · ${album.category}`}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(album)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: '#F3F4F6', color: '#6B7280' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FCE7F3'; (e.currentTarget as HTMLElement).style.color = '#E91E8C'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {t({ pt: 'Editar', en: 'Edit', es: 'Editar' })}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(album)}
                        className="px-3 py-2 rounded-lg transition-colors"
                        style={{ background: '#F3F4F6', color: '#6B7280' }}
                        title={album.status === 'active' ? 'Desativar' : 'Ativar'}
                      >
                        {album.status === 'active' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(album)}
                        className="px-3 py-2 rounded-lg transition-colors"
                        style={{ background: '#F3F4F6', color: album.featured ? '#F59E0B' : '#6B7280' }}
                        title="Destaque"
                      >
                        {album.featured ? <Star className="w-3.5 h-3.5 fill-yellow-400" /> : <StarOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(album.id)}
                        className="px-3 py-2 rounded-lg transition-colors"
                        style={{ background: '#F3F4F6', color: '#6B7280' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {deleteConfirm === album.id && (
                    <div className="p-3 flex items-center justify-between" style={{ background: '#FEF2F2', borderTop: '1px solid #FECACA' }}>
                      <span className="text-xs font-medium" style={{ color: '#EF4444' }}>Confirmar exclusão?</span>
                      <div className="flex gap-2">
                        <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 text-xs" style={{ color: '#6B7280' }}>Não</button>
                        <button onClick={() => handleDelete(album.id)} className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">Sim, excluir</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  // ─────────────── FORM VIEW ───────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
          {editingId
            ? t({ pt: 'Editar Álbum', en: 'Edit Album', es: 'Editar Álbum' })
            : t({ pt: 'Novo Álbum', en: 'New Album', es: 'Nuevo Álbum' })}
        </h2>
        <button
          onClick={() => { resetForm(); setViewMode('list'); }}
          className="text-sm transition-colors"
          style={{ color: '#9CA3AF' }}
        >
          ← {t({ pt: 'Voltar', en: 'Back', es: 'Volver' })}
        </button>
      </div>

      <div className="rounded-2xl p-6 space-y-6" style={{ background: '#FFFFFF', border: '1px solid #E8E8ED', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>

        {/* Title */}
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: '#374151' }}>
            {t({ pt: 'Título *', en: 'Title *', es: 'Título *' })}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>🇧🇷 PT</span>
              <input type="text" value={formData.titlePt} onChange={e => setFormData(p => ({ ...p, titlePt: e.target.value }))} placeholder="Título em português" className={`${inputCls} mt-1`} />
            </div>
            <div>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>🇺🇸 EN</span>
              <input type="text" value={formData.titleEn} onChange={e => setFormData(p => ({ ...p, titleEn: e.target.value }))} placeholder="Title in English" className={`${inputCls} mt-1`} />
            </div>
            <div>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>🇪🇸 ES</span>
              <input type="text" value={formData.titleEs} onChange={e => setFormData(p => ({ ...p, titleEs: e.target.value }))} placeholder="Título en español" className={`${inputCls} mt-1`} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: '#374151' }}>
            {t({ pt: 'Descrição', en: 'Description', es: 'Descripción' })}
          </label>
          <textarea
            value={formData.descPt}
            onChange={e => setFormData(p => ({ ...p, descPt: e.target.value }))}
            placeholder="Descrição do álbum..."
            rows={2}
            className="w-full px-3 py-2 bg-white border border-[#E8E8ED] rounded-lg text-[#1A1A2E] text-sm placeholder:text-[#9CA3AF] focus:border-[#E91E8C] focus:outline-none resize-none"
          />
        </div>

        {/* Category + Status + Featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: '#374151' }}>Categoria</label>
            <input type="text" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} placeholder="Ex: Festas, Shows..." className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: '#374151' }}>Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
              className="w-full px-3 py-2 bg-white border border-[#E8E8ED] rounded-lg text-[#1A1A2E] text-sm focus:border-[#E91E8C] focus:outline-none"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.featured} onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 accent-[#E91E8C]" />
              <span className="text-sm" style={{ color: '#374151' }}>Destaque</span>
            </label>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: '#374151' }}>
            {t({ pt: 'Imagem de capa (URL)', en: 'Cover image (URL)', es: 'Imagen de portada (URL)' })}
          </label>
          <input type="text" value={formData.coverImage} onChange={e => setFormData(p => ({ ...p, coverImage: e.target.value }))} placeholder="https://..." className={inputCls} />
          {formData.coverImage && <img src={formData.coverImage} alt="Cover preview" className="mt-2 h-24 rounded-lg object-cover" />}
        </div>

        <hr style={{ borderColor: '#E8E8ED' }} />

        {/* Images */}
        <div>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#1A1A2E' }}>
            <ImageIcon className="w-4 h-4" />
            {t({ pt: 'Imagens', en: 'Images', es: 'Imágenes' })} ({formData.images.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* File upload */}
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors" style={{ background: '#FCE7F3', border: '1px solid #F9A8D4' }}>
              <Upload className="w-4 h-4" style={{ color: '#E91E8C' }} />
              <span className="text-sm font-medium" style={{ color: '#E91E8C' }}>Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            </label>

            {/* URL input */}
            <div className="flex gap-2">
              <input type="text" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} placeholder="URL da imagem..." className={inputCls} onKeyDown={e => e.key === 'Enter' && addImageByUrl()} />
              <button onClick={addImageByUrl} className="px-3 py-2 rounded-lg transition-colors" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                <Link2 className="w-4 h-4" />
              </button>
            </div>

            {/* GDrive file ID */}
            <div className="flex gap-2">
              <input type="text" value={gdriveFileId} onChange={e => setGdriveFileId(e.target.value)} placeholder="ID do arquivo Google Drive" className={inputCls} onKeyDown={e => e.key === 'Enter' && addGDriveImage()} />
              <button onClick={addGDriveImage} className="px-3 py-2 rounded-lg transition-colors" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                <FolderOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* GDrive folder link */}
          <div className="mb-4 p-3 rounded-lg" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="w-4 h-4" style={{ color: '#3B82F6' }} />
              <span className="text-sm font-medium" style={{ color: '#3B82F6' }}>Google Drive</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.gdriveLink}
                onChange={e => setFormData(p => ({ ...p, gdriveLink: e.target.value }))}
                placeholder="Cole o link da pasta do Google Drive..."
                className="flex-1 px-3 py-2 bg-white border border-[#BFDBFE] rounded-lg text-[#1A1A2E] text-sm placeholder:text-[#9CA3AF] focus:border-[#3B82F6] focus:outline-none"
              />
              <button onClick={addFromGDrive} className="px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                Conectar
              </button>
            </div>
            <p className="text-xs mt-1.5" style={{ color: '#93C5FD' }}>
              A pasta deve ser pública. Após conectar, cole os IDs dos arquivos individuais acima.
            </p>
          </div>

          {/* Image preview grid */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {formData.images.map((img, idx) => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden" style={{ background: '#F3F4F6' }}>
                  <img src={img.url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  {img.source === 'gdrive' && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-blue-500/80 text-white text-[8px] font-bold rounded uppercase">Drive</span>
                  )}
                  {idx === 0 && !formData.coverImage && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#E91E8C]/80 text-white text-[8px] font-bold rounded uppercase">Capa</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <hr style={{ borderColor: '#E8E8ED' }} />

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleSave} className="flex-1 px-6 py-3 bg-[#E91E8C] text-white font-bold rounded-xl hover:bg-[#D81B80] transition-colors">
            {editingId
              ? t({ pt: 'Salvar Alterações', en: 'Save Changes', es: 'Guardar Cambios' })
              : t({ pt: 'Criar Álbum', en: 'Create Album', es: 'Crear Álbum' })}
          </button>
          <button
            onClick={() => { resetForm(); setViewMode('list'); }}
            className="px-6 py-3 font-medium rounded-xl transition-colors"
            style={{ background: '#F3F4F6', color: '#6B7280' }}
          >
            {t({ pt: 'Cancelar', en: 'Cancel', es: 'Cancelar' })}
          </button>
        </div>
      </div>
    </div>
  );
}
