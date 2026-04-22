-- =====================================================
-- QUERO MAIS — MIGRATION DEFINITIVA: site_config + contact_info
-- Execute este SQL inteiro no SQL Editor do Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/hkgdihysekabkimqyyxs/sql
-- =====================================================

-- =====================================================
-- PASSO 1: Adicionar colunas que faltam em site_config
-- (hero, fica_mais_party, storytelling, home_sections)
-- =====================================================

ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero JSONB DEFAULT NULL;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS fica_mais_party JSONB DEFAULT NULL;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS storytelling JSONB DEFAULT NULL;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS home_sections JSONB DEFAULT '[]';

-- =====================================================
-- PASSO 2: Garantir que a tabela djs tenha TODOS os campos
-- que o DataContext espera
-- =====================================================

ALTER TABLE djs ADD COLUMN IF NOT EXISTS full_bio JSONB DEFAULT NULL;
ALTER TABLE djs ADD COLUMN IF NOT EXISTS image TEXT DEFAULT NULL;
ALTER TABLE djs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'guest';
ALTER TABLE djs ADD COLUMN IF NOT EXISTS music_style TEXT DEFAULT '';
ALTER TABLE djs ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]';
ALTER TABLE djs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE djs ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- =====================================================
-- PASSO 3: Criar tabelas dj_sets e playlists (se nao existem)
-- =====================================================

CREATE TABLE IF NOT EXISTS dj_sets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  dj_id UUID REFERENCES djs(id) ON DELETE SET NULL,
  title JSONB,
  description JSONB,
  cover_image TEXT,
  audio_url TEXT,
  external_link TEXT,
  playlist_url TEXT,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title JSONB,
  description JSONB,
  cover_image TEXT,
  tracks JSONB DEFAULT '[]',
  external_url TEXT,
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name JSONB,
  description JSONB,
  price DECIMAL(10,2),
  quantity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para novas tabelas
ALTER TABLE dj_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policies públicas de leitura
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dj_sets' AND policyname = 'Leitura pública - dj_sets') THEN
    CREATE POLICY "Leitura pública - dj_sets" ON dj_sets FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'playlists' AND policyname = 'Leitura pública - playlists') THEN
    CREATE POLICY "Leitura pública - playlists" ON playlists FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tickets' AND policyname = 'Leitura pública - tickets') THEN
    CREATE POLICY "Leitura pública - tickets" ON tickets FOR SELECT USING (true);
  END IF;
END $$;

-- Policies de escrita autenticada
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dj_sets' AND policyname = 'Escrita autenticada - dj_sets') THEN
    CREATE POLICY "Escrita autenticada - dj_sets" ON dj_sets FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'playlists' AND policyname = 'Escrita autenticada - playlists') THEN
    CREATE POLICY "Escrita autenticada - playlists" ON playlists FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tickets' AND policyname = 'Escrita autenticada - tickets') THEN
    CREATE POLICY "Escrita autenticada - tickets" ON tickets FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- =====================================================
-- PASSO 4: LIMPAR e INSERIR row oficial de site_config
-- =====================================================

-- Deletar registros antigos/corrompidos (se houver)
DELETE FROM site_config;

-- Inserir a ROW OFICIAL com TODOS os campos
INSERT INTO site_config (
  site_name,
  site_description,
  logo,
  favicon,
  primary_color,
  secondary_color,
  social_links,
  seo,
  hero,
  fica_mais_party,
  storytelling,
  home_sections
) VALUES (
  '{"pt": "Quero Mais Day Party", "en": "Want More Day Party", "es": "Quiero Más Day Party"}'::jsonb,
  '{"pt": "Experiência Imersiva | Estética | Música", "en": "Immersive Experience | Aesthetics | Music", "es": "Experiencia Inmersiva | Estética | Música"}'::jsonb,
  '/logo.png',
  '/favicon.ico',
  '#CCFF00',
  '#8B5CF6',
  '[{"platform": "instagram", "url": "https://instagram.com/queromaisparty"}]'::jsonb,
  '{
    "title": {"pt": "Quero Mais Day Party | Agenda Oficial", "en": "Want More Day Party | Official Schedule", "es": "Quiero Más Day Party | Agenda Oficial"},
    "description": {"pt": "A maior experiência de day party do Rio de Janeiro.", "en": "The greatest day party experience in Rio.", "es": "La mejor experiencia de day party en Río."},
    "keywords": "festa, rio de janeiro, day party, música eletrônica, quero mais",
    "ogImage": "/og-image.jpg"
  }'::jsonb,
  '{
    "active": true,
    "desktop": {"url": "/hero-scroll.mp4", "upload": ""},
    "mobile": {"url": "/videoversaomobile.mp4", "upload": ""},
    "fallbackImage": "/hero-poster.jpg"
  }'::jsonb,
  NULL,
  NULL,
  '[]'::jsonb
);

-- =====================================================
-- PASSO 5: LIMPAR e INSERIR row oficial de contact_info
-- =====================================================

DELETE FROM contact_info;

INSERT INTO contact_info (email, phone, whatsapp, instagram, address) VALUES (
  'contato@queromaisparty.com.br',
  '(21) 97259-6991',
  '21972596991',
  '@queromaisparty',
  'RIO DE JANEIRO - RJ'
);

-- =====================================================
-- PASSO 6: VERIFICAÇÃO — rode este SELECT para confirmar
-- =====================================================

SELECT 
  id,
  primary_color,
  secondary_color,
  site_name->>'pt' AS nome,
  hero->>'active' AS hero_ativo
FROM site_config
LIMIT 1;

SELECT id, email, whatsapp, instagram FROM contact_info LIMIT 1;
