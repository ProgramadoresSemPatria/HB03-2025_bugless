# BugLess Frontend

Landing page do BugLess - ferramenta de code review com IA focada em TypeScript.

## Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Animacoes:** Framer Motion
- **Icones:** Phosphor Icons
- **Package Manager:** pnpm

## Quick Start

```bash
# Instalar dependencias
pnpm install

# Rodar em desenvolvimento
pnpm dev

# Build de producao
pnpm build
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Estilos globais
│   └── (landing)/              # Route group da landing
│       ├── _components/        # Componentes da landing (colocation)
│       │   ├── hero/
│       │   ├── features/
│       │   ├── problem/
│       │   ├── terminal/
│       │   ├── comparison/
│       │   ├── pricing/
│       │   └── shared/
│       └── _hooks/             # Hooks especificos da landing
│
├── components/
│   ├── ui/                     # Componentes base (shadcn/ui)
│   ├── common/                 # Componentes globais (Header, etc)
│   └── motion/                 # Wrappers de animacao
│
├── lib/
│   ├── utils.ts                # Utilitarios (cn, etc)
│   └── animations.ts           # Variantes de animacao
│
├── hooks/                      # Hooks globais
├── types/                      # Tipos globais
└── services/queries/           # React Query (futuro)
```

## Convencoes

### Colocation

Componentes usados apenas em uma rota ficam dentro dessa rota:
- `app/(landing)/_components/` - componentes da landing
- `app/(landing)/_hooks/` - hooks da landing

Pastas com `_` sao ignoradas pelo roteamento do Next.js.

### Nomenclatura

- Arquivos: `kebab-case.tsx`
- Componentes: `PascalCase`
- Hooks: `use-nome.ts`
- Variaveis/funcoes: `camelCase`
- Constantes: `SCREAMING_SNAKE_CASE`

### Imports

Path alias configurado: `@/` aponta para `src/`

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

