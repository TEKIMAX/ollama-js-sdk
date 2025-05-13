// EmbeddingsManager.ts - Handles operations related to Ollama embeddings
import { OllamaClient } from '../client/OllamaClient';

export interface EmbeddingOptions {
  model: string;
  prompt: string;
  options?: Record<string, any>;
}

export interface EmbeddingResponse {
  embedding: number[];
}

export class EmbeddingsManager {
  private client: OllamaClient;
  
  constructor(client: OllamaClient) {
    this.client = client;
  }
  
  async create({ model, prompt, options = {} }: EmbeddingOptions): Promise<EmbeddingResponse> {
    const response = await this.client.makeRequest('/api/embeddings', {
      method: 'POST',
      body: JSON.stringify({
        model,
        prompt,
        options
      }),
    });
    
    return await response.json();
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