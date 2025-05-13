// tools-example.js
// Example of using Ollama with tools for function calling

const { OllamaKit } = require('@tekimax/ollama-sdk');
const fs = require('fs').promises;
const path = require('path');

// Initialize Ollama client
const ollama = new OllamaKit();

// Define tools (can also be loaded from a JSON file)
const tools = [
  {
    type: "function",
    name: "fetch_weather",
    description: "Get the current weather for a location",
    parameters: {
      type: "object",
      required: ["location"],
      properties: {
        location: {
          type: "string",
          description: "The city name, e.g., 'New York' or 'London'"
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
          description: "The temperature unit",
          default: "celsius"
        }
      }
    }
  },
  {
    type: "function",
    name: "search_products",
    description: "Search for products in an online store",
    parameters: {
      type: "object",
      required: ["query"],
      properties: {
        query: {
          type: "string",
          description: "The search query, e.g., 'blue t-shirt'"
        },
        category: {
          type: "string",
          description: "Product category filter",
          enum: ["electronics", "clothing", "books", "home"]
        },
        max_price: {
          type: "number",
          description: "Maximum price filter"
        },
        sort_by: {
          type: "string",
          enum: ["relevance", "price_low_to_high", "price_high_to_low", "newest"],
          default: "relevance"
        }
      }
    }
  }
];

// Mock tool execution functions
async function fetchWeather(params) {
  console.log(`🌤️ Fetching weather for ${params.location}...`);
  // In a real app, this would call a weather API
  return {
    location: params.location,
    temperature: 22,
    unit: params.unit || "celsius",
    condition: "Sunny",
    humidity: 45,
    wind_speed: 10,
    last_updated: new Date().toISOString()
  };
}

async function searchProducts(params) {
  console.log(`🔍 Searching products for: ${params.query}`);
  // In a real app, this would search a product database
  return {
    results: [
      {
        id: "prod-1",
        name: `${params.query} - Product 1`,
        price: 29.99,
        category: params.category || "electronics",
        rating: 4.5,
        in_stock: true
      },
      {
        id: "prod-2",
        name: `${params.query} - Product 2`,
        price: 39.99,
        category: params.category || "electronics",
        rating: 4.2,
        in_stock: true
      }
    ],
    total_results: 2,
    filters_applied: {
      category: params.category,
      max_price: params.max_price,
      sort_by: params.sort_by || "relevance"
    }
  };
}

// Map tool names to their execution functions
const toolExecutors = {
  fetch_weather: fetchWeather,
  search_products: searchProducts
};

// Function to execute a tool
async function executeTool(toolCall) {
  const { name, input } = toolCall;
  
  if (!toolExecutors[name]) {
    return { error: `Tool '${name}' not found` };
  }
  
  try {
    return await toolExecutors[name](input);
  } catch (error) {
    return { error: error.message };
  }
}

// Main function that demonstrates the tools workflow
async function demonstrateTools() {
  console.log("🛠️ Demonstrating Ollama Tools Functionality");
  console.log("===========================================");
  
  // The user prompt that may require tool use
  const prompt = "I need to know the current weather in Paris and also find some good headphones to buy.";
  const model = "llama3"; // or any model that supports tool calling
  
  console.log(`\n📝 User prompt: "${prompt}"`);
  console.log(`🤖 Model: ${model}`);
  console.log(`🧰 Available tools: ${tools.map(t => t.name).join(", ")}\n`);
  
  try {
    console.log("Step 1: Sending initial request to the model...");
    const initialResponse = await ollama.tools.callWithTools({
      model,
      prompt,
      tools,
      temperature: 0.7
    });
    
    console.log(`\n🤖 Model response: "${initialResponse.message.content.trim()}"`);
    
    // Check if any tools were called
    if (initialResponse.message.tool_calls && initialResponse.message.tool_calls.length > 0) {
      console.log(`\n⚡ The model wants to use ${initialResponse.message.tool_calls.length} tools:`);
      
      // Process each tool call
      const toolCalls = initialResponse.message.tool_calls;
      const toolResponses = [];
      
      for (const toolCall of toolCalls) {
        console.log(`\n🔧 Tool: ${toolCall.name}`);
        console.log(`📥 Input: ${JSON.stringify(toolCall.input, null, 2)}`);
        
        // Execute the tool
        console.log(`⚙️ Executing tool...`);
        const toolResult = await executeTool(toolCall);
        console.log(`📤 Result: ${JSON.stringify(toolResult, null, 2)}`);
        
        // Save the tool response
        toolResponses.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: toolCall.name,
          content: JSON.stringify(toolResult)
        });
      }
      
      // Step 3: Send the tool responses back to the model
      console.log("\nStep 3: Sending tool responses back to the model...");
      const followUpResponse = await ollama.tools.executeToolCalls(
        {
          model,
          prompt,
          tools
        },
        toolCalls,
        toolResponses
      );
      
      console.log(`\n🤖 Final model response with tool results:\n\n"${followUpResponse.message.content.trim()}"`);
    } else {
      console.log("\n📢 No tools were called by the model.");
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    
    if (error.message.includes('not supported') || error.message.includes('not found')) {
      console.log("\n⚠️  Note: Tool calling might not be supported by this model or Ollama version.");
      console.log("Make sure you're using a model that supports function/tool calling like Llama 3.");
    }
  }
}

// Execute the demonstration
demonstrateTools().catch(console.error); 