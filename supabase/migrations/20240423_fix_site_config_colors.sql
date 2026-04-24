-- =====================================================
-- INICIALIZAR fica_mais_party no Supabase
-- Execute no SQL Editor do Supabase
-- =====================================================

UPDATE site_config SET
  fica_mais_party = jsonb_build_object(
    'showInHome',       true,
    'isActivePage',     true,
    'manifestoCurto',   jsonb_build_object(
      'pt', 'A festa continua quando o sol nasce. Momentos especiais para quem não quer que a noite acabe.',
      'en', 'The party continues when the sun rises. Special moments for those who don''t want the night to end.',
      'es', 'La fiesta continúa cuando sale el sol. Momentos especiales para quienes no quieren que la noche termine.'
    ),
    'manifestoCompleto', jsonb_build_object(
      'pt', 'Quando a noite termina para a maioria, a nossa verdadeira jornada começa. Fica Mais Party é o selo oficial de after-hours da Quero Mais, dedicado aos guerreiros da alvorada.',
      'en', 'When the night ends for most, our true journey begins. Fica Mais Party is the official after-hours label of Quero Mais, dedicated to the dawn warriors.',
      'es', 'Cuando la noche termina para la mayoría, nuestro verdadero viaje comienza. Fica Mais Party es el sello oficial de after-hours de Quero Más.'
    ),
    'homeMedia',        '',
    'pageMedia',        '',
    'galleryAlbumId',   '',
    'upcomingDates',    '[]'::jsonb
  ),
  updated_at = NOW()
WHERE id = (SELECT id FROM site_config LIMIT 1);

-- Verificar resultado
SELECT 
  fica_mais_party->>'showInHome'              AS show_in_home,
  fica_mais_party->>'isActivePage'            AS is_active_page,
  fica_mais_party->'manifestoCurto'->>'pt'    AS manifesto_curto_pt,
  fica_mais_party->'manifestoCompleto'->>'pt' AS manifesto_completo_pt,
  fica_mais_party->>'homeMedia'               AS home_media,
  fica_mais_party->>'pageMedia'               AS page_media
FROM site_config LIMIT 1;
