CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela products se não existir
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL DEFAULT '{"pt": "", "en": "", "es": ""}'::jsonb,
    description JSONB NOT NULL DEFAULT '{"pt": "", "en": "", "es": ""}'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    original_price NUMERIC(10, 2),
    category TEXT NOT NULL DEFAULT 'vestuario',
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    featured BOOLEAN NOT NULL DEFAULT false,
    external_link TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuração RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products"
ON public.products FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow admin all operations on products" ON public.products;
CREATE POLICY "Allow admin all operations on products"
ON public.products FOR ALL
USING (auth.role() = 'authenticated');
