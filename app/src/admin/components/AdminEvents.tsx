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
const STATUS_CONFIG: Record<EventStatus, { label: string; textClass: string; bgClass: string; borderClass: string; dotClass: string }> = {
  active:    { label: 'Ativo',    textClass: 'text-emerald-700', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200', dotClass: 'bg-emerald-500' },
  inactive:  { label: 'Inativo',  textClass: 'text-slate-600',   bgClass: 'bg-slate-50',   borderClass: 'border-slate-200',   dotClass: 'bg-slate-400' },
  sold_out:  { label: 'Esgotado', textClass: 'text-violet-700',  bgClass: 'bg-violet-50',  borderClass: 'border-violet-200',  dotClass: 'bg-violet-500' },
};

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Input padronizado ────────────────────────────────
function Input({
  label, value, onChange, placeholder, type = 'text', required
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 pl-1">
        {label}{required && <span className="text-admin-accent ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 text-sm rounded-lg outline-none transition-all bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20"
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
        <div className="w-6 h-6 border-2 border-admin-accent/30 border-t-admin-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600">
        <strong>Erro ao carregar lista:</strong> {error}
        <p className="mt-1 text-[11px] text-red-500">
          Verifique se as configurações de banco de dados e APIs do Supabase estão ativas.
        </p>
      </div>
    );
  }

  const isActive = list?.active === true;

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <p className="text-sm font-bold text-slate-900">Lista VIP / Desconto</p>
          <p className="text-xs mt-0.5 text-slate-500">
            {isActive ? `${entries.length} inscrito${entries.length !== 1 ? 's' : ''}` : 'Atualmente inativa'}
          </p>
        </div>
        <button
          type="button"
          onClick={isActive ? deactivateList : activateList}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-admin-accent' : 'bg-slate-300'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow py-0 transition-transform ${isActive ? 'translate-x-6' : 'translate-x-[4px]'}`}
          />
        </button>
      </div>

      {isActive && (
        <div className="p-5 rounded-xl space-y-4 bg-pink-50/50 border border-pink-100">
          {entries.length > 0 ? (
            <>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-pink-100">
                  <Users className="w-6 h-6 text-admin-accent" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-tight">{entries.length}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">inscritos</p>
                </div>
              </div>
              <div className="pt-4 border-t border-pink-200/50 mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Última entrada</p>
                <p className="text-sm font-medium text-slate-700">
                  <span className="font-bold">{entries[entries.length - 1]?.name}</span> ·{' '}
                  {new Date(entries[entries.length - 1]?.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <Users className="w-8 h-8 mx-auto mb-3 text-pink-300" />
              <p className="text-sm font-medium text-slate-500">Nenhum inscrito ainda</p>
            </div>
          )}
          <button
            type="button"
            onClick={onOpenLists}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold transition-all bg-white text-admin-accent border border-pink-200 hover:bg-pink-50 shadow-sm"
          >
            <List className="w-4 h-4" />
            Gerenciar Lista Completa
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {!isActive && (
        <div className="p-8 rounded-xl text-center border-2 border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-sm text-slate-500">Ative o botão acima para começar a receber nomes para este evento.</p>
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
    { id: 'event', label: 'Evento Global' },
    { id: 'tickets', label: 'Vendas de Ingressos' },
    { id: 'lists', label: 'Lista VIP' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-xl flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0 bg-slate-50 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-lg text-slate-900">
              {isEdit ? 'Editar Evento' : 'Novo Evento'}
            </h2>
            {form.title && <p className="text-sm mt-0.5 text-slate-500 truncate max-w-[300px]">{form.title}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-shrink-0 px-2 pt-2 bg-slate-50/50 border-b border-slate-200 overflow-x-auto custom-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                tab === t.id
                  ? 'border-admin-accent text-admin-accent'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* ABA EVENTO */}
          {tab === 'event' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              <Input label="Título do Evento" value={form.title} onChange={v => set({ title: v })} placeholder="Ex: Baile da Quero Mais" required />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Data de Início" value={form.date} onChange={v => set({ date: v })} type="date" required />
                <Input label="Abertura Portões" value={form.time} onChange={v => set({ time: v })} type="time" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Local / Casa" value={form.venue} onChange={v => set({ venue: v })} placeholder="Ex: Privilège, Hub..." required />
                <Input label="Cidade/UF" value={form.city} onChange={v => set({ city: v })} placeholder="Ex: Rio de Janeiro" />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 pl-1">Status de Disponibilidade</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Object.entries(STATUS_CONFIG) as [EventStatus, typeof STATUS_CONFIG[EventStatus]][]).map(([key, cfg]) => {
                    const isSelected = form.status === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => set({ status: key })}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                          isSelected ? `${cfg.bgClass} ${cfg.borderClass} ${cfg.textClass} shadow-sm ring-1 ring-inset ring-${cfg.colorClass?.split('-')[1]}-100` : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? cfg.dotClass : 'bg-slate-300'}`} />
                        {cfg.label}
                        {isSelected && <Check className="w-4 h-4 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Destaque home */}
              <label
                className={`flex items-start sm:items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                  form.featuredHome ? 'bg-pink-50 border-pink-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="relative flex items-center shrink-0 mt-0.5 sm:mt-0">
                  <input
                    type="checkbox"
                    checked={form.featuredHome}
                    onChange={e => set({ featuredHome: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-admin-accent focus:ring-admin-accent focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <div>
                  <p className={`text-sm font-bold ${form.featuredHome ? 'text-admin-accent' : 'text-slate-900'}`}>Fixar no Topo da Home</p>
                  <p className="text-xs text-slate-500 mt-0.5">Exibe este evento em destaque massivo na seção inicial do site.</p>
                </div>
              </label>

              {/* Flyer */}
              <FlyerUploader value={form.flyer} onChange={v => set({ flyer: v })} />
            </div>
          )}

          {/* ABA INGRESSOS */}
          {tab === 'tickets' && (
             <div className="animate-in fade-in slide-in-from-right-2 duration-300">
               <TicketLinkManager links={form.ticketLinks} onChange={links => set({ ticketLinks: links })} />
             </div>
          )}

          {/* ABA LISTAS */}
          {tab === 'lists' && isEdit && eventId && (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <ListsTab
                eventId={eventId}
                eventTitle={form.title || 'Evento'}
                onOpenLists={() => { onClose(); onOpenLists?.(); }}
              />
            </div>
          )}
          {tab === 'lists' && !isEdit && (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">Crie o evento primeiro</p>
              <p className="text-xs text-slate-500 max-w-[200px]">Você precisa salvar o evento antes de poder habilitar a lista de desconto.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 flex-shrink-0 bg-slate-50 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
            Cancelar Operação
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg bg-admin-accent hover:brightness-110 transition-all shadow-sm active:scale-95"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Atualizar Evento' : 'Publicar Evento'}
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
    <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
      <div className="flex flex-1">
        {/* Flyer thumbnail */}
        <div className="w-28 sm:w-32 flex-shrink-0 relative overflow-hidden bg-slate-50 border-r border-slate-100">
          {event.flyer || event.coverImage ? (
            <img src={event.flyer || event.coverImage} alt={event.title.pt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 sm:p-5 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cfg.bgClass} ${cfg.textClass} border ${cfg.borderClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
              {cfg.label}
            </span>
            {event.featuredHome && (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                ★ Presilha Home
              </span>
            )}
          </div>

          <h3 className="font-black text-slate-900 text-base leading-tight truncate mb-2.5 group-hover:text-admin-accent transition-colors">
            {event.title.pt}
          </h3>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {fmtDate(event.date)} · {event.time}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{event.venue}{event.city ? ` · ${event.city}` : ''}</span>
            </div>
            {(event.ticketLinks ?? []).length > 0 && (
               <div className="flex items-center gap-2 text-[11px] font-bold text-admin-accent mt-2 pt-2 border-t border-slate-100">
                 <ChevronRight className="w-3 h-3 flex-shrink-0" />
                 {event.ticketLinks.length} Ponto{event.ticketLinks.length !== 1 ? 's' : ''} de Venda
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-t border-slate-100 mt-auto">
        <button
          onClick={onEdit}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:text-admin-accent hover:border-admin-accent transition-colors shadow-sm"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </button>
        <button
          onClick={onOpenLists}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-admin-accent bg-pink-50 border border-pink-100 hover:bg-admin-accent hover:text-white transition-colors shadow-sm"
        >
          <Users className="w-3.5 h-3.5" />
          Listas VIP
        </button>
        <button
          onClick={onToggleStatus}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-700 transition-colors shadow-sm ms-auto sm:ms-0"
          title={isActive ? 'Desativar Visibilidade' : 'Ativar Visibilidade'}
        >
          {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        <div className="ml-0 sm:ml-auto flex items-center">
          {confirmDelete ? (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200 bg-red-50 p-1 rounded-lg border border-red-100">
              <span className="text-[10px] font-bold uppercase text-red-600 px-1">Excluir?</span>
              <button onClick={onDelete} className="px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">Sim</button>
              <button onClick={() => setConfirmDelete(false)} className="px-3 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors">Não</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border hover:border-red-100 transition-all ml-2"
              title="Apagar Evento"
            >
               <Trash2 className="w-4 h-4" />
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
    else { toast.error('Erro ao adicionar. Verifique a conexão com o banco.'); }
  };

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF();
      doc.text(`Lista Vip — ${event.title.pt}`, 14, 16);
      autoTable(doc, {
        head: [['#', 'Nome', 'Telefone', 'Acomp.', 'Cadastro', 'Status']],
        body: entries.map((e, i) => [i + 1, e.name, e.phone ?? '-', e.guests, new Date(e.created_at).toLocaleString('pt-BR'), e.status]),
        startY: 24, styles: { fontSize: 9 },
      });
      doc.save(`lista-VIP-${event.title.pt.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      toast.success('PDF Gerado.');
    } catch {
      toast.error('Erro ao gerar PDF.');
    }
  };

  const handleExportExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(entries.map((e, i) => ({
        '#': i + 1, Nome: e.name, Telefone: e.phone ?? '', Acompanhantes: e.guests,
        Cadastro: new Date(e.created_at).toLocaleString('pt-BR'), Status: e.status, Observação: e.notes ?? '',
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Lista VIP');
      XLSX.writeFile(wb, `lista-VIP-${event.title.pt.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
      toast.success('Excel Gerado.');
    } catch {
      toast.error('Erro ao gerar Planilha.');
    }
  };

  const statusStyle: Record<string, { bgClass: string; textClass: string }> = {
    ok:        { bgClass: 'bg-emerald-50', textClass: 'text-emerald-700' },
    usado:     { bgClass: 'bg-blue-50',    textClass: 'text-blue-700' },
    cancelado: { bgClass: 'bg-slate-100',  textClass: 'text-slate-500' },
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <button onClick={onBack} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-admin-accent mb-1">Painel de Listas VIP</p>
          <h3 className="font-black text-2xl truncate text-slate-900 leading-tight">{event.title.pt}</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">{fmtDate(event.date)} · {event.venue}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={handleExportPDF} disabled={entries.length === 0}
            className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-lg disabled:opacity-50 transition-all border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 shadow-sm">
            Gerar PDF
          </button>
          <button onClick={handleExportExcel} disabled={entries.length === 0}
            className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-lg disabled:opacity-50 transition-all border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm">
            Baixar Planilha
          </button>
        </div>
      </div>

      {/* Form adicionar */}
      {list?.active && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-admin-accent" /> Lançamento de Nome Avulso / Convidado Especial
          </p>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome Completo *" 
                className="w-full px-4 py-2.5 text-sm rounded-xl outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 transition-all" />
            </div>
            <div className="md:col-span-3">
              <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="WhatsApp Secundário (opc)" 
                className="w-full px-4 py-2.5 text-sm rounded-xl outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 transition-all" />
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center h-full px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl gap-3">
                <label className="text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Acompanhantes</label>
                <select value={newGuests} onChange={e => setNewGuests(Number(e.target.value))} className="flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>+{n}</option>)}
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={() => { setAdding(true); handleAdd().finally(() => setAdding(false)); }}
                disabled={adding}
                className="w-full h-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl bg-slate-900 hover:bg-admin-accent shadow-sm transition-all disabled:opacity-50"
              >
                Injetar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de nomes presentes*/}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-admin-accent/30 border-t-admin-accent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center bg-slate-50 border border-slate-100 shadow-inner">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-1">A Lista está Vazia</p>
            <p className="text-sm text-slate-500">Divulgue o site para que o público garanta sua presença.</p>
          </div>
        ) : (
          <div>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tabela de Nomes</p>
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-admin-accent shadow-sm">
                Total: {entries.length} pessoa{entries.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {entries.map((entry, i) => (
                <div key={entry.id} className="flex items-center gap-4 p-4 lg:px-6 hover:bg-slate-50/50 transition-colors group">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-slate-100 text-slate-500 flex-shrink-0 border border-slate-200">
                    {i + 1}
                  </span>
                  
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900 truncate">{entry.name}</p>
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                        {entry.phone || 'Sem celular'}
                        {entry.guests > 0 && (
                          <span className="px-2 py-0.5 rounded uppercase text-[9px] bg-slate-200 text-slate-700 tracking-wider">
                            +{entry.guests} Acompanhante{entry.guests > 1 ? 's' : ''}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex sm:items-center justify-start sm:justify-end text-[11px] font-medium text-slate-400">
                      Entrada às {new Date(entry.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 border-l border-slate-100 pl-4 ml-2">
                    <select value={entry.status}
                      onChange={e => updateEntryStatus(entry.id, e.target.value as 'ok' | 'usado' | 'cancelado')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border border-transparent outline-none cursor-pointer transition-all appearance-none text-center min-w-[90px] shadow-sm ${statusStyle[entry.status].bgClass} ${statusStyle[entry.status].textClass}`}>
                      <option value="ok">Validado</option>
                      <option value="usado">Entrou ✓</option>
                      <option value="cancelado">Recusado</option>
                    </select>
                    
                    <button onClick={() => { if(confirm('Quer mesmo remover esse nome da lista?')) removeEntry(entry.id) }} 
                      className="p-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100" title="Apagar Registro">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
    if (modal?.event) { updateEvent(modal.event.id, eventData); toast.success('Evento atualizado eficientemente!'); }
    else { addEvent(eventData); toast.success('Novo evento publicado na agenda!'); }
    setModal(null);
  };

  const handleToggleStatus = (event: Event) => {
    const isActive = event.status === 'active';
    updateEvent(event.id, { status: isActive ? 'inactive' : 'active' });
    toast.success(isActive ? 'Evento temporariamente oculto.' : 'Evento visível e ativo!');
  };

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Toda Agenda' },
    { id: 'active', label: 'Próximos (Ativos)' },
    { id: 'sold_out', label: 'Sold Out (Esgotados)' },
  ];

  // Tela isolada de gerência de listas (full screen context inside module)
  if (listsEvent) {
    return (
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        <EventListsScreen event={listsEvent} onBack={() => setListsEvent(null)} />
      </div>
    );
  }

  // Dashboard de Eventos
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Title Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Agenda de Eventos</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Total de {events.length} evento{events.length !== 1 ? 's' : ''} em sua base de dados central.
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl bg-admin-accent hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Novo Evento
        </button>
      </div>

      {/* Control Bar: Busca + Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar por The Week, Boiler Room..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-lg outline-none bg-transparent font-medium text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <div className="hidden md:block w-px bg-slate-100 my-2" />
        <div className="flex gap-2 min-w-max px-2 md:px-0 mt-2 md:mt-0 flex-wrap pb-2 md:pb-0 items-center">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f.id
                  ? 'bg-admin-accent text-white shadow-sm'
                  : 'bg-transparent text-slate-500 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela/Grid de Eventos */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-5 border border-slate-100 shadow-inner">
            <Calendar className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-xl font-bold text-slate-900 mb-2">
            {search ? 'Agenda Limpa' : 'Nada por aqui'}
          </p>
          <p className="text-sm font-medium text-slate-500 max-w-sm mb-6">
            {search ? 'Nenhum evento corresponde aos seus critérios de busca.' : 'Você ainda não possui eventos. Que tal começar publicando sua primeira festa na agenda?'}
          </p>
          {!search && (
            <button
              onClick={() => setModal({ open: true })}
              className="px-8 py-3 text-sm font-bold text-admin-accent bg-pink-50 border border-pink-100 rounded-xl hover:bg-pink-100 transition-colors shadow-sm"
            >
              Iniciar Cadastro de Evento
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => setModal({ open: true, event })}
              onDelete={() => { deleteEvent(event.id); toast.success('Evento deletado da base.'); }}
              onToggleStatus={() => handleToggleStatus(event)}
              onOpenLists={() => setListsEvent(event)}
            />
          ))}
        </div>
      )}

      {/* Modal Edição/Criação */}
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
