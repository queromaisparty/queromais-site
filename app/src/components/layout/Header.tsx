import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const navItems = [
  { href: '#home',      label: { pt: 'Home',              en: 'Home',          es: 'Inicio'    } },
  { href: '#eventos',   label: { pt: 'Eventos',           en: 'Events',        es: 'Eventos'   } },
  { href: '#fica-mais', label: { pt: 'Fica Mais Party',   en: 'Fica Mais',     es: 'Fica Mais' } },
  { href: '#sobre',     label: { pt: 'Sobre',             en: 'About',         es: 'Nosotros'  } },
  { href: '#music',     label: { pt: 'QM Music',          en: 'QM Music',      es: 'QM Music'  } },
  { href: '#voce',      label: { pt: 'Galeria',           en: 'Gallery',       es: 'Galería'   } },
  { href: '#loja',      label: { pt: 'Loja',              en: 'Shop',          es: 'Tienda'    } },
  { href: '#contato',   label: { pt: 'Contato',           en: 'Contact',       es: 'Contacto'  } },
];

const langs = [
  { code: 'pt' as const, label: 'PT' },
  { code: 'en' as const, label: 'EN' },
  { code: 'es' as const, label: 'ES' },
];

export function Header() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  /* ── scroll handler ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── lock body ao abrir drawer ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(href.replace('#', ''));
  };

  return (
    <>
      {/* ══════════════════════════════
          HEADER PRINCIPAL
      ══════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-[#E5E5E5]'
            : 'bg-white border-b border-[#E5E5E5]'
        }`}
      >
        {/* ── LINHA SUPERIOR: logo + idioma + CTAs ── */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 lg:h-16">

            {/* Hambúrguer — mobile only */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden mr-3 p-2 -ml-2 rounded-lg text-[#333] hover:bg-[#F2F2F2] transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
              className="flex items-center shrink-0 group"
            >
              <span className="font-display font-black text-xl lg:text-2xl uppercase tracking-tight text-black group-hover:text-[#6ABD45] transition-colors">
                QUERO<span className="text-[#6ABD45]">+</span>
              </span>
            </a>

            {/* ── Nav links desktop — centralizado ── */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors rounded-lg whitespace-nowrap font-sans ${
                    activeSection === item.href.replace('#', '')
                      ? 'text-[#6ABD45]'
                      : 'text-[#333] hover:text-[#6ABD45] hover:bg-[#F7F7F7]'
                  }`}
                >
                  {t(item.label)}
                </a>
              ))}
            </nav>

            {/* ── Direita: idiomas + CTAs ── */}
            <div className="hidden lg:flex items-center gap-2 shrink-0 ml-4">
              {/* Seletor de idioma */}
              <div className="flex items-center border border-[#E5E5E5] rounded-full px-2.5 py-1 gap-1">
                {langs.map((lang, i) => (
                  <span key={lang.code} className="flex items-center">
                    <button
                      onClick={() => setLanguage(lang.code)}
                      className={`text-[11px] font-bold transition-colors font-sans ${
                        currentLanguage === lang.code
                          ? 'text-[#6ABD45]'
                          : 'text-[#666] hover:text-black'
                      }`}
                    >
                      {lang.label}
                    </button>
                    {i < langs.length - 1 && (
                      <span className="text-[#D5D5D5] mx-1 text-xs select-none">|</span>
                    )}
                  </span>
                ))}
              </div>

              {/* CTA 1 */}
              <a
                href="#eventos"
                onClick={(e) => { e.preventDefault(); scrollTo('#eventos'); }}
                className="flex items-center gap-1 px-4 py-2 bg-[#4A4A4A] hover:bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wide transition-all group font-sans"
              >
                {t({ pt: 'Ingressos', en: 'Tickets', es: 'Entradas' })}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* CTA 2 */}
              <a
                href="#eventos"
                onClick={(e) => { e.preventDefault(); scrollTo('#eventos'); }}
                className="flex items-center gap-1 px-4 py-2 border border-[#4A4A4A] text-[#4A4A4A] hover:bg-[#4A4A4A] hover:text-white rounded-full text-xs font-semibold uppercase tracking-wide transition-all font-sans whitespace-nowrap"
              >
                {t({ pt: 'Mesas e Camarotes', en: 'Mesas e Camarotes', es: 'Mesas VIP' })}
              </a>
            </div>

            {/* Mobile: idioma compacto */}
            <div className="lg:hidden flex items-center ml-auto gap-1">
              {langs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`text-[10px] font-bold px-1.5 py-1 rounded transition-colors font-sans ${
                    currentLanguage === lang.code
                      ? 'text-[#6ABD45]'
                      : 'text-[#666] hover:text-black'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* ══════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Painel lateral */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[78vw] max-w-[320px] bg-white shadow-2xl
                    flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabeçalho do drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
          <span className="font-display font-black text-lg uppercase tracking-tight">
            QUERO<span className="text-[#6ABD45]">+</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1.5 text-[#666] hover:text-black transition-colors rounded-lg hover:bg-[#F2F2F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de navegação */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="w-full text-left px-3 py-3 text-sm font-semibold text-black hover:text-[#6ABD45] hover:bg-[#F7F7F7] rounded-lg transition-all mb-0.5 font-sans"
            >
              {t(item.label)}
            </button>
          ))}
        </nav>

        {/* Rodapé do drawer: CTAs */}
        <div className="px-4 pb-8 pt-4 border-t border-[#E5E5E5] space-y-2.5">
          <a
            href="#eventos"
            onClick={(e) => { e.preventDefault(); scrollTo('#eventos'); }}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#4A4A4A] hover:bg-black text-white rounded-full text-sm font-semibold transition-all font-sans"
          >
            {t({ pt: 'Comprar Ingressos', en: 'Buy Tickets', es: 'Comprar Entradas' })}
            <ChevronRight className="w-4 h-4" />
          </a>
          <a
            href="#eventos"
            onClick={(e) => { e.preventDefault(); scrollTo('#eventos'); }}
            className="flex items-center justify-center gap-2 w-full py-3 border border-[#4A4A4A] text-[#4A4A4A] hover:bg-[#4A4A4A] hover:text-white rounded-full text-sm font-semibold transition-all font-sans"
          >
            {t({ pt: 'Mesas e Camarotes', en: 'Mesas e Camarotes', es: 'Mesas VIP' })}
          </a>
        </div>
      </div>
    </>
  );
}
