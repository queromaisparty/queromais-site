import { useState } from 'react';
import {
  Plus, Trash2, Edit3, Image as ImageIcon, Eye, EyeOff,
  Upload, Link2, X, FolderOpen, Camera
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { GalleryAlbum, GalleryImage } from '@/types';
import { extractFolderId, listGDriveImages } from '@/services/googleDrive';
import { FlyerUploader } from './FlyerUploader';
import { optimizeImage } from '@/lib/imageProcessor';

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
    type: 'internal' as 'internal' | 'external',
    externalLink: '',
    status: 'active' as 'active' | 'inactive',
    images: [] as GalleryImage[],
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      coverImage: '', 
      category: '',
      type: 'internal',
      externalLink: '',
      status: 'active', 
      images: [], 
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
      type: album.type || 'internal',
      externalLink: album.externalLink || '',
      status: album.status || 'active',
      images: album.images,
    });
    setEditingId(album.id);
    setViewMode('form');
  };

  const handleDelete = (id: string) => {
    deleteGalleryAlbum(id);
    toast.success('Álbum excluído com sucesso.');
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (album: GalleryAlbum) => {
    updateGalleryAlbum(album.id, { status: album.status === 'active' ? 'inactive' : 'active' });
    toast.success(album.status === 'active' ? 'Álbum ocultado do site.' : 'Álbum visível no site.');
  };

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const addFromGDrive = async () => {
    const folderId = extractFolderId(formData.externalLink);
    if (!folderId) {
      toast.error('Link de Drive inválido ou formato desconhecido.');
      return;
    }
    
    setIsSyncing(true);
    try {
      const gdriveFiles = await listGDriveImages(folderId);
      
      if (gdriveFiles.length === 0) {
        toast.warning('Nenhuma imagem acessível encontrada. A pasta está pública?');
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
      toast.success(`${newImages.length} fotos lidas do Google Drive.`);
    } catch {
      toast.error('G-Drive Recusou. API não liberou os arquivos.');
    } finally {
      setIsSyncing(false);
    }
  };

  const addImageByUrl = () => {
    if (!imageUrlInput) return;
    const newImg: GalleryImage = {
      id: Date.now().toString() + Math.random().toString(),
      url: imageUrlInput,
      downloadAllowed: true,
      source: 'url',
    };
    setFormData(prev => ({ ...prev, images: [...prev.images, newImg] }));
    setImageUrlInput('');
    toast.success('Imagem por URL adicionada.');
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const toastId = toast.loading(`Processando ${files.length} fotos...`);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // 1. Otimizar com nosso processador padronizado
        const compressedFile = await optimizeImage(file, { maxWidth: 1600, quality: 0.82, format: 'image/webp' });
        
        // 2. Upload para Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `albums/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('galleries')
          .upload(filePath, compressedFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('galleries')
          .getPublicUrl(filePath);

        return {
          id: Date.now().toString() + Math.random().toString(),
          url: publicUrl,
          downloadAllowed: true,
          source: 'upload' as const,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
      toast.success(`${uploadedImages.length} fotos enviadas com sucesso!`, { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Erro em alguma das fotos durante o upload.', { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Informe um Título para o Álbum.');
      return;
    }
    
    const albumData: Omit<GalleryAlbum, 'id' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      coverImage: formData.coverImage || (formData.images[0]?.url || ''),
      images: formData.images,
      videos: [],
      category: formData.category || undefined,
      order: galleryAlbums.length,
      featured: false,
      type: formData.type,
      externalLink: formData.externalLink,
      status: formData.status,
    };

    if (editingId) {
      updateGalleryAlbum(editingId, albumData);
      toast.success('Álbum recarregado com as edições.');
    } else {
      addGalleryAlbum(albumData);
      toast.success('Álbum construído e publicado na nuvem.');
    }
    resetForm();
    setViewMode('list');
  };

  // ─────────────── LIST VIEW ───────────────
  if (viewMode === 'list') {
    return (
      <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Camera className="w-8 h-8 text-admin-accent" /> Registros e Coberturas
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
               {galleryAlbums.length} Álbuns e Coberturas Fotográficas em seu site.
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl bg-admin-accent hover:brightness-110 shadow-sm transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Novo Álbum
          </button>
        </div>

        {galleryAlbums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-5 border border-slate-100 shadow-inner">
              <Camera className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sem Fotos e Álbuns.</h3>
            <p className="text-sm font-medium text-slate-500 max-w-sm mb-6">
              Você ainda não liberou os registros do seu público ou evento na plataforma digital.
            </p>
            <button onClick={handleNew} className="px-8 py-3 bg-admin-accent text-white font-bold text-sm rounded-xl hover:brightness-110 shadow-sm transition-all">
              Abrir Primeiro Álbum
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {galleryAlbums
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(album => (
                <div
                  key={album.id}
                  className={`rounded-2xl overflow-hidden transition-all group flex flex-col bg-white border shadow-sm hover:shadow-md ${
                    album.status === 'inactive' ? 'border-slate-100 opacity-60 hover:opacity-100 grayscale-[0.2]' : 'border-slate-200'
                  }`}
                >
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-100 border-b border-slate-100">
                    {album.coverImage ? (
                      <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    
                    {/* Botão de Toggle de Visibilidade (Eye) */}
                    <div className="absolute top-3 right-3 flex gap-2">
                       <button
                        onClick={() => handleToggleStatus(album)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors shadow-sm border ${
                           album.status === 'active' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-slate-900/60 text-white border-white/20'
                        }`}
                        title={album.status === 'active' ? 'Ocultar Álbum (Desativar)' : 'Publicar Álbum (Ativar)'}
                      >
                        {album.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Tag de Categoria */}
                    {album.category && (
                       <div className="absolute bottom-3 left-3 bg-slate-900/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                         {album.category}
                       </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col relative bg-white">
                     
                    <h3 className="font-black text-lg text-slate-900 mb-1 leading-tight group-hover:text-admin-accent transition-colors truncate pr-2">{album.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">{album.description || 'Sem descrição.'}</p>
                    
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                        {album.images.length} Registros
                      </div>
                      
                      <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(album)}
                          className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white border border-slate-200 text-slate-500 hover:text-admin-accent hover:border-admin-accent shadow-sm"
                          title="Editar Fotos/Detalhes"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        {deleteConfirm === album.id ? (
                          <div className="flex animate-in fade-in zoom-in duration-200 bg-red-50 rounded-lg overflow-hidden border border-red-200">
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-[10px] font-bold uppercase text-slate-600 bg-white hover:bg-slate-50 transition-colors">Abortar</button>
                            <button onClick={() => handleDelete(album.id)} className="px-3 py-1 text-[10px] font-bold uppercase text-white bg-red-600 hover:bg-red-700 transition-colors">RIP</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(album.id)}
                            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 shadow-sm"
                            title="Apagar Álbum Totalmente"
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
    <div className="p-6 lg:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header Fixo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-wider text-admin-accent mb-1 flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> Setor Criativo</p>
           <h2 className="text-2xl font-black text-slate-900 leading-tight">
             {editingId ? 'Editando Álbum' : 'Publicar Novo Álbum'}
           </h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setViewMode('list')} className="px-5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm">
            Recuar
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-admin-accent text-white rounded-xl hover:brightness-110 transition-all shadow-sm active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            {editingId ? 'Salvar Tudo' : 'Publicar'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
         {/* Detalhes do Album */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
            Identidade do Álbum
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Título do Álbum (PT-BR) <span className="text-admin-accent">*</span></label>
              <input type="text" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Ex: Baile do Havaí 2026" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 outline-none transition-all placeholder:text-slate-400" />
            </div>
            <div>
               <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Tag / Categoria</label>
               <input type="text" value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} placeholder="Ex: After, Pool Party..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 outline-none transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <div className="mb-6">
             <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Release Opcional (Subtítulo)</label>
             <input type="text" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Texto para gerar expectativa..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 outline-none transition-all placeholder:text-slate-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Tipo de Álbum</label>
               <div className="flex gap-4">
                 <button 
                  onClick={() => setFormData(p => ({ ...p, type: 'internal' }))}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${formData.type === 'internal' ? 'bg-admin-accent/10 border-admin-accent text-admin-accent' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                 >
                   Interno (Fotos no Site)
                 </button>
                 <button 
                  onClick={() => setFormData(p => ({ ...p, type: 'external' }))}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${formData.type === 'external' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                 >
                   Externo (Google Drive)
                 </button>
               </div>
            </div>
            <div>
               <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">Status e Visibilidade</label>
               <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 outline-none transition-all cursor-pointer">
                 <option value="active">Público (On)</option>
                 <option value="inactive">Rascunho (Off)</option>
               </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 pl-1">Capa do Álbum (1600x838 recomendado)</label>
            <FlyerUploader 
              value={formData.coverImage} 
              onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))} 
              maxW={1600}
              aspectRatio="1600/838"
            />
          </div>
        </div>

        {/* Gerência de Mídia */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-sm mt-6">
           <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
             <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
               {formData.type === 'internal' ? 'Upload de Fotos' : 'Configuração de Link'}
             </h3>
             {formData.type === 'internal' && (
               <span className="px-3 py-1 bg-pink-50 border border-pink-200 text-admin-accent text-xs font-bold rounded-lg shadow-sm">
                  {formData.images.length} Fotos Salvas
               </span>
             )}
           </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* PAINEL ESQUERDO: UPLOADERS (FERRAMENTAS) */}
            <div className="space-y-4">
              
              {formData.type === 'internal' ? (
                <>
                  <div className="p-5 rounded-xl border-2 border-dashed bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-200 hover:border-admin-accent/50 group relative">
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl">
                        <div className="w-8 h-8 border-4 border-admin-accent border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-xs font-bold text-admin-accent">Subindo Fotos...</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <Upload className="w-5 h-5 text-admin-accent" />
                      <span className="text-sm font-bold text-slate-800">Carga Direta p/ Storage</span>
                    </div>
                    <input
                      type="file" multiple accept="image/*" onChange={handleFileUpload}
                      className="w-full text-xs font-bold file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-admin-accent file:text-white hover:file:brightness-110 cursor-pointer text-slate-500"
                    />
                  </div>

                  <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <FolderOpen className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-bold text-slate-900">Importar do Google Drive (SYNC)</span>
                        </div>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Link da pasta pública..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 focus:border-blue-500 transition-colors" value={formData.externalLink} onChange={e => setFormData(prev => ({ ...prev, externalLink: e.target.value }))} />
                          <button onClick={addFromGDrive} disabled={isSyncing} className={`px-4 flex items-center justify-center rounded-xl text-sm font-bold border transition-colors ${isSyncing ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white'}`}>
                            {isSyncing ? 'SY...' : 'SYNC'}
                          </button>
                        </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Link2 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900 font-black">LINK DO ÁLBUM EXTERNO</span>
                  </div>
                  <input 
                    type="url" 
                    placeholder="Cole aqui o link do Google Drive / iCloud / Fotos" 
                    className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-slate-900 text-sm outline-none focus:border-blue-500"
                    value={formData.externalLink}
                    onChange={e => setFormData(prev => ({ ...prev, externalLink: e.target.value }))}
                  />
                  <p className="text-[10px] text-blue-600 font-bold mt-3 uppercase tracking-wider">Ao clicar neste álbum no site, o usuário será levado para este link.</p>
                </div>
              )}

              {formData.type === 'internal' && (
                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-800">Injeção por URL Web</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="url" placeholder="https://... .jpg" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 focus:border-slate-400 transition-colors" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addImageByUrl()} />
                    <button onClick={addImageByUrl} className="w-11 h-11 shrink-0 bg-slate-800 text-white flex items-center justify-center rounded-xl font-bold hover:bg-admin-accent transition-colors shadow"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

            </div>

            {/* PAINEL DIREITO: GRID DE PREVIEW IN-FORM */}
            <div className="flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-100 p-2">
              {formData.images.length === 0 ? (
                <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-slate-400 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl m-2">
                  <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
                  <span className="text-sm font-bold text-slate-500 mb-1">Aparecerão aqui!</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Jogue suas fotos ao lado.</span>
                </div>
              ) : (
                <div className="flex-1 p-2">
                   <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-2">
                    {formData.images.map((img, i) => (
                      <div key={img.id || i} className="aspect-square relative rounded-xl overflow-hidden group shadow-sm bg-slate-100 border border-slate-200">
                        <img src={img.url} alt={`IMG_${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/40 transition-colors opacity-0 group-hover:opacity-100" />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter(x => x.id !== img.id) }))}
                          className="absolute top-1.5 right-1.5 w-7 h-7 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-100/50 shadow-sm"
                          title="Remover Desse Lote"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
