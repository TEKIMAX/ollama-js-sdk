// OpenAI API compatible type definitions

// Common types
export interface OpenAICompatOptions {
  baseUrl?: string;
  apiKey?: string;
}

// Chat types
export type ChatRole = 'system' | 'user' | 'assistant' | 'function' | 'tool';

export interface ChatMessageContent {
  type: string;
  text?: string;
  image_url?: string | { url: string };
}

export interface ChatMessage {
  role: ChatRole;
  content: string | ChatMessageContent[];
  name?: string;
}

export interface ChatCompletionTool {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  stream_options?: {
    include_usage?: boolean;
  };
  presence_penalty?: number;
  frequency_penalty?: number;
  stop?: string | string[];
  seed?: number;
  tools?: ChatCompletionTool[];
  response_format?: {
    type: 'json_object' | 'text';
  };
}

export interface ChatCompletionChoice {
  index: number;
  message: {
    role: ChatRole;
    content: string;
    tool_calls?: Array<{
      id: string;
      type: string;
      function: {
        name: string;
        arguments: string;
      };
    }>;
  };
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Stream response chunk
export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: ChatRole;
      content?: string;
    };
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Completions types
export interface CompletionRequest {
  model: string;
  prompt: string;
  suffix?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  stream_options?: {
    include_usage?: boolean;
  };
  presence_penalty?: number;
  frequency_penalty?: number;
  stop?: string | string[];
  seed?: number;
}

export interface CompletionChoice {
  text: string;
  index: number;
  finish_reason: 'stop' | 'length' | 'content_filter';
}

export interface CompletionResponse {
  id: string;
  object: 'text_completion';
  created: number;
  model: string;
  choices: CompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Embeddings types
export interface EmbeddingRequest {
  model: string;
  input: string | string[];
}

export interface EmbeddingResponse {
  object: 'list';
  data: {
    object: 'embedding';
    embedding: number[];
    index: number;
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

// Models types
export interface Model {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
}

export interface ModelListResponse {
  object: 'list';
  data: Model[];
}
