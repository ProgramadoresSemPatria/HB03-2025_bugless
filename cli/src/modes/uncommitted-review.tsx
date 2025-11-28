import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import {
  Loading,
  ReviewSummary,
  IssueList,
  ErrorMessage,
  NoChangesError,
  PresetInfo,
  CommandLog,
  useCommandExecution,
  ResultActions,
} from '../components/index.js';
import { useReview } from '../hooks/use-review.js';
import { useUncommittedDiff } from '../hooks/use-git.js';
import type { PresetName } from '../types/review.js';

interface UncommittedReviewProps {
  preset: PresetName;
  onBack: () => void;
}

type Step = 'fetchingGit' | 'reviewing' | 'results';

const AMBER = '#ff6b35';

const GIT_COMMANDS = [
  'git status',
  'git diff --cached',
  'git diff HEAD',
  'git diff --stat',
];

export function UncommittedReview({ preset, onBack }: UncommittedReviewProps) {
  const [step, setStep] = useState<Step>('fetchingGit');
  const [commandsComplete, setCommandsComplete] = useState(false);

  const { diff, loading: diffLoading, error: diffError } = useUncommittedDiff();

  // Use command execution at parent level to preserve state across steps
  const { commands: executedCommands, isComplete: commandsAnimationComplete } = useCommandExecution(GIT_COMMANDS);

  // Mark commands complete when animation finishes
  useEffect(() => {
    if (commandsAnimationComplete) {
      setCommandsComplete(true);
    }
  }, [commandsAnimationComplete]);
  const { state: reviewState, result, error: reviewError, startReview } = useReview();

  // Handle back navigation
  useInput((input, key) => {
    if (key.escape || (input === 'q' && step !== 'reviewing')) {
      onBack();
    }
  });

  // Start review when BOTH diff is ready AND commands animation is complete
  useEffect(() => {
    if (diff && step === 'fetchingGit' && !diffLoading && commandsComplete) {
      if (diff.files.length === 0) {
        setStep('results');
        return;
      }
      setStep('reviewing');
      startReview(diff, { mode: 'uncommitted', preset });
    }
  }, [diff, step, diffLoading, commandsComplete, preset, startReview]);

  // Update step when review completes
  useEffect(() => {
    if (reviewState === 'complete' || reviewState === 'error') {
      setStep('results');
    }
  }, [reviewState]);

  // Diff error
  if (diffError) {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Uncommitted Changes Review</Text>
        <ErrorMessage message={diffError} />
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Review error
  if (reviewError) {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Uncommitted Changes Review</Text>
        <ErrorMessage message={reviewError} />
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // No changes
  if (commandsComplete && (!diff || diff.files.length === 0)) {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Uncommitted Changes Review</Text>
        <NoChangesError mode="uncommitted" />
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Results step - show final results
  if (step === 'results' && result) {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Uncommitted Changes - Results</Text>

        {/* Keep command log visible in results */}
        {executedCommands.length > 0 && <CommandLog commands={executedCommands} />}

        <ReviewSummary summary={result.summary} reviewedFiles={result.reviewedFiles} />
        <IssueList issues={result.issues} />

        <ResultActions
          issues={result.issues}
          onNewReview={onBack}
        />
      </Box>
    );
  }

  // Fetching git data OR reviewing - keep command log visible
  return (
    <Box flexDirection="column">
      <Text bold color={AMBER}>Uncommitted Changes Review</Text>
      <PresetInfo preset={preset} />

      {/* Command log using parent-level state */}
      {executedCommands.length > 0 && <CommandLog commands={executedCommands} />}

      {/* Show analyzing message after commands complete */}
      {commandsComplete && (step === 'reviewing' || reviewState === 'loading') && (
        <Box marginTop={1}>
          <Loading
            message="Analyzing uncommitted changes..."
            details={`${diff?.files.length || 0} files to review`}
          />
        </Box>
      )}
    </Box>
  );
}
