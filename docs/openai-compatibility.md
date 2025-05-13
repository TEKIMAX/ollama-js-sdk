# OpenAI Compatibility Layer

This document explains how to use the OpenAI compatibility layer in the @tekimax/ollama-sdk to migrate applications from OpenAI's API to Ollama.

## Overview

The SDK provides an OpenAI-compatible interface that allows applications built for OpenAI's API to work with Ollama models with minimal or no code changes.

## Setup

```typescript
import { OpenAICompatManager } from '@tekimax/ollama-sdk/openai';

const openai = new OpenAICompatManager({
  host: 'http://localhost:11434', // default: 'http://localhost:11434'
});
```

## Supported Endpoints

### Chat Completions

```typescript
// OpenAI-compatible interface
const completion = await openai.chat.completions.create({
  model: 'llama2',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, who are you?' }
  ],
  temperature: 0.7,
});

console.log(completion.choices[0].message.content);
```

#### Streaming

```typescript
const stream = await openai.chat.completions.create({
  model: 'llama2',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Write a short poem about code' }
  ],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### Completions (Legacy)

```typescript
const completion = await openai.completions.create({
  model: 'llama2',
  prompt: 'Once upon a time,',
  max_tokens: 100,
});

console.log(completion.choices[0].text);
```

### Embeddings

```typescript
const embedding = await openai.embeddings.create({
  model: 'nomic-embed-text',
  input: 'The quick brown fox jumps over the lazy dog',
});

console.log(embedding.data[0].embedding.slice(0, 5));
```

### Models

```typescript
// List available models
const models = await openai.models.list();
console.log(models.data);

// Get model information
const model = await openai.models.retrieve('llama2');
console.log(model);
```

## Feature Compatibility

| OpenAI Feature | Supported | Notes |
|----------------|-----------|-------|
| Chat completions | ✅ | Full support including streaming |
| Completions | ✅ | Legacy API support |
| Embeddings | ✅ | Uses Ollama's embedding models |
| Models list/retrieve | ✅ | Maps Ollama models to OpenAI format |
| Function calling | ⚠️ | Basic support |
| Vision API | ⚠️ | Limited support |
| JSON mode | ⚠️ | Basic support |
| Tools | ❌ | Not supported |
| Fine-tuning | ❌ | Not supported |
| Assistants API | ❌ | Not supported |

## Model Mapping

The compatibility layer automatically maps Ollama model names to OpenAI-compatible IDs. You can use either Ollama model names directly or use OpenAI model names that will be mapped to their Ollama equivalents:

| OpenAI Model Reference | Ollama Model |
|------------------------|--------------|
| `gpt-3.5-turbo` | `llama2` |
| `gpt-4` | `mixtral` |
| `text-embedding-ada-002` | `nomic-embed-text` |

## Error Handling

The compatibility layer maps Ollama errors to OpenAI-compatible error formats:

```typescript
try {
  const completion = await openai.chat.completions.create({
    model: 'non-existent-model',
    messages: [{ role: 'user', content: 'Hello' }],
  });
} catch (error) {
  console.error(`Error: ${error.message}`);
  console.error(`Type: ${error.type}`);
  console.error(`Code: ${error.code}`);
}
```

## Configuration Options

The OpenAI compatibility layer supports several configuration options:

```typescript
const openai = new OpenAICompatManager({
  host: 'http://localhost:11434',
  defaultModel: 'llama2', // Default model to use when none specified
  modelMap: {
    // Custom model mapping
    'gpt-4-turbo': 'mixtral:32b',
    'gpt-3.5-turbo': 'llama2:13b',
  },
});
```

## Migrating from OpenAI SDK

To migrate an existing application from OpenAI's SDK to Ollama:

1. Replace OpenAI client initialization:

   ```diff
   - import OpenAI from 'openai';
   - const openai = new OpenAI({
   -   apiKey: process.env.OPENAI_API_KEY,
   - });
   
   + import { OpenAICompatManager } from '@tekimax/ollama-sdk/openai';
   + const openai = new OpenAICompatManager({
   +   host: 'http://localhost:11434',
   + });
   ```

2. Update model names if necessary:

   ```diff
   const completion = await openai.chat.completions.create({
   -  model: 'gpt-3.5-turbo',
   +  model: 'llama2',
      messages: [
        { role: 'user', content: 'Hello!' }
      ],
   });
   ```

3. Test and adjust as needed for Ollama-specific behavior.

## Limitations

- Some advanced OpenAI features are not available in Ollama
- Response formats might have slight differences
- Performance characteristics will depend on your local hardware or Ollama server
- Token counting may differ between OpenAI and Ollama models 