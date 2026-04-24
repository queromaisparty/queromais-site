# QUEROMAIS SITE — Instruções para Agentes

## ⚠️ ARQUIVOS PROTEGIDOS — NÃO ALTERAR SEM AUTORIZAÇÃO EXPLÍCITA

Os arquivos abaixo têm implementações estáveis que foram corrigidas e testadas.
**Não altere esses arquivos sem o usuário pedir diretamente:**

- `app/src/sections/HeroSection.tsx` — lógica de hero com scroll-control no desktop e min-h-[100svh] no mobile. Qualquer alteração causa a "tarja preta" conhecida.
- `app/src/components/layout/WebsiteLayout.tsx` — usa `overflow-x-clip` (NÃO `overflow-x-hidden`). Trocar por `hidden` quebra position:sticky do hero e causa container preto de 250vh.
- `app/src/context/DataContext.tsx` — lógica de fetch do Supabase e cache de localStorage.
- `app/index.html` — inline script de FOUC fix (cores do admin antes do React carregar).

## Deploy

- **Frontend**: `git push` → Vercel deploya automaticamente (branch `main`)
- **Banco de dados**: alterações de schema devem ser executadas manualmente no SQL Editor do Supabase — git push NÃO aplica migrations automaticamente

## Encoding

- Todos os arquivos `.tsx`, `.ts`, `.json` devem ser salvos em **UTF-8 sem BOM**
- Nunca usar Windows-1252 ou Latin-1 — causa mojibake nos textos em português

## Regras Gerais

- Não alterar estrutura de componentes que estão funcionando sem motivo claro
- Não "simplificar" o HeroSection — a complexidade da lógica de scroll é intencional
- Sempre fazer `git push` após confirmar que o build TypeScript não tem erros
- O projeto usa **Tailwind CSS** — não adicionar CSS inline desnecessário
- Breakpoints: mobile-first, `md:` = 768px, `lg:` = 1024px
