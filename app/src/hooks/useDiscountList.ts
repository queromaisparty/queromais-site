/**
 * useDiscountList.ts
 * Hook para gerenciar listas de desconto por evento via Supabase.
 * Cuida de: criar lista, ativar/desativar, adicionar/remover entradas.
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// ─── Tipos ────────────────────────────────────────────
export interface EventMeta {
  id: string;
  title: string;
  event_date?: string;
  has_list: boolean;
}

export interface DiscountList {
  id: string;
  event_id: string;
  active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DiscountEntry {
  id: string;
  list_id: string;
  event_id: string;
  name: string;
  phone?: string;
  guests: number;
  status: 'ok' | 'usado' | 'cancelado';
  notes?: string;
  created_at: string;
}

export type NewEntry = Omit<DiscountEntry, 'id' | 'created_at'>;

// ─── Hook principal ───────────────────────────────────
export function useDiscountList(eventId: string, eventTitle: string) {
  const [list, setList] = useState<DiscountList | null>(null);
  const [entries, setEntries] = useState<DiscountEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Garante que o evento existe em events_meta ──────
  const ensureEventMeta = useCallback(async () => {
    const { error: upsertErr } = await supabase
      .from('events_meta')
      .upsert({ id: eventId, title: eventTitle }, { onConflict: 'id' });
    if (upsertErr) console.warn('events_meta upsert:', upsertErr.message);
  }, [eventId, eventTitle]);

  // ── Carrega lista e entradas ────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await ensureEventMeta();

      const { data: listData, error: listErr } = await supabase
        .from('event_discount_lists')
        .select('*')
        .eq('event_id', eventId)
        .maybeSingle();

      if (listErr) throw listErr;
      setList(listData ?? null);

      if (listData) {
        const { data: entryData, error: entryErr } = await supabase
          .from('event_discount_entries')
          .select('*')
          .eq('list_id', listData.id)
          .order('created_at', { ascending: true });

        if (entryErr) throw entryErr;
        setEntries((entryData as DiscountEntry[]) ?? []);
      } else {
        setEntries([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar lista.');
    } finally {
      setLoading(false);
    }
  }, [eventId, ensureEventMeta]);

  useEffect(() => { load(); }, [load]);

  // ── Ativa a lista (cria se não existir) ─────────────
  const activateList = useCallback(async () => {
    await ensureEventMeta();
    if (list) {
      const { data, error: err } = await supabase
        .from('event_discount_lists')
        .update({ active: true, updated_at: new Date().toISOString() })
        .eq('id', list.id)
        .select()
        .single();
      if (!err && data) setList(data as DiscountList);
    } else {
      const { data, error: err } = await supabase
        .from('event_discount_lists')
        .insert({ event_id: eventId, active: true })
        .select()
        .single();
      if (!err && data) setList(data as DiscountList);
    }
    // Atualiza has_list em events_meta
    await supabase.from('events_meta').update({ has_list: true }).eq('id', eventId);
  }, [list, eventId, ensureEventMeta]);

  // ── Desativa a lista ────────────────────────────────
  const deactivateList = useCallback(async () => {
    if (!list) return;
    const { data, error: err } = await supabase
      .from('event_discount_lists')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', list.id)
      .select()
      .single();
    if (!err && data) setList(data as DiscountList);
    await supabase.from('events_meta').update({ has_list: false }).eq('id', eventId);
  }, [list, eventId]);

  // ── Adiciona entrada ────────────────────────────────
  const addEntry = useCallback(async (entry: Omit<NewEntry, 'list_id' | 'event_id'>) => {
    if (!list) return null;
    const { data, error: err } = await supabase
      .from('event_discount_entries')
      .insert({ ...entry, list_id: list.id, event_id: eventId })
      .select()
      .single();
    if (err) { console.error('addEntry:', err.message); return null; }
    const newEntry = data as DiscountEntry;
    setEntries(prev => [...prev, newEntry]);
    return newEntry;
  }, [list, eventId]);

  // ── Atualiza status da entrada ──────────────────────
  const updateEntryStatus = useCallback(async (entryId: string, status: DiscountEntry['status']) => {
    const { error: err } = await supabase
      .from('event_discount_entries')
      .update({ status })
      .eq('id', entryId);
    if (!err) setEntries(prev => prev.map(e => e.id === entryId ? { ...e, status } : e));
  }, []);

  // ── Remove entrada ──────────────────────────────────
  const removeEntry = useCallback(async (entryId: string) => {
    const { error: err } = await supabase
      .from('event_discount_entries')
      .delete()
      .eq('id', entryId);
    if (!err) setEntries(prev => prev.filter(e => e.id !== entryId));
  }, []);

  return {
    list,
    entries,
    loading,
    error,
    reload: load,
    activateList,
    deactivateList,
    addEntry,
    updateEntryStatus,
    removeEntry,
  };
}
