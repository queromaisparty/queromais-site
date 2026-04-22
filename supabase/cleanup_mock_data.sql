-- ==============================================================================
-- LIMPEZA DE DADOS MOCK (DJ Alpha, Beta, Gamma, Delta + Produtos Teste)
-- Executar este script no painel SQL do Supabase para limpar tudo.
-- Após rodar, o site mostrará os empty states bonitos até você cadastrar
-- os dados reais pelo Admin (/admin).
-- ==============================================================================

-- 1. Limpar DJs falsos
DELETE FROM public.djs WHERE name ILIKE '%alpha%' OR name ILIKE '%beta%' OR name ILIKE '%gamma%' OR name ILIKE '%delta%' OR name ILIKE '%teste%' OR name ILIKE '%test%' OR name ILIKE '%fake%' OR name ILIKE '%exemplo%';

-- 2. Limpar DJ Sets órfãos (sem DJ vinculado) ou de teste
DELETE FROM public.dj_sets WHERE dj_id IS NULL OR dj_id::uuid NOT IN (SELECT id FROM public.djs);

-- 3. Limpar Playlists de teste
DELETE FROM public.playlists WHERE (title->>'pt') ILIKE '%teste%' OR (title->>'pt') ILIKE '%test%' OR (title->>'pt') ILIKE '%exemplo%' OR (title->>'pt') = '';

-- 4. Limpar Produtos falsos da Loja
DELETE FROM public.products WHERE (name->>'pt') ILIKE '%teste%' OR (name->>'pt') ILIKE '%test%' OR (name->>'pt') ILIKE '%exemplo%' OR (name->>'pt') ILIKE '%sample%';

-- Pronto! Agora cadastre os dados reais pelo painel Admin.
