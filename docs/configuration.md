# Advanced Configuration

This document covers advanced configuration options for the @tekimax/ollama-sdk.

## SDK Configuration

When initializing the SDK, you can provide various configuration options:

```typescript
import { OllamaKit } from '@tekimax/ollama-sdk';

const ollama = new OllamaKit({
  // Base URL of the Ollama API server
  host: 'http://localhost:11434',
  
  // Request timeout in milliseconds
  timeout: 60000,
  
  // Custom headers to include with all requests
  headers: {
    'X-Custom-Header': 'value',
  },
  
  // Enable debug logging
  debug: true,
});
```

## Connection Options

### Remote Ollama Servers

You can connect to a remote Ollama server by specifying the host:

```typescript
const ollama = new OllamaKit({
  host: 'http://ollama.your-domain.com:11434',
});
```

### Secure Connections

For HTTPS connections:

```typescript
const ollama = new OllamaKit({
  host: 'https://ollama.your-domain.com',
});
```

### Custom Headers

Add authentication or other custom headers:

```typescript
const ollama = new OllamaKit({
  host: 'http://ollama.your-domain.com:11434',
  headers: {
    'Authorization': 'Bearer your-token',
  },
});
```

## Generation Parameters

When generating text, you can fine-tune the output with these parameters:

```typescript
const response = await ollama.generate({
  model: 'llama2',
  prompt: 'Write a poem about the moon',
  
  // Control randomness (0.0-1.0)
  // Higher values make output more random, lower values more deterministic
  temperature: 0.7,
  
  // Nucleus sampling - consider tokens comprising the top_p probability mass (0.0-1.0)
  // Higher values consider more tokens, making output more diverse
  top_p: 0.9,
  
  // Top-k sampling - consider top k most probable tokens (1-100)
  // Lower values focus on most likely tokens
  top_k: 40,
  
  // Number of tokens to predict
  num_predict: 100,
  
  // Stop sequences - model will stop generating when it hits these strings
  stop: ['END', '###'],
  
  // System prompt to guide the model's behavior
  system: 'You are a poet who writes in the style of Emily Dickinson',
  
  // Custom template for prompt formatting
  template: '{{.System}}\n\nUser: {{.Prompt}}\n\nAssistant:',
  
  // Previous conversation context (token ids from previous interaction)
  context: [123, 456, 789],
  
  // Get raw model output instead of just the generated response
  raw: true,
  
  // Request output in specific format (json, md)
  format: 'json',
});
```

## Handling Errors and Retries

For advanced error handling with retries:

```typescript
import { OllamaKit, OllamaError } from '@tekimax/ollama-sdk';

const ollama = new OllamaKit();

async function generateWithRetry(options, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await ollama.generate(options);
    } catch (error) {
      attempt++;
      
      if (error instanceof OllamaError) {
        // Handle specific error types
        if (error.status === 429) {
          // Rate limiting - wait before retry
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Rate limited, waiting ${delay}ms before retry ${attempt}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (error.status === 404) {
          // Model not found, try fallback model
          console.log(`Model not found, trying fallback model`);
          options.model = 'llama2'; // Fallback model
          continue;
        }
      }
      
      if (attempt >= maxRetries) {
        throw error;
      }
      
      // General retry with exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Error: ${error.message}. Retrying in ${delay}ms (${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
generateWithRetry({
  model: 'mistral',
  prompt: 'Explain quantum computing',
});
```

## Streaming Optimizations

For handling large streaming responses efficiently:

```typescript
// Basic streaming
const stream = await ollama.generateStream({
  model: 'llama2',
  prompt: 'Write a long story about a space adventure',
});

let fullResponse = '';
for await (const chunk of stream) {
  process.stdout.write(chunk.response);
  fullResponse += chunk.response;
}

// Advanced streaming with backpressure handling
async function processStreamWithBackpressure(options) {
  const stream = await ollama.generateStream(options);
  
  let buffer = '';
  const processingDelay = 50; // ms
  let lastProcess = Date.now();
  
  for await (const chunk of stream) {
    buffer += chunk.response;
    
    // Process in chunks to avoid overwhelming UI
    const now = Date.now();
    if (now - lastProcess > processingDelay || chunk.done) {
      // Process buffer (e.g., update UI)
      processBuffer(buffer);
      buffer = '';
      lastProcess = now;
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
```

## CLI Configuration

The CLI tool can be configured with environment variables:

```bash
# Set default Ollama host
export OLLAMA_HOST=http://my-ollama-server:11434

# Set default model
export OLLAMA_DEFAULT_MODEL=mistral

# Enable debug mode
export OLLAMA_DEBUG=true

# Now run commands without specifying host/model
npx @tekimax/ollama-sdk generate -p "Hello there"
```

You can also create a configuration file in your home directory:

```json
// ~/.ollama-sdk-config.json
{
  "host": "http://my-ollama-server:11434",
  "defaultModel": "mistral",
  "debug": true,
  "timeout": 120000
}
```

## Advanced Use Cases

### Running Models in a Docker Container

If using Ollama in Docker:

```bash
# Start Ollama in Docker
docker run -d -p 11434:11434 --name ollama ollama/ollama

# Connect SDK to Docker instance
const ollama = new OllamaKit({
  host: 'http://localhost:11434',
});
```

### Node.js Worker Threads

For handling intensive operations in separate threads:

```typescript
import { Worker } from 'worker_threads';

function runGenerationInWorker(options) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./generation-worker.js', {
      workerData: options
    });
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// In generation-worker.js
import { parentPort, workerData } from 'worker_threads';
import { OllamaKit } from '@tekimax/ollama-sdk';

async function generate() {
  const ollama = new OllamaKit();
  const result = await ollama.generate(workerData);
  parentPort.postMessage(result);
}

generate().catch(err => parentPort.postMessage({ error: err.message }));
```

## Performance Tuning

For optimal performance with the SDK:

1. **Connection Reuse** - Create a single SDK instance and reuse it
2. **Batch Processing** - For multiple operations, process in parallel with Promise.all
3. **Stream Processing** - For large responses, use streaming to process incrementally
4. **Model Selection** - Choose smaller models for faster response times
5. **Context Management** - Reuse context tokens to avoid reprocessing previous conversation 