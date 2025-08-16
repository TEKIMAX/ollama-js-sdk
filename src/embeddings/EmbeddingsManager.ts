// EmbeddingsManager.ts - Handles operations related to GPT-OSS embeddings
import { OllamaClient } from '../client/OllamaClient';
import { DEFAULT_MODEL, MODEL_ALIASES } from '../config/models';

export interface EmbeddingOptions {
  model: string;
  input: string | string[];  // Support both single and batch embeddings
  options?: Record<string, any>;
}

export interface EmbeddingResponse {
  embeddings: number[][];  // Array of embeddings for batch support
  model: string;
  usage?: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export class EmbeddingsManager {
  private client: OllamaClient;
  
  constructor(client: OllamaClient) {
    this.client = client;
  }
  
  private resolveModelName(model: string): string {
    return MODEL_ALIASES[model as keyof typeof MODEL_ALIASES] || model || DEFAULT_MODEL;
  }
  
  async create({ model, input, options = {} }: EmbeddingOptions): Promise<EmbeddingResponse> {
    const resolvedModel = this.resolveModelName(model);
    const inputs = Array.isArray(input) ? input : [input];
    
    const embeddings: number[][] = [];
    
    // Process each input to get embeddings
    for (const text of inputs) {
      const response = await this.client.makeRequest('/api/embeddings', {
        method: 'POST',
        body: JSON.stringify({
          model: resolvedModel,
          prompt: text,
          options
        }),
      });
      
      const data = await response.json();
      embeddings.push(data.embedding);
    }
    
    return {
      embeddings,
      model: resolvedModel,
      usage: {
        prompt_tokens: inputs.join(' ').split(' ').length * 4, // Rough estimation
        total_tokens: inputs.join(' ').split(' ').length * 4
      }
    };
  }
  
  // Calculate cosine similarity between two embeddings
  calculateCosineSimilarity(embeddingA: number[], embeddingB: number[]): number {
    // Ensure embeddings are of the same length
    if (embeddingA.length !== embeddingB.length) 
      throw new Error('Embeddings must be of the same length');
    
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < embeddingA.length; i++) {
      dotProduct += embeddingA[i] * embeddingB[i];
      magnitudeA += embeddingA[i] * embeddingA[i];
      magnitudeB += embeddingB[i] * embeddingB[i];
    }
    
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    
    // Prevent division by zero
    if (magnitudeA === 0 || magnitudeB === 0) 
      return 0;
    
    return dotProduct / (magnitudeA * magnitudeB);
  }
} 