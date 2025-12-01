# BugLess Backend

REST API and background workers for the BugLess code review platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 5
- **Database**: PostgreSQL + Prisma ORM
- **Queue**: Redis + BullMQ
- **AI**: Google Gemini API
- **Auth**: JWT + bcrypt
- **GitHub**: Octokit + GitHub App webhooks

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Express API                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │    Auth     │  │ Submissions │  │  GitHub Webhooks    │   │
│  │  /auth/*    │  │/submissions │  │ /webhooks/github    │   │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘   │
│         │                │                    │              │
│         ▼                ▼                    ▼              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                   Services Layer                    │     │
│  │  AuthService | SubmissionService | GitHubService    │     │
│  └─────────────────────────┬───────────────────────────┘     │
│                            │                                 │
│         ┌──────────────────┴──────────────────┐              │
│         ▼                                     ▼              │
│  ┌─────────────┐                      ┌─────────────┐        │
│  │  PostgreSQL │                      │    Redis    │        │
│  │   (Prisma)  │                      │  (BullMQ)   │        │
│  └─────────────┘                      └──────┬──────┘        │
│                                              │               │
│                                              ▼               │
│                                       ┌─────────────┐        │
│                                       │   Worker    │        │
│                                       │  (Gemini)   │        │
│                                       └─────────────┘        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# 1. Configure environment
cp .env.example .env

# 2. Start infrastructure
docker-compose up -d

# 3. Install dependencies
npm install

# 4. Run database migrations
npm run prisma:migrate

# 5. Generate Prisma client
npm run prisma:generate

# 6. Start development server
npm run dev
```

## Environment Variables

```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bugless

# Redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
CLI_SESSION_EXPIRY_MINUTES=10

# AI Provider
GOOGLE_API_KEY=your-gemini-api-key

# GitHub App (optional)
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your-webhook-secret
```

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create new user account |
| `POST` | `/auth/login` | Authenticate and receive JWT |
| `POST` | `/auth/cli/session` | Create CLI authentication session |
| `GET` | `/auth/cli/session/:id` | Poll CLI session status |
| `POST` | `/auth/cli/session/:id/complete` | Complete CLI authentication |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/projects` | List user's projects |
| `POST` | `/projects` | Create new project |
| `GET` | `/projects/:id` | Get project details |
| `PUT` | `/projects/:id` | Update project settings |
| `DELETE` | `/projects/:id` | Delete project |

### Submissions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/submissions` | Submit code for AI review |
| `GET` | `/submissions/:id` | Get submission with review |
| `GET` | `/submissions/:id/stream` | SSE stream for real-time review |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/webhooks/github` | Receive GitHub App events |

## Project Structure

```
back/
├── server.ts                 # Application entry point
├── docker-compose.yaml       # PostgreSQL + Redis
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Migration history
│   └── seed.ts               # Seed data
└── src/
    ├── config/               # Environment & Prisma config
    ├── controllers/          # Request handlers
    ├── database/             # Database connection
    ├── generated/            # Prisma generated client
    ├── middleware/           # Auth & validation middleware
    ├── providers/            # External services
    │   ├── ai.provider.ts    # Google Gemini integration
    │   └── github.provider.ts# GitHub API integration
    ├── routes/               # API route definitions
    ├── schemas/              # Zod validation schemas
    ├── services/             # Business logic
    ├── utils/                # Helper functions
    └── workers/              # BullMQ job processors
        └── review.worker.ts  # AI review processing
```

## Database Schema

### Core Models

| Model | Description |
|-------|-------------|
| `User` | User accounts with authentication |
| `Project` | Code projects with custom review instructions |
| `Submission` | Code submitted for review |
| `Review` | AI-generated review results |
| `CliSession` | Browser-based CLI authentication |

### GitHub Integration

| Model | Description |
|-------|-------------|
| `GitHubInstallation` | GitHub App installation records |
| `GitHubPullRequest` | PR tracking for automatic reviews |

### Submission Modes

| Mode | Description |
|------|-------------|
| `PR_DIFF` | Compare branches (PR-style review) |
| `UNCOMMITTED` | Review unstaged/staged changes |
| `COMMIT` | Review a specific commit |
| `CUSTOM` | Review arbitrary code snippet |

## Scripts

```bash
npm run dev              # Start with hot reload
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:migrate   # Create and run migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema without migration
npm run prisma:seed      # Seed database
```

## Docker Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset all data
docker-compose down -v
```

## GitHub App Integration

The backend receives webhooks from GitHub when PRs are opened or updated. It then:

1. Validates the webhook signature
2. Fetches the PR diff using Octokit
3. Creates a submission in the database
4. Queues an AI review job
5. Posts the review as a PR comment

For setup instructions, see [GITHUB_APP_SETUP.md](docs/GITHUB_APP_SETUP.md).

### Local Development with Smee

```bash
npm install -g smee-client
smee -u https://smee.io/YOUR_CHANNEL -t http://localhost:3000/webhooks/github
```

## License

MIT
