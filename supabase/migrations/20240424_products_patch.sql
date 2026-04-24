-- =====================================================
-- QUERO MAIS — Patch: Corrige tabela products
-- Alinha a tabela com o tipo Product do frontend
-- Execute no SQL Editor:
-- https://supabase.com/dashboard/project/hkgdihysekabkimqyyxs/sql
-- =====================================================

-- 1. Adicionar coluna external_link que estava faltando
ALTER TABLE products ADD COLUMN IF NOT EXISTS external_link TEXT DEFAULT NULL;

-- 2. Corrigir o CHECK de status: 'sold_out' → 'out_of_stock'
--    Precisa dropar o constraint antigo e criar o correto
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;
ALTER TABLE products
  ADD CONSTRAINT products_status_check
  CHECK (status IN ('active', 'inactive', 'out_of_stock'));

-- 3. Verificação final
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
