-- =====================================================
-- UPGRADE GALERIA: VOCÊ NA QUERO MAIS
-- =====================================================

-- 1. Adicionar colunas necessárias
ALTER TABLE gallery_albums 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'internal' CHECK (type IN ('internal', 'external')),
ADD COLUMN IF NOT EXISTS external_link TEXT;

-- 2. Limpar dados antigos que usem Base64 (Opcional, mas recomendado para sanidade)
-- UPDATE gallery_albums SET images = '[]' WHERE images::text LIKE '%data:image%';

-- 3. Configuração de Storage (Buckets e Políticas)
-- Nota: Supabase Storage usa a tabela storage.buckets e storage.objects

-- Criar bucket 'galleries' se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('galleries', 'galleries', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso público para o bucket
CREATE POLICY "Acesso Público para Galeria" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'galleries');

CREATE POLICY "Upload permitido para Autenticados" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'galleries');

CREATE POLICY "Update/Delete para Autenticados" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'galleries')
WITH CHECK (bucket_id = 'galleries');

-- 4. Inserir um álbum de exemplo externo para teste (OPCIONAL)
-- INSERT INTO gallery_albums (id, title, description, cover_image, type, external_link, status, "order")
-- VALUES (uuid_generate_v4(), 'Exemplo Álbum Externo', 'Este álbum abre no Google Drive', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', 'external', 'https://drive.google.com/drive/folders/1-exemplo', 'active', 0);
