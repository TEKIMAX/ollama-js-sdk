// ModelManager.ts - Handles operations related to Ollama models
import { OllamaClient } from '../client/OllamaClient';

export interface ModelInfo {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
  details?: Record<string, any>;
}

export interface GenerateOptions {
  prompt: string;
  model: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  format?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  num_predict?: number;
  stop?: string[];
}

export class ModelManager {
  private client: OllamaClient;
  
  constructor(client: OllamaClient) {
    this.client = client;
  }
  
  async list() {
    const response = await this.client.makeRequest('/api/tags', {
      method: 'GET',
    });
    
    const data = await response.json();
    return data.models as ModelInfo[];
  }
  
  async show({ name }: { name: string }) {
    const response = await this.client.makeRequest(`/api/show`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    
    return await response.json();
  }
  
  async generate(options: GenerateOptions) {
    const response = await this.client.makeRequest('/api/generate', {
      method: 'POST',
      body: JSON.stringify(options),
    });
    
    if (options.stream)
      return response;
    
    return await response.json();
  }
  
  async pull({ name, insecure = false }: { name: string, insecure?: boolean }) {
    const response = await this.client.makeRequest('/api/pull', {
      method: 'POST',
      body: JSON.stringify({ name, insecure }),
    });
    
    return response;
  }
  
  async push({ name, insecure = false }: { name: string, insecure?: boolean }) {
    const response = await this.client.makeRequest('/api/push', {
      method: 'POST',
      body: JSON.stringify({ name, insecure }),
    });
    
    return await response.json();
  }
  
  async delete({ name }: { name: string }) {
    const response = await this.client.makeRequest('/api/delete', {
      method: 'DELETE',
      body: JSON.stringify({ name }),
    });
    
    return await response.json();
  }
} 