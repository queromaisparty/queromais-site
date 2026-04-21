import { Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function AdminContact() {
  const { t } = useLanguage();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
          Contato e FAQ
        </h2>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
          Edite as dúvidas Frequentes (FAQ) e contatos corporativos.
        </p>
      </div>
      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: '#FFFFFF', border: '1px solid #E8E8ED' }}
      >
        <div
          className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
          style={{ background: '#FCE7F3' }}
        >
          <Settings className="w-8 h-8" style={{ color: '#E91E8C' }} />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A2E' }}>
          {t({ pt: 'Em Desenvolvimento', en: 'Under Development', es: 'En Desarrollo' })}
        </h3>
        <p className="text-sm max-w-sm mx-auto" style={{ color: '#9CA3AF' }}>
          {t({
            pt: 'Módulo CRM de contatos e criação dinâmica de FAQ em breve.',
            en: 'Contacts CRM and dynamic FAQ creation module coming soon.',
            es: 'Módulo CRM de contactos y creación dinámica de FAQ pronto.',
          })}
        </p>
      </div>
    </div>
  );
}
