// Main entry point for the Tekimax SDK - GPT-OSS Edition
import { OllamaClient } from './client/OllamaClient';
import { ModelManager } from './models/ModelManager';
import { EmbeddingsManager } from './embeddings/EmbeddingsManager';
import { FineTuningManager } from './finetuning/FineTuningManager';
import { OpenAICompatManager } from './openai/OpenAICompatManager';
import { ToolsManager } from './tools/ToolsManager';
import { SUPPORTED_MODELS, DEFAULT_MODEL, MODEL_ALIASES } from './config/models';

// Export OpenAI compatibility types
export * from './openai/types';

// Export tool types
export * from './tools/ToolsManager';

// Export model configuration
export { SUPPORTED_MODELS, DEFAULT_MODEL, MODEL_ALIASES };

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