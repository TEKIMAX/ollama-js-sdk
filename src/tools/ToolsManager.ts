import { OllamaClient } from '../client/OllamaClient';

// Tool definition interface
export interface Tool {
  type: string;
  name: string;
  description: string;
  parameters?: any;
}

// Tool response interface
export interface ToolCall {
  id: string;
  type: string;
  name: string; 
  input: Record<string, any>;
}

// Tool calling request options
export interface ToolCallingRequest {
  model: string;
  prompt: string;
  system?: string;
  tools: Tool[];
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  format?: string;
}

// Tool calling response
export interface ToolCallingResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
    tool_calls?: ToolCall[];
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class ToolsManager {
  private client: OllamaClient;

  constructor(client: OllamaClient) {
    this.client = client;
  }

  /**
   * Call a model with specified tools
   */
  async callWithTools(options: ToolCallingRequest): Promise<ToolCallingResponse> {
    const endpoint = '/api/tool';
    
    // Format the request body
    const requestBody = {
      ...options
    };
    
    const response = await this.client.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    return await response.json();
  }
  
  /**
   * Call a model with specified tools and stream the response
   */
  async callWithToolsStream(options: ToolCallingRequest): Promise<ReadableStream<ToolCallingResponse>> {
    if (!options.stream) {
      options.stream = true;
    }
    
    const endpoint = '/api/tool';
    
    // Format the request body
    const requestBody = {
      ...options
    };
    
    const response = await this.client.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    // Return the readable stream for parsing
    return response.body as ReadableStream<ToolCallingResponse>;
  }
  
  /**
   * Execute tool calls with the provided responses and follow up with the model
   */
  async executeToolCalls(
    options: ToolCallingRequest, 
    toolCalls: ToolCall[], 
    toolResponses: Record<string, any>[]
  ): Promise<ToolCallingResponse> {
    const endpoint = '/api/tool/response';
    
    // Format the request body
    const requestBody = {
      ...options,
      tool_calls: toolCalls,
      tool_responses: toolResponses
    };
    
    const response = await this.client.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    return await response.json();
  }
} 