# Ollama SDK Hands-On Workshop

This workshop provides a comprehensive, hands-on introduction to the @tekimax/ollama-sdk. By the end of this workshop, you'll have practical experience using both the command-line interface and the programmatic API for working with large language models through Ollama.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Part 1: CLI Basics](#part-1-cli-basics)
  - [Setting Up](#setting-up)
  - [Exploring Available Models](#exploring-available-models)
  - [Basic Text Generation](#basic-text-generation)
  - [Working with Parameters](#working-with-parameters)
  - [Creating Embeddings](#creating-embeddings)
  - [Managing Models](#managing-models)
  - [CLI Exercises](#cli-exercises)
- [Part 2: API Fundamentals](#part-2-api-fundamentals)
  - [SDK Installation](#sdk-installation)
  - [Basic Client Setup](#basic-client-setup)
  - [Text Generation API](#text-generation-api)
  - [Streaming Responses](#streaming-responses)
  - [Working with Embeddings](#working-with-embeddings)
  - [API Exercises](#api-exercises)
- [Part 3: Advanced Topics](#part-3-advanced-topics)
  - [Tool Calling with Models](#tool-calling-with-models)
  - [Tool Calling with the CLI](#tool-calling-with-the-cli)
  - [OpenAI Compatibility Layer](#openai-compatibility-layer)
  - [Error Handling and Retries](#error-handling-and-retries)
  - [Performance Optimization](#performance-optimization)
  - [Integrating with Web Applications](#integrating-with-web-applications)
  - [Advanced Exercises](#advanced-exercises)
- [Part 4: Real-World Projects](#part-4-real-world-projects)
  - [Building a Chat Application](#building-a-chat-application)
  - [Creating a Document Q&A System](#creating-a-document-qa-system)
  - [Semantic Search Implementation](#semantic-search-implementation)
  - [Final Project](#final-project)

## Prerequisites

Before starting this workshop, ensure you have:

- [Node.js](https://nodejs.org/) (v16 or later) installed
- [Ollama](https://ollama.ai/download) installed and running locally
- Basic familiarity with JavaScript/TypeScript and command-line operations
- A code editor (VS Code recommended)
- At least 8GB RAM (16GB+ recommended for larger models)
- Terminal or command prompt access

## Part 1: CLI Basics

This section focuses on using the command-line interface to interact with Ollama models.

### Setting Up

1. Install the Ollama SDK globally:

```bash
npm install -g @tekimax/ollama-sdk
```

2. Verify installation:

```bash
ollama-sdk help
```

You should see the help output with available commands and options.

### Exploring Available Models

Let's start by exploring what models are available in your Ollama installation:

```bash
ollama-sdk list
```

This command displays all models currently downloaded to your system, along with their sizes.

**Workshop Activity #1:**
1. Run the list command
2. Note which models are available
3. If you don't have any models yet, the list will be empty

### Basic Text Generation

Generate your first text using a model:

```bash
ollama-sdk generate -m llama2 -p "Explain quantum computing to a 5-year old"
```

If you don't have the llama2 model, replace it with any model from your list, or pull llama2 first:

```bash
ollama-sdk pull -m llama2
```

**Workshop Activity #2:**
1. Generate text with a simple prompt
2. Try different prompts and observe the responses
3. Note the response time and quality

### Working with Parameters

The CLI supports several parameters to control text generation:

```bash
# With streaming enabled
ollama-sdk generate -m llama2 -p "Write a poem about space" -s

# With temperature control (0.0-1.0)
ollama-sdk generate -m llama2 -p "Write a story" -t 0.7

# With top-p sampling
ollama-sdk generate -m llama2 -p "Brainstorm business ideas" --top-p 0.9
```

**Parameter Explanation:**

- `-m, --model`: The model to use (e.g., llama2, mistral)
- `-p, --prompt`: The input text prompt
- `-s, --stream`: Stream the response token-by-token instead of waiting for the complete response
- `-t, --temperature`: Controls randomness (0.0 = deterministic, 1.0 = maximum creativity)
- `--top-p`: Controls diversity through nucleus sampling (0.0-1.0)

**Workshop Activity #3:**
1. Compare output with different temperature settings:
   - Low temperature (0.2): More focused, deterministic responses
   - Medium temperature (0.5): Balanced randomness
   - High temperature (0.8): More creative, varied responses
2. Document the differences in outputs

### Creating Embeddings

Embeddings are vector representations of text that capture semantic meaning:

```bash
ollama-sdk embed -m nomic-embed-text -p "Artificial intelligence is transforming industries"
```

The output will be a high-dimensional vector (usually displayed as the first few values).

**Workshop Activity #4:**
1. Create embeddings for several related sentences
2. Create embeddings for unrelated sentences
3. Note the dimension of the embeddings (will vary based on model)

### Managing Models

You can download (pull), view details, and remove models:

```bash
# Pull a new model
ollama-sdk pull -m mistral

# Show details of a model
ollama-sdk show -m llama2

# Remove a model you no longer need
ollama-sdk remove -m unused-model
```

**Workshop Activity #5:**
1. Pull a small model like orca-mini (if not already present)
2. View its details with the show command
3. Compare the license and size information with another model

### CLI Exercises

**Exercise 1:** Text Comparison
1. Generate descriptions of the same topic with three different temperature settings
2. Compare how the outputs differ in style and content

**Exercise 2:** Model Comparison
1. Run the same prompt through 2-3 different models
2. Compare response quality, speed, and style

**Exercise 3:** Parameter Experimentation
1. Create a simple prompt
2. Generate responses with different combinations of temperature and top-p
3. Document which settings give the best results for your use case

## Part 2: API Fundamentals

This section covers using the Ollama SDK programmatically in JavaScript/TypeScript applications.

### SDK Installation

Create a new project directory and initialize:

```bash
mkdir ollama-workshop
cd ollama-workshop
npm init -y
npm install @tekimax/ollama-sdk
```

Create a basic test file:

```bash
touch test.js
```

### Basic Client Setup

Open test.js in your editor and add the following code:

```javascript
// test.js
const { OllamaKit } = require('@tekimax/ollama-sdk');

async function main() {
  // Initialize the client
  const ollama = new OllamaKit({
    // Default host is http://localhost:11434
  });
  
  console.log('Ollama client initialized');
  
  // List models
  const models = await ollama.listModels();
  console.log('Available models:');
  for (const model of models.models) {
    console.log(`- ${model.name} (${(model.size / 1024 / 1024 / 1024).toFixed(2)} GB)`);
  }
}

main().catch(console.error);
```

Run the script:

```bash
node test.js
```

**Workshop Activity #6:**
1. Run the script to list available models
2. Compare the output with the CLI list command result

### Text Generation API

Create a new file for text generation:

```bash
touch generate.js
```

Add code to generate text:

```javascript
// generate.js
const { OllamaKit } = require('@tekimax/ollama-sdk');

async function generateText() {
  const ollama = new OllamaKit();
  
  const result = await ollama.generate({
    model: 'llama2',
    prompt: 'Explain the basics of machine learning in simple terms',
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    num_predict: 200,
  });
  
  console.log('Generated Text:');
  console.log('---------------');
  console.log(result.response);
  console.log('---------------');
  console.log(`Total tokens: ${result.eval_count || 'N/A'}`);
  console.log(`Generation time: ${result.total_duration ? (result.total_duration / 1000000).toFixed(2) + 's' : 'N/A'}`);
}

generateText().catch(console.error);
```

Run the script:

```bash
node generate.js
```

**Parameter Reference:**

```typescript
{
  model: string,          // Model name
  prompt: string,         // Input prompt
  system?: string,        // System message to guide model behavior
  template?: string,      // Custom prompt template
  context?: number[],     // Previous token context
  raw?: boolean,          // Return raw model output
  format?: string,        // Request specific output format (e.g. 'json')
  temperature?: number,   // Randomness (0.0-1.0)
  top_p?: number,         // Nucleus sampling (0.0-1.0)
  top_k?: number,         // Top-k sampling (1-100)
  num_predict?: number,   // Maximum number of tokens to generate
  stop?: string[],        // Strings that will stop generation when produced
}
```

**Workshop Activity #7:**
1. Modify the generate.js script to use different parameters
2. Experiment with the system parameter to guide model behavior
3. Try using stop sequences to end generation at specific points

### Streaming Responses

For longer responses or better user experience, streaming is recommended:

```bash
touch stream.js
```

Add the following code:

```javascript
// stream.js
const { OllamaKit } = require('@tekimax/ollama-sdk');

async function streamText() {
  const ollama = new OllamaKit();
  
  console.log('Starting stream generation...');
  
  const stream = await ollama.generateStream({
    model: 'llama2',
    prompt: 'Write a short story about an AI learning to be creative',
    temperature: 0.8,
  });
  
  let fullText = '';
  
  // Process the stream
  for await (const chunk of stream) {
    process.stdout.write(chunk.response);
    fullText += chunk.response;
    
    // If this is the final chunk
    if (chunk.done) {
      console.log('\n\nGeneration complete!');
      console.log(`Total length: ${fullText.length} characters`);
    }
  }
}

streamText().catch(console.error);
```

Run the script:

```bash
node stream.js
```

**Workshop Activity #8:**
1. Run the streaming example
2. Modify it to include a progress indicator (e.g., token count)
3. Implement a way to save the streamed output to a file

### Working with Embeddings

Create a file for working with embeddings:

```bash
touch embeddings.js
```

Add code to create and compare embeddings:

```javascript
// embeddings.js
const { OllamaKit } = require('@tekimax/ollama-sdk');

async function workWithEmbeddings() {
  const ollama = new OllamaKit();
  
  // Define some example texts
  const texts = [
    "Artificial intelligence is transforming how we work",
    "Machine learning models require significant training data",
    "Today's weather is sunny and warm",
    "Climate change is affecting global weather patterns",
  ];
  
  // Create embeddings for all texts
  console.log('Creating embeddings...');
  const embeddings = [];
  
  for (const text of texts) {
    const result = await ollama.createEmbedding({
      model: 'nomic-embed-text', // Or another embedding model
      prompt: text,
    });
    
    embeddings.push({
      text,
      embedding: result.embedding,
    });
    
    console.log(`Created embedding for: "${text.substring(0, 30)}..."`);
  }
  
  // Calculate similarity between embeddings
  console.log('\nCalculating similarities:');
  
  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      const similarity = calculateCosineSimilarity(
        embeddings[i].embedding,
        embeddings[j].embedding
      );
      
      console.log(`Similarity between "${embeddings[i].text.substring(0, 20)}..." and "${embeddings[j].text.substring(0, 20)}...": ${similarity.toFixed(4)}`);
    }
  }
}

// Helper function to calculate cosine similarity
function calculateCosineSimilarity(vec1, vec2) {
  // Dot product
  let dotProduct = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
  }
  
  // Magnitudes
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  
  // Cosine similarity
  return dotProduct / (mag1 * mag2);
}

workWithEmbeddings().catch(console.error);
```

Run the script:

```bash
node embeddings.js
```

**Workshop Activity #9:**
1. Add more example texts to the embeddings script
2. Observe which texts have higher similarity scores
3. Create a simple function to find the most similar text to a query

### API Exercises

**Exercise 1:** Create a Simple Q&A System
1. Create a script that:
   - Takes a user question as input
   - Generates a response using the Ollama API
   - Formats and displays the answer

**Exercise 2:** Compare Embedding Models
1. Create embeddings for the same sentences using different models
2. Compare the dimensionality and similarity results

**Exercise 3:** Build a Simple Chat Application
1. Create a script that maintains conversation history
2. Send the conversation history with each new message
3. Implement a simple CLI chat interface

## Part 3: Advanced Topics

This section covers more advanced usage of the Ollama SDK.

### Tool Calling with Models

Many advanced LLMs now support tool or function calling capabilities, which allow the model to request the execution of external functions to access data or perform actions. The Ollama SDK provides support for this functionality.

Create a new file:

```bash
touch tool-calling.js
```

Add the following code:

```javascript
// tool-calling.js
const { OllamaKit } = require('@tekimax/ollama-sdk');

async function demonstrateToolCalling() {
  // Initialize the client
  const ollama = new OllamaKit();
  
  // Define tools (functions the model can call)
  const tools = [
    {
      type: "function",
      name: "get_weather",
      description: "Get the current weather for a location",
      parameters: {
        type: "object",
        required: ["location"],
        properties: {
          location: {
            type: "string",
            description: "The city name, e.g., 'San Francisco, CA'"
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "The unit of temperature"
          }
        }
      }
    }
  ];
  
  console.log('Calling model with tools...');
  
  try {
    // Call the model with tools
    const response = await ollama.tools.callWithTools({
      model: 'llama3', // Use a model that supports tool calling
      prompt: 'What is the weather like in New York?',
      tools: tools,
      temperature: 0.7
    });
    
    console.log('Model response:', response.message.content);
    
    // Check if the model wants to use tools
    if (response.message.tool_calls && response.message.tool_calls.length > 0) {
      console.log('The model requested to use tools:');
      
      const toolCalls = response.message.tool_calls;
      // In a real application, you would execute the tools here
      
      for (const toolCall of toolCalls) {
        console.log(`- Tool: ${toolCall.name}`);
        console.log(`  Input: ${JSON.stringify(toolCall.input, null, 2)}`);
        
        // Mock tool execution
        const toolResult = { 
          temperature: 72, 
          unit: "fahrenheit", 
          condition: "sunny" 
        };
        
        console.log(`  Result: ${JSON.stringify(toolResult, null, 2)}`);
        
        // Send tool results back to the model
        const followUpResponse = await ollama.tools.executeToolCalls(
          {
            model: 'llama3',
            prompt: 'What is the weather like in New York?',
            tools: tools
          },
          [toolCall],
          [{
            tool_call_id: toolCall.id,
            role: "tool",
            name: toolCall.name,
            content: JSON.stringify(toolResult)
          }]
        );
        
        console.log('Final response with tool results:', followUpResponse.message.content);
      }
    } else {
      console.log('No tools were called by the model.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

demonstrateToolCalling().catch(console.error);
```

Run the script:

```bash
node tool-calling.js
```

**Workshop Activity #14:**
1. Expand the tools with additional functions (e.g., search, calculator, etc.)
2. Create a streaming version of the tool calling example
3. Implement actual tool execution (e.g., using a weather API or other services)

### Tool Calling with the CLI

You can also use tool calling via the CLI:

```bash
# First, create a JSON file with tool definitions
echo '[
  {
    "type": "function",
    "name": "get_weather",
    "description": "Get the current weather for a location",
    "parameters": {
      "type": "object",
      "required": ["location"],
      "properties": {
        "location": {
          "type": "string",
          "description": "The city name, e.g., San Francisco, CA"
        }
      }
    }
  }
]' > weather-tools.json

# Then call the CLI with tools
ollama-sdk tools -m llama3 -p "What's the weather like in Tokyo?" --tools-file weather-tools.json
```

**Workshop Activity #15:**
1. Create a more complex tools JSON file with multiple functions
2. Experiment with different prompts to see when tools get called
3. Compare how different models use tool calling capability

### OpenAI Compatibility Layer

The Ollama SDK includes an OpenAI compatibility layer that allows you to use Ollama models with code designed for the OpenAI API.

Create a new file:

```bash
touch openai-compat.js
```

Add the following code:

```javascript
// openai-compat.js
const { OpenAICompatManager } = require('@tekimax/ollama-sdk/openai');

async function testOpenAICompat() {
  // Initialize the OpenAI-compatible client
  const openai = new OpenAICompatManager({
    host: 'http://localhost:11434', // Ollama server
    defaultModel: 'llama2',
  });
  
  console.log('OpenAI compatibility layer initialized');
  
  // List available models (OpenAI format)
  const models = await openai.models.list();
  console.log('Available models:');
  console.log(models.data.map(model => model.id));
  
  // Generate chat completion (OpenAI format)
  console.log('\nGenerating chat completion...');
  const completion = await openai.chat.completions.create({
    model: 'llama2', // Can use Ollama model names directly
    messages: [
      { role: 'system', content: 'You are a helpful assistant that provides concise answers.' },
      { role: 'user', content: 'What is the difference between supervised and unsupervised learning?' }
    ],
    temperature: 0.7,
  });
  
  console.log('\nResponse:');
  console.log(completion.choices[0].message.content);
  
  // Create embeddings (OpenAI format)
  console.log('\nCreating embedding...');
  const embedding = await openai.embeddings.create({
    model: 'nomic-embed-text',
    input: 'The quick brown fox jumps over the lazy dog',
  });
  
  console.log(`Created embedding with ${embedding.data[0].embedding.length} dimensions`);
  console.log(`First 5 values: [${embedding.data[0].embedding.slice(0, 5).join(', ')}]`);
}

testOpenAICompat().catch(console.error);
```

Run the script:

```bash
node openai-compat.js
```

**Workshop Activity #10:**
1. Run the OpenAI compatibility example
2. Compare the response format with regular Ollama API responses
3. If you have existing OpenAI code, try adapting it to use the compatibility layer

### Error Handling and Retries

Create a file to demonstrate robust error handling:

```bash
touch error-handling.js
```

Add the following code:

```javascript
// error-handling.js
const { OllamaKit } = require('@tekimax/ollama-sdk');

async function robustGeneration() {
  const ollama = new OllamaKit();
  
  try {
    // Attempt to use a model that doesn't exist
    const result = await generateWithRetry(ollama, {
      model: 'non-existent-model',
      prompt: 'Hello, world!',
    });
    
    console.log('Generated text:', result.response);
  } catch (error) {
    console.error('Final error after retries:', error.message);
  }
}

async function generateWithRetry(client, options, maxRetries = 3) {
  let attempt = 0;
  const fallbackModels = ['llama2', 'mistral', 'orca-mini'];
  
  while (attempt < maxRetries) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries} with model: ${options.model}`);
      return await client.generate(options);
    } catch (error) {
      attempt++;
      console.log(`Error: ${error.message}`);
      
      if (attempt >= maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      if (error.message.includes('model') && error.message.includes('not found')) {
        // Try a fallback model
        const fallbackIndex = attempt - 1;
        if (fallbackIndex < fallbackModels.length) {
          console.log(`Trying fallback model: ${fallbackModels[fallbackIndex]}`);
          options.model = fallbackModels[fallbackIndex];
          continue;
        }
      }
      
      // Add exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

robustGeneration().catch(console.error);
```

Run the script:

```bash
node error-handling.js
```

**Workshop Activity #11:**
1. Run the error handling example
2. Modify the fallback models list to match models you have installed
3. Add additional error handling for different types of errors

### Performance Optimization

Create a file to demonstrate performance optimizations:

```bash
touch performance.js
```

Add the following code:

```javascript
// performance.js
const { OllamaKit } = require('@tekimax/ollama-sdk');

async function performanceDemo() {
  console.log('Performance Optimization Demo');
  
  // Create a single client instance to reuse
  const ollama = new OllamaKit();
  
  // 1. Reusing context for continued conversations
  console.log('\n1. Context Reuse:');
  const contextDemo = await contextReuseDemo(ollama);
  
  // 2. Parallel processing for independent requests
  console.log('\n2. Parallel Processing:');
  await parallelProcessingDemo(ollama);
  
  // 3. Efficient streaming for large responses
  console.log('\n3. Efficient Streaming:');
  await efficientStreamingDemo(ollama);
}

async function contextReuseDemo(client) {
  console.log('Starting conversation with context reuse...');
  
  // First message
  const response1 = await client.generate({
    model: 'llama2',
    prompt: 'My name is Alice and I love hiking.',
    system: 'You are a helpful assistant that remembers user information.',
  });
  
  console.log('Response 1:', response1.response);
  console.log('Context size:', response1.context?.length || 'N/A');
  
  // Second message using the context from first response
  const response2 = await client.generate({
    model: 'llama2',
    prompt: 'What is my name and what do I enjoy doing?',
    context: response1.context, // Reuse context to maintain conversation
    system: 'You are a helpful assistant that remembers user information.',
  });
  
  console.log('Response 2:', response2.response);
  console.log('Context size:', response2.context?.length || 'N/A');
  
  return response2.context;
}

async function parallelProcessingDemo(client) {
  console.log('Processing multiple independent requests in parallel...');
  const startTime = Date.now();
  
  const prompts = [
    'Explain what is machine learning',
    'Write a haiku about programming',
    'What are the benefits of exercise',
    'Describe quantum computing briefly',
  ];
  
  // Process all prompts in parallel
  const results = await Promise.all(
    prompts.map(prompt => 
      client.generate({
        model: 'llama2',
        prompt,
        temperature: 0.7,
      })
    )
  );
  
  const endTime = Date.now();
  console.log(`Processed ${prompts.length} requests in ${(endTime - startTime) / 1000}s`);
  
  for (let i = 0; i < results.length; i++) {
    console.log(`\nPrompt ${i + 1}: ${prompts[i]}`);
    console.log(`Response ${i + 1} (first 50 chars): ${results[i].response.substring(0, 50)}...`);
  }
}

async function efficientStreamingDemo(client) {
  console.log('Demonstrating efficient streaming processing...');
  
  const stream = await client.generateStream({
    model: 'llama2',
    prompt: 'Write a paragraph about the importance of clean code',
    temperature: 0.7,
  });
  
  let buffer = '';
  const chunkSize = 20; // Process in chunks
  const processingDelay = 100; // ms
  let lastProcess = Date.now();
  let totalTokens = 0;
  
  console.log('Streaming response with efficient processing:');
  
  for await (const chunk of stream) {
    buffer += chunk.response;
    totalTokens++;
    
    // Process the buffer in chunks
    const now = Date.now();
    if (now - lastProcess > processingDelay || chunk.done) {
      process.stdout.write(buffer);
      buffer = '';
      lastProcess = now;
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 5));
    }
  }
  
  console.log(`\n\nTotal tokens processed: ${totalTokens}`);
}

performanceDemo().catch(console.error);
```

Run the script:

```bash
node performance.js
```

**Workshop Activity #12:**
1. Run the performance optimization examples
2. Measure the execution time of parallel vs. sequential requests
3. Experiment with different buffer sizes in the streaming example

### Integrating with Web Applications

Set up a basic Express.js server that uses the Ollama SDK:

```bash
npm install express cors
touch server.js
```

Add the following code to server.js:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const { OllamaKit } = require('@tekimax/ollama-sdk');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Ollama client
const ollama = new OllamaKit();

// Routes
app.get('/api/models', async (req, res) => {
  try {
    const models = await ollama.listModels();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { model, prompt, temperature } = req.body;
    
    if (!model || !prompt) {
      return res.status(400).json({ error: 'Model and prompt are required' });
    }
    
    const result = await ollama.generate({
      model,
      prompt,
      temperature: temperature || 0.7,
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/embed', async (req, res) => {
  try {
    const { model, prompt } = req.body;
    
    if (!model || !prompt) {
      return res.status(400).json({ error: 'Model and prompt are required' });
    }
    
    const result = await ollama.createEmbedding({
      model,
      prompt,
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Ollama API server running at http://localhost:${port}`);
});
```

Create a basic frontend:

```bash
mkdir -p public
touch public/index.html
```

Add the following HTML:

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ollama Web Interface</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    textarea { width: 100%; height: 100px; margin: 10px 0; padding: 10px; }
    select, button { padding: 8px 12px; margin: 5px; }
    #result { white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; }
    .loader { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(0,0,0,.2); border-radius: 50%; border-top-color: #333; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <h1>Ollama Web Interface</h1>
  
  <div>
    <label for="model-select">Select Model:</label>
    <select id="model-select">
      <option value="">Loading models...</option>
    </select>
  </div>
  
  <div>
    <label for="temperature">Temperature:</label>
    <input type="range" id="temperature" min="0" max="1" step="0.1" value="0.7">
    <span id="temp-value">0.7</span>
  </div>
  
  <div>
    <textarea id="prompt" placeholder="Enter your prompt here..."></textarea>
  </div>
  
  <div>
    <button id="generate-btn">Generate</button>
    <button id="embed-btn">Create Embedding</button>
    <span id="loading" style="display:none;"><span class="loader"></span> Processing...</span>
  </div>
  
  <div id="result"></div>

  <script>
    // Load models when page loads
    window.addEventListener('DOMContentLoaded', async () => {
      try {
        const response = await fetch('/api/models');
        const data = await response.json();
        
        const modelSelect = document.getElementById('model-select');
        modelSelect.innerHTML = '';
        
        data.models.forEach(model => {
          const option = document.createElement('option');
          option.value = model.name;
          option.textContent = model.name;
          modelSelect.appendChild(option);
        });
      } catch (error) {
        console.error('Error loading models:', error);
      }
    });
    
    // Update temperature display
    document.getElementById('temperature').addEventListener('input', (e) => {
      document.getElementById('temp-value').textContent = e.target.value;
    });
    
    // Generate text
    document.getElementById('generate-btn').addEventListener('click', async () => {
      const model = document.getElementById('model-select').value;
      const prompt = document.getElementById('prompt').value;
      const temperature = parseFloat(document.getElementById('temperature').value);
      const resultDiv = document.getElementById('result');
      const loadingSpan = document.getElementById('loading');
      
      if (!model || !prompt) {
        resultDiv.textContent = 'Please select a model and enter a prompt';
        return;
      }
      
      try {
        resultDiv.textContent = '';
        loadingSpan.style.display = 'inline-block';
        
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt, temperature }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          resultDiv.textContent = data.response;
        } else {
          resultDiv.textContent = `Error: ${data.error}`;
        }
      } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
      } finally {
        loadingSpan.style.display = 'none';
      }
    });
    
    // Create embedding
    document.getElementById('embed-btn').addEventListener('click', async () => {
      const model = document.getElementById('model-select').value;
      const prompt = document.getElementById('prompt').value;
      const resultDiv = document.getElementById('result');
      const loadingSpan = document.getElementById('loading');
      
      if (!model || !prompt) {
        resultDiv.textContent = 'Please select a model and enter a text to embed';
        return;
      }
      
      try {
        resultDiv.textContent = '';
        loadingSpan.style.display = 'inline-block';
        
        const response = await fetch('/api/embed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          resultDiv.textContent = `Embedding created with ${data.embedding.length} dimensions\n\n`;
          resultDiv.textContent += `First 10 values: [${data.embedding.slice(0, 10).map(v => v.toFixed(6)).join(', ')}]`;
        } else {
          resultDiv.textContent = `Error: ${data.error}`;
        }
      } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
      } finally {
        loadingSpan.style.display = 'none';
      }
    });
  </script>
</body>
</html>
```

Run the server:

```bash
node server.js
```

Access the web interface at http://localhost:3000

**Workshop Activity #13:**
1. Run the web server and access the interface
2. Generate text responses using different models and temperatures
3. Create embeddings and observe the vectors
4. Modify the server to add a streaming endpoint

### Advanced Exercises

**Exercise 1:** Create a Chat Interface with History
1. Extend the web application to maintain conversation history
2. Display a chat-like interface with user and assistant messages
3. Implement streaming for a better user experience

**Exercise 2:** Build a Model Management Dashboard
1. Add functionality to pull and remove models from the interface
2. Display detailed model information
3. Show model status and download progress

**Exercise 3:** Implement a Vector Database
1. Store embeddings in a simple database (e.g., JSON file)
2. Add a search function to find similar entries
3. Create a simple knowledge base backed by embeddings

## Part 4: Real-World Projects

This section contains larger project ideas to demonstrate practical applications of the Ollama SDK.

### Building a Chat Application

Create a full-featured chat application:
- Multiple conversation management
- Chat history persistence
- System prompt customization
- Model switching
- Streaming responses

### Creating a Document Q&A System

Build a system that can answer questions based on provided documents:
1. Process documents to create chunks
2. Generate embeddings for each chunk
3. Store embeddings with text in a simple database
4. For each query, find relevant chunks using embedding similarity
5. Use relevant chunks as context for the model to generate answers

### Semantic Search Implementation

Implement a semantic search system:
1. Create a corpus of text documents
2. Generate embeddings for all documents or paragraphs
3. Create a search interface that converts queries to embeddings
4. Return and highlight the most similar results

### Final Project

Choose one of the project ideas above or create your own. The final project should demonstrate:
1. Proper SDK usage
2. Efficient handling of responses
3. Good user experience
4. Error handling
5. Performance considerations

## Conclusion

This workshop has covered the fundamentals of using the @tekimax/ollama-sdk from basic CLI usage to advanced API integrations. You now have the skills to:

1. Use the CLI for quick model interactions
2. Incorporate the SDK into JavaScript/TypeScript applications
3. Work with text generation and embeddings
4. Build real-world applications using LLMs

Remember that large language models are a rapidly evolving field. Stay updated with the latest SDK features and model capabilities to make the most of your projects.

## Additional Resources

- [Ollama SDK GitHub Repository](https://github.com/TEKIMAX/ollama-js-sdk)
- [Ollama Official Documentation](https://ollama.ai/docs)
- [Ollama Model Library](https://ollama.ai/library)
- [Vector Database Options](https://github.com/topics/vector-database)
- [LLM Application Design Patterns](https://eugeneyan.com/writing/llm-patterns/) 