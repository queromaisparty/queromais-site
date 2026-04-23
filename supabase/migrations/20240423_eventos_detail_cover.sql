-- =====================================================
-- QUERO MAIS — Capa da Página de Detalhe do Evento
-- Execute no SQL Editor do Supabase Dashboard
-- =====================================================

-- Adicionar campo de capa da página de detalhe individual
ALTER TABLE events ADD COLUMN IF NOT EXISTS detail_cover_image TEXT DEFAULT NULL;

-- Adicionar campos de descrição curta e longa (se ainda não existirem)
ALTER TABLE events ADD COLUMN IF NOT EXISTS short_description JSONB DEFAULT NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS description JSONB DEFAULT NULL;

-- Verificação
SELECT id, title->>'pt' AS titulo, detail_cover_image
FROM events
LIMIT 5;
