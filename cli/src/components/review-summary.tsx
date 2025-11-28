import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import type { ReviewSummary as ReviewSummaryType } from '../types/review.js';

interface ReviewSummaryProps {
  summary: ReviewSummaryType;
  reviewedFiles?: string[];
}

export function ReviewSummary({ summary, reviewedFiles }: ReviewSummaryProps) {
  // Color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return chalk.green;
    if (score >= 60) return chalk.yellow;
    return chalk.red;
  };

  const scoreColor = getScoreColor(summary.overallScore);

  return (
    <Box flexDirection="column" marginY={1} paddingX={1}>
      {/* Title */}
      <Box marginBottom={1}>
        <Text bold>Review Summary</Text>
      </Box>

      {/* Score */}
      <Box>
        <Text>Score: </Text>
        <Text>{scoreColor.bold(`${summary.overallScore}/100`)}</Text>
      </Box>

      {/* Issue counts */}
      <Box marginTop={1}>
        <Text>Issues: </Text>
        <Text color="red">{summary.criticalCount} critical</Text>
        <Text>, </Text>
        <Text color="yellow">{summary.warningCount} warnings</Text>
        <Text>, </Text>
        <Text color="blue">{summary.suggestionCount} suggestions</Text>
        <Text>, </Text>
        <Text dimColor>{summary.infoCount} info</Text>
      </Box>

      {/* Files reviewed */}
      {reviewedFiles && reviewedFiles.length > 0 && (
        <Box marginTop={1}>
          <Text>Files reviewed: </Text>
          <Text dimColor>{reviewedFiles.length}</Text>
        </Box>
      )}

      {/* Summary text */}
      <Box marginTop={1}>
        <Text wrap="wrap">{summary.summary}</Text>
      </Box>

      {/* Divider */}
      <Box marginTop={1}>
        <Text dimColor>{'─'.repeat(50)}</Text>
      </Box>
    </Box>
  );
}

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  let color: string;
  let label: string;

  if (score >= 90) {
    color = 'green';
    label = 'Excellent';
  } else if (score >= 80) {
    color = 'green';
    label = 'Good';
  } else if (score >= 60) {
    color = 'yellow';
    label = 'Fair';
  } else if (score >= 40) {
    color = 'yellow';
    label = 'Needs Work';
  } else {
    color = 'red';
    label = 'Critical';
  }

  return (
    <Box>
      <Text color={color} bold>
        {score}/100 ({label})
      </Text>
    </Box>
  );
}
