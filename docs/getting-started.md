# Getting Started with Tekimax SDK - GPT-OSS Edition

This guide will help you get up and running with the Tekimax SDK, optimized for GPT-OSS 20 and GPT-OSS 120 models.

## Prerequisites

- Node.js 16 or later
- Ollama installed and running locally (or remote Ollama server accessible)
- GPT-OSS 20 or GPT-OSS 120 models pulled in Ollama

## Installation

Install the SDK using npm, yarn, or bun:

```bash
# Using npm
npm install tekimax-sdk

# Using yarn
yarn add tekimax-sdk

# Using bun
bun add tekimax-sdk
```

## Quick Start

### Basic Text Generation with GPT-OSS 20

```typescript
import { OllamaClient } from 'tekimax-sdk';

const client = new OllamaClient();

async function generateText() {
  const response = await client.models.generate({
    model: 'gpt-oss-20', // or use 'gpt20' alias
    prompt: 'Explain how large language models work in simple terms',
  });
  
  console.log(response.response);
}

generateText();
```

### Streaming Response with GPT-OSS 120

```typescript
import { OllamaClient } from 'tekimax-sdk';

const client = new OllamaClient();

async function streamResponse() {
  const response = await client.models.generate({
    model: 'gpt-oss-120', // or use 'gpt120' or '120' alias
    prompt: 'Write a short story about a robot learning to paint',
    stream: true
  });
  
  // Process the stream
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());
    for (const line of lines) {
      const data = JSON.parse(line);
      process.stdout.write(data.response || '');
    }
  }
}

streamResponse();
```

### Creating Embeddings with GPT-OSS

```typescript
import { OllamaClient } from 'tekimax-sdk';

const client = new OllamaClient();

async function createEmbedding() {
  const embedding = await client.embeddings.create({
    model: 'gpt-oss-20', // Both models support embeddings
    input: 'This is a sentence I want to convert to a vector embedding',
  });
  
  console.log(`Embedding dimension: ${embedding.embeddings[0].length}`);
  console.log(`First few values: ${embedding.embeddings[0].slice(0, 5)}`);
}

createEmbedding();
```

## Configuration

### Custom Ollama Server

```typescript
import { OllamaClient } from 'tekimax-sdk';

const client = new OllamaClient({
  baseUrl: 'http://your-ollama-server:11434',
});
```

### Advanced Generation Options

```typescript
import { OllamaClient } from 'tekimax-sdk';

const client = new OllamaClient();

async function advancedGeneration() {
  // GPT-OSS 120 has more advanced capabilities
  const response = await client.models.generate({
    model: 'gpt-oss-120',
    prompt: 'Write a poem about the ocean',
    system: 'You are a poet who specializes in nature poetry',
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    num_predict: 500, // GPT-OSS 120 supports longer outputs
    stop: ['END']
  });
  
  console.log(response.response);
}

// Show available models
async function listSupportedModels() {
  const models = client.models.getSupportedModels();
  console.log('Supported Models:', models);
  console.log('Default Model:', client.models.getDefaultModel());
}

advancedGeneration();
listSupportedModels();
```

## Model Comparison

| Feature | GPT-OSS 20 | GPT-OSS 120 |
|---------|------------|-------------|
| Parameters | 20B | 120B |
| Context Length | 8,192 tokens | 32,768 tokens |
| Max Output | 4,096 tokens | 16,384 tokens |
| Fine-tuning | ✓ | ✓ |
| Embeddings | ✓ | ✓ |
| Speed | Faster | Slower |
| Quality | Good | Excellent |

## Next Steps

- Try the [Interactive Tutorial](./tutorial.md) to explore GPT-OSS features
- Check the [API Reference](./api-reference.md) for detailed documentation
- Learn about [Model Configuration](./configuration.md) for optimizing performance 