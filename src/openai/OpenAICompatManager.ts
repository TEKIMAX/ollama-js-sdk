// OpenAICompatManager.ts - Compatibility layer for OpenAI API
import { OllamaClient } from '../client/OllamaClient';
import { StreamParser } from '../util/StreamParser';
import type { 
  OpenAICompatOptions,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChunk,
  CompletionRequest,
  CompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse,
  Model,
  ModelListResponse,
  ChatMessage
} from './types';

import { v4 as uuidv4 } from 'uuid';

export class OpenAICompatManager {
  private client: OllamaClient;
  private baseUrl: string;

  constructor(client: OllamaClient, options: OpenAICompatOptions = {}) {
    this.client = client;
    this.baseUrl = options.baseUrl || 'v1';
    
    // Ensure baseUrl has proper format
    if (!this.baseUrl.startsWith('/'))
      this.baseUrl = `/${this.baseUrl}`;
      
    if (this.baseUrl.endsWith('/'))
      this.baseUrl = this.baseUrl.slice(0, -1);
  }

  // Helper to generate response IDs
  private generateId(prefix: string): string {
    return `${prefix}-${uuidv4()}`;
  }
  
  // Helper to estimate token counts (very rough approximation)
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
  
  // Helper to convert timestamps to unix
  private toUnixTimestamp(date: Date = new Date()): number {
    return Math.floor(date.getTime() / 1000);
  }
  
  // Convert Ollama messages format to OpenAI format
  private convertMessagesToOllama({ messages }: { messages: ChatMessage[] }): {
    prompt: string;
    system?: string;
    images?: Array<{data: string}>;
  } {
    let systemMessage = '';
    const userMessages: string[] = [];
    const images: Array<{data: string}> = [];
    
    for (const message of messages) {
      if (message.role === 'system') {
        systemMessage = message.content as string;
        continue;
      }
      
      if (message.role === 'user') {
        if (typeof message.content === 'string') {
          userMessages.push(message.content);
        } else if (Array.isArray(message.content)) {
          // Handle multimodal content (text + images)
          for (const part of message.content) {
            if (part.type === 'text') 
              userMessages.push(part.text || '');
            else if (part.type === 'image_url') {
              let imageUrl = '';
              
              if (typeof part.image_url === 'string')
                imageUrl = part.image_url;
              else if (typeof part.image_url === 'object')
                imageUrl = part.image_url.url;
                
              // Extract base64 image content
              if (imageUrl.startsWith('data:')) {
                const base64Data = imageUrl.split(',')[1] || '';
                if (base64Data) 
                  images.push({ data: base64Data });
              }
            }
          }
        }
      } else if (message.role === 'assistant' && typeof message.content === 'string') {
        userMessages.push(`Assistant: ${message.content}`);
      }
    }
    
    const result: {
      prompt: string;
      system?: string;
      images?: Array<{data: string}>;
    } = {
      prompt: userMessages.join('\n')
    };
    
    if (systemMessage)
      result.system = systemMessage;
      
    if (images.length > 0)
      result.images = images;
    
    return result;
  }

  // Chat completions endpoint handler
  async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse | ReadableStream> {
    const {
      model,
      messages,
      temperature = 0.7,
      top_p,
      max_tokens,
      stream = false,
      presence_penalty,
      frequency_penalty,
      stop,
      response_format,
      seed,
    } = request;

    const ollamaRequest: Record<string, unknown> = {
      ...this.convertMessagesToOllama({ messages }),
      model,
      stream,
      temperature,
      top_p,
      num_predict: max_tokens,
      stop: Array.isArray(stop) ? stop : stop ? [stop] : undefined,
      seed,
      format: response_format?.type === 'json_object' ? 'json' : undefined
    };
    
    // Remove undefined properties
    for (const [key, value] of Object.entries(ollamaRequest)) {
      if (value === undefined)
        delete ollamaRequest[key];
    }

    // We need to cast here because the Ollama and OpenAI APIs have different formats
    const response = await this.client.models.generate(ollamaRequest as any);

    if (stream)
      return this.handleStreamingChatResponse(response, model);

    return this.formatChatCompletionResponse(response, model, messages);
  }
  
  // Handle streaming chat completions
  private async handleStreamingChatResponse(response: Response, model: string): Promise<ReadableStream> {
    const id = this.generateId('chatcmpl');
    const createdTimestamp = this.toUnixTimestamp();
    
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        // Parse the Ollama chunk
        const data = chunk;
        
        // Format as SSE
        const event: ChatCompletionChunk = {
          id,
          object: 'chat.completion.chunk',
          created: createdTimestamp,
          model,
          choices: [{
            index: 0,
            delta: {
              content: data.response || ''
            },
            finish_reason: data.done ? 'stop' : null
          }]
        };
        
        // Add usage info to final chunk if streamed options include it
        if (data.done && data.total_duration) {
          event.usage = {
            prompt_tokens: Math.ceil(data.prompt_eval_duration || 0),
            completion_tokens: Math.ceil(data.eval_count || 0),
            total_tokens: Math.ceil((data.prompt_eval_duration || 0) + (data.eval_count || 0))
          };
        }
        
        controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
        
        // Send end of stream
        if (data.done)
          controller.enqueue('data: [DONE]\n\n');
      }
    });
    
    // Parse and transform the stream
    const reader = StreamParser.parse(response);
    const writer = transformStream.writable.getWriter();
    
    (async () => {
      try {
        for await (const chunk of reader) {
          await writer.write(chunk);
          if (chunk.done)
            await writer.close();
        }
      } catch (error) {
        console.error('Error processing stream:', error);
        await writer.abort(error);
      }
    })();
    
    return transformStream.readable;
  }
  
  // Format a regular chat completion response
  private formatChatCompletionResponse(
    ollamaResponse: {response?: string}, 
    model: string,
    messages: ChatMessage[]
  ): ChatCompletionResponse {
    const id = this.generateId('chatcmpl');
    const content = ollamaResponse.response || '';
    
    // Estimate token counts
    const promptText = messages.map(m => 
      typeof m.content === 'string' ? m.content : 
      Array.isArray(m.content) ? 
        m.content.filter(c => c.type === 'text').map(c => c.text).join(' ') : 
        ''
    ).join(' ');
    
    const promptTokens = this.estimateTokens(promptText);
    const completionTokens = this.estimateTokens(content);
    
    return {
      id,
      object: 'chat.completion',
      created: this.toUnixTimestamp(),
      model,
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens
      }
    };
  }
  
  // Regular completions endpoint
  async createCompletion(request: CompletionRequest): Promise<CompletionResponse | ReadableStream> {
    const {
      model,
      prompt,
      temperature = 0.7,
      top_p,
      max_tokens,
      stream = false,
      presence_penalty,
      frequency_penalty,
      stop,
      suffix,
      seed
    } = request;
    
    const ollamaRequest: Record<string, unknown> = {
      model,
      prompt,
      stream,
      temperature,
      top_p,
      num_predict: max_tokens,
      stop: Array.isArray(stop) ? stop : stop ? [stop] : undefined,
      seed
    };
    
    // Remove undefined properties
    for (const [key, value] of Object.entries(ollamaRequest)) {
      if (value === undefined)
        delete ollamaRequest[key];
    }
    
    // We need to cast here because the Ollama and OpenAI APIs have different formats
    const response = await this.client.models.generate(ollamaRequest as any);
    
    if (stream)
      return this.handleStreamingCompletionResponse(response, model);
      
    return this.formatCompletionResponse(response, model, prompt, suffix);
  }
  
  // Handle streaming completions
  private async handleStreamingCompletionResponse(response: Response, model: string): Promise<ReadableStream> {
    const id = this.generateId('cmpl');
    const createdTimestamp = this.toUnixTimestamp();
    
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        // Format as SSE
        const event = {
          id,
          object: 'text_completion',
          created: createdTimestamp,
          model,
          choices: [{
            text: chunk.response || '',
            index: 0,
            finish_reason: chunk.done ? 'stop' : null
          }]
        };
        
        controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
        
        // Send end of stream
        if (chunk.done)
          controller.enqueue('data: [DONE]\n\n');
      }
    });
    
    // Parse and transform the stream
    const reader = StreamParser.parse(response);
    const writer = transformStream.writable.getWriter();
    
    (async () => {
      try {
        for await (const chunk of reader) {
          await writer.write(chunk);
          if (chunk.done)
            await writer.close();
        }
      } catch (error) {
        console.error('Error processing stream:', error);
        await writer.abort(error);
      }
    })();
    
    return transformStream.readable;
  }
  
  // Format a regular completion response
  private formatCompletionResponse(
    ollamaResponse: {response?: string}, 
    model: string, 
    prompt: string,
    suffix?: string
  ): CompletionResponse {
    const id = this.generateId('cmpl');
    const text = suffix ? (ollamaResponse.response || '') + suffix : (ollamaResponse.response || '');
    
    // Estimate token counts
    const promptTokens = this.estimateTokens(prompt);
    const completionTokens = this.estimateTokens(text);
    
    return {
      id,
      object: 'text_completion',
      created: this.toUnixTimestamp(),
      model,
      choices: [{
        text,
        index: 0,
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens
      }
    };
  }
  
  // Embeddings endpoint
  async createEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const { model, input } = request;
    
    // Handle single input or array of inputs
    const inputs = Array.isArray(input) ? input : [input];
    const embeddings = [];
    
    // Create embeddings for each input
    for (const [index, text] of inputs.entries()) {
      const response = await this.client.embeddings.create({
        model,
        prompt: text
      });
      
      embeddings.push({
        object: 'embedding' as const,
        embedding: response.embedding,
        index
      });
    }
    
    // Calculate approximate token count
    const totalText = inputs.join(' ');
    const totalTokens = this.estimateTokens(totalText);
    
    return {
      object: 'list',
      data: embeddings,
      model,
      usage: {
        prompt_tokens: totalTokens,
        total_tokens: totalTokens
      }
    };
  }
  
  // List models endpoint
  async listModels(): Promise<ModelListResponse> {
    const ollamaModels = await this.client.models.list();
    
    // Convert to OpenAI format
    const models = ollamaModels.map(model => ({
      id: model.name,
      object: 'model' as const,
      created: Date.parse(model.modified_at) / 1000 || this.toUnixTimestamp(),
      owned_by: 'library'
    }));
    
    return {
      object: 'list',
      data: models
    };
  }
  
  // Retrieve specific model
  async retrieveModel(modelId: string): Promise<Model> {
    try {
      const modelDetails = await this.client.models.show({ name: modelId });
      
      return {
        id: modelId,
        object: 'model',
        created: Date.parse(modelDetails.modified_at) / 1000 || this.toUnixTimestamp(),
        owned_by: 'library'
      };
    } catch (error) {
      // If model doesn't exist, throw a specific error
      throw new Error(`Model '${modelId}' not found`);
    }
  }
  
  // Set up all OpenAI compatible endpoints
  async setupEndpoints(app: {
    get: (path: string, handler: (req: any, res: any) => void) => void,
    post: (path: string, handler: (req: any, res: any) => void) => void
  }): Promise<void> {
    // Health check endpoint
    app.get(this.baseUrl, (req, res) => {
      res.json({ status: 'ok' });
    });
    
    // Chat completions endpoint
    app.post(`${this.baseUrl}/chat/completions`, async (req, res) => {
      try {
        const response = await this.createChatCompletion(req.body);
        
        if (req.body.stream) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          
          if (response instanceof ReadableStream) {
            const reader = response.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
            res.end();
          }
        } else {
          res.json(response);
        }
      } catch (error) {
        console.error('Error in chat completions:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    });
    
    // Completions endpoint
    app.post(`${this.baseUrl}/completions`, async (req, res) => {
      try {
        const response = await this.createCompletion(req.body);
        
        if (req.body.stream) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          
          if (response instanceof ReadableStream) {
            const reader = response.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
            res.end();
          }
        } else {
          res.json(response);
        }
      } catch (error) {
        console.error('Error in completions:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    });
    
    // Embeddings endpoint
    app.post(`${this.baseUrl}/embeddings`, async (req, res) => {
      try {
        const response = await this.createEmbedding(req.body);
        res.json(response);
      } catch (error) {
        console.error('Error in embeddings:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    });
    
    // Models endpoints
    app.get(`${this.baseUrl}/models`, async (req, res) => {
      try {
        const models = await this.listModels();
        res.json(models);
      } catch (error) {
        console.error('Error listing models:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    });
    
    app.get(`${this.baseUrl}/models/:modelId`, async (req, res) => {
      try {
        const model = await this.retrieveModel(req.params.modelId);
        res.json(model);
      } catch (error) {
        console.error(`Error retrieving model ${req.params.modelId}:`, error);
        res.status(404).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    });
  }
} 