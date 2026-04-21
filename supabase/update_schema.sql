-- =====================================================
-- QUERO MAIS - Atualização do Schema Supabase
-- Tabelas e colunas faltantes para sincronia do DataContext
-- =====================================================

-- 1. Novas colunas JSONB na tabela site_config para Singletons
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS fica_mais_party JSONB;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS storytelling JSONB;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS home_sections JSONB;

-- 2. Tabela de Ingressos (Tickets)
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name JSONB NOT NULL,
  description JSONB,
  price DECIMAL(10,2) NOT NULL,
  event_id TEXT,
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública - tickets" ON tickets FOR SELECT USING (status = 'active');
CREATE POLICY "Escrita autenticada - tickets" ON tickets FOR ALL USING (auth.role() = 'authenticated');

-- 3. Tabela de DJ Sets
CREATE TABLE IF NOT EXISTS dj_sets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  event TEXT,
  dj_id TEXT,
  soundcloud_url TEXT,
  youtube_url TEXT,
  image TEXT,
  date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE dj_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública - dj_sets" ON dj_sets FOR SELECT USING (status = 'active');
CREATE POLICY "Escrita autenticada - dj_sets" ON dj_sets FOR ALL USING (auth.role() = 'authenticated');

-- 4. Tabela de Playlists
CREATE TABLE IF NOT EXISTS playlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  curator TEXT,
  spotify_url TEXT,
  image TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública - playlists" ON playlists FOR SELECT USING (status = 'active');
CREATE POLICY "Escrita autenticada - playlists" ON playlists FOR ALL USING (auth.role() = 'authenticated');

-- 5. Tabela de Mensagens de Contato
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
-- Qualquer pessoa pode inserir uma mensagem (envio de formulário de contato)
CREATE POLICY "Inserção pública - contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
-- Apenas admins podem ler/atualizar/apagar mensagens
CREATE POLICY "Leitura autenticada - contact_messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Atualização autenticada - contact_messages" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Remoção autenticada - contact_messages" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated');
