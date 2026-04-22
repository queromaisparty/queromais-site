/**
 * AdminEvents.tsx — Módulo de gestão de eventos
 * Tema: branco + magenta (var(--primary-color))
 */
import { useState } from 'react';
import {
  Plus, Search, Calendar, MapPin, Eye, EyeOff,
  Pencil, Trash2, X, Save, Users, List,
  ExternalLink, AlertTriangle, Check, ChevronRight
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { FlyerUploader } from './FlyerUploader';
import { TicketLinkManager } from './TicketLinkManager';
import { useDiscountList } from '@/hooks/useDiscountList';
import type { Event, TicketLink } from '@/types';

// ─── Tipos ───────────────────────────────────────────
type EventStatus = 'active' | 'inactive' | 'sold_out';
type TabId = 'event' | 'tickets' | 'lists';
type Filter = 'all' | 'active' | 'sold_out';

interface FormData {
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  status: EventStatus;
  flyer: string;
  ticketLinks: TicketLink[];
  featuredHome: boolean;
}

const EMPTY_FORM: FormData = {
  title: '',
  date: '',
  time: '23:00',
  venue: '',
  city: '',
  status: 'active',
  flyer: '',
  ticketLinks: [],
  featuredHome: false,
};

function eventToForm(e: Event): FormData {
  return {
    title: e.title.pt,
    date: e.date,
    time: e.time,
    venue: e.venue,
    city: e.city ?? '',
    status: e.status as EventStatus,
    flyer: e.flyer ?? '',
    ticketLinks: e.ticketLinks ?? [],
    featuredHome: e.featuredHome ?? false,
  };
}

function formToEvent(f: FormData): Omit<Event, 'id' | 'createdAt' | 'updatedAt'> {
  const title = { pt: f.title, en: f.title, es: f.title };
  return {
    slug: f.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'),
    title,
    shortDescription: { pt: '', en: '', es: '' },
    description: { pt: '', en: '', es: '' },
    coverImage: f.flyer || '',
    flyer: f.flyer,
    gallery: [],
    date: f.date,
    time: f.time,
    endTime: '',
    venue: f.venue,
    city: f.city,
    state: '',
    address: '',
    ticketLinks: f.ticketLinks,
    status: f.status,
    featured: false,
    featuredHome: f.featuredHome,
    order: 0,
  };
}

// ─── Config de status ────────────────────────────────
const STATUS_CONFIG: Record<EventStatus, { label: string; color: string; bg: string; dot: string }> = {
  active:    { label: 'Ativo',     color: '#059669', bg: '#D1FAE5',              dot: '#10B981' },
  inactive:  { label: 'Inativo',   color: '#6B7280', bg: '#F9FAFB',              dot: '#9CA3AF' },
  sold_out:  { label: 'Esgotado', color: '#7C3AED', bg: '#EDE9FE',              dot: '#8B5CF6' },
};

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Input padronizado ────────────────────────────────
function Input({
  label, value, onChange, placeholder, type = 'text', required, half,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean; half?: boolean;
}) {
  return (
    <div className={half ? '' : ''}>
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6B7280' }}>
        {label}{required && <span style={{ color: 'var(--primary-color)' }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
        style={{ background: '#F9FAFB', border: '1px solid #E8E8ED', color: '#1A1A2E' }}
        onFocus={e => { (e.target as HTMLElement).style.borderColor = 'var(--primary-color)'; (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(233,30,140,0.08)'; }}
        onBlur={e => { (e.target as HTMLElement).style.borderColor = '#E8E8ED'; (e.target as HTMLElement).style.boxShadow = 'none'; }}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════
//  ABA LISTAS
// ════════════════════════════════════════════════════
function ListsTab({ eventId, eventTitle, onOpenLists }: { eventId: string; eventTitle: string; onOpenLists: () => void; }) {
  const { list, entries, loading, error, activateList, deactivateList } = useDiscountList(eventId, eventTitle);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: '#F9A8D4', borderTopColor: 'var(--primary-color)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
        <strong>Erro ao carregar lista:</strong> {error}
        <p className="mt-1 text-xs" style={{ color: '#991B1B' }}>
          Verifique se as tabelas <code>events_meta</code> e <code>event_discount_lists</code> foram criadas no Supabase.
        </p>
      </div>
    );
  }

  const isActive = list?.active === true;

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#F9FAFB', border: '1px solid #E8E8ED' }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>Lista de desconto</p>
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
            {isActive ? `${entries.length} inscrito${entries.length !== 1 ? 's' : ''}` : 'Desativada'}
          </p>
        </div>
        <button
          type="button"
          onClick={isActive ? deactivateList : activateList}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          style={{ background: isActive ? 'var(--primary-color)' : '#E5E7EB' }}
        >
          <span
            className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
            style={{ transform: isActive ? 'translateX(24px)' : 'translateX(4px)' }}
          />
        </button>
      </div>

      {isActive && (
        <div className="p-4 rounded-xl space-y-4" style={{ background: '#FDF2F8', border: '1px solid #FBCFE8' }}>
          {entries.length > 0 ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FCE7F3' }}>
                  <Users className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: '#1A1A2E' }}>{entries.length}</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>inscritos</p>
                </div>
              </div>
              <div className="pt-3" style={{ borderTop: '1px solid #FBCFE8' }}>
                <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Última entrada</p>
                <p className="text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  {entries[entries.length - 1]?.name} ·{' '}
                  {new Date(entries[entries.length - 1]?.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#F9A8D4' }} />
              <p className="text-sm" style={{ color: '#9CA3AF' }}>Nenhum inscrito ainda</p>
            </div>
          )}
          <button
            type="button"
            onClick={onOpenLists}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ border: '1px solid #F9A8D4', color: 'var(--primary-color)', background: 'white' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FCE7F3'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; }}
          >
            <List className="w-4 h-4" />
            Abrir lista completa
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {!isActive && (
        <div className="p-4 rounded-xl text-center" style={{ border: '2px dashed #E8E8ED' }}>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Ative a lista para gerenciar inscritos deste evento.</p>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
//  MODAL DE EVENTO
// ════════════════════════════════════════════════════
function EventModal({ initial, eventId, onSave, onClose, onOpenLists }: {
  initial: FormData; eventId?: string;
  onSave: (data: FormData) => void; onClose: () => void; onOpenLists?: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [tab, setTab] = useState<TabId>('event');
  const set = (patch: Partial<FormData>) => setForm(prev => ({ ...prev, ...patch }));
  const isEdit = !!eventId;

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('O título do evento é obrigatório.'); return; }
    if (!form.date) { toast.error('A data do evento é obrigatória.'); return; }
    if (!form.venue.trim()) { toast.error('O local do evento é obrigatório.'); return; }
    onSave(form);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'event', label: 'Evento' },
    { id: 'tickets', label: 'Ingressos' },
    { id: 'lists', label: 'Listas' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />

      {/* Dialog centralizado */}
      <div
        className="relative w-full max-w-lg flex flex-col shadow-2xl rounded-2xl overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid #E8E8ED', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #E8E8ED' }}>
          <div>
            <h2 className="font-bold text-base" style={{ color: '#1A1A2E' }}>
              {isEdit ? 'Editar evento' : 'Novo evento'}
            </h2>
            {form.title && <p className="text-xs mt-0.5 truncate max-w-[280px]" style={{ color: '#9CA3AF' }}>{form.title}</p>}
          </div>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors" style={{ color: '#9CA3AF' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #E8E8ED' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-3 text-sm font-medium transition-all"
              style={{
                color: tab === t.id ? 'var(--primary-color)' : '#9CA3AF',
                borderBottom: tab === t.id ? '2px solid var(--primary-color)' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          {/* ABA EVENTO */}
          {tab === 'event' && (
            <>
              <Input label="Título do evento" value={form.title} onChange={v => set({ title: v })} placeholder="Ex: Green Valley Open Air" required />

              <div className="grid grid-cols-2 gap-3">
                <Input label="Data" value={form.date} onChange={v => set({ date: v })} type="date" required />
                <Input label="Horário" value={form.time} onChange={v => set({ time: v })} type="time" />
              </div>

              <Input label="Local / Casa noturna" value={form.venue} onChange={v => set({ venue: v })} placeholder="Ex: Green Valley, Warung..." required />
              <Input label="Cidade" value={form.city} onChange={v => set({ city: v })} placeholder="Ex: Balneário Camboriú" />

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(STATUS_CONFIG) as [EventStatus, typeof STATUS_CONFIG[EventStatus]][]).map(([key, cfg]) => {
                    const isSelected = form.status === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => set({ status: key })}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
                        style={{
                          background: isSelected ? cfg.bg : '#F9FAFB',
                          border: `1px solid ${isSelected ? cfg.dot : '#E8E8ED'}`,
                          color: isSelected ? cfg.color : '#9CA3AF',
                        }}
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: isSelected ? cfg.dot : '#D1D5DB' }} />
                        {cfg.label}
                        {isSelected && <Check className="w-3.5 h-3.5 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Destaque home */}
              <label
                className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                style={{ background: '#F9FAFB', border: '1px solid #E8E8ED' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#F9A8D4'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8E8ED'; }}
              >
                <input
                  type="checkbox"
                  checked={form.featuredHome}
                  onChange={e => set({ featuredHome: e.target.checked })}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--primary-color)' }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>Destaque na Home</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Aparece no card principal da página inicial</p>
                </div>
              </label>

              {/* Flyer */}
              <FlyerUploader value={form.flyer} onChange={v => set({ flyer: v })} />
            </>
          )}

          {/* ABA INGRESSOS */}
          {tab === 'tickets' && (
            <TicketLinkManager links={form.ticketLinks} onChange={links => set({ ticketLinks: links })} />
          )}

          {/* ABA LISTAS */}
          {tab === 'lists' && isEdit && eventId && (
            <ListsTab
              eventId={eventId}
              eventTitle={form.title || 'Evento'}
              onOpenLists={() => { onClose(); onOpenLists?.(); }}
            />
          )}
          {tab === 'lists' && !isEdit && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: '#FDF2F8' }}>
                <AlertTriangle className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
              </div>
              <p className="text-sm" style={{ color: '#9CA3AF' }}>Salve o evento primeiro para gerenciar a lista.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderTop: '1px solid #E8E8ED', background: '#FFFFFF' }}>
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium transition-colors" style={{ color: '#9CA3AF' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#374151'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; }}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all"
            style={{ background: 'linear-gradient(135deg, var(--primary-color), #FF6BB5)', boxShadow: '0 4px 12px rgba(233,30,140,0.25)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(233,30,140,0.35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(233,30,140,0.25)'; }}
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Salvar alterações' : 'Criar evento'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
//  CARD DE EVENTO
// ════════════════════════════════════════════════════
function EventCard({ event, onEdit, onDelete, onToggleStatus, onOpenLists }: {
  event: Event; onEdit: () => void; onDelete: () => void;
  onToggleStatus: () => void; onOpenLists: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cfg = STATUS_CONFIG[event.status as EventStatus] ?? STATUS_CONFIG.inactive;
  const isActive = event.status === 'active';

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ background: '#FFFFFF', border: '1px solid #E8E8ED', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(233,30,140,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = '#FBCFE8'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = '#E8E8ED'; }}
    >
      <div className="flex">
        {/* Flyer thumbnail */}
        <div className="w-24 sm:w-28 flex-shrink-0 relative overflow-hidden" style={{ background: '#F9FAFB' }}>
          {event.flyer || event.coverImage ? (
            <img src={event.flyer || event.coverImage} alt={event.title.pt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center min-h-[110px]">
              <Calendar className="w-7 h-7" style={{ color: '#D1D5DB' }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
              {cfg.label}
            </span>
            {event.featuredHome && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#FEF3C7', color: '#D97706' }}>★ Home</span>
            )}
          </div>

          <h3 className="font-bold text-sm leading-tight truncate mb-2" style={{ color: '#1A1A2E' }}>
            {event.title.pt}
          </h3>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9CA3AF' }}>
              <Calendar className="w-3 h-3 flex-shrink-0" />
              {fmtDate(event.date)} · {event.time}
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9CA3AF' }}>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{event.venue}{event.city ? ` · ${event.city}` : ''}</span>
            </div>
            {(event.ticketLinks ?? []).length > 0 && (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--primary-color)' }}>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                {event.ticketLinks.length} link{event.ticketLinks.length !== 1 ? 's' : ''} de ingresso
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-1 px-3 py-2" style={{ borderTop: '1px solid #F3F4F6' }}>
        {[
          { label: 'Editar', icon: Pencil, onClick: onEdit, color: '#374151' },
          { label: 'Listas', icon: Users, onClick: onOpenLists, color: 'var(--primary-color)' },
          { label: isActive ? 'Desativar' : 'Ativar', icon: isActive ? EyeOff : Eye, onClick: onToggleStatus, color: '#374151' },
        ].map(({ label, icon: Icon, onClick, color }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ color }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}

        <div className="ml-auto">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium" style={{ color: '#DC2626' }}>Confirmar?</span>
              <button onClick={onDelete} className="px-2.5 py-1 text-xs font-bold text-white rounded-lg" style={{ background: '#EF4444' }}>Sim</button>
              <button onClick={() => setConfirmDelete(false)} className="px-2.5 py-1 text-xs rounded-lg" style={{ background: '#F3F4F6', color: '#6B7280' }}>Não</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: '#D1D5DB' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444'; (e.currentTarget as HTMLElement).style.background = '#FEE2E2'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#D1D5DB'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
//  TELA DE LISTAS
// ════════════════════════════════════════════════════
function EventListsScreen({ event, onBack }: { event: Event; onBack: () => void; }) {
  const { list, entries, loading, addEntry, updateEntryStatus, removeEntry } = useDiscountList(event.id, event.title.pt);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGuests, setNewGuests] = useState(0);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) { toast.error('Nome é obrigatório.'); return; }
    const result = await addEntry({ name: newName.trim(), phone: newPhone.trim(), guests: newGuests, status: 'ok', notes: '' });
    if (result) { setNewName(''); setNewPhone(''); setNewGuests(0); toast.success('Inscrito adicionado.'); }
    else { toast.error('Erro ao adicionar. Verifique a conexão.'); }
  };

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.text(`Lista — ${event.title.pt}`, 14, 16);
    autoTable(doc, {
      head: [['#', 'Nome', 'Telefone', 'Acomp.', 'Cadastro', 'Status']],
      body: entries.map((e, i) => [i + 1, e.name, e.phone ?? '-', e.guests, new Date(e.created_at).toLocaleString('pt-BR'), e.status]),
      startY: 24, styles: { fontSize: 9 },
    });
    doc.save(`lista-${event.title.pt.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleExportExcel = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet(entries.map((e, i) => ({
      '#': i + 1, Nome: e.name, Telefone: e.phone ?? '', Acompanhantes: e.guests,
      Cadastro: new Date(e.created_at).toLocaleString('pt-BR'), Status: e.status, Observação: e.notes ?? '',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lista');
    XLSX.writeFile(wb, `lista-${event.title.pt.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
  };

  const statusStyle: Record<string, { bg: string; color: string }> = {
    ok:        { bg: '#D1FAE5', color: '#059669' },
    usado:     { bg: '#DBEAFE', color: '#2563EB' },
    cancelado: { bg: '#FEE2E2', color: '#DC2626' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl transition-all" style={{ color: '#9CA3AF' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base truncate" style={{ color: '#1A1A2E' }}>{event.title.pt}</h3>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>{fmtDate(event.date)} · {event.venue}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportPDF} disabled={entries.length === 0}
            className="px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-30 transition-all"
            style={{ background: '#FEE2E2', color: '#DC2626' }}>PDF</button>
          <button onClick={handleExportExcel} disabled={entries.length === 0}
            className="px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-30 transition-all"
            style={{ background: '#D1FAE5', color: '#059669' }}>Excel</button>
        </div>
      </div>

      {/* Form adicionar */}
      {list?.active && (
        <div className="p-4 rounded-xl space-y-3" style={{ background: '#FFFFFF', border: '1px solid #E8E8ED' }}>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Adicionar inscrito</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { val: newName, set: setNewName, placeholder: 'Nome *', type: 'text' },
              { val: newPhone, set: setNewPhone, placeholder: 'Telefone', type: 'tel' },
            ].map(({ val, set: setFn, placeholder, type }) => (
              <input
                key={placeholder}
                type={type}
                value={val}
                onChange={e => setFn(e.target.value)}
                placeholder={placeholder}
                className="px-3 py-2 text-sm rounded-xl outline-none transition-all"
                style={{ background: '#F9FAFB', border: '1px solid #E8E8ED', color: '#1A1A2E' }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = 'var(--primary-color)'; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = '#E8E8ED'; }}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs" style={{ color: '#9CA3AF' }}>
              Acompanhantes:
              <select value={newGuests} onChange={e => setNewGuests(Number(e.target.value))}
                className="px-2 py-1 rounded-lg text-sm outline-none" style={{ background: '#F9FAFB', border: '1px solid #E8E8ED', color: '#1A1A2E' }}>
                {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <button
              onClick={() => { setAdding(true); handleAdd().finally(() => setAdding(false)); }}
              disabled={adding}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white rounded-lg ml-auto disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--primary-color), #FF6BB5)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: '#F9A8D4', borderTopColor: 'var(--primary-color)' }} />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: '#FDF2F8' }}>
            <Users className="w-6 h-6" style={{ color: '#F9A8D4' }} />
          </div>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Nenhum inscrito ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{entries.length} inscrito{entries.length !== 1 ? 's' : ''}</p>
          {entries.map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{ background: '#FFFFFF', border: '1px solid #E8E8ED' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#FBCFE8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8E8ED'; }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: '#F3F4F6', color: '#9CA3AF' }}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#1A1A2E' }}>{entry.name}</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  {entry.phone || '—'}{entry.guests > 0 && ` · +${entry.guests} acomp.`}
                </p>
              </div>
              <select value={entry.status}
                onChange={e => updateEntryStatus(entry.id, e.target.value as 'ok' | 'usado' | 'cancelado')}
                className="px-2 py-1 rounded-lg text-xs font-semibold border-0 outline-none cursor-pointer"
                style={{ background: statusStyle[entry.status]?.bg, color: statusStyle[entry.status]?.color }}>
                <option value="ok">OK</option>
                <option value="usado">Usado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <button onClick={() => removeEntry(entry.id)} className="p-1 rounded transition-all" style={{ color: '#D1D5DB' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#D1D5DB'; }}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
//  ADMIN EVENTS — componente principal
// ════════════════════════════════════════════════════
export function AdminEvents() {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [modal, setModal] = useState<{ open: boolean; event?: Event } | null>(null);
  const [listsEvent, setListsEvent] = useState<Event | null>(null);

  const filtered = events
    .filter(e => {
      if (filter === 'active') return e.status === 'active';
      if (filter === 'sold_out') return e.status === 'sold_out';
      return true;
    })
    .filter(e =>
      !search ||
      e.title.pt.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase()) ||
      (e.city ?? '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSave = (data: FormData) => {
    const eventData = formToEvent(data);
    if (modal?.event) { updateEvent(modal.event.id, eventData); toast.success('Evento atualizado!'); }
    else { addEvent(eventData); toast.success('Evento criado!'); }
    setModal(null);
  };

  const handleToggleStatus = (event: Event) => {
    const isActive = event.status === 'active';
    updateEvent(event.id, { status: isActive ? 'inactive' : 'active' });
    toast.success(isActive ? 'Evento desativado.' : 'Evento ativado!');
  };

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'active', label: 'Ativos' },
    { id: 'sold_out', label: 'Esgotados' },
  ];

  // Tela de listas
  if (listsEvent) {
    return (
      <div className="p-6">
        <EventListsScreen event={listsEvent} onBack={() => setListsEvent(null)} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1A1A2E' }}>Eventos</h2>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            {events.length} evento{events.length !== 1 ? 's' : ''} cadastrado{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--primary-color), #FF6BB5)', boxShadow: '0 4px 12px rgba(233,30,140,0.25)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(233,30,140,0.35)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(233,30,140,0.25)'; }}
        >
          <Plus className="w-4 h-4" />
          Novo evento
        </button>
      </div>

      {/* Busca + filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#D1D5DB' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, local ou cidade..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
            style={{ background: '#FFFFFF', border: '1px solid #E8E8ED', color: '#1A1A2E' }}
            onFocus={e => { (e.target as HTMLElement).style.borderColor = 'var(--primary-color)'; }}
            onBlur={e => { (e.target as HTMLElement).style.borderColor = '#E8E8ED'; }}
          />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: filter === f.id ? '#FCE7F3' : '#FFFFFF',
                color: filter === f.id ? 'var(--primary-color)' : '#9CA3AF',
                border: `1px solid ${filter === f.id ? '#FBCFE8' : '#E8E8ED'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#F9FAFB', border: '1px solid #E8E8ED' }}>
            <Calendar className="w-8 h-8" style={{ color: '#D1D5DB' }} />
          </div>
          <p className="font-medium" style={{ color: '#9CA3AF' }}>
            {search ? 'Nenhum resultado encontrado.' : 'Nenhum evento cadastrado.'}
          </p>
          {!search && (
            <button
              onClick={() => setModal({ open: true })}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
              style={{ background: 'linear-gradient(135deg, var(--primary-color), #FF6BB5)' }}
            >
              <Plus className="w-4 h-4" />
              Criar primeiro evento
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => setModal({ open: true, event })}
              onDelete={() => { deleteEvent(event.id); toast.success('Evento excluído.'); }}
              onToggleStatus={() => handleToggleStatus(event)}
              onOpenLists={() => setListsEvent(event)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal?.open && (
        <EventModal
          initial={modal.event ? eventToForm(modal.event) : EMPTY_FORM}
          eventId={modal.event?.id}
          onSave={handleSave}
          onClose={() => setModal(null)}
          onOpenLists={modal.event ? () => { setModal(null); setListsEvent(modal.event!); } : undefined}
        />
      )}
    </div>
  );
}
