import { Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import { useData } from '@/context/DataContext';

interface FooterProps {
  onAdminClick?: () => void;
}

export function Footer({ onAdminClick }: FooterProps) {
  const { t } = useLanguage();
  const { contactInfo } = useData();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { href: '#home', label: translations.nav.home },
    { href: '#events', label: translations.nav.events },
    { href: '#fica-mais', label: translations.nav.ficaMais },
    { href: '#music', label: translations.nav.music },
    { href: '#gallery', label: translations.nav.gallery },
    { href: '#shop', label: translations.nav.shop },
    { href: '#contact', label: translations.nav.contact },
  ];

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}>
              <span className="text-2xl font-black tracking-tighter text-white">
                QUERO <span className="text-[#CCFF00]">MAIS</span>
              </span>
            </a>
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              Experiências únicas e inesquecíveis. Festas, música e energia que transformam suas noites em memórias eternas.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#CCFF00] hover:text-black transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#CCFF00] hover:text-black transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#CCFF00] hover:text-black transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wide mb-4">
              {t({ pt: 'Navegação', en: 'Navigation', es: 'Navegación' })}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="text-white/60 hover:text-[#CCFF00] transition-colors text-sm"
                  >
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wide mb-4">
              {t(translations.nav.contact)}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-white/60 hover:text-[#CCFF00] transition-colors text-sm"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <a 
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[#CCFF00] transition-colors text-sm"
                >
                  {contactInfo.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">
                  {contactInfo.address}
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wide mb-4">
              {t({ pt: 'Newsletter', en: 'Newsletter', es: 'Newsletter' })}
            </h3>
            <p className="text-white/60 text-sm mb-4">
              {t({ 
                pt: 'Receba novidades sobre nossos eventos exclusivos.',
                en: 'Get news about our exclusive events.',
                es: 'Recibe novedades sobre nuestros eventos exclusivos.'
              })}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t({ pt: 'Seu e-mail', en: 'Your email', es: 'Tu correo' })}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#CCFF00]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#CCFF00] text-black font-bold rounded-lg hover:bg-[#b3e600] transition-colors text-sm"
              >
                {t({ pt: 'Enviar', en: 'Send', es: 'Enviar' })}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Quero Mais. {t(translations.footer.rights)}
          </p>
          <button
            onClick={onAdminClick}
            className="text-white/40 hover:text-[#CCFF00] text-sm transition-colors"
          >
            {t({ pt: 'Área Administrativa', en: 'Admin Area', es: 'Área Administrativa' })}
          </button>
        </div>
      </div>
    </footer>
  );
}
