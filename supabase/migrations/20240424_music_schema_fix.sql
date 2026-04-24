-- =====================================================
-- QUERO MAIS — Fix tabelas djs e dj_sets
-- Execute no SQL Editor do Supabase
-- =====================================================

-- ── TABELA djs ───────────────────────────────────────────────────────────────
ALTER TABLE djs ADD COLUMN IF NOT EXISTS full_bio      JSONB    DEFAULT NULL;
ALTER TABLE djs ADD COLUMN IF NOT EXISTS music_style   TEXT     DEFAULT NULL;
ALTER TABLE djs ADD COLUMN IF NOT EXISTS social_links  JSONB    DEFAULT '[]';
ALTER TABLE djs ADD COLUMN IF NOT EXISTS featured      BOOLEAN  DEFAULT false;
ALTER TABLE djs ADD COLUMN IF NOT EXISTS order_index   INTEGER  DEFAULT 0;
ALTER TABLE djs ADD COLUMN IF NOT EXISTS status        TEXT     DEFAULT 'active';

-- Garantir bio como JSONB
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='djs' AND column_name='bio' AND data_type='text') THEN
    ALTER TABLE djs ALTER COLUMN bio TYPE JSONB USING to_jsonb(bio);
  END IF;
END $$;

-- RLS djs
ALTER TABLE djs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Leitura pública - djs"  ON djs;
DROP POLICY IF EXISTS "Escrita liberada - djs"  ON djs;
CREATE POLICY "Leitura pública - djs"  ON djs FOR SELECT  USING (true);
CREATE POLICY "Escrita liberada - djs"  ON djs FOR ALL    USING (true) WITH CHECK (true);

-- ── TABELA dj_sets ────────────────────────────────────────────────────────────
ALTER TABLE dj_sets ADD COLUMN IF NOT EXISTS dj_id          TEXT     DEFAULT NULL;
ALTER TABLE dj_sets ADD COLUMN IF NOT EXISTS cover_image     TEXT     DEFAULT NULL;
ALTER TABLE dj_sets ADD COLUMN IF NOT EXISTS audio_url       TEXT     DEFAULT NULL;
ALTER TABLE dj_sets ADD COLUMN IF NOT EXISTS soundcloud_url  TEXT     DEFAULT NULL;
ALTER TABLE dj_sets ADD COLUMN IF NOT EXISTS external_link   TEXT     DEFAULT NULL;
ALTER TABLE dj_sets ADD COLUMN IF NOT EXISTS playlist_url    TEXT     DEFAULT NULL;
ALTER TABLE dj_sets ADD COLUMN IF NOT EXISTS featured        BOOLEAN  DEFAULT false;
ALTER TABLE dj_sets ADD COLUMN IF NOT EXISTS order_index     INTEGER  DEFAULT 0;
ALTER TABLE dj_sets ADD COLUMN IF NOT EXISTS status          TEXT     DEFAULT 'active';

-- Garantir title e description como JSONB
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='dj_sets' AND column_name='title' AND data_type='text') THEN
    ALTER TABLE dj_sets ALTER COLUMN title TYPE JSONB USING to_jsonb(title);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='dj_sets' AND column_name='description' AND data_type='text') THEN
    ALTER TABLE dj_sets ALTER COLUMN description TYPE JSONB USING to_jsonb(description);
  END IF;
END $$;

-- RLS dj_sets
ALTER TABLE dj_sets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Leitura pública - dj_sets"  ON dj_sets;
DROP POLICY IF EXISTS "Escrita liberada - dj_sets"  ON dj_sets;
CREATE POLICY "Leitura pública - dj_sets"  ON dj_sets FOR SELECT  USING (true);
CREATE POLICY "Escrita liberada - dj_sets"  ON dj_sets FOR ALL    USING (true) WITH CHECK (true);

-- ── VERIFICAÇÃO ───────────────────────────────────────────────────────────────
SELECT 'djs' AS tabela, column_name, data_type FROM information_schema.columns WHERE table_name='djs' ORDER BY ordinal_position;
SELECT 'dj_sets' AS tabela, column_name, data_type FROM information_schema.columns WHERE table_name='dj_sets' ORDER BY ordinal_position;
