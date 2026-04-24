-- Tabela para gestão de vídeos (YouTube After Movies)
CREATE TABLE IF NOT EXISTS gallery_videos_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL, -- TranslatableContent
    youtube_url TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'voce-nao-quer-mais',
    is_featured BOOLEAN DEFAULT false,
    description JSONB, -- TranslatableContent
    event_date DATE,
    status TEXT CHECK (status IN ('draft', 'published', 'scheduled')) DEFAULT 'published',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE gallery_videos_new ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Allow public read access on gallery_videos_new" ON gallery_videos_new
    FOR SELECT USING (true);

CREATE POLICY "Allow all access for authenticated users on gallery_videos_new" ON gallery_videos_new
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_videos_new_updated_at
    BEFORE UPDATE ON gallery_videos_new
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
