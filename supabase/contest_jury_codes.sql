-- ============================================================
-- DJ CONTEST — Votação da FINAL restrita a jurados (códigos)
-- Rode no SQL Editor do projeto DEDICADO do contest
-- (josutfjtopqcnmkkxyla), NÃO no principal.
-- ============================================================

-- Flag no settings: final restrita a jurados
alter table public.dj_contest_settings
  add column if not exists final_jury_only boolean default false;

-- Votos de jurado não têm e-mail/CPF
alter table public.dj_votes alter column voter_email drop not null;
alter table public.dj_votes add column if not exists jury_code text;

-- Tabela de códigos (1 código = 1 voto)
create table if not exists public.dj_jury_codes (
  id uuid primary key default gen_random_uuid(),
  voter_name text not null,
  code text not null unique,
  phase text not null default 'final' check (phase in ('semifinal', 'final')),
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.dj_jury_codes enable row level security;

-- SEM política pra anon: público nunca lê códigos.
drop policy if exists "admin all jury codes" on public.dj_jury_codes;
create policy "admin all jury codes" on public.dj_jury_codes
  for all using (auth.role() = 'authenticated');

-- Função atômica: valida código → grava voto → queima código
create or replace function public.submit_jury_vote(p_code text, p_participant uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code record;
  v_settings record;
  v_participant record;
begin
  select * into v_settings from dj_contest_settings where id = 1;

  if v_settings is null or not v_settings.voting_open then
    return json_build_object('success', false, 'message', 'A votação está fechada.');
  end if;

  select * into v_code from dj_jury_codes
    where upper(trim(code)) = upper(trim(p_code))
      and phase = v_settings.current_phase
    for update;

  if not found then
    return json_build_object('success', false, 'message', 'Código de votação inválido.');
  end if;

  if v_code.used_at is not null then
    return json_build_object('success', false, 'message', 'Este código já foi utilizado.');
  end if;

  select * into v_participant from dj_participants
    where id = p_participant and is_active = true and phase = v_settings.current_phase;

  if not found then
    return json_build_object('success', false, 'message', 'Participante inválido para esta fase.');
  end if;

  insert into dj_votes (participant_id, voter_name, phase, jury_code)
    values (p_participant, v_code.voter_name, v_settings.current_phase, v_code.code);

  update dj_jury_codes set used_at = now() where id = v_code.id;

  return json_build_object(
    'success', true,
    'message', coalesce(v_settings.vote_success_message, 'Voto computado com sucesso! 🎧')
  );
end;
$$;

revoke all on function public.submit_jury_vote(text, uuid) from public;
grant execute on function public.submit_jury_vote(text, uuid) to anon, authenticated;

-- Validação prévia do código (pra saudar o jurado pelo nome antes do voto)
create or replace function public.validate_jury_code(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code record;
  v_settings record;
begin
  select * into v_settings from dj_contest_settings where id = 1;

  select * into v_code from dj_jury_codes
    where upper(trim(code)) = upper(trim(p_code))
      and phase = v_settings.current_phase;

  if not found then
    return json_build_object('valid', false, 'message', 'Código de votação inválido.');
  end if;

  if v_code.used_at is not null then
    return json_build_object('valid', false, 'message', 'Este código já foi utilizado.');
  end if;

  return json_build_object('valid', true, 'voter_name', v_code.voter_name);
end;
$$;

revoke all on function public.validate_jury_code(text) from public;
grant execute on function public.validate_jury_code(text) to anon, authenticated;
