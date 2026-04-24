-- =====================================================
-- QUERO MAIS — Patch: adiciona coluna 'order' em gallery_albums
-- O frontend envia o campo 'order' (GalleryAlbum.order: number)
-- mas a tabela não tinha essa coluna → causava 400 Bad Request
-- Execute no SQL Editor:
-- https://supabase.com/dashboard/project/hkgdihysekabkimqyyxs/sql
-- =====================================================

-- 1. Adicionar coluna order (reservada em SQL — usar aspas)
ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- 2. Verificação — deve aparecer a coluna order na lista
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'gallery_albums'
ORDER BY ordinal_position;
