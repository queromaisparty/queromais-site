-- =====================================================
-- QUERO MAIS - Fase 3: Contato e FAQ
-- Execute no SQL Editor do painel Supabase
-- =====================================================

-- 1. TABELA: contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'nova' CHECK (status IN ('nova', 'lida', 'respondida', 'arquivada')),
  type TEXT DEFAULT 'contato', -- contato, reserva, camarote, etc
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA: newsletter_subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AJUSTES NA TABELA: faqs (Garantir JSONB e RLS)
-- A tabela já existe no schema base, mas garantimos as políticas aqui.

-- 4. RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Escrita pública (qualquer um pode enviar contato/newsletter)
CREATE POLICY "Escrita pública - contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Escrita pública - newsletter_subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Leitura e Admin
CREATE POLICY "Admin total - contact_messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total - newsletter_subscribers" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');

-- FAQ RLS complementar (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Leitura pública - faqs') THEN
        CREATE POLICY "Leitura pública - faqs" ON faqs FOR SELECT USING (status = 'active');
    END IF;
END $$;
