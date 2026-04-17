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
    <section id="shop" className="py-20 lg:py-32 bg-gradient-to-b from-black via-[#0f0f0f] to-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#CCFF00]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-full mb-4">
                <ShoppingBag className="w-4 h-4 text-[#CCFF00]" />
                <span className="text-[#CCFF00] text-sm font-bold uppercase tracking-wider">
                  {t({ pt: 'Loja Oficial', en: 'Official Store', es: 'Tienda Oficial' })}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
                {t(translations.shop.title)}
              </h2>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-[#CCFF00]" />
              <span className="text-white font-bold">
                {t(translations.shop.cart)}
              </span>
              {cartItemsCount > 0 && (
                <span className="w-6 h-6 bg-[#CCFF00] text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Cart Panel */}
          {showCart && (
            <div className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">
                {t(translations.shop.cart)}
              </h3>
              {cart.length === 0 ? (
                <p className="text-white/50 text-center py-8">
                  {t({ pt: 'Seu carrinho está vazio', en: 'Your cart is empty', es: 'Tu carrito está vacío' })}
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-bold">{item.name}</h4>
                          <p className="text-[#CCFF00] font-bold">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <span className="text-white/60">{t({ pt: 'Total', en: 'Total', es: 'Total' })}:</span>
                      <span className="text-white text-2xl font-bold ml-2">{formatPrice(cartTotal)}</span>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#b3e600] transition-colors">
                      <CreditCard className="w-5 h-5" />
                      {t(translations.shop.checkout)}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-3 mb-12">
            {[
              { key: 'products', label: translations.shop.products, icon: ShoppingBag },
              { key: 'tickets', label: translations.shop.tickets, icon: Ticket },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#CCFF00] text-black'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {t(tab.label)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                    >
                      <div className="aspect-square overflow-hidden">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={t(product.name)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-white/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-white font-bold mb-2">{t(product.name)}</h3>
                        <p className="text-white/50 text-sm line-clamp-2 mb-4">
                          {t(product.description)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[#CCFF00] text-xl font-bold">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-white/40 text-sm line-through ml-2">
                                {formatPrice(product.originalPrice)}
                              </span>
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
                            className="w-10 h-10 bg-[#CCFF00] rounded-lg flex items-center justify-center text-black hover:bg-[#b3e600] transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Produtos de exemplo
                  <>
                    {[
                      { name: 'Camiseta Quero Mais', price: 89.90, originalPrice: 119.90 },
                      { name: 'Boné Official', price: 69.90 },
                      { name: 'Copo Exclusivo', price: 29.90 },
                      { name: 'Kit Festa', price: 149.90 },
                    ].map((product, index) => (
                      <div
                        key={index}
                        className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                      >
                        <div className="aspect-square bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-white/30 group-hover:text-[#CCFF00] transition-colors" />
                        </div>
                        <div className="p-5">
                          <h3 className="text-white font-bold mb-2">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[#CCFF00] text-xl font-bold">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-white/40 text-sm line-through ml-2">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            <button className="w-10 h-10 bg-[#CCFF00] rounded-lg flex items-center justify-center text-black hover:bg-[#b3e600] transition-colors">
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-all"
                    >
                      <div className="aspect-video overflow-hidden">
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            alt={t(event.title)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                            <Ticket className="w-12 h-12 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-white font-bold mb-2">{t(event.title)}</h3>
                        <p className="text-white/50 text-sm mb-4">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        {event.ticketLink && (
                          <a
                            href={event.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-[#CCFF00] text-black font-bold rounded-lg hover:bg-[#b3e600] transition-colors"
                          >
                            <Ticket className="w-4 h-4" />
                            {t(translations.buttons.buyTickets)}
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <Ticket className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50">
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
      </div>
    </section>
  );
}
