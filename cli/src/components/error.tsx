import React from 'react';
import { Box, Text } from 'ink';

interface ErrorMessageProps {
  title?: string;
  message: string;
  suggestion?: string;
}

export function ErrorMessage({ title = 'Error', message, suggestion }: ErrorMessageProps) {
  return (
    <Box flexDirection="column" paddingY={1}>
      <Box>
        <Text color="red" bold>{title}: </Text>
        <Text color="red">{message}</Text>
      </Box>
      {suggestion && (
        <Box marginTop={1}>
          <Text dimColor>Suggestion: {suggestion}</Text>
        </Box>
      )}
    </Box>
  );
}

interface NotGitRepoErrorProps {
  path?: string;
}

export function NotGitRepoError({ path }: NotGitRepoErrorProps) {
  return (
    <ErrorMessage
      title="Not a Git Repository"
      message={path ? `${path} is not a git repository` : 'Current directory is not a git repository'}
      suggestion="Run this command inside a git repository, or initialize one with 'git init'"
    />
  );
}

interface NoChangesErrorProps {
  mode: string;
}

export function NoChangesError({ mode }: NoChangesErrorProps) {
  const messages: Record<string, string> = {
    uncommitted: 'No uncommitted changes found',
    branch: 'No differences found between branches',
    commit: 'No changes found in this commit',
  };

  return (
    <Box paddingY={1}>
      <Text color="yellow">{messages[mode] || 'No changes to review'}</Text>
    </Box>
  );
}
