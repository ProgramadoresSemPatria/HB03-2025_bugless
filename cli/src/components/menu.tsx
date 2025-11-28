import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import type { ReviewMode } from '../types/review.js';

interface MenuProps {
  onSelect: (mode: ReviewMode) => void;
}

const menuOptions = [
  {
    label: '1. Review against branch (PR style)',
    value: 'branch',
  },
  {
    label: '2. Review uncommitted changes',
    value: 'uncommitted',
  },
  {
    label: '3. Review a specific commit',
    value: 'commit',
  },
  {
    label: '4. Custom review with instructions',
    value: 'custom',
  },
];

export function Menu({ onSelect }: MenuProps) {
  const handleSelect = (item: { label: string; value: string }) => {
    onSelect(item.value as ReviewMode);
  };

  return (
    <Box flexDirection="column">
      <Text bold>What would you like to review?</Text>
      <Box marginTop={1}>
        <SelectInput items={menuOptions} onSelect={handleSelect} />
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Use arrow keys to navigate, Enter to select</Text>
      </Box>
    </Box>
  );
}
