import type { PresetName } from '../types/review.js';
import { getPreset } from './presets.js';

export function buildReviewPrompt(presetName: PresetName, customInstructions?: string): string {
  const preset = getPreset(presetName);

  return `
You are an expert code reviewer for the BugLess CLI tool. Your task is to analyze code changes and identify issues.

## Your Role
${preset.description}

## Focus Areas
${preset.focusAreas.map(area => `- ${area}`).join('\n')}

## Severity Guidelines
- **critical**: Security vulnerabilities, data loss risks, crash-causing bugs
- **warning**: Bugs, performance issues, incorrect logic
- **suggestion**: Code improvements, best practices, maintainability
- **info**: Style preferences, minor improvements, documentation

## Categories to Consider
- security: Authentication, authorization, input validation, secrets
- performance: Efficiency, memory usage, unnecessary operations
- maintainability: Code clarity, complexity, documentation
- bug: Logic errors, edge cases, error handling
- style: Formatting, naming conventions, consistency

## Output Requirements
1. Be specific about file locations and line numbers when possible
2. Provide actionable suggestions for each issue
3. Consider the context of the changes, not just isolated lines
4. Score should reflect overall code quality (100 = excellent, 0 = critical issues)

${customInstructions ? `\n## Custom Instructions\n${customInstructions}` : ''}
  `.trim();
}
