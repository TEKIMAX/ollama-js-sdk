// semantic-search.js
// Basic semantic search implementation using Ollama SDK

const { OllamaKit } = require('@tekimax/ollama-sdk');
const fs = require('fs').promises;
const path = require('path');

// Initialize the client
const ollama = new OllamaKit();

// Configuration
const config = {
  embeddingModel: 'nomic-embed-text',
  documentsDir: './documents',
  outputFile: './document-embeddings.json',
  topResults: 3,
};

// Vector utilities
const vectorUtils = {
  // Calculate cosine similarity between two vectors
  cosineSimilarity: (vec1, vec2) => {
    if (!vec1 || !vec2 || vec1.length !== vec2.length) {
      throw new Error('Vectors must be of the same length');
    }
    
    // Calculate dot product
    let dotProduct = 0;
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
    }
    
    // Calculate magnitudes
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    if (mag1 === 0 || mag2 === 0) return 0;
    
    // Cosine similarity
    return dotProduct / (mag1 * mag2);
  },
  
  // Find the most similar documents
  findMostSimilar: (queryEmbedding, documents, topK = 3) => {
    // Calculate similarity scores
    const withScores = documents.map(doc => ({
      ...doc,
      score: vectorUtils.cosineSimilarity(queryEmbedding, doc.embedding),
    }));
    
    // Sort by similarity score (descending)
    const sorted = withScores.sort((a, b) => b.score - a.score);
    
    // Return the top K results
    return sorted.slice(0, topK);
  },
};

// Main functions
async function createDocumentEmbeddings() {
  try {
    console.log(`📚 Creating embeddings for documents in ${config.documentsDir}...`);
    
    // Get all text files in the documents directory
    const files = await fs.readdir(config.documentsDir);
    const textFiles = files.filter(file => file.endsWith('.txt'));
    
    if (textFiles.length === 0) {
      console.log('No text files found in the documents directory.');
      return [];
    }
    
    console.log(`Found ${textFiles.length} text files.`);
    
    // Process each file
    const documents = [];
    
    for (const file of textFiles) {
      const filePath = path.join(config.documentsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Split the content into paragraphs
      const paragraphs = content.split(/\n\s*\n/);
      
      console.log(`Processing ${file}: ${paragraphs.length} paragraphs`);
      
      // Create embeddings for each paragraph
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        if (paragraph.length < 10) continue; // Skip very short paragraphs
        
        console.log(`  Creating embedding for paragraph ${i+1}/${paragraphs.length}`);
        
        const embedding = await ollama.createEmbedding({
          model: config.embeddingModel,
          prompt: paragraph,
        });
        
        documents.push({
          id: `${file}-${i}`,
          file,
          paragraph: i,
          text: paragraph,
          embedding: embedding.embedding,
        });
      }
    }
    
    // Save embeddings to file
    await fs.writeFile(
      config.outputFile, 
      JSON.stringify({ documents, timestamp: new Date().toISOString() }, null, 2)
    );
    
    console.log(`✅ Created ${documents.length} document embeddings.`);
    console.log(`💾 Saved to ${config.outputFile}`);
    
    return documents;
  } catch (error) {
    console.error('Error creating document embeddings:', error);
    throw error;
  }
}

async function searchDocuments(query, documents) {
  try {
    console.log(`🔍 Searching for: "${query}"`);
    
    // Create embedding for the query
    const queryEmbedding = await ollama.createEmbedding({
      model: config.embeddingModel,
      prompt: query,
    });
    
    // Find the most similar documents
    const results = vectorUtils.findMostSimilar(
      queryEmbedding.embedding,
      documents,
      config.topResults
    );
    
    // Display results
    console.log(`\n📊 Top ${results.length} results:`);
    results.forEach((result, index) => {
      console.log(`\n#${index+1} (Score: ${result.score.toFixed(4)}) - ${result.file}:`);
      console.log(`${'─'.repeat(50)}`);
      console.log(result.text);
      console.log(`${'─'.repeat(50)}`);
    });
    
    return results;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    let documents;
    
    // Check if embeddings file exists
    try {
      const data = await fs.readFile(config.outputFile, 'utf-8');
      const parsed = JSON.parse(data);
      documents = parsed.documents;
      console.log(`📂 Loaded ${documents.length} existing document embeddings.`);
      console.log(`   Created: ${parsed.timestamp}`);
    } catch (e) {
      // If file doesn't exist or is invalid, create new embeddings
      console.log('No existing embeddings found. Creating new embeddings...');
      documents = await createDocumentEmbeddings();
    }
    
    if (!documents || documents.length === 0) {
      console.log('No documents available for search. Please add text files to the documents directory.');
      return;
    }
    
    // Interactive search loop
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    const askQuestion = () => {
      readline.question('\n✨ Enter your search query (or type "exit" to quit): ', async (query) => {
        if (query.toLowerCase() === 'exit') {
          console.log('👋 Goodbye!');
          readline.close();
          return;
        }
        
        if (query.trim().length === 0) {
          console.log('Please enter a valid query.');
          askQuestion();
          return;
        }
        
        await searchDocuments(query, documents);
        askQuestion();
      });
    };
    
    console.log('\n🔎 Semantic Search Demo');
    console.log('Enter your questions to search across the document collection.');
    askQuestion();
    
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

main(); 