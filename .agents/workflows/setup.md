---
description: Regras globais de workflow de setup para garantir estabilidade, segurança e memória consistente no projeto
---

# Workflow: Setup & Segurança

Este workflow define as regras basilares para o desenvolvimento do projeto QUERO MAIS.

## 1. Persistência de Memória (`memory_space`)
Sempre que fizer alterações significativas, deve-se registrar no arquivo `memory.md`:
* **Estrutura de arquivos do projeto**: Atualize a árvore de arquivos caso novas pastas ou módulos sejam criados.
* **Dependências instaladas**: Liste os novos pacotes instalados e o propósito no projeto.
* **Decisões de arquitetura**: Qualquer alteração na lógica, uso de padrões ou integrações externas.
* **Bugs encontrados e soluções**: Tabela de registros atualizada conforme problemas surjam e sejam resolvidos durante o desenvolvimento.

## 2. Checklist Pré-Deploy
Antes de realizar qualquer deploy (ou finalizar um turno de tarefas complexas de deploy), valide os seguintes passos:
1. **Verificar estado do Git**: Checar se há mudanças não commitadas (`git status`).
2. **Push interativo**: Perguntar pro ativamente se deseja commitar e dar push das alterações no GitHub antes de prosseguir com a build final.
3. **Teste do Supabase**: Rodar um teste simples ou checar a conectividade do Supabase e as credenciais configuradas. Confirmar se estao no env de producao e se o Client do DB está instanciado sem erros.

## 3. Segurança e Credenciais
* **NUNCA** salvar tokens de API (ex: senhas do banco de dados, `SERVICE_ROLE_KEY` do Supabase, tokens do GitHub) diretamente nos códigos fonte ou no `memory.md` de forma explícita.
* **Variáveis de Ambiente**: Usar sempre arquivo `.env` ou `.env.local` nas pastas onde o tooling exija (ex: Vite na pasta `app`).
* **Proteção Automática**: Assegurar sempre que os arquivos de configuração (ex: `.env`) estão ignorados no `.gitignore` antes de fazer qualquer ação git.
