import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { TextInput } from '@inkjs/ui';
import {
  Loading,
  ReviewSummary,
  IssueList,
  ErrorMessage,
  NoChangesError,
  PresetSelector,
  BranchSelector,
  CommandLog,
  useCommandExecution,
  ResultActions,
} from '../components/index.js';
import { useReview } from '../hooks/use-review.js';
import { useUncommittedDiff, useBranchDiff } from '../hooks/use-git.js';
import type { PresetName } from '../types/review.js';

interface CustomReviewProps {
  preset: PresetName;
  onBack: () => void;
}

type Step = 'selectPreset' | 'selectSource' | 'selectBranch' | 'customPrompt' | 'fetchingGit' | 'reviewing' | 'results';
type Source = 'uncommitted' | 'branch';

const AMBER = '#ff6b35';

export function CustomReview({ preset: initialPreset, onBack }: CustomReviewProps) {
  const [step, setStep] = useState<Step>('selectPreset');
  const [selectedPreset, setSelectedPreset] = useState<PresetName>(initialPreset);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [source, setSource] = useState<Source>('uncommitted');
  const [baseBranch, setBaseBranch] = useState<string | null>(null);
  const [commandsComplete, setCommandsComplete] = useState(false);
  const [gitCommands, setGitCommands] = useState<string[]>([]);

  const uncommittedDiff = useUncommittedDiff();
  const branchDiff = useBranchDiff(source === 'branch' ? baseBranch : null);

  const activeDiff = source === 'uncommitted' ? uncommittedDiff : branchDiff;
  const { diff, loading: diffLoading, error: diffError } = activeDiff;

  const { state: reviewState, result, error: reviewError, startReview } = useReview();

  // Command execution hook at parent level to preserve state
  const { commands: executedCommands, isComplete: commandsAnimationComplete } = useCommandExecution(gitCommands);

  // Mark commands complete when animation finishes
  useEffect(() => {
    if (commandsAnimationComplete && gitCommands.length > 0) {
      setCommandsComplete(true);
    }
  }, [commandsAnimationComplete, gitCommands.length]);

  // Handle back navigation
  useInput((input, key) => {
    if (key.escape || (input === 'q' && step !== 'reviewing')) {
      if (step === 'selectSource') {
        setStep('selectPreset');
      } else if (step === 'selectBranch') {
        setStep('selectSource');
      } else if (step === 'customPrompt') {
        setStep(source === 'branch' ? 'selectBranch' : 'selectSource');
      } else {
        onBack();
      }
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
      startReview(diff, {
        mode: 'custom',
        preset: selectedPreset,
        customPrompt: customPrompt || undefined,
        baseBranch: source === 'branch' ? baseBranch || undefined : undefined,
      });
    }
  }, [diff, step, diffLoading, commandsComplete, selectedPreset, customPrompt, source, baseBranch, startReview]);

  // Update step when review completes
  useEffect(() => {
    if (reviewState === 'complete' || reviewState === 'error') {
      setStep('results');
    }
  }, [reviewState]);

  const handlePresetSelect = (preset: PresetName) => {
    setSelectedPreset(preset);
    setStep('selectSource'); // Go to source selection, not prompt
  };

  const handleSourceSelect = (selectedSource: string) => {
    setSource(selectedSource as Source);
    if (selectedSource === 'branch') {
      setStep('selectBranch'); // Go to branch selection
    } else {
      setStep('customPrompt'); // Uncommitted goes to prompt
    }
  };

  const handleBranchSelect = (branch: string) => {
    setBaseBranch(branch);
    setStep('customPrompt');
  };

  const handlePromptSubmit = (prompt: string) => {
    setCustomPrompt(prompt);
    // Set git commands based on source
    if (source === 'branch') {
      setGitCommands([
        `git rev-parse --abbrev-ref HEAD`,
        `git diff ${baseBranch}...HEAD --stat`,
        `git diff ${baseBranch}...HEAD`,
        `git log --oneline -5`,
      ]);
    } else {
      setGitCommands([
        'git status',
        'git diff --cached',
        'git diff HEAD',
        'git diff --stat',
      ]);
    }
    setCommandsComplete(false);
    setStep('fetchingGit');
  };

  // Select preset step
  if (step === 'selectPreset') {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Custom Review</Text>
        <Text dimColor>Step 1: Select review focus</Text>
        <Box marginTop={1}>
          <PresetSelector onSelect={handlePresetSelect} currentPreset={selectedPreset} />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Select source step (now step 2)
  if (step === 'selectSource') {
    const sourceItems = [
      { label: 'Uncommitted changes', value: 'uncommitted' },
      { label: 'Branch comparison', value: 'branch' },
    ];

    const handleSourceItemSelect = (item: { label: string; value: string }) => {
      handleSourceSelect(item.value);
    };

    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Custom Review</Text>
        <Text dimColor>Step 2: Select what to review</Text>
        <Text dimColor>Preset: <Text color={AMBER}>{selectedPreset}</Text></Text>
        <Box marginTop={1}>
          <Text bold>What would you like to review?</Text>
        </Box>
        <Box marginTop={1}>
          <SelectInput items={sourceItems} onSelect={handleSourceItemSelect} />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Select branch step (step 3, only if source is branch)
  if (step === 'selectBranch') {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Custom Review</Text>
        <Text dimColor>Step 3: Select base branch to compare</Text>
        <Text dimColor>Preset: <Text color={AMBER}>{selectedPreset}</Text></Text>
        <Box marginTop={1}>
          <BranchSelector onSelect={handleBranchSelect} />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Custom prompt step (step 3 for uncommitted, step 4 for branch)
  if (step === 'customPrompt') {
    const stepNumber = source === 'branch' ? 4 : 3;
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Custom Review</Text>
        <Text dimColor>Step {stepNumber}: Add custom instructions (optional)</Text>
        <Text dimColor>Preset: <Text color={AMBER}>{selectedPreset}</Text></Text>
        {source === 'branch' && baseBranch && (
          <Text dimColor>Comparing against: <Text color={AMBER}>{baseBranch}</Text></Text>
        )}
        <Box marginTop={1} flexDirection="column">
          <Text>Enter custom review instructions:</Text>
          <Text dimColor>Leave empty to use only the preset, or add specific focus areas</Text>
          <Box marginTop={1}>
            <TextInput
              placeholder="e.g., Focus on security in authentication code..."
              onSubmit={handlePromptSubmit}
            />
          </Box>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Enter to continue, Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Fetching git data OR reviewing - show CommandLog
  if (step === 'fetchingGit' || step === 'reviewing' || reviewState === 'loading') {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Custom Review</Text>
        <Text dimColor>Preset: <Text color={AMBER}>{selectedPreset}</Text></Text>
        {source === 'branch' && baseBranch && (
          <Text dimColor>Comparing against: <Text color={AMBER}>{baseBranch}</Text></Text>
        )}
        {customPrompt && <Text dimColor>Custom: {customPrompt.slice(0, 50)}...</Text>}

        {/* Command log */}
        {executedCommands.length > 0 && <CommandLog commands={executedCommands} />}

        {/* Show analyzing message after commands complete */}
        {commandsComplete && (
          <Box marginTop={1}>
            <Loading
              message="Running custom review..."
              details={`${diff?.files.length || 0} files to review`}
            />
          </Box>
        )}
      </Box>
    );
  }

  // Diff error
  if (diffError) {
    return (
      <Box flexDirection="column">
        <Text bold color={AMBER}>Custom Review</Text>
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
        <Text bold color={AMBER}>Custom Review</Text>
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
        <Text bold color={AMBER}>Custom Review</Text>
        <Text dimColor>Preset: <Text color={AMBER}>{selectedPreset}</Text></Text>
        {source === 'branch' && baseBranch && (
          <Text dimColor>Comparing against: <Text color={AMBER}>{baseBranch}</Text></Text>
        )}

        {/* Keep command log visible */}
        {executedCommands.length > 0 && <CommandLog commands={executedCommands} />}

        <NoChangesError mode={source} />
        <Box marginTop={1}>
          <Text dimColor>Press Esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // Results
  return (
    <Box flexDirection="column">
      <Text bold color={AMBER}>Custom Review - Results</Text>
      <Text dimColor>Preset: <Text color={AMBER}>{selectedPreset}</Text></Text>
      {source === 'branch' && baseBranch && (
        <Text dimColor>Compared against: <Text color={AMBER}>{baseBranch}</Text></Text>
      )}
      {customPrompt && <Text dimColor>Custom: {customPrompt.slice(0, 50)}...</Text>}

      {/* Keep command log visible in results */}
      {executedCommands.length > 0 && <CommandLog commands={executedCommands} />}

      {result && (
        <>
          <ReviewSummary summary={result.summary} reviewedFiles={result.reviewedFiles} />
          <IssueList issues={result.issues} />
        </>
      )}

      <ResultActions
        issues={result?.issues || []}
        onNewReview={onBack}
      />
    </Box>
  );
}
