# 🧠 QUERO MAIS — MEMÓRIA CENTRAL DO PROJETO

> **REGRA OBRIGATÓRIA**: Consultar este arquivo ANTES de iniciar qualquer tarefa.
> Atualizar ao final de cada sessão com decisões, mudanças e aprendizados relevantes.
> Este arquivo é a ÚNICA fonte oficial de verdade técnica do projeto.

---

## 📋 OBJETIVO DO PROJETO

Construir a base completa do ecossistema digital da marca **QUERO MAIS**:
- **Frontend público**: Site institucional premium com foco em marca, eventos, música, mídia e relacionamento
- **Backend/Admin**: Painel administrativo completo com login, dashboard e gerenciamento total de conteúdo
- **CMS customizado**: Todo conteúdo editável sem alteração de código
- **Multilíngue nativo**: PT / EN / ES desde a arquitetura

---

## 🎯 POSICIONAMENTO DA MARCA

A QUERO MAIS é uma **marca de eventos e entretenimento premium**. O site deve transmitir:
- Presença, desejo e atmosfera premium
- Energia noturna + força visual
- Comunidade, experiência e cultura de evento
- Marca consolidada, não template genérico

---

## 🎨 IDENTIDADE VISUAL (Decisões baseadas em benchmark real do GreenValley)

> Análise realizada em 18/04/2026 via navegação no site https://www.greenvalleybr.com/

### Paleta de Cores

| Elemento | Valor | Uso |
|---|---|---|
| Fundo principal | `#FFFFFF` | Background padrão da maioria das seções |
| Fundo alternado | `#F2F2F2` | Seção Agenda/Eventos (sutil separação) |
| Bloco carvão | `#3D4246` | Blocos institucionais de destaque |
| Fundo dark | `#0A0A0A` | Hero overlay, footer, elementos dark |
| Verde marca | `#6ABD45` | Destaques, links hover, elementos de marca |
| Texto principal | `#000000` | Títulos e texto em fundos claros |
| Texto claro | `#FFFFFF` | Texto em blocos escuros |
| Botões CTA | `#4A4A4A` | Pill buttons com seta (estilo GV) |
| Borda / Separador | `#E5E5E5` | Divisórias sutis |

### Tipografia

| Elemento | Fonte | Peso | Tamanho | Casing |
|---|---|---|---|---|
| Logo / Marca | Montserrat | 900 | variável | UPPERCASE |
| Hero Headline | Montserrat | 800 | 56–80px | UPPERCASE |
| Títulos de Seção | Montserrat | 700 | 36–48px | Título Case |
| Subtítulos | Montserrat | 600 | 20–24px | Normal |
| Corpo/Descrições | Inter | 400 | 15–17px | Normal |
| Labels/Tags | Inter | 600 | 11–13px | UPPERCASE |
| Botões | Montserrat | 600 | 14–16px | Normal |

### Padrões de Layout (Benchmark GV)

- **Container max-width**: `1400px` centralizado (atualizado de 1280px)
- **Padding seções**: `py-24 lg:py-32` (96px–128px vertical)
- **Gap entre cards**: `24px`
- **Cards de evento**: Imagem quadrada à esquerda + info à direita, grid 2-col
- **Botões**: Pill shape (`rounded-full`), fundo cinza escuro, texto branco, ícone seta
- **Hero**: Full-bleed 100vh, overlay escuro sutil, logo centralizado, texto embaixo
- **Navbar**: Branca sticky, logo ESQ, nav links CENTRO desktop, 2 CTAs DIR
- **Galeria**: 3 colunas CSS masonry, gap 3px, zoom hover, lightbox fundo branco

---

## 🗺️ SITEMAP OFICIAL (Nomes definitivos)

| # | Nome Exibição | Rota Pública | ID Âncora | Módulo Admin |
|---|---|---|---|---|
| 1 | Home | `/` | `#home` | `/admin/home` |
| 2 | Próximos Eventos | `/eventos` | `#eventos` | `/admin/eventos` |
| 3 | Fica Mais Party | `/fica-mais` | `#fica-mais` | `/admin/fica-mais` |
| 4 | **Sobre a Quero Mais** | `/sobre` | `#sobre` | `/admin/sobre` |
| 5 | QM Music | `/musica` | `#music` | `/admin/qm-music` |
| 6 | **Você na Quero Mais?** | `/voce-na-qm` | `#voce` | `/admin/voce-na-qm` |
| 7 | Loja | `/loja` | `#loja` | `/admin/loja` |
| 8 | Contato | `/contato` | `#contato` | `/admin/contato` |

> ⚠️ IMPORTANTE: "Storytelling" → agora é "**Sobre a Quero Mais**" (arquivo: `SobreSection.tsx`)
> ⚠️ IMPORTANTE: "Galeria" → agora é "**Você na Quero Mais?**" (arquivo: `VoceSection.tsx`)

---

## 🔐 PAINEL ADMIN — ROTAS E MÓDULOS

```
/admin                    → Login
/admin/dashboard          → Dashboard com métricas
/admin/home               → Editar Home (banners, CTAs, vídeos)
/admin/eventos            → CRUD Eventos (lista)
/admin/eventos/novo       → Criar Evento
/admin/eventos/:id        → Editar Evento
/admin/fica-mais          → Editar Fica Mais Party
/admin/sobre              → Editar Sobre a Quero Mais
/admin/qm-music           → CRUD Artistas e Sets
/admin/voce-na-qm         → CRUD Galeria e Álbuns
/admin/loja               → CRUD Produtos
/admin/contato            → Config Formulário + FAQ
/admin/header             → Config Navegação e Header
/admin/footer             → Config Rodapé
/admin/seo                → Config SEO Básico
/admin/banners            → CRUD Banners e Mídias
/admin/idiomas            → Conteúdo por Idioma
/admin/redes-sociais      → Links Redes Sociais
/admin/usuarios           → CRUD Usuários Admin
/admin/logs               → Log de Alterações
/admin/config             → Configurações Gerais
```

### Credenciais de Acesso (MVP local)
- **Login**: `admin@queromais.com`
- **Senha**: `admin123`
- ⚠️ Não usar em produção. Migrar para Supabase Auth.

---

## 🛠️ STACK TÉCNICO

| Tecnologia | Versão/Detalhe |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Estilização | Tailwind CSS 3.x |
| UI Components | shadcn/ui |
| Ícones | Lucide React |
| Fontes | Montserrat + Inter (Google Fonts) |
| Estado | React Context + Hooks |
| Storage (MVP) | LocalStorage |
| Backend futuro | Supabase (DB + Auth + Storage) |
| Deploy | Vercel |
| Responsividade | Mobile-first |

---

## 📁 ESTRUTURA DE PASTAS

```
C:\Projetos\QUEROMAISSITE\
├── app/
│   ├── src/
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── EventsSection.tsx         # Próximos Eventos
│   │   │   ├── FicaMaisSection.tsx       # Fica Mais Party
│   │   │   ├── SobreSection.tsx          # Sobre a Quero Mais (era Storytelling)
│   │   │   ├── QMMusicSection.tsx        # QM Music (era MusicSection)
│   │   │   ├── VoceSection.tsx           # Você na Quero Mais? (era GallerySection)
│   │   │   ├── ShopSection.tsx           # Loja
│   │   │   └── ContactSection.tsx        # Contato
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── ui/                       # shadcn/ui components
│   │   ├── admin/                        # Painel Admin completo
│   │   ├── context/
│   │   │   ├── LanguageContext.tsx
│   │   │   ├── AuthContext.tsx
│   │   │   └── DataContext.tsx
│   │   ├── lib/
│   │   │   ├── translations.ts           # Multilíngue PT/EN/ES
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── index.ts                  # Todos os tipos TypeScript
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css                     # Design system global
│   ├── .env                              # Credenciais (nunca ao GitHub)
│   └── .gitignore                        # .env incluído
├── memory.md                             # ← ESTE ARQUIVO
└── .gitignore
```

---

## 🔑 CREDENCIAIS E INTEGRAÇÕES

| Serviço | Variável | Arquivo | Observação |
|---|---|---|---|
| Supabase URL | `VITE_SUPABASE_URL` | `.env` | `https://hkgdihysekabkimqyyxs.supabase.co` |
| Supabase Anon Key | `VITE_SUPABASE_ANON_KEY` | `.env` | Pendente configurar |
| Vercel Token | `VERCEL_TOKEN` | `.env` | Token exclusivo QUERO MAIS |

> ⚠️ NUNCA salvar tokens diretamente no código. SEMPRE usar `.env`.

---

## 🚀 DEPLOY — VERCEL

| Item | Valor |
|---|---|
| Plataforma | Vercel |
| Token | salvo em `.env` como `VERCEL_TOKEN` |
| Comando deploy | ver abaixo |
| Diretório build | `app/dist` (Vite) |

**Comando de deploy (rodar após cada alteração):**
```powershell
cd C:\Projetos\QUEROMAISSITE\app
npx vercel --token [SECRET] --yes
```

> ⚠️ REGRA: Toda alteração de código deve ser seguida de deploy na Vercel.

---

## 🌐 MULTILÍNGUE

| Código | Idioma | Status |
|---|---|---|
| PT | Português (Brasil) | Principal |
| EN | Inglês | Suportado |
| ES | Espanhol | Suportado |

- Gerenciado por `LanguageContext` via hook `useLanguage()`
- Função `t({pt, en, es})` em todos os componentes
- Propriedade correta: `currentLanguage` (não `language`)

---

## 📊 MODELAGEM DE DADOS (MVP)

```typescript
Event {
  id, slug, title{pt,en,es}, shortDescription{}, fullDescription{},
  date, time, venue, city, ticketUrl, vipUrl, coverImage,
  gallery[], status, featured, order, seoTitle, seoDescription
}

Artist {
  id, name, role, bio{}, photo, sets[], socialLinks, resident
}

GalleryAlbum {
  id, eventId, title{}, coverImage, images[], videos[], date
}

Product {
  id, name{}, description{}, price, image, link, status, order, type
}

FaqItem {
  id, question{}, answer{}, order, active
}
```

---

## 🔧 DECISÕES TÉCNICAS

1. **Dados (MVP)**: LocalStorage com mock data rico → migrar para Supabase
2. **Autenticação (MVP)**: Credenciais em memória → migrar para Supabase Auth
3. **Upload**: Base64 para MVP → AWS S3 / Supabase Storage no futuro
4. **Routing**: React Router v6 com lazy loading nas rotas do admin
5. **App.css**: NÃO usar max-width, margin:auto ou padding no `#root` — corrigido em 20/04
6. **Container interno**: usar `max-w-[1400px] mx-auto px-4` dentro de cada seção
7. **Deploy**: obrigatório após cada alteração de código

---

## 🐛 BUGS CONHECIDOS

| Bug | Status | Solução |
|---|---|---|
| App.css Vite limitava #root a max-width:1280px | ✅ RESOLVIDO (20/04) | App.css reescrito com max-width:100% |
| Header sem links de nav visíveis no desktop | ✅ RESOLVIDO (20/04) | Header reescrito com nav central |
| LanguageContext usava `language` mas deveria ser `currentLanguage` | ✅ RESOLVIDO | Header atualizado |
| Variáveis CSS --brand-primary conflitam com --primary do shadcn | Pendente | Manter nomes separados |

---

## ✅ STATUS DAS IMPLEMENTAÇÕES

### Fase 0 — Pesquisa Visual
- [x] Análise GreenValley.com (18/04/2026) — screenshots em brain/
- [x] Benchmark aplicado: paleta, tipografia, layout, galeria

### Fase 1 — Fundação
- [x] memory.md criado e mantido
- [x] index.css com design system QM
- [x] tailwind.config.js com paleta `qm-*`
- [x] App.css corrigido

### Fase 2 — Componentes Layout
- [x] **Header.tsx** — sticky branco, logo esq, nav central desktop, drawer mobile
- [x] **Footer.tsx** — fundo #0A0A0A, 4 colunas, newsletter

### Fase 3 — Seções Públicas
- [x] **HeroSection.tsx** — full-bleed 100vh, logo gigante, CTAs pill
- [x] **EventsSection.tsx** — grid horizontal 2-col, fundo #F2F2F2
- [x] **FicaMaisSection.tsx** — implementado (revisão visual pendente)
- [x] **SobreSection.tsx** — bloco carvão, stats, grid
- [x] **VoceSection.tsx** — mosaico 3-col GV, hover zoom, lightbox branco
- [ ] **QMMusicSection.tsx** — refactor visual pendente
- [ ] **ShopSection.tsx** — refactor visual pendente
- [ ] **ContactSection.tsx** — refactor visual pendente

### Fase 4 — Admin
- [x] Sidebar com rotas
- [x] CRUD Eventos básico
- [ ] Admin com nomes VoceSection/SobreSection

### Fase 5 — Deploy e Produção
- [x] Token Vercel configurado no .env
- [ ] Primeiro deploy Vercel realizado
- [ ] URL de produção definida

---

## 📝 REGISTRO DE SESSÕES

### Sessão 18/04/2026 — Rebuild Visual (Fases 1–3)
- Análise real do greenvalleybr.com
- Header, Footer, Hero, Events, Sobre, VoceSection implementados
- Design system aplicado (paleta qm-*, tipografia, layout GV)

### Sessão 20/04/2026 — Correções e Configuração Vercel
- App.css corrigido: removido max-width:1280px do #root
- Header reescrito com nav links visíveis no centro desktop
- VoceSection reescrita: mosaico CSS columns 3-col idêntico ao GV
- Token Vercel salvo no .env (exclusivo QUERO MAIS)
- Regra estabelecida: toda alteração = deploy na Vercel
- Pendências: QMMusicSection, ShopSection, ContactSection

---

## 🔗 REFERÊNCIAS

- **Projeto Local**: `C:\Projetos\QUEROMAISSITE`
- **App**: `C:\Projetos\QUEROMAISSITE\app`
- **Benchmark Visual**: https://www.greenvalleybr.com/
- **Dev local**: http://localhost:5173
- **Conversação**: `7d147015-aca3-4d79-9d78-ee2af9ca60bf`

---

> 📌 **REGRA FINAL**: Consultar ANTES de qualquer tarefa. Atualizar APÓS qualquer mudança. Deploy Vercel após TODA alteração de código.
