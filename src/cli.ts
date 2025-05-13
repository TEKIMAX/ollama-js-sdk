#!/usr/bin/env node
// CLI interface for Tekimax Ollama SDK

import { OllamaClient } from './client/OllamaClient';
import { StreamParser } from './util/StreamParser';
import chalk from 'chalk';
import * as figlet from 'figlet';
import ora from 'ora';
import gradientString from 'gradient-string';
import { createInterface } from 'node:readline';

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
  // Always display banner at the start
  displayBanner();
  
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
      case 'pull':
        await pullModel(client);
        break;
      case 'show':
        await showModel(client);
        break;
      case 'remove':
        await removeModel(client);
        break;
      case 'tutorial':
        await runInteractiveTutorial(client);
        break;
      case 'help':
      case undefined:
        showHelp();
        break;
      default:
        console.log(chalk.yellow(`Unknown command: ${command}`));
        showHelp();
        break;
    }
  } catch (error) {
    console.error(chalk.red('❌ Error:'), error);
    process.exit(1);
  }
}

async function runInteractiveTutorial(client: OllamaClient) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (query: string): Promise<string> => new Promise(resolve => rl.question(query, resolve));
  
  displayBanner();
  console.log(chalk.bold.cyan('\n📚 Interactive Ollama SDK Tutorial'));
  console.log(chalk.yellow('This tutorial will guide you through using the Ollama SDK. Type "exit" at any prompt to quit.\n'));
  
  let exit = false;
  
  while (!exit) {
    console.log(chalk.bold.cyan('\nWhat would you like to try?'));
    console.log(chalk.green('  1) List available models'));
    console.log(chalk.green('  2) Generate text'));
    console.log(chalk.green('  3) Create embeddings'));
    console.log(chalk.green('  4) Pull a new model'));
    console.log(chalk.green('  5) Show model details'));
    console.log(chalk.green('  6) Read tutorial tips'));
    console.log(chalk.green('  7) Exit tutorial'));
    
    const choice = await question(chalk.cyan('\nEnter choice (1-7): '));
    
    if (choice.toLowerCase() === 'exit') {
      exit = true;
      break;
    }
    
    switch (choice) {
      case '1':
        await tutorialListModels(client);
        break;
      case '2':
        await tutorialGenerateText(client, rl);
        break;
      case '3':
        await tutorialCreateEmbeddings(client, rl);
        break;
      case '4':
        await tutorialPullModel(client, rl);
        break;
      case '5':
        await tutorialShowModel(client, rl);
        break;
      case '6':
        showTutorialTips();
        break;
      case '7':
        exit = true;
        break;
      default:
        console.log(chalk.yellow('Invalid selection. Please try again.'));
    }
  }
  
  console.log(chalk.bold.green('\nTutorial completed! You can now use the ollama-sdk on your own.'));
  console.log(chalk.white('Try running:'), chalk.yellow('ollama-sdk help'), chalk.white('to see all available commands.\n'));
  rl.close();
}

async function tutorialListModels(client: OllamaClient) {
  console.log(chalk.bold.green('\n📋 Listing Available Models'));
  console.log(chalk.white('This command shows all models available on your Ollama instance.'));
  console.log(chalk.gray('\nRunning equivalent of: ollama-sdk list\n'));
  
  const spinner = ora({
    text: chalk.blue('Fetching available models...'),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    const models = await client.models.list();
    spinner.succeed(chalk.green('Models retrieved successfully!'));
    
    console.log(chalk.bold.cyan('\n📚 Available Models:'));
    
    if (models.length === 0) {
      console.log(chalk.yellow('  No models found. You may need to pull a model first.'));
    } else {
      for (const model of models) {
        console.log(chalk.green(`  • ${chalk.bold(model.name)}`), 
          chalk.gray(`(${formatBytes(model.size)})`));
      }
    }
    console.log(); // Empty line for better spacing
  } catch (error) {
    spinner.fail(chalk.red('Failed to list models'));
    console.error(chalk.yellow('⚠️  Error details:'), error);
    console.log(chalk.red('\nMake sure Ollama is running on your machine.'));
    console.log(chalk.yellow('Run:'), chalk.white('ollama serve'), chalk.yellow('in a separate terminal window.'));
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(chalk.gray('\nPress Enter to return to menu...'));
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve(null));
  });
}

async function tutorialGenerateText(client: OllamaClient, rl: any) {
  console.log(chalk.bold.green('\n✨ Generating Text'));
  console.log(chalk.white('This command generates text from a prompt using a selected model.'));
  
  const modelName = await question(rl, chalk.cyan('Enter model name (default: llama2): ')) || 'llama2';
  const prompt = await question(rl, chalk.cyan('Enter a prompt (default: "Tell me about AI in 3 sentences"): ')) || 'Tell me about AI in 3 sentences';
  const stream = (await question(rl, chalk.cyan('Stream the response? (y/N): '))).toLowerCase() === 'y';
  
  console.log(chalk.gray(`\nRunning equivalent of: ollama-sdk generate -m ${modelName} -p "${prompt}"${stream ? ' -s' : ''}`));
  
  const spinner = ora({
    text: chalk.blue('Generating response...'),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    const response = await client.models.generate({
      model: modelName,
      prompt,
      stream,
      temperature: 0.7,
    });
    
    spinner.succeed(chalk.green('Generation started!'));
    
    if (stream) {
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
    console.log(chalk.red('\nMake sure the model exists and Ollama is running.'));
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(chalk.gray('\nPress Enter to return to menu...'));
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve(null));
  });
}

async function tutorialCreateEmbeddings(client: OllamaClient, rl: any) {
  console.log(chalk.bold.green('\n📊 Creating Embeddings'));
  console.log(chalk.white('This command creates vector embeddings from text for semantic analysis.'));
  
  const modelName = await question(rl, chalk.cyan('Enter model name (default: llama2): ')) || 'llama2';
  const text = await question(rl, chalk.cyan('Enter text to embed (default: "This is a sample text for semantic analysis"): ')) || 'This is a sample text for semantic analysis';
  
  console.log(chalk.gray(`\nRunning equivalent of: ollama-sdk embed -m ${modelName} -p "${text}"`));
  
  const spinner = ora({
    text: chalk.blue('Creating embeddings...'),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    const embedding = await client.embeddings.create({
      model: modelName,
      prompt: text
    });
    
    spinner.succeed(chalk.green('Embeddings created successfully!'));
    
    console.log(chalk.bold.cyan(`\n📊 Embedding (${embedding.embedding.length} dimensions):`));
    console.log(chalk.gray('First 5 values:'), 
      chalk.yellow(`[${embedding.embedding.slice(0, 5).map((v: number) => v.toFixed(6)).join(', ')}...]`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create embedding'));
    console.error(chalk.yellow('⚠️  Error details:'), error);
    console.log(chalk.red('\nMake sure the model exists and Ollama is running.'));
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(chalk.gray('\nPress Enter to return to menu...'));
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve(null));
  });
}

async function tutorialPullModel(client: OllamaClient, rl: any) {
  console.log(chalk.bold.green('\n🔄 Pulling a Model'));
  console.log(chalk.white('This command downloads a new model to your local Ollama instance.'));
  console.log(chalk.yellow('\nPopular models:'));
  console.log(chalk.white('  • llama2 - Meta\'s Llama 2 model'));
  console.log(chalk.white('  • mistral - Mistral 7B model'));
  console.log(chalk.white('  • codellama - Code-optimized version of Llama'));
  console.log(chalk.white('  • orca-mini - Lightweight model for resource-constrained environments'));
  
  const modelName = await question(rl, chalk.cyan('Enter model name to pull (default: orca-mini): ')) || 'orca-mini';
  
  console.log(chalk.gray(`\nRunning equivalent of: ollama-sdk pull -m ${modelName}`));
  console.log(chalk.yellow('\n⚠️ Note: Pulling models can take several minutes depending on the model size and your internet speed.'));
  
  const spinner = ora({
    text: chalk.blue(`Pulling ${modelName}...`),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    await client.models.pull({ name: modelName });
    spinner.succeed(chalk.green(`Model ${modelName} pulled successfully!`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to pull model ${modelName}`));
    console.error(chalk.yellow('⚠️  Error details:'), error);
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(chalk.gray('\nPress Enter to return to menu...'));
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve(null));
  });
}

async function tutorialShowModel(client: OllamaClient, rl: any) {
  console.log(chalk.bold.green('\n🔍 Show Model Details'));
  console.log(chalk.white('This command displays detailed information about a specific model.'));
  
  // First list models to help the user
  try {
    const models = await client.models.list();
    console.log(chalk.bold.cyan('\nAvailable Models:'));
    if (models.length === 0) {
      console.log(chalk.yellow('  No models found. You may need to pull a model first.'));
    } else {
      for (const model of models) {
        console.log(chalk.green(`  • ${model.name}`));
      }
    }
  } catch (error) {
    console.log(chalk.red('Failed to list models.'));
  }
  
  const modelName = await question(rl, chalk.cyan('\nEnter model name to inspect (default: llama2): ')) || 'llama2';
  
  console.log(chalk.gray(`\nRunning equivalent of: ollama-sdk show -m ${modelName}`));
  
  const spinner = ora({
    text: chalk.blue(`Fetching details for ${modelName}...`),
    spinner: 'dots',
    color: 'blue'
  }).start();
  
  try {
    const details = await client.models.show({ name: modelName });
    spinner.succeed(chalk.green('Model details retrieved successfully!'));
    
    console.log(chalk.bold.cyan('\n📝 Model Details:'));
    console.log(chalk.bold('Name:'), chalk.green(details.modelfile?.name || modelName));
    console.log(chalk.bold('License:'), chalk.yellow(details.license || 'N/A'));
    console.log(chalk.bold('Size:'), chalk.yellow(formatBytes(details.size)));
    
    if (details.modelfile) {
      console.log(chalk.bold.cyan('\n📄 Modelfile:'));
      console.log(chalk.gray(details.modelfile.content || 'No content available'));
    }
  } catch (error) {
    spinner.fail(chalk.red(`Failed to show model ${modelName}`));
    console.error(chalk.yellow('⚠️  Error details:'), error);
    console.log(chalk.red('\nMake sure the model exists and Ollama is running.'));
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(chalk.gray('\nPress Enter to return to menu...'));
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve(null));
  });
}

function showTutorialTips() {
  console.log(chalk.bold.cyan('\n💡 Tutorial Tips & Tricks'));
  
  console.log(chalk.bold.green('\n📌 Working with Models:'));
  console.log(chalk.white('• You can specify specific model versions using tags like "llama2:13b" or "codellama:7b-instruct"'));
  console.log(chalk.white('• Most commands have shortened versions: -m (--model), -p (--prompt), -s (--stream)'));
  console.log(chalk.white('• To connect to a remote Ollama server, use: ollama-sdk [command] --host http://your-server:11434'));
  
  console.log(chalk.bold.green('\n📌 Text Generation:'));
  console.log(chalk.white('• Control creativity with temperature: --temperature 0.7 (higher = more creative)'));
  console.log(chalk.white('• Use streaming for better user experience with longer responses'));
  console.log(chalk.white('• You can combine with shell commands: ollama-sdk generate -m llama2 -p "Write a poem" > poem.txt'));
  
  console.log(chalk.bold.green('\n📌 Common Issues:'));
  console.log(chalk.white('• If commands fail, ensure Ollama is running: ollama serve'));
  console.log(chalk.white('• For "model not found" errors, pull the model first: ollama-sdk pull -m [model]'));
  console.log(chalk.white('• Large models may need more memory; try smaller variants like orca-mini'));
  
  console.log(chalk.bold.green('\n📌 API Usage:'));
  console.log(chalk.white('• This CLI wraps the same API that you can use in your TypeScript code'));
  console.log(chalk.white('• Check the README for API examples: import { OllamaClient } from \'@tekimax/ollama-sdk\''));
  
  console.log(chalk.gray('\nPress Enter to return to menu...'));
  process.stdin.once('data', () => {});
}

function question(rl: any, query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
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
    // For model pull, we need to use lower-level makeRequest to get the raw response
    // rather than the higher-level models.pull which doesn't return the streaming response
    const response = await client.makeRequest('/api/pull', {
      method: 'POST',
      body: JSON.stringify({ name: model }),
    });
    
    if (!response.body) {
      spinner.fail(chalk.red(`Failed to pull model ${model}: No response body`));
      return;
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let downloadProgress = 0;
    let completed = false;
    
    while (!completed) {
      try {
        const { done, value } = await reader.read();
        
        if (done) {
          completed = true;
          break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const update = JSON.parse(line);
            if (update.status && update.status === 'downloading') {
              const progress = update.completed ? Math.round(update.completed * 100) : 0;
              if (progress > downloadProgress) {
                downloadProgress = progress;
                spinner.text = chalk.blue(`Downloading ${model}... ${downloadProgress}%`);
              }
            } else if (update.status && update.status === 'processing') {
              spinner.text = chalk.blue(`Processing ${model}...`);
            } else if (update.status && update.status === 'success') {
              completed = true;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      } catch (error) {
        spinner.fail(chalk.red(`Error reading stream: ${error instanceof Error ? error.message : String(error)}`));
        return;
      }
    }
    
    // Verify the model was actually pulled by checking if it exists
    try {
      await client.models.show({ name: model });
      spinner.succeed(chalk.green(`Model ${model} pulled successfully!`));
    } catch (error) {
      spinner.fail(chalk.red(`Model verification failed. Pull may have been incomplete.`));
      console.error(chalk.yellow('⚠️  Error details:'), error instanceof Error ? error.message : String(error));
    }
  } catch (error) {
    spinner.fail(chalk.red(`Failed to pull model ${model}`));
    console.error(chalk.yellow('⚠️  Error details:'), error instanceof Error ? error.message : String(error));
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
  
  // Verify the model exists before attempting to remove it
  try {
    await client.models.show({ name: model });
  } catch (error) {
    console.error(chalk.red(`❌ Model "${model}" not found or cannot be accessed`));
    console.error(chalk.yellow('⚠️  Error details:'), error instanceof Error ? error.message : String(error));
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
    
    // Verify the model was actually removed by checking if it still exists
    try {
      await client.models.show({ name: model });
      // If we get here, the model still exists
      spinner.fail(chalk.red(`Failed to remove model ${model} - it still exists`));
    } catch (error) {
      // This is expected - the model should no longer exist
      spinner.succeed(chalk.green(`Model ${model} removed successfully!`));
    }
  } catch (error) {
    // The API might return success but with invalid JSON
    // So we should still verify if the model was actually removed
    try {
      await client.models.show({ name: model });
      // If we get here, the model still exists
      spinner.fail(chalk.red(`Failed to remove model ${model}`));
      console.error(chalk.yellow('⚠️  Error details:'), error instanceof Error ? error.message : String(error));
    } catch (showError) {
      // This means the model no longer exists, which is what we want
      spinner.succeed(chalk.green(`Model ${model} removed successfully (despite API error)!`));
    }
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
  console.log(chalk.cyan('📘 Command Reference:'));
  console.log(chalk.cyan('  ollama-sdk [command] [options]'));
  console.log('');
  
  console.log(chalk.cyan('📋 Commands:'));
  console.log(chalk.yellow('  list                   ') + 'List available models');
  console.log(chalk.yellow('  generate               ') + 'Generate text from a prompt');
  console.log(chalk.yellow('  embed                  ') + 'Create embeddings from text');
  console.log(chalk.yellow('  pull                   ') + 'Pull a new model');
  console.log(chalk.yellow('  show                   ') + 'Show information about a model');
  console.log(chalk.yellow('  remove                 ') + 'Remove a model');
  console.log(chalk.yellow('  tutorial               ') + 'Run interactive tutorial');
  console.log(chalk.yellow('  help                   ') + 'Show this help message');
  console.log('');
  
  console.log(chalk.cyan('🔧 Options:'));
  console.log(chalk.yellow('  --host, -h            ') + 'Ollama host URL (default: http://localhost:11434)');
  console.log(chalk.yellow('  --model, -m           ') + 'Model name (default: llama2)');
  console.log(chalk.yellow('  --prompt, -p          ') + 'Input prompt');
  console.log(chalk.yellow('  --stream, -s          ') + 'Stream response (only for generate command)');
  console.log(chalk.yellow('  --temperature, -t     ') + 'Temperature for generation (0.0-1.0)');
  console.log(chalk.yellow('  --top-p               ') + 'Top-p sampling (0.0-1.0)');
  console.log(chalk.yellow('  --insecure            ') + 'Allow insecure connections (only for pull command)');
  console.log('');
  
  console.log(chalk.cyan('📊 Examples:'));
  console.log(chalk.yellow('  # List all models'));
  console.log('  ollama-sdk list');
  console.log(chalk.yellow('  # Generate text with a specific model'));
  console.log('  ollama-sdk generate -m llama2 -p "Tell me about AI" -s');
  console.log(chalk.yellow('  # Create embeddings'));
  console.log('  ollama-sdk embed -m llama2 -p "Semantic text representation"');
  console.log(chalk.yellow('  # Pull a new model'));
  console.log('  ollama-sdk pull -m mistral');
  console.log(chalk.yellow('  # Show model details'));
  console.log('  ollama-sdk show -m llama2');
  console.log(chalk.yellow('  # Remove a model'));
  console.log('  ollama-sdk remove -m unused-model');
  console.log('');
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