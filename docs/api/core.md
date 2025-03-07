# UltraLink Core API Reference

This document provides a comprehensive reference for UltraLink's core API, including detailed examples and usage patterns.

## Table of Contents

1. [Entity Management](#entity-management)
2. [Relationship Management](#relationship-management)
3. [Vector Operations](#vector-operations)
4. [Query Engine](#query-engine)
5. [Event System](#event-system)
6. [Configuration](#configuration)

## Entity Management

### Creating Entities

```typescript
interface EntityOptions {
  id?: string;
  type: string;
  attributes?: Record<string, any>;
  metadata?: Record<string, any>;
  vector?: number[];
}

// Basic entity creation
const entity = await ultralink.createEntity({
  type: 'document',
  attributes: {
    title: 'Getting Started',
    content: 'UltraLink is a powerful knowledge graph system...'
  }
});

// Entity with custom ID and metadata
const customEntity = await ultralink.createEntity({
  id: 'doc-123',
  type: 'document',
  attributes: {
    title: 'Advanced Usage'
  },
  metadata: {
    author: 'John Doe',
    created: Date.now()
  }
});

// Entity with vector embedding
const vectorEntity = await ultralink.createEntity({
  type: 'document',
  attributes: {
    content: 'Vector-enabled content'
  },
  vector: await ultralink.generateEmbedding('Vector-enabled content')
});
```

### Retrieving Entities

```typescript
// Get by ID
const entity = await ultralink.getEntity('doc-123');

// Get multiple entities
const entities = await ultralink.getEntities(['doc-123', 'doc-456']);

// Find entities by type
const documents = await ultralink.findEntities({
  type: 'document'
});

// Find entities with query
const results = await ultralink.findEntities({
  type: 'document',
  where: {
    'attributes.title': {
      contains: 'Getting Started'
    }
  },
  sort: {
    'metadata.created': 'desc'
  },
  limit: 10
});
```

### Updating Entities

```typescript
// Update attributes
await ultralink.updateEntity('doc-123', {
  attributes: {
    title: 'Updated Title'
  }
});

// Update metadata
await ultralink.updateEntity('doc-123', {
  metadata: {
    lastModified: Date.now()
  }
});

// Patch update (merge)
await ultralink.patchEntity('doc-123', {
  attributes: {
    tags: ['documentation', 'guide']
  }
});
```

### Deleting Entities

```typescript
// Delete single entity
await ultralink.deleteEntity('doc-123');

// Delete multiple entities
await ultralink.deleteEntities(['doc-123', 'doc-456']);

// Delete by query
await ultralink.deleteEntities({
  type: 'document',
  where: {
    'metadata.status': 'archived'
  }
});
```

## Relationship Management

### Creating Relationships

```typescript
interface RelationshipOptions {
  source: string;
  target: string;
  type: string;
  attributes?: Record<string, any>;
  metadata?: Record<string, any>;
}

// Basic relationship
const rel = await ultralink.createRelationship({
  source: 'doc-123',
  target: 'doc-456',
  type: 'references'
});

// Relationship with attributes
const attrRel = await ultralink.createRelationship({
  source: 'doc-123',
  target: 'doc-456',
  type: 'references',
  attributes: {
    context: 'citation',
    page: 42
  }
});

// Bidirectional relationship
const [rel1, rel2] = await ultralink.createBidirectionalRelationship({
  entity1: 'doc-123',
  entity2: 'doc-456',
  type: 'related'
});
```

### Querying Relationships

```typescript
// Get relationships for entity
const rels = await ultralink.getRelationships('doc-123');

// Get specific relationship type
const refs = await ultralink.getRelationships('doc-123', {
  type: 'references'
});

// Get incoming relationships
const incoming = await ultralink.getIncomingRelationships('doc-123');

// Find paths between entities
const paths = await ultralink.findPaths({
  start: 'doc-123',
  end: 'doc-789',
  maxDepth: 3
});
```

### Updating Relationships

```typescript
// Update attributes
await ultralink.updateRelationship(relId, {
  attributes: {
    strength: 0.8
  }
});

// Update metadata
await ultralink.updateRelationship(relId, {
  metadata: {
    lastVerified: Date.now()
  }
});
```

### Deleting Relationships

```typescript
// Delete single relationship
await ultralink.deleteRelationship(relId);

// Delete by query
await ultralink.deleteRelationships({
  type: 'references',
  where: {
    'attributes.strength': {
      lt: 0.5
    }
  }
});
```

## Vector Operations

### Generating Embeddings

```typescript
// Generate single embedding
const vector = await ultralink.generateEmbedding('Some text content');

// Generate batch embeddings
const vectors = await ultralink.generateEmbeddings([
  'First text',
  'Second text',
  'Third text'
]);

// Generate with specific model
const customVector = await ultralink.generateEmbedding('Content', {
  model: 'custom-embedding-model'
});
```

### Vector Search

```typescript
// Search by content
const results = await ultralink.searchSimilar('Search query', {
  limit: 10,
  threshold: 0.7
});

// Search by vector
const vectorResults = await ultralink.searchByVector(vector, {
  limit: 10,
  threshold: 0.7
});

// Search with filters
const filteredResults = await ultralink.searchSimilar('Query', {
  where: {
    type: 'document',
    'metadata.status': 'published'
  },
  limit: 10
});
```

### Vector Analysis

```typescript
// Cluster entities
const clusters = await ultralink.clusterEntities({
  type: 'document',
  algorithm: 'kmeans',
  numClusters: 5
});

// Calculate similarity
const similarity = await ultralink.calculateSimilarity(
  'doc-123',
  'doc-456'
);

// Find nearest neighbors
const neighbors = await ultralink.findNearestNeighbors('doc-123', {
  limit: 5
});
```

## Query Engine

### Basic Queries

```typescript
// Simple query
const results = await ultralink.query({
  type: 'document',
  where: {
    'attributes.title': {
      contains: 'Guide'
    }
  }
});

// Complex query
const advancedResults = await ultralink.query({
  type: 'document',
  where: {
    AND: [
      {
        'attributes.tags': {
          contains: 'tutorial'
        }
      },
      {
        'metadata.status': 'published'
      },
      {
        OR: [
          {
            'attributes.difficulty': 'beginner'
          },
          {
            'attributes.difficulty': 'intermediate'
          }
        ]
      }
    ]
  },
  sort: {
    'metadata.created': 'desc'
  },
  limit: 20,
  offset: 0
});
```

### Graph Queries

```typescript
// Find connected entities
const connected = await ultralink.query({
  type: 'document',
  traverse: {
    type: 'references',
    direction: 'outgoing',
    depth: 2
  }
});

// Path query
const paths = await ultralink.query({
  path: {
    start: 'doc-123',
    end: 'doc-789',
    relationshipTypes: ['references', 'related'],
    maxDepth: 3
  }
});

// Subgraph query
const subgraph = await ultralink.query({
  subgraph: {
    rootId: 'doc-123',
    depth: 2,
    relationshipTypes: ['references']
  }
});
```

### Aggregation Queries

```typescript
// Count entities
const count = await ultralink.query({
  type: 'document',
  aggregate: {
    count: true
  }
});

// Group by
const groups = await ultralink.query({
  type: 'document',
  aggregate: {
    groupBy: 'attributes.category',
    count: true
  }
});

// Complex aggregation
const stats = await ultralink.query({
  type: 'document',
  aggregate: {
    groupBy: 'attributes.author',
    metrics: {
      count: true,
      avg: 'attributes.rating',
      max: 'metadata.views'
    }
  }
});
```

## Event System

### Subscribing to Events

```typescript
// Entity events
ultralink.on('entity:created', (entity) => {
  console.log('Entity created:', entity.id);
});

ultralink.on('entity:updated', (entity, changes) => {
  console.log('Entity updated:', entity.id, changes);
});

// Relationship events
ultralink.on('relationship:created', (relationship) => {
  console.log('Relationship created:', relationship.id);
});

// Vector events
ultralink.on('vector:generated', (entityId, vector) => {
  console.log('Vector generated for:', entityId);
});

// Query events
ultralink.on('query:executed', (query, results) => {
  console.log('Query executed:', query);
});
```

### Event Patterns

```typescript
// Wildcard patterns
ultralink.on('entity:*', (eventName, data) => {
  console.log('Entity event:', eventName, data);
});

// Multiple events
ultralink.on(['entity:created', 'entity:updated'], (event) => {
  console.log('Entity changed:', event);
});

// Once listener
ultralink.once('entity:created', (entity) => {
  console.log('First entity created:', entity.id);
});
```

### Custom Events

```typescript
// Emit custom event
ultralink.emit('custom:event', {
  type: 'custom',
  data: { /* ... */ }
});

// Listen for custom event
ultralink.on('custom:event', (data) => {
  console.log('Custom event:', data);
});
```

## Configuration

### Initialization

```typescript
const ultralink = new UltraLink({
  // Storage configuration
  storage: {
    adapter: 'memory', // or 'redis', 's3', etc.
    options: {
      // Adapter-specific options
    }
  },

  // Vector configuration
  vector: {
    provider: 'openai',
    options: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'text-embedding-ada-002'
    }
  },

  // LLM configuration
  llm: {
    provider: 'anthropic',
    options: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-opus-20240229'
    }
  },

  // Cache configuration
  cache: {
    enabled: true,
    ttl: 3600,
    maxSize: 1000
  },

  // Plugin configuration
  plugins: [
    new AnalyticsPlugin(),
    new CustomPlugin()
  ]
});
```

### Runtime Configuration

```typescript
// Update configuration
await ultralink.configure({
  cache: {
    ttl: 7200
  }
});

// Get current configuration
const config = ultralink.getConfiguration();

// Reset configuration
await ultralink.resetConfiguration();
```

### Environment Variables

```typescript
// Required environment variables
process.env.ULTRALINK_STORAGE_TYPE = 'redis';
process.env.ULTRALINK_REDIS_URL = 'redis://localhost:6379';
process.env.ULTRALINK_VECTOR_PROVIDER = 'openai';
process.env.OPENAI_API_KEY = 'your-api-key';

// Optional environment variables
process.env.ULTRALINK_CACHE_TTL = '3600';
process.env.ULTRALINK_DEBUG = 'true';
``` 