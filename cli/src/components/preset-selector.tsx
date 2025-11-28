import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import type { PresetName } from '../types/review.js';

interface PresetSelectorProps {
  onSelect: (preset: PresetName) => void;
  currentPreset?: PresetName;
}

const presetOptions: Array<{ label: string; value: PresetName; description: string }> = [
  {
    label: 'Standard',
    value: 'standard',
    description: 'Balanced review covering all aspects',
  },
  {
    label: 'Security',
    value: 'security',
    description: 'Focus on vulnerabilities and security issues',
  },
  {
    label: 'Performance',
    value: 'performance',
    description: 'Focus on efficiency and optimization',
  },
  {
    label: 'Quick',
    value: 'quick',
    description: 'Fast review catching only critical issues',
  },
  {
    label: 'Thorough',
    value: 'thorough',
    description: 'Comprehensive analysis with all checks',
  },
];

export function PresetSelector({ onSelect, currentPreset }: PresetSelectorProps) {
  const items = presetOptions.map(p => ({
    label: `${p.label} - ${p.description}`,
    value: p.value,
  }));

  const handleSelect = (item: { label: string; value: string }) => {
    onSelect(item.value as PresetName);
  };

  return (
    <Box flexDirection="column">
      <Text bold>Select review preset:</Text>
      {currentPreset && (
        <Text dimColor>Current: {currentPreset}</Text>
      )}
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
}

export function PresetInfo({ preset }: { preset: PresetName }) {
  const info = presetOptions.find(p => p.value === preset);
  if (!info) return null;

  return (
    <Box>
      <Text dimColor>Preset: </Text>
      <Text>{info.label}</Text>
      <Text dimColor> - {info.description}</Text>
    </Box>
  );
}
