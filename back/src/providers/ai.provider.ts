import { AIEngineInterface } from './engines/ai-engine.interface';
import GeminiEngine from './engines/gemini.engine';

enum AIEngine {
  GEMINI = 'gemini',
}

// Builders to create the engines
const ENGINE_BUILDERS: Record<AIEngine, () => AIEngineInterface> = {
  [AIEngine.GEMINI]: () => new GeminiEngine(),
};

class AIProvider {
  private static instance: AIProvider;
  private engine: AIEngineInterface;

  private constructor(engineType: AIEngine) {
    const builder = ENGINE_BUILDERS[engineType];

    if (!builder) {
      throw new Error(`Engine "${engineType}" not configured`);
    }

    this.engine = builder();
  }

  static getInstance(engineType: AIEngine = AIEngine.GEMINI): AIProvider {
    if (!AIProvider.instance) {
      AIProvider.instance = new AIProvider(engineType);
    }
    return AIProvider.instance;
  }

  async generateContent(fullPrompt: string): Promise<string> {
    return this.engine.generateText(fullPrompt);
  }

  async generateStream(fullPrompt: string, onChunk: (chunk: string) => void): Promise<string> {
    if (!this.engine.generateStream) {
       // Fallback if engine doesn't support streaming, though we know Gemini does
       const text = await this.engine.generateText(fullPrompt);
       onChunk(text);
       return text;
    }
    return this.engine.generateStream(fullPrompt, onChunk);
  }
}

export default AIProvider.getInstance();
