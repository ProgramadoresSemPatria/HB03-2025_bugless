# BugLess Frontend

Landing page and web application for the BugLess code review platform.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons
- **Forms**: React Hook Form + Zod
- **Package Manager**: pnpm

## Quick Start

```bash
# Configure environment
cp .env.example .env

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure

```
front/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Global styles & CSS variables
│   │   │
│   │   └── (landing)/              # Landing page route group
│   │       ├── _components/        # Colocated components
│   │       │   ├── hero/           # Hero section
│   │       │   ├── features/       # Features showcase
│   │       │   ├── problem/        # Problem statement
│   │       │   ├── terminal/       # CLI demo
│   │       │   ├── comparison/     # Before/after comparison
│   │       │   ├── pricing/        # Pricing cards
│   │       │   └── shared/         # Shared landing components
│   │       │
│   │       └── _hooks/             # Landing-specific hooks
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui base components
│   │   ├── common/                 # Global components (Header, Footer)
│   │   └── motion/                 # Framer Motion wrappers
│   │
│   ├── lib/
│   │   ├── utils.ts                # Utility functions (cn, etc.)
│   │   └── animations.ts           # Animation variants
│   │
│   ├── hooks/                      # Global hooks
│   ├── types/                      # TypeScript definitions
│   └── services/queries/           # React Query (future)
│
├── public/                         # Static assets
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Architecture

### Colocation Pattern

Components used only in a specific route live inside that route:

```
app/(landing)/_components/hero/    ← Only used in landing
components/common/header.tsx       ← Used across multiple routes
components/ui/button.tsx           ← Base shadcn component
```

Folders prefixed with `_` are ignored by Next.js routing.

### Server vs Client Components

- **Server Components** (default): Static content, data fetching
- **Client Components** (`"use client"`): Interactive elements, animations, hooks

## Conventions

### Naming

| Element | Convention | Example |
|---------|------------|---------|
| Files | `kebab-case.tsx` | `hero-section.tsx` |
| Components | `PascalCase` | `HeroSection` |
| Hooks | `use-name.ts` | `use-scroll.ts` |
| Variables | `camelCase` | `handleClick` |
| Constants | `SCREAMING_SNAKE_CASE` | `API_URL` |

### Imports

Path alias `@/` points to `src/`:

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

## Design System

### CSS Variables

The design uses semantic CSS variables for theming:

```css
/* Base */
--background, --foreground

/* Brand */
--primary, --primary-foreground
--secondary, --secondary-foreground

/* UI */
--muted, --muted-foreground
--accent, --accent-foreground
--destructive

/* Components */
--border, --input, --ring
--radius
```

### Tailwind Usage

```tsx
// Use semantic classes
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />

// Never use raw colors
<div className="bg-blue-500" /> // ❌ Avoid
```

### Animation

Framer Motion variants are defined in `lib/animations.ts`:

```tsx
import { fadeInUp } from '@/lib/animations'

<motion.div variants={fadeInUp} />
```

## Development

### Adding Components

1. **shadcn/ui components**: `npx shadcn@latest add <component>`
2. **Custom components**: Create in appropriate location based on scope

### Best Practices

- Use Server Components by default
- Add `"use client"` only when needed (hooks, events, browser APIs)
- Keep components under 150-200 lines
- Extract complex logic to custom hooks
- Use `cn()` for conditional class merging

## License

MIT
