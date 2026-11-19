# UltraLink API Usage Guide

This document provides detailed examples and usage patterns for the UltraLink knowledge graph management system.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Entities](#creating-entities)
3. [Managing Relationships](#managing-relationships)
4. [Querying the Knowledge Graph](#querying-the-knowledge-graph)
5. [Exporting Data](#exporting-data)
6. [Visualization](#visualization)
7. [Integrity Checking](#integrity-checking)
8. [Advanced Features](#advanced-features)

## Getting Started

Follow the [source checkout setup](./README.md#getting-started). Put this setup block at the top of a `.cjs` file in the repository root, append the example you want to run, and run the file with `node`:

```javascript
const { UltraLink } = require('.');

// Create a new UltraLink instance with default config
const ultralink = new UltraLink();

// Or with custom configuration
const ultralinkWithConfig = new UltraLink({
  preventOverwrite: false,
  timestampEntities: true,
  defaultRelationshipType: 'related_to'
});
```

## Creating Entities

Entities are the nodes in your knowledge graph. Each entity has an ID, type, and attributes.
Start with the [setup block](#getting-started) above.

```javascript
// Basic entity creation
ultralink.addEntity('alan-turing', 'person', {
  name: 'Alan Turing',
  birthDate: '1912-06-23',
  occupation: 'Mathematician'
});

// You can use any string as the ID
ultralink.addEntity('Cambridge University', 'institution', {
  founded: 1209,
  location: 'Cambridge, UK'
});

// Retrieve an entity by ID
const alanTuring = ultralink.getEntity('alan-turing');
console.log(alanTuring.attributes.name); // "Alan Turing"

// Update an entity
ultralink.updateEntity('alan-turing', {
  deathDate: '1954-06-07',
  awards: ['OBE']
});

// Delete an entity
ultralink.deleteEntity('some-entity-id');
```

## Managing Relationships

Relationships (links) connect entities in your knowledge graph.

```javascript
// Create a relationship between two entities
ultralink.addLink('alan-turing', 'Cambridge University', 'studied_at', {
  years: '1931-1934',
  degree: 'Mathematics'
});

// The addRelationship method is identical to addLink
ultralink.addRelationship('alan-turing', 'Cambridge University', 'studied_at', {
  years: '1931-1934'
});

// Creating bidirectional relationships (two separate links)
ultralink.addLink('alan-turing', 'john-von-neumann', 'collaborated_with');
ultralink.addLink('john-von-neumann', 'alan-turing', 'collaborated_with');

// Get relationships for an entity
const turingRelationships = ultralink.getEntityRelationships('alan-turing');

// Delete a relationship
ultralink.deleteLink('alan-turing', 'Cambridge University', 'studied_at');
```

Combined relationship lookups return a self-loop once; it still appears in
both the outgoing and incoming directional lookups.

`updateRelationship(id, { type })` keeps the relationship ID. `deleteLink`
matches the source, target, and type used to insert the edge, not its current
type. It returns `false` when that insertion tuple no longer exists, even if
another edge now has that type. To select by current type, first query the
relationships, then pass the selected edge's ID to `deleteRelationship(id)`.

The legacy `ultralink.links` map retains one entry per `target-insertionType`
key. If distinct edges share that key, it shows the latest write and restores
the latest surviving edge when that entry is removed. Deleting the last
outgoing edge leaves the source's map empty until the source is deleted. Use
`getEntityRelationships(sourceId, { direction: 'outgoing' })` to enumerate
every outgoing edge. `createSubset(...).links` also uses a flattened legacy
key, so it cannot represent both edges with the same key. Making either map
lossless would require a new key or value contract.

Default `toJSON()` keeps the published entity and relationship row fields.
For an archive with stored relationship IDs and row metadata, use
`new UltraLink().fromFullBlob(ultralink.toJSON({ lossless: true }))` or pass
the result of `ultralink.toFullBlob()`. Both preserve distinct relationships
whose current tuples are identical after retyping, including lookup order.
Both imports use the receiver's public `addEntity`, `addLink`, and
`addRelationship` methods. Unversioned graphs ignore row IDs and derive IDs
from the tuples accepted by the receiver. The last row owns each compound ID;
earlier rows get distinct recovery IDs but keep their `target-type` legacy keys.
An override that stores an entity under the requested ID or delegates a
single relationship insertion need not return it. If a relationship override
inserts multiple edges, it must return the accepted edge to bind archive ID
and metadata. Other writes keep their ordinary overwrite behavior. If an
override throws, the error propagates without binding that row's archive fields.
Imported authored graph metadata replaces matching top-level keys and leaves
other receiver keys intact. The automatic export summary is ignored.

## Querying the Knowledge Graph

UltraLink provides methods to search and filter entities and relationships.

```javascript
// Find entities by type
const allPeople = ultralink.findEntities({ type: 'person' });

// Find entities by attribute value
const britishPeople = ultralink.findEntities({
  type: 'person',
  attributes: { nationality: 'British' }
});

// Find entities with a custom filter function
const peopleOver30 = ultralink.findEntities({
  filter: entity => 
    entity.type === 'person' && 
    entity.attributes.age > 30
});

// Find relationships
const studiedAtRelationships = ultralink.findRelationships({
  type: 'studied_at'
});

// Get backlinks (relationships where the entity is the target)
const backlinks = ultralink.getBacklinks('Cambridge University');
```

## Exporting Data

Use the `ultralink` instance from [Getting Started](#getting-started) after [adding entities](#creating-entities). The methods below return data in different formats.

```javascript
// Export to JSON
const jsonOutput = ultralink.toJSON({ pretty: true });

// Return CSV strings keyed by filename, including entities.csv and relationships.csv.
// This does not write files to disk.
const csvOutput = ultralink.toCSV();

// Export to GraphML (for graph visualization tools)
const graphmlOutput = ultralink.toGraphML();

// Export to Obsidian markdown (for Obsidian knowledge base)
const obsidianOutput = ultralink.toObsidian();

// Export to HTML website
const htmlOutput = ultralink.toHTMLWebsite({
  title: 'My Knowledge Graph',
  description: 'A web visualization of my knowledge graph',
  theme: 'light'
});

// Export to KIF (Knowledge Interchange Format)
const kifOutput = ultralink.toKIF();

// Export the full blob as a JSON string
const fullBlobOutput = ultralink.toFullBlob({ compressed: true });
```

## Visualization

UltraLink provides powerful visualization capabilities.

```javascript
// Generate SVG visualization
const svgVisualization = await ultralink.toVisualization({
  format: 'svg',
  layout: 'force',
  style: 'default',
  width: 800,
  height: 600
});

// Generate PNG visualization
const pngVisualization = await ultralink.toVisualization({
  format: 'png',
  layout: 'radial',
  style: 'colorful',
  width: 1200,
  height: 900,
  title: 'My Knowledge Graph Visualization'
});

// Generate D3.js interactive visualization
const d3Visualization = await ultralink.toVisualization({
  format: 'd3',
  includeControls: true,
  title: 'Interactive Knowledge Graph',
  description: 'Explore the connections in this knowledge graph'
});

// Generate Cytoscape.js interactive visualization
const cytoscapeVisualization = await ultralink.toVisualization({
  format: 'cytoscape',
  style: 'default',
  layout: 'cluster',
  includeControls: true
});
```

Available visualization options:
- **format**: 'svg', 'png', 'd3', 'cytoscape'
- **layout**: 'force', 'radial', 'grid', 'cluster'
- **style**: 'default', 'colorful', 'grayscale', 'minimal'

## Integrity Checking

UltraLink provides tools to check and maintain the integrity of your knowledge graph.

```javascript
// Run basic integrity checks
const basicCheckResults = ultralink.checkIntegrity();
console.log(`Integrity check passed: ${basicCheckResults.passed}`);
console.log(`Issues found: ${basicCheckResults.issues.length}`);

// Run more detailed checks
const advancedCheckResults = ultralink.checkIntegrity({
  checkForOrphans: true,
  validateRelationships: true,
  validateSchemas: true,
  repairAutomatically: false
});

// Repair integrity issues
if (advancedCheckResults.issues.length > 0) {
  const repairResults = ultralink.repairIntegrityIssues(advancedCheckResults.issues);
  console.log(`Repairs succeeded: ${repairResults.succeeded}`);
}
```

## Advanced Features

### Schema Validation

You can define schemas for entity types to enforce data quality:

```javascript
const schema = {
  person: {
    required: ['name', 'birthDate'],
    optional: ['deathDate', 'nationality', 'occupation']
  },
  publication: {
    required: ['title', 'year'],
    optional: ['journal', 'authors', 'abstract']
  }
};

const ultralinkWithSchema = new UltraLink({ schema });

// This will throw an error if required fields are missing
ultralinkWithSchema.addEntity('turing-paper', 'publication', {
  title: 'Computing Machinery and Intelligence',
  year: 1950,
  journal: 'Mind'
});
```

### Bayesian Network Export

You can export your knowledge graph as a Bayesian network:

```javascript
const bayesianNetwork = ultralink.toBayesianNetwork({
  format: 'json'
});

// Or in BIF format
const bifNetwork = ultralink.toBayesianNetwork({
  format: 'bif'
});
```

### RxInfer Model Generation

UltraLink can generate Julia code for use with the RxInfer probabilistic programming library:

```javascript
const rxinferModel = ultralink.toRxInfer({
  format: 'model'
});

// With constraints
const constrainedModel = ultralink.toRxInfer({
  format: 'model-with-constraints'
});

// With test code
const testableModel = ultralink.toRxInfer({
  format: 'model-with-test'
});
```

## Common Mistakes and Fixes

### Incorrect API Usage

❌ **Incorrect**:
```javascript
// These methods don't exist
ultralink.createEntity('person', 'Alan Turing', { name: 'Alan Turing' });
ultralink.createLink('Alan Turing', 'Cambridge', 'studied_at');
```

✅ **Correct**:
```javascript
// These are the correct method names
ultralink.addEntity('Alan Turing', 'person', { name: 'Alan Turing' });
ultralink.addLink('Alan Turing', 'Cambridge', 'studied_at');
```

### Parameter Order

❌ **Incorrect**:
```javascript
// Incorrect parameter order
ultralink.addEntity('person', 'Alan Turing', { name: 'Alan Turing' });
```

✅ **Correct**:
```javascript
// Correct parameter order: id, type, attributes
ultralink.addEntity('Alan Turing', 'person', { name: 'Alan Turing' });
```

### Exporting Data

❌ **Incorrect**:
```javascript
// This method doesn't exist
const obsidianOutput = ultralink.exportAll('obsidian');
```

✅ **Correct**:
```javascript
// Use the specific export method
const obsidianOutput = ultralink.toObsidian();
``` 