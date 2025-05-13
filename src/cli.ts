#!/usr/bin/env node
// CLI interface for Tekimax Ollama SDK

import { OllamaClient } from './client/OllamaClient';
import { StreamParser } from './util/StreamParser';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  // Initialize client with default or provided host
  const hostIndex = args.findIndex(arg => arg === '--host' || arg === '-h');
  const host = hostIndex >= 0 && args.length > hostIndex + 1 
    ? args[hostIndex + 1]
    : 'http://localhost:11434';
  
  const client = new OllamaClient({ baseUrl: host });
  
  try {
    switch (command) {
      case 'list':
        await listModels(client);
        break;
      case 'generate':
        await generate(client);
        break;
      case 'embed':
        await createEmbedding(client);
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

async function listModels(client: OllamaClient) {
  try {
    const models = await client.models.list();
    console.log('Available models:');
    models.forEach(model => {
      console.log(`- ${model.name} (${formatBytes(model.size)})`);
    });
  } catch (error) {
    console.error('Failed to list models:', error);
  }
}

async function generate(client: OllamaClient) {
  const modelIndex = args.findIndex(arg => arg === '--model' || arg === '-m');
  const model = modelIndex >= 0 && args.length > modelIndex + 1
    ? args[modelIndex + 1]
    : 'llama2';
  
  const promptIndex = args.findIndex(arg => arg === '--prompt' || arg === '-p');
  const prompt = promptIndex >= 0 && args.length > promptIndex + 1
    ? args[promptIndex + 1]
    : 'Hello, world!';
  
  const streamFlag = args.includes('--stream') || args.includes('-s');
  
  try {
    console.log(`Generating response with model: ${model}`);
    console.log(`Prompt: ${prompt}`);
    
    const response = await client.models.generate({
      model,
      prompt,
      stream: streamFlag
    });
    
    if (streamFlag) {
      console.log('Streaming response:');
      for await (const chunk of StreamParser.parse(response)) {
        process.stdout.write(chunk.response || '');
      }
      console.log('\n');
    } else {
      console.log('Response:');
      console.log(response.response);
    }
  } catch (error) {
    console.error('Failed to generate:', error);
  }
}

async function createEmbedding(client: OllamaClient) {
  const modelIndex = args.findIndex(arg => arg === '--model' || arg === '-m');
  const model = modelIndex >= 0 && args.length > modelIndex + 1
    ? args[modelIndex + 1]
    : 'llama2';
  
  const promptIndex = args.findIndex(arg => arg === '--prompt' || arg === '-p');
  const prompt = promptIndex >= 0 && args.length > promptIndex + 1
    ? args[promptIndex + 1]
    : 'Hello, world!';
  
  try {
    console.log(`Creating embedding with model: ${model}`);
    console.log(`Text: ${prompt}`);
    
    const embedding = await client.embeddings.create({
      model,
      prompt
    });
    
    console.log(`Embedding (${embedding.embedding.length} dimensions):`);
    console.log(`[${embedding.embedding.slice(0, 5).join(', ')}...]`);
  } catch (error) {
    console.error('Failed to create embedding:', error);
  }
}

function showHelp() {
  console.log('Tekimax Ollama SDK CLI');
  console.log('----------------------');
  console.log('Usage:');
  console.log('  ollama-js-sdk [command] [options]');
  console.log('\nCommands:');
  console.log('  list                   List available models');
  console.log('  generate               Generate text from a prompt');
  console.log('  embed                  Create embeddings from text');
  console.log('  help                   Show this help message');
  console.log('\nOptions:');
  console.log('  --host, -h            Ollama host URL (default: http://localhost:11434)');
  console.log('  --model, -m           Model name (default: llama2)');
  console.log('  --prompt, -p          Input prompt');
  console.log('  --stream, -s          Stream response (only for generate command)');
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

main().catch(console.error); 