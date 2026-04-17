-- =====================================================
-- QUERO MAIS - Schema Supabase
-- Execute no SQL Editor do painel Supabase
-- =====================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: site_config
-- =====================================================
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_name JSONB NOT NULL DEFAULT '{"pt": "Quero Mais", "en": "Want More", "es": "Quiero Más"}',
  site_description JSONB,
  logo TEXT,
  favicon TEXT,
  primary_color TEXT DEFAULT '#CCFF00',
  secondary_color TEXT DEFAULT '#8B5CF6',
  social_links JSONB DEFAULT '[]',
  seo JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: events
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title JSONB NOT NULL,
  description JSONB,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  price DECIMAL(10,2),
  ticket_url TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: faqs
-- =====================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question JSONB NOT NULL,
  answer JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  "order" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: banners
-- =====================================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title JSONB,
  subtitle JSONB,
  image TEXT,
  cta_text JSONB,
  cta_url TEXT,
  "order" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: djs
-- =====================================================
CREATE TABLE IF NOT EXISTS djs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  bio JSONB,
  photo TEXT,
  instagram TEXT,
  soundcloud TEXT,
  spotify TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: products
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name JSONB NOT NULL,
  description JSONB,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category TEXT DEFAULT 'merchandise',
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: contact_info
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  address TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABELA: gallery_albums
-- =====================================================
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title JSONB NOT NULL,
  description JSONB,
  cover_image TEXT,
  images JSONB DEFAULT '[]',
  event_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RLS (Row Level Security) - Leitura pública
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE djs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;

-- Policies de leitura pública (anon pode ler)
CREATE POLICY "Leitura pública - site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Leitura pública - events" ON events FOR SELECT USING (status = 'active');
CREATE POLICY "Leitura pública - faqs" ON faqs FOR SELECT USING (status = 'active');
CREATE POLICY "Leitura pública - banners" ON banners FOR SELECT USING (status = 'active');
CREATE POLICY "Leitura pública - djs" ON djs FOR SELECT USING (status = 'active');
CREATE POLICY "Leitura pública - products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Leitura pública - contact_info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Leitura pública - gallery_albums" ON gallery_albums FOR SELECT USING (status = 'active');

-- Policies de escrita autenticada (apenas admins autenticados)
CREATE POLICY "Escrita autenticada - site_config" ON site_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada - events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada - faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada - banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada - djs" ON djs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada - products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada - contact_info" ON contact_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita autenticada - gallery_albums" ON gallery_albums FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- Dados iniciais
-- =====================================================
INSERT INTO site_config (site_name, primary_color, secondary_color)
VALUES (
  '{"pt": "Quero Mais", "en": "Want More", "es": "Quiero Más"}',
  '#CCFF00',
  '#8B5CF6'
) ON CONFLICT DO NOTHING;

INSERT INTO contact_info (email, phone, whatsapp, instagram, address)
VALUES (
  'contato@queromais.com',
  '+55 11 99999-9999',
  '+55 11 99999-9999',
  '@queromais',
  'São Paulo, SP'
) ON CONFLICT DO NOTHING;
