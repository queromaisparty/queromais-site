import { Mail, MessageCircle, Instagram, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';

export function ContactSection() {
  const { t } = useLanguage();
  const { contactInfo } = useData();

  return (
    <section id="contact" className="py-12 md:py-24 bg-white relative z-10 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black uppercase tracking-tighter mb-4">
          {t({ pt: 'Fale Conosco', en: 'Get in Touch', es: 'Contáctenos' })}
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-lg mx-auto">
          {t({ 
            pt: 'Canais oficiais de informações e suporte da Quero Mais.',
            en: 'Official information and support channels for Quero Mais.',
            es: 'Canales oficiales de información y soporte de Quero Mais.'
          })}
        </p>

        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-12">
          {contactInfo.whatsapp && (
            <a
              href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all group rounded-none"
            >
              <MessageCircle className="w-6 h-6 text-green-500" />
              <span className="text-black font-semibold">{contactInfo.whatsapp}</span>
            </a>
          )}
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-gray-200 hover:border-pink-500 hover:shadow-sm transition-all group rounded-none"
            >
              <Mail className="w-6 h-6 text-gray-500 group-hover:text-pink-500 transition-colors flex-shrink-0" />
              <span className="text-black font-semibold min-w-0 break-all">{contactInfo.email}</span>
            </a>
          )}
          {contactInfo.instagram && (
            <a
              href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-gray-200 hover:border-pink-500 hover:shadow-sm transition-all group rounded-none"
            >
              <Instagram className="w-6 h-6 text-gray-500 group-hover:text-pink-500 transition-colors" />
              <span className="text-black font-semibold">{contactInfo.instagram}</span>
            </a>
          )}
        </div>

        <Link
          to="/contato"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-qm-magenta text-white font-bold uppercase tracking-wider hover:bg-qm-magenta-dark transition-colors rounded-none text-sm"
        >
          {t({ pt: 'Fale Direto', en: 'Contact Us', es: 'Contáctenos' })}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}


