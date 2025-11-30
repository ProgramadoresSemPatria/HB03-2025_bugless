export interface GenerateOptions {
    temperature?: number;
    maxTokens?: number;
  }
  
  // Interface for the AI engine (Gemini, OpenAI, etc)
  export interface AIEngineInterface {
    readonly name: string;
    generateText(prompt: string, options?: GenerateOptions): Promise<string>;
    generateStream(prompt: string, onChunk: (chunk: string) => void, options?: GenerateOptions): Promise<string>;
  }
