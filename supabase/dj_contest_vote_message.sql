-- ============================================================
-- DJ CONTEST — Mensagem de confirmação de voto editável
-- Rode MANUALMENTE no SQL Editor do Supabase.
-- ============================================================

ALTER TABLE dj_contest_settings
  ADD COLUMN IF NOT EXISTS vote_success_message text
    DEFAULT 'Voto computado com sucesso! 🎧';

UPDATE dj_contest_settings
SET vote_success_message = COALESCE(vote_success_message, 'Voto computado com sucesso! 🎧')
WHERE id = 1;
