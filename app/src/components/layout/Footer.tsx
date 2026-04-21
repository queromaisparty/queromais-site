import { Instagram, MessageCircle, Mail, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

interface FooterProps {
  onAdminClick?: () => void;
}

const navLinks = [
  { href: '#home', label: { pt: 'Home', en: 'Home', es: 'Inicio' } },
  { href: '#eventos', label: { pt: 'PrÃ³ximos Eventos', en: 'Events', es: 'Eventos' } },
  { href: '#fica-mais', label: { pt: 'Fica Mais Party', en: 'Fica Mais Party', es: 'Fica Mais Party' } },
  { href: '#sobre', label: { pt: 'Sobre a Quero Mais', en: 'About', es: 'Nosotros' } },
  { href: '#music', label: { pt: 'QM Music', en: 'QM Music', es: 'QM Music' } },
  { href: '#voce', label: { pt: 'VocÃª na Quero Mais?', en: 'Gallery', es: 'GalerÃ­a' } },
  { href: '#loja', label: { pt: 'Loja', en: 'Shop', es: 'Tienda' } },
  { href: '#contato', label: { pt: 'Contato', en: 'Contact', es: 'Contacto' } },
];

export function Footer({ onAdminClick }: FooterProps) {
  const { t } = useLanguage();
  const { contactInfo } = useData();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A]">
      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
              className="inline-block group"
            >
              <span className="font-display font-black text-2xl text-white group-hover:text-[#C2185B] transition-colors uppercase tracking-tight">
                QUERO<span className="text-[#C2185B]">+</span>
              </span>
            </a>
            <p className="mt-4 text-white/50 text-sm leading-relaxed font-sans">
              {t({
                pt: 'ExperiÃªncias que marcam. MÃºsica, atmosfera, comunidade e energia que transformam noites em memÃ³rias.',
                en: 'Experiences that mark. Music, atmosphere, community and energy that turn nights into memories.',
                es: 'Experiencias que marcan. MÃºsica, atmÃ³sfera, comunidad y energÃ­a que transforman noches en recuerdos.',
              })}
            </p>
            {/* Redes Sociais */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={`https://instagram.com/${contactInfo.instagram?.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-md bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#E91E8C] hover:text-white hover:border-[#E91E8C] transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-md bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#E91E8C] hover:text-white hover:border-[#E91E8C] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="w-10 h-10 rounded-md bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#E91E8C] hover:text-white hover:border-[#E91E8C] transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* NavegaÃ§Ã£o */}
          <div>
            <h3 className="font-sans font-bold text-white uppercase tracking-[0.1em] text-sm mb-5">
              {t({ pt: 'NavegaÃ§Ã£o', en: 'Navigation', es: 'NavegaciÃ³n' })}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className="text-white/50 hover:text-[#C2185B] transition-colors text-sm font-sans flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" />
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-sans font-bold text-white uppercase tracking-[0.1em] text-sm mb-5">
              {t({ pt: 'Contato', en: 'Contact', es: 'Contacto' })}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C2185B] mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-white/50 hover:text-[#C2185B] transition-colors text-sm font-sans"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-[#C2185B] mt-0.5 flex-shrink-0" />
                <a
                  href={`https://wa.me/${contactInfo.whatsapp?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-[#C2185B] transition-colors text-sm font-sans"
                >
                  {contactInfo.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C2185B] mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm font-sans">{contactInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-sans font-bold text-white uppercase tracking-[0.1em] text-sm mb-5">
              {t({ pt: 'Newsletter', en: 'Newsletter', es: 'Newsletter' })}
            </h3>
            <p className="text-white/50 text-sm mb-5 font-sans">
              {t({
                pt: 'Seja o primeiro a saber sobre nossos prÃ³ximos eventos.',
                en: 'Be the first to know about our next events.',
                es: 'SÃ© el primero en saber sobre nuestros prÃ³ximos eventos.',
              })}
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t({ pt: 'Seu e-mail', en: 'Your email', es: 'Tu correo' })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white/80 placeholder:text-white/30 text-sm focus:outline-none focus:border-[#E91E8C] transition-colors font-sans"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-[#E91E8C] hover:bg-[#D81B80] text-white font-semibold rounded-md text-sm transition-colors font-sans"
              >
                {t({ pt: 'Quero receber', en: 'Subscribe', es: 'Suscribirme' })}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs font-sans">
            Â© {new Date().getFullYear()} Quero Mais. {t({ pt: 'Todos os direitos reservados.', en: 'All rights reserved.', es: 'Todos los derechos reservados.' })}
          </p>
          <button
            onClick={onAdminClick}
            className="text-white/25 hover:text-[#C2185B] text-xs transition-colors font-sans"
          >
            {t({ pt: 'Ãrea Administrativa', en: 'Admin Area', es: 'Ãrea Administrativa' })}
          </button>
        </div>
      </div>
    </footer>
  );
}
