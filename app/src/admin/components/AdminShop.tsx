import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, ShoppingBag, Store, Link as LinkIcon, Star, Check, Upload, Loader2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { Product } from '@/types';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/supabase';
import { optimizeImage } from '@/lib/imageProcessor';
export function AdminShop() {
  const { products, addProduct, updateProduct, deleteProduct, siteConfig, updateSiteConfig } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: { pt: '', en: '', es: '' },
    description: { pt: '', en: '', es: '' },
    images: [],
    price: 0,
    category: 'vestuario',
    stock: 0,
    status: 'active',
    featured: false,
    orderIndex: 0
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleSave = () => {
    if (!currentProduct.name?.pt) {
      toast.error('O nome do produto em Português é obrigatório');
      return;
    }
    if (!currentProduct.price || currentProduct.price <= 0) {
      toast.error('O preço é obrigatório e deve ser maior que zero');
      return;
    }

    if (currentProduct.id) {
      updateProduct(currentProduct.id, currentProduct);
      toast.success('Produto atualizado com sucesso!');
    } else {
      addProduct(currentProduct as Omit<Product, 'id' | 'createdAt'>);
      toast.success('Produto criado com sucesso!');
    }
    
    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentProduct({
      name: { pt: '', en: '', es: '' },
      description: { pt: '', en: '', es: '' },
      images: [],
      price: 0,
      category: 'vestuario',
      stock: 0,
      status: 'active',
      featured: false,
      orderIndex: 0
    });
    setImageUrlInput('');
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
      toast.success('Produto excluído com sucesso');
    }
  };

  const addImage = () => {
    if (imageUrlInput.trim()) {
      setCurrentProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrlInput.trim()]
      }));
      setImageUrlInput('');
    }
  };

  const removeImage = (index: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  // Upload de arquivo real
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const optimizedFile = await optimizeImage(file, { maxWidth: 1200, quality: 0.82, format: 'image/webp' });
      const url = await uploadImage(optimizedFile, 'produtos');
      setCurrentProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
      toast.success('Imagem enviada!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleFeatured = (product: Product) => {
    updateProduct(product.id, { featured: !product.featured });
    toast.success(`Destaque ${!product.featured ? 'ativado' : 'desativado'}`);
  };

  const toggleStatus = (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    updateProduct(product.id, { status: newStatus });
    toast.success(`Produto marcado como ${newStatus === 'active' ? 'Ativo' : 'Inativo'}`);
  };

  const toggleShopVisibility = () => {
    const newVal = siteConfig.showShop === false ? true : false;
    updateSiteConfig({ showShop: newVal });
    toast.success(`Loja ${newVal ? 'ativada' : 'desativada'} no site público.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Store className="w-6 h-6 text-admin-accent" /> Gerenciar Loja
          </h2>
          <p className="text-white/60 mt-1">Controle do catálogo de produtos oficiais.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-white/[0.05] border border-white/10 px-4 py-2 rounded-lg hover:bg-white/[0.1] transition-colors">
            <input
              type="checkbox"
              checked={siteConfig.showShop !== false}
              onChange={toggleShopVisibility}
              className="w-4 h-4 accent-admin-accent"
            />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Loja Visível no Site
            </span>
          </label>
          {!isEditing && (
            <button
              onClick={() => { resetForm(); setIsEditing(true); }}
              className="flex items-center gap-2 bg-admin-accent text-white px-4 py-2 rounded-lg font-bold hover:bg-admin-accent-dark transition-colors"
            >
              <Plus className="w-5 h-5" /> Novo Produto
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="bg-[#1A1A1A] p-6 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white uppercase">
              {currentProduct.id ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white p-2 text-sm uppercase tracking-wider font-bold">
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Nome do Produto (Português)</label>
                <input
                  type="text"
                  value={currentProduct.name?.pt || ''}
                  onChange={e => setCurrentProduct({ ...currentProduct, name: { ...currentProduct.name!, pt: e.target.value } })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-admin-accent transition-colors"
                  placeholder="Ex: Camiseta Quero Mais"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Descrição (Português)</label>
                <textarea
                  value={currentProduct.description?.pt || ''}
                  onChange={e => setCurrentProduct({ ...currentProduct, description: { ...currentProduct.description!, pt: e.target.value } })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-admin-accent transition-colors min-h-[120px]"
                  placeholder="Descrição completa do produto..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentProduct.price || ''}
                    onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-admin-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Preço Antigo (Cortado)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentProduct.originalPrice || ''}
                    onChange={e => setCurrentProduct({ ...currentProduct, originalPrice: parseFloat(e.target.value) })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-admin-accent transition-colors"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Categoria</label>
                  <select
                    value={currentProduct.category}
                    onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-admin-accent transition-colors"
                  >
                    <option value="vestuario">Vestuário</option>
                    <option value="acessorios">Acessórios</option>
                    <option value="tickets">Ingressos Físicos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Estoque (Qtd)</label>
                  <input
                    type="number"
                    value={currentProduct.stock || 0}
                    onChange={e => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-admin-accent transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Imagens do Produto</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-admin-accent transition-colors"
                    placeholder="Colar URL ou fazer upload..."
                  />
                  <button
                    onClick={addImage}
                    className="px-4 bg-white/[0.05] hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                    title="Adicionar via URL"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-3 rounded-lg border border-admin-accent text-admin-accent font-semibold hover:bg-admin-accent hover:text-white transition-colors disabled:opacity-50"
                    title="Fazer upload do computador"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Enviando…' : 'Upload'}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
                {currentProduct.images && currentProduct.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {currentProduct.images.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10 bg-black">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => removeImage(i)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Link Externo (Opcional)</label>
                <input
                  type="url"
                  value={currentProduct.externalLink || ''}
                  onChange={e => setCurrentProduct({ ...currentProduct, externalLink: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-admin-accent transition-colors"
                  placeholder="https://pagseguro..."
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.04] transition-colors">
                  <input
                    type="checkbox"
                    checked={currentProduct.featured}
                    onChange={e => setCurrentProduct({ ...currentProduct, featured: e.target.checked })}
                    className="w-5 h-5 accent-admin-accent"
                  />
                  <div>
                    <span className="text-white font-bold block">Destaque na Home</span>
                    <span className="text-white/50 text-sm">Exibir este produto na seção de resumo (ShopSection).</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.04] transition-colors">
                  <input
                    type="checkbox"
                    checked={currentProduct.status === 'active'}
                    onChange={e => setCurrentProduct({ ...currentProduct, status: e.target.checked ? 'active' : 'inactive' })}
                    className="w-5 h-5 accent-admin-accent"
                  />
                  <div>
                    <span className="text-white font-bold block">Produto Ativo</span>
                    <span className="text-white/50 text-sm">Visível publicamente na loja oficial.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-lg font-bold text-white hover:bg-white/5 transition-colors uppercase text-sm tracking-wider"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-admin-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-admin-accent-dark transition-colors uppercase text-sm tracking-wider shadow-lg shadow-admin-accent/20"
            >
              <Save className="w-5 h-5" /> Salvar Produto
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] rounded-lg border border-white/10 overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <ShoppingBag className="w-16 h-16 text-white/10 mb-4" />
              <p className="text-white/50 text-lg mb-4">Nenhum produto cadastrado na loja.</p>
              <button
                onClick={() => { resetForm(); setIsEditing(true); }}
                className="bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-colors uppercase text-sm tracking-wider font-bold"
              >
                Cadastrar Primeiro Produto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0A0A0A] border-b border-white/10">
                  <tr>
                    <th className="p-4 text-xs tracking-wider text-white/50 uppercase font-bold">Produto</th>
                    <th className="p-4 text-xs tracking-wider text-white/50 uppercase font-bold">Categoria</th>
                    <th className="p-4 text-xs tracking-wider text-white/50 uppercase font-bold">Preço</th>
                    <th className="p-4 text-xs tracking-wider text-white/50 uppercase font-bold text-center">Estoque</th>
                    <th className="p-4 text-xs tracking-wider text-white/50 uppercase font-bold text-center">Destaque</th>
                    <th className="p-4 text-xs tracking-wider text-white/50 uppercase font-bold text-center">Status</th>
                    <th className="p-4 text-xs tracking-wider text-white/50 uppercase font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(product => (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-black rounded-md overflow-hidden border border-white/10 shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-white/20" /></div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{product.name.pt}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white/70 capitalize">{product.category}</td>
                      <td className="p-4 font-bold text-admin-accent">
                        R$ {product.price.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleFeatured(product)}
                          className={`p-2 rounded-full transition-colors ${product.featured ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-white/20 hover:text-white/60 hover:bg-white/5'}`}
                          title={product.featured ? 'Remover destaque' : 'Destacar na Home'}
                        >
                          <Star className="w-5 h-5" fill={product.featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleStatus(product)}
                          className={`flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-full mx-auto transition-colors ${
                            product.status === 'active'
                              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              : 'bg-white/5 text-white/40 hover:bg-white/10'
                          }`}
                        >
                          {product.status === 'active' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {product.status === 'active' ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          {product.externalLink && (
                            <a 
                              href={product.externalLink} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              title="Link Externo"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-white/40 hover:text-admin-accent hover:bg-admin-accent/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
