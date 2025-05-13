// OllamaClient.ts - Core client for interacting with Ollama API
import { ModelManager } from '../models/ModelManager';
import { EmbeddingsManager } from '../embeddings/EmbeddingsManager';
import { FineTuningManager } from '../finetuning/FineTuningManager';
import { OpenAICompatManager } from '../openai/OpenAICompatManager';

export interface OllamaClientOptions {
  baseUrl: string;
  apiKey?: string;
}

export class OllamaClient {
  private baseUrl: string;
  private apiKey?: string;
  
  public models: ModelManager;
  public embeddings: EmbeddingsManager;
  public fineTuning: FineTuningManager;
  public openai: OpenAICompatManager;

  constructor({ baseUrl = 'http://localhost:11434', apiKey }: OllamaClientOptions = { baseUrl: 'http://localhost:11434' }) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    
    // Initialize managers
    this.models = new ModelManager(this);
    this.embeddings = new EmbeddingsManager(this);
    this.fineTuning = new FineTuningManager(this);
    this.openai = new OpenAICompatManager(this);
  }

  public getBaseUrl() {
    return this.baseUrl;
  }

  public getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey)
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    
    return headers;
  }

  public async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders();
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      
      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }
} 