-- Corrige o Instagram antigo (@queromaisparty) para o novo (@queromaisdayparty)
-- Executar no SQL Editor do Supabase

-- 1. Atualizar tabela contact_info
UPDATE contact_info
SET instagram = '@queromaisdayparty';

-- 2. Atualizar social_links dentro de site_config (JSONB)
UPDATE site_config
SET social_links = jsonb_set(
  social_links::jsonb,
  '{0,url}',
  '"https://www.instagram.com/queromaisdayparty/"'
)
WHERE social_links::text LIKE '%queromaisparty%';
