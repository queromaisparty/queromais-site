import { useState } from 'react';
import { ShoppingBag, Search, Plus, Edit2, Trash2, Check, X, Image as ImageIcon } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import type { Product } from '@/types';

export function AdminShop() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: { pt: '', en: '', es: '' },
    description: { pt: '', en: '', es: '' },
    price: 0,
    originalPrice: undefined,
    category: 'vestuario',
    images: [],
    status: 'active',
    stock: 0
  });

  const categories = [
    { id: 'vestuario', label: 'Vestuário' },
    { id: 'acessorios', label: 'Acessórios' },
    { id: 'tickets', label: 'Copos & Outros' }
  ];

  const filteredProducts = products.filter(p =>
    (p.name?.pt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleCreate = () => {
    setFormData({
      name: { pt: '', en: '', es: '' },
      description: { pt: '', en: '', es: '' },
      price: 0,
      originalPrice: undefined,
      category: 'vestuario',
      images: [],
      status: 'active',
      stock: 0
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.pt) {
      toast.error('O nome em português é obrigatório.');
      return;
    }
    
    // Garantir en e es sejam strings vazias se undefined
    const name = {
      pt: formData.name.pt,
      en: formData.name.en || '',
      es: formData.name.es || ''
    };
    
    const description = {
      pt: formData.description?.pt || '',
      en: formData.description?.en || '',
      es: formData.description?.es || ''
    };
    
    const finalData = { ...formData, name, description };
    
    if (editingId) {
      updateProduct(editingId, finalData as Product);
      toast.success('Produto atualizado com sucesso!');
    } else {
      addProduct(finalData as Omit<Product, 'id' | 'createdAt'>);
      toast.success('Produto criado com sucesso!');
    }
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
            Loja
          </h2>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            Gerencie os produtos da loja oficial.
          </p>
        </div>
        <button
          title="Criar Novo"
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D81B80] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Novo Produto</span>
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          title="Buscar"
          placeholder="Buscar produtos por nome ou categoria..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/20 focus:border-[#E91E8C]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm ? (
        <div className="bg-white border text-black border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
            <button title="Fechar" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Nome (PT)</label>
                <input required title="Nome PT" type="text" value={formData.name?.pt || ''} onChange={e => setFormData({ ...formData, name: { ...formData.name, pt: e.target.value, en: formData.name?.en||'', es: formData.name?.es||'' } })} className="w-full px-3 py-2 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:border-[#E91E8C]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preço Atual (R$)</label>
                <input required title="Preço" type="number" step="0.01" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:border-[#E91E8C]" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium mb-1">Descrição Curta (PT)</label>
                <textarea title="Descrição Curta" rows={2} value={formData.description?.pt || ''} onChange={e => setFormData({ ...formData, description: { ...formData.description, pt: e.target.value, en: formData.description?.en||'', es: formData.description?.es||'' } })} className="w-full px-3 py-2 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:border-[#E91E8C] resize-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select title="Categoria" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className="w-full px-3 py-2 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:border-[#E91E8C]">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status de Disponibilidade</label>
                <select title="Status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:border-[#E91E8C]">
                  <option value="active">Ativo (Visível na loja)</option>
                  <option value="inactive">Inativo (Oculto)</option>
                  <option value="out_of_stock">Esgotado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Estoque</label>
                <input title="Estoque" type="number" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:border-[#E91E8C]" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Link da Imagem Principal</label>
                <input title="Imagem" type="url" value={formData.images?.[0] || ''} onChange={e => {
                  const arr = [...(formData.images || [])];
                  arr[0] = e.target.value;
                  setFormData({ ...formData, images: arr });
                }} className="w-full px-3 py-2 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:border-[#E91E8C]" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Link da Imagem Hover (Secundária)</label>
                <input title="Imagem Secundária" type="url" value={formData.images?.[1] || ''} onChange={e => {
                  const arr = [...(formData.images || [])];
                  arr[1] = e.target.value;
                  setFormData({ ...formData, images: arr });
                }} className="w-full px-3 py-2 bg-white border border-gray-200 text-black rounded-lg focus:outline-none focus:border-[#E91E8C]" />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button title="Cancelar" type="button" onClick={() => setShowForm(false)} className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                Cancelar
              </button>
              <button title="Salvar" type="submit" className="flex items-center gap-2 px-6 py-2 bg-[#E91E8C] text-white font-medium rounded-lg hover:bg-[#D81B80] transition-colors">
                <Check className="w-4 h-4" />
                {editingId ? 'Salvar Alterações' : 'Criar Produto'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-black">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="aspect-video bg-gray-50 flex items-center justify-center relative border-b border-gray-100 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name?.pt} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                  {product.status === 'out_of_stock' && (
                    <div className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">ESGOTADO</div>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">ULTIMAS PEÇAS</div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{product.name?.pt}</h4>
                      <p className="text-xs text-gray-500 font-medium">{product.category.toUpperCase()}</p>
                    </div>
                  </div>
                  <p className="font-bold text-[#E91E8C] mt-auto">R$ {product.price?.toFixed(2)}</p>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button title="Editar" onClick={() => handleEdit(product)} className="p-2 text-gray-500 hover:text-white hover:bg-black rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button title="Excluir" onClick={() => { if(window.confirm('Excluir produto?')) deleteProduct(product.id); }} className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
              <ShoppingBag className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p>Nenhum produto cadastrado na loja virtual.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
