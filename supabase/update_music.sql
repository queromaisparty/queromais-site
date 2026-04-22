-- ==============================================================================
-- MIGRAÇÃO SUPABASE (NOVO ESTADO DO QM MUSIC)
-- Executar este script no painel SQL do Supabase.
-- ==============================================================================

-- 1. TABELA DE DJS -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.djs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bio JSONB NOT NULL DEFAULT '{"pt": "", "en": "", "es": ""}'::jsonb,
    full_bio JSONB DEFAULT '{"pt": "", "en": "", "es": ""}'::jsonb,
    image TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'special', -- resident, guest, special
    music_style TEXT NOT NULL DEFAULT 'Open Format',
    social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active', -- active, inactive
    featured BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE DJ SETS ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dj_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dj_id UUID REFERENCES public.djs(id) ON DELETE SET NULL,
    title JSONB NOT NULL DEFAULT '{"pt": "", "en": "", "es": ""}'::jsonb,
    description JSONB NOT NULL DEFAULT '{"pt": "", "en": "", "es": ""}'::jsonb,
    cover_image TEXT NOT NULL,
    audio_url TEXT,
    external_link TEXT,
    playlist_url TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- active, inactive
    featured BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE PLAYLISTS -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL DEFAULT '{"pt": "", "en": "", "es": ""}'::jsonb,
    description JSONB NOT NULL DEFAULT '{"pt": "", "en": "", "es": ""}'::jsonb,
    cover_image TEXT NOT NULL,
    tracks JSONB NOT NULL DEFAULT '[]'::jsonb,
    external_url TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- active, inactive
    featured BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- HABILITAR RLS ----------------------------------------------------------------
ALTER TABLE public.djs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dj_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PUBLICAS (LEITURA) -------------------------------------------------
-- Qualquer usuário pode ler (SELECT) de forma anônima
CREATE POLICY "Permitir leitura pública para djs" ON public.djs FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública para dj_sets" ON public.dj_sets FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública para playlists" ON public.playlists FOR SELECT USING (true);

-- POLÍTICAS ADMIN (ESCRITA, UPDATE DELETAR) ------------------------------------
-- Apenas usuários autenticados (ou usando a key service) podem inserir/editar.
-- (Simplificado para permitir anon roles gerenciarem via app sem auth complexa temporariamente para os dashboards abertos se houver)
CREATE POLICY "Permitir tudo para autenticados em djs" ON public.djs FOR ALL USING (true);
CREATE POLICY "Permitir tudo para autenticados em dj_sets" ON public.dj_sets FOR ALL USING (true);
CREATE POLICY "Permitir tudo para autenticados em playlists" ON public.playlists FOR ALL USING (true);
