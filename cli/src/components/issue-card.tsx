import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import type { ReviewIssue, Severity } from '../types/review.js';

interface IssueCardProps {
  issue: ReviewIssue;
  index: number;
  showSuggestion?: boolean;
}

const severityConfig: Record<Severity, { icon: string; color: typeof chalk.red; label: string }> = {
  critical: { icon: '!!!', color: chalk.red, label: 'CRITICAL' },
  warning: { icon: '!!', color: chalk.yellow, label: 'WARNING' },
  suggestion: { icon: '!', color: chalk.blue, label: 'SUGGESTION' },
  info: { icon: 'i', color: chalk.gray, label: 'INFO' },
};

export function IssueCard({ issue, index, showSuggestion = true }: IssueCardProps) {
  const config = severityConfig[issue.severity];
  const colorFn = config.color;

  return (
    <Box flexDirection="column" marginBottom={1} paddingLeft={1}>
      {/* Header line */}
      <Box>
        <Text>
          {colorFn.bold(`[${config.icon}]`)} {colorFn(config.label)}
        </Text>
        <Text dimColor> ({issue.category})</Text>
      </Box>

      {/* File location */}
      <Box paddingLeft={4}>
        <Text color="cyan">{issue.file}</Text>
        {issue.line && <Text dimColor>:{issue.line}</Text>}
        {issue.endLine && issue.endLine !== issue.line && (
          <Text dimColor>-{issue.endLine}</Text>
        )}
      </Box>

      {/* Title */}
      <Box paddingLeft={4}>
        <Text bold>{issue.title}</Text>
      </Box>

      {/* Description */}
      <Box paddingLeft={4}>
        <Text wrap="wrap">{issue.description}</Text>
      </Box>

      {/* Suggestion */}
      {showSuggestion && issue.suggestion && (
        <Box paddingLeft={4} marginTop={1}>
          <Text color="green">Suggestion: </Text>
          <Text wrap="wrap">{issue.suggestion}</Text>
        </Box>
      )}
    </Box>
  );
}

interface IssueListProps {
  issues: ReviewIssue[];
  showSuggestions?: boolean;
}

export function IssueList({ issues, showSuggestions = true }: IssueListProps) {
  if (issues.length === 0) {
    return (
      <Box paddingY={1}>
        <Text color="green">No issues found!</Text>
      </Box>
    );
  }

  // Group by severity
  const critical = issues.filter(i => i.severity === 'critical');
  const warnings = issues.filter(i => i.severity === 'warning');
  const suggestions = issues.filter(i => i.severity === 'suggestion');
  const info = issues.filter(i => i.severity === 'info');

  const sortedIssues = [...critical, ...warnings, ...suggestions, ...info];

  return (
    <Box flexDirection="column">
      <Text bold>Issues Found ({issues.length}):</Text>
      <Box flexDirection="column" marginTop={1}>
        {sortedIssues.map((issue, index) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            index={index}
            showSuggestion={showSuggestions}
          />
        ))}
      </Box>
    </Box>
  );
}
