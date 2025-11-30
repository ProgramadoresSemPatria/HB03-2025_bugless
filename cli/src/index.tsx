import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { App } from './app.js';
import { logout } from './services/auth.js';
import type { ReviewMode, PresetName } from './types/review.js';

const cli = meow(
  `
  Usage
    $ bugless [options]

  Options
    --branch, -b <base>   Review against a base branch (PR style)
    --uncommitted, -u     Review uncommitted changes
    --commit, -c <sha>    Review a specific commit
    --custom, -x          Custom review with instructions
    --preset, -p <name>   Review preset (standard, security, performance, quick, thorough)
    --help                Show help
    --version             Show version

  Examples
    $ bugless                    Interactive mode
    $ bugless -b main            Review against main branch
    $ bugless -u                 Review uncommitted changes
    $ bugless -c abc123          Review specific commit
    $ bugless -b main -p security Security-focused PR review

  Config
    $ bugless config --api-key <key>   Set API key
    $ bugless config --api-url <url>   Set API URL
    $ bugless config --show            Show current config

  Auth
    $ bugless logout                   Logout and clear stored credentials
`,
  {
    importMeta: import.meta,
    flags: {
      branch: {
        type: 'string',
        shortFlag: 'b',
      },
      uncommitted: {
        type: 'boolean',
        shortFlag: 'u',
      },
      commit: {
        type: 'string',
        shortFlag: 'c',
      },
      custom: {
        type: 'boolean',
        shortFlag: 'x',
      },
      preset: {
        type: 'string',
        shortFlag: 'p',
        default: 'standard',
      },
      apiKey: {
        type: 'string',
      },
      apiUrl: {
        type: 'string',
      },
      show: {
        type: 'boolean',
      },
    },
  }
);

// Determine mode from flags
function getMode(): ReviewMode | 'interactive' {
  if (cli.flags.branch) return 'branch';
  if (cli.flags.uncommitted) return 'uncommitted';
  if (cli.flags.commit) return 'commit';
  if (cli.flags.custom) return 'custom';
  return 'interactive';
}

// Validate preset
function validatePreset(preset: string): PresetName {
  const validPresets: PresetName[] = ['standard', 'security', 'performance', 'quick', 'thorough'];
  if (validPresets.includes(preset as PresetName)) {
    return preset as PresetName;
  }
  console.warn(`Invalid preset "${preset}", using "standard"`);
  return 'standard';
}

const mode = getMode();
const preset = validatePreset(cli.flags.preset);

// Handle logout command
const isLogoutCommand = cli.input[0] === 'logout';
if (isLogoutCommand) {
  logout();
  console.log('Logged out successfully. Run bugless again to login.');
  process.exit(0);
}

// Handle config command
const isConfigCommand = cli.input[0] === 'config';
const configAction = isConfigCommand
  ? {
      apiKey: cli.flags.apiKey,
      apiUrl: cli.flags.apiUrl,
      show: cli.flags.show,
    }
  : undefined;

render(
  <App
    mode={mode}
    baseBranch={cli.flags.branch}
    commitSha={cli.flags.commit}
    preset={preset}
    configAction={configAction}
  />
);
