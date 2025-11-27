import type { PresetName } from '../types/review.js';

export interface ReviewPreset {
  name: string;
  description: string;
  focusAreas: string[];
}

const presets: Record<PresetName, ReviewPreset> = {
  standard: {
    name: 'Standard Review',
    description: 'Balanced code review covering all aspects of code quality.',
    focusAreas: [
      'Bug detection and logic errors',
      'Security vulnerabilities',
      'Performance considerations',
      'Code maintainability',
      'Best practices adherence',
    ],
  },
  security: {
    name: 'Security Focus',
    description: 'Security-focused review prioritizing vulnerability detection.',
    focusAreas: [
      'Authentication and authorization issues',
      'Input validation and sanitization',
      'SQL injection, XSS, CSRF vulnerabilities',
      'Secrets and credential exposure',
      'Secure communication (HTTPS, encryption)',
      'Dependency vulnerabilities',
    ],
  },
  performance: {
    name: 'Performance Focus',
    description: 'Performance-oriented review focusing on efficiency.',
    focusAreas: [
      'Algorithm complexity and optimization',
      'Memory usage and leaks',
      'Database query efficiency',
      'Unnecessary computations',
      'Caching opportunities',
      'Bundle size impact',
    ],
  },
  quick: {
    name: 'Quick Review',
    description: 'Fast review catching only critical issues.',
    focusAreas: [
      'Critical bugs and crashes',
      'Security vulnerabilities',
      'Breaking changes',
    ],
  },
  thorough: {
    name: 'Thorough Review',
    description: 'Comprehensive review with detailed analysis.',
    focusAreas: [
      'All standard review areas',
      'Architecture and design patterns',
      'Test coverage implications',
      'Documentation quality',
      'Error handling completeness',
      'Edge cases and boundary conditions',
      'Accessibility considerations',
    ],
  },
};

export function getPreset(name: PresetName): ReviewPreset {
  return presets[name] || presets.standard;
}

export function listPresets(): ReviewPreset[] {
  return Object.values(presets);
}

export function getPresetNames(): PresetName[] {
  return Object.keys(presets) as PresetName[];
}
