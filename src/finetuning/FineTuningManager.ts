// FineTuningManager.ts - Handles operations related to fine-tuning Ollama models
import { OllamaClient } from '../client/OllamaClient';

export interface FineTuneOptions {
  model: string;          // Base model to fine-tune
  targetModel: string;    // Name for the fine-tuned model
  dataset: string | any[]; // Path to JSONL file or array of training examples
  parameters?: {
    epochs?: number;      // Number of training epochs
    batchSize?: number;   // Batch size during training
    learningRate?: number; // Learning rate for optimizer
  };
}

export interface FineTuneResponse {
  status: string;
  message: string;
  modelName?: string;
}

export class FineTuningManager {
  private client: OllamaClient;
  
  constructor(client: OllamaClient) {
    this.client = client;
  }
  
  async create({ model, targetModel, dataset, parameters = {} }: FineTuneOptions): Promise<FineTuneResponse> {
    // If dataset is an array, convert it to JSONL format
    let datasetStr = '';
    
    if (Array.isArray(dataset)) {
      datasetStr = dataset.map(item => JSON.stringify(item)).join('\n');
    } else {
      datasetStr = dataset;
    }
    
    const response = await this.client.makeRequest('/api/create', {
      method: 'POST',
      body: JSON.stringify({
        name: targetModel,
        path: model,
        training_data: datasetStr,
        parameters
      }),
    });
    
    return await response.json();
  }
  
  // Helper method to format training data from conversations
  formatConversationDataset(conversations: { prompt: string, response: string }[]): string {
    return conversations.map(convo => JSON.stringify({
      input: convo.prompt,
      output: convo.response
    })).join('\n');
  }
} 