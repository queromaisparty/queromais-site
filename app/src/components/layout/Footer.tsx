import { Instagram, MessageCircle, Mail, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

interface FooterProps {
  onAdminClick?: () => void;
}

const navLinks = [
  { href: '/', label: { pt: 'Home', en: 'Home', es: 'Inicio' } },
  { href: '/eventos', label: { pt: 'Próximos Eventos', en: 'Events', es: 'Eventos' } },
  { href: '/fica-mais', label: { pt: 'Fica Mais Party', en: 'Fica Mais Party', es: 'Fica Mais Party' } },
  { href: '/sobre', label: { pt: 'Sobre a Quero Mais', en: 'About', es: 'Nosotros' } },
  { href: '/music', label: { pt: 'QM Music', en: 'QM Music', es: 'QM Music' } },
  { href: '/vocenaqm', label: { pt: 'Você na Quero Mais?', en: 'You at QM', es: 'Usted en QM' } },
  { href: '/loja', label: { pt: 'Loja', en: 'Shop', es: 'Tienda' } },
  { href: '/contato', label: { pt: 'Contato', en: 'Contact', es: 'Contacto' } },
];

export function Footer({ onAdminClick }: FooterProps) {
  const { t } = useLanguage();
  const { contactInfo, addNewsletterSubscriber } = useData();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulando delay
    addNewsletterSubscriber({ email, active: true });
    toast.success('Inscrição confirmada com sucesso!');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-[#0A0A0A]">
      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="mb-8 md:mb-0">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-block group mb-6">
              <img 
                src="/LOGOQUEROMAIS_BRANCAMAGENTA.svg" 
                alt="Quero Mais" 
                className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              {t({
                pt: 'Quero Mais Day Party. Onde o dia se transforma em experiência.',
                en: 'Quero Mais Day Party. Where the day turns into an experience.',
                es: 'Quero Mais Day Party. Donde el día se transforma en una experiencia.',
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

          {/* Navegação */}
          <div>
            <h3 className="font-bold text-white uppercase tracking-[0.1em] text-sm mb-5">
              {t({ pt: 'Navegação', en: 'Navigation', es: 'Navegación' })}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-[#C2185B] transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all" />
                    {t(link.label)}
                  </Link>
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
                pt: 'Seja o primeiro a saber sobre nossos próximos eventos.',
                en: 'Be the first to know about our next events.',
                es: 'Sé el primero en saber sobre nuestros próximos eventos.',
              })}
            </p>
            <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t({ pt: 'Seu e-mail', en: 'Your email', es: 'Tu correo' })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white/80 placeholder:text-white/30 text-sm focus:outline-none focus:border-[#E91E8C] transition-colors font-sans"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-[#E91E8C] hover:bg-[#D81B80] text-white font-semibold rounded-md text-sm transition-colors font-sans disabled:opacity-50"
              >
                {isSubmitting ? '...' : t({ pt: 'Quero receber', en: 'Subscribe', es: 'Suscribirme' })}
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
            className="text-white/25 hover:text-[#C2185B] text-xs transition-colors font-sans"
          >
            {t({ pt: 'Ãrea Administrativa', en: 'Admin Area', es: 'Ãrea Administrativa' })}
          </button>
        </div>
      </div>
    </footer>
  );
}
