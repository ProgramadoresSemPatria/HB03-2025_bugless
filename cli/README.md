# BugLess CLI

[![npm version](https://img.shields.io/npm/v/bugless-cli.svg)](https://www.npmjs.com/package/bugless-cli)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

AI-powered code review directly in your terminal. Get instant feedback on your code before committing.

## Installation

```bash
npm install -g bugless-cli
```

## Quick Start

```bash
# Interactive mode - guided review selection
bugless

# Review changes against main branch
bugless -b main

# Review uncommitted changes
bugless -u

# Review with security focus
bugless -b main -p security
```

## Tech Stack

- **Runtime**: Node.js 18+
- **UI Framework**: [Ink](https://github.com/vadimdemedes/ink) (React for CLIs)
- **Git Integration**: simple-git
- **Validation**: Zod
- **Config Storage**: conf

## Features

| Feature | Description |
|---------|-------------|
| **Interactive Mode** | Guided menu to select review type |
| **Branch Diff** | Review changes between branches (PR-style) |
| **Uncommitted Changes** | Review staged and unstaged changes |
| **Commit Review** | Analyze a specific commit |
| **Custom Code** | Paste and review arbitrary code |
| **Review Presets** | Focused reviews (security, performance, etc.) |
| **Real-time Streaming** | Watch the AI review as it generates |

## Usage

### Review Modes

```bash
# Compare current branch against target (PR-style review)
bugless -b main
bugless --branch develop

# Review all uncommitted changes
bugless -u
bugless --uncommitted

# Review a specific commit
bugless -c abc1234
bugless --commit abc1234

# Custom code review with instructions
bugless -x
bugless --custom
```

### Review Presets

Presets adjust the AI's focus area:

```bash
bugless -b main -p <preset>
bugless --uncommitted --preset <preset>
```

| Preset | Focus |
|--------|-------|
| `standard` | Balanced review (default) |
| `security` | Vulnerabilities, injection, auth issues |
| `performance` | Efficiency, memory, complexity |
| `quick` | Critical issues only |
| `thorough` | Comprehensive deep analysis |

### Authentication

```bash
# Login via browser (opens OAuth flow)
bugless login

# Logout and clear credentials
bugless logout
```

### Configuration

```bash
# Set custom API endpoint
bugless config --api-url https://api.bugless.dev

# View current configuration
bugless config --show
```

## Architecture

```
┌────────────────────────────────────────────────────┐
│                    CLI Application                  │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────┐       ┌───────────────────────┐  │
│  │    Modes     │       │      Components       │  │
│  │              │       │                       │  │
│  │  - Branch    │──────►│  - ReviewDisplay      │  │
│  │  - Uncommit  │       │  - DiffViewer         │  │
│  │  - Commit    │       │  - ProgressIndicator  │  │
│  │  - Custom    │       │  - ErrorBoundary      │  │
│  └──────┬───────┘       └───────────────────────┘  │
│         │                                          │
│         ▼                                          │
│  ┌──────────────────────────────────────────────┐  │
│  │                   Services                    │  │
│  │                                               │  │
│  │  GitService ─── API Service ─── ConfigStore  │  │
│  └──────────────────────────────────────────────┘  │
│         │                    │                     │
└─────────┼────────────────────┼─────────────────────┘
          │                    │
          ▼                    ▼
   ┌─────────────┐      ┌─────────────┐
   │  Git Repo   │      │ Backend API │
   │ (simple-git)│      │   (SSE)     │
   └─────────────┘      └─────────────┘
```

## Project Structure

```
cli/
├── src/
│   ├── index.tsx           # Entry point & CLI args
│   ├── app.tsx             # Main application component
│   │
│   ├── modes/              # Review mode implementations
│   │   ├── branch.tsx      # Branch diff review
│   │   ├── uncommitted.tsx # Uncommitted changes review
│   │   ├── commit.tsx      # Single commit review
│   │   └── custom.tsx      # Custom code review
│   │
│   ├── components/         # Ink UI components
│   │   ├── review-display.tsx
│   │   ├── diff-viewer.tsx
│   │   └── ...
│   │
│   ├── services/           # Core services
│   │   ├── git.service.ts  # Git operations
│   │   ├── api.service.ts  # Backend communication
│   │   └── config.service.ts
│   │
│   ├── hooks/              # React hooks
│   ├── types/              # TypeScript definitions
│   ├── schemas/            # Zod validation
│   ├── prompts/            # AI prompts & presets
│   └── utils/              # Helper functions
│
├── dist/                   # Compiled output
├── package.json
├── tsconfig.json
└── tsup.config.ts          # Build configuration
```

## Development

### Setup

```bash
# Clone and navigate
git clone https://github.com/ProgramadoresSemPatria/HB03-2025_bugless.git
cd HB03-2025_bugless/cli

# Configure environment
cp .env.example .env

# Install dependencies
npm install

# Start in watch mode
npm run dev
```

### Environment Variables

```env
# Backend API URL
BUGLESS_API_URL=http://localhost:3000

# Frontend URL (for browser-based auth)
BUGLESS_WEB_URL=http://localhost:3001

# Use mock data (no backend required)
BUGLESS_USE_MOCK=true
```

### Scripts

```bash
npm run dev       # Watch mode with hot reload
npm run build     # Production build
npm run start     # Run compiled version
npm run typecheck # TypeScript validation
npm run lint      # ESLint check
```

### Testing Locally

```bash
# Build and link globally
npm run build
npm link

# Now use 'bugless' command anywhere
bugless --help
```

## Publishing

```bash
# Bump version
npm version patch|minor|major

# Build and publish
npm run build
npm publish --access public
```

## License

MIT
