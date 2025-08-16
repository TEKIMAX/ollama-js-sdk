# Tekimax SDK - GPT-OSS Edition

![npm](https://img.shields.io/npm/v/tekimax-sdk)
![License](https://img.shields.io/npm/l/tekimax-sdk)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)
![AI Academy](https://img.shields.io/badge/AI%20Academy-Included-green)

> 🎓 **AI Education Platform + GPT-OSS SDK** - Learn AI concepts interactively while building with GPT-OSS 20 & 120 models

<div align="center">
  <img src="https://raw.githubusercontent.com/TEKIMAX/tekimax-sdk/main/assets/tekimax-logo.png" alt="Tekimax Logo" width="300"/>
</div>

## 🌟 What's New in v2.0

### 🎓 **AI Academy - Interactive Learning Platform**
Learn AI and LLM concepts through our built-in educational platform with:
- 📚 5 comprehensive chapters
- 🎯 Interactive quizzes
- 💡 Real-world examples
- 🔍 Searchable content
- 📊 Quick reference guides

### 🚀 **Optimized for GPT-OSS Models**
- **GPT-OSS 20**: 20B parameters, 8K context window
- **GPT-OSS 120**: 120B parameters, 32K context window

## 📦 Installation

### Global Installation (Recommended)
```bash
# Install globally to use anywhere
npm install -g tekimax-sdk

# Verify installation
tekimax-sdk help
```

### Project Installation
```bash
# npm
npm install tekimax-sdk

# yarn
yarn add tekimax-sdk

# pnpm
pnpm add tekimax-sdk

# bun
bun add tekimax-sdk
```

## 🎓 AI Academy - Learn AI Interactively

Start the AI Academy to learn about LLMs, transformers, embeddings, and more:

```bash
tekimax-sdk learn
```

### Course Curriculum

#### 📚 Chapter 1: AI Fundamentals
- What is a Large Language Model (LLM)?
- Understanding Tokens
- Transformer Architecture Explained

#### ⚙️ Chapter 2: Model Parameters
- Temperature: Controlling Randomness
- Context Windows: Model Memory
- Top-P and Top-K Sampling

#### 🔢 Chapter 3: Embeddings & Vectors
- What are Embeddings?
- Semantic Similarity
- Vector Operations

#### 🎯 Chapter 4: Fine-Tuning & Training
- Fine-Tuning Fundamentals
- Training Best Practices
- Data Preparation

#### ✍️ Chapter 5: Prompt Engineering
- Advanced Prompting Techniques
- Zero-Shot vs Few-Shot
- Chain-of-Thought Prompting

### Features of AI Academy
- **Interactive Navigation**: Browse chapters and lessons with arrow keys
- **Search Function**: Find topics quickly
- **Quizzes**: Test your knowledge after each lesson
- **Examples**: See practical code examples
- **Quick Reference**: Access common parameters and conversions

## 🚀 Quick Start

### 1. Check Your Setup
```bash
# Verify Ollama is running and models are available
tekimax-sdk setup
```

### 2. Start Learning
```bash
# Launch AI Academy
tekimax-sdk learn
```

### 3. Generate Text
```bash
# Using GPT-OSS 20 (default)
tekimax-sdk generate -p "Explain quantum computing"

# Using GPT-OSS 120
tekimax-sdk generate -m gpt-oss-120 -p "Write a detailed essay"

# Using aliases
tekimax-sdk generate -m gpt20 -p "Hello, world!"
```

## 💻 Programmatic Usage

```typescript
import { OllamaClient, SUPPORTED_MODELS } from 'tekimax-sdk';

// Initialize client
const client = new OllamaClient({
  baseUrl: 'http://localhost:11434'
});

// Generate with GPT-OSS 20
const response = await client.models.generate({
  model: 'gpt-oss-20',
  prompt: 'Explain transformer architecture',
  temperature: 0.7,
  max_tokens: 500
});

// Create embeddings
const embedding = await client.embeddings.create({
  model: 'gpt-oss-20',
  input: 'Convert this text to vectors'
});

// Get supported models
const models = client.models.getSupportedModels();
console.log(models); // [GPT-OSS 20, GPT-OSS 120]
```

## 📡 CLI Commands

| Command | Description |
|---------|-------------|
| `tekimax-sdk learn` | 🎓 Start AI Academy interactive learning |
| `tekimax-sdk setup` | 🚀 Check setup and model availability |
| `tekimax-sdk generate` | 📝 Generate text with GPT-OSS models |
| `tekimax-sdk embed` | 🔢 Create text embeddings |
| `tekimax-sdk list` | 📋 List available models |
| `tekimax-sdk pull` | 📥 Pull a model from registry |
| `tekimax-sdk help` | ❓ Show help and examples |

## 🎨 CLI Examples

```bash
# Start AI Academy
tekimax-sdk learn

# Check your setup
tekimax-sdk setup

# Generate with temperature control
tekimax-sdk generate -m gpt-oss-20 -p "Write a poem" -t 0.9

# Create embeddings
tekimax-sdk embed -m gpt-oss-20 -p "Semantic search query"

# Stream responses
tekimax-sdk generate -m gpt120 -p "Tell a story" --stream
```

## 📊 Model Comparison

| Feature | GPT-OSS 20 | GPT-OSS 120 |
|---------|------------|-------------|
| Parameters | 20B | 120B |
| Context Window | 8,192 tokens | 32,768 tokens |
| Max Output | 4,096 tokens | 16,384 tokens |
| Speed | Fast | Slower |
| Quality | Good | Excellent |
| RAM Required | ~16GB | ~64GB |
| Use Cases | General tasks, quick responses | Complex reasoning, long documents |

## 🔧 Configuration

### Model Aliases
```javascript
// All these refer to the same models
'gpt-oss-20' === 'gpt20' === '20'
'gpt-oss-120' === 'gpt120' === '120'
```

### Generation Parameters
```typescript
{
  model: 'gpt-oss-20',        // Model selection
  prompt: 'Your prompt',       // Input text
  temperature: 0.7,            // Creativity (0.0-2.0)
  top_p: 0.9,                 // Nucleus sampling
  top_k: 40,                  // Top-K sampling
  max_tokens: 1000,           // Maximum output length
  stream: false               // Streaming response
}
```

## 📚 API Reference

### OllamaClient
```typescript
const client = new OllamaClient({
  baseUrl: 'http://localhost:11434',  // Ollama server URL
  apiKey?: string                      // Optional API key
});
```

### ModelManager
```typescript
// List models
const models = await client.models.list();

// Generate text
const response = await client.models.generate({
  model: 'gpt-oss-20',
  prompt: 'Your prompt here'
});

// Get supported models
const supported = client.models.getSupportedModels();
```

### EmbeddingsManager
```typescript
// Create embeddings (supports batch)
const result = await client.embeddings.create({
  model: 'gpt-oss-20',
  input: 'Text to embed' // or ['text1', 'text2']
});

// Calculate similarity
const similarity = client.embeddings.calculateCosineSimilarity(
  embedding1,
  embedding2
);
```

## 🎓 Educational Purpose

This SDK was created with educational goals:
- 📖 Teaching AI and LLM concepts interactively
- 🧪 Hands-on learning with real models
- 🎯 Practical examples and exercises
- 📊 Understanding model parameters
- 🔧 Learning prompt engineering

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏢 About Tekimax

Tekimax LLC is committed to AI education and making advanced AI technology accessible to developers and students worldwide.

## 🔗 Links

- [GitHub Repository](https://github.com/TEKIMAX/tekimax-sdk)
- [npm Package](https://www.npmjs.com/package/tekimax-sdk)
- [Documentation](https://github.com/TEKIMAX/tekimax-sdk/wiki)
- [Issue Tracker](https://github.com/TEKIMAX/tekimax-sdk/issues)

## 💡 Quick Tips

1. **Start with AI Academy**: Learn the concepts before diving into code
2. **Use GPT-OSS 20**: For faster responses and general tasks
3. **Use GPT-OSS 120**: For complex reasoning and longer contexts
4. **Experiment with Temperature**: Lower for facts, higher for creativity
5. **Check Setup First**: Run `tekimax-sdk setup` before starting

---

<div align="center">
  <b>🎓 Learn AI • 🚀 Build with GPT-OSS • 💡 Create Amazing Things</b>
  <br><br>
  Made with ❤️ by Tekimax LLC
</div>