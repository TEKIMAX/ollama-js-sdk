// chat-app.js
// A command-line chat application using the Ollama SDK

const { OllamaKit } = require('@tekimax/ollama-sdk');
const readline = require('node:readline');
const chalk = require('chalk');

// Initialize the client
const ollama = new OllamaKit();

// Configuration
const config = {
  defaultModel: 'llama2',
  defaultSystemPrompt: 'You are a helpful, friendly assistant. You give concise and accurate responses.',
  temperature: 0.7,
  maxHistoryLength: 10, // Limit history to prevent context overflow
};

// Chat state
const state = {
  history: [],
  model: config.defaultModel,
  systemPrompt: config.defaultSystemPrompt,
  temperature: config.temperature,
};

// Terminal UI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Format messages for display
function formatMessage(role, content) {
  if (role === 'user') {
    return chalk.bold.blue(`You: ${content}`);
  } else if (role === 'assistant') {
    return chalk.bold.green(`Assistant: ${content}`);
  } else if (role === 'system') {
    return chalk.yellow(`[System: ${content}]`);
  }
  return content;
}

// Convert history to a format suitable for the model
function formatHistoryForModel() {
  // Most Ollama models just need the conversation as a single text
  let conversationText = '';
  
  // Add the system prompt at the beginning
  conversationText += `${state.systemPrompt}\n\n`;
  
  // Add conversation history
  for (const message of state.history) {
    if (message.role === 'user') {
      conversationText += `User: ${message.content}\n`;
    } else if (message.role === 'assistant') {
      conversationText += `Assistant: ${message.content}\n`;
    }
  }
  
  return conversationText;
}

// Get response from the model
async function getResponse(userMessage) {
  try {
    // Add user message to history
    state.history.push({ role: 'user', content: userMessage });
    
    // Trim history if too long
    if (state.history.length > config.maxHistoryLength * 2) { // *2 because each exchange has 2 messages
      // Keep system prompt and remove oldest exchanges
      state.history = state.history.slice(-config.maxHistoryLength * 2);
    }
    
    // Format the complete conversation history
    const conversationContext = formatHistoryForModel();
    
    // Get streaming response
    console.log(chalk.dim('Assistant is typing...'));
    
    const stream = await ollama.generateStream({
      model: state.model,
      prompt: userMessage,
      system: state.systemPrompt,
      temperature: state.temperature,
      context: state.history.length > 1 ? undefined : null, // Only use context after first exchange
    });
    
    process.stdout.write(chalk.bold.green('Assistant: '));
    
    let fullResponse = '';
    for await (const chunk of stream) {
      process.stdout.write(chalk.green(chunk.response));
      fullResponse += chunk.response;
    }
    
    console.log('\n');
    
    // Add assistant response to history
    state.history.push({ role: 'assistant', content: fullResponse });
    
    return fullResponse;
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    return null;
  }
}

// Handle commands
function handleCommand(input) {
  const cmd = input.slice(1).split(' ')[0].toLowerCase();
  const args = input.slice(cmd.length + 2).trim();
  
  switch (cmd) {
    case 'help':
      console.log(chalk.cyan('\nAvailable commands:'));
      console.log(chalk.cyan('/help') + ' - Show this help message');
      console.log(chalk.cyan('/model [name]') + ' - Change the model or show current model');
      console.log(chalk.cyan('/system [prompt]') + ' - Change the system prompt or show current system prompt');
      console.log(chalk.cyan('/temp [0.0-1.0]') + ' - Change temperature or show current temperature');
      console.log(chalk.cyan('/clear') + ' - Clear conversation history');
      console.log(chalk.cyan('/exit') + ' - Exit the chat');
      break;
      
    case 'model':
      if (args) {
        state.model = args;
        console.log(chalk.yellow(`Model changed to: ${state.model}`));
      } else {
        console.log(chalk.yellow(`Current model: ${state.model}`));
      }
      break;
      
    case 'system':
      if (args) {
        state.systemPrompt = args;
        console.log(chalk.yellow(`System prompt changed to: "${state.systemPrompt}"`));
      } else {
        console.log(chalk.yellow(`Current system prompt: "${state.systemPrompt}"`));
      }
      break;
      
    case 'temp':
      if (args) {
        const temp = parseFloat(args);
        if (!isNaN(temp) && temp >= 0 && temp <= 1) {
          state.temperature = temp;
          console.log(chalk.yellow(`Temperature changed to: ${state.temperature}`));
        } else {
          console.log(chalk.red('Invalid temperature. Please use a value between 0.0 and 1.0'));
        }
      } else {
        console.log(chalk.yellow(`Current temperature: ${state.temperature}`));
      }
      break;
      
    case 'clear':
      state.history = [];
      console.log(chalk.yellow('Conversation history cleared.'));
      break;
      
    case 'exit':
      console.log(chalk.yellow('Goodbye!'));
      rl.close();
      process.exit(0);
      break;
      
    default:
      console.log(chalk.red(`Unknown command: ${cmd}. Type /help for available commands.`));
  }
}

// Main chat loop
async function startChat() {
  // Display welcome message
  console.log(chalk.bold('🤖 Ollama Chat'));
  console.log(chalk.dim('Type your messages to chat with the AI assistant.'));
  console.log(chalk.dim('Type /help for available commands.'));
  console.log(chalk.dim(`Current model: ${state.model}`));
  console.log(chalk.yellow(`[System: ${state.systemPrompt}]`));
  console.log('');
  
  // Check available models
  try {
    const modelsList = await ollama.listModels();
    const modelNames = modelsList.models.map(m => m.name);
    
    if (!modelNames.includes(state.model)) {
      console.log(chalk.yellow(`Warning: Model '${state.model}' may not be available.`));
      console.log(chalk.yellow(`Available models: ${modelNames.join(', ')}`));
    }
  } catch (error) {
    console.error(chalk.red(`Error checking models: ${error.message}`));
  }
  
  // Start chat loop
  function askQuestion() {
    rl.question(chalk.bold.blue('You: '), async (input) => {
      // Handle empty input
      if (!input.trim()) {
        askQuestion();
        return;
      }
      
      // Handle commands
      if (input.startsWith('/')) {
        handleCommand(input);
        askQuestion();
        return;
      }
      
      // Get response from the model
      await getResponse(input);
      
      // Continue the conversation
      askQuestion();
    });
  }
  
  askQuestion();
}

// Start the chat application
startChat(); 