-- Criar tabela de participantes
create table if not exists public.dj_participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,                      
  photo_url text,                          
  set_url text,                            
  set_type text default 'link' check (set_type in ('link', 'upload')),
  bio text,                                
  tech_sheet jsonb default '{}'::jsonb,    
  phase text not null default 'semifinal' check (phase in ('semifinal', 'final')),
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Criar tabela de configurações
create table if not exists public.dj_contest_settings (
  id int primary key default 1 check (id = 1),
  contest_title text not null default 'DJ Contest',
  contest_description text,
  current_phase text not null default 'semifinal' check (current_phase in ('semifinal', 'final')),
  voting_open boolean not null default false,
  voting_starts_at timestamptz,
  voting_ends_at timestamptz,
  results_reveal_at timestamptz,
  results_public boolean not null default false,
  winner_id uuid references public.dj_participants(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Inserir registro inicial de configuração
insert into public.dj_contest_settings (id) values (1) on conflict (id) do nothing;

-- Criar tabela de votos
create table if not exists public.dj_votes (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.dj_participants(id) on delete cascade,
  voter_name text not null,
  voter_email text not null,               
  phase text not null,
  ip_address text,                         
  user_agent text,                         
  created_at timestamptz not null default now()
);

-- Índice Único: Apenas 1 voto por e-mail por fase (antifraude)
create unique index if not exists dj_votes_one_per_email_phase
  on public.dj_votes (voter_email, phase);

-- Habilitar RLS (Row Level Security)
alter table public.dj_participants enable row level security;
alter table public.dj_votes enable row level security;
alter table public.dj_contest_settings enable row level security;

-- Políticas de acesso público (anon)
drop policy if exists "public read participants" on public.dj_participants;
create policy "public read participants" on public.dj_participants for select using (is_active = true);

drop policy if exists "public read settings" on public.dj_contest_settings;
create policy "public read settings" on public.dj_contest_settings for select using (true);

drop policy if exists "public insert vote" on public.dj_votes;
create policy "public insert vote" on public.dj_votes for insert with check (true);

-- Políticas de acesso admin (authenticated)
drop policy if exists "admin all participants" on public.dj_participants;
create policy "admin all participants" on public.dj_participants for all using (auth.role() = 'authenticated');

drop policy if exists "admin all settings" on public.dj_contest_settings;
create policy "admin all settings" on public.dj_contest_settings for all using (auth.role() = 'authenticated');

drop policy if exists "admin read votes" on public.dj_votes;
create policy "admin read votes" on public.dj_votes for select using (auth.role() = 'authenticated');

-- View de Apuração (segura, executada com a permissão de quem chama)
create or replace view public.dj_contest_results with (security_invoker = true) as
select
  p.id, p.name, p.photo_url, p.phase,
  count(v.id) as total_votes
from public.dj_participants p
left join public.dj_votes v on v.participant_id = p.id and v.phase = p.phase
group by p.id, p.name, p.photo_url, p.phase
order by total_votes desc;
