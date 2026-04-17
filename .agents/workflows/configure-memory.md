---
description: Configurar e gerenciar o memory_space — sistema de persistência de contexto entre sessões
---

# Workflow: Configure Memory

## Objetivo
Garantir que o contexto do projeto QUERO MAIS seja preservado entre sessões via `memory.md`.

---

## Regras Fundamentais

1. **SEMPRE** ler `c:\Users\djhen\Documents\QUEROMAISSITE\memory.md` antes de iniciar qualquer tarefa
2. **SEMPRE** atualizar o `memory.md` ao final de cada sessão com o que foi feito
3. **NUNCA** salvar informações sensíveis (tokens, senhas, API keys) sem perguntar ao usuário
4. Usar as seções corretas para cada tipo de informação

---

## Passos: Iniciar Sessão

1. Ler o arquivo de memória:
```
view_file: c:\Users\djhen\Documents\QUEROMAISSITE\memory.md
```

2. Verificar a seção `✅ PROGRESSO` para saber o estado atual do projeto

3. Verificar a seção `🐛 BUGS CONHECIDOS` para problemas abertos

4. Verificar a seção `📝 REGISTRO DE SESSÕES` para contexto da última sessão

---

## Passos: Salvar Contexto (Final de Sessão)

1. Identificar o que foi feito:
   - Novas funcionalidades implementadas
   - Bugs corrigidos
   - Decisões técnicas tomadas
   - Preferências de código identificadas

2. Atualizar as seções relevantes do `memory.md`:
   - `✅ PROGRESSO` — marcar itens concluídos
   - `🔧 DECISÕES TÉCNICAS` — documentar novas decisões
   - `🐛 BUGS CONHECIDOS` — adicionar/remover bugs
   - `📝 REGISTRO DE SESSÕES` — adicionar entrada da sessão atual

3. **Se houver informação sensível** (token, senha, chave):
   - PARAR e perguntar ao usuário: "Deseja que eu salve [nome da info] no memory.md? Esta informação é sensível."
   - Só salvar após aprovação explícita

---

## Passos: Adicionar Decisão Técnica

1. Identificar a decisão (ex: "usar Supabase para backend")
2. Adicionar na seção `🔧 DECISÕES TÉCNICAS` com formato:
   ```markdown
   ### N. [Nome da Decisão]
   - **Escolha**: [o que foi decidido]
   - **Motivo**: [por que esta decisão]
   - **Alternativas descartadas**: [o que foi considerado e por quê não]
   ```

---

## Passos: Registrar Bug

1. Adicionar na tabela de `🐛 BUGS CONHECIDOS`:
   ```markdown
   | Descrição do bug | 🔴 Aberto | — |
   ```

2. Quando resolvido, atualizar:
   ```markdown
   | Descrição do bug | ✅ Resolvido | Como foi solucionado |
   ```

---

## Passos: Atualizar Progresso

Para marcar uma tarefa como concluída, mover da lista `🔧 Em andamento` para `✅ Concluído`:
```markdown
- [x] Nome da funcionalidade
```

Para adicionar nova tarefa pendente:
```markdown
- [ ] Nova funcionalidade a implementar
```

---

## ⚠️ Informações que NUNCA devem ser salvas sem aprovação:

- Tokens de API (OpenAI, Supabase, etc.)
- Senhas de banco de dados
- Chaves secretas (JWT secret, webhook secrets)
- Credenciais de usuário reais
- Dados pessoais de clientes

---

## Formato do Registro de Sessão

Sempre adicionar no topo da seção `📝 REGISTRO DE SESSÕES`:

```markdown
### Sessão DD/MM/AAAA
- **Resumo**: [o que foi feito]
- **Decisões**: [decisões importantes]
- **Bugs**: [bugs encontrados/resolvidos]
- **Próximos passos**: [o que fazer na próxima sessão]
```
