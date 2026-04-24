-- =====================================================
-- QUERO MAIS — Adicionar description em dj_sets
-- Execute no SQL Editor do Supabase
-- =====================================================

ALTER TABLE public.dj_sets
ADD COLUMN IF NOT EXISTS description JSONB DEFAULT '{"pt": "", "en": "", "es": ""}'::jsonb;
