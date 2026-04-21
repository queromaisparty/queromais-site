import { useState } from 'react';
import {
  Plus, Trash2, Edit3, Image as ImageIcon, Eye, EyeOff,
  Star, StarOff, GripVertical, Upload, Link2, X, FolderOpen, Camera
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

  // Form state
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

  const handleNew = () => {
    resetForm();
    setViewMode('form');
  };

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
    updateGalleryAlbum(album.id, {
      status: album.status === 'active' ? 'inactive' : 'active'
    });
    toast.success(t({
      pt: album.status === 'active' ? 'Álbum desativado' : 'Álbum ativado',
      en: album.status === 'active' ? 'Album deactivated' : 'Album activated',
      es: album.status === 'active' ? 'Álbum desactivado' : 'Álbum activado',
    }));
  };

  const handleToggleFeatured = (album: GalleryAlbum) => {
    updateGalleryAlbum(album.id, { featured: !album.featured });
  };

  // Add image by URL
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

  // Add images from Google Drive folder link
  const addFromGDrive = () => {
    const folderId = extractFolderId(formData.gdriveLink);
    if (!folderId) {
      toast.error(t({
        pt: 'Link inválido do Google Drive',
        en: 'Invalid Google Drive link',
        es: 'Enlace inválido de Google Drive'
      }));
      return;
    }
    // User will add individual file IDs, or we generate placeholder
    toast.info(t({
      pt: 'Pasta conectada! Cole os IDs dos arquivos individuais abaixo.',
      en: 'Folder connected! Paste individual file IDs below.',
      es: 'Carpeta conectada! Pega los IDs individuales abajo.'
    }));
  };

  // Add Google Drive image by file ID
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

  // Remove image
  const removeImage = (imgId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(i => i.id !== imgId),
    }));
  };

  // Handle file upload (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;

        // Compress by resizing via canvas
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 1200;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
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

  // Save album
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

  // =========================================
  // RENDER
  // =========================================

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {t({ pt: 'Galeria', en: 'Gallery', es: 'Galería' })}
            </h2>
            <p className="text-white/50 text-sm mt-1">
              {galleryAlbums.length} {t({ pt: 'álbuns', en: 'albums', es: 'álbumes' })}
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#b8e600] transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t({ pt: 'Novo Álbum', en: 'New Album', es: 'Nuevo Álbum' })}
          </button>
        </div>

        {galleryAlbums.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <Camera className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">
              {t({ pt: 'Nenhum álbum ainda', en: 'No albums yet', es: 'Sin álbumes aún' })}
            </h3>
            <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
              {t({
                pt: 'Crie seu primeiro álbum para exibir fotos na galeria do site.',
                en: 'Create your first album to display photos on the website gallery.',
                es: 'Crea tu primer álbum para mostrar fotos en la galería del sitio.'
              })}
            </p>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl"
            >
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
                  className={`bg-white/5 border rounded-xl overflow-hidden transition-all ${
                    album.status === 'inactive' ? 'border-white/5 opacity-60' : 'border-white/10'
                  }`}
                >
                  {/* Cover */}
                  <div className="aspect-[16/10] overflow-hidden bg-white/5 relative">
                    {album.coverImage ? (
                      <img src={album.coverImage} alt={album.title.pt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-white/20" />
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      {album.featured && (
                        <span className="px-2 py-0.5 bg-yellow-500/90 text-black text-[10px] font-bold rounded-full uppercase">
                          Destaque
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        album.status === 'active' ? 'bg-green-500/90 text-black' : 'bg-red-500/90 text-white'
                      }`}>
                        {album.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h4 className="text-white font-bold truncate">{album.title.pt}</h4>
                    <p className="text-white/40 text-xs mt-1">
                      {album.images.length} fotos
                      {album.category && ` · ${album.category}`}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(album)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors text-xs font-medium"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {t({ pt: 'Editar', en: 'Edit', es: 'Editar' })}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(album)}
                        className="px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                        title={album.status === 'active' ? 'Desativar' : 'Ativar'}
                      >
                        {album.status === 'active' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(album)}
                        className="px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:text-yellow-400 hover:bg-white/15 transition-colors"
                        title="Destaque"
                      >
                        {album.featured ? <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(album.id)}
                        className="px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Delete confirmation */}
                  {deleteConfirm === album.id && (
                    <div className="p-3 bg-red-500/10 border-t border-red-500/20 flex items-center justify-between">
                      <span className="text-red-400 text-xs font-medium">Confirmar exclusão?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 text-xs text-white/60 hover:text-white"
                        >
                          Não
                        </button>
                        <button
                          onClick={() => handleDelete(album.id)}
                          className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg"
                        >
                          Sim, excluir
                        </button>
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

  // FORM VIEW
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {editingId
            ? t({ pt: 'Editar Álbum', en: 'Edit Album', es: 'Editar Álbum' })
            : t({ pt: 'Novo Álbum', en: 'New Album', es: 'Nuevo Álbum' })
          }
        </h2>
        <button
          onClick={() => { resetForm(); setViewMode('list'); }}
          className="text-white/50 hover:text-white transition-colors text-sm"
        >
          ← {t({ pt: 'Voltar', en: 'Back', es: 'Volver' })}
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">

        {/* Title fields */}
        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">
            {t({ pt: 'Título *', en: 'Title *', es: 'Título *' })}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="text-white/30 text-xs">🇧🇷 PT</span>
              <input
                type="text"
                value={formData.titlePt}
                onChange={e => setFormData(p => ({ ...p, titlePt: e.target.value }))}
                placeholder="Título em português"
                className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-[#CCFF00] focus:outline-none"
              />
            </div>
            <div>
              <span className="text-white/30 text-xs">🇺🇸 EN</span>
              <input
                type="text"
                value={formData.titleEn}
                onChange={e => setFormData(p => ({ ...p, titleEn: e.target.value }))}
                placeholder="Title in English"
                className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-[#CCFF00] focus:outline-none"
              />
            </div>
            <div>
              <span className="text-white/30 text-xs">🇪🇸 ES</span>
              <input
                type="text"
                value={formData.titleEs}
                onChange={e => setFormData(p => ({ ...p, titleEs: e.target.value }))}
                placeholder="Título en español"
                className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-[#CCFF00] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">
            {t({ pt: 'Descrição', en: 'Description', es: 'Descripción' })}
          </label>
          <textarea
            value={formData.descPt}
            onChange={e => setFormData(p => ({ ...p, descPt: e.target.value }))}
            placeholder="Descrição do álbum..."
            rows={2}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-[#CCFF00] focus:outline-none resize-none"
          />
        </div>

        {/* Category + Status + Featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-white/70 text-sm font-medium block mb-2">Categoria</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
              placeholder="Ex: Festas, Shows..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-[#CCFF00] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white/70 text-sm font-medium block mb-2">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#CCFF00] focus:outline-none"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))}
                className="w-4 h-4 accent-[#CCFF00]"
              />
              <span className="text-white/70 text-sm">Destaque</span>
            </label>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">
            {t({ pt: 'Imagem de capa (URL)', en: 'Cover image (URL)', es: 'Imagen de portada (URL)' })}
          </label>
          <input
            type="text"
            value={formData.coverImage}
            onChange={e => setFormData(p => ({ ...p, coverImage: e.target.value }))}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-[#CCFF00] focus:outline-none"
          />
          {formData.coverImage && (
            <img src={formData.coverImage} alt="Cover preview" className="mt-2 h-24 rounded-lg object-cover" />
          )}
        </div>

        <hr className="border-white/10" />

        {/* Images management */}
        <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            {t({ pt: 'Imagens', en: 'Images', es: 'Imágenes' })} ({formData.images.length})
          </h3>

          {/* Upload options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* File upload */}
            <div>
              <label className="flex items-center gap-2 px-4 py-2.5 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-lg cursor-pointer hover:bg-[#CCFF00]/20 transition-colors">
                <Upload className="w-4 h-4 text-[#CCFF00]" />
                <span className="text-[#CCFF00] text-sm font-medium">Upload</span>
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* URL input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                placeholder="URL da imagem..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-[#CCFF00] focus:outline-none"
                onKeyDown={e => e.key === 'Enter' && addImageByUrl()}
              />
              <button onClick={addImageByUrl} className="px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                <Link2 className="w-4 h-4" />
              </button>
            </div>

            {/* Google Drive */}
            <div className="flex gap-2">
              <input
                type="text"
                value={gdriveFileId}
                onChange={e => setGdriveFileId(e.target.value)}
                placeholder="ID do arquivo Google Drive"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-[#CCFF00] focus:outline-none"
                onKeyDown={e => e.key === 'Enter' && addGDriveImage()}
              />
              <button onClick={addGDriveImage} className="px-3 py-2 bg-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors">
                <FolderOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Google Drive folder link */}
          <div className="mb-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Google Drive</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.gdriveLink}
                onChange={e => setFormData(p => ({ ...p, gdriveLink: e.target.value }))}
                placeholder="Cole o link da pasta do Google Drive..."
                className="flex-1 px-3 py-2 bg-white/5 border border-blue-500/20 rounded-lg text-white text-sm placeholder:text-white/20 focus:border-blue-400 focus:outline-none"
              />
              <button onClick={addFromGDrive} className="px-4 py-2 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-500/30 transition-colors">
                Conectar
              </button>
            </div>
            <p className="text-blue-400/50 text-xs mt-1.5">
              A pasta deve ser pública. Após conectar, cole os IDs dos arquivos individuais acima.
            </p>
          </div>

          {/* Image grid preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {formData.images.map((img, idx) => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-white/5">
                  <img src={img.url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  {img.source === 'gdrive' && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-blue-500/80 text-white text-[8px] font-bold rounded uppercase">
                      Drive
                    </span>
                  )}
                  {idx === 0 && !formData.coverImage && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#CCFF00]/80 text-black text-[8px] font-bold rounded uppercase">
                      Capa
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="border-white/10" />

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#b8e600] transition-colors"
          >
            {editingId
              ? t({ pt: 'Salvar Alterações', en: 'Save Changes', es: 'Guardar Cambios' })
              : t({ pt: 'Criar Álbum', en: 'Create Album', es: 'Crear Álbum' })
            }
          </button>
          <button
            onClick={() => { resetForm(); setViewMode('list'); }}
            className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/15 transition-colors"
          >
            {t({ pt: 'Cancelar', en: 'Cancel', es: 'Cancelar' })}
          </button>
        </div>
      </div>
    </div>
  );
}
