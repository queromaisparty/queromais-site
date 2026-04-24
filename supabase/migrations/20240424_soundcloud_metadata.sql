-- =====================================================
-- QUERO MAIS — Adicionar metadata em dj_sets
-- Execute no SQL Editor do Supabase
-- =====================================================

ALTER TABLE public.dj_sets
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
