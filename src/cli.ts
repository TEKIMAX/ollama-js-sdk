#!/usr/bin/env node
// CLI interface for Tekimax Ollama SDK

import { OllamaClient } from './client/OllamaClient';
import { StreamParser } from './util/StreamParser';
import chalk from 'chalk';
import * as figlet from 'figlet';
import ora from 'ora';
import gradientString from 'gradient-string';

const args = process.argv.slice(2);
const command = args[0];

// Display ASCII art banner
function displayBanner() {
  const tekimaxArt = figlet.textSync('TEKIMAX', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });
  
  const subtitle = '   Ollama SDK CLI';
  
  // Create a retro gradient with amber/blue/cyan colors
  const retroGradient = gradientString('#ff8c00', '#1e90ff', '#00ced1', '#4169e1');
  
  console.log(retroGradient(tekimaxArt));
  console.log(chalk.cyan('   Ollama SDK CLI'));
  console.log(chalk.cyan('   ========================================\n'));
}

async function main() {
  // Initialize client with default or provided host
  const hostIndex = args.findIndex(arg => arg === '--host' || arg === '-h');
  const host = hostIndex >= 0 && args.length > hostIndex + 1 
    ? args[hostIndex + 1]
    : 'http://localhost:11434';
  
  const client = new OllamaClient({ baseUrl: host });

  // Show banner for help or no command
  if (!command || command === 'help') {
    displayBanner();
  }
  
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
      case 'pull':
        await pullModel(client);
        break;
      case 'show':
        await showModel(client);
        break;
      case 'remove':
        await removeModel(client);
        break;
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error(chalk.red('❌ Error:'), error);
    process.exit(1);
  }
}

async function listModels(client: OllamaClient) {
  const spinner = ora({
    text: chalk.blue('Fetching available models...'),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    const models = await client.models.list();
    spinner.succeed(chalk.green('Models retrieved successfully!'));
    
    console.log(chalk.bold.cyan('\n📚 Available Models:'));
    
    for (const model of models) {
      console.log(chalk.green(`  • ${chalk.bold(model.name)}`), 
        chalk.gray(`(${formatBytes(model.size)})`));
    }
    console.log(); // Empty line for better spacing
  } catch (error) {
    spinner.fail(chalk.red('Failed to list models'));
    console.error(chalk.yellow('⚠️  Error details:'), error);
  }
}

async function pullModel(client: OllamaClient) {
  const modelIndex = args.findIndex(arg => arg === '--model' || arg === '-m');
  const model = modelIndex >= 0 && args.length > modelIndex + 1
    ? args[modelIndex + 1]
    : null;
    
  if (!model) {
    console.error(chalk.red('❌ Error: Model name is required'));
    console.log(chalk.yellow('Usage: ollama-sdk pull --model <model_name>'));
    return;
  }
  
  console.log(chalk.cyan('🔄 Pulling model:'), chalk.bold(model));
  
  const spinner = ora({
    text: chalk.blue(`Downloading ${model}...`),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    await client.models.pull({ name: model });
    spinner.succeed(chalk.green(`Model ${model} pulled successfully!`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to pull model ${model}`));
    console.error(chalk.yellow('⚠️  Error details:'), error);
  }
}

async function showModel(client: OllamaClient) {
  const modelIndex = args.findIndex(arg => arg === '--model' || arg === '-m');
  const model = modelIndex >= 0 && args.length > modelIndex + 1
    ? args[modelIndex + 1]
    : null;
    
  if (!model) {
    console.error(chalk.red('❌ Error: Model name is required'));
    console.log(chalk.yellow('Usage: ollama-sdk show --model <model_name>'));
    return;
  }
  
  const spinner = ora({
    text: chalk.blue(`Fetching details for ${model}...`),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    const details = await client.models.show({ name: model });
    spinner.succeed(chalk.green(`Model details retrieved successfully!`));
    
    console.log(chalk.bold.cyan('\n📝 Model Details:'));
    console.log(chalk.bold('Name:'), chalk.green(details.modelfile?.name || model));
    console.log(chalk.bold('License:'), chalk.yellow(details.license || 'N/A'));
    console.log(chalk.bold('Size:'), chalk.yellow(formatBytes(details.size)));
    
    if (details.modelfile) {
      console.log(chalk.bold.cyan('\n📄 Modelfile:'));
      console.log(chalk.gray(details.modelfile.content || 'No content available'));
    }
    
    console.log();
  } catch (error) {
    spinner.fail(chalk.red(`Failed to show model ${model}`));
    console.error(chalk.yellow('⚠️  Error details:'), error);
  }
}

async function removeModel(client: OllamaClient) {
  const modelIndex = args.findIndex(arg => arg === '--model' || arg === '-m');
  const model = modelIndex >= 0 && args.length > modelIndex + 1
    ? args[modelIndex + 1]
    : null;
    
  if (!model) {
    console.error(chalk.red('❌ Error: Model name is required'));
    console.log(chalk.yellow('Usage: ollama-sdk remove --model <model_name>'));
    return;
  }
  
  console.log(chalk.yellow('⚠️  Warning:'), chalk.red(`Removing model ${model}`));
  
  const spinner = ora({
    text: chalk.blue(`Removing model ${model}...`),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    await client.models.delete({ name: model });
    spinner.succeed(chalk.green(`Model ${model} removed successfully!`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to remove model ${model}`));
    console.error(chalk.yellow('⚠️  Error details:'), error);
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
  
  // Parse optional generation parameters
  const temperatureIndex = args.findIndex(arg => arg === '--temperature' || arg === '-t');
  const temperature = temperatureIndex >= 0 && args.length > temperatureIndex + 1
    ? Number.parseFloat(args[temperatureIndex + 1])
    : undefined;
    
  const topPIndex = args.findIndex(arg => arg === '--top-p');
  const top_p = topPIndex >= 0 && args.length > topPIndex + 1
    ? Number.parseFloat(args[topPIndex + 1])
    : undefined;
  
  console.log(chalk.cyan('🤖 Model:'), chalk.bold(model));
  console.log(chalk.cyan('💬 Prompt:'), chalk.italic(prompt));
  if (temperature !== undefined)
    console.log(chalk.cyan('🌡️ Temperature:'), temperature);
  if (top_p !== undefined)
    console.log(chalk.cyan('📊 Top-P:'), top_p);
  
  const spinner = ora({
    text: chalk.blue('Generating response...'),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    const response = await client.models.generate({
      model,
      prompt,
      stream: streamFlag,
      temperature,
      top_p,
    });
    
    spinner.succeed(chalk.green('Generation started!'));
    
    if (streamFlag) {
      console.log(chalk.bgBlue.white(' STREAMING RESPONSE '));
      console.log(chalk.cyan(`┌${'─'.repeat(60)}┐`));
      
      for await (const chunk of StreamParser.parse(response)) {
        process.stdout.write(chunk.response || '');
      }
      
      console.log(`\n${chalk.cyan(`└${'─'.repeat(60)}┘`)}`);
    } else {
      console.log(chalk.bgBlue.white(' RESPONSE '));
      console.log(chalk.cyan(`┌${'─'.repeat(60)}┐`));
      console.log(response.response);
      console.log(chalk.cyan(`└${'─'.repeat(60)}┘`));
    }
  } catch (error) {
    spinner.fail(chalk.red('Generation failed'));
    console.error(chalk.yellow('⚠️  Error details:'), error);
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
  
  console.log(chalk.cyan('🔤 Embedding Text:'), chalk.italic(prompt));
  
  const spinner = ora({
    text: chalk.blue('Creating embeddings...'),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    const embedding = await client.embeddings.create({
      model,
      prompt
    });
    
    spinner.succeed(chalk.green('Embeddings created successfully!'));
    
    console.log(chalk.bold.cyan(`\n📊 Embedding (${embedding.embedding.length} dimensions):`));
    console.log(chalk.gray('First 5 values:'), 
      chalk.yellow(`[${embedding.embedding.slice(0, 5).map((v: number) => v.toFixed(6)).join(', ')}...]`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create embedding'));
    console.error(chalk.yellow('⚠️  Error details:'), error);
  }
}

function showHelp() {
  console.log(chalk.bold.cyan('\n📘 Command Reference:'));
  console.log(chalk.white('  ollama-sdk'), chalk.yellow('[command]'), chalk.gray('[options]'));
  
  console.log(chalk.bold.cyan('\n📋 Commands:'));
  console.log(`  ${chalk.green('list')}                   ${chalk.white('List available models')}`);
  console.log(`  ${chalk.green('generate')}               ${chalk.white('Generate text from a prompt')}`);
  console.log(`  ${chalk.green('embed')}                  ${chalk.white('Create embeddings from text')}`);
  console.log(`  ${chalk.green('pull')}                   ${chalk.white('Pull a new model')}`);
  console.log(`  ${chalk.green('show')}                   ${chalk.white('Show information about a model')}`);
  console.log(`  ${chalk.green('remove')}                 ${chalk.white('Remove a model')}`);
  console.log(`  ${chalk.green('help')}                   ${chalk.white('Show this help message')}`);
  
  console.log(chalk.bold.cyan('\n🔧 Options:'));
  console.log(`  ${chalk.yellow('--host, -h')}            ${chalk.white('Ollama host URL (default: http://localhost:11434)')}`);
  console.log(`  ${chalk.yellow('--model, -m')}           ${chalk.white('Model name (default: llama2)')}`);
  console.log(`  ${chalk.yellow('--prompt, -p')}          ${chalk.white('Input prompt')}`);
  console.log(`  ${chalk.yellow('--stream, -s')}          ${chalk.white('Stream response (only for generate command)')}`);
  console.log(`  ${chalk.yellow('--temperature, -t')}     ${chalk.white('Temperature for generation (0.0-1.0)')}`);
  console.log(`  ${chalk.yellow('--top-p')}               ${chalk.white('Top-p sampling (0.0-1.0)')}`);
  
  console.log(chalk.bold.cyan('\n📊 Examples:'));
  console.log(`  ${chalk.gray('# List all models')}`);
  console.log(`  ${chalk.white('ollama-sdk list')}`);
  console.log(`  ${chalk.gray('# Generate text with a specific model')}`);
  console.log(`  ${chalk.white('ollama-sdk generate -m llama2 -p "Tell me about AI" -s')}`);
  console.log(`  ${chalk.gray('# Create embeddings')}`);
  console.log(`  ${chalk.white('ollama-sdk embed -m llama2 -p "Semantic text representation"')}`);
  console.log(`  ${chalk.gray('# Pull a new model')}`);
  console.log(`  ${chalk.white('ollama-sdk pull -m mistral')}`);
  console.log();
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}

main().catch(error => {
  console.error(chalk.red('❌ Unexpected error:'), error);
  process.exit(1);
}); 