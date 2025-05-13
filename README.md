# @tekimax/ollama-sdk

![npm](https://img.shields.io/npm/v/@tekimax/ollama-sdk)
![License](https://img.shields.io/npm/l/@tekimax/ollama-sdk)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)

> A modern TypeScript SDK for interacting with Ollama API

<div align="center">
  <img src="https://raw.githubusercontent.com/TEKIMAX/ollama-js-sdk/main/assets/tekimax-logo.png" alt="Tekimax Logo" width="300"/>
</div>

## Features

✨ Full TypeScript support with complete type definitions  
🚀 Promise-based API with async/await pattern  
📦 Modular architecture for tree-shaking  
🔄 Streaming response support  
📊 Built-in embedding and vector operations  
💻 Command-line interface included  

## Installation

```bash
# Using npm
npm install @tekimax/ollama-sdk

# Using yarn
yarn add @tekimax/ollama-sdk

# Using pnpm
pnpm add @tekimax/ollama-sdk

# Using bun (recommended)
bun add @tekimax/ollama-sdk
```

## Quick Start

```typescript
import { OllamaClient } from '@tekimax/ollama-sdk';

// Initialize client
const client = new OllamaClient({
  baseUrl: 'http://localhost:11434' // Default Ollama server URL
});

// Generate text
const response = await client.models.generate({
  model: 'llama2',
  prompt: 'Explain quantum computing in simple terms'
});

console.log(response.response);

// Work with streaming responses
const streamingResponse = await client.models.generate({
  model: 'llama2',
  prompt: 'Write a short story',
  stream: true
});

for await (const chunk of StreamParser.parse(streamingResponse)) {
  process.stdout.write(chunk.response);
}
```

## API Reference

### OllamaClient

The main client for interacting with the Ollama API.

```typescript
const client = new OllamaClient({
  baseUrl: 'http://localhost:11434' // Default Ollama server URL
  // Note: The standard Ollama API doesn't require an API key for local usage
});
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `baseUrl` | string | Yes | The URL of your Ollama server |
| `apiKey` | string | No | API key (only needed for custom setups requiring auth) |

### ModelManager

For working with Ollama models.

```typescript
// List available models
const models = await client.models.list();

// Generate text
const response = await client.models.generate({
  model: 'llama2',
  prompt: 'Hello, world!'
});

// Pull a model
await client.models.pull('llama2');
```

### EmbeddingsManager

For creating and working with embeddings.

```typescript
// Create embeddings
const embedding = await client.embeddings.create({
  model: 'llama2',
  prompt: 'Semantic text representation'
});

// Calculate similarity between embeddings
const similarity = client.embeddings.calculateSimilarity(embedding1, embedding2);
```

## Command Line Interface

The SDK includes a CLI for common operations:

```bash
# List models
npx @tekimax/ollama-sdk list

# Generate text
npx @tekimax/ollama-sdk generate --model llama2 --prompt "Hello AI" --stream

# Create embeddings
npx @tekimax/ollama-sdk embed --model llama2 --prompt "Vector representation"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [TEKIMAX](https://github.com/TEKIMAX)