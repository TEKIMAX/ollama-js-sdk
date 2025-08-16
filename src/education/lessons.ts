export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  examples?: string[];
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export const AI_CURRICULUM: Chapter[] = [
  {
    id: 'fundamentals',
    title: '🎓 Chapter 1: AI Fundamentals',
    description: 'Understanding the basics of artificial intelligence and language models',
    lessons: [
      {
        id: 'what-is-llm',
        title: 'What is a Large Language Model (LLM)?',
        description: 'Introduction to LLMs and how they work',
        content: `
# Large Language Models (LLMs)

A Large Language Model is a type of artificial intelligence model that:

## Key Characteristics:
• **Size**: Contains billions of parameters (weights)
• **Training**: Learned from massive text datasets
• **Purpose**: Understands and generates human-like text
• **Architecture**: Based on transformer neural networks

## How LLMs Work:
1. **Input Processing**: Text is broken into tokens
2. **Pattern Recognition**: Model identifies patterns in the tokens
3. **Prediction**: Generates probable next tokens
4. **Output**: Combines tokens into coherent text

## GPT-OSS Models in This SDK:
• **GPT-OSS 20**: 20 billion parameters - Fast and efficient
• **GPT-OSS 120**: 120 billion parameters - More sophisticated responses
        `,
        examples: [
          'Input: "The capital of France is" → Output: "Paris"',
          'Input: "2 + 2 equals" → Output: "4"'
        ],
        quiz: [
          {
            question: 'What does LLM stand for?',
            options: ['Large Learning Machine', 'Large Language Model', 'Linear Language Model', 'Limited Language Model'],
            correctAnswer: 1,
            explanation: 'LLM stands for Large Language Model, which refers to AI models trained on vast amounts of text data.'
          }
        ]
      },
      {
        id: 'what-is-token',
        title: 'What is a Token?',
        description: 'Understanding tokenization in language models',
        content: `
# Tokens: The Building Blocks of Language Models

## Definition:
A **token** is the smallest unit of text that a language model processes.

## Types of Tokens:
• **Word tokens**: Complete words ("hello", "world")
• **Subword tokens**: Parts of words ("un", "believ", "able")
• **Character tokens**: Individual characters
• **Special tokens**: Punctuation, spaces, control characters

## Token Examples:
• "Hello, world!" → ["Hello", ",", " world", "!"] (4 tokens)
• "unbelievable" → ["un", "believ", "able"] (3 tokens)
• "GPT-OSS" → ["GPT", "-", "OSS"] (3 tokens)

## Why Tokens Matter:
1. **Context Window**: Models have token limits (GPT-OSS 20: 8,192 tokens)
2. **Cost**: API pricing often based on token count
3. **Performance**: More tokens = more processing time
4. **Quality**: Token limits affect response length

## Token Estimation:
• English: ~1 token = 4 characters
• Rule of thumb: 1 token ≈ 0.75 words
• 1,000 tokens ≈ 750 words ≈ 1.5 pages
        `,
        examples: [
          'Text: "AI is amazing" → Tokens: ["AI", " is", " amazing"] (3 tokens)',
          'Text: "Temperature=0.7" → Tokens: ["Temperature", "=", "0", ".", "7"] (5 tokens)'
        ]
      },
      {
        id: 'transformer-architecture',
        title: 'Transformer Architecture',
        description: 'The foundation of modern language models',
        content: `
# The Transformer Architecture

## Overview:
Transformers are the neural network architecture behind modern LLMs like GPT.

## Key Components:

### 1. Attention Mechanism
The "self-attention" mechanism allows the model to:
• Focus on relevant parts of the input
• Understand context and relationships
• Process sequences in parallel

### 2. Encoder-Decoder Structure
• **Encoder**: Processes and understands input
• **Decoder**: Generates output
• GPT models use decoder-only architecture

### 3. Multi-Head Attention
• Multiple attention mechanisms working in parallel
• Each "head" learns different relationships
• GPT-OSS 20: 32 attention heads
• GPT-OSS 120: 96 attention heads

### 4. Feed-Forward Networks
• Process information after attention
• Apply non-linear transformations
• Learn complex patterns

## Why Transformers are Revolutionary:
✓ **Parallel Processing**: Unlike RNNs, process all tokens simultaneously
✓ **Long-Range Dependencies**: Connect distant parts of text
✓ **Scalability**: Performance improves with size
✓ **Transfer Learning**: Pre-train once, fine-tune for many tasks
        `,
        quiz: [
          {
            question: 'What is the key innovation of transformer architecture?',
            options: ['Recurrent connections', 'Self-attention mechanism', 'Convolutional layers', 'Random forests'],
            correctAnswer: 1,
            explanation: 'The self-attention mechanism allows transformers to process sequences efficiently and understand context.'
          }
        ]
      }
    ]
  },
  {
    id: 'parameters',
    title: '⚙️ Chapter 2: Model Parameters',
    description: 'Understanding temperature, top-p, and other generation parameters',
    lessons: [
      {
        id: 'temperature',
        title: 'Temperature: Controlling Randomness',
        description: 'How temperature affects model creativity',
        content: `
# Temperature Parameter

## What is Temperature?
Temperature controls the randomness/creativity of model outputs.

## Temperature Scale:
• **0.0**: Deterministic, always picks most likely token
• **0.1-0.3**: Very focused, factual, consistent
• **0.4-0.7**: Balanced creativity and coherence (default: 0.7)
• **0.8-1.0**: Creative, varied, more random
• **1.0+**: Very random, potentially incoherent

## Use Cases by Temperature:

### Low Temperature (0.1-0.3):
✓ Code generation
✓ Factual Q&A
✓ Data extraction
✓ Technical documentation

### Medium Temperature (0.4-0.7):
✓ General conversation
✓ Email writing
✓ Summaries
✓ Explanations

### High Temperature (0.8-1.0):
✓ Creative writing
✓ Brainstorming
✓ Poetry
✓ Story generation

## Mathematical Explanation:
Temperature modifies the probability distribution:
• Lower T: Sharpens distribution (peaks become more pronounced)
• Higher T: Flattens distribution (more options become viable)
        `,
        examples: [
          'Prompt: "The sky is" with temp=0.1 → "blue"',
          'Prompt: "The sky is" with temp=0.9 → "dancing with colors"'
        ]
      },
      {
        id: 'context-window',
        title: 'Context Window',
        description: 'Understanding model memory limits',
        content: `
# Context Window

## Definition:
The context window is the maximum number of tokens a model can process at once.

## GPT-OSS Context Windows:
• **GPT-OSS 20**: 8,192 tokens (~6,000 words)
• **GPT-OSS 120**: 32,768 tokens (~24,000 words)

## What Fits in Context:

### GPT-OSS 20 (8K tokens):
• ~12 pages of text
• A short story
• Multiple code files
• Extended conversations

### GPT-OSS 120 (32K tokens):
• ~50 pages of text
• Small book chapters
• Complete codebases
• Long technical documents

## Context Window Strategies:

### 1. Chunking
Break large documents into smaller pieces

### 2. Summarization
Compress information to fit context

### 3. Sliding Window
Move context window through document

### 4. Hierarchical Processing
Process sections, then combine results

## Important Notes:
⚠️ Exceeding context = information loss
⚠️ Recent context has more influence
⚠️ Longer context = slower processing
        `
      },
      {
        id: 'top-p-top-k',
        title: 'Top-P and Top-K Sampling',
        description: 'Advanced sampling techniques',
        content: `
# Top-P (Nucleus) and Top-K Sampling

## Top-P (Nucleus Sampling):
Controls diversity by limiting cumulative probability.

### How it Works:
1. Order tokens by probability
2. Sum probabilities until reaching P threshold
3. Sample only from this "nucleus"

### Top-P Values:
• **0.1**: Very narrow selection (10% most likely)
• **0.5**: Moderate diversity (50% most likely)
• **0.9**: Wide selection (90% most likely)
• **1.0**: Consider all tokens

## Top-K Sampling:
Limits selection to K most likely tokens.

### How it Works:
1. Select K highest probability tokens
2. Redistribute probabilities
3. Sample from this subset

### Top-K Values:
• **1**: Always pick most likely (greedy)
• **10**: Very focused
• **40**: Balanced (default)
• **100**: More variety
• **∞**: No limit

## Combining Parameters:
Best results often come from combining:
• Temperature: 0.7
• Top-P: 0.9
• Top-K: 40

This provides controlled creativity without chaos!
        `,
        quiz: [
          {
            question: 'What does Top-P=0.9 mean?',
            options: [
              'Use 90 tokens',
              'Sample from tokens covering 90% cumulative probability',
              'Set temperature to 0.9',
              'Use 90% of context window'
            ],
            correctAnswer: 1,
            explanation: 'Top-P=0.9 means sampling from tokens that together represent 90% of the probability mass.'
          }
        ]
      }
    ]
  },
  {
    id: 'embeddings',
    title: '🔢 Chapter 3: Embeddings & Vectors',
    description: 'Understanding text embeddings and vector representations',
    lessons: [
      {
        id: 'what-are-embeddings',
        title: 'What are Embeddings?',
        description: 'Converting text to numbers',
        content: `
# Text Embeddings

## Definition:
Embeddings are numerical representations of text that capture semantic meaning.

## How Embeddings Work:

### 1. Text to Vector
"Hello world" → [0.23, -0.45, 0.67, ..., 0.12]

### 2. Dimensions
• GPT-OSS 20: 4,096 dimensions
• GPT-OSS 120: 8,192 dimensions
• Each dimension captures different aspects

### 3. Semantic Similarity
Similar meanings = Similar vectors
• "dog" ≈ "puppy" (high similarity)
• "dog" ≠ "car" (low similarity)

## Applications:

### Semantic Search
Find documents by meaning, not keywords

### Clustering
Group similar texts together

### Classification
Categorize text based on embeddings

### Recommendation
Find similar content

## Vector Operations:

### Cosine Similarity
Measures angle between vectors (0-1 scale)
• 1.0 = Identical meaning
• 0.5 = Somewhat related
• 0.0 = Unrelated

### Euclidean Distance
Measures straight-line distance
• Smaller = More similar
        `,
        examples: [
          'Text: "Machine learning" → Vector: [0.34, -0.21, ...]',
          'Similarity("cat", "kitten") = 0.89',
          'Similarity("cat", "airplane") = 0.12'
        ]
      }
    ]
  },
  {
    id: 'fine-tuning',
    title: '🎯 Chapter 4: Fine-Tuning & Training',
    description: 'Customizing models for specific tasks',
    lessons: [
      {
        id: 'fine-tuning-basics',
        title: 'Fine-Tuning Fundamentals',
        description: 'Adapting models to your needs',
        content: `
# Fine-Tuning Language Models

## What is Fine-Tuning?
Taking a pre-trained model and training it further on specific data.

## Why Fine-Tune?

### 1. Domain Specialization
Train on medical, legal, or technical texts

### 2. Task Optimization
Improve performance on specific tasks

### 3. Style Adaptation
Match writing style or tone

### 4. Knowledge Injection
Add proprietary or recent information

## Fine-Tuning Process:

### Step 1: Data Preparation
• Collect domain-specific examples
• Format as input-output pairs
• Clean and validate data

### Step 2: Configuration
• Learning rate: 1e-5 to 5e-5
• Batch size: Based on GPU memory
• Epochs: 3-5 typically

### Step 3: Training
• GPT-OSS 20: 2-4 hours on GPU
• GPT-OSS 120: 8-12 hours on GPU

### Step 4: Evaluation
• Test on validation set
• Compare to base model
• Check for overfitting

## Best Practices:
✓ Start with small learning rates
✓ Use at least 100 examples
✓ Monitor training loss
✓ Keep validation set separate
        `
      }
    ]
  },
  {
    id: 'prompting',
    title: '✍️ Chapter 5: Prompt Engineering',
    description: 'Mastering the art of prompting',
    lessons: [
      {
        id: 'prompt-techniques',
        title: 'Advanced Prompting Techniques',
        description: 'Getting better results from LLMs',
        content: `
# Prompt Engineering Techniques

## 1. Zero-Shot Prompting
Direct instruction without examples:
"Translate 'Hello' to Spanish"

## 2. Few-Shot Prompting
Provide examples before the task:
\`\`\`
English: Hello → Spanish: Hola
English: Goodbye → Spanish: Adiós
English: Thank you → Spanish: 
\`\`\`

## 3. Chain-of-Thought (CoT)
Ask model to explain reasoning:
"Let's solve this step by step..."

## 4. Role-Playing
Assign a persona:
"You are an expert Python developer..."

## 5. Structured Output
Request specific format:
"Respond in JSON format with keys: summary, sentiment, keywords"

## Prompt Components:

### Context
Background information

### Instruction
What you want done

### Input
The data to process

### Output Format
How to structure response

## Tips for Better Prompts:
✓ Be specific and clear
✓ Provide context
✓ Use examples
✓ Specify format
✓ Iterate and refine
        `,
        examples: [
          'Bad: "Write about dogs"',
          'Good: "Write a 200-word educational paragraph about golden retriever training techniques for first-time owners"'
        ]
      }
    ]
  }
];

export function getLessonById(chapterId: string, lessonId: string): Lesson | undefined {
  const chapter = AI_CURRICULUM.find(c => c.id === chapterId);
  return chapter?.lessons.find(l => l.id === lessonId);
}

export function searchLessons(query: string): Lesson[] {
  const results: Lesson[] = [];
  const searchTerm = query.toLowerCase();
  
  for (const chapter of AI_CURRICULUM) {
    for (const lesson of chapter.lessons) {
      if (
        lesson.title.toLowerCase().includes(searchTerm) ||
        lesson.description.toLowerCase().includes(searchTerm) ||
        lesson.content.toLowerCase().includes(searchTerm)
      ) {
        results.push(lesson);
      }
    }
  }
  
  return results;
}