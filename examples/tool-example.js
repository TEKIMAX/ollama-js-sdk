// Tool-calling example using @tekimax/ollama-sdk
const { OllamaClient } = require('../dist');

async function runToolExample() {
  console.log('📖 Ollama SDK Tool Calling Demo');
  console.log('============================\n');

  // Create an instance of the Ollama SDK
  const ollama = new OllamaClient();

  // Define a simple calculator tool
  const calculatorTool = {
    type: "function",
    name: "calculator",
    description: "A simple calculator that can add, subtract, multiply, and divide numbers",
    parameters: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
          description: "The operation to perform"
        },
        x: {
          type: "number",
          description: "The first number"
        },
        y: {
          type: "number",
          description: "The second number"
        }
      },
      required: ["operation", "x", "y"]
    }
  };

  // Define a weather lookup tool
  const weatherTool = {
    type: "function",
    name: "get_weather",
    description: "Get the current weather in a location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g., San Francisco, CA"
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
          description: "The unit of temperature"
        }
      },
      required: ["location"]
    }
  };

  try {
    // Call a model with the calculator tool
    console.log('🤖 Asking LLM to solve a math problem...\n');
    
    // Get the tools manager from the client
    const toolsManager = ollama.tools;
    
    const response = await toolsManager.callWithTools({
      model: "llama3",  // Make sure you have llama3 or another suitable model pulled
      prompt: "What is 24 * 15?",
      tools: [calculatorTool],
      temperature: 0.7
    });

    console.log('🔄 Model Response:');
    console.log(JSON.stringify(response.message, null, 2));
    console.log('\n');

    // If the model made tool calls, we would process them here
    if (response.message.tool_calls && response.message.tool_calls.length > 0) {
      const toolCall = response.message.tool_calls[0];
      console.log('🔧 Tool Call:');
      console.log(`Tool: ${toolCall.name}`);
      console.log(`Input: ${JSON.stringify(toolCall.input)}`);
      
      // Execute the calculator function
      let result;
      if (toolCall.name === 'calculator') {
        const { operation, x, y } = toolCall.input;
        
        switch(operation) {
          case 'add': result = x + y; break;
          case 'subtract': result = x - y; break;
          case 'multiply': result = x * y; break;
          case 'divide': result = x / y; break;
        }
        
        console.log(`Result: ${result}`);
        
        // Send the result back to the model
        const followUpResponse = await toolsManager.executeToolCalls(
          {
            model: "llama3",
            prompt: "What is 24 * 15?",
            tools: [calculatorTool]
          },
          [toolCall],
          [{ result }]
        );
        
        console.log('\n🤖 Follow-up Response:');
        console.log(followUpResponse.message.content);
      }
    } else {
      console.log('The model calculated the result directly without using tools.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
runToolExample().catch(console.error); 