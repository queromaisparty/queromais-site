import { useState, useEffect } from 'react';
import { Menu, X, Instagram, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentLanguage, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '#home', label: translations.nav.home },
    { key: 'events', href: '#events', label: translations.nav.events },
    { key: 'ficaMais', href: '#fica-mais', label: translations.nav.ficaMais },
    { key: 'music', href: '#music', label: translations.nav.music },
    { key: 'gallery', href: '#gallery', label: translations.nav.gallery },
    { key: 'shop', href: '#shop', label: translations.nav.shop },
    { key: 'contact', href: '#contact', label: translations.nav.contact },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-black tracking-tighter text-white">
              QUERO <span className="text-[#CCFF00]">MAIS</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                className="px-3 py-2 text-sm font-medium text-white/80 hover:text-[#CCFF00] transition-colors uppercase tracking-wide"
              >
                {t(item.label)}
              </a>
            ))}
          </nav>

          {/* Right Side - Language & Social */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
              {(['pt', 'en', 'es'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    currentLanguage === lang
                      ? 'bg-[#CCFF00] text-black'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com/queromais"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/60 hover:text-[#CCFF00] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/60 hover:text-[#CCFF00] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className="px-4 py-3 text-white/80 hover:text-[#CCFF00] hover:bg-white/5 rounded-lg transition-colors uppercase font-medium"
                >
                  {t(item.label)}
                </a>
              ))}
            </nav>

            {/* Mobile Language & Social */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
                {(['pt', 'en', 'es'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                      currentLanguage === lang
                        ? 'bg-[#CCFF00] text-black'
                        : 'text-white/60'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com/queromais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/60"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/60"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
