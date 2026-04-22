-- =====================================================
-- MIGRATION: Sistema de Listas de Desconto por Evento
-- Execute no SQL Editor do Supabase
-- =====================================================

-- 1. Tabela espelho de eventos para controle de lista
CREATE TABLE IF NOT EXISTS events_meta (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE,
  has_list BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Lista de desconto (1 por evento)
CREATE TABLE IF NOT EXISTS event_discount_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES events_meta(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  notes TEXT,
  max_entries INTEGER DEFAULT NULL,        -- limite de inscritos (null = sem limite)
  deadline TIMESTAMPTZ DEFAULT NULL,       -- data/hora limite para inscrição
  list_title TEXT DEFAULT 'Lista de Desconto', -- título personalizado
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Entradas (inscritos) na lista
CREATE TABLE IF NOT EXISTS event_discount_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES event_discount_lists(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  guests INTEGER DEFAULT 1,
  status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'usado', 'cancelado')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================
ALTER TABLE events_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_discount_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_discount_entries ENABLE ROW LEVEL SECURITY;

-- Dropar policies existentes (se houver) para evitar conflito
DO $$ BEGIN
  DROP POLICY IF EXISTS "acesso_events_meta" ON events_meta;
  DROP POLICY IF EXISTS "acesso_discount_lists" ON event_discount_lists;
  DROP POLICY IF EXISTS "acesso_discount_entries" ON event_discount_entries;
  DROP POLICY IF EXISTS "leitura_publica_events_meta" ON events_meta;
  DROP POLICY IF EXISTS "escrita_auth_events_meta" ON events_meta;
  DROP POLICY IF EXISTS "leitura_publica_discount_lists" ON event_discount_lists;
  DROP POLICY IF EXISTS "escrita_auth_discount_lists" ON event_discount_lists;
  DROP POLICY IF EXISTS "leitura_publica_entries" ON event_discount_entries;
  DROP POLICY IF EXISTS "inserir_publica_entries" ON event_discount_entries;
  DROP POLICY IF EXISTS "escrita_auth_entries" ON event_discount_entries;
END $$;

-- events_meta: leitura pública, escrita autenticada
CREATE POLICY "leitura_publica_events_meta"
  ON events_meta FOR SELECT USING (true);
CREATE POLICY "escrita_auth_events_meta"
  ON events_meta FOR ALL USING (true) WITH CHECK (true);

-- event_discount_lists: leitura pública, escrita autenticada
CREATE POLICY "leitura_publica_discount_lists"
  ON event_discount_lists FOR SELECT USING (true);
CREATE POLICY "escrita_auth_discount_lists"
  ON event_discount_lists FOR ALL USING (true) WITH CHECK (true);

-- event_discount_entries: leitura pública, INSERT público (formulário), update/delete autenticado
CREATE POLICY "leitura_publica_entries"
  ON event_discount_entries FOR SELECT USING (true);
CREATE POLICY "inserir_publica_entries"
  ON event_discount_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "escrita_auth_entries"
  ON event_discount_entries FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- Índices para performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_discount_lists_event ON event_discount_lists(event_id);
CREATE INDEX IF NOT EXISTS idx_discount_entries_list ON event_discount_entries(list_id);
CREATE INDEX IF NOT EXISTS idx_discount_entries_event ON event_discount_entries(event_id);
