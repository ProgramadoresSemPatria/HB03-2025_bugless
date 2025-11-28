import React from 'react';
import { Box, Text } from 'ink';

interface HeaderProps {
  showDivider?: boolean;
}

const logo = [
  '██████╗ ██╗   ██╗ ██████╗ ██╗     ███████╗███████╗███████╗',
  '██╔══██╗██║   ██║██╔════╝ ██║     ██╔════╝██╔════╝██╔════╝',
  '██████╔╝██║   ██║██║  ███╗██║     █████╗  ███████╗███████╗',
  '██╔══██╗██║   ██║██║   ██║██║     ██╔══╝  ╚════██║╚════██║',
  '██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗███████║███████║',
  '╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝',
];

// Amber color matching frontend #ff6b35
const AMBER = '#ff6b35';

const LOGO_WIDTH = logo[0].length;
const BOX_PADDING = 4;
const BOX_WIDTH = LOGO_WIDTH + BOX_PADDING * 2;

export function Header({ showDivider = true }: HeaderProps) {
  const cwd = process.cwd();

  const topBorder = '╔' + '═'.repeat(BOX_WIDTH) + '╗';
  const bottomBorder = '╚' + '═'.repeat(BOX_WIDTH) + '╝';
  const emptyLine = '║' + ' '.repeat(BOX_WIDTH) + '║';

  const tagline = 'AI-Powered Code Review';
  const version = 'v0.1.0';
  const separator = '  ·  ';
  const footerContent = tagline + separator + version;
  const footerPadding = Math.floor((BOX_WIDTH - footerContent.length) / 2);

  const dirLabel = 'directory: ';
  const dirLineContent = dirLabel + cwd;

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text dimColor>{topBorder}</Text>
      <Text dimColor>{emptyLine}</Text>
      {logo.map((line, i) => (
        <Text key={i}>
          <Text dimColor>║</Text>
          <Text>{' '.repeat(BOX_PADDING)}</Text>
          <Text color={AMBER}>{line}</Text>
          <Text>{' '.repeat(BOX_PADDING)}</Text>
          <Text dimColor>║</Text>
        </Text>
      ))}
      <Text dimColor>{emptyLine}</Text>
      <Text>
        <Text dimColor>║</Text>
        <Text>{' '.repeat(footerPadding)}</Text>
        <Text dimColor>{tagline}</Text>
        <Text color={AMBER}>{separator}</Text>
        <Text color={AMBER}>{version}</Text>
        <Text>{' '.repeat(BOX_WIDTH - footerPadding - footerContent.length)}</Text>
        <Text dimColor>║</Text>
      </Text>
      <Text dimColor>{emptyLine}</Text>
      <Text>
        <Text dimColor>║</Text>
        <Text>{' '.repeat(BOX_PADDING)}</Text>
        <Text dimColor>{dirLabel}</Text>
        <Text color={AMBER}>{cwd}</Text>
        <Text>{' '.repeat(Math.max(1, BOX_WIDTH - BOX_PADDING - dirLineContent.length))}</Text>
        <Text dimColor>║</Text>
      </Text>
      <Text dimColor>{bottomBorder}</Text>
    </Box>
  );
}
