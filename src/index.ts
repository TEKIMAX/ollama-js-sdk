// Main entry point for the Tekimax Ollama SDK
import { OllamaClient } from './client/OllamaClient';
import { ModelManager } from './models/ModelManager';
import { EmbeddingsManager } from './embeddings/EmbeddingsManager';
import { FineTuningManager } from './finetuning/FineTuningManager';

// Export all modules
export {
  OllamaClient,
  ModelManager,
  EmbeddingsManager,
  FineTuningManager
};

// Export default client
export default OllamaClient; 