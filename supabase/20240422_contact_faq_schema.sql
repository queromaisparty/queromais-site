-- 1. Tabela de FAQ (Perguntas Frequentes)
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question JSONB NOT NULL, -- Ex: { "pt": "...", "en": "..." }
  answer JSONB NOT NULL,   -- Ex: { "pt": "...", "en": "..." }
  category TEXT DEFAULT 'Geral',
  "order" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS para FAQ
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Leitura pública de FAQs ativos" ON faqs;
CREATE POLICY "Leitura pública de FAQs ativos" ON faqs
FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Gerenciamento total para admins" ON faqs;
CREATE POLICY "Gerenciamento total para admins" ON faqs
FOR ALL TO authenticated USING (true);

-- 2. Tabela de Mensagens de Contato (Inbox)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'nova' CHECK (status IN ('nova', 'lida', 'respondida', 'arquivada')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS para Contato
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Inserção pública de mensagens" ON contact_messages;
CREATE POLICY "Inserção pública de mensagens" ON contact_messages
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Leitura apenas para admins" ON contact_messages;
CREATE POLICY "Leitura apenas para admins" ON contact_messages
FOR ALL TO authenticated USING (true);

-- 3. Trigger para updated_at no FAQ
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON faqs
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
