import { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, Star, ShoppingCart, Ticket, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import type { Product } from '@/types';

type CartItem = { id: string; name: string; price: number; image: string; quantity: number };

export function ShopPage() {
  const { t } = useLanguage();
  const { products, getUpcomingEvents, contactInfo } = useData();
  const [activeCategory, setActiveCategory] = useState<'todos' | 'vestuario' | 'acessorios' | 'tickets'>('todos');
  
  // Carrinho no localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('@QueroMais:cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    localStorage.setItem('@QueroMais:cart', JSON.stringify(cart));
  }, [cart]);
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: product.id, 
        name: t(product.name), 
        price: product.price, 
        image: product.images?.[0] || '', 
        quantity: 1 
      }];
    });
    setShowCart(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkoutWhatsApp = () => {
    const phone = contactInfo.whatsapp.replace(/\D/g, '');
    let text = `*NOVO PEDIDO - QUERO MAIS STORE*%0A%0A`;
    cart.forEach(item => {
      text += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    text += `%0A*TOTAL: R$ ${cartTotal.toFixed(2)}*%0A%0A`;
    text += `OlÃ¡! Gostaria de finalizar o meu pedido.`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(t({ pt: 'pt-BR', en: 'en-US', es: 'es-ES' }), {
      style: 'currency', currency: 'BRL'
    }).format(price || 0);
  };

  const upcomingEvents = getUpcomingEvents();
  const availableProducts = products.filter(p => p.status === 'active' || p.stock > 0);
  const filteredProducts = activeCategory === 'todos' 
    ? availableProducts 
    : availableProducts.filter(p => p.category === activeCategory);

  return (
    <main className="pt-32 pb-24 min-h-screen bg-white overflow-hidden relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header da Loja */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 mb-16 relative">
          {/* Cart Floating Button */}
          <button 
            title="Carrinho"
            onClick={() => setShowCart(!showCart)}
            className="absolute right-0 top-0 flex items-center justify-center p-4 bg-black text-white hover:bg-qm-magenta transition-colors rounded-full shadow-lg z-20"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-qm-magenta text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cartItemsCount}
              </span>
            )}
          </button>

          <div className="flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-qm-magenta/10 flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-qm-magenta" />
             </div>
             <h1 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tighter leading-none mb-4">
                QM <span className="text-qm-magenta">STORE</span>
             </h1>
             <p className="text-gray-600 text-lg sm:text-xl max-w-2xl">
                Vista a energia. Nossa linha oficial de vestuÃ¡rio e acessÃ³rios para quem respira mÃºsica eletrÃ´nica.
             </p>
          </div>
        </div>

        {/* Carrinho Modal/Panel Local */}
        {showCart && (
          <div className="mb-8 bg-gray-50 border border-gray-200 rounded-none p-4 sm:p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-2xl text-black uppercase">Seu Carrinho</h3>
              <button 
                title="Fechar Carrinho"
                onClick={() => setShowCart(false)} 
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
               >
                X
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Seu carrinho estÃ¡ vazio.</p>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-gray-300"/></div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-qm-magenta font-bold">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                          <button title="Diminuir" onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded text-gray-600"><Minus className="w-4 h-4"/></button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button title="Aumentar" onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded text-gray-600"><Plus className="w-4 h-4"/></button>
                        </div>
                        <button title="Remover item" onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-6">
                  <div>
                    <span className="text-gray-500 uppercase text-sm font-bold">Total</span>
                    <p className="text-3xl font-black text-black">{formatPrice(cartTotal)}</p>
                  </div>
                  <button title="Finalizar" onClick={checkoutWhatsApp} className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center gap-2 px-8 py-4 bg-qm-magenta hover:bg-qm-magenta-dark text-white font-black uppercase rounded-none transition-transform hover:scale-105 shadow-lg">
                    <CreditCard className="w-5 h-5" />
                    Finalizar via WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Filtros */}
        <div className="flex justify-center mb-12">
           <div className="inline-flex bg-white border border-gray-200 shadow-sm rounded-none overflow-x-auto max-w-full hide-scrollbar">
             {[
               { id: 'todos', label: 'Todos os Produtos' },
               { id: 'vestuario', label: 'VestuÃ¡rio' },
               { id: 'acessorios', label: 'AcessÃ³rios' },
               { id: 'tickets', label: 'Ingressos' }
             ].map(cat => (
               <button
                 key={cat.id}
                 title={cat.label}
                 onClick={() => setActiveCategory(cat.id as 'todos' | 'vestuario' | 'acessorios' | 'tickets')}
                 className={`px-8 py-3 rounded-none text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap border-r border-gray-200 last:border-0 ${
                   activeCategory === cat.id ? 'bg-qm-magenta text-white shadow-md' : 'text-gray-500 hover:text-black hover:bg-gray-50'
                 }`}
               >
                 {cat.label}
               </button>
             ))}
           </div>
        </div>

        {/* Grid Container */}
        {activeCategory === 'tickets' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 animate-in fade-in duration-1000">
             {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="group bg-white border border-gray-200 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all">
                    <div className="aspect-video overflow-hidden bg-gray-100 relative">
                      {event.coverImage ? (
                        <img src={event.coverImage} alt={t(event.title)} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Ticket className="w-12 h-12 text-gray-300" /></div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-qm-magenta font-bold text-sm tracking-widest mb-2">{new Date(event.date).toLocaleDateString()}</p>
                      <h3 className="font-sans font-black text-2xl text-black mb-6 uppercase">{t(event.title)}</h3>
                      {event.ticketLink && (
                        <a href={event.ticketLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white font-black uppercase tracking-wider rounded-none hover:bg-qm-magenta transition-colors">
                          <Ticket className="w-5 h-5" /> COMPRAR INGRESSO
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 text-center border border-dashed border-gray-200 rounded-none">
                  <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-bold text-gray-500 uppercase tracking-widest text-lg">Nenhum evento com ingressos Ã  venda.</p>
                </div>
              )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-20 animate-in fade-in duration-1000">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-24 flex flex-col items-center justify-center border border-gray-200 rounded-none border-dashed bg-gray-50/50">
                 <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                 <h3 className="text-black font-bold text-xl uppercase mb-2">Sem produtos nesta categoria</h3>
                 <p className="text-gray-500 text-center">Nossa coleÃ§Ã£o oficial estarÃ¡ disponÃ­vel em breve.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col h-full bg-white border border-gray-200 rounded-none shadow-sm hover:shadow-xl transition-all">
                   <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-0 border-b border-gray-100 group-hover:border-qm-magenta/30 transition-colors">
                      
                      {product.images && product.images[0] ? (
                        <>
                          <img src={product.images[0]} alt={t(product.name)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                          {product.images[1] && (
                            <img src={product.images[1]} alt={t(product.name)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100" />
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center"><ShoppingBag className="w-12 h-12 text-gray-200" /></div>
                      )}
                      
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.stock > 0 && product.stock <= 5 && (
                          <span className="bg-[#FF9800] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-sm">
                            Ãšltimas {product.stock} PeÃ§as
                          </span>
                        )}
                      </div>
  
                      {product.status === 'out_of_stock' && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                           <span className="bg-white border border-gray-300 text-black shadow-sm text-sm font-black uppercase tracking-widest px-6 py-2 rounded-none transform -rotate-12">
                             Esgotado
                           </span>
                        </div>
                      )}
  
                      {product.status !== 'out_of_stock' && (
                        <div className="absolute inset-x-0 bottom-0 p-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button title="Comprar" onClick={() => addToCart(product)} className="w-full bg-qm-magenta text-white font-bold uppercase text-xs tracking-wider py-4 rounded-none flex items-center justify-center gap-2 hover:bg-qm-magenta-dark transition-colors">
                            <ShoppingCart className="w-4 h-4" /> Adicionar ao Carrinho
                          </button>
                        </div>
                      )}
                   </div>
  
                   <div className="flex flex-col flex-1 p-5">
                     <h3 className="text-black font-bold text-lg mb-1 group-hover:text-qm-magenta transition-colors line-clamp-1">{t(product.name)}</h3>
                     <div className="flex items-center justify-between mt-auto">
                       <span className={`font-black tracking-tight ${product.status === 'out_of_stock' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{formatPrice(product.price)}</span>
                       {product.status !== 'out_of_stock' && <Star className="w-4 h-4 text-qm-magenta opacity-0 group-hover:opacity-100 transition-opacity" />}
                     </div>
                   </div>
                </div>
              ))
             )}
          </div>
        )}

        {/* Promo Bar */}
        <div className="rounded-none bg-gradient-to-r from-qm-magenta to-qm-magenta-dark p-8 sm:p-12 text-center relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl mt-20">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none mix-blend-overlay" />
           <div className="relative text-left flex-1">
             <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter mb-2">Envio GrÃ¡tis</h2>
             <p className="text-white/90 font-medium text-lg">Para todo o Brasil.</p>
           </div>
           <button title="Regulamento" className="relative bg-white text-black font-black uppercase tracking-wider px-8 py-4 rounded-none hover:scale-105 transition-transform flex items-center gap-2 shrink-0 shadow-lg">
             Ver Regulamento <ArrowRight className="w-5 h-5" />
           </button>
        </div>

      </div>
    </main>
  );
}


