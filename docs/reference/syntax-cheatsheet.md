# UltraLink Syntax Cheat Sheet

This cheat sheet provides a quick reference for the most commonly used UltraLink syntax patterns. For comprehensive documentation, see the [Syntax Reference](./syntax-reference.md).

## Core API

### Initialization

```javascript
// Basic initialization
const { UltraLink } = require('ultralink');
const ultralink = new UltraLink();

// With configuration
const ultralinkWithConfig = new UltraLink({
  preventOverwrite: true,
  timestampEntities: true,
  defaultRelationshipType: 'related_to',
  vectorOptions: {
    model: 'all-MiniLM-L6-v2',
    dimensions: 384
  }
});
```

### Entity Operations

```javascript
// Create entity
ultralink.addEntity(id, type, attributes, [options]);

// Get entity
const entity = ultralink.getEntity(id);

// Update entity
ultralink.updateEntity(id, attributesToUpdate);

// Update specific attributes
ultralink.updateEntityAttributes(id, attributesToUpdate);

// Delete entity
ultralink.deleteEntity(id);
```

### Relationship Operations

```javascript
// Create relationship
ultralink.addRelationship(sourceId, targetId, type, attributes, [options]);
// Alias for addRelationship
ultralink.addLink(sourceId, targetId, type, attributes, [options]);

// Get relationships
const relationships = ultralink.getEntityRelationships(entityId);
const outgoing = ultralink.getEntityOutgoingRelationships(entityId);
const incoming = ultralink.getEntityIncomingRelationships(entityId);

// Update relationship
ultralink.updateRelationship(sourceId, targetId, type, attributesToUpdate);

// Delete relationship
ultralink.deleteRelationship(sourceId, targetId, type);
// Alias for deleteRelationship
ultralink.deleteLink(sourceId, targetId, type);
```

## Entity Examples

### Basic Entity

```javascript
ultralink.addEntity('alice', 'person', {
  name: 'Alice Chen',
  email: 'alice@example.com'
});
```

### Entity with Vector Embedding

```javascript
ultralink.addEntity('neural-networks', 'concept', {
  name: 'Neural Networks',
  description: 'Computational models inspired by the brain'
}, {
  generateVector: true  // Auto-generate embedding
});
```

### Entity with Full Options

```javascript
ultralink.addEntity('research-paper-123', 'research_paper', {
  title: 'Advances in Graph Neural Networks',
  authors: ['Alice Chen', 'Bob Smith'],
  publication_date: '2023-05-15'
}, {
  generateVector: true,
  linkExisting: true,
  temporalTracking: true,
  namespace: 'research.papers',
  vectorOptions: {
    model: 'all-MiniLM-L6-v2',
    dimensions: 384
  }
});
```

## Relationship Examples

### Basic Relationship

```javascript
ultralink.addRelationship('alice', 'project-x', 'manages', {
  start_date: '2023-01-15'
});
```

### Relationship with Full Options

```javascript
ultralink.addRelationship('alice', 'bob', 'collaborates_with', {
  projects: ['project-x', 'project-y'],
  start_date: '2023-01-15'
}, {
  bidirectional: true,
  weight: 0.85,
  temporalTracking: true,
  generateVector: true
});
```

## Type Definitions

### Entity Type Definition

```javascript
ultralink.defineEntityType('research_paper', {
  parent: 'document',
  attributes: {
    title: { type: 'string', required: true },
    authors: { type: 'string[]', required: true },
    publication_date: { type: 'date' },
    abstract: { type: 'text' }
  },
  validators: [
    (entity) => entity.attributes.authors.length > 0 ? null : 'Paper must have at least one author'
  ]
});
```

### Relationship Type Definition

```javascript
ultralink.defineRelationshipType('collaborates_with', {
  sourceTypes: ['person', 'organization'],
  targetTypes: ['person', 'organization'],
  attributes: {
    projects: { type: 'string[]' },
    start_date: { type: 'date' },
    end_date: { type: 'date' }
  },
  symmetric: true,
  validators: [
    (rel) => rel.source !== rel.target ? null : 'Self-collaboration is not allowed'
  ]
});
```

## Query Operations

### Find Entities

```javascript
// By type
const people = ultralink.findEntities({ type: 'person' });

// By attribute value
const activeProjects = ultralink.findEntities({
  type: 'project',
  attributes: {
    status: 'active'
  }
});

// With complex conditions
const seniorEngineers = ultralink.findEntities({
  type: 'person',
  attributes: {
    title: { $regex: /senior/i },
    skills: { $contains: 'JavaScript' },
    years_experience: { $gte: 5 }
  }
});

// With logical operators
const candidates = ultralink.findEntities({
  $or: [
    { 
      type: 'person',
      attributes: { skills: { $contains: 'React' } }
    },
    {
      type: 'person',
      attributes: { skills: { $contains: 'Angular' } }
    }
  ]
});

// With custom filter function
const customFiltered = ultralink.findEntities({
  filter: (entity) => {
    return entity.type === 'person' && 
           entity.attributes.skills.includes('JavaScript') &&
           entity.attributes.years_experience > 5;
  }
});
```

### Find Relationships

```javascript
// By type
const collaborations = ultralink.findRelationships({ type: 'collaborates_with' });

// For specific entities
const aliceCollaborations = ultralink.findRelationships({
  type: 'collaborates_with',
  sourceEntity: { id: 'alice' }
});

// With attribute conditions
const recentCollaborations = ultralink.findRelationships({
  type: 'collaborates_with',
  attributes: {
    start_date: { $gte: '2023-01-01' }
  }
});
```

### Vector Similarity Search

```javascript
// Find similar to entity
const similarConcepts = await ultralink.findSimilar('neural-networks', {
  threshold: 0.7,
  limit: 5,
  types: ['concept']
});

// Find similar to text query
const searchResults = await ultralink.findSimilarToText(
  'machine learning applications in healthcare', 
  {
    threshold: 0.65,
    limit: 10,
    types: ['research_paper', 'concept']
  }
);

// Find similar with custom vector
const customVectorResults = await ultralink.findSimilarToVector(
  customVector,
  {
    threshold: 0.6,
    limit: 5
  }
);
```

### Path Queries

```javascript
// Find paths between entities
const paths = await ultralink.findPaths({
  start: 'alice',
  end: 'dave',
  maxDepth: 3
});

// Find shortest path
const shortestPath = await ultralink.findShortestPath('alice', 'dave');
```

## UQL Text Queries

```javascript
// Basic query
const results = await ultralink.query(`
  MATCH (person:person)-[r:works_on]->(project:project)
  WHERE project.attributes.status = 'active'
  RETURN person, project
`);

// Path query
const pathResults = await ultralink.query(`
  MATCH path = (person:person)-[*1..3]-(other:person)
  WHERE person.id = 'alice'
  RETURN path
`);

// Aggregation
const teamSizes = await ultralink.query(`
  MATCH (person:person)-[:works_on]->(project:project)
  RETURN project.attributes.name, COUNT(person) as team_size
  ORDER BY team_size DESC
`);
```

## Export Operations

```javascript
// Export to JSON
const jsonOutput = ultralink.toJSON({ pretty: true });

// Export to CSV
const csvOutput = ultralink.toCSV({
  delimiter: ',',
  attributesAsColumns: true
});

// Export to GraphML
const graphmlOutput = ultralink.toGraphML({
  includeAttributes: true
});

// Export to Obsidian
const obsidianOutput = ultralink.toObsidian({
  backlinks: true,
  includeTags: true
});

// Export to HTML website
const htmlOutput = ultralink.toHTMLWebsite({
  title: 'Knowledge Graph',
  includeSearch: true
});

// Export to visualization
const visualizationOutput = await ultralink.toVisualization({
  format: 'svg',
  layout: 'force',
  width: 800,
  height: 600
});
```

## Common Patterns

### Adding Type and Relationship in Sequence

```javascript
// Define type first
ultralink.defineEntityType('research_paper', {
  attributes: {
    title: { type: 'string', required: true },
    // ... more attributes
  }
});

// Then add entity
ultralink.addEntity('paper-123', 'research_paper', {
  title: 'My Research Paper',
  // ... more attributes
});
```

### Bidirectional Relationships

```javascript
// Method 1: Use bidirectional option
ultralink.addRelationship('alice', 'bob', 'collaborates_with', {
  project: 'project-x'
}, {
  bidirectional: true
});

// Method 2: Define symmetric relationship type
ultralink.defineRelationshipType('collaborates_with', {
  symmetric: true,
  // ... other properties
});

// Method 3: Create two explicit relationships
ultralink.addRelationship('alice', 'bob', 'collaborates_with', { project: 'project-x' });
ultralink.addRelationship('bob', 'alice', 'collaborates_with', { project: 'project-x' });
```

### Working with Vector Embeddings

```javascript
// Generate embedding during creation
ultralink.addEntity('concept-123', 'concept', {
  name: 'Graph Neural Networks',
  description: 'A powerful deep learning architecture...'
}, {
  generateVector: true
});

// Get or compute vector for entity
const vector = await ultralink.getEntityVector('concept-123');

// Generate vector from text
const textVector = await ultralink.generateVector('Description of concept...');
```

### Temporal Operations

```javascript
// Create entity with temporal tracking
ultralink.addEntity('project-x', 'project', {
  name: 'Project X',
  status: 'planning'
}, {
  temporalTracking: true
});

// Update tracked entity
ultralink.updateEntity('project-x', {
  status: 'active',
  team_size: 5
});

// Get historical state
const historicalState = await ultralink.getEntityStateAt(
  'project-x', 
  new Date('2023-03-15')
);

// Get changes over time
const changes = await ultralink.getEntityChanges(
  'project-x',
  new Date('2023-01-01'),
  new Date('2023-06-30')
);
```

For full documentation, see the [Syntax Reference](./syntax-reference.md) and [API Usage Guide](../API_USAGE.md). 