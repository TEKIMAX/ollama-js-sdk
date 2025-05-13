# Ollama SDK Workshop Setup Guide

This document contains instructions for setting up your environment for the Ollama SDK workshop.

## Prerequisites

Before starting the workshop, ensure you have the following installed on your system:

1. **Node.js (v16+)** - [Download Node.js](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Ollama** - [Download Ollama](https://ollama.ai/download)
   - Verify installation: `ollama --version`

3. **Git** - [Download Git](https://git-scm.com/downloads)
   - Verify installation: `git --version`

4. **A code editor** - [VS Code recommended](https://code.visualstudio.com/)

5. **Terminal or command prompt**

## Environment Setup

### 1. Clone the Workshop Repository

```bash
git clone https://github.com/TEKIMAX/ollama-js-sdk-workshop
cd ollama-js-sdk-workshop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Ensure Ollama is Running

Start the Ollama service:

- **macOS/Linux**: `ollama serve`
- **Windows**: Ollama should run automatically as a service after installation

Verify it's running by opening `http://localhost:11434` in your browser. You should see a simple "Ollama is running" message.

### 4. Download Required Models

For the workshop, we recommend having these models available:

```bash
# Core model for text generation
ollama pull llama2

# Small model for quick tests
ollama pull orca-mini

# Embedding model for vector operations
ollama pull nomic-embed-text
```

Verify models are available:

```bash
ollama list
```

### 5. Install the Ollama SDK CLI

```bash
npm install -g @tekimax/ollama-sdk
```

Verify installation:

```bash
ollama-sdk help
```

## Workshop Directory Structure

After setup, your workshop directory will look like this:

```
ollama-js-sdk-workshop/
├── examples/             # Example code for each workshop section
│   ├── cli/              # CLI usage examples
│   ├── basic-api/        # Basic API examples
│   ├── advanced/         # Advanced usage examples
│   └── projects/         # Full project examples
├── exercises/            # Exercise starter files
│   ├── exercise1/        # CLI exercises
│   ├── exercise2/        # API exercises
│   └── exercise3/        # Advanced exercises
├── solutions/            # Complete solutions for exercises
├── documents/            # Sample documents for semantic search exercise
├── public/               # Static files for web examples
├── package.json          # Project dependencies
└── README.md             # Workshop instructions
```

## Create Documents for Semantic Search

The semantic search example requires text documents. Create a sample documents directory:

```bash
mkdir -p documents
```

Add some sample text files (copy some Wikipedia articles or other content):

```bash
# Example: Download Wikipedia articles for testing
curl -o documents/ai.txt https://en.wikipedia.org/wiki/Artificial_intelligence?action=raw
curl -o documents/ml.txt https://en.wikipedia.org/wiki/Machine_learning?action=raw
curl -o documents/llm.txt https://en.wikipedia.org/wiki/Large_language_model?action=raw
```

## Verify Setup

Run the setup verification script:

```bash
node verify-setup.js
```

You should see output confirming that:
1. Ollama is running
2. Required models are available
3. The Ollama SDK is properly installed
4. Example files are accessible

## Troubleshooting

### Ollama not running

If Ollama isn't running, try:

```bash
# Check if Ollama is running
curl http://localhost:11434

# Start Ollama if needed
ollama serve
```

### Models not downloading

If you encounter issues pulling models:

```bash
# Try with increased verbosity
ollama pull llama2 -v

# Check disk space
df -h
```

### SDK installation issues

If the SDK doesn't install properly:

```bash
# Try with force flag
npm install -g @tekimax/ollama-sdk --force

# Check npm permissions
npm doctor
```

### Network issues

If you're behind a corporate firewall:

```bash
# Check if you can reach Ollama registry
curl https://ollama.ai/api/registry/models

# Configure npm proxy if needed
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port
```

## Next Steps

Once your environment is set up successfully, proceed to the [Workshop Guide](./workshop.md) to begin the workshop. 