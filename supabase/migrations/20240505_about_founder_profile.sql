-- ============================================================
-- MIGRATION: about_founder_profile
-- Seção "Founder & Creative Director" da página Sobre
-- ============================================================

-- 1. Criar tabela
create table if not exists public.about_founder_profile (
  id uuid primary key default gen_random_uuid(),
  eyebrow text default 'Founder & Creative Director',
  name text default 'LUCAS BORGES',
  role text default 'Founder & Creative Director — QUERO MAIS GROUP',
  bio text,
  photo_url text,
  photo_path text,
  photo_alt text default 'Lucas Borges, Founder & Creative Director da QUERO MAIS GROUP',
  is_active boolean default true,
  sort_order integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_about_founder_profile_updated_at on public.about_founder_profile;

create trigger set_about_founder_profile_updated_at
before update on public.about_founder_profile
for each row
execute function public.set_updated_at();

-- 3. Seed inicial (somente se vazio)
insert into public.about_founder_profile (
  eyebrow,
  name,
  role,
  bio,
  photo_alt,
  is_active,
  sort_order
)
select
  'Founder & Creative Director',
  'LUCAS BORGES',
  'Founder & Creative Director — QUERO MAIS GROUP',
  E'Residente do Rio de Janeiro, Lucas Borges é produtor de eventos, empreendedor e diretor criativo, fundador da QUERO MAIS DAY PARTY, marca que vem se destacando por transformar eventos em experiências imersivas dentro da cena eletrônica brasileira.\n\nEm 2024, tornou-se produtor da The Home Rio, um dos principais clubs da cidade, passando a integrar o ecossistema da The New World (TNW), referência global na cena tribal house.\n\nCom uma visão que une música, storytelling, cenografia e branding, criou a QUERO MAIS como uma experiência autoral onde cada edição representa um novo capítulo.\n\nCom a expansão da marca, nasce a QUERO MAIS GROUP, holding criada para desenvolver novas labels e projetos proprietários no mercado de entretenimento.\n\nHoje, Lucas lidera a expansão da marca no Brasil e no mercado internacional, com o propósito de construir experiências que vão além do entretenimento.',
  'Lucas Borges, Founder & Creative Director da QUERO MAIS GROUP',
  true,
  1
where not exists (
  select 1 from public.about_founder_profile
);

-- 4. Habilitar RLS
alter table public.about_founder_profile enable row level security;

-- 5. Policies
do $$
begin
  -- Leitura pública
  if not exists (
    select 1 from pg_policies
    where tablename = 'about_founder_profile'
      and policyname = 'about_founder_profile_public_read'
  ) then
    create policy about_founder_profile_public_read
      on public.about_founder_profile
      for select
      using (true);
  end if;

  -- Escrita autenticada
  if not exists (
    select 1 from pg_policies
    where tablename = 'about_founder_profile'
      and policyname = 'about_founder_profile_auth_write'
  ) then
    create policy about_founder_profile_auth_write
      on public.about_founder_profile
      for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;
end$$;
