export const SUPPORTED_MODELS = {
  'gpt-oss-20': {
    name: 'gpt-oss-20',
    version: '20',
    parameters: '20B',
    context_length: 8192,
    description: 'GPT-OSS 20B model for training and inference',
    capabilities: ['chat', 'completion', 'embeddings'],
    default_temperature: 0.7,
    max_tokens: 4096
  },
  'gpt-oss-120': {
    name: 'gpt-oss-120',
    version: '120',
    parameters: '120B',
    context_length: 32768,
    description: 'GPT-OSS 120B model for advanced training and inference',
    capabilities: ['chat', 'completion', 'embeddings', 'fine-tuning'],
    default_temperature: 0.7,
    max_tokens: 16384
  }
};

export const DEFAULT_MODEL = 'gpt-oss-20';

export const MODEL_ALIASES = {
  'gpt20': 'gpt-oss-20',
  'gpt120': 'gpt-oss-120',
  '20': 'gpt-oss-20',
  '120': 'gpt-oss-120'
};