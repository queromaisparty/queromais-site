import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { href: '/',          label: { pt: 'Home',              en: 'Home',          es: 'Inicio'    } },
  { href: '/eventos',   label: { pt: 'Eventos',           en: 'Events',        es: 'Eventos'   } },
  { href: '/fica-mais', label: { pt: 'Fica Mais Party',   en: 'Fica Mais',     es: 'Fica Mais' } },
  { href: '/sobre',     label: { pt: 'Sobre',             en: 'About',         es: 'Nosotros'  } },
  { href: '/music',     label: { pt: 'QM Music',          en: 'QM Music',      es: 'QM Music'  } },
  { href: '/vocenaqm',  label: { pt: 'Você na QM',        en: 'You at QM',     es: 'Usted en QM' } },
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const activeSection = location.pathname;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Agora TODAS as páginas (incluindo a Home com o vídeo claro)
  // terão texto escuro (isLight = true) quando estiverem no topo (!scrolled)
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
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 lg:h-16">

            {/* Hambúrguer — mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`lg:hidden mr-3 p-2 -ml-2 rounded-lg transition-colors ${txt} ${hoverBg}`}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center shrink-0 group">
              <img 
                src={isLight ? '/LOGOQUEROMAIS_PRETA.svg' : '/LOGOQUEROMAIS_BRANCAMAGENTA.svg'} 
                alt="Quero Mais" 
                className="h-6 lg:h-8 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors rounded-lg whitespace-nowrap font-sans ${hoverBg} ${
                    activeSection === item.href ? 'text-[#E91E8C]' : `${txtMuted} hover:text-[#E91E8C]`
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>

            {/* Direita: idiomas + CTA */}
            <div className="hidden lg:flex items-center gap-2 shrink-0 ml-4">
              <div className={`flex items-center border rounded-full px-2.5 py-1 gap-1 ${border}`}>
                {langs.map((lang, i) => (
                  <span key={lang.code} className="flex items-center">
                    <button
                      onClick={() => setLanguage(lang.code)}
                      className={`text-[11px] font-bold transition-colors font-sans ${
                        currentLanguage === lang.code ? 'text-[#E91E8C]' : `${txtMuted} hover:${txt}`
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
                className="flex items-center gap-1 px-4 py-2 bg-[#E91E8C] hover:bg-[#D81B80] text-white rounded-md text-xs font-semibold uppercase tracking-wide transition-all group font-sans"
              >
                {t({ pt: 'Ingressos', en: 'Tickets', es: 'Entradas' })}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile: idioma compacto */}
            <div className="lg:hidden flex items-center ml-auto gap-1">
              {langs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`text-[10px] font-bold px-1.5 py-1 rounded transition-colors font-sans ${
                    currentLanguage === lang.code ? 'text-[#E91E8C]' : `${txtMuted}`
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
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer mobile */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[78vw] max-w-[320px] bg-[#111111] border-r border-[#333] shadow-2xl
                    flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <img 
            src="/LOGOQUEROMAIS_BRANCAMAGENTA.svg" 
            alt="Quero Mais" 
            className="h-5 w-auto"
          />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="p-1.5 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className="block w-full text-left px-3 py-3 text-sm font-semibold text-white/80 hover:text-[#E91E8C] hover:bg-white/5 rounded-lg transition-all mb-0.5 font-sans"
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-8 pt-4 border-t border-white/10 space-y-2.5">
          <Link
            to="/eventos"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#E91E8C] hover:bg-[#D81B80] text-white rounded-md text-sm font-semibold transition-all font-sans"
          >
            {t({ pt: 'Comprar Ingressos', en: 'Buy Tickets', es: 'Comprar Entradas' })}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
