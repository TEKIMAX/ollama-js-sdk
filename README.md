# Ollama JavaScript SDK

A comprehensive TypeScript SDK for interacting with the Ollama API, providing a clean interface for working with large language models.

## Installation

```bash
npm install @tekimax/ollama-sdk
```

Or using Yarn:

```bash
yarn add @tekimax/ollama-sdk
```

Or using Bun:

```bash
bun add @tekimax/ollama-sdk
```

## Prerequisites

- Node.js 16 or higher
- Ollama installed and running on your machine or accessible server

## Quick Start

```typescript
import { OllamaClient } from '@tekimax/ollama-sdk';

const client = new OllamaClient();

// Generate text
async function generateText() {
  const response = await client.models.generate({
    model: 'llama2',
    prompt: 'Write a short poem about AI',
    stream: false
  });
  
  console.log(response.response);
}

// List available models
async function listModels() {
  const models = await client.models.list();
  console.log(models);
}

// Create embeddings
async function createEmbedding() {
  const embedding = await client.embeddings.create({
    model: 'llama2',
    prompt: 'This is a sample text for embedding'
  });
  
  console.log(`Embedding dimensions: ${embedding.embedding.length}`);
}

// Run examples
generateText().catch(console.error);
```

## Features

- **Complete API Coverage**: Access all Ollama API endpoints through a clean interface
- **Model Management**: List, pull, push, create, and delete models
- **Text Generation**: Generate completions with full parameter control
- **Embeddings**: Create and manipulate vector embeddings
- **Fine-tuning**: Fine-tune models with custom datasets
- **Streaming Support**: Handle streaming responses with a convenient parser
- **CLI Interface**: Use the SDK from the command line

## CLI Command Reference

Here's a complete list of CLI commands available in the SDK:

```bash
# Show help information
npx ollama-sdk help

# List all available models
npx ollama-sdk list

# Generate text with default model (llama2)
npx ollama-sdk generate --prompt "Write a short story about AI"

# Generate text with a specific model
npx ollama-sdk generate --model mistral --prompt "Explain quantum computing"

# Stream the response token by token
npx ollama-sdk generate --model llama2 --prompt "Write a poem" --stream

# Create embeddings for text analysis
npx ollama-sdk embed --model llama2 --prompt "This is a sample text"

# Connect to a custom Ollama server
npx ollama-sdk list --host http://my-ollama-server:11434
```

## CLI Tutorial: Getting Started

### Step 1: Install the SDK

```bash
npm install -g @tekimax/ollama-sdk
```

### Step 2: Check Available Models

First, let's see what models are available on your Ollama instance:

```bash
ollama-sdk list
```

Output:
```
Available models:
- llama2 (3.82 GB)
- mistral (4.10 GB)
- ...
```

### Step 3: Generate Text

Generate a completion using a simple prompt:

```bash
ollama-sdk generate --model llama2 --prompt "What are the benefits of quantum computing?"
```

For a better user experience with longer responses, try using the streaming flag:

```bash
ollama-sdk generate --model llama2 --prompt "Write a short blog post about AI ethics" --stream
```

### Step 4: Work with Embeddings

Create vector embeddings for semantic analysis:

```bash
ollama-sdk embed --model llama2 --prompt "Artificial intelligence is revolutionizing industries"
```

Output:
```
Creating embedding with model: llama2
Text: Artificial intelligence is revolutionizing industries
Embedding (4096 dimensions):
[0.123, -0.456, 0.789, 0.012, -0.345...]
```

### Step 5: Using Shortcuts

All commands support shorthand options:

```bash
# Using shortcuts
ollama-sdk generate -m llama2 -p "Hello world" -s

# Equivalent to
ollama-sdk generate --model llama2 --prompt "Hello world" --stream
```

### Step 6: Custom Server

Connect to a remote Ollama server:

```bash
ollama-sdk list -h http://remote-server:11434
```

### Advanced Usage: Shell Pipelines

You can use the CLI in shell pipelines for more complex workflows:

```bash
# Generate a text file from a prompt
ollama-sdk generate -m llama2 -p "Write a story" > story.txt

# Generate text from a file input
cat prompt.txt | xargs ollama-sdk generate -m llama2 -p

# Process multiple prompts in batch
cat prompts.txt | while read prompt; do ollama-sdk generate -m llama2 -p "$prompt"; done > responses.txt
```

## API Reference

### OllamaClient

The main client for interacting with the Ollama API.

```typescript
const client = new OllamaClient({
  baseUrl: 'http://localhost:11434', // Default Ollama server URL
  apiKey: 'your-api-key' // Optional
});
```

### Models

Access model-related operations through `client.models`.

```typescript
// List all models
const models = await client.models.list();

// Show model details
const details = await client.models.show({ name: 'llama2' });

// Generate text
const response = await client.models.generate({
  model: 'llama2',
  prompt: 'Hello, world!',
  stream: false
});

// Pull a model
await client.models.pull({ name: 'llama2' });

// Push a model
await client.models.push({ name: 'my-custom-model' });

// Delete a model
await client.models.delete({ name: 'unused-model' });
```

### Embeddings

Create and manipulate vector embeddings through `client.embeddings`.

```typescript
// Create an embedding
const embedding = await client.embeddings.create({
  model: 'llama2',
  prompt: 'Text to embed'
});

// Calculate similarity between embeddings
const similarity = client.embeddings.calculateCosineSimilarity(
  embedding1,
  embedding2
);
```

### Fine-tuning

Fine-tune models with custom datasets through `client.fineTuning`.

```typescript
// Fine-tune a model
const result = await client.fineTuning.create({
  model: 'llama2',
  targetModel: 'my-custom-llama',
  dataset: './training-data.jsonl',
  parameters: {
    epochs: 3,
    learningRate: 1e-5
  }
});

// Format conversation dataset
const formattedData = client.fineTuning.formatConversationDataset([
  { prompt: 'What is machine learning?', response: 'Machine learning is...' },
  { prompt: 'What is deep learning?', response: 'Deep learning is...' }
]);
```

### Stream Parser

Parse streaming responses from the Ollama API.

```typescript
// Generate streaming response
const response = await client.models.generate({
  model: 'llama2',
  prompt: 'Write a story',
  stream: true
});

// Parse the stream
for await (const chunk of StreamParser.parse(response)) {
  process.stdout.write(chunk.response || '');
}

// Or collect the full text
const fullText = await StreamParser.collectFullText(response);
```

## Educational Uses

This SDK is designed to be an effective educational tool for learning about LLMs:

- **Workshops & Tutorials**: Use the SDK to demonstrate LLM capabilities
- **Classroom Settings**: Teach concepts like embeddings and fine-tuning
- **Self-learning**: Experiment with different models and parameters

## Examples

### Embeddings and Semantic Similarity

```typescript
async function compareSimilarity() {
  const text1 = "Artificial intelligence is transforming industries";
  const text2 = "AI technologies are changing how businesses operate";
  
  const embedding1 = await client.embeddings.create({
    model: 'llama2',
    prompt: text1
  });
  
  const embedding2 = await client.embeddings.create({
    model: 'llama2',
    prompt: text2
  });
  
  const similarity = client.embeddings.calculateCosineSimilarity(
    embedding1.embedding,
    embedding2.embedding
  );
  
  console.log(`Similarity score: ${similarity}`);
  // Outputs a value between -1 and 1, where 1 indicates identical meaning
}
```

### Fine-tuning a Model

```typescript
async function fineTuneModel() {
  const trainingData = [
    { input: "What is your favorite color?", output: "My favorite color is blue." },
    { input: "Where are you located?", output: "I'm based in Silicon Valley." },
    { input: "What services do you offer?", output: "I offer AI consulting and development services." }
  ];
  
  const result = await client.fineTuning.create({
    model: 'llama2',
    targetModel: 'my-custom-assistant',
    dataset: trainingData
  });
  
  console.log(`Fine-tuning status: ${result.status}`);
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Disclaimer

This SDK is not affiliated with or endorsed by Ollama. It is an independent project developed by Tekimax LLC for educational purposes.