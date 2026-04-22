/**
 * TicketLinkManager.tsx — Tema branco + magenta
 */
import { useState } from 'react';
import { Plus, Trash2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { TicketLink, TicketPlatform } from '@/types';

interface TicketLinkManagerProps {
  links: TicketLink[];
  onChange: (links: TicketLink[]) => void;
}

const PLATFORMS: { value: TicketPlatform; label: string; color: string }[] = [
  { value: 'sympla',             label: 'Sympla',             color: '#7C3AED' },
  { value: 'ingresse',           label: 'Ingresse',           color: '#DC2626' },
  { value: 'shotgun',            label: 'Shotgun',            color: '#D97706' },
  { value: 'bilheteria_digital', label: 'Bilheteria Digital', color: '#059669' },
  { value: 'custom',             label: 'Link Personalizado', color: '#6B7280' },
];

const PLATFORM_LABELS: Record<TicketPlatform, string> = {
  sympla:             'Sympla',
  ingresse:           'Ingresse',
  shotgun:            'Shotgun',
  bilheteria_digital: 'Bilheteria Digital',
  custom:             'Link Personalizado',
};

function newLink(): TicketLink {
  return { id: Date.now().toString(), platform: 'sympla', label: 'Ingresso', url: '', type: 'paid' };
}

function getPlatformColor(platform: TicketPlatform) {
  return PLATFORMS.find(p => p.value === platform)?.color ?? '#6B7280';
}

export function TicketLinkManager({ links, onChange }: TicketLinkManagerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const add = () => {
    const link = newLink();
    onChange([...links, link]);
    setExpandedId(link.id);
  };

  const remove = (id: string) => {
    onChange(links.filter(l => l.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const update = (id: string, patch: Partial<TicketLink>) => {
    onChange(links.map(l => l.id === id ? { ...l, ...patch } : l));
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide" style={{ color: '#374151' }}>
            Links de Ingresso
          </label>
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Sympla, Ingresse, Shotgun...</p>
        </div>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
          style={{
            background: '#FCE7F3',
            color: 'var(--primary-color, #E91E8C)',
            border: '1px solid #FBCFE8',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FDF2F8'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FCE7F3'; }}
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar link
        </button>
      </div>

      {/* Empty state */}
      {links.length === 0 && (
        <div
          className="p-6 rounded-xl text-center"
          style={{ border: '2px dashed #E8E8ED', background: '#F9FAFB' }}
        >
          <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: '#FCE7F3' }}>
            <ExternalLink className="w-5 h-5" style={{ color: 'var(--primary-color, #E91E8C)' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: '#374151' }}>Nenhum link de ingresso</p>
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Clique em "Adicionar link" para incluir</p>
        </div>
      )}

      {/* Links */}
      {links.map((link) => {
        const pColor = getPlatformColor(link.platform);
        const isOpen = expandedId === link.id;

        return (
          <div
            key={link.id}
            className="rounded-xl overflow-hidden transition-all"
            style={{ background: '#FFFFFF', border: `1px solid ${isOpen ? pColor + '40' : '#E8E8ED'}` }}
          >
            {/* Cabeçalho */}
            <div
              className="flex items-center gap-3 p-3 cursor-pointer transition-all"
              onClick={() => setExpandedId(isOpen ? null : link.id)}
              style={{ background: isOpen ? pColor + '08' : 'transparent' }}
            >
              {/* Badge plataforma */}
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex-shrink-0"
                style={{ background: pColor + '15', color: pColor }}
              >
                {PLATFORM_LABELS[link.platform]}
              </span>

              <span className="text-sm font-medium flex-1 truncate" style={{ color: '#1A1A2E' }}>
                {link.label || 'Sem rótulo'}
              </span>

              {link.url && (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="transition-colors"
                  style={{ color: '#D1D5DB' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = pColor; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#D1D5DB'; }}
                  title="Abrir link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={e => { e.stopPropagation(); remove(link.id); }}
                className="transition-colors"
                style={{ color: '#D1D5DB' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#D1D5DB'; }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div style={{ color: '#D1D5DB' }}>
                {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Campos expandidos */}
            {isOpen && (
              <div className="px-3 pb-4 pt-3 space-y-3" style={{ borderTop: `1px solid ${pColor}20` }}>
                <div className="grid grid-cols-2 gap-3">
                  {/* Plataforma */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>Plataforma</label>
                    <select
                      value={link.platform}
                      onChange={e => update(link.id, { platform: e.target.value as TicketPlatform })}
                      className="w-full px-3 py-2 text-sm rounded-xl outline-none transition-all"
                      style={{ background: '#F9FAFB', border: '1px solid #E8E8ED', color: '#1A1A2E' }}
                    >
                      {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>Tipo</label>
                    <select
                      value={link.type}
                      onChange={e => update(link.id, { type: e.target.value as 'free' | 'paid' })}
                      className="w-full px-3 py-2 text-sm rounded-xl outline-none transition-all"
                      style={{ background: '#F9FAFB', border: '1px solid #E8E8ED', color: '#1A1A2E' }}
                    >
                      <option value="paid">Pago</option>
                      <option value="free">Gratuito</option>
                    </select>
                  </div>
                </div>

                {/* Rótulo */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>
                    Rótulo do botão
                    <span className="ml-1 normal-case font-normal" style={{ color: '#D1D5DB' }}>(ex: VIP, Camarote)</span>
                  </label>
                  <input
                    type="text"
                    value={link.label}
                    onChange={e => update(link.id, { label: e.target.value })}
                    placeholder="Ingresso Normal"
                    className="w-full px-3 py-2 text-sm rounded-xl outline-none transition-all"
                    style={{ background: '#F9FAFB', border: '1px solid #E8E8ED', color: '#1A1A2E' }}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = pColor; }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = '#E8E8ED'; }}
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>
                    URL <span style={{ color: 'var(--primary-color, #E91E8C)' }}>*</span>
                  </label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={e => update(link.id, { url: e.target.value })}
                    placeholder="https://sympla.com.br/evento/..."
                    className="w-full px-3 py-2 text-sm rounded-xl outline-none transition-all"
                    style={{ background: '#F9FAFB', border: '1px solid #E8E8ED', color: '#1A1A2E' }}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = pColor; }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = '#E8E8ED'; }}
                  />
                </div>

                {/* Preço */}
                {link.type === 'paid' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9CA3AF' }}>
                      Preço <span className="normal-case font-normal" style={{ color: '#D1D5DB' }}>(opcional)</span>
                    </label>
                    <input
                      type="number"
                      value={link.price ?? ''}
                      onChange={e => update(link.id, { price: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="0,00"
                      min={0}
                      step={0.01}
                      className="w-full px-3 py-2 text-sm rounded-xl outline-none transition-all"
                      style={{ background: '#F9FAFB', border: '1px solid #E8E8ED', color: '#1A1A2E' }}
                      onFocus={e => { (e.target as HTMLElement).style.borderColor = pColor; }}
                      onBlur={e => { (e.target as HTMLElement).style.borderColor = '#E8E8ED'; }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
