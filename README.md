# tekimax-sdk

![npm](https://img.shields.io/npm/v/tekimax-sdk)
![License](https://img.shields.io/npm/l/tekimax-sdk)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)

> A modern TypeScript SDK for working with Large Language Models

<div align="center">
  <img src="https://raw.githubusercontent.com/TEKIMAX/ollama-js-sdk/main/assets/tekimax-logo.png" alt="Tekimax Logo" width="300"/>
</div>

## Disclaimer

**This SDK is not affiliated with or endorsed by any Large Language Model provider.** The `tekimax-sdk` was created independently to support educational workshops and promote AI literacy. It is designed primarily for teaching purposes, workshops, and helping developers learn about AI and LLM technology. We are actively looking for partnerships and collaborations to make this SDK more robust for AI literacy initiatives.

## About This SDK

The Tekimax SDK is a versatile toolkit for working with Large Language Models. Currently, it interfaces with Ollama API for local model execution, but we have plans to expand support for:

- OpenAI models
- Claude by Anthropic 
- Gemini by Google
- Meta's Llama models
- Mistral AI
- Cohere
- Other leading LLM providers

This makes it ideal for educational environments where flexibility and vendor independence are important.

## Features

✨ Full TypeScript support with complete type definitions  
🚀 Promise-based API with async/await pattern  
📦 Modular architecture for tree-shaking  
🔄 Streaming response support  
📊 Built-in embedding and vector operations  
💻 Command-line interface included  
🎓 Interactive tutorial mode for beginners  

## Educational Purpose

This SDK was created with the following goals:
- Providing learning materials for AI workshops
- Supporting classroom instruction on LLM capabilities
- Helping developers gain hands-on experience with AI
- Promoting AI literacy through practical examples
- Facilitating research and experimentation with local models

## Installation

```bash
# Using npm
npm install tekimax-sdk

# Using yarn
yarn add tekimax-sdk

# Using pnpm
pnpm add tekimax-sdk

# Using bun (recommended)
bun add tekimax-sdk
```

## Quick Start

```typescript
import { OllamaClient } from 'tekimax-sdk';

// Initialize client (currently using Ollama API)
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

The SDK includes a CLI for common operations. Access it via `npx @tekimax/ollama-sdk` or by installing it globally.

### Global Installation

```bash
# Install globally
npm install -g tekimax-sdk

# Now you can use it directly
tekimax-sdk help
```

### Complete Command Reference

The CLI provides the following commands:

#### `list` - List available models

Lists all models currently available in your local Ollama instance.

```bash
npx tekimax-sdk list [options]
```

Options:
- `--host`, `-h`: Ollama host URL (default: http://localhost:11434)

Example:
```bash
npx tekimax-sdk list
npx tekimax-sdk list --host http://remote-ollama:11434
```

#### `generate` - Generate text from a prompt

Generate text from a prompt using a specified model.

```bash
npx tekimax-sdk generate [options]
```

Options:
- `--model`, `-m`: Model name (default: llama2)
- `--prompt`, `-p`: Input prompt
- `--stream`, `-s`: Stream response in real-time
- `--temperature`, `-t`: Temperature for generation (0.0-1.0)
- `--top-p`: Top-p sampling (0.0-1.0)
- `--host`, `-h`: Ollama host URL (default: http://localhost:11434)

Example:
```bash
npx tekimax-sdk generate --model llama2 --prompt "Write a short story" --stream
npx tekimax-sdk generate -m mistral -p "Explain quantum computing" -s -t 0.7
```

#### `embed` - Create embeddings from text

Create vector embeddings from input text.

```bash
npx tekimax-sdk embed [options]
```

Options:
- `--model`, `-m`: Model name (default: llama2)
- `--prompt`, `-p`: Input text
- `--host`, `-h`: Ollama host URL (default: http://localhost:11434)

Example:
```bash
npx tekimax-sdk embed --model nomic-embed-text --prompt "Semantic representation"
```

#### `pull` - Pull a new model

Download a model from Ollama's model library.

```bash
npx tekimax-sdk pull [options]
```

Options:
- `--model`, `-m`: Model name to pull
- `--host`, `-h`: Ollama host URL (default: http://localhost:11434)
- `--insecure`: Allow insecure connections when downloading models

Example:
```bash
npx @tekimax/ollama-sdk pull --model mistral
npx @tekimax/ollama-sdk pull -m llama2:13b
```

#### `show` - Show model information

Display detailed information about a specific model.

```bash
npx @tekimax/ollama-sdk show [options]
```

Options:
- `--model`, `-m`: Model name
- `--host`, `-h`: Ollama host URL (default: http://localhost:11434)

Example:
```bash
npx @tekimax/ollama-sdk show --model llama2
```

#### `remove` - Remove a model

Delete a model from your local Ollama instance.

```bash
npx @tekimax/ollama-sdk remove [options]
```

Options:
- `--model`, `-m`: Model name to remove
- `--host`, `-h`: Ollama host URL (default: http://localhost:11434)

Example:
```bash
npx @tekimax/ollama-sdk remove --model unused-model
```

#### `tutorial` - Run interactive tutorial

Launch an interactive tutorial that guides you through using the SDK.

```bash
npx @tekimax/ollama-sdk tutorial [options]
```

Options:
- `--host`, `-h`: Ollama host URL (default: http://localhost:11434)

Example:
```bash
npx @tekimax/ollama-sdk tutorial
```

#### `help` - Show help message

Display the help message with command reference.

```bash
npx @tekimax/ollama-sdk help
```

### Interactive Tutorial

The SDK provides an interactive tutorial mode that guides new users through its features:

```bash
npx @tekimax/ollama-sdk tutorial
```

> For a complete tutorial walkthrough, check out [the detailed tutorial guide](./docs/tutorial.md).

The tutorial guides you through a menu-based interface where you can explore different features:

#### Tutorial Options

1. **List Available Models**
   ```bash
   # Equivalent command
   npx @tekimax/ollama-sdk list
   
   # Expected output
   📚 Available Models:
   • llama2:latest (3.56 GB)
   • mistral:latest (3.83 GB)
   • orca-mini:latest (1.84 GB)
   • [other models...]
   ```

2. **Generate Text**
   ```bash
   # Equivalent command
   npx @tekimax/ollama-sdk generate -m llama2 -p "Write a short story" -s
   
   # Expected output
   🤖 Model: llama2
   💬 Prompt: Write a short story
   ✔ Generation started!
   [Generated text will appear here with streaming output]
   ```

3. **Create Embeddings**
   ```bash
   # Equivalent command
   npx @tekimax/ollama-sdk embed -m nomic-embed-text -p "Semantic representation"
   
   # Expected output
   🔤 Embedding Text: Semantic representation
   ✔ Embeddings created successfully!
   📊 Embedding (768 dimensions):
   First 5 values: [0.547358, 1.275857, -3.502294, ...]
   ```

4. **Pull a New Model**
   ```bash
   # Equivalent command
   npx @tekimax/ollama-sdk pull -m mistral
   
   # Expected output (with progress updates)
   🔄 Pulling model: mistral
   Downloading mistral... 25%
   Downloading mistral... 50%
   Downloading mistral... 75%
   Processing mistral...
   ✔ Model mistral pulled successfully!
   ```
   
   The tutorial provides recommendations for popular models:
   - llama2 - Meta's Llama 2 model
   - mistral - Mistral 7B model
   - codellama - Code-optimized version of Llama
   - orca-mini - Lightweight model for resource-constrained environments

5. **Show Model Details**
   ```bash
   # Equivalent command
   npx @tekimax/ollama-sdk show -m llama2
   
   # Expected output
   📝 Model Details:
   Name: llama2
   License: [license information]
   Size: 3.56 GB
   
   📄 Modelfile:
   [modelfile content if available]
   ```

6. **Tutorial Tips & Tricks**

   The tutorial also provides helpful tips on:
   - Working with specific model versions (e.g., `llama2:13b`)
   - Using shortened command flags (`-m`, `-p`, `-s`)
   - Connecting to remote servers
   - Controlling generation parameters
   - Common troubleshooting steps

#### Features of the Interactive Tutorial

- **Step-by-step guidance** with clear instructions for each feature
- **Interactive prompts** for selecting models and parameters
- **Real-time demonstrations** of SDK capabilities
- **Visual feedback** with loading animations and color-coded output
- **Equivalent commands** shown for each operation
- **Error handling** with user-friendly explanations
- **Helpful tips** for advanced usage scenarios

The tutorial is perfect for new users who want to understand the SDK's capabilities before integrating it into their applications or scripts. You can exit the tutorial at any time by typing "exit" at any prompt or selecting the exit option from the menu.

### Working with Models

```bash
# List available models with size information
npx @tekimax/ollama-sdk list

# Pull a new model (e.g., mistral)
npx @tekimax/ollama-sdk pull --model mistral

# Pull a specific model version
npx @tekimax/ollama-sdk pull --model codellama:7b-instruct

# Check if a model exists 
npx @tekimax/ollama-sdk show --model llama2

# Remove a model
npx @tekimax/ollama-sdk remove --model unused-model
```

### Text Generation Examples

```bash
# Basic text generation
npx @tekimax/ollama-sdk generate --model llama2 --prompt "Write a short poem about AI"

# Stream the response for better UX
npx @tekimax/ollama-sdk generate --model llama2 --prompt "Explain TypeScript to a beginner" --stream

# Using a different model
npx @tekimax/ollama-sdk generate --model mistral --prompt "What is quantum computing?"

# Adjust generation parameters
npx @tekimax/ollama-sdk generate --model llama2 --prompt "Create a story" --temperature 0.7 --top-p 0.9
```

### Advanced Usage

```bash
# Connect to a remote Ollama server
npx @tekimax/ollama-sdk list --host http://my-ollama-server:11434

# Save generated text to a file
npx @tekimax/ollama-sdk generate --model llama2 --prompt "Write an essay" > essay.txt

# Process multiple prompts from a file
cat prompts.txt | while read prompt; do
  npx @tekimax/ollama-sdk generate --model llama2 --prompt "$prompt"
done > responses.txt
```

### Troubleshooting

If you encounter issues with the CLI commands, try these troubleshooting steps:

1. **Model not found after pulling**
   - Verify the model name is correct (case-sensitive)
   - Check your Ollama server is running (`ps aux | grep ollama`)
   - Restart the Ollama service

2. **Error removing models**
   - Ensure no active generations are using the model
   - Check for proper permissions in the Ollama directory

3. **Connection issues**
   - Verify Ollama is running at the specified host
   - Check network permissions if using a remote host
   - Try with the `--insecure` flag for remote hosts with self-signed certificates

4. **Performance issues**
   - Check available system resources (memory, disk space)
   - Consider using smaller models if resources are limited

## OpenAI Compatibility

The SDK includes an OpenAI compatibility layer that allows you to use Ollama models with applications designed for the OpenAI API.

> **Note:** OpenAI compatibility is experimental and subject to changes.

### Using the Compatibility Layer

You can set up an OpenAI-compatible server with just a few lines of code:

```javascript
const express = require('express');
const { OllamaClient } = require('@tekimax/ollama-sdk');

const app = express();
app.use(express.json());

const client = new OllamaClient();
client.openai.setupEndpoints(app);

app.listen(3000, () => {
  console.log('OpenAI compatibility server running on http://localhost:3000');
});
```

### Supported Endpoints

- `/v1/chat/completions`: Chat model interactions
- `/v1/completions`: Traditional completions 
- `/v1/embeddings`: Vector embeddings
- `/v1/models`: List available models
- `/v1/models/{model}`: Get model info

### Example with OpenAI Client

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:3000/v1/',
  apiKey: 'ollama', // Required but not used
});

// Chat completions
const chatResponse = await openai.chat.completions.create({
  model: 'llama3.2',
  messages: [{ role: 'user', content: 'Hello, how are you?' }],
});

// Streaming
const stream = await openai.chat.completions.create({
  model: 'llama3.2',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}

// Vision API
const visionResponse = await openai.chat.completions.create({
  model: 'llava',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What\'s in this image?' },
        {
          type: 'image_url',
          image_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...' // Base64 image
        }
      ]
    }
  ]
});

// Embeddings
const embeddings = await openai.embeddings.create({
  model: 'all-minilm',
  input: ['Why is the sky blue?', 'How do birds fly?'],
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [TEKIMAX](https://github.com/TEKIMAX)

## Documentation

The SDK comes with comprehensive documentation:

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [Interactive Tutorial Guide](./docs/tutorial.md)
- [OpenAI Compatibility](./docs/openai-compatibility.md)
- [Advanced Configuration](./docs/configuration.md)

You can also find inline code documentation with detailed JSDoc comments throughout the source code.