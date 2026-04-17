# 🧠 QUERO MAIS — MEMÓRIA CENTRAL DO PROJETO

> **REGRA OBRIGATÓRIA**: Este arquivo DEVE ser lido antes de iniciar qualquer sessão de trabalho.
> Atualizar este arquivo ao final de cada sessão com decisões, mudanças e aprendizados relevantes.

---

## ⚙️ CONFIGURAÇÃO DE MEMÓRIA

### Política de Persistência
- **memory_space**: ATIVO — contexto persiste entre sessões via este arquivo
- **Auto-save**: Arquitetura, decisões técnicas e preferências são salvas automaticamente
- **Informações sensíveis**: NUNCA salvar tokens, senhas, chaves de API sem aprovação explícita do usuário
- **Atualização**: Usar a seção `📝 REGISTRO DE SESSÕES` para log de mudanças

### O que é salvo automaticamente:
- ✅ Arquitetura do projeto e decisões de design
- ✅ Stack técnico e dependências
- ✅ Preferências de código e padrões adotados
- ✅ Bugs conhecidos e soluções aplicadas
- ✅ Progresso das tarefas
- ⛔ Tokens, passwords, API keys → **perguntar antes de salvar**

---

## 📋 OBJETIVO DO PROJETO

Construir a base completa do site institucional/eventos da marca **QUERO MAIS**, com:
- Arquitetura preparada para conteúdo multilíngue (PT/EN/ES)
- Painel administrativo completo com CRUD
- Edição total de todas as áreas do site
- Design moderno com tema escuro e identidade visual forte

---

## 🗂️ ESTRUTURA DO PROJETO

```
c:\Users\djhen\Documents\QUEROMAISSITE\
├── app/                        # Frontend principal (React + Vite)
│   ├── src/
│   │   ├── sections/           # Seções do site (Hero, Eventos, etc.)
│   │   ├── components/         # Componentes reutilizáveis (UI)
│   │   ├── hooks/              # Custom hooks
│   │   ├── types/              # Tipos TypeScript
│   │   ├── lib/                # Utilitários (cn, etc.)
│   │   ├── context/            # Contextos React (Language, Auth, Data)
│   │   └── admin/              # Painel administrativo
│   ├── public/                 # Assets estáticos
│   └── dist/                   # Build de produção
├── memory.md                   # ← VOCÊ ESTÁ AQUI - memória central
└── README.md                   # Documentação do projeto
```

---

## 🎨 IDENTIDADE VISUAL

| Elemento        | Valor                          |
|----------------|-------------------------------|
| Cor Primária    | Verde Limão / Chartreuse `#CCFF00` |
| Cor Secundária  | Roxo / Violeta `#8B5CF6`       |
| Fundo           | Preto escuro `#0A0A0A`         |
| Texto           | Branco / Cinza claro           |
| Tipografia      | Modern sans-serif, caixa alta em títulos |
| Tema            | Dark mode, glassmorphism       |

---

## 🌐 IDIOMAS SUPORTADOS

| Código | Idioma             | Flag |
|--------|--------------------|------|
| PT     | Português (Brasil) | 🇧🇷   |
| EN     | Inglês             | 🇺🇸   |
| ES     | Espanhol           | 🇪🇸   |

> Alternância via botão no header. Gerenciado pelo `LanguageContext`.

---

## 📑 SITEMAP — ESTRUTURA DE PÁGINAS

1. **HOME** — Hero, chamadas para todas as seções, CTAs e banners editáveis
2. **PRÓXIMOS EVENTOS** — lista, data, local, ingressos/CTA
3. **FICA MAIS PARTY** — o que é, fotos/vídeos, próximas datas
4. **STORYTELLING** — nossa história, missão/valores, sobre o fundador
5. **QM MUSIC** — sets dos DJs, músicas/playlists, player/links
6. **GALERIA** — fotos das festas, vídeos/reels, pegue sua foto
7. **LOJA** — produtos, ingressos online, checkout
8. **CONTATO** — formulário, FAQ, WhatsApp, Instagram

---

## 🔐 PAINEL ADMIN — MÓDULOS

| # | Módulo            | Status |
|---|-------------------|--------|
| 1  | Login/Autenticação | ✅ Concluído |
| 2  | Dashboard          | ✅ Concluído |
| 3  | Configurações Gerais | 🔧 Pendente |
| 4  | Idiomas            | ✅ Concluído |
| 5  | Home (edição)      | 🔧 Pendente |
| 6  | Eventos (CRUD)     | 🔧 Pendente |
| 7  | Fica Mais Party    | 🔧 Pendente |
| 8  | Storytelling       | 🔧 Pendente |
| 9  | QM Music           | 🔧 Pendente |
| 10 | Galeria (upload)   | 🔧 Pendente |
| 11 | Loja               | 🔧 Pendente |
| 12 | Contato            | 🔧 Pendente |
| 13 | FAQ                | ✅ Concluído |
| 14 | Redes Sociais      | 🔧 Pendente |
| 15 | Header e Rodapé    | 🔧 Pendente |
| 16 | SEO Básico         | 🔧 Pendente |
| 17 | Banners/Mídia      | 🔧 Pendente |
| 18 | Usuários Admin     | 🔧 Pendente |
| 19 | Logs               | 🔧 Pendente |

---

## 🛠️ STACK TÉCNICO

| Tecnologia       | Versão/Detalhe                  |
|------------------|---------------------------------|
| Framework        | React 18 + TypeScript + Vite 7  |
| Estilização      | Tailwind CSS 3.4.19             |
| UI Components    | shadcn/ui (40+ componentes)     |
| Ícones           | Lucide React                    |
| Estado           | React Context + Hooks           |
| Storage (MVP)    | LocalStorage (dados mockados)   |
| Responsividade   | Mobile-first                    |
| Build            | Vite build → `/dist`            |

---

## 📦 DEPENDÊNCIAS INSTALADAS

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x",
  "vite": "^7.x",
  "tailwindcss": "^3.4.19",
  "@radix-ui/*": "vários componentes",
  "lucide-react": "latest",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

---

## 🔧 DECISÕES TÉCNICAS

### 1. Armazenamento de Dados
- **MVP**: LocalStorage para persistência de dados
- **Futuro**: Backend com banco de dados (Supabase preferido)

### 2. Autenticação
- **MVP**: Login simples com credenciais em memória
- **Credenciais padrão**: `admin@queromais.com` / `admin123`
- ⚠️ **ATENÇÃO**: Não salvar credenciais reais neste arquivo sem aprovação
- **Futuro**: JWT ou OAuth via Supabase Auth

### 3. Upload de Arquivos
- **MVP**: Base64 para imagens pequenas
- **Futuro**: Serviço de storage (AWS S3, Supabase Storage)

### 4. Multilíngue
- Estrutura de objetos com chaves por idioma
- Contexto React para gerenciamento de idioma ativo

### 5. Preferências de Código
- Componentes funcionais com hooks
- TypeScript strict mode
- Nomes de arquivos em PascalCase para componentes
- Funções utilitárias em camelCase
- Imports absolutos via `@/` alias

---

## 🚀 COMANDOS ÚTEIS

```bash
# Entrar na pasta do app
cd c:\Users\djhen\Documents\QUEROMAISSITE\app

# Desenvolvimento (hot reload)
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## ✅ PROGRESSO DAS FUNCIONALIDADES

### ✅ Concluído:
- [x] Estrutura inicial do projeto (React + Vite + Tailwind)
- [x] Instalação de componentes shadcn/ui
- [x] Sistema multilíngue (PT/EN/ES) via Context
- [x] Tipos TypeScript completos
- [x] Contextos React (Language, Auth, Data)
- [x] Header com navegação e seletor de idioma
- [x] Footer completo
- [x] Seção Hero
- [x] Seção Eventos
- [x] Seção Fica Mais Party
- [x] Seção Storytelling
- [x] Seção QM Music
- [x] Seção Galeria
- [x] Seção Loja com Carrinho
- [x] Seção Contato com Formulário e FAQ
- [x] Painel Admin - Login
- [x] Painel Admin - Dashboard
- [x] Responsividade completa (mobile-first)
- [x] Build de produção gerado

### 🔧 Em andamento:
- [ ] Módulos completos do painel admin (CRUD para cada seção)

### ⏳ Pendente (futuro):
- [ ] Integração com backend real (Supabase)
- [ ] Sistema de upload de arquivos
- [ ] Checkout completo na Loja
- [ ] Sistema de autenticação robusto (JWT/OAuth)

---

## 🐛 BUGS CONHECIDOS

| Bug | Status | Solução |
|-----|--------|---------|
| Nenhum no momento | — | — |

---

## 📝 REGISTRO DE SESSÕES

### Sessão 17/04/2026
- **Resumo**: Site completo com todas seções, painel admin básico e build de produção
- **Configuração**: Sistema memory_space ativado para persistência entre sessões
- **Próximos passos**: Implementar CRUD completo nos módulos do painel admin

---

## 🔗 REFERÊNCIAS

- **URL Deploy**: Deploy realizado e disponível
- **Repositório Local**: `c:\Users\djhen\Documents\QUEROMAISSITE`
- **Conversa anterior**: `fb4521dd-8f89-4bff-b8fe-324b107461ab` (Notification Generator)

---

> 📌 **NOTA FINAL**: Este arquivo é a fonte de verdade do projeto.
> Sempre leia antes de começar. Sempre atualize ao terminar.
