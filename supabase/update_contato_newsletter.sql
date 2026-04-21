-- 1. Tabela FAQ
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question JSONB NOT NULL,
  answer JSONB NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura publica - faqs" ON faqs FOR SELECT USING (status = 'active');
CREATE POLICY "Gerenciamento admin - faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- 2. Tabela Newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insercao publica - newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Gerenciamento admin - newsletter" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');

-- 3. Atualizar Mensagens de Contato
-- Remover a constraint atual para permitir os novos status, e adicionar 'phone' caso nao exista
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone TEXT;

-- Nao podemos rodar DROP CONSTRAINT se nao soubermos o nome exato gerado, entao vamos apenas recriar a tabela ou forcar update. O Supabase as vezes gera nomes malucos para constraints.
-- Como é rapido, vamos tentar achar a constraint e dropar (PostgreSQL magic):
DO $$
DECLARE
    con_name text;
BEGIN
    SELECT constraint_name INTO con_name 
    FROM information_schema.constraint_column_usage 
    WHERE table_name = 'contact_messages' AND column_name = 'status';
    
    IF con_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE contact_messages DROP CONSTRAINT ' || con_name;
    END IF;
END $$;

ALTER TABLE contact_messages ALTER COLUMN status SET DEFAULT 'nova';

-- 4. Atualizar Dados Globais
-- Deletar o antigo e puxar os novos puros
DELETE FROM contact_info;
INSERT INTO contact_info (email, phone, whatsapp, instagram, address) VALUES
('CONTATO@QUEROMAISPARTY.COM.BR', '21972596991', '21972596991', '@queromaisdayparty', 'RIO DE JANEIRO - RJ');
