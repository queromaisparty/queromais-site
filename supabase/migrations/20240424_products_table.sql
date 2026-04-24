-- =====================================================
-- QUERO MAIS — Migration: Tabela de Produtos da Loja
-- Execute no SQL Editor do Supabase Dashboard:
-- https://supabase.com/dashboard/project/hkgdihysekabkimqyyxs/sql
-- =====================================================

-- ── 1. CRIAR TABELA products ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          JSONB   NOT NULL DEFAULT '{"pt":"","en":"","es":""}',
  description   JSONB   DEFAULT '{"pt":"","en":"","es":""}',
  images        JSONB   DEFAULT '[]',          -- array de URLs de imagem
  price         DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10,2) DEFAULT NULL,   -- preço cortado (opcional)
  category      TEXT    DEFAULT 'vestuario',
  stock         INTEGER DEFAULT 0,
  status        TEXT    DEFAULT 'active'
                CHECK (status IN ('active','inactive','sold_out')),
  featured      BOOLEAN DEFAULT false,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Leitura pública (site público exibe produtos ativos)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Leitura pública - products'
  ) THEN
    CREATE POLICY "Leitura pública - products"
      ON products FOR SELECT USING (true);
  END IF;
END $$;

-- Escrita total liberada (admin usa anon key — sem auth Supabase)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Escrita liberada - products'
  ) THEN
    CREATE POLICY "Escrita liberada - products"
      ON products FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ── 3. TRIGGER: updated_at automático ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 4. GARANTIR bucket site-images existe com policies abertas ────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Enable public access for site-images"  ON storage.objects;
DROP POLICY IF EXISTS "Enable upload for site-images"         ON storage.objects;
DROP POLICY IF EXISTS "Enable update for site-images"         ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for site-images"         ON storage.objects;

CREATE POLICY "Enable public access for site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

CREATE POLICY "Enable upload for site-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Enable update for site-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-images');

CREATE POLICY "Enable delete for site-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-images');

-- ── 5. VERIFICAÇÃO ────────────────────────────────────────────────────────────
SELECT 'Tabela products OK' AS status, count(*) AS total FROM products;
SELECT 'Bucket site-images OK' AS status, name, public FROM storage.buckets WHERE id = 'site-images';
