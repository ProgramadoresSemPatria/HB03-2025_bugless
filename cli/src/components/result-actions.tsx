import React, { useState } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { Spinner } from '@inkjs/ui';
import { resolveIssues, type ResolveResult } from '../services/resolver.js';
import type { Issue } from '../types/review.js';

const AMBER = '#ff6b35';

interface ResultActionsProps {
  issues: Issue[];
  onNewReview: () => void;
}

export function ResultActions({ issues, onNewReview }: ResultActionsProps) {
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [resolveResults, setResolveResults] = useState<ResolveResult[]>([]);

  const issuesWithSuggestions = issues.filter(i => i.suggestion && i.line);

  const handleSelect = async (item: { label: string; value: string }) => {
    if (item.value === 'resolve') {
      setResolving(true);
      const results = await resolveIssues(issuesWithSuggestions);
      setResolveResults(results);
      setResolving(false);
      setResolved(true);
    } else if (item.value === 'new-review') {
      onNewReview();
    }
  };

  if (resolving) {
    return (
      <Box marginTop={1}>
        <Text color="yellow">• </Text>
        <Text>Aplicando correções... </Text>
        <Spinner type="dots" />
      </Box>
    );
  }

  if (resolved) {
    const successCount = resolveResults.filter(r => r.success).length;
    const failCount = resolveResults.filter(r => !r.success).length;

    return (
      <Box flexDirection="column" marginTop={1}>
        <Text color="green">Correcoes aplicadas!</Text>
        <Text dimColor>  {successCount} sucesso, {failCount} falhas</Text>
        {resolveResults.filter(r => !r.success).map((r, i) => (
          <Text key={i} color="red">  x {r.file}: {r.error}</Text>
        ))}
        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: 'Realizar outro review', value: 'new-review' },
            ]}
            onSelect={handleSelect}
          />
        </Box>
      </Box>
    );
  }

  const items = [
    ...(issuesWithSuggestions.length > 0
      ? [{ label: `Resolver issues (${issuesWithSuggestions.length} com sugestoes)`, value: 'resolve' }]
      : []),
    { label: 'Realizar outro review', value: 'new-review' },
  ];

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>O que deseja fazer?</Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
}
