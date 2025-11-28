import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import {
  BranchSelector,
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
import { useBranchDiff } from '../hooks/use-git.js';
import type { PresetName } from '../types/review.js';

interface BranchReviewProps {
  baseBranch?: string;
  preset: PresetName;
  onBack: () => void;
}

type Step = 'selectBranch' | 'fetchingGit' | 'reviewing' | 'results';

const AMBER = '#ff6b35';

export function BranchReview({ baseBranch: initialBranch, preset, onBack }: BranchReviewProps) {
  const [step, setStep] = useState<Step>(initialBranch ? 'fetchingGit' : 'selectBranch');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(initialBranch || null);
  const [commandsComplete, setCommandsComplete] = useState(false);
  const [gitCommands, setGitCommands] = useState<string[]>([]);

  const { diff, loading: diffLoading, error: diffError } = useBranchDiff(selectedBranch);

  // Use command execution at parent level to preserve state across steps
  const { commands: executedCommands, isComplete: commandsAnimationComplete } = useCommandExecution(gitCommands);

  // Update commands when branch changes
  useEffect(() => {
    if (selectedBranch && step === 'fetchingGit') {
      setGitCommands([
        `git rev-parse --abbrev-ref HEAD`,
        `git diff ${selectedBranch}...HEAD --stat`,
        `git diff ${selectedBranch}...HEAD`,
        `git log --oneline -5`,
      ]);
    }
  }, [selectedBranch, step]);

  // Mark commands complete when animation finishes
  useEffect(() => {
    if (commandsAnimationComplete && gitCommands.length > 0) {
      setCommandsComplete(true);
    }
  }, [commandsAnimationComplete, gitCommands.length]);
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
      startReview(diff, { mode: 'branch', baseBranch: selectedBranch!, preset });
    }
  }, [diff, step, diffLoading, commandsComplete, selectedBranch, preset, startReview]);

  // Update step when review completes
  useEffect(() => {
    if (reviewState === 'complete' || reviewState === 'error') {
      setStep('results');
    }
  }, [reviewState]);

  const handleBranchSelect = (branch: string) => {
    setSelectedBranch(branch);
    setCommandsComplete(false);
    setGitCommands([]); // Reset commands for new animation
    setStep('fetchingGit');
  };

  // Select branch step
  if (step === 'selectBranch') {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Branch Review (PR Style)</Text>
        <PresetInfo preset={preset} />
        <Box marginTop={1}>
          <BranchSelector onSelect={handleBranchSelect} />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Diff error
  if (diffError) {
    return (
      <Box flexDirection="column">
        <ErrorMessage message={diffError} suggestion="Check that the branch exists and try again" />
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
        <Text bold color={AMBER}>Branch Review</Text>
        <Text dimColor>Comparing against: <Text color={AMBER}>{selectedBranch}</Text></Text>
        <NoChangesError mode="branch" />
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
        <Text bold color={AMBER}>Branch Review - Results</Text>
        <Text dimColor>Compared against: <Text color={AMBER}>{selectedBranch}</Text></Text>

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
      <Text bold color={AMBER}>Branch Review</Text>
      <Text dimColor>Comparing against: <Text color={AMBER}>{selectedBranch}</Text></Text>

      {/* Command log using parent-level state */}
      {executedCommands.length > 0 && <CommandLog commands={executedCommands} />}

      {/* Show analyzing message after commands complete */}
      {commandsComplete && (step === 'reviewing' || reviewState === 'loading') && (
        <Box marginTop={1}>
          <Loading
            message="Analyzing code changes..."
            details={`${diff?.files.length || 0} files to review`}
          />
        </Box>
      )}
    </Box>
  );
}
