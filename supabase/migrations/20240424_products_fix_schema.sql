-- =====================================================
-- QUERO MAIS — Fix definitivo da tabela products
-- A tabela existia com schema antigo/diferente.
-- Este migration alinha o banco ao tipo Product do frontend.
-- Execute no SQL Editor:
-- https://supabase.com/dashboard/project/hkgdihysekabkimqyyxs/sql
-- =====================================================

-- 1. Adicionar coluna images (JSONB array) — o frontend envia arrays de URLs
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';

-- 2. Migrar dados antigos: copiar image → images (se houver registros)
UPDATE products
SET images = jsonb_build_array(image)
WHERE image IS NOT NULL AND image != '' AND (images IS NULL OR images = '[]'::jsonb);

-- 3. Adicionar colunas que faltam
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured      BOOLEAN       DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS order_index   INTEGER       DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2) DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ   DEFAULT NOW();

-- 4. Corrigir o CHECK de status para aceitar 'out_of_stock' (frontend usa isso)
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;
ALTER TABLE products
  ADD CONSTRAINT products_status_check
  CHECK (status IN ('active', 'inactive', 'out_of_stock'));

-- 5. Garantir que name e description sejam JSONB (não text)
--    (se já for jsonb, o ALTER falhará silenciosamente — ok)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'name' AND data_type = 'text'
  ) THEN
    ALTER TABLE products ALTER COLUMN name TYPE JSONB USING name::jsonb;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'description' AND data_type = 'text'
  ) THEN
    ALTER TABLE products ALTER COLUMN description TYPE JSONB USING description::jsonb;
  END IF;
END $$;

-- 6. Garantir RLS aberta (o admin usa anon key, sem auth Supabase)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública - products"   ON products;
DROP POLICY IF EXISTS "Escrita liberada - products"  ON products;

CREATE POLICY "Leitura pública - products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Escrita liberada - products"
  ON products FOR ALL USING (true) WITH CHECK (true);

-- 7. Trigger updated_at automático
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

-- 8. Verificação final — deve mostrar todas as colunas corretas
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
