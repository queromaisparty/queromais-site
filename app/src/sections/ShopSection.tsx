import { useState } from 'react';
import { ShoppingBag, Ticket, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';
import type { CartItem } from '@/types';

export function ShopSection() {
  const { t } = useLanguage();
  const { products, getUpcomingEvents } = useData();
  const [activeTab, setActiveTab] = useState<'products' | 'tickets'>('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const upcomingEvents = getUpcomingEvents();

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQuantity = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQuantity };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(t({ pt: 'pt-BR', en: 'en-US', es: 'es-ES' }), {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <section id="shop" className="py-24 lg:py-32 bg-[#0A0A0A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header da Seção & Cart Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6ABD45] mb-3 font-sans">
              {t({ pt: 'Loja Oficial', en: 'Official Store', es: 'Tienda Oficial' })}
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight">
              {t(translations.shop.title)}
            </h2>
          </div>

          <button
            onClick={() => setShowCart(!showCart)}
            className="flex items-center gap-3 px-6 py-3 bg-[#3D4246] hover:bg-[#2A2D30] rounded-full transition-colors group"
          >
            <ShoppingBag className="w-5 h-5 text-white group-hover:text-[#6ABD45] transition-colors" />
            <span className="text-white font-bold uppercase tracking-wide text-sm">
              {t(translations.shop.cart)}
            </span>
            {cartItemsCount > 0 && (
              <span className="w-6 h-6 bg-[#6ABD45] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>

        {/* Painel do Carrinho */}
        {showCart && (
          <div className="mb-12 bg-[#1A1A1A] rounded-2xl p-6 md:p-8">
            <h3 className="font-display font-black text-2xl text-white mb-6 uppercase">
              {t(translations.shop.cart)}
            </h3>
            
            {cart.length === 0 ? (
              <p className="text-white/50 text-center py-12 text-lg">
                {t({ pt: 'Seu carrinho está vazio', en: 'Your cart is empty', es: 'Tu carrito está vacío' })}
              </p>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#2A2D30] rounded-xl p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg bg-black"
                      />
                      <div className="flex-1 w-full">
                        <h4 className="font-display font-black text-white text-lg uppercase mb-1">{item.name}</h4>
                        <p className="text-[#6ABD45] font-bold text-lg">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 rounded-lg border border-white/5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-10 h-10 flex items-center justify-center text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-red-400/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10 gap-6">
                  <div>
                    <span className="text-white/60 tracking-wider uppercase text-sm">{t({ pt: 'Total', en: 'Total', es: 'Total' })}</span>
                    <p className="font-display font-black text-white text-3xl mt-1">{formatPrice(cartTotal)}</p>
                  </div>
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#6ABD45] text-white font-black uppercase tracking-wider rounded-full hover:bg-white hover:text-black transition-colors">
                    <CreditCard className="w-5 h-5" />
                    {t(translations.shop.checkout)}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tabs de Filtro */}
        <div className="flex gap-4 mb-12">
          {[
            { key: 'products', label: translations.shop.products, icon: ShoppingBag },
            { key: 'tickets', label: translations.shop.tickets, icon: Ticket },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all border ${
                activeTab === tab.key
                  ? 'bg-white border-white text-black'
                  : 'bg-transparent border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {t(tab.label)}
            </button>
          ))}
        </div>

        {/* Listagens */}
        <div className="min-h-[400px]">
          
          {/* Aba de Produtos */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="group bg-[#1A1A1A] rounded-xl overflow-hidden hover:bg-[#2A2D30] transition-colors">
                    <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={t(product.name)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                        />
                      ) : (
                        <ShoppingBag className="w-12 h-12 text-[#E5E5E5]" />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-black text-xl text-white mb-2 uppercase">{t(product.name)}</h3>
                      <p className="text-white/50 text-sm line-clamp-2 mb-6">
                        {t(product.description)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#6ABD45] font-black text-xl">
                            {formatPrice(product.price)}
                          </p>
                          {product.originalPrice && (
                            <p className="text-white/40 text-xs line-through mt-1">
                              {formatPrice(product.originalPrice)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart({
                            id: product.id,
                            productId: product.id,
                            name: t(product.name),
                            price: product.price,
                            image: product.images[0] || ''
                          })}
                          className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-[#6ABD45] hover:text-white transition-colors"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* MOCK Produtos */
                [
                  { name: 'Camiseta Quero Mais', price: 89.90, originalPrice: 119.90 },
                  { name: 'Boné Official', price: 69.90 },
                  { name: 'Copo Exclusivo', price: 29.90 },
                  { name: 'Kit Festa', price: 149.90 },
                ].map((product, index) => (
                  <div key={index} className="group bg-[#1A1A1A] rounded-xl overflow-hidden hover:bg-[#2A2D30] transition-colors">
                    <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                      <ShoppingBag className="w-16 h-16 text-[#E5E5E5] group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-black text-xl text-white mb-6 uppercase">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#6ABD45] font-black text-xl">
                            {formatPrice(product.price)}
                          </p>
                          {product.originalPrice && (
                            <p className="text-white/40 text-xs line-through mt-1">
                              {formatPrice(product.originalPrice)}
                            </p>
                          )}
                        </div>
                        <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-[#6ABD45] hover:text-white transition-colors">
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Aba de Ingressos */}
          {activeTab === 'tickets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="group bg-[#1A1A1A] rounded-xl overflow-hidden">
                    <div className="aspect-video overflow-hidden bg-black">
                      {event.coverImage ? (
                        <img
                          src={event.coverImage}
                          alt={t(event.title)}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Ticket className="w-12 h-12 text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-[#6ABD45] font-bold text-sm tracking-widest mb-2">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <h3 className="font-display font-black text-2xl text-white mb-6 uppercase">{t(event.title)}</h3>
                      
                      {event.ticketLink && (
                        <a
                          href={event.ticketLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-black uppercase tracking-wider rounded-lg hover:bg-[#6ABD45] hover:text-white transition-colors"
                        >
                          <Ticket className="w-5 h-5" />
                          {t(translations.buttons.buyTickets)}
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-[#1A1A1A] rounded-2xl py-24 text-center">
                  <Ticket className="w-16 h-16 text-white/10 mx-auto mb-6" />
                  <p className="font-display font-black text-white/40 text-2xl uppercase tracking-widest">
                    {t({ 
                      pt: 'Nenhum ingresso disponível no momento.',
                      en: 'No tickets available at the moment.',
                      es: 'No hay entradas disponibles en este momento.'
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
