import { z } from 'zod';

export const configSchema = z.object({
  defaultBaseBranch: z.string().default('main'),
  defaultPreset: z.enum(['standard', 'security', 'performance', 'quick', 'thorough']).default('standard'),
  excludePatterns: z.array(z.string()).default([
    'node_modules/**',
    '*.lock',
    'package-lock.json',
    'pnpm-lock.yaml',
    'dist/**',
    'build/**',
    '.git/**',
  ]),
  maxFileSizeKb: z.number().default(500),
  // Future backend integration
  apiUrl: z.string().optional(),
  apiKey: z.string().optional(),
  useMock: z.boolean().default(true),
});

export type ConfigSchema = z.infer<typeof configSchema>;
