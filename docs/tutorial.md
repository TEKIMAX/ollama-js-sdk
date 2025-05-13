# Interactive Tutorial Guide

The Ollama SDK provides a comprehensive interactive tutorial to help you learn how to use all its features. This document provides a complete walkthrough of the tutorial experience.

## Starting the Tutorial

Run the tutorial with:

```bash
npx @tekimax/ollama-sdk tutorial
```

You'll be greeted with the Tekimax ASCII banner and a welcome message.

## Main Menu Options

The tutorial presents a menu with these options:

```
What would you like to try?
  1) List available models
  2) Generate text
  3) Create embeddings
  4) Pull a new model
  5) Show model details
  6) Read tutorial tips
  7) Exit tutorial
```

## Option 1: List Available Models

This option demonstrates how to list all models available on your local Ollama instance.

**Command equivalent:**
```bash
npx @tekimax/ollama-sdk list
```

**Expected output:**
```
📚 Available Models:
  • llama2:latest (3.56 GB)
  • mistral:latest (3.83 GB)
  • orca-mini:latest (1.84 GB)
  • [other models...]
```

**What you'll see in the tutorial:**
1. A spinner animation while fetching the models
2. Success message when models are found
3. A formatted list of models with sizes
4. Error handling if Ollama isn't running

## Option 2: Generate Text

This option demonstrates text generation capabilities using Ollama models.

**Command equivalent:**
```bash
npx @tekimax/ollama-sdk generate -m <model_name> -p "Your prompt" -s
```

**Expected input and output:**
```
Enter model name (default: llama2): [your choice or press Enter]
Enter a prompt: What are three benefits of exercise?
Stream the response? (y/N): y

✔ Generation started!
[Generated text appears here as a stream]
```

**Parameters explained:**
- `-m, --model`: The model name to use (default: llama2)
- `-p, --prompt`: The prompt for text generation
- `-s, --stream`: Whether to stream the output in real-time
- `-t, --temperature`: Controls randomness (0.0-1.0)
- `--top-p`: Controls diversity via nucleus sampling

## Option 3: Create Embeddings

This option demonstrates creating vector embeddings from text.

**Command equivalent:**
```bash
npx @tekimax/ollama-sdk embed -m <model_name> -p "Text to embed"
```

**Expected input and output:**
```
Enter model name (default: llama2): nomic-embed-text
Enter text to embed: This is a sample text for semantic analysis

✔ Embeddings created successfully!
📊 Embedding (768 dimensions):
First 5 values: [0.547358, 1.275857, -3.502294, -1.624924, 0.804668...]
```

**Use cases explained in tutorial:**
- Semantic search
- Document similarity
- Clustering text by meaning
- Knowledge base construction

## Option 4: Pull a New Model

This option guides you through downloading new models from Ollama.

**Command equivalent:**
```bash
npx @tekimax/ollama-sdk pull -m <model_name>
```

**Expected input and output:**
```
Popular models:
  • llama2 - Meta's Llama 2 model
  • mistral - Mistral 7B model
  • codellama - Code-optimized version of Llama
  • orca-mini - Lightweight model for resource-constrained environments

Enter model name to pull (default: orca-mini): mistral

🔄 Pulling model: mistral
Downloading mistral... 25%
Downloading mistral... 50%
Downloading mistral... 75%
Processing mistral...
✔ Model mistral pulled successfully!
```

**Notes in tutorial:**
- The tutorial warns that pulling models can take several minutes
- Shows real-time download progress
- Verifies the model was installed correctly
- Handles errors gracefully

## Option 5: Show Model Details

This option demonstrates displaying detailed information about a specific model.

**Command equivalent:**
```bash
npx @tekimax/ollama-sdk show -m <model_name>
```

**Expected input and output:**
```
Available Models:
  • llama2
  • mistral
  • orca-mini
  • [other models...]

Enter model name to inspect (default: llama2): mistral

✔ Model details retrieved successfully!
📝 Model Details:
Name: mistral
License: [license information]
Size: 3.83 GB

📄 Modelfile:
[modelfile content if available]
```

## Option 6: Read Tutorial Tips

This option provides additional tips and tricks for advanced usage.

**Topics covered:**

1. **Working with Models:**
   - Model version specification (`llama2:13b`, `codellama:7b-instruct`)
   - Command shorthand flags (`-m`, `-p`, `-s`)
   - Remote server connections (`--host http://your-server:11434`)

2. **Text Generation:**
   - Temperature control (`--temperature 0.7`)
   - Output redirection (`> output.txt`)
   - Shell pipeline integration

3. **Common Issues:**
   - Ollama server not running
   - Model not found troubleshooting
   - Memory constraints for large models

4. **API Integration:**
   - Using the same SDK in TypeScript/JavaScript code
   - Equivalent API calls for CLI commands

## Exiting the Tutorial

You can exit the tutorial at any time by:
1. Selecting option 7 from the main menu
2. Typing "exit" at any prompt
3. Using Ctrl+C

## Interactive Elements

Throughout the tutorial, you'll encounter:

- **Color-coded output** for better readability
- **Loading animations** during longer operations
- **Step-by-step instructions** with clear explanations
- **Real-time feedback** on operations
- **Error handling** with recovery suggestions
- **Equivalent commands** shown for each action

This tutorial is designed for both beginners to Ollama and developers looking to quickly understand the SDK's capabilities before integrating it into their applications.

## Next Steps After Tutorial

After completing the tutorial, you can:

1. Use the CLI commands directly as shown in the tutorial
2. Integrate the SDK into your TypeScript/JavaScript applications
3. Explore the OpenAI compatibility layer for migration from OpenAI
4. Contribute to the SDK development on GitHub 