// Example of using the OpenAI compatibility layer with Express.js
const express = require('express');
const cors = require('cors');
const { OllamaClient } = require('@tekimax/ollama-sdk');

// Create an Express app
const app = express();
app.use(express.json());
app.use(cors());

// Initialize the Ollama client
const client = new OllamaClient({
  baseUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434'
});

// Configure and set up the OpenAI compatibility endpoints
(async () => {
  try {
    await client.openai.setupEndpoints(app);
    console.log('OpenAI compatibility layer endpoints set up successfully.');
  } catch (error) {
    console.error('Failed to set up OpenAI compatibility layer:', error);
  }
})();

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`OpenAI compatibility server running on http://localhost:${port}`);
  console.log(`You can use this with any OpenAI client by pointing to this URL.`);
  console.log('Example with OpenAI Node.js SDK:');
  console.log(`
  import OpenAI from 'openai'
  
  const openai = new OpenAI({
    baseURL: 'http://localhost:${port}/v1/',
    apiKey: 'ollama',  // Any value works, it's just a placeholder
  })
  
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Hello, how are you?' }],
    model: 'llama3.2',  // Use any Ollama model you have installed
  })
  
  console.log(chatCompletion.choices[0].message.content)
  `);
}); 