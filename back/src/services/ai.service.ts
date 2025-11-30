import { SubmissionModeEnum } from '../generated/prisma/enums';
import aiProvider from '../providers/ai.provider';

class AIAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AIAPIError';
  }
}

export interface AIReviewResult {
  mode: SubmissionModeEnum;
  summary: string;
  detectedIssues: string;
  suggestedChanges: string;
  metadata?: Record<string, unknown>;
  rawResponse?: string;
}

class AIPromptService {
  private static instance: AIPromptService;


  private readonly PR_DIFF_PROMPT = `
# CONTEXT
You are a Senior Software Engineer conducting a thorough code review on a Pull Request diff. The changes are critical for production deployment.

# OBJECTIVE
Analyze the git diff and produce a comprehensive code review focused on:
1. Security vulnerabilities (SQL injection, XSS, authentication flaws)
2. Performance bottlenecks (N+1 queries, inefficient algorithms, memory leaks)
3. Code quality issues (SOLID violations, code smells, anti-patterns)
4. Architectural concerns (breaking changes, coupling, scalability)

# OUTPUT FORMAT REQUIREMENT

You MUST format your response EXACTLY as follows:

Review Summary

Score: [0-100]/100

Issues: [X] critical, [Y] warnings, [Z] suggestions, [W] info

Files reviewed: [N]

[1-2 sentence overall assessment based on score and findings]

________________________________________________

Issues Found ([TOTAL]):

[!!] CRITICAL (security)
file/path.ts:42
Issue title
Detailed explanation of the critical security issue.

Suggestion: How to fix it securely.

---

[!] WARNING (performance)
file/path.ts:15
Issue title
Performance concern description.

Suggestion: Optimization recommendation.

---

[*] SUGGESTION (maintainability)
file/path.ts:8
Issue title
Code quality improvement opportunity.

Suggestion: Refactoring idea.

---

[i] INFO (positive)
Well-implemented pattern or improvement noted.

________________________________________________

# SEVERITY GUIDELINES
- CRITICAL (!!): Security vulnerabilities, data loss, crashes, breaking changes
- WARNING (!): Performance issues, deprecated APIs, bad practices
- SUGGESTION (*): Code quality, refactoring, style improvements
- INFO (i): Positive highlights, patterns used, good practices

# SCORING RUBRIC
Calculate score (0-100):
- Start at 100
- Subtract 20-25 per CRITICAL security/breaking issue
- Subtract 10-15 per other CRITICAL issue
- Subtract 5-10 per WARNING
- Subtract 2-5 per SUGGESTION
- Minimum: 0

# FILE COUNTING
Count unique files in the diff (files with +++ markers).

Now analyze the following diff:

`;

  private readonly UNCOMMITTED_PROMPT = `
# Pair Programming Assistant - Bug Detection & Logic Analysis

You are helping debug and improve uncommitted code. Analyze systematically to find bugs and logic issues.

# ANALYSIS FOCUS
- Null/undefined reference errors
- Off-by-one errors
- Incorrect conditional logic
- Type mismatches
- Race conditions / async issues
- Missing validation
- Complex logic that can be simplified

# OUTPUT FORMAT REQUIREMENT

You MUST format your response EXACTLY as follows:

Review Summary

Score: [0-100]/100

Issues: [X] critical, [Y] warnings, [Z] suggestions, [W] info

Files reviewed: [N]

[1-2 sentence assessment of code quality and bugs found]

________________________________________________

Issues Found ([TOTAL]):

[!!] CRITICAL (null-safety)
file.ts:23
Bug title
Detailed explanation of the bug and its impact.

Suggestion: How to fix the bug.

---

[!] WARNING (logic-error)
file.ts:45
Logic issue title
Description of the potential problem.

Suggestion: Recommended fix.

---

[*] SUGGESTION (complexity)
file.ts:12
Improvement title
Refactoring opportunity explanation.

Suggestion: How to simplify.

---

[i] INFO (testing)
Testing recommendation or positive observation.

________________________________________________

# SEVERITY GUIDELINES
- CRITICAL (!!): Bugs causing crashes, data corruption, runtime errors
- WARNING (!): Logic errors, edge case failures, potential bugs
- SUGGESTION (*): Code simplification, better naming, refactoring
- INFO (i): Testing recommendations, positive patterns

# SCORING RUBRIC
- Start at 100
- Subtract 20-25 per CRITICAL bug
- Subtract 5-10 per WARNING
- Subtract 2-5 per SUGGESTION
- Minimum: 0

Now analyze this uncommitted code:

`;

  private readonly COMMIT_PROMPT = `
# Conventional Commit Message Generator

You are a Git workflow expert tasked with generating a properly formatted conventional commit message based on the provided code changes.

## Conventional Commits Format

<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

## Types (use most appropriate):
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, no logic change)
- refactor: Code refactoring (no functional change)
- perf: Performance improvements
- test: Adding or modifying tests
- build: Build system or dependency changes
- ci: CI/CD configuration changes
- chore: Other changes (tooling, etc.)

## Rules:
1. Use lowercase for type and description
2. No period at end of description
3. Description should complete: "This commit will..."
4. Body should explain WHAT and WHY, not HOW
5. Keep description under 72 characters
6. Reference issue numbers in footer if applicable

## Analysis Process:

1. Review the changes to understand their purpose
2. Identify the primary type of change
3. Determine appropriate scope (component/file area affected)
4. Write concise description
5. Add body only if context is needed
6. Include breaking changes in footer if applicable

## Response Format:

Provide ONLY the commit message in this format (no additional commentary):

<type>(scope): <description>

<body - optional, explain what and why>

<footer - optional, breaking changes or issue references>

Now analyze these changes and generate a conventional commit message:

`;

  private readonly CUSTOM_PROMPT = `
# Code Explanation Assistant

You are a knowledgeable software engineer providing clear, comprehensive explanations of code for developers who want to understand what they're looking at.

## Analysis Approach

Provide a thorough explanation covering:

1. **High-Level Overview**
   - What is the purpose of this code?
   - What problem does it solve?

2. **Code Structure**
   - Main components (functions, classes, modules)
   - How they interact with each other
   - Data flow and transformations

3. **Technical Details**
   - Key algorithms or patterns used
   - Important logic or business rules
   - External dependencies or integrations

4. **Complexity & Quality Assessment**
   - Code complexity level (simple/moderate/complex)
   - Notable patterns or anti-patterns
   - Potential areas of concern

5. **Usage Context**
   - How this code would typically be used
   - Expected inputs and outputs
   - Common scenarios or use cases

## Response Format

### Overview
[High-level explanation in 2-3 sentences]

### Detailed Explanation
[Comprehensive breakdown of the code structure and logic]

### Key Components
- Component 1: [Description]
- Component 2: [Description]

### Technical Highlights
[Notable patterns, algorithms, or implementation details]

### Quality Notes
[Assessment of code quality and potential improvements]

Now explain the following code:

`;


  private constructor() {
  }


  static getInstance(): AIPromptService {
    if (!AIPromptService.instance) {
      AIPromptService.instance = new AIPromptService();
    }
    return AIPromptService.instance;
  }

  async generateAnalysisStream(
    codeContent: string,
    submissionMode: SubmissionModeEnum,
    onProgress: (chunk: string) => void
  ): Promise<AIReviewResult> {
    try {
      const fullPrompt = this.composePrompt(codeContent, submissionMode);
      const rawResponse = await aiProvider.generateStream(fullPrompt, onProgress);
      return this.parseStructuredResponse(rawResponse, submissionMode);
    } catch (error) {
      return this.handleAPIError(error);
    }
  }

  async generateAnalysis(
    codeContent: string,
    submissionMode: SubmissionModeEnum
  ): Promise<AIReviewResult> {
    try {
      const fullPrompt = this.composePrompt(codeContent, submissionMode);
      const rawResponse = await aiProvider.generateContent(fullPrompt);
      return this.parseStructuredResponse(rawResponse, submissionMode);
    } catch (error) {
      return this.handleAPIError(error);
    }
  }

  /**
   * Gera dados estruturados para o fluxo de submissão.
   */
  async analyzeCode(
    codeContent: string,
    mode: SubmissionModeEnum = SubmissionModeEnum.PR_DIFF
  ): Promise<AIReviewResult> {
    const structuredPrompt = `
# ROLE
Você é um revisor técnico sênior responsável por avaliar alterações de código.

# OUTPUT FORMAT
Responda **exatamente** no seguinte JSON:
{
  "summary": "<overview with max 2 sentences>",
  "detectedIssues": "<bullet list or paragraph>",
  "suggestedChanges": "<actionable guidance>"
}

# CODE UNDER REVIEW
${codeContent}
`;

    const rawResponse = await aiProvider.generateContent(structuredPrompt);
    return this.parseStructuredResponse(rawResponse, mode);
  }

  private composePrompt(
    codeContent: string,
    mode: SubmissionModeEnum
  ): string {
    const systemInstruction = this.getSystemInstructions(mode);
    const formatRequirement = this.getJsonFormatRequirement(mode);
    return `${systemInstruction}
${formatRequirement}
${codeContent}`;
  }

  private parseStructuredResponse(
    raw: string,
    mode: SubmissionModeEnum
  ): AIReviewResult {
    const cleaned = raw.trim().replace(/```json|```/gi, '');
    try {
      const parsed = JSON.parse(cleaned);
      return {
        mode,
        summary: parsed.summary ?? 'AI review summary unavailable.',
        detectedIssues: parsed.detectedIssues ?? 'No issues reported.',
        suggestedChanges:
          parsed.suggestedChanges ?? 'No suggestions reported.',
        metadata: parsed.metadata,
        rawResponse: raw
      };
    } catch {
      // Fallback to raw text in summary to avoid dropping information
      return {
        mode,
        summary: raw,
        detectedIssues: 'Unable to parse detected issues from AI response.',
        suggestedChanges: 'Unable to parse suggestions from AI response.',
        rawResponse: raw
      };
    }
  }

  private getJsonFormatRequirement(mode: SubmissionModeEnum): string {
    const shared = `
# OUTPUT FORMAT (MANDATORY)
Respond **only** with valid JSON (no \`\`\`). Use exactly the following keys:
{
  "summary": "<max 2 sentences explaining the result>",
  "detectedIssues": "<main findings, use \\n to separate bullets>",
  "suggestedChanges": "<immediate actionable guidance>",
  "metadata": { ... }
}
- Always include the four keys, even if a field is empty.
- Use double quotes for all keys and strings.
- The text must be in clear ENGLISH.
- Never include comments or text outside the JSON.
`;

    switch (mode) {
      case SubmissionModeEnum.PR_DIFF:
        return `${shared}
Additional rules for PR_DIFF:
- metadata.mode must be "PR_DIFF".
- Include metadata.score (number 0-100) and metadata.filesReviewed (integer).
- Include metadata.issueBreakdown with keys critical, warnings, suggestions, and info (integers).
- Use detectedIssues to follow the "Review Summary / Issues Found" layout in text, but inside the JSON string.
`;

      case SubmissionModeEnum.UNCOMMITTED:
        return `${shared}
Additional rules for UNCOMMITTED:
- metadata.mode must be "UNCOMMITTED".
- Include metadata.score (0-100) and metadata.issueBreakdown with critical, warnings, and suggestions.
- Summarize real bugs in detectedIssues and keep suggestedChanges focused on actionable fixes.
`;

      case SubmissionModeEnum.COMMIT:
        return `${shared}
Additional rules for COMMIT:
- metadata.mode must be "COMMIT".
- Include metadata.commitMessage with the complete conventional commit line.
- Include metadata.body (string, can be empty) and metadata.footers (array of strings).
- summary should repeat the commit line; detectedIssues explains WHAT/WHY and suggestedChanges highlights next steps or validations.
`;

      case SubmissionModeEnum.CUSTOM:
        return `${shared}
Additional rules for CUSTOM:
- metadata.mode must be "CUSTOM".
- Include metadata.sections as an array of objects { "title": string, "content": string } describing each explained part.
- Adjust summary/detectedIssues/suggestedChanges to reflect overview, technical details, and learning next steps.
`;

      default:
        return shared;
    }
  }

  private getSystemInstructions(mode: SubmissionModeEnum): string {
    switch (mode) {
      case SubmissionModeEnum.PR_DIFF:
        return this.PR_DIFF_PROMPT;

      case SubmissionModeEnum.UNCOMMITTED:
        return this.UNCOMMITTED_PROMPT;

      case SubmissionModeEnum.COMMIT:
        return this.COMMIT_PROMPT;

      case SubmissionModeEnum.CUSTOM:
        return this.CUSTOM_PROMPT;

      default:
        const exhaustiveCheck: never = mode;
        throw new Error(`Unhandled submission mode: ${exhaustiveCheck}`);
    }
  }


  private handleAPIError(error: unknown): never {
    console.error('[AIPromptService] Error occurred:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : error
    });

    if (
      error instanceof TypeError &&
      (error.message.includes('fetch') || error.message.includes('network'))
    ) {
      throw new AIAPIError(
        'Network error: Unable to reach AI service',
        503,
        error
      );
    }

    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      const statusCode = (error as any).statusCode;

      if (statusCode === 429) {
        throw new AIAPIError(
          'Rate limit exceeded. Please try again later',
          429,
          error
        );
      }

      if (statusCode === 401 || statusCode === 403) {
        throw new AIAPIError(
          'Invalid or unauthorized API key',
          401,
          error
        );
      }
    }

    // Content safety filtering
    if (error instanceof Error && error.message.includes('SAFETY')) {
      throw new AIAPIError(
        'Content filtered by safety settings',
        400,
        error
      );
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new AIAPIError(`AI service error: ${message}`, 500, error);
  }
}

export default AIPromptService.getInstance();
