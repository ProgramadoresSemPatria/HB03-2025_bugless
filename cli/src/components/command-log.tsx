import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';

const AMBER = '#ff6b35';

interface CommandResult {
  command: string;
  status: 'pending' | 'running' | 'done';
  output?: string[];
  truncatedLines?: number;
}

interface CommandLogProps {
  commands: CommandResult[];
}

export function CommandLog({ commands }: CommandLogProps) {
  return (
    <Box flexDirection="column" marginTop={1}>
      {commands.map((cmd, i) => (
        <Box key={i} flexDirection="column" marginBottom={1}>
          <Box>
            {cmd.status === 'running' && (
              <>
                <Text color="yellow">• </Text>
                <Text>Running </Text>
                <Text color={AMBER}>{cmd.command}</Text>
                <Text> </Text>
                <Spinner type="dots" />
              </>
            )}
            {cmd.status === 'done' && (
              <>
                <Text color="green">• </Text>
                <Text>Ran </Text>
                <Text color={AMBER}>{cmd.command}</Text>
              </>
            )}
            {cmd.status === 'pending' && (
              <>
                <Text dimColor>○ </Text>
                <Text dimColor>{cmd.command}</Text>
              </>
            )}
          </Box>
          {cmd.status === 'done' && cmd.output && cmd.output.length > 0 && (
            <Box flexDirection="column" marginLeft={2}>
              {cmd.truncatedLines && cmd.truncatedLines > 0 && (
                <Text dimColor>  … +{cmd.truncatedLines} lines</Text>
              )}
              {cmd.output.map((line, j) => (
                <Box key={j}>
                  <Text dimColor>{j === cmd.output!.length - 1 ? '└ ' : '│ '}</Text>
                  <Text>{line}</Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

// Mock data for git commands
const mockOutputs: Record<string, { output: string[]; truncated?: number }> = {
  'git status': {
    output: [
      'On branch feat/cli',
      'Your branch is up to date with \'origin/feat/cli\'.',
      '',
      'Changes not staged for commit:',
      '  modified:   src/components/header.tsx',
      '  modified:   src/services/git.ts',
    ],
    truncated: 3,
  },
  'git rev-parse --abbrev-ref HEAD': {
    output: ['feat/cli'],
  },
  'git diff --stat': {
    output: [
      ' src/components/header.tsx | 45 ++++++++++++++++++++++++++++++++++++++-----',
      ' src/services/git.ts       | 12 ++++++------',
      ' src/modes/branch-review.tsx | 28 +++++++++++++++++++++++++---',
      ' 3 files changed, 76 insertions(+), 11 deletions(-)',
    ],
  },
  'git diff HEAD': {
    output: [
      'diff --git a/src/components/header.tsx b/src/components/header.tsx',
      'index 1234567..abcdefg 100644',
      '--- a/src/components/header.tsx',
      '+++ b/src/components/header.tsx',
      '@@ -1,10 +1,15 @@',
      '+import React from \'react\';',
      '+import { Box, Text } from \'ink\';',
    ],
    truncated: 48,
  },
  'git log --oneline -5': {
    output: [
      '53421ce feat: add planService',
      '304b15e feat: Estrutura inicial de Pastas',
      '3add7e9 feat: teste e sincronização',
    ],
  },
  'git diff --cached': {
    output: [
      'diff --git a/src/services/api.ts b/src/services/api.ts',
      '--- a/src/services/api.ts',
      '+++ b/src/services/api.ts',
      '@@ -10,6 +10,8 @@',
      '+  async submitReview(diff: string): Promise<ReviewResult>;',
    ],
    truncated: 22,
  },
  'git show': {
    output: [
      'commit 53421ce (HEAD -> feat/cli)',
      'Author: Mario <mario@example.com>',
      'Date:   Tue Nov 26 10:30:00 2024 -0300',
      '',
      '    feat: add planService',
      '',
      ' src/services/plan.ts | 45 ++++++++++++++++++',
      ' 1 file changed, 45 insertions(+)',
    ],
    truncated: 35,
  },
  'git diff': {
    output: [
      'diff --git a/src/components/header.tsx b/src/components/header.tsx',
      '@@ -25,6 +25,12 @@ export function Header() {',
      '+  const cwd = process.cwd();',
      '+  const topBorder = \'╔\' + \'═\'.repeat(BOX_WIDTH) + \'╗\';',
    ],
    truncated: 156,
  },
  'git fetch': {
    output: [
      'From github.com:user/repo',
      '   abc1234..def5678  main -> origin/main',
    ],
  },
};

function getMockOutput(command: string): { output: string[]; truncated?: number } {
  // Check for exact match first
  if (mockOutputs[command]) {
    return mockOutputs[command];
  }

  // Check for partial matches
  for (const key of Object.keys(mockOutputs)) {
    if (command.includes(key) || key.includes(command.split(' ')[0])) {
      return mockOutputs[key];
    }
  }

  // Default output
  return { output: ['(no output)'] };
}

// Hook to simulate command execution with realistic delays
export function useCommandExecution(commandList: string[], onComplete?: () => void) {
  const [commands, setCommands] = useState<CommandResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Serialize for stable comparison
  const commandsKey = JSON.stringify(commandList);

  useEffect(() => {
    // Reset state when commands change
    if (commandList.length === 0) {
      setCommands([]);
      setIsComplete(false);
      return;
    }

    // Initialize commands as pending
    setCommands(commandList.map(cmd => ({ command: cmd, status: 'pending' })));
    setIsComplete(false);

    let currentIndex = 0;
    let mounted = true;

    const runNext = () => {
      if (!mounted || currentIndex >= commandList.length) {
        if (mounted) {
          setIsComplete(true);
          onComplete?.();
        }
        return;
      }

      // Set current command to running
      setCommands(prev => prev.map((cmd, i) =>
        i === currentIndex ? { ...cmd, status: 'running' } : cmd
      ));

      // Simulate command execution with variable delay
      const delay = 400 + Math.random() * 800;
      setTimeout(() => {
        if (!mounted) return;

        const mockData = getMockOutput(commandList[currentIndex]);

        setCommands(prev => prev.map((cmd, i) =>
          i === currentIndex ? {
            ...cmd,
            status: 'done',
            output: mockData.output,
            truncatedLines: mockData.truncated,
          } : cmd
        ));
        currentIndex++;

        // Small delay before next command
        setTimeout(() => runNext(), 150);
      }, delay);
    };

    runNext();

    return () => {
      mounted = false;
    };
  }, [commandsKey]); // Re-execute when commands change

  return { commands, isComplete };
}
