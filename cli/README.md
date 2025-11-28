# BugLess CLI

AI-powered code review directly in your terminal.

## Installation

```bash
cd cli
npm install
npm run build
npm link  # Makes 'bugless' available globally
```

## Usage

### Interactive Mode

```bash
bugless
```

Opens an interactive menu where you can select what to review.

### Direct Commands

```bash
# Review against a branch (PR style)
bugless -b main
bugless --branch develop

# Review uncommitted changes
bugless -u
bugless --uncommitted

# Review a specific commit
bugless -c abc1234
bugless --commit abc1234

# Custom review with instructions
bugless -x
bugless --custom
```

### Review Presets

```bash
# Use a specific preset
bugless -b main -p security
bugless -u --preset performance

# Available presets:
# - standard    Balanced review (default)
# - security    Focus on vulnerabilities
# - performance Focus on efficiency
# - quick       Critical issues only
# - thorough    Comprehensive analysis
```

## Configuration

```bash
# Set API key (for future backend integration)
bugless config --api-key <key>

# Set API URL
bugless config --api-url <url>

# Show current config
bugless config --show
```

## Development

```bash
# Watch mode
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Run built version
npm start
```

## Project Structure

```
cli/
├── src/
│   ├── index.tsx       # Entry point
│   ├── app.tsx         # Main app component
│   ├── modes/          # Review modes (branch, uncommitted, commit, custom)
│   ├── components/     # UI components
│   ├── services/       # Git, API, config services
│   ├── hooks/          # React hooks
│   ├── types/          # TypeScript types
│   ├── schemas/        # Zod schemas
│   ├── prompts/        # Review prompts and presets
│   └── utils/          # Utility functions
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Current Status

This CLI is currently using **mock data** for reviews. Backend integration will be added in a future update.

## License

MIT
