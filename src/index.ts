// Main entry point for the Tekimax Ollama SDK
import { OllamaClient } from './client/OllamaClient';
import { ModelManager } from './models/ModelManager';
import { EmbeddingsManager } from './embeddings/EmbeddingsManager';
import { FineTuningManager } from './finetuning/FineTuningManager';
import { OpenAICompatManager } from './openai/OpenAICompatManager';
import { ToolsManager } from './tools/ToolsManager';

// Export OpenAI compatibility types
export * from './openai/types';

// Export tool types
export * from './tools/ToolsManager';

// Export all modules
export {
  OllamaClient,
  ModelManager,
  EmbeddingsManager,
  FineTuningManager,
  OpenAICompatManager,
  ToolsManager
};

// Export default client
export default OllamaClient; 