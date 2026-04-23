/**
 * EventListForm.tsx â€” FormulÃ¡rio pÃºblico para o visitante se inscrever na lista de desconto
 * Aparece no card do evento quando a lista estÃ¡ ativa
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Check, X, Loader2, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface EventListFormProps {
  eventId: string;
}

interface ListInfo {
  id: string;
  active: boolean;
  max_entries?: number | null;
  deadline?: string | null;
  list_title?: string | null;
}

export function EventListForm({ eventId }: EventListFormProps) {
  const { t } = useLanguage();
  const [list, setList] = useState<ListInfo | null>(null);
  const [entryCount, setEntryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(0);

  // Load list status for this event
  const loadList = useCallback(async () => {
    try {
      const { data: listData } = await supabase
        .from('event_discount_lists')
        .select('id, active, max_entries, deadline, list_title')
        .eq('event_id', eventId)
        .eq('active', true)
        .maybeSingle();

      if (!listData) {
        setList(null);
        setLoading(false);
        return;
      }

      // Check deadline
      if (listData.deadline && new Date(listData.deadline) < new Date()) {
        setList(null);
        setLoading(false);
        return;
      }

      setList(listData);

      // Get entry count
      const { count } = await supabase
        .from('event_discount_entries')
        .select('*', { count: 'exact', head: true })
        .eq('list_id', listData.id);

      setEntryCount(count ?? 0);
    } catch {
      // Tables may not exist yet â€” silently ignore
      setList(null);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { loadList(); }, [loadList]);

  const isFull = list?.max_entries ? entryCount >= list.max_entries : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!list || !name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error: insertErr } = await supabase
        .from('event_discount_entries')
        .insert({
          list_id: list.id,
          event_id: eventId,
          name: name.trim(),
          phone: phone.trim() || null,
          guests,
          status: 'ok',
          notes: '',
        });

      if (insertErr) throw insertErr;

      setSuccess(true);
      setName('');
      setPhone('');
      setGuests(0);
      setEntryCount(prev => prev + 1);

      // Reset success after 5s
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao inscrever.');
    } finally {
      setSubmitting(false);
    }
  };

  // Don't render if list doesn't exist or isn't active or tables don't exist
  if (loading || !list) return null;
  if (isFull) return null;

  return (
    <>
      {/* BotÃ£o para abrir formulÃ¡rio */}
      {!showForm && !success && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-between w-full sm:w-[240px] px-3 py-2 sm:px-6 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md sm:rounded-lg text-sm sm:text-base font-bold tracking-wider transition-colors font-sans"
        >
          <span>{t({ pt: 'Lista de Desconto', en: 'Guest List', es: 'Lista de Descuento' })}</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-4" />
        </button>
      )}

      {/* Sucesso */}
      {success && (
        <div className="w-full max-w-[280px] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
          <Check className="w-4 h-4 flex-shrink-0" />
          {t({ pt: 'InscriÃ§Ã£o confirmada!', en: 'Registration confirmed!', es: 'Â¡InscripciÃ³n confirmada!' })}
        </div>
      )}

      {/* FormulÃ¡rio inline */}
      {showForm && !success && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[320px] p-4 rounded-xl space-y-3 border"
          style={{ background: '#FFFFFF', borderColor: '#E5E5E5' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              {list.list_title || t({ pt: 'Lista de Desconto', en: 'Discount List', es: 'Lista de Descuento' })}
            </p>
            <button type="button" onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t({ pt: 'Seu nome *', en: 'Your name *', es: 'Tu nombre *' })}
            required
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none focus:border-pink-300 transition-colors"
            style={{ background: '#FAFAFA', color: '#1A1A2E' }}
          />

          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder={t({ pt: 'WhatsApp / Telefone', en: 'Phone / WhatsApp', es: 'WhatsApp / TelÃ©fono' })}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none focus:border-pink-300 transition-colors"
            style={{ background: '#FAFAFA', color: '#1A1A2E' }}
          />

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 whitespace-nowrap">
              {t({ pt: 'Acompanhantes:', en: 'Guests:', es: 'AcompaÃ±antes:' })}
            </label>
            <select
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              className="px-2 py-1.5 rounded-lg text-sm border border-gray-200 outline-none bg-white"
            >
              {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full py-2.5 text-sm font-bold text-white rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            style={{ background: 'var(--primary-color, #E91E8C)' }}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                {t({ pt: 'Confirmar InscriÃ§Ã£o', en: 'Confirm Registration', es: 'Confirmar InscripciÃ³n' })}
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
}

