#!/usr/bin/env node

// Test script for OpenAI compatibility layer
const express = require('express');
const { OllamaClient } = require('../dist');

console.log('🚀 Starting OpenAI compatibility test server...');

const app = express();
app.use(express.json());

// Create client
const client = new OllamaClient();

// Set up endpoints
console.log('⚙️  Setting up OpenAI compatibility endpoints...');

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Tekimax Ollama SDK - OpenAI Compatibility Layer',
    endpoints: [
      '/v1/chat/completions',
      '/v1/completions',
      '/v1/embeddings',
      '/v1/models',
      '/v1/models/{model}'
    ]
  });
});

// Setup all OpenAI compatible endpoints
client.openai.setupEndpoints(app)
  .then(() => {
    console.log('✅ OpenAI compatibility endpoints set up successfully');
    
    // Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🔌 Server running at http://localhost:${port}`);
      console.log('');
      console.log('🧪 Test with curl:');
      console.log('---------------------');
      console.log(`curl http://localhost:${port}/v1/models`);
      console.log('');
      console.log(`curl http://localhost:${port}/v1/chat/completions \\`);
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -d \'{"model": "llama2", "messages": [{"role": "user", "content": "Hello!"}]}\'');
      console.log('');
      console.log('📚 For full documentation, see:');
      console.log('https://github.com/TEKIMAX/ollama-js-sdk#openai-compatibility');
    });
  })
  .catch(error => {
    console.error('❌ Failed to set up OpenAI compatibility endpoints:', error);
    process.exit(1);
  }); 