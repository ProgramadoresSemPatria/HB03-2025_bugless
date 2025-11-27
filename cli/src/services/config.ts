import Conf from 'conf';
import { configSchema, type ConfigSchema } from '../schemas/config.js';

const defaults: ConfigSchema = {
  defaultBaseBranch: 'main',
  defaultPreset: 'standard',
  excludePatterns: [
    'node_modules/**',
    '*.lock',
    'package-lock.json',
    'pnpm-lock.yaml',
    'dist/**',
    'build/**',
    '.git/**',
  ],
  maxFileSizeKb: 500,
  useMock: true,
};

class ConfigService {
  private store: Conf<ConfigSchema>;

  constructor() {
    this.store = new Conf<ConfigSchema>({
      projectName: 'bugless-cli',
      defaults,
    });
  }

  get<K extends keyof ConfigSchema>(key: K): ConfigSchema[K] {
    return this.store.get(key);
  }

  set<K extends keyof ConfigSchema>(key: K, value: ConfigSchema[K]): void {
    this.store.set(key, value);
  }

  getAll(): ConfigSchema {
    try {
      return configSchema.parse(this.store.store);
    } catch {
      // If validation fails, return defaults
      return defaults;
    }
  }

  // API configuration
  setApiUrl(url: string): void {
    this.store.set('apiUrl', url);
  }

  setApiKey(key: string): void {
    this.store.set('apiKey', key);
  }

  hasApiConfig(): boolean {
    return Boolean(this.store.get('apiUrl') && this.store.get('apiKey'));
  }

  getApiUrl(): string | undefined {
    return this.store.get('apiUrl') || process.env.BUGLESS_API_URL;
  }

  getApiKey(): string | undefined {
    return this.store.get('apiKey') || process.env.BUGLESS_API_KEY;
  }

  // Mock mode
  isUsingMock(): boolean {
    const envMock = process.env.BUGLESS_USE_MOCK;
    if (envMock !== undefined) {
      return envMock === 'true';
    }
    return this.store.get('useMock') ?? true;
  }

  setUseMock(useMock: boolean): void {
    this.store.set('useMock', useMock);
  }

  // Defaults
  getDefaultBaseBranch(): string {
    return this.store.get('defaultBaseBranch') || 'main';
  }

  setDefaultBaseBranch(branch: string): void {
    this.store.set('defaultBaseBranch', branch);
  }

  getDefaultPreset(): ConfigSchema['defaultPreset'] {
    return this.store.get('defaultPreset') || 'standard';
  }

  setDefaultPreset(preset: ConfigSchema['defaultPreset']): void {
    this.store.set('defaultPreset', preset);
  }

  // Utilities
  reset(): void {
    this.store.clear();
  }

  get path(): string {
    return this.store.path;
  }
}

export const configService = new ConfigService();
