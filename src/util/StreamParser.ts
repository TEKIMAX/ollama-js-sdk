// StreamParser.ts - Utility to parse streaming responses from Ollama API
export interface StreamChunk {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class StreamParser {
  /**
   * Parse a streaming response from Ollama API
   * @param response - Fetch API Response object from streaming request
   * @returns AsyncGenerator that yields each parsed chunk
   */
  static async *parse(response: Response): AsyncGenerator<StreamChunk, void, unknown> {
    if (!response.body) 
      throw new Error('Response body is null');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) 
          break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const chunk = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          
          if (chunk.trim()) {
            try {
              const parsed = JSON.parse(chunk);
              yield parsed as StreamChunk;
            } catch (e) {
              console.error('Error parsing JSON chunk:', chunk);
            }
          }
        }
      }
      
      // Handle any remaining data in buffer
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer);
          yield parsed as StreamChunk;
        } catch (e) {
          console.error('Error parsing final JSON chunk:', buffer);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
  
  /**
   * Collect the full text response from a streaming response
   * @param response - Fetch API Response object from streaming request
   * @returns Promise that resolves to the full text response
   */
  static async collectFullText(response: Response): Promise<string> {
    let fullText = '';
    
    for await (const chunk of this.parse(response)) 
      fullText += chunk.response || '';
    
    return fullText;
  }
} 