# API Reference - GPT-OSS Edition

This document provides a reference for the Tekimax SDK API, optimized for GPT-OSS 20 and GPT-OSS 120 models.

## Core Classes

### OllamaClient

Main entry point for the SDK.

```typescript
import { OllamaClient } from 'tekimax-sdk';

const client = new OllamaClient({
  baseUrl?: string, // default: 'http://localhost:11434'
  apiKey?: string,  // optional API key
});
```

### Supported Models

```typescript
// Get list of supported GPT-OSS models
const models = client.models.getSupportedModels();
// Returns: [{name: 'gpt-oss-20', ...}, {name: 'gpt-oss-120', ...}]

// Get default model
const defaultModel = client.models.getDefaultModel();
// Returns: 'gpt-oss-20'
```

## Text Generation

### generate

Generate text from a prompt using GPT-OSS models.

```typescript
async function generate({
  model: 'gpt-oss-20' | 'gpt-oss-120' | '20' | '120',
  prompt: string,
  system?: string,
  template?: string,
  context?: number[],
  raw?: boolean,
  format?: string,
  temperature?: number,
  top_p?: number,
  top_k?: number,
  num_predict?: number,
  stop?: string[],
}): Promise<{
  model: string,
  response: string,
  context?: number[],
  total_duration?: number,
  load_duration?: number, 
  prompt_eval_duration?: number,
  eval_count?: number,
  eval_duration?: number,
}>
```

### generateStream

Generate text from a prompt with streaming response.

```typescript
async function generateStream({
  model: string,
  prompt: string,
  system?: string,
  template?: string,
  context?: number[],
  raw?: boolean,
  format?: string,
  temperature?: number,
  top_p?: number,
  top_k?: number,
  num_predict?: number,
  stop?: string[],
}): Promise<AsyncIterable<{
  model: string,
  response: string,
  context?: number[],
  done: boolean,
  total_duration?: number,
  load_duration?: number, 
  prompt_eval_duration?: number,
  eval_count?: number,
  eval_duration?: number,
}>>
```

## Embeddings

### createEmbedding

Create an embedding vector from a text prompt.

```typescript
async function createEmbedding({
  model: string,
  prompt: string,
}): Promise<{
  embedding: number[],
}>
```

## Model Management

### listModels

List available models.

```typescript
async function listModels(): Promise<{
  models: Array<{
    name: string,
    size: number,
    modified_at: string,
    digest: string,
  }>
}>
```

### showModel

Get details about a specific model.

```typescript
async function showModel({
  name: string,
}): Promise<{
  license?: string,
  modelfile?: string,
  parameters?: string,
  template?: string,
  system?: string,
  details?: Record<string, any>,
}>
```

### pullModel

Pull a model from the Ollama library.

```typescript
async function pullModel({
  name: string,
  insecure?: boolean,
}): Promise<void>
```

### deleteModel

Delete a model from the local Ollama instance.

```typescript
async function deleteModel({
  name: string,
}): Promise<void>
```

## OpenAI Compatibility Layer

For using the SDK with applications designed for OpenAI's API.

```typescript
import { OpenAICompatManager } from '@tekimax/ollama-sdk/openai';

const openai = new OpenAICompatManager({
  host?: string, // default: 'http://localhost:11434'
});
```

See [OpenAI Compatibility](./openai-compatibility.md) for full details.

## Utility Classes

### StreamParser

Parse streaming responses from Ollama.

```typescript
import { StreamParser } from '@tekimax/ollama-sdk/util';

const parser = new StreamParser();
const parsedChunk = parser.parseChunk(rawChunk);
```

## Error Handling

All methods can throw `OllamaError` with the following structure:

```typescript
{
  message: string,
  status?: number,
  code?: string,
  details?: any,
}
```

Example error handling:

```typescript
import { OllamaKit, OllamaError } from '@tekimax/ollama-sdk';

const ollama = new OllamaKit();

try {
  const response = await ollama.generate({
    model: 'non-existent-model',
    prompt: 'Hello',
  });
} catch (error) {
  if (error instanceof OllamaError) {
    console.error(`Ollama error: ${error.message}`);
    console.error(`Status: ${error.status}`);
  } else {
    console.error(`Unknown error: ${error}`);
  }
}
``` 