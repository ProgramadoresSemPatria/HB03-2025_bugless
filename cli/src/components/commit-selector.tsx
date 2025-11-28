import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { Spinner } from '@inkjs/ui';
import { gitService } from '../services/git.js';
import type { GitCommit } from '../types/git.js';

interface CommitSelectorProps {
  onSelect: (sha: string) => void;
  count?: number;
}

export function CommitSelector({ onSelect, count = 10 }: CommitSelectorProps) {
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCommits() {
      try {
        const commitList = await gitService.getRecentCommits(count);
        setCommits(commitList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load commits');
      } finally {
        setLoading(false);
      }
    }
    loadCommits();
  }, [count]);

  if (loading) {
    return <Spinner label="Loading recent commits..." />;
  }

  if (error) {
    return <Text color="red">Error: {error}</Text>;
  }

  if (commits.length === 0) {
    return <Text color="yellow">No commits found.</Text>;
  }

  const items = commits.map(c => ({
    label: `${c.shortHash} - ${truncate(c.message, 50)} (${c.relativeDate})`,
    value: c.hash,
  }));

  const handleSelect = (item: { label: string; value: string }) => {
    onSelect(item.value);
  };

  return (
    <Box flexDirection="column">
      <Text bold>Select a commit to review:</Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
}

function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
}
