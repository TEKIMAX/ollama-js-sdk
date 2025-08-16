// ModelManager.ts - Handles operations related to Ollama models
import { OllamaClient } from '../client/OllamaClient';
import { SUPPORTED_MODELS, DEFAULT_MODEL, MODEL_ALIASES } from '../config/models';

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
  
  private resolveModelName(model: string): string {
    const resolved = MODEL_ALIASES[model as keyof typeof MODEL_ALIASES] || model;
    if (!SUPPORTED_MODELS[resolved as keyof typeof SUPPORTED_MODELS]) {
      console.warn(`Model ${model} not in supported list. Only GPT-OSS 20 and 120 are officially supported.`);
    }
    return resolved;
  }
  
  getSupportedModels() {
    return Object.values(SUPPORTED_MODELS);
  }
  
  getDefaultModel() {
    return DEFAULT_MODEL;
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
    const resolvedOptions = {
      ...options,
      model: this.resolveModelName(options.model || DEFAULT_MODEL)
    };
    
    const response = await this.client.makeRequest('/api/generate', {
      method: 'POST',
      body: JSON.stringify(resolvedOptions),
    });
    
    if (options.stream)
      return response;
    
    return await response.json();
  }
  
  async pull({ name, insecure = false }: { name: string, insecure?: boolean }) {
    try {
      const response = await this.client.makeRequest('/api/pull', {
        method: 'POST',
        body: JSON.stringify({ name, insecure }),
      });
      
      // For pull requests, Ollama returns a streaming response with status updates
      // We need to consume and process this stream to ensure the model is fully pulled
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to get reader from response");
      
      const decoder = new TextDecoder();
      let pullComplete = false;
      
      while (!pullComplete) {
        const { done, value } = await reader.read();
        if (done) {
          pullComplete = true;
          break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const update = JSON.parse(line);
            // Check if this is the final message indicating completion
            if (update.status === "success" || update.completed) {
              pullComplete = true;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
      
      // Verify the model was actually pulled by checking if it exists now
      try {
        await this.show({ name });
        return { success: true, name };
      } catch (error) {
        throw new Error(`Model ${name} was not pulled successfully`);
      }
    } catch (error) {
      throw error;
    }
  }
  
  async push({ name, insecure = false }: { name: string, insecure?: boolean }) {
    const response = await this.client.makeRequest('/api/push', {
      method: 'POST',
      body: JSON.stringify({ name, insecure }),
    });
    
    return await response.json();
  }
  
  async delete({ name }: { name: string }) {
    try {
      const response = await this.client.makeRequest('/api/delete', {
        method: 'DELETE',
        body: JSON.stringify({ name }),
      });
      
      // The API may not return valid JSON for delete operations
      // If response.json() fails, we'll still consider it a success if status is ok
      try {
        return await response.json();
      } catch (error) {
        if (response.ok) {
          return { success: true, name };
        }
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
} 