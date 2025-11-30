import { AIEngineInterface, GenerateOptions } from './ai-engine.interface';
import geminiConfig from '../../config/gemini.config';

export class GeminiEngine implements AIEngineInterface {
  readonly name = 'Gemini-Flash';
  private readonly modelId = 'gemini-2.5-flash';
  private client = geminiConfig.getClient();

  async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
    try {
      const result = await this.client.models.generateContent({
        model: this.modelId,
        contents: prompt,
      });

      return result.text ?? '';
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      throw error;
    }
  }

  async generateStream(prompt: string, onChunk: (chunk: string) => void, options?: GenerateOptions): Promise<string> {
    try {
      const resultStream = await this.client.models.generateContentStream({
        model: this.modelId,
        contents: prompt,
      });

      let fullText = '';
      for await (const chunk of resultStream) {
        const chunkText = chunk.text ?? '';
        fullText += chunkText;
        onChunk(chunkText);
      }

      return fullText;
    } catch (error) {
      console.error(`[${this.name}] Error stream:`, error);
      throw error;
    }
  }
}

export default GeminiEngine;
