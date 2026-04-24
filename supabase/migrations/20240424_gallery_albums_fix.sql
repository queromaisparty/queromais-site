-- =====================================================
-- QUERO MAIS — Fix definitivo da tabela gallery_albums
-- Alinha o schema ao tipo GalleryAlbum do frontend
-- Execute no SQL Editor:
-- https://supabase.com/dashboard/project/hkgdihysekabkimqyyxs/sql
-- =====================================================

-- 1. Adicionar colunas que faltam no schema original
ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS featured     BOOLEAN DEFAULT false;
ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS category     TEXT    DEFAULT NULL;
ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS type         TEXT    DEFAULT 'internal';
ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS external_link TEXT   DEFAULT NULL;
ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS status       TEXT    DEFAULT 'active';

-- 2. Garantir que images e videos sejam JSONB (não text)
DO $$
BEGIN
  -- images: garante que é jsonb
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_albums' AND column_name = 'images' AND data_type != 'jsonb'
  ) THEN
    ALTER TABLE gallery_albums ALTER COLUMN images TYPE JSONB USING images::jsonb;
  END IF;
  -- cover_image: deve existir como text
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_albums' AND column_name = 'cover_image'
  ) THEN
    ALTER TABLE gallery_albums ADD COLUMN cover_image TEXT DEFAULT NULL;
  END IF;
  -- videos: deve existir como jsonb
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_albums' AND column_name = 'videos'
  ) THEN
    ALTER TABLE gallery_albums ADD COLUMN videos JSONB DEFAULT '[]';
  END IF;
END $$;

-- 3. Garantir RLS aberta (admin usa anon key — sem Supabase Auth)
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública - gallery_albums"  ON gallery_albums;
DROP POLICY IF EXISTS "Escrita liberada - gallery_albums" ON gallery_albums;
-- Dropar policies antigas que exigiam authenticated (bloqueavam o admin)
DROP POLICY IF EXISTS "Admin full access - gallery_albums" ON gallery_albums;
DROP POLICY IF EXISTS "Escrita autenticada - gallery_albums" ON gallery_albums;

CREATE POLICY "Leitura pública - gallery_albums"
  ON gallery_albums FOR SELECT USING (true);

CREATE POLICY "Escrita liberada - gallery_albums"
  ON gallery_albums FOR ALL USING (true) WITH CHECK (true);

-- 4. Corrigir políticas do bucket 'galleries' (estavam exigindo authenticated)
DROP POLICY IF EXISTS "Acesso Público para Galeria"           ON storage.objects;
DROP POLICY IF EXISTS "Upload permitido para Autenticados"    ON storage.objects;
DROP POLICY IF EXISTS "Update/Delete para Autenticados"       ON storage.objects;

-- Garantir que o bucket existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('galleries', 'galleries', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas abertas para anon key (igual ao bucket site-images)
CREATE POLICY "Galeria - leitura pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'galleries');

CREATE POLICY "Galeria - upload liberado"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'galleries');

CREATE POLICY "Galeria - update liberado"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'galleries');

CREATE POLICY "Galeria - delete liberado"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'galleries');

-- 5. Verificação final
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'gallery_albums'
ORDER BY ordinal_position;
