import { useState } from 'react';
import { Mail, MessageCircle, Instagram, MapPin, Send, ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { translations } from '@/lib/translations';
import { toast } from 'sonner';

export function ContactSection() {
  const { t } = useLanguage();
  const { contactInfo, faqs } = useData();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(t({
      pt: 'Mensagem enviada com sucesso!',
      en: 'Message sent successfully!',
      es: '¡Mensaje enviado con éxito!'
    }));
    
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-full mb-6">
              <Mail className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-[#CCFF00] text-sm font-bold uppercase tracking-wider">
                {t({ pt: 'Fale Conosco', en: 'Get in Touch', es: 'Habla con Nosotros' })}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
              {t(translations.contact.title)}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t(translations.contact.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-white text-2xl font-bold mb-6">
                {t({ pt: 'Envie uma mensagem', en: 'Send a message', es: 'Envía un mensaje' })}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      {t(translations.contact.form.name)}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00] transition-colors"
                      placeholder={t({ pt: 'Seu nome', en: 'Your name', es: 'Tu nombre' })}
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      {t(translations.contact.form.email)}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00] transition-colors"
                      placeholder={t({ pt: 'seu@email.com', en: 'your@email.com', es: 'tu@email.com' })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      {t(translations.contact.form.phone)}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00] transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      {t(translations.contact.form.subject)}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00] transition-colors"
                      placeholder={t({ pt: 'Assunto', en: 'Subject', es: 'Asunto' })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    {t(translations.contact.form.message)}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#CCFF00] transition-colors resize-none"
                    placeholder={t({ pt: 'Sua mensagem...', en: 'Your message...', es: 'Tu mensaje...' })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#b3e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t(translations.contact.form.send)}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info & FAQ */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-white text-xl font-bold mb-6">
                  {t({ pt: 'Informações de Contato', en: 'Contact Information', es: 'Información de Contacto' })}
                </h3>
                <div className="space-y-4">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#CCFF00]/10 rounded-xl flex items-center justify-center group-hover:bg-[#CCFF00]/20 transition-colors">
                      <Mail className="w-5 h-5 text-[#CCFF00]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Email</p>
                      <p className="text-white font-medium">{contactInfo.email}</p>
                    </div>
                  </a>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">WhatsApp</p>
                      <p className="text-white font-medium">{contactInfo.whatsapp}</p>
                    </div>
                  </a>
                  <a
                    href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                      <Instagram className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Instagram</p>
                      <p className="text-white font-medium">{contactInfo.instagram}</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">
                        {t({ pt: 'Localização', en: 'Location', es: 'Ubicación' })}
                      </p>
                      <p className="text-white font-medium">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <HelpCircle className="w-6 h-6 text-[#CCFF00]" />
                  <h3 className="text-white text-xl font-bold">
                    {t(translations.contact.faq)}
                  </h3>
                </div>
                <div className="space-y-3">
                  {faqs.filter(f => f.status === 'active').slice(0, 5).map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-white/10 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                      >
                        <span className="text-white font-medium pr-4">{t(faq.question)}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#CCFF00] flex-shrink-0 transition-transform ${
                            openFaq === faq.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openFaq === faq.id && (
                        <div className="px-4 pb-4">
                          <p className="text-white/60">{t(faq.answer)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
