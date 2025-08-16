# AI Academy - Complete Course Guide

Welcome to the Tekimax SDK AI Academy! This comprehensive learning platform is built directly into the SDK to help you understand AI and Large Language Models through interactive lessons, examples, and quizzes.

## 🚀 Getting Started

```bash
# Start AI Academy
tekimax-sdk learn
```

## 📚 Complete Course Curriculum

### Chapter 1: AI Fundamentals
Learn the foundational concepts of artificial intelligence and language models.

#### Lesson 1.1: What is a Large Language Model (LLM)?
- **Topics Covered:**
  - Definition and characteristics of LLMs
  - How LLMs process and generate text
  - The role of parameters in model capability
  - Introduction to GPT-OSS 20 and 120

- **Key Concepts:**
  - Billions of parameters as neural network weights
  - Pattern recognition in text
  - Token-based processing
  - Transformer architecture foundation

- **Interactive Elements:**
  - Quiz on LLM fundamentals
  - Examples of LLM input/output

#### Lesson 1.2: Understanding Tokens
- **Topics Covered:**
  - What tokens are and why they matter
  - Types of tokens (word, subword, character)
  - Token limits and context windows
  - Cost implications of token usage

- **Key Concepts:**
  - 1 token ≈ 4 characters ≈ 0.75 words
  - Context window limitations
  - Tokenization strategies
  - Special tokens and their purposes

- **Practical Applications:**
  - Estimating token counts
  - Optimizing prompts for token efficiency

#### Lesson 1.3: Transformer Architecture
- **Topics Covered:**
  - Self-attention mechanism
  - Multi-head attention
  - Encoder-decoder structure
  - Why transformers revolutionized AI

- **Key Concepts:**
  - Parallel processing advantages
  - Long-range dependency handling
  - Scalability with model size
  - Transfer learning capabilities

- **Deep Dive:**
  - GPT-OSS 20: 32 attention heads
  - GPT-OSS 120: 96 attention heads

### Chapter 2: Model Parameters

#### Lesson 2.1: Temperature - Controlling Randomness
- **Temperature Scale:**
  - 0.0: Deterministic, most likely token
  - 0.1-0.3: Focused, factual, consistent
  - 0.4-0.7: Balanced (default: 0.7)
  - 0.8-1.0: Creative, varied
  - 1.0+: Very random, potentially incoherent

- **Use Cases by Temperature:**
  - Low: Code generation, Q&A, data extraction
  - Medium: Conversations, emails, summaries
  - High: Creative writing, brainstorming, poetry

- **Mathematical Understanding:**
  - Probability distribution modification
  - Impact on token selection

#### Lesson 2.2: Context Windows
- **Model Specifications:**
  - GPT-OSS 20: 8,192 tokens (~6,000 words)
  - GPT-OSS 120: 32,768 tokens (~24,000 words)

- **What Fits in Context:**
  - GPT-OSS 20: ~12 pages, short stories, multiple files
  - GPT-OSS 120: ~50 pages, book chapters, complete codebases

- **Strategies:**
  - Chunking large documents
  - Summarization techniques
  - Sliding window approach
  - Hierarchical processing

#### Lesson 2.3: Top-P and Top-K Sampling
- **Top-P (Nucleus Sampling):**
  - Controls diversity via cumulative probability
  - 0.1: Very narrow selection
  - 0.9: Wide selection (recommended)
  - 1.0: Consider all tokens

- **Top-K Sampling:**
  - Limits to K most likely tokens
  - K=1: Greedy selection
  - K=40: Balanced (default)
  - K=100: More variety

- **Best Practices:**
  - Combining Temperature + Top-P + Top-K
  - Recommended: temp=0.7, top_p=0.9, top_k=40

### Chapter 3: Embeddings & Vectors

#### Lesson 3.1: What are Embeddings?
- **Core Concepts:**
  - Text to numerical representation
  - Capturing semantic meaning
  - High-dimensional vectors
  - Similarity measurements

- **Dimensions:**
  - GPT-OSS 20: 4,096 dimensions
  - GPT-OSS 120: 8,192 dimensions

- **Applications:**
  - Semantic search
  - Document clustering
  - Text classification
  - Recommendation systems

- **Vector Operations:**
  - Cosine similarity (0-1 scale)
  - Euclidean distance
  - Dot product calculations

### Chapter 4: Fine-Tuning & Training

#### Lesson 4.1: Fine-Tuning Fundamentals
- **Why Fine-Tune:**
  - Domain specialization
  - Task optimization
  - Style adaptation
  - Knowledge injection

- **Process Overview:**
  1. Data preparation (input-output pairs)
  2. Configuration (learning rate, batch size)
  3. Training (GPU requirements)
  4. Evaluation (validation, overfitting checks)

- **Best Practices:**
  - Start with small learning rates (1e-5 to 5e-5)
  - Use at least 100 examples
  - Monitor training loss
  - Keep validation set separate

- **Time Estimates:**
  - GPT-OSS 20: 2-4 hours on GPU
  - GPT-OSS 120: 8-12 hours on GPU

### Chapter 5: Prompt Engineering

#### Lesson 5.1: Advanced Prompting Techniques
- **Techniques Covered:**

  1. **Zero-Shot Prompting**
     - Direct instruction without examples
     - Example: "Translate 'Hello' to Spanish"

  2. **Few-Shot Prompting**
     - Provide examples before the task
     - Pattern recognition from examples

  3. **Chain-of-Thought (CoT)**
     - Request step-by-step reasoning
     - "Let's solve this step by step..."

  4. **Role-Playing**
     - Assign personas or expertise
     - "You are an expert Python developer..."

  5. **Structured Output**
     - Request specific formats
     - JSON, markdown, tables, lists

- **Prompt Components:**
  - Context: Background information
  - Instruction: What to do
  - Input: Data to process
  - Output Format: How to structure response

## 🎯 Interactive Features

### Quizzes
Each lesson includes interactive quizzes to test your understanding:
- Multiple choice questions
- Immediate feedback
- Explanations for correct answers
- Score tracking

### Search Function
Quickly find topics across all chapters:
```
Search: "temperature"
Results: 
- Chapter 2, Lesson 1: Temperature Control
- Chapter 5: Using temperature in prompts
```

### Quick Reference
Access common conversions and parameters:
- Token estimates
- Parameter ranges
- Model comparisons
- Best practice settings

## 🏆 Learning Path Recommendations

### For Beginners
1. Start with Chapter 1: AI Fundamentals
2. Complete all quizzes
3. Practice with examples
4. Move to Chapter 2: Parameters

### For Developers
1. Quick review of Chapter 1
2. Focus on Chapters 2 & 3
3. Deep dive into Chapter 5: Prompt Engineering
4. Experiment with different parameters

### For Data Scientists
1. Chapter 3: Embeddings & Vectors
2. Chapter 4: Fine-Tuning
3. Advanced sections of Chapter 5

## 📊 Progress Tracking

The AI Academy tracks your progress through:
- Completed lessons
- Quiz scores
- Time spent learning
- Topics searched

## 💡 Tips for Success

1. **Interactive Learning**: Don't just read - try the examples
2. **Take Quizzes**: Test your understanding regularly
3. **Experiment**: Use the SDK to practice concepts
4. **Reference Often**: Keep the quick reference handy
5. **Build Projects**: Apply what you learn

## 🔗 Additional Resources

After completing the AI Academy, explore:
- `tekimax-sdk generate` - Practice with real models
- `tekimax-sdk setup` - Configure your environment
- GitHub examples - See real-world applications
- Community forums - Share and learn

## 🎓 Certification

Complete all chapters and quizzes to receive:
- Completion certificate (printed to console)
- Understanding of core AI concepts
- Practical experience with LLMs
- Ready to build AI applications

---

Start your AI learning journey today with:
```bash
tekimax-sdk learn
```