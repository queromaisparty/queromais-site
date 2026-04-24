-- Script para corrigir a tabela event_discount_lists adicionando colunas faltantes
ALTER TABLE public.event_discount_lists 
ADD COLUMN IF NOT EXISTS max_entries INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS list_title TEXT DEFAULT 'Lista de Desconto';
