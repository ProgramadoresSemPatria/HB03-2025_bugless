import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { Spinner } from '@inkjs/ui';
import { gitService } from '../services/git.js';
import type { GitBranch } from '../types/git.js';

interface BranchSelectorProps {
  onSelect: (branch: string) => void;
  excludeCurrent?: boolean;
}

export function BranchSelector({ onSelect, excludeCurrent = true }: BranchSelectorProps) {
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBranches() {
      try {
        const branchList = await gitService.getLocalBranches();
        const filtered = excludeCurrent
          ? branchList.filter(b => !b.current)
          : branchList;
        setBranches(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load branches');
      } finally {
        setLoading(false);
      }
    }
    loadBranches();
  }, [excludeCurrent]);

  if (loading) {
    return <Spinner label="Loading branches..." />;
  }

  if (error) {
    return <Text color="red">Error: {error}</Text>;
  }

  if (branches.length === 0) {
    return <Text color="yellow">No other branches found.</Text>;
  }

  const items = branches.map(b => ({
    label: b.name,
    value: b.name,
  }));

  const handleSelect = (item: { label: string; value: string }) => {
    onSelect(item.value);
  };

  return (
    <Box flexDirection="column">
      <Text bold>Select base branch to compare against:</Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
}
