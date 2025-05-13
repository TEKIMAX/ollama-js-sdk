# Getting Started with Ollama SDK

This guide will help you get up and running with the @tekimax/ollama-sdk.

## Prerequisites

- Node.js 16 or later
- Ollama installed and running locally (or remote Ollama server accessible)

## Installation

Install the SDK using npm, yarn, or bun:

```bash
# Using npm
npm install @tekimax/ollama-sdk

# Using yarn
yarn add @tekimax/ollama-sdk

# Using bun
bun add @tekimax/ollama-sdk
```

## Quick Start

### Basic Text Generation

```typescript
import { OllamaKit } from '@tekimax/ollama-sdk';

const ollama = new OllamaKit();

async function generateText() {
  const response = await ollama.generate({
    model: 'llama2',
    prompt: 'Explain how large language models work in simple terms',
  });
  
  console.log(response.response);
}

generateText();
```

### Streaming Response

```typescript
import { OllamaKit } from '@tekimax/ollama-sdk';

const ollama = new OllamaKit();

async function streamResponse() {
  const stream = await ollama.generateStream({
    model: 'llama2',
    prompt: 'Write a short story about a robot learning to paint',
  });
  
  for await (const chunk of stream) {
    process.stdout.write(chunk.response);
  }
}

streamResponse();
```

### Creating Embeddings

```typescript
import { OllamaKit } from '@tekimax/ollama-sdk';

const ollama = new OllamaKit();

async function createEmbedding() {
  const embedding = await ollama.createEmbedding({
    model: 'nomic-embed-text',
    prompt: 'This is a sentence I want to convert to a vector embedding',
  });
  
  console.log(`Embedding dimension: ${embedding.embedding.length}`);
  console.log(`First few values: ${embedding.embedding.slice(0, 5)}`);
}

createEmbedding();
```

## Configuration

### Custom Ollama Server

```typescript
import { OllamaKit } from '@tekimax/ollama-sdk';

const ollama = new OllamaKit({
  host: 'http://your-ollama-server:11434',
});
```

### Advanced Generation Options

```typescript
import { OllamaKit } from '@tekimax/ollama-sdk';

const ollama = new OllamaKit();

async function advancedGeneration() {
  const response = await ollama.generate({
    model: 'llama2',
    prompt: 'Write a poem about the ocean',
    system: 'You are a poet who specializes in nature poetry',
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    num_predict: 100,
    stop: ['END']
  });
  
  console.log(response.response);
}

advancedGeneration();
```

## Next Steps

- Try the [Interactive Tutorial](./tutorial.md) to explore all features
- Check the [API Reference](./api-reference.md) for detailed documentation
- Explore [OpenAI Compatibility](./openai-compatibility.md) for migration from OpenAI 