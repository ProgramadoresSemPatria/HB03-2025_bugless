import React from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';

interface LoadingProps {
  message?: string;
  details?: string;
}

export function Loading({ message = 'Loading...', details }: LoadingProps) {
  return (
    <Box flexDirection="column">
      <Spinner label={message} />
      {details && (
        <Box marginTop={1} paddingLeft={2}>
          <Text dimColor>{details}</Text>
        </Box>
      )}
    </Box>
  );
}

interface ProgressProps {
  current: number;
  total: number;
  label?: string;
}

export function Progress({ current, total, label }: ProgressProps) {
  const percentage = Math.round((current / total) * 100);
  const barWidth = 30;
  const filled = Math.round((current / total) * barWidth);
  const empty = barWidth - filled;

  return (
    <Box flexDirection="column">
      {label && <Text>{label}</Text>}
      <Box>
        <Text color="cyan">{'█'.repeat(filled)}</Text>
        <Text dimColor>{'░'.repeat(empty)}</Text>
        <Text> {percentage}%</Text>
      </Box>
    </Box>
  );
}
