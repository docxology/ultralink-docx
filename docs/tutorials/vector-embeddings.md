# Working with Vector Embeddings in UltraLink

This tutorial will guide you through using UltraLink's vector embedding capabilities to enable semantic search, similarity analysis, and clustering in your knowledge graphs.

## Prerequisites

Before starting this tutorial, make sure you have:

- Installed UltraLink core package
- Installed the vector extension: `npm install @ultralink/vector`
- Basic familiarity with UltraLink's core concepts

## Understanding Vector Embeddings

Vector embeddings are numerical representations of entities in a multi-dimensional space where semantic similarity is captured by vector proximity. In UltraLink, vector embeddings enable:

- **Semantic Search**: Find entities based on meaning, not just exact matches
- **Similarity Analysis**: Discover how similar entities are to each other
- **Clustering**: Group similar entities automatically
- **Visualization**: Reduce dimensions for visual representation

## 1. Setting Up Vector Capabilities

First, let's create a UltraLink instance with vector capabilities enabled:

```javascript
const { UltraLink } = require('ultralink');
const { VectorExtension } = require('@ultralink/vector');

// Create a UltraLink instance with vector capabilities
const graph = new UltraLink({
  vectorDimensions: 384, // Dimensions for vector embeddings
  similarityMetric: 'cosine' // Similarity metric (cosine, euclidean, dot)
});

// Register the vector extension
graph.use(VectorExtension);

console.log('UltraLink initialized with vector capabilities');
```

## 2. Adding Entities with Vector Embeddings

Let's add some entities representing research papers and include vector embeddings:

```javascript
// Create research paper entities
const paper1 = graph.createEntity('paper', 'paper-1', {
  title: 'Advances in Knowledge Graph Embedding',
  abstract: 'This paper introduces novel approaches to embedding knowledge graphs in vector spaces to improve semantic search and reasoning capabilities.',
  keywords: ['knowledge graph', 'vector embedding', 'semantic search']
});

const paper2 = graph.createEntity('paper', 'paper-2', {
  title: 'Neural Network Approaches to Knowledge Representation',
  abstract: 'We explore how neural networks can be used to represent and manipulate structured knowledge for reasoning tasks.',
  keywords: ['neural networks', 'knowledge representation', 'reasoning']
});

const paper3 = graph.createEntity('paper', 'paper-3', {
  title: 'Graph Convolutional Networks for Large-Scale Recommendation Systems',
  abstract: 'This research applies graph convolutional networks to recommendation tasks in large-scale systems with millions of users and items.',
  keywords: ['graph convolutional networks', 'recommendation systems', 'large-scale']
});

const paper4 = graph.createEntity('paper', 'paper-4', {
  title: 'Quantum Computing Applications in Machine Learning',
  abstract: 'We investigate how quantum computing can accelerate machine learning algorithms and provide quantum advantages for specific tasks.',
  keywords: ['quantum computing', 'machine learning', 'quantum algorithms']
});
```

## 3. Generating Vector Embeddings

There are three ways to add vector embeddings to entities:

### a. Manual Embedding Assignment

You can directly assign pre-computed vectors:

```javascript
// Assign pre-computed vectors (for example purposes)
// In real applications, these would come from an embedding model
graph.addVectorEmbedding('paper-1', [0.2, 0.5, 0.1, 0.8, 0.3, 0.7, 0.2, 0.1]);
graph.addVectorEmbedding('paper-2', [0.3, 0.4, 0.2, 0.7, 0.1, 0.6, 0.3, 0.2]);
graph.addVectorEmbedding('paper-3', [0.8, 0.2, 0.7, 0.1, 0.6, 0.2, 0.1, 0.3]);
graph.addVectorEmbedding('paper-4', [0.1, 0.3, 0.8, 0.2, 0.5, 0.1, 0.7, 0.4]);
```

### b. Using Local Embedding Models

UltraLink can use local embedding models to generate vectors:

```javascript
const { LocalEmbeddingProvider } = require('@ultralink/vector');

// Create a local embedding provider
const embeddingProvider = new LocalEmbeddingProvider({
  model: 'all-MiniLM-L6-v2', // Popular embedding model
  dimensions: 384
});

// Generate embeddings based on paper abstracts
await graph.generateEmbeddings({
  provider: embeddingProvider,
  entityIds: ['paper-1', 'paper-2', 'paper-3', 'paper-4'],
  textAccessor: (entity) => entity.attributes.abstract,
  batchSize: 2 // Process 2 entities at a time
});

console.log('Embeddings generated for all papers');
```

### c. Using External Embedding Services

You can also use external embedding services like OpenAI:

```javascript
const { OpenAIEmbeddingProvider } = require('@ultralink/vector');

// Create an OpenAI embedding provider
const openaiProvider = new OpenAIEmbeddingProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small'
});

// Generate embeddings using OpenAI
await graph.generateEmbeddings({
  provider: openaiProvider,
  entityIds: ['paper-1', 'paper-2', 'paper-3', 'paper-4'],
  textAccessor: (entity) => entity.attributes.abstract
});
```

## 4. Finding Similar Entities

Now that we have entities with vector embeddings, we can find semantically similar entities:

```javascript
// Find entities similar to paper-1
const similarToPaper1 = graph.findSimilar('paper-1', {
  threshold: 0.7, // Minimum similarity score (0-1)
  limit: 3        // Maximum number of results
});

console.log('Papers similar to "Advances in Knowledge Graph Embedding":');
for (const result of similarToPaper1) {
  const paper = graph.getEntity(result.id);
  console.log(`- ${paper.attributes.title} (similarity: ${result.similarity.toFixed(2)})`);
}
```

### Vector Search with Filters

You can combine vector similarity with attribute filters:

```javascript
// Find papers similar to paper-1 that contain "neural" in the title
const filteredSimilar = graph.findSimilar('paper-1', {
  threshold: 0.6,
  limit: 5,
  filter: {
    attributes: {
      title: { $regex: /neural/i }
    }
  }
});

console.log('\nSimilar papers containing "neural" in the title:');
for (const result of filteredSimilar) {
  const paper = graph.getEntity(result.id);
  console.log(`- ${paper.attributes.title} (similarity: ${result.similarity.toFixed(2)})`);
}
```

## 5. Clustering Similar Entities

UltraLink can automatically cluster entities based on vector similarity:

```javascript
// Cluster papers using K-means
const clusters = graph.analyzeClusters({
  method: 'kmeans',
  k: 2,  // Number of clusters
  entityIds: ['paper-1', 'paper-2', 'paper-3', 'paper-4']
});

// Display clusters
console.log('\nPaper clusters:');
clusters.forEach((cluster, index) => {
  console.log(`\nCluster ${index + 1}:`);
  
  cluster.members.forEach(memberId => {
    const paper = graph.getEntity(memberId);
    console.log(`- ${paper.attributes.title}`);
  });
  
  console.log(`Coherence: ${cluster.coherence.toFixed(2)}`);
});
```

### Using Different Clustering Methods

UltraLink supports multiple clustering algorithms:

```javascript
// DBSCAN clustering (density-based)
const dbscanClusters = graph.analyzeClusters({
  method: 'dbscan',
  epsilon: 0.3,      // Maximum distance between points
  minPoints: 2,      // Minimum points to form a cluster
  entityIds: ['paper-1', 'paper-2', 'paper-3', 'paper-4']
});

// Hierarchical clustering
const hierarchicalClusters = graph.analyzeClusters({
  method: 'hierarchical',
  k: 2,              // Number of clusters
  linkage: 'average', // Linkage method (single, complete, average)
  entityIds: ['paper-1', 'paper-2', 'paper-3', 'paper-4']
});
```

## 6. Dimensionality Reduction for Visualization

To visualize high-dimensional embeddings, we can reduce them to 2D or 3D:

```javascript
// Reduce dimensions to 2D using t-SNE
const reducedDimensions = graph.reduceDimensions({
  method: 'tsne',
  dimensions: 2,
  perplexity: 30,
  iterations: 1000,
  entityIds: ['paper-1', 'paper-2', 'paper-3', 'paper-4']
});

console.log('\n2D coordinates for visualization:');
for (const item of reducedDimensions) {
  const paper = graph.getEntity(item.id);
  console.log(`- ${paper.attributes.title}: [${item.coordinates.join(', ')}]`);
}
```

### Other Dimensionality Reduction Methods

UltraLink supports several dimensionality reduction techniques:

```javascript
// PCA (Principal Component Analysis)
const pcaCoords = graph.reduceDimensions({
  method: 'pca',
  dimensions: 2,
  entityIds: ['paper-1', 'paper-2', 'paper-3', 'paper-4']
});

// UMAP (Uniform Manifold Approximation and Projection)
const umapCoords = graph.reduceDimensions({
  method: 'umap',
  dimensions: 2,
  neighbors: 3,
  minDist: 0.1,
  entityIds: ['paper-1', 'paper-2', 'paper-3', 'paper-4']
});
```

## 7. Creating a Vector Index for Efficient Search

For large knowledge graphs, creating a vector index improves search performance:

```javascript
// Create a vector index
graph.createVectorIndex({
  type: 'hnsw',        // Hierarchical Navigable Small World index
  dimensions: 384,     // Should match your vector dimensions
  maxConnections: 16,  // Maximum connections per node
  efConstruction: 200  // Index build-time parameter
});

// After creating the index, searches will be faster
const quickSearch = graph.findSimilar('paper-1', {
  threshold: 0.7,
  limit: 3
});
```

## 8. Semantic Relationship Analysis

Vector embeddings can help discover implicit semantic relationships:

```javascript
// Discover semantic relationships between papers
const semanticRelationships = graph.discoverSemanticRelationships({
  threshold: 0.8,          // Minimum similarity for relationship
  relationshipType: 'semantically-related',
  entityType: 'paper'      // Only consider paper entities
});

// Create explicit relationships based on semantic similarity
semanticRelationships.forEach(relation => {
  graph.createLink(
    relation.source,
    relation.target,
    'semantically-related',
    { similarity: relation.similarity }
  );
});

console.log(`\nDiscovered ${semanticRelationships.length} semantic relationships`);
```

## 9. Exploring the Vector Space

Let's explore the vector space with more advanced operations:

```javascript
// Find the centroid (average) of all paper vectors
const centroid = graph.computeVectorCentroid({
  entityIds: ['paper-1', 'paper-2', 'paper-3', 'paper-4']
});

// Find papers closest to the centroid
const centralPapers = graph.findSimilarByVector(centroid, {
  threshold: 0.6,
  limit: 2
});

console.log('\nPapers closest to the centroid (most representative):');
for (const result of centralPapers) {
  const paper = graph.getEntity(result.id);
  console.log(`- ${paper.attributes.title} (similarity: ${result.similarity.toFixed(2)})`);
}

// Vector arithmetic: paper1 - paper2 + paper3
const compositionalVector = graph.computeVectorOperation({
  operations: [
    { entityId: 'paper-1', operation: 'add' },
    { entityId: 'paper-2', operation: 'subtract' },
    { entityId: 'paper-3', operation: 'add' }
  ]
});

// Find papers similar to the compositional vector
const compositionalResults = graph.findSimilarByVector(compositionalVector, {
  threshold: 0.6,
  limit: 2
});

console.log('\nPapers similar to the compositional vector (paper1 - paper2 + paper3):');
for (const result of compositionalResults) {
  const paper = graph.getEntity(result.id);
  console.log(`- ${paper.attributes.title} (similarity: ${result.similarity.toFixed(2)})`);
}
```

## 10. Exporting Vector Data

You can export entities with their vector embeddings:

```javascript
// Export to JSON with vector embeddings included
const jsonExport = graph.toJSON({
  includeVectors: true,
  pretty: true
});

// The exported JSON will include vector embeddings for each entity
console.log('\nJSON export with vectors (first 150 characters):');
console.log(jsonExport.substring(0, 150) + '...');

// Export vector space visualization data
const visualizationData = graph.exportVectorVisualization({
  method: 'tsne',
  dimensions: 2,
  format: 'json'
});

console.log('\nVector visualization data generated.');
```

## Complete Example

Here's a complete example that demonstrates the key vector capabilities of UltraLink:

```javascript
const { UltraLink } = require('ultralink');
const { VectorExtension, LocalEmbeddingProvider } = require('@ultralink/vector');

async function main() {
  // Create UltraLink instance with vector capabilities
  const graph = new UltraLink({
    vectorDimensions: 384,
    similarityMetric: 'cosine'
  });
  
  graph.use(VectorExtension);
  
  // Create paper entities
  const papers = [
    {
      id: 'paper-1',
      title: 'Advances in Knowledge Graph Embedding',
      abstract: 'This paper introduces novel approaches to embedding knowledge graphs in vector spaces.'
    },
    {
      id: 'paper-2',
      title: 'Neural Network Approaches to Knowledge Representation',
      abstract: 'We explore how neural networks can be used to represent structured knowledge.'
    },
    {
      id: 'paper-3',
      title: 'Graph Convolutional Networks for Recommendation Systems',
      abstract: 'This research applies graph convolutional networks to recommendation tasks.'
    },
    {
      id: 'paper-4',
      title: 'Quantum Computing Applications in Machine Learning',
      abstract: 'We investigate how quantum computing can accelerate machine learning algorithms.'
    }
  ];
  
  // Add papers to graph
  for (const paper of papers) {
    graph.createEntity('paper', paper.id, {
      title: paper.title,
      abstract: paper.abstract
    });
  }
  
  // Create embedding provider
  const embeddingProvider = new LocalEmbeddingProvider({
    model: 'all-MiniLM-L6-v2',
    dimensions: 384
  });
  
  // Generate embeddings
  await graph.generateEmbeddings({
    provider: embeddingProvider,
    entityIds: papers.map(p => p.id),
    textAccessor: (entity) => entity.attributes.abstract
  });
  
  // Find similar papers
  const similarPapers = graph.findSimilar('paper-1', {
    threshold: 0.7,
    limit: 3
  });
  
  console.log('Papers similar to "Advances in Knowledge Graph Embedding":');
  for (const result of similarPapers) {
    const paper = graph.getEntity(result.id);
    console.log(`- ${paper.attributes.title} (similarity: ${result.similarity.toFixed(2)})`);
  }
  
  // Cluster papers
  const clusters = graph.analyzeClusters({
    method: 'kmeans',
    k: 2,
    entityIds: papers.map(p => p.id)
  });
  
  console.log('\nPaper clusters:');
  clusters.forEach((cluster, index) => {
    console.log(`\nCluster ${index + 1}:`);
    
    cluster.members.forEach(memberId => {
      const paper = graph.getEntity(memberId);
      console.log(`- ${paper.attributes.title}`);
    });
  });
}

main().catch(console.error);
```

## Next Steps

Now that you've learned about vector embeddings in UltraLink, consider exploring:

1. [LLM Integration](./llm-integration.md) - Combine vector embeddings with LLM capabilities
2. [Advanced Querying](./advanced-querying.md) - Complex queries using vector and attribute filtering
3. [Visualization Techniques](./visualization-techniques.md) - Visualize your vector space
4. [Performance Optimization](../performance/vector-optimization.md) - Optimize vector operations for large datasets

With vector embeddings, your knowledge graphs gain semantic understanding, enabling more powerful analysis and discovery capabilities. 