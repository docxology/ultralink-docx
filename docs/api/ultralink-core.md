# UltraLink Core API

The UltraLink core API provides the fundamental functionality for creating, managing, and exporting knowledge graphs with rich relational data. This document covers the main classes and methods available in the UltraLink core.

## Table of Contents

- [UltraLink](#ultralink)
  - [Constructor](#constructor)
  - [Entity Management](#entity-management)
  - [Relationship Management](#relationship-management)
  - [Data Export](#data-export)
  - [Data Import](#data-import)
  - [Advanced Features](#advanced-features)
- [Configuration Options](#configuration-options)
- [Examples](#examples)

## UltraLink

The main class that represents an UltraLink knowledge graph.

### Constructor

```javascript
/**
 * Create a new UltraLink instance
 * @param {Object} options - Configuration options
 * @param {boolean} options.enableVectors - Whether to enable vector embeddings (default: true)
 * @param {number} options.vectorDimensions - Dimensions for vector embeddings (default: 768)
 * @param {boolean} options.enableTemporal - Whether to track temporal data (default: true)
 * @param {Object} options.storage - Storage configuration
 * @returns {UltraLink} New UltraLink instance
 */
const ultralink = new UltraLink(options);
```

### Entity Management

Methods for managing entities in the knowledge graph.

```javascript
/**
 * Add an entity to the knowledge graph
 * @param {string} id - Unique identifier for the entity
 * @param {string} type - Entity type
 * @param {Object} attributes - Entity attributes
 * @returns {Object} The created entity
 */
ultralink.addEntity(id, type, attributes);

/**
 * Get an entity by ID
 * @param {string} id - Entity ID to retrieve
 * @returns {Object|null} The entity or null if not found
 */
ultralink.getEntity(id);

/**
 * Update an entity's attributes
 * @param {string} id - Entity ID to update
 * @param {Object} attributes - New attributes (partial update)
 * @returns {Object} The updated entity
 */
ultralink.updateEntity(id, attributes);

/**
 * Delete an entity and all its relationships
 * @param {string} id - Entity ID to delete
 * @returns {boolean} True if the entity was deleted
 */
ultralink.deleteEntity(id);

/**
 * Find entities matching criteria
 * @param {Object} criteria - Search criteria
 * @param {string} criteria.type - Entity type to filter by
 * @param {Object} criteria.attributes - Attributes to match
 * @param {Function} criteria.filter - Custom filter function
 * @returns {Array} Matching entities
 */
ultralink.findEntities(criteria);
```

### Relationship Management

Methods for managing relationships between entities.

```javascript
/**
 * Add a relationship between entities
 * @param {string} source - Source entity ID
 * @param {string} target - Target entity ID
 * @param {string} type - Relationship type
 * @param {Object} attributes - Relationship attributes
 * @returns {Object} The created relationship
 */
ultralink.addLink(source, target, type, attributes);

/**
 * Get relationships for an entity
 * @param {string} entityId - Entity ID
 * @param {Object} options - Options
 * @param {string} options.type - Filter by relationship type
 * @param {string} options.direction - Filter by direction ('outgoing', 'incoming', or 'both')
 * @returns {Array} Matching relationships
 */
ultralink.getRelationships(entityId, options);

/**
 * Get incoming relationships (backlinks) for an entity
 * @param {string} entityId - Entity ID
 * @returns {Array} Incoming relationships
 */
ultralink.getBacklinks(entityId);

/**
 * Delete a relationship
 * @param {string} source - Source entity ID
 * @param {string} target - Target entity ID
 * @param {string} type - Relationship type
 * @returns {boolean} True if the relationship was deleted
 */
ultralink.deleteLink(source, target, type);
```

### Data Export

Methods for exporting data to various formats.

```javascript
/**
 * Export to JSON format
 * @param {Object} options - Export options
 * @param {boolean} options.pretty - Whether to format the JSON (default: false)
 * @param {boolean} options.includeVectors - Whether to include vectors (default: false)
 * @returns {string} JSON string
 */
ultralink.toJSON(options);

/**
 * Export to GraphML format
 * @param {Object} options - Export options
 * @param {boolean} options.includeAttributes - Whether to include all attributes (default: true)
 * @param {boolean} options.includeVectors - Whether to include vectors (default: false)
 * @returns {string} GraphML XML string
 */
ultralink.toGraphML(options);

/**
 * Export to CSV format
 * @param {Object} options - Export options
 * @param {boolean} options.includeHeaders - Whether to include column headers (default: true)
 * @param {Array} options.entityAttributes - Entity attributes to include
 * @returns {Object} Object with entities.csv and relationships.csv content
 */
ultralink.toCSV(options);

/**
 * Export to Obsidian markdown format
 * @param {Object} options - Export options
 * @param {boolean} options.frontmatter - Whether to include YAML frontmatter (default: true)
 * @param {boolean} options.backlinks - Whether to include backlinks section (default: true)
 * @returns {Object} Object with filenames as keys and markdown content as values
 */
ultralink.toObsidian(options);

/**
 * Export to HTML website
 * @param {Object} options - Export options
 * @param {string} options.title - Website title
 * @param {string} options.theme - Website theme ('light' or 'dark')
 * @param {Object} options.features - Features to enable/disable
 * @returns {Object} Object with filenames as keys and content as values
 */
ultralink.toHTMLWebsite(options);

/**
 * Export complete data blob
 * @param {Object} options - Export options
 * @param {boolean} options.includeVectors - Whether to include vectors (default: true)
 * @param {boolean} options.includeHistory - Whether to include history (default: true)
 * @param {string} options.compression - Compression type ('none', 'gzip', 'brotli')
 * @returns {Buffer|string} The serialized data
 */
ultralink.toFullBlob(options);
```

### Data Import

Methods for importing data from various sources.

```javascript
/**
 * Import data from JSON
 * @param {string|Object} json - JSON string or parsed object
 * @returns {UltraLink} This instance for chaining
 */
ultralink.fromJSON(json);

/**
 * Import data from GraphML
 * @param {string} graphml - GraphML XML string
 * @returns {UltraLink} This instance for chaining
 */
ultralink.fromGraphML(graphml);

/**
 * Import data from CSV files
 * @param {Object} csv - Object with entities and relationships CSV content
 * @param {string} csv.entities - Entities CSV content
 * @param {string} csv.relationships - Relationships CSV content
 * @returns {UltraLink} This instance for chaining
 */
ultralink.fromCSV(csv);

/**
 * Import from full data blob
 * @param {Buffer|string} blob - The serialized data blob
 * @param {Object} options - Import options
 * @returns {UltraLink} This instance for chaining
 */
ultralink.fromFullBlob(blob, options);
```

### Advanced Features

Advanced functionality for working with UltraLink data.

```javascript
/**
 * Compute vector embeddings for entities
 * @param {Array} entityIds - Entity IDs to compute embeddings for
 * @param {Object} options - Embedding options
 * @returns {Promise<void>} Resolves when embeddings are computed
 */
ultralink.computeEmbeddings(entityIds, options);

/**
 * Find similar entities using vector similarity
 * @param {string} entityId - Reference entity ID
 * @param {Object} options - Similarity options
 * @param {number} options.limit - Maximum number of results
 * @param {number} options.threshold - Similarity threshold
 * @returns {Array} Similar entities with similarity scores
 */
ultralink.findSimilar(entityId, options);

/**
 * Analyze the knowledge graph to extract insights
 * @param {Object} options - Analysis options
 * @returns {Object} Analysis results
 */
ultralink.analyze(options);

/**
 * Run integrity checks on the knowledge graph
 * @param {Object} options - Check options
 * @returns {Object} Integrity check results
 */
ultralink.checkIntegrity(options);

/**
 * Get the change history for an entity
 * @param {string} entityId - Entity ID
 * @param {Object} options - History options
 * @returns {Array} Change history events
 */
ultralink.getHistory(entityId, options);
```

## Configuration Options

The UltraLink constructor accepts various configuration options:

```javascript
const options = {
  // Core options
  enableVectors: true,         // Enable vector embeddings
  vectorDimensions: 768,       // Dimensions for vector embeddings
  enableTemporal: true,        // Track temporal data
  
  // Storage options
  storage: {
    type: 'memory',            // 'memory', 'file', or 'database'
    path: './data',            // For file storage
    connection: { ... }        // For database storage
  },
  
  // Performance options
  indexing: {
    enabled: true,             // Enable indexing
    types: ['entity', 'relationship', 'vector']
  },
  
  // Export defaults
  exportDefaults: {
    includeVectors: false,
    includeHistory: false,
    pretty: true
  }
};

const ultralink = new UltraLink(options);
```

## Examples

### Creating a Knowledge Graph

```javascript
const ultralink = new UltraLink();

// Add entities
ultralink.addEntity('person-1', 'person', {
  name: 'John Doe',
  email: 'john@example.com',
  expertise: ['programming', 'design']
});

ultralink.addEntity('document-1', 'document', {
  title: 'Design Patterns',
  author: 'Gang of Four',
  year: 1994
});

ultralink.addEntity('topic-1', 'topic', {
  name: 'Object-Oriented Programming',
  description: 'Programming paradigm based on objects and classes'
});

// Add relationships
ultralink.addLink('person-1', 'document-1', 'authored', {
  date: '2020-01-15',
  contribution: 'primary'
});

ultralink.addLink('document-1', 'topic-1', 'discusses', {
  relevance: 0.9,
  sections: [1, 3, 5]
});

ultralink.addLink('person-1', 'topic-1', 'knows', {
  proficiency: 'expert',
  years: 10
});
```

### Exporting to Multiple Formats

```javascript
// Export to JSON
const json = ultralink.toJSON({ pretty: true });
fs.writeFileSync('knowledge-graph.json', json);

// Export to GraphML
const graphml = ultralink.toGraphML();
fs.writeFileSync('knowledge-graph.graphml', graphml);

// Export to CSV
const csv = ultralink.toCSV();
fs.writeFileSync('entities.csv', csv.entities);
fs.writeFileSync('relationships.csv', csv.relationships);

// Export to Obsidian
const obsidian = ultralink.toObsidian();
for (const [filename, content] of Object.entries(obsidian)) {
  fs.writeFileSync(`obsidian/${filename}`, content);
}

// Export to HTML website
const website = ultralink.toHTMLWebsite({
  title: 'My Knowledge Graph',
  theme: 'dark'
});
for (const [filename, content] of Object.entries(website)) {
  const filepath = path.join('website', filename);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content);
}

// Export full blob with compression
const blob = await ultralink.toFullBlob({
  compression: 'gzip',
  vectorCompression: 'quantize'
});
fs.writeFileSync('knowledge-graph.ultra.gz', blob);
```

### Finding and Analyzing Data

```javascript
// Find entities by type
const people = ultralink.findEntities({ type: 'person' });

// Find entities by attribute
const documents2023 = ultralink.findEntities({
  type: 'document',
  attributes: { year: 2023 }
});

// Find entities with custom filter
const expertProgrammers = ultralink.findEntities({
  filter: entity => 
    entity.type === 'person' && 
    entity.attributes.expertise?.includes('programming') &&
    ultralink.getRelationships(entity.id, { type: 'knows' })
      .some(rel => rel.attributes.proficiency === 'expert')
});

// Get all relationships for an entity
const personRelationships = ultralink.getRelationships('person-1');

// Get specific relationship types
const authoredDocs = ultralink.getRelationships('person-1', { 
  type: 'authored',
  direction: 'outgoing'
});

// Find similar entities
const similarTopics = await ultralink.findSimilar('topic-1', {
  limit: 10,
  threshold: 0.7
});

// Analyze the knowledge graph
const analysis = ultralink.analyze();
console.log('Network density:', analysis.networkMetrics.density);
console.log('Communities:', analysis.communities.length);
console.log('Central entities:', analysis.centrality.top5);
``` 