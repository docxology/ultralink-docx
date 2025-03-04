# Performance Optimization Guide

This guide provides strategies and best practices for optimizing UltraLink performance, especially when working with large datasets or in resource-constrained environments.

## Table of Contents

- [Understanding UltraLink Performance](#understanding-ultralink-performance)
- [Memory Management](#memory-management)
- [Query Optimization](#query-optimization)
- [Export Format Performance](#export-format-performance)
- [Vector Operations](#vector-operations)
- [Large Dataset Strategies](#large-dataset-strategies)
- [Monitoring and Profiling](#monitoring-and-profiling)
- [Benchmarking](#benchmarking)

## Understanding UltraLink Performance

UltraLink's performance characteristics are determined by several factors:

- **Dataset Size**: Number of entities and relationships
- **Operation Type**: Entity creation, relationship queries, exports
- **Data Complexity**: Attribute count, relationship density
- **Hardware Resources**: Available memory, CPU cores

When optimizing UltraLink, focus on the specific performance bottlenecks relevant to your use case.

## Memory Management

UltraLink stores entities and relationships in memory for fast access. For large datasets, memory management becomes critical:

### Memory-Efficient Initialization

```javascript
const ultralink = new UltraLink({
  memory: {
    // Use typed arrays for vector storage
    useTypedArrays: true,
    
    // Pre-allocate space for expected entities
    initialCapacity: 10000,
    
    // Enable lazy loading of relationship data
    lazyLoadRelationships: true
  }
});
```

### Attribute Optimization

- **Limit Attribute Count**: Only store essential attributes
- **Use Appropriate Types**: Numbers use less memory than strings
- **Avoid Deep Object Nesting**: Flatten complex structures

```javascript
// Less efficient
ultralink.addEntity('doc-1', 'document', {
  metadata: {
    author: {
      name: "John Smith",
      contact: {
        email: "john@example.com",
        phone: "555-1234"
      }
    },
    created: "2023-01-15",
    tags: ["important", "reviewed", "published"]
  }
});

// More efficient
ultralink.addEntity('doc-1', 'document', {
  authorName: "John Smith",
  authorEmail: "john@example.com",
  authorPhone: "555-1234",
  created: "2023-01-15",
  tags: "important,reviewed,published"
});
```

### Memory Cleanup

For long-running applications:

```javascript
// Remove unused entities
ultralink.purgeEntities({
  // Remove entities not accessed in 30 days
  lastAccessed: { olderThan: '30d' }
});

// Force garbage collection (Node.js)
if (global.gc) {
  global.gc();
}
```

## Query Optimization

Querying UltraLink efficiently can dramatically improve performance:

### Indexing

```javascript
// Create indexes for frequently queried attributes
ultralink.createIndex('document', 'title');
ultralink.createIndex('document', 'created');

// Create composite index
ultralink.createIndex(['document', 'article'], ['author', 'year']);
```

### Query Strategies

- **Be Specific**: Narrow queries to only what you need
- **Use IDs When Possible**: Direct ID access is fastest
- **Batching**: Process results in batches for large result sets

```javascript
// Less efficient (returns all entities, then filters in memory)
const allDocuments = ultralink.findByType('document');
const recentDocs = allDocuments.filter(doc => 
  doc.attributes.created > '2023-01-01'
);

// More efficient (uses indexes and database-level filtering)
const recentDocs = ultralink.find({
  type: 'document',
  attributes: {
    created: { $gt: '2023-01-01' }
  }
});
```

### Relationship Traversal

- **Limit Depth**: Constrain relationship traversal depth
- **Direction Matters**: Traverse from the smaller side
- **Filter Early**: Apply filters before traversal

```javascript
// More efficient relationship queries
const connections = ultralink.getRelationships('person-1', {
  types: ['knows', 'worked_with'],  // Only specific relationship types
  maxDepth: 2,                    // Limit traversal depth
  attributes: {                   // Filter on relationship attributes
    strength: { $gt: 0.5 }
  }
});
```

## Export Format Performance

Different export formats have different performance characteristics:

| Format | Small Datasets | Large Datasets | Memory Usage |
|--------|----------------|----------------|--------------|
| JSON | Very Fast | Moderate | High |
| GraphML | Fast | Slow | High |
| CSV | Fast | Fast | Low |
| Obsidian | Moderate | Slow | Moderate |
| HTML Website | Slow | Very Slow | Very High |
| Full Blob | Fast | Moderate | High |

### Optimizing Exports

```javascript
// For large datasets, use streaming where possible
const csvStream = ultralink.toCSV({ 
  streaming: true,
  batchSize: 1000  // Process 1000 entities at a time
});

// Use compression for Full Blob exports
const compressedBlob = ultralink.toFullBlob({ 
  compress: true,
  compressionLevel: 9  // Maximum compression
});

// For HTML Website, limit what's included
const htmlWebsite = ultralink.toHTMLWebsite({
  includeVisualization: false,  // Skip visualization for very large datasets
  entityLimit: 5000             // Only include top 5000 entities
});
```

## Vector Operations

Vector operations can be computationally intensive. Optimize them by:

### Hardware Acceleration

```javascript
// Enable hardware acceleration for vector operations
ultralink.configureVectors({
  acceleration: 'gpu',   // Use GPU if available
  precision: 'float32',  // Lower precision for better performance
  cache: true            // Cache vector computations
});
```

### Batch Processing

```javascript
// Generate vectors in batches
await ultralink.generateVectors({
  batchSize: 100,             // Process 100 entities at a time
  concurrency: 4,             // Run 4 batches concurrently
  prioritizeTypes: ['document'] // Process certain types first
});
```

### Dimension Reduction

```javascript
// Use lower dimensions for faster similarity computation
ultralink.configureVectors({
  dimensions: 128,  // Reduced from default 768
  method: 'pca'     // Use PCA for dimension reduction
});
```

## Large Dataset Strategies

For very large datasets (millions of entities), consider these strategies:

### Partitioning

```javascript
// Create separate UltraLink instances for partitions
const partitions = [];
for (let i = 0; i < 10; i++) {
  partitions[i] = new UltraLink({ name: `partition-${i}` });
}

// Distribute entities based on some partitioning logic
function assignPartition(entity) {
  // Simple hash-based partitioning
  const hash = Math.abs(hashString(entity.id));
  return hash % partitions.length;
}

// Add entity to appropriate partition
function addEntityToPartition(entity) {
  const partitionIndex = assignPartition(entity);
  partitions[partitionIndex].addEntity(entity.id, entity.type, entity.attributes);
}
```

### External Storage Integration

```javascript
// Configure external storage for large datasets
const ultralink = new UltraLink({
  storage: {
    type: 'database',
    adapter: 'mongodb',
    options: {
      uri: 'mongodb://localhost:27017/ultralink',
      collection: 'entities'
    }
  }
});
```

### Streaming Processing

```javascript
// Process large datasets with streaming
async function processLargeDataFile(filePath) {
  const stream = createReadStream(filePath)
    .pipe(createParser())
    .on('data', async (item) => {
      stream.pause(); // Pause stream while processing
      await ultralink.addEntity(item.id, item.type, item.attributes);
      stream.resume(); // Resume stream after processing
    });
  
  return new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}
```

## Monitoring and Profiling

To identify performance bottlenecks, monitor UltraLink's operations:

### Memory Monitoring

```javascript
// Enable memory monitoring
ultralink.enableMonitoring({
  memory: true,
  interval: 60000  // Check every minute
});

// Get memory usage report
const memoryUsage = ultralink.getMemoryUsage();
console.log(`Entities: ${memoryUsage.entities.count} (${memoryUsage.entities.bytes} bytes)`);
console.log(`Relationships: ${memoryUsage.relationships.count} (${memoryUsage.relationships.bytes} bytes)`);
console.log(`Vectors: ${memoryUsage.vectors.dimensions}D x ${memoryUsage.vectors.count} (${memoryUsage.vectors.bytes} bytes)`);
```

### Operation Profiling

```javascript
// Enable operation profiling
ultralink.enableProfiling();

// Run operations
await ultralink.findSimilar('doc-1', { minSimilarity: 0.7 });

// Get profiling results
const profile = ultralink.getProfilingResults();
console.log(`Query took ${profile.lastOperation.duration}ms`);
console.log(`Average query time: ${profile.averages.find}ms`);
```

## Benchmarking

UltraLink includes benchmarking tools to evaluate performance:

```javascript
// Run comprehensive benchmark
const benchmarkResults = await ultralink.runBenchmark({
  tests: ['creation', 'query', 'vector', 'export'],
  iterations: 5,
  dataSize: 'medium'  // 'small', 'medium', 'large'
});

// Export benchmark results
fs.writeFileSync(
  'benchmark-results.json', 
  JSON.stringify(benchmarkResults, null, 2)
);
```

The built-in benchmarks test:

- Entity creation performance
- Relationship creation
- Query performance
- Vector operations
- Export operations

## Performance Tuning Checklist

For optimal UltraLink performance:

1. **Upgrade Node.js**: Use the latest LTS version for best performance
2. **Configure Memory**: Set appropriate Node.js memory limits
3. **Create Indexes**: For frequently queried attributes
4. **Optimize Attributes**: Minimize attribute count and complexity
5. **Batch Operations**: Process data in batches
6. **Choose Exports Wisely**: Use the most efficient format for your needs
7. **Compress Data**: Use compression for storage and transfer
8. **Monitor Usage**: Track memory and operation performance
9. **Update Regularly**: Keep UltraLink updated for performance improvements

## Related Resources

- [UltraLink API Reference](../api/README.md)
- [Configuration Guide](../guides/configuration.md)
- [Scaling UltraLink](../advanced/scaling.md)
- [Testing on Large Datasets](../testing/large-datasets.md) 