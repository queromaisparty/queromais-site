import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Link, useLocation } from 'react-router-dom';

const baseNavItems = [
  { href: '/',          label: { pt: 'Home',              en: 'Home',          es: 'Inicio'    } },
  { href: '/eventos',   label: { pt: 'PRÓXIMAS EXPERIÊNCIAS',  en: 'UPCOMING EXPERIENCES', es: 'PRÓXIMAS EXPERIENCIAS' } },
  { href: '/fica-mais', label: { pt: 'Fica Mais Party',   en: 'Fica Mais',     es: 'Fica Mais' } },
  { href: '/sobre',     label: { pt: 'Sobre',             en: 'About',         es: 'Nosotros'  } },
  { href: '/music',     label: { pt: 'QM Music',          en: 'QM Music',      es: 'QM Music'  } },
  { href: '/vocenaqm',  label: { pt: 'VOCÊ NA QUERO MAIS', en: 'YOU AT QUERO MAIS', es: 'VOCÊ NA QUERO MAIS' } },
  { href: '/loja',      label: { pt: 'Loja',              en: 'Shop',          es: 'Tienda'    } },
  { href: '/contato',   label: { pt: 'Contato',           en: 'Contact',       es: 'Contacto'  } },
];

const langs = [
  { code: 'pt' as const, label: 'PT' },
  { code: 'en' as const, label: 'EN' },
  { code: 'es' as const, label: 'ES' },
];

export function Header() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { siteConfig } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const activeSection = location.pathname;

  const navItems = baseNavItems.filter(item => {
    if (item.href === '/loja' && siteConfig.hero?.showShop === false) return false;
    return true;
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLight = !scrolled;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // dynamic text colors: dark on light sections (top), white otherwise
  const txt    = isLight ? 'text-[#1A1A2E]'      : 'text-white';
  const txtMuted = isLight ? 'text-[#1A1A2E]/60'  : 'text-white/70';
  const border = isLight ? 'border-black/20'      : 'border-white/20';
  const hoverBg = isLight ? 'hover:bg-black/5'    : 'hover:bg-white/10';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/60 backdrop-blur-lg shadow-xl border-b border-white/10'
            : 'bg-white shadow-sm border-b border-gray-100 lg:bg-transparent lg:shadow-none lg:border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 lg:h-16">

            {/* Hambúrguer — somente mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`lg:hidden mr-3 p-2 -ml-2 rounded-sm transition-colors ${txt} ${hoverBg}`}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center shrink-0 group">
              {/* Mobile: fundo branco no topo → sempre logo preta. Com scroll (fundo escuro) → logo branca */}
              <img
                src={scrolled ? '/LOGOQUEROMAIS_BRANCA.svg' : '/LOGOQUEROMAIS_PRETA.svg'}
                alt="Quero Mais"
                className="h-6 w-auto transition-transform duration-300 group-hover:scale-105 lg:hidden"
              />
              {/* Desktop: inalterado — segue isLight normalmente */}
              <img
                src={isLight ? '/LOGOQUEROMAIS_PRETA.svg' : '/LOGOQUEROMAIS_BRANCA.svg'}
                alt="Quero Mais"
                className="hidden lg:block h-8 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors rounded-sm whitespace-nowrap font-sans ${hoverBg} ${
                    activeSection === item.href ? 'text-qm-magenta' : `${txtMuted} hover:text-qm-magenta`
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>

            {/* Direita: idiomas + CTA */}
            <div className="hidden lg:flex items-center gap-2 shrink-0 ml-4">
              <div className={`flex items-center border rounded-sm px-2.5 py-1 gap-1 ${border}`}>
                {langs.map((lang, i) => (
                  <span key={lang.code} className="flex items-center">
                    <button
                      onClick={() => setLanguage(lang.code)}
                      className={`text-[11px] font-bold transition-colors font-sans ${
                        currentLanguage === lang.code ? 'text-qm-magenta' : `${txtMuted} hover:${txt}`
                      }`}
                    >
                      {lang.label}
                    </button>
                    {i < langs.length - 1 && (
                      <span className={`mx-1 text-xs select-none ${isLight ? 'text-black/20' : 'text-white/20'}`}>|</span>
                    )}
                  </span>
                ))}
              </div>

              <Link
                to="/eventos"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1 px-4 py-2 bg-qm-magenta hover:bg-qm-magenta-dark text-white rounded-sm text-xs font-semibold uppercase tracking-wide transition-all group font-sans"
              >
                {t({ pt: 'Ingressos', en: 'Tickets', es: 'Entradas' })}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile: idioma compacto — hitbox maior para toque */}
            <div className="lg:hidden flex items-center ml-auto gap-0">
              {langs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`text-xs font-bold min-w-[36px] min-h-[36px] flex items-center justify-center rounded-sm transition-colors font-sans ${
                    currentLanguage === lang.code
                      ? 'text-qm-magenta'
                      : `${txtMuted}`
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* Backdrop mobile */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer mobile — claro, elegante, coerente com o site branco */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[82vw] max-w-[360px] bg-white shadow-2xl
                    flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header do drawer */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-gray-100">
          <img 
            src="/LOGOQUEROMAIS_PRETA.svg" 
            alt="Quero Mais" 
            className="h-5 w-auto"
          />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors rounded-sm"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Links de navegação */}
        <nav className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 w-full text-left px-3 py-3 text-[15px] font-semibold uppercase tracking-wide transition-all rounded-sm ${
                  isActive
                    ? 'text-qm-magenta bg-pink-50/60'
                    : 'text-[#333] hover:text-qm-magenta hover:bg-gray-50'
                }`}
              >
                {isActive && <span className="w-1 h-5 bg-qm-magenta rounded-full flex-shrink-0" />}
                {t(item.label)}
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA do drawer */}
        <div className="px-5 pb-6 pt-3 border-t border-gray-100 space-y-3">
          {/* Idiomas — hitbox generosa */}
          <div className="flex items-center justify-center gap-1 py-2">
            {langs.map((lang, i) => (
              <span key={lang.code} className="flex items-center">
                <button
                  onClick={() => setLanguage(lang.code)}
                  className={`text-xs font-bold min-w-[40px] min-h-[40px] flex items-center justify-center rounded-sm transition-colors font-sans ${
                    currentLanguage === lang.code
                      ? 'text-qm-magenta bg-pink-50/60'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {lang.label}
                </button>
                {i < langs.length - 1 && (
                  <span className="text-gray-200 text-xs select-none">|</span>
                )}
              </span>
            ))}
          </div>

          <Link
            to="/eventos"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-qm-magenta hover:bg-qm-magenta-dark text-white rounded-sm text-sm font-bold transition-all uppercase tracking-wide"
          >
            {t({ pt: 'Comprar Ingressos', en: 'Buy Tickets', es: 'Comprar Entradas' })}
          </Link>
        </div>
      </div>
    </>
  );
}
