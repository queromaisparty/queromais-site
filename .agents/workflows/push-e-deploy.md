---
description: Commitar alterações e subir para o GitHub (Vercel deploya automaticamente)
---

# Workflow: Push para GitHub → Deploy Vercel automático

## ⚠️ Regras obrigatórias ANTES de executar

- **Pasta correta do Git**: `C:\Projetos\QUEROMAISSITE` (tem o `.git`)
- **NÃO usar** `vercel --prod` via CLI — cria projeto duplicado separado!
- **URL de produção**: https://queromais-site.vercel.app
- **Projeto Vercel**: `queromais-site` (ID: `prj_2blw5of6WyhJvFXLbonwSyugGAI3`)

---

## Passo 1 — Verificar em qual pasta está

```powershell
cd C:\Projetos\QUEROMAISSITE
git status
```

> Se retornar `fatal: not a git repository` → errou a pasta. Usar sempre `C:\Projetos\QUEROMAISSITE`.

---

## Passo 2 — Ver o que mudou

```powershell
git diff --stat
```

---

// turbo
## Passo 3 — Adicionar todos os arquivos

```powershell
cd C:\Projetos\QUEROMAISSITE
git add .
```

---

// turbo
## Passo 4 — Commitar com mensagem descritiva

```powershell
git commit -m "feat: descrição do que foi feito"
```

> Prefixos recomendados: `feat:` (novo), `fix:` (correção), `docs:` (documentação), `style:` (visual), `refactor:`

---

// turbo
## Passo 5 — Push para GitHub → Vercel deploya automaticamente

```powershell
git push origin main
```

> Após o push, aguardar ~2 minutos e acessar https://queromais-site.vercel.app para verificar.

---

## Passo 6 — Sincronizar memory.md (sempre ao final da sessão)

// turbo
```powershell
Copy-Item -Path "C:\Projetos\QUEROMAISSITE\memory.md" -Destination "C:\Users\djhen\Documents\QUEROMAISSITE\memory.md" -Force
Write-Host "memory.md sincronizado!"
```

---

## Se o Vercel der tela branca (variáveis de ambiente)

As variáveis já estão configuradas (21/04/2026). Se precisar reconfigurar manualmente:

1. Acesse https://vercel.com/queromaispartys-projects/queromais-site/settings/environment-variables
2. Adicione as variáveis abaixo em **Production + Preview + Development**:
   - `VITE_SUPABASE_URL` → valor em `C:\Projetos\QUEROMAISSITE\app\.env`
   - `VITE_SUPABASE_ANON_KEY` → valor em `C:\Projetos\QUEROMAISSITE\app\.env`
   - `VERCEL_TOKEN` → valor em `C:\Projetos\QUEROMAISSITE\app\.env`
3. Após adicionar, acionar redeploy com commit vazio:

```powershell
cd C:\Projetos\QUEROMAISSITE
git commit --allow-empty -m "ci: Acionar redeploy Vercel"
git push origin main
```

> Os valores reais ficam APENAS no arquivo `.env` local (nunca commitar!)
