-- ============================================================
-- QUERO MAIS DJ CONTEST — Banner de anúncio na Home
-- Adiciona colunas em dj_contest_settings para editar o
-- container de divulgação exibido na Home (entre "Próximas
-- Experiências" e a seção Fica Mais Party).
--
-- Rode este script MANUALMENTE no SQL Editor do Supabase.
-- ============================================================

ALTER TABLE dj_contest_settings
  ADD COLUMN IF NOT EXISTS home_banner_enabled      boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS home_banner_title        text    DEFAULT 'QUERO MAIS DJ CONTEST',
  ADD COLUMN IF NOT EXISTS home_banner_text         text    DEFAULT 'Quem merece a vaga na final? Vote agora e ajude a decidir os finalistas!',
  ADD COLUMN IF NOT EXISTS home_banner_image_url    text,
  ADD COLUMN IF NOT EXISTS home_banner_button_label text    DEFAULT 'Vote agora',
  ADD COLUMN IF NOT EXISTS home_banner_button_link  text    DEFAULT '/dj-contest';

-- Garante que a linha de settings (id = 1) tenha os defaults preenchidos
UPDATE dj_contest_settings
SET
  home_banner_enabled      = COALESCE(home_banner_enabled, true),
  home_banner_title        = COALESCE(home_banner_title, 'QUERO MAIS DJ CONTEST'),
  home_banner_text         = COALESCE(home_banner_text, 'Quem merece a vaga na final? Vote agora e ajude a decidir os finalistas!'),
  home_banner_button_label = COALESCE(home_banner_button_label, 'Vote agora'),
  home_banner_button_link  = COALESCE(home_banner_button_link, '/dj-contest')
WHERE id = 1;
