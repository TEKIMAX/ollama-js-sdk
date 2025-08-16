import chalk from 'chalk';
import ora from 'ora';
import { OllamaClient } from '../client/OllamaClient';
import { SUPPORTED_MODELS } from '../config/models';

export class ModelSetup {
  private client: OllamaClient;

  constructor(client: OllamaClient) {
    this.client = client;
  }

  async checkOllamaConnection(): Promise<boolean> {
    const spinner = ora({
      text: 'Checking Ollama connection...',
      color: 'blue'
    }).start();

    try {
      const response = await fetch(`${this.client.getBaseUrl()}/api/tags`);
      if (response.ok) {
        spinner.succeed(chalk.green('✅ Ollama is running!'));
        return true;
      } else {
        spinner.fail(chalk.red('❌ Ollama is not responding'));
        return false;
      }
    } catch (error) {
      spinner.fail(chalk.red('❌ Cannot connect to Ollama'));
      return false;
    }
  }

  async checkAvailableModels(): Promise<string[]> {
    try {
      const models = await this.client.models.list();
      return models.map(m => m.name);
    } catch {
      return [];
    }
  }

  async setupGuide() {
    console.log(chalk.bold.cyan('\n🚀 GPT-OSS Model Setup Guide\n'));
    console.log(chalk.cyan('═'.repeat(60)));

    // Check Ollama connection
    const isConnected = await this.checkOllamaConnection();
    
    if (!isConnected) {
      console.log(chalk.yellow('\n📋 To use this SDK, you need Ollama running:\n'));
      console.log(chalk.white('1. Install Ollama:'));
      console.log(chalk.gray('   Visit https://ollama.ai to download'));
      console.log(chalk.white('\n2. Start Ollama:'));
      console.log(chalk.gray('   Run: ollama serve'));
      console.log(chalk.white('\n3. Pull GPT-OSS models:'));
      console.log(chalk.gray('   ollama pull gpt-oss-20'));
      console.log(chalk.gray('   ollama pull gpt-oss-120'));
      console.log(chalk.cyan('\n═'.repeat(60)));
      return false;
    }

    // Check for GPT-OSS models
    const availableModels = await this.checkAvailableModels();
    const gptOss20Available = availableModels.some(m => 
      m.includes('gpt-oss-20') || m.includes('gpt20')
    );
    const gptOss120Available = availableModels.some(m => 
      m.includes('gpt-oss-120') || m.includes('gpt120')
    );

    console.log(chalk.bold.white('\n📦 Model Status:'));
    console.log(chalk.cyan('─'.repeat(40)));
    
    if (gptOss20Available) {
      console.log(chalk.green('✅ GPT-OSS 20 is available'));
    } else {
      console.log(chalk.yellow('⚠️  GPT-OSS 20 not found'));
    }
    
    if (gptOss120Available) {
      console.log(chalk.green('✅ GPT-OSS 120 is available'));
    } else {
      console.log(chalk.yellow('⚠️  GPT-OSS 120 not found'));
    }

    if (!gptOss20Available && !gptOss120Available) {
      console.log(chalk.yellow('\n📥 To install GPT-OSS models:\n'));
      
      // For demo purposes, we'll suggest using existing models
      console.log(chalk.white('Option 1: Use existing Ollama models'));
      console.log(chalk.gray('  ollama pull llama2:7b'));
      console.log(chalk.gray('  ollama pull mixtral'));
      
      console.log(chalk.white('\nOption 2: Create model aliases'));
      console.log(chalk.gray('  Create a Modelfile with:'));
      console.log(chalk.gray('  FROM llama2:7b'));
      console.log(chalk.gray('  Then: ollama create gpt-oss-20 -f Modelfile'));
      
      console.log(chalk.white('\n🎓 Or try the AI Academy first:'));
      console.log(chalk.green('  tekimax-sdk learn'));
      console.log(chalk.gray('  Learn about LLMs before running models!\n'));
    }

    console.log(chalk.cyan('═'.repeat(60)));
    return gptOss20Available || gptOss120Available;
  }

  async suggestAlternativeModels() {
    const availableModels = await this.checkAvailableModels();
    
    if (availableModels.length > 0) {
      console.log(chalk.yellow('\n📌 Available models on your system:'));
      availableModels.forEach(model => {
        console.log(chalk.gray(`  • ${model}`));
      });
      
      console.log(chalk.white('\n💡 You can use these models with:'));
      console.log(chalk.green(`  tekimax-sdk generate -m ${availableModels[0]} -p "Your prompt"`));
    } else {
      console.log(chalk.yellow('\n📌 No models found. Pull a model first:'));
      console.log(chalk.gray('  ollama pull llama2'));
      console.log(chalk.gray('  ollama pull mistral'));
      console.log(chalk.gray('  ollama pull phi'));
    }
  }
}