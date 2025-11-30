import { GoogleGenAI } from '@google/genai';
import envLoader from '../services/env-loader.service';

class GeminiConfig {
  private static instance: GeminiConfig;
  private client: GoogleGenAI;

  private constructor() {
    const apiKey = envLoader.getEnv('GOOGLE_API_KEY');

    if (!apiKey || apiKey.trim() === '') {
      console.error('[GeminiConfig] GOOGLE_API_KEY is missing');
      throw new Error('GOOGLE_API_KEY environment variable is required');
    }

    this.client = new GoogleGenAI({ apiKey });
    console.log('[GeminiConfig] Gemini client initialized successfully');
  }

  static getInstance(): GeminiConfig {
    if (!GeminiConfig.instance) {
      GeminiConfig.instance = new GeminiConfig();
    }
    return GeminiConfig.instance;
  }

  getClient() {
    return this.client;
  }
}

export default GeminiConfig.getInstance();

