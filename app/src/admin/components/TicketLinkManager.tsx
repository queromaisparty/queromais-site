/**
 * TicketLinkManager.tsx
 */
import { useState } from 'react';
import { Plus, Trash2, ExternalLink, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import type { TicketLink, TicketPlatform } from '@/types';

interface TicketLinkManagerProps {
  links: TicketLink[];
  onChange: (links: TicketLink[]) => void;
}

const PLATFORMS: { value: TicketPlatform; label: string; colorClass: string; bgClass: string; borderClass: string }[] = [
  { value: 'sympla',             label: 'Sympla',             colorClass: 'text-violet-600', bgClass: 'bg-violet-50', borderClass: 'border-violet-200' },
  { value: 'ingresse',           label: 'Ingresse',           colorClass: 'text-red-600',    bgClass: 'bg-red-50',    borderClass: 'border-red-200' },
  { value: 'shotgun',            label: 'Shotgun',            colorClass: 'text-amber-600',  bgClass: 'bg-amber-50',  borderClass: 'border-amber-200' },
  { value: 'bilheteria_digital', label: 'Bilheteria Digital', colorClass: 'text-emerald-600',bgClass: 'bg-emerald-50',borderClass: 'border-emerald-200' },
  { value: 'guedder',            label: 'Guedder',            colorClass: 'text-fuchsia-600',bgClass: 'bg-fuchsia-50',borderClass: 'border-fuchsia-200' },
  { value: 'custom',             label: 'Link Personalizado', colorClass: 'text-slate-600',  bgClass: 'bg-slate-100', borderClass: 'border-slate-200' },
];

const PLATFORM_LABELS: Record<TicketPlatform, string> = {
  sympla:             'Sympla',
  ingresse:           'Ingresse',
  shotgun:            'Shotgun',
  bilheteria_digital: 'Bilheteria Digital',
  guedder:            'Guedder',
  custom:             'Link Personalizado',
};

function newLink(): TicketLink {
  return { id: Date.now().toString(), platform: 'sympla', label: 'Ingresso Padrão', url: '', type: 'paid' };
}

function getPlatformStyles(platform: TicketPlatform) {
  const def = PLATFORMS.find(p => p.value === 'custom')!;
  return PLATFORMS.find(p => p.value === platform) || def;
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-slate-400" />
            Links de Ingresso
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">Sympla, Ingresse, Guedder, Shotgun...</p>
        </div>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-pink-50 text-admin-accent border border-pink-100 hover:bg-pink-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar link
        </button>
      </div>

      {/* Empty state */}
      {links.length === 0 && (
        <div className="p-8 rounded-xl text-center border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-white shadow-sm border border-slate-100">
            <ExternalLink className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-700">Nenhum link ativo</p>
          <p className="text-xs mt-1 text-slate-500 max-w-[200px] mx-auto">Adicione os pontos de venda (links oficiais) deste evento.</p>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link) => {
          const styles = getPlatformStyles(link.platform);
          const isOpen = expandedId === link.id;

          return (
            <div
              key={link.id}
              className={`rounded-xl overflow-hidden transition-all border bg-white ${isOpen ? 'shadow-md border-slate-300 ring-1 ring-slate-100' : 'shadow-sm border-slate-200 hover:border-slate-300'}`}
            >
              {/* Box Top / Collapse Header */}
              <div
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${isOpen ? styles.bgClass + ' bg-opacity-30' : 'hover:bg-slate-50'}`}
                onClick={() => setExpandedId(isOpen ? null : link.id)}
              >
                {/* Badge } */}
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${styles.bgClass} ${styles.colorClass} border ${styles.borderClass}`}>
                  {PLATFORM_LABELS[link.platform]}
                </span>

                <span className={`text-sm font-semibold flex-1 truncate ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
                  {link.label || 'Venda de Ingressos'}
                </span>

                {link.url && (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-white hover:text-blue-500 hover:shadow-sm border border-transparent transition-all"
                    title="Testar LinkExterno"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); remove(link.id); }}
                  className="p-1.5 rounded-md text-slate-400 hover:bg-white hover:text-red-500 hover:border-red-200 hover:shadow-sm border border-transparent transition-all"
                  title="Excluir Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="text-slate-400 ml-1">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Form Body */}
              {isOpen && (
                <div className="p-4 space-y-4 border-t border-slate-100 bg-white">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Platform Selector */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Fornecedor / Plataforma</label>
                      <select
                        value={link.platform}
                        onChange={e => update(link.id, { platform: e.target.value as TicketPlatform })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-admin-accent/50 focus:border-admin-accent font-medium transition-all"
                      >
                        {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </div>

                    {/* Ticket Type */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Gratuidade</label>
                      <select
                        value={link.type}
                        onChange={e => update(link.id, { type: e.target.value as 'free' | 'paid' })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-admin-accent/50 focus:border-admin-accent font-medium transition-all"
                      >
                        <option value="paid">Ingresso Pago</option>
                        <option value="free">Lote Gratuito / VIP</option>
                      </select>
                    </div>
                  </div>

                  {/* Button Label */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Texto do Botão
                      <span className="ml-1 normal-case font-normal text-slate-400">(ex: VIP, Camarote, 1º Lote)</span>
                    </label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={e => update(link.id, { label: e.target.value })}
                      placeholder="Comprar Ingresso"
                      className="w-full px-4 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all"
                    />
                  </div>

                  {/* Link URL */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                      URL de Destino <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={e => update(link.id, { url: e.target.value })}
                      placeholder="https://suaplataforma.com.br/evento/..."
                      className="w-full px-4 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all"
                    />
                  </div>

                  {/* Price */}
                  {link.type === 'paid' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                        <span>Valor de Referência <span className="normal-case font-normal text-slate-400">(opcional)</span></span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm font-medium">R$</span>
                        <input
                          type="number"
                          value={link.price ?? ''}
                          onChange={e => update(link.id, { price: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="0.00"
                          min={0}
                          step={0.01}
                          className="w-full px-4 py-2.5 pl-9 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
