# UltraLink API Reference

This section provides detailed documentation for UltraLink's API. The API is organized into several functional areas, each with its own set of methods and classes.

## API Structure

The UltraLink API is organized into the following main areas:

1. **Core API**: Essential methods for managing entities and relationships
2. **Vector Operations API**: Methods for working with vector embeddings
3. **Export API**: Methods for exporting knowledge graphs to different formats
4. **LLM Integration API**: Methods for working with language models
5. **Temporal API**: Methods for tracking and analyzing temporal changes
6. **Extension API**: Methods for extending UltraLink with plugins and custom functionality

## Core API

The Core API provides fundamental methods for creating and managing knowledge graphs:

```javascript
// Creating a new UltraLink instance
const graph = new UltraLink(options);

// Entity Management
const entity = graph.createEntity(type, id, attributes);
const retrievedEntity = graph.getEntity(id);
const updatedEntity = graph.updateEntity(id, updates);
const deleted = graph.deleteEntity(id);

// Relationship Management
const link = graph.createLink(sourceId, targetId, type, attributes);
const links = graph.getLinks(entityId);
const updatedLink = graph.updateLink(sourceId, targetId, updates);
const deleted = graph.deleteLink(sourceId, targetId);

// Query Operations
const entities = graph.findEntities({ type, attributes });
const paths = graph.findPaths(sourceId, targetId, options);
```

Learn more in the [Core API Reference](./core-api.md).

## Vector Operations API

The Vector Operations API provides methods for working with vector embeddings:

```javascript
// Adding vector embeddings
graph.addVectorEmbedding(entityId, vector);

// Finding similar entities
const similar = graph.findSimilar(entityId, {
  threshold: 0.7,
  limit: 5
});

// Clustering entities
const clusters = graph.analyzeClusters({
  method: 'kmeans',
  k: 5
});

// Dimensionality reduction for visualization
const reduced = graph.reduceDimensions({
  method: 'tsne',
  dimensions: 2
});
```

Learn more in the [Vector Operations API Reference](./vector-operations.md).

## Export API

The Export API provides methods for exporting knowledge graphs to different formats:

```javascript
// Exporting to JSON
const jsonData = graph.toJSON();

// Exporting to CSV
const csvData = graph.toCSV();

// Exporting to GraphML
const graphMLData = graph.toGraphML();

// Exporting to Obsidian Markdown
const obsidianFiles = graph.toObsidian();

// Exporting to HTML website
const htmlFiles = graph.toHTMLWebsite();

// Exporting to Bayesian Network
const bayesianNetwork = graph.toBayesianNetwork();

// Exporting to KIF
const kifData = graph.toKIF();

// Creating an export stream for large datasets
const exportStream = graph.createExportStream('json', {
  batch_size: 1000,
  compress: true
});
```

Learn more in the [Export API Reference](./export-api.md).

## LLM Integration API

The LLM Integration API provides methods for integrating with language models:

```javascript
// Generating insights for an entity
const insights = await graph.generateInsights(entityId, {
  model: 'gpt-4',
  aspects: ['technical', 'applications', 'limitations']
});

// Updating entities with insights
graph.updateWithInsights(insights, {
  confidence_threshold: 0.8,
  require_evidence: true
});

// Analyzing content to extract entities and relationships
const analysis = await graph.analyzeContent(text, {
  extractEntities: true,
  generateEmbeddings: true,
  inferRelationships: true
});
```

Learn more in the [LLM Integration API Reference](./llm-api.md).

## Temporal API

The Temporal API provides methods for tracking and analyzing temporal changes:

```javascript
// Getting temporal changes for an entity
const changes = graph.getTemporalChanges(entityId, {
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  granularity: 'month'
});

// Tracking knowledge evolution
graph.trackEvolution({
  aspects: ['concepts', 'relationships'],
  timeframe: '6 months'
});

// Getting version history
const history = graph.getVersionHistory(entityId);
```

Learn more in the [Temporal API Reference](./temporal-api.md).

## Extension API

The Extension API provides methods for extending UltraLink with plugins and custom functionality:

```javascript
// Registering a custom entity type
graph.registerEntityType(type, entityClass);

// Registering a plugin
graph.registerPlugin(plugin);

// Registering a custom transformation
graph.registerTransformation(transformation);

// Registering an event listener
graph.on('entity:created', (entity) => {
  console.log(`New entity created: ${entity.id}`);
});
```

Learn more in the [Extension API Reference](./extension-api.md).

## Configuration Options

When creating a new UltraLink instance, you can provide various configuration options:

```javascript
const graph = new UltraLink({
  // Core configuration
  validateOnCreate: true,
  strictMode: true,
  
  // Vector configuration
  vectorDimensions: 768,
  similarityMetric: 'cosine',
  
  // Storage configuration
  storage: {
    type: 'memory', // or 'file', 'indexeddb', etc.
    options: {
      // Storage-specific options
    }
  },
  
  // LLM configuration
  llm: {
    provider: 'openai',
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY
  },
  
  // Event system configuration
  events: {
    captureSourceLocation: false,
    asyncEventEmission: true
  }
});
```

Learn more in the [Configuration Reference](../reference/configuration.md).

## Error Handling

UltraLink uses a consistent error handling approach throughout the API:

```javascript
try {
  const entity = graph.createEntity('invalid-type', 'entity-1', {});
} catch (error) {
  if (error instanceof UltraLink.EntityValidationError) {
    console.error('Validation error:', error.message);
    console.error('Validation details:', error.details);
  } else if (error instanceof UltraLink.StorageError) {
    console.error('Storage error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

Learn more in the [Error Handling Guide](../guides/error-handling.md).

## TypeScript Support

UltraLink includes full TypeScript type definitions:

```typescript
import { UltraLink, Entity, Link, VectorOptions } from 'ultralink';

const graph = new UltraLink();

const entity: Entity = graph.createEntity('person', 'person-1', {
  name: 'Alice',
  age: 30
});

const link: Link = graph.createLink('person-1', 'person-2', 'knows', {
  since: 2020,
  strength: 0.8
});

const vectorOptions: VectorOptions = {
  dimensions: 768,
  metric: 'cosine'
};
```

Learn more in the [TypeScript Guide](../guides/typescript.md).

## Best Practices

When using the UltraLink API, consider these best practices:

1. **Use Typed Entities**: Consistently use entity types to organize your knowledge graph
2. **Meaningful IDs**: Create meaningful, consistent IDs for entities
3. **Structured Attributes**: Use consistent attribute structures for similar entities
4. **Error Handling**: Always handle potential errors, especially for operations that may fail
5. **Batch Operations**: Use batch operations for better performance with large datasets
6. **Event Listeners**: Use event listeners for reactive programming
7. **Proper Cleanup**: Call `graph.dispose()` when you're done to release resources

Learn more in the [API Best Practices Guide](../guides/api-best-practices.md).

## API Stability and Versioning

UltraLink follows semantic versioning:

- **MAJOR** version changes indicate breaking API changes
- **MINOR** version changes add functionality in a backward-compatible manner
- **PATCH** version changes fix bugs in a backward-compatible manner

Methods marked as **@experimental** may change between minor versions. Methods marked as **@deprecated** will be removed in a future version.

## Next Steps

- Explore the [Core API Reference](./core-api.md) to learn about essential methods
- Check out the [Export API Reference](./export-api.md) for exporting your knowledge graphs
- See the [Vector Operations API Reference](./vector-operations.md) for working with embeddings
- Learn about [LLM Integration](./llm-api.md) for AI-enhanced knowledge graphs 