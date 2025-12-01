# BugLess

[![npm version](https://img.shields.io/npm/v/bugless-cli.svg)](https://www.npmjs.com/package/bugless-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

**AI-powered code review tool for TypeScript developers.** Get instant, intelligent feedback on your code through a CLI tool or automated GitHub Pull Request reviews.

## The Problem

Code reviews are essential but time-consuming. Developers wait hours or days for feedback, and reviewers often miss subtle bugs while focusing on style issues. Manual reviews don't scale with growing teams and fast-paced development cycles.

## The Solution

BugLess uses AI to provide instant, comprehensive code reviews that catch bugs, security vulnerabilities, and performance issues before they reach production. It integrates seamlessly into existing workflows through two interfaces:

- **CLI Tool**: Review code locally before committing
- **GitHub App**: Automatic reviews on every Pull Request

## Installation

### Option 1: CLI (Terminal)

```bash
npm install -g bugless-cli
bugless
```

### Option 2: GitHub App (Automatic PR Reviews)

[![Install GitHub App](https://img.shields.io/badge/GitHub-Install%20App-181717?logo=github)](https://github.com/apps/bugless-code-review)

[**Install BugLess on your repositories**](https://github.com/apps/bugless-code-review)

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        BugLess Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Developer                                                     │
│       │                                                         │
│       ├──► CLI ──────────────────┐                              │
│       │    bugless -b main       │                              │
│       │                          ▼                              │
│       │                   ┌─────────────┐     ┌──────────────┐  │
│       │                   │   Backend   │────►│  PostgreSQL  │  │
│       │                   │  (Express)  │     └──────────────┘  │
│       │                   └──────┬──────┘                       │
│       │                          │                              │
│       └──► GitHub PR ────►  Webhook  │      ┌──────────────┐    │
│            (Auto Review)         │    ├────►│    Redis     │    │
│                                  ▼    │     │   (BullMQ)   │    │
│                           ┌──────────┐│     └──────────────┘    │
│                           │  Worker  ││                         │
│                           │ (Gemini) │◄─────────────────────    │
│                           └────┬─────┘                          │
│                                │                                │
│                                ▼                                │
│                         Code Review                             │
│                    (Streamed in real-time)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Features

| Feature | Description |
|---------|-------------|
| **Multiple Review Modes** | PR diffs, uncommitted changes, specific commits, or custom code snippets |
| **Review Presets** | Standard, security-focused, performance-focused, quick, or thorough analysis |
| **Real-time Streaming** | Watch the AI review as it's being generated |
| **GitHub Integration** | Automatic comments on Pull Requests with actionable feedback |
| **Project Context** | Custom instructions per project for domain-specific reviews |

## CLI Usage

```bash
# Interactive mode - select what to review
bugless

# Review changes against a branch (PR-style)
bugless -b main

# Review uncommitted changes
bugless -u

# Review a specific commit
bugless -c abc1234

# Use a specific review preset
bugless -b main -p security    # Focus on vulnerabilities
bugless -u -p performance      # Focus on performance issues
bugless -u -p thorough         # Comprehensive analysis
```

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Node.js, Express 5, Prisma ORM, PostgreSQL, Redis, BullMQ |
| **AI** | Google Gemini API |
| **CLI** | TypeScript, React, Ink (React for CLIs), simple-git |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Framer Motion |
| **Infrastructure** | Docker, GitHub Apps, Webhooks |

## Project Structure

```
bugless/
├── back/           # REST API & background workers
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── workers/        # BullMQ job processors
│   │   ├── providers/      # External services (AI, GitHub)
│   │   └── routes/         # API endpoints
│   └── prisma/             # Database schema & migrations
│
├── cli/            # Command-line interface
│   └── src/
│       ├── modes/          # Review modes (branch, commit, etc.)
│       ├── components/     # Ink UI components
│       ├── services/       # Git & API integration
│       └── prompts/        # AI prompts & presets
│
└── front/          # Landing page
    └── src/
        ├── app/            # Next.js App Router
        └── components/     # React components
```

## Local Development

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- pnpm (recommended)

### Setup

```bash
# Clone the repository
git clone https://github.com/ProgramadoresSemPatria/HB03-2025_bugless.git
cd HB03-2025_bugless

# Start infrastructure (PostgreSQL + Redis)
cd back
cp .env.example .env    # Configure your environment
docker-compose up -d

# Install dependencies and start backend
npm install
npm run prisma:migrate
npm run dev

# In another terminal - start CLI in dev mode
cd cli
cp .env.example .env
npm install
npm run dev

# In another terminal - start frontend
cd front
cp .env.example .env
pnpm install
pnpm dev
```

### Environment Variables

<details>
<summary><strong>Backend (back/.env)</strong></summary>

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password |
| `JWT_SECRET` | Secret for JWT tokens |
| `GOOGLE_API_KEY` | Google Gemini API key |
| `GITHUB_APP_ID` | GitHub App ID |
| `GITHUB_PRIVATE_KEY` | GitHub App private key |
| `GITHUB_WEBHOOK_SECRET` | Webhook signature secret |

</details>

<details>
<summary><strong>CLI (cli/.env)</strong></summary>

| Variable | Description |
|----------|-------------|
| `BUGLESS_API_URL` | Backend API URL |
| `BUGLESS_WEB_URL` | Frontend URL (for OAuth) |
| `BUGLESS_USE_MOCK` | Use mock data for development |

</details>

<details>
<summary><strong>Frontend (front/.env)</strong></summary>

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

</details>

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Authenticate user |
| `POST` | `/auth/cli/session` | Create CLI auth session |
| `POST` | `/submissions` | Submit code for review |
| `GET` | `/submissions/:id/stream` | SSE stream for real-time review |
| `POST` | `/webhooks/github` | GitHub webhook receiver |

## GitHub App Setup

For automatic PR reviews, you'll need to create a GitHub App. See the [detailed setup guide](back/docs/GITHUB_APP_SETUP.md).

**Quick local testing with Smee:**

```bash
npm install -g smee-client
smee -u https://smee.io/YOUR_CHANNEL -t http://localhost:3000/webhooks/github
```

## Team

Built for [Borderless Coding](https://github.com/ProgramadoresSemPatria) Hackathon 2025.

## License

MIT License - see [LICENSE](LICENSE) for details.
