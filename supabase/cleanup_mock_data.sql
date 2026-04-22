-- ==============================================================================
-- LIMPEZA DE DADOS MOCK
-- Executar no painel SQL do Supabase.
-- ==============================================================================

-- 1. Limpar DJs falsos
DELETE FROM public.djs WHERE name ILIKE '%alpha%' OR name ILIKE '%beta%' OR name ILIKE '%gamma%' OR name ILIKE '%delta%' OR name ILIKE '%teste%' OR name ILIKE '%test%' OR name ILIKE '%fake%' OR name ILIKE '%exemplo%';

-- 2. Limpar DJ Sets órfãos
DELETE FROM public.dj_sets WHERE dj_id IS NULL OR dj_id::uuid NOT IN (SELECT id FROM public.djs);

-- 3. Limpar Playlists de teste
DELETE FROM public.playlists WHERE title::text ILIKE '%teste%' OR title::text ILIKE '%test%' OR title::text ILIKE '%exemplo%' OR title::text = '' OR title::text = '{"pt": "", "en": "", "es": ""}';

-- 4. Limpar Produtos falsos da Loja
DELETE FROM public.products WHERE name::text ILIKE '%teste%' OR name::text ILIKE '%test%' OR name::text ILIKE '%exemplo%' OR name::text ILIKE '%sample%';
