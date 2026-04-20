import { Instagram, MessageCircle, Mail, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

interface FooterProps {
  onAdminClick?: () => void;
}

const navLinks = [
  { href: '#home', label: { pt: 'Home', en: 'Home', es: 'Inicio' } },
  { href: '#eventos', label: { pt: 'Próximos Eventos', en: 'Events', es: 'Eventos' } },
  { href: '#fica-mais', label: { pt: 'Fica Mais Party', en: 'Fica Mais Party', es: 'Fica Mais Party' } },
  { href: '#sobre', label: { pt: 'Sobre a Quero Mais', en: 'About', es: 'Nosotros' } },
  { href: '#music', label: { pt: 'QM Music', en: 'QM Music', es: 'QM Music' } },
  { href: '#voce', label: { pt: 'Você na Quero Mais?', en: 'Gallery', es: 'Galería' } },
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
              <span className="font-display font-black text-2xl text-white group-hover:text-[#6ABD45] transition-colors uppercase tracking-tight">
                QUERO<span className="text-[#6ABD45]">+</span>
              </span>
            </a>
            <p className="mt-4 text-white/50 text-sm leading-relaxed font-sans">
              {t({
                pt: 'Experiências que marcam. Música, atmosfera, comunidade e energia que transformam noites em memórias.',
                en: 'Experiences that mark. Music, atmosphere, community and energy that turn nights into memories.',
                es: 'Experiencias que marcan. Música, atmósfera, comunidad y energía que transforman noches en recuerdos.',
              })}
            </p>
            {/* Redes Sociais */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={`https://instagram.com/${contactInfo.instagram?.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#6ABD45] hover:text-white hover:border-[#6ABD45] transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#6ABD45] hover:text-white hover:border-[#6ABD45] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#6ABD45] hover:text-white hover:border-[#6ABD45] transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-display font-bold text-white uppercase tracking-[0.1em] text-sm mb-5">
              {t({ pt: 'Navegação', en: 'Navigation', es: 'Navegación' })}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className="text-white/50 hover:text-[#6ABD45] transition-colors text-sm font-sans flex items-center gap-1 group"
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
            <h3 className="font-display font-bold text-white uppercase tracking-[0.1em] text-sm mb-5">
              {t({ pt: 'Contato', en: 'Contact', es: 'Contacto' })}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#6ABD45] mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-white/50 hover:text-[#6ABD45] transition-colors text-sm font-sans"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-[#6ABD45] mt-0.5 flex-shrink-0" />
                <a
                  href={`https://wa.me/${contactInfo.whatsapp?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-[#6ABD45] transition-colors text-sm font-sans"
                >
                  {contactInfo.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#6ABD45] mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm font-sans">{contactInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display font-bold text-white uppercase tracking-[0.1em] text-sm mb-5">
              {t({ pt: 'Newsletter', en: 'Newsletter', es: 'Newsletter' })}
            </h3>
            <p className="text-white/50 text-sm mb-5 font-sans">
              {t({
                pt: 'Seja o primeiro a saber sobre nossos próximos eventos.',
                en: 'Be the first to know about our next events.',
                es: 'Sé el primero en saber sobre nuestros próximos eventos.',
              })}
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t({ pt: 'Seu e-mail', en: 'Your email', es: 'Tu correo' })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white/80 placeholder:text-white/30 text-sm focus:outline-none focus:border-[#6ABD45] transition-colors font-sans"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-[#6ABD45] hover:bg-[#4e9630] text-white font-semibold rounded-full text-sm transition-colors font-sans"
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
            © {new Date().getFullYear()} Quero Mais. {t({ pt: 'Todos os direitos reservados.', en: 'All rights reserved.', es: 'Todos los derechos reservados.' })}
          </p>
          <button
            onClick={onAdminClick}
            className="text-white/25 hover:text-[#6ABD45] text-xs transition-colors font-sans"
          >
            {t({ pt: 'Área Administrativa', en: 'Admin Area', es: 'Área Administrativa' })}
          </button>
        </div>
      </div>
    </footer>
  );
}
