import { useState } from 'react';
import { ShoppingBag, ArrowRight, Star, ShoppingCart } from 'lucide-react';

export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'vestuario' | 'acessorios' | 'tickets'>('todos');

  const products = [
    {
      id: 1,
      category: 'vestuario',
      title: 'Moletom Quero Mais Origin',
      price: 'R$ 249,90',
      tag: 'Novo!',
      imageMain: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop', 
      imageHover: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&auto=format&fit=crop',
      status: 'available'
    },
    {
      id: 2,
      category: 'vestuario',
      title: 'T-Shirt Acid Sunrise',
      price: 'R$ 119,90',
      tag: 'Mais Vendido',
      imageMain: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
      imageHover: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=600&auto=format&fit=crop',
      status: 'sold_out'
    },
    {
      id: 3,
      category: 'acessorios',
      title: 'Boné QM Signature',
      price: 'R$ 99,90',
      imageMain: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop',
      imageHover: 'https://images.unsplash.com/photo-1513104806145-2b0ea2d6b38c?q=80&w=600&auto=format&fit=crop',
      status: 'available'
    },
    {
      id: 4,
      category: 'vestuario',
      title: 'Corta Vento Aftermath',
      price: 'R$ 299,90',
      tag: 'Edição Limitada',
      imageMain: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop', 
      imageHover: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600&auto=format&fit=crop',
      status: 'low_stock'
    }
  ];

  const filtered = activeCategory === 'todos' ? products : products.filter(p => p.category === activeCategory);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header da Loja */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 mb-16">
          <div className="flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-[#E91E8C]/10 flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-[#E91E8C]" />
             </div>
             <h1 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl text-black uppercase tracking-tighter leading-none mb-4">
                QM <span className="text-[#E91E8C]">STORE</span>
             </h1>
             <p className="text-gray-600 text-lg sm:text-xl max-w-2xl">
                Vista a energia. Nossa linha oficial de vestuário e acessórios para quem respira música eletrônica.
             </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex justify-center mb-12">
           <div className="inline-flex bg-white border border-gray-200 shadow-sm rounded-full p-1.5 overflow-x-auto max-w-full hide-scrollbar">
             {[
               { id: 'todos', label: 'Todos os Produtos' },
               { id: 'vestuario', label: 'Vestuário' },
               { id: 'acessorios', label: 'Acessórios' },
               { id: 'tickets', label: 'Copos & Outros' }
             ].map(cat => (
               <button
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.id as any)}
                 className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                   activeCategory === cat.id ? 'bg-[#E91E8C] text-white shadow-md' : 'text-gray-500 hover:text-black hover:bg-gray-100'
                 }`}
               >
                 {cat.label}
               </button>
             ))}
           </div>
        </div>

        {/* Grid de Produtos Nível 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-20 animate-in fade-in duration-1000">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border border-gray-200 rounded-3xl border-dashed">
               <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
               <h3 className="text-black font-bold text-xl uppercase mb-2">Sem produtos nesta categoria</h3>
               <p className="text-gray-500">Volte mais tarde ou verifique os outros departamentos.</p>
            </div>
          ) : (
            filtered.map((product) => (
              <div key={product.id} className="group cursor-pointer flex flex-col h-full">
                 <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 mb-4 border border-gray-200 group-hover:border-[#E91E8C]/30 transition-colors shadow-sm group-hover:shadow-lg">
                    
                    {/* Hover Image Swap effect */}
                    <img src={product.imageMain} alt={product.title} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                    <img src={product.imageHover} alt={product.title} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100" />
                    
                    {/* Tags UI */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.tag && (
                        <span className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-sm">
                          {product.tag}
                        </span>
                      )}
                      {product.status === 'low_stock' && (
                        <span className="bg-[#FF9800] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-sm">
                          Últimas Peças
                        </span>
                      )}
                    </div>

                    {/* Sold Out Overlay */}
                    {product.status === 'sold_out' && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                         <span className="bg-white border border-gray-300 text-black shadow-sm text-sm font-black uppercase tracking-widest px-6 py-2 rounded-full transform -rotate-12">
                           Esgotado
                         </span>
                      </div>
                    )}

                    {/* Quick Add To Cart Button */}
                    {product.status !== 'sold_out' && (
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="w-full bg-[#E91E8C] text-white font-bold uppercase text-xs tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#D81B80] transition-colors shadow-lg shadow-[#E91E8C]/20">
                          <ShoppingCart className="w-4 h-4" /> Comprar
                        </button>
                      </div>
                    )}
                 </div>

                 <div className="flex flex-col flex-1">
                   <h3 className="text-black font-bold text-lg mb-1 group-hover:text-[#E91E8C] transition-colors">{product.title}</h3>
                   <div className="flex items-center justify-between mt-auto">
                     <span className={`font-semibold ${product.status === 'sold_out' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{product.price}</span>
                     
                     {product.status !== 'sold_out' && (
                       <Star className="w-4 h-4 text-[#E91E8C] opacity-0 group-hover:opacity-100 transition-opacity" />
                     )}
                   </div>
                 </div>
              </div>
            ))
           )}
        </div>

        {/* Promo Bar */}
        <div className="rounded-3xl bg-gradient-to-r from-[#E91E8C] to-[#D81B80] p-8 sm:p-12 text-center relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay" />
           <div className="relative text-left flex-1">
             <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">Envio Grátis</h2>
             <p className="text-white/90 font-medium text-lg">Em compras acima de R$ 300,00 para todo o Brasil.</p>
           </div>
           <button className="relative bg-white text-black font-black uppercase tracking-wider px-8 py-4 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shrink-0 shadow-lg">
             Ver Regulamento <ArrowRight className="w-5 h-5" />
           </button>
        </div>

      </div>
    </main>
  );
}
