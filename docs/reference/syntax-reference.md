# UltraLink Syntax Reference

This document provides a comprehensive reference for UltraLink's syntax conventions, notation, and implementation details. It serves as the authoritative guide for understanding and using UltraLink's syntax correctly.

## Table of Contents

1. [Core Syntax Elements](#core-syntax-elements)
2. [Entity Syntax](#entity-syntax)
3. [Relationship Syntax](#relationship-syntax)
4. [Attribute Syntax](#attribute-syntax)
5. [Type Definition Syntax](#type-definition-syntax)
6. [Query Syntax](#query-syntax)
7. [Vector Operation Syntax](#vector-operation-syntax)
8. [Temporal Operation Syntax](#temporal-operation-syntax)
9. [Expression Syntax](#expression-syntax)
10. [Notation Conventions](#notation-conventions)

## Core Syntax Elements

UltraLink's syntax is built around these fundamental elements:

### Identifiers

```javascript
// Valid identifiers
"entity-123"           // String with hyphens
"document_456"         // String with underscores
"person.alice"         // String with dots
"concept:ai"           // String with colons

// Special identifiers
"@root"                // Built-in reference to root node
"@system.settings"     // System namespace
"@temp.calculation"    // Temporary namespace
```

### Namespaces

```javascript
// Namespace usage
"domain.entity.subtype"   // Dot notation for namespaces
"system::component"       // Alternative namespace separator
"@reserved.entity"        // Reserved namespace (starts with @)
```

### Types 

```javascript
// Basic type references
"person"                 // Simple type reference
"document.research"      // Namespaced type
"event.conference.2023"  // Multi-level type
```

## Entity Syntax

Entities are created using the following syntax patterns:

### Basic Entity Creation

```javascript
// Standard entity creation
ultralink.addEntity(id, type, attributes, options);

// Examples
ultralink.addEntity("alice", "person", {
  name: "Alice Chen",
  role: "Research Scientist"
});

ultralink.addEntity("concept-123", "concept", {
  name: "Neural Networks",
  description: "Computational models inspired by biological neural networks"
});
```

### Entity Options

```javascript
// Full entity creation with all options
ultralink.addEntity("paper-456", "research_paper", {
  title: "Advances in Graph Neural Networks",
  authors: ["Alice Chen", "Bob Smith"],
  publication_date: "2023-05-15",
  citations: 42
}, {
  generateVector: true,        // Generate vector embedding
  linkExisting: true,          // Automatically link to similar entities
  temporalTracking: true,      // Enable versioning 
  namespace: "research.papers", // Custom namespace
  vectorOptions: {
    model: "all-MiniLM-L6-v2", // Embedding model selection
    dimensions: 384            // Embedding dimensions
  }
});
```

### Entity References

```javascript
// Ways to reference existing entities
const entity = ultralink.getEntity("alice");
const sameEntity = ultralink.getEntityById("alice");
const entities = ultralink.getEntitiesByType("person");
```

## Relationship Syntax

Relationships connect entities and provide semantic meaning to connections:

### Basic Relationship Creation

```javascript
// Standard relationship creation
ultralink.addRelationship(sourceId, targetId, type, attributes, options);
// Or using the alias function
ultralink.addLink(sourceId, targetId, type, attributes, options);

// Examples
ultralink.addRelationship("alice", "paper-456", "authored", {
  contribution_type: "primary_author",
  year: 2023
});

ultralink.addLink("paper-456", "concept-123", "discusses", {
  context: "Chapter 3",
  significance: "core_concept"
});
```

### Relationship Options

```javascript
// Full relationship creation with all options
ultralink.addRelationship("alice", "bob", "collaborates_with", {
  strength: 0.85,
  projects: ["quantum-ml", "graph-algorithms"],
  active: true
}, {
  bidirectional: true,         // Create relationship in both directions
  weight: 0.85,                // Weight for analysis/visualization
  temporalTracking: true,      // Enable versioning
  generateVector: true,        // Generate vector for this relationship
  namespace: "professional"    // Custom namespace
});
```

### Relationship References

```javascript
// Ways to reference relationships
const relationships = ultralink.getEntityRelationships("alice");
const incomingLinks = ultralink.getEntityIncomingRelationships("alice");
const outgoingLinks = ultralink.getEntityOutgoingRelationships("alice");
const specificLinks = ultralink.getRelationshipsByType("authored");
```

## Attribute Syntax

Attributes store data on entities and relationships:

### Attribute Types

```javascript
// Supported attribute types
{
  string_attr: "text value",              // String
  number_attr: 42,                        // Number
  boolean_attr: true,                     // Boolean
  date_attr: new Date("2023-01-15"),      // Date object
  date_string: "2023-01-15",              // ISO date string
  string_array: ["one", "two", "three"],  // Array of strings
  number_array: [1, 2, 3],                // Array of numbers
  mixed_array: ["text", 42, true],        // Mixed array
  nested_object: {                        // Nested object
    prop1: "value1",
    prop2: 42
  },
  complex_nested: {                       // Complex nested structures
    level1: {
      level2: {
        values: [1, 2, 3]
      }
    }
  }
}
```

### Attribute Access

```javascript
// Accessing attributes
const name = entity.attributes.name;
const firstTag = entity.attributes.tags[0];
const nestedValue = entity.attributes.metadata.source.reliability;

// Checking attribute existence
const hasAttribute = 'importance' in entity.attributes;
const hasNestedAttribute = entity.attributes.metadata && 'source' in entity.attributes.metadata;
```

### Attribute Modification

```javascript
// Updating entity attributes
ultralink.updateEntityAttributes("alice", {
  role: "Senior Research Scientist",
  publications: 24,
  updated_at: new Date()
});

// Updating relationship attributes
ultralink.updateRelationshipAttributes("alice", "bob", "collaborates_with", {
  strength: 0.92,
  projects: ["quantum-ml", "graph-algorithms", "nlp-research"]
});

// Removing attributes
ultralink.removeEntityAttribute("alice", "temporary_note");
ultralink.removeRelationshipAttribute("alice", "bob", "collaborates_with", "ended_date");
```

## Type Definition Syntax

UltraLink allows defining custom types for entities and relationships:

### Entity Type Definition

```javascript
// Defining a custom entity type
ultralink.defineEntityType("research_paper", {
  // Parent type (optional)
  parent: "document",
  
  // Attribute schema
  attributes: {
    title: { type: "string", required: true },
    authors: { type: "string[]", required: true },
    publication_date: { type: "date" },
    abstract: { type: "text" },
    keywords: { type: "string[]" },
    citations: { type: "number", default: 0 }
  },
  
  // Validation rules
  validators: [
    (entity) => entity.attributes.authors.length > 0 ? null : "Paper must have at least one author"
  ],
  
  // Default rendering options
  rendering: {
    icon: "document",
    color: "#4a6fa5",
    displayAttribute: "title"
  }
});
```

### Relationship Type Definition

```javascript
// Defining a custom relationship type
ultralink.defineRelationshipType("cites", {
  // Valid source and target types
  sourceTypes: ["research_paper", "technical_document"],
  targetTypes: ["research_paper", "technical_document", "dataset"],
  
  // Attribute schema
  attributes: {
    context: { type: "text" },
    page_number: { type: "number" },
    quote: { type: "text" },
    significance: { 
      type: "enum", 
      values: ["supporting", "contrasting", "building_upon", "methodology"]
    }
  },
  
  // Validation rules
  validators: [
    (rel) => rel.source !== rel.target ? null : "A paper cannot cite itself"
  ],
  
  // Default rendering options
  rendering: {
    lineStyle: "dashed",
    lineColor: "#57a773",
    displayAttribute: "significance"
  }
});
```

## Query Syntax

UltraLink provides multiple approaches to querying the knowledge graph:

### Object Query Syntax

```javascript
// Find entities by type and attributes
const aiConcepts = ultralink.findEntities({
  type: "concept",
  attributes: {
    tags: { $contains: "artificial intelligence" },
    importance: { $gt: 0.7 }
  }
});

// Find relationships by type
const authorshipRelations = ultralink.findRelationships({
  type: "authored",
  attributes: {
    year: { $gte: 2020 }
  }
});
```

### Query Operators

```javascript
// Comparison operators
{ field: { $eq: value } }      // Equal to (same as { field: value })
{ field: { $ne: value } }      // Not equal to
{ field: { $gt: value } }      // Greater than
{ field: { $gte: value } }     // Greater than or equal to
{ field: { $lt: value } }      // Less than
{ field: { $lte: value } }     // Less than or equal to
{ field: { $in: [v1, v2] } }   // In array of values
{ field: { $nin: [v1, v2] } }  // Not in array of values

// Array operators
{ field: { $contains: value } }      // Array contains value
{ field: { $containsAll: [v1, v2] } }// Array contains all values
{ field: { $containsAny: [v1, v2] } }// Array contains any values

// String operators
{ field: { $startsWith: prefix } }   // String starts with prefix
{ field: { $endsWith: suffix } }     // String ends with suffix
{ field: { $contains: substring } }  // String contains substring
{ field: { $regex: pattern } }       // String matches regex pattern

// Logical operators
{ $and: [condition1, condition2] }   // Logical AND
{ $or: [condition1, condition2] }    // Logical OR
{ $not: condition }                  // Logical NOT
```

### UQL Text Query Syntax

UltraLink Query Language (UQL) provides a text-based query language:

```
// Find all papers authored by Alice
MATCH (author:person)-[r:authored]->(paper:research_paper)
WHERE author.attributes.name = "Alice Chen"
RETURN paper

// Find collaborators who worked on AI papers
MATCH (author1:person)-[:authored]->(paper:research_paper),
      (author2:person)-[:authored]->(paper)
WHERE author1.id != author2.id
  AND paper.attributes.keywords CONTAINS "artificial intelligence"
RETURN DISTINCT author1, author2
```

## Vector Operation Syntax

UltraLink provides specialized syntax for vector operations:

### Vector Search

```javascript
// Find entities similar to a text query
const results = await ultralink.findSimilarToText("quantum computing applications", {
  types: ["concept", "research_paper"],  // Optional: filter by types
  threshold: 0.7,                        // Minimum similarity score
  limit: 10                              // Maximum results
});

// Find entities similar to an existing entity
const similarEntities = await ultralink.findSimilar("concept-123", {
  threshold: 0.7,
  limit: 5
});

// Using vector directly
const customResults = await ultralink.findSimilarToVector(customVector, {
  types: ["concept"],
  threshold: 0.6,
  limit: 20
});
```

### Vector Comparison

```javascript
// Compare similarity between two entities
const similarity = await ultralink.getEntitySimilarity("entity1", "entity2");

// Compare similarity between arbitrary text and entity
const textSimilarity = await ultralink.getTextToEntitySimilarity("quantum computing", "concept-123");
```

## Temporal Operation Syntax

UltraLink supports temporal operations for versioning and time-based analysis:

### Temporal Querying

```javascript
// Get entity state at a specific time
const historicalState = await ultralink.getEntityStateAt("project-123", new Date("2023-01-15"));

// Get relationship state at a specific time
const historicalRelationship = await ultralink.getRelationshipStateAt(
  "alice", 
  "project-123", 
  "works_on", 
  new Date("2023-01-15")
);

// Get entity changes between two dates
const changes = await ultralink.getEntityChanges(
  "project-123", 
  new Date("2023-01-01"), 
  new Date("2023-12-31")
);
```

### Temporal Snapshots

```javascript
// Create a snapshot of the entire graph
const snapshotId = await ultralink.createSnapshot("End of Q1 2023");

// Restore graph to a previous snapshot
await ultralink.restoreSnapshot(snapshotId);

// Get list of all snapshots
const snapshots = await ultralink.getSnapshots();
```

## Expression Syntax

UltraLink supports expressions for calculating values dynamically:

### Basic Expressions

```javascript
// Using the compute method
const result = ultralink.compute("entities('person').count()");

// Using expressions in queries
const activeProjects = ultralink.findEntities({
  type: "project",
  where: "attributes.end_date > now() OR attributes.end_date IS NULL"
});
```

### Expression Functions

```javascript
// Date and time functions
now()                                   // Current date/time
date('2023-01-15')                      // Create date from string
dateAdd(date, amount, unit)             // Add to date
dateDiff(date1, date2, unit)            // Difference between dates

// Aggregation functions
count(collection)                       // Count items
sum(collection, expression)             // Sum values
avg(collection, expression)             // Average values
min(collection, expression)             // Minimum value
max(collection, expression)             // Maximum value

// Collection functions
filter(collection, predicate)           // Filter items
map(collection, transformation)         // Transform items
sort(collection, expression)            // Sort items
first(collection)                       // First item
last(collection)                        // Last item

// Graph functions
neighbors(entityId)                     // Get neighboring entities
path(sourceId, targetId)                // Find path between entities
distance(sourceId, targetId)            // Path length between entities

// Vector functions
similarity(entity1, entity2)            // Calculate similarity between entities
textSimilarity(text, entity)            // Similarity between text and entity
```

## Notation Conventions

UltraLink adopts specific notation conventions across its documentation and code:

### Function Parameter Notation

```
functionName(requiredParam[, optionalParam])
```

- Required parameters are shown as-is: `requiredParam`
- Optional parameters are shown in square brackets: `[, optionalParam]`
- Parameters with default values are shown with the default: `[, optionalParam = 'default']`

### Type Annotations

```
id: string                  // String type
count: number               // Number type
enabled: boolean            // Boolean type
items: Array<string>        // Array of strings
items: string[]             // Alternative array notation
options: Object             // Object type
callback: Function          // Function type
date: Date                  // Date object
mixed: any                  // Any type
result: Promise<Entity>     // Promise returning Entity
```

### Schema Notation

Type schemas use a consistent notation:

```javascript
{
  // Simple types
  name: { type: "string", required: true },
  count: { type: "number", default: 0 },
  
  // Arrays
  tags: { type: "string[]" },
  
  // Enums
  status: { type: "enum", values: ["active", "pending", "completed"] },
  
  // Nested objects
  metadata: { 
    type: "object", 
    properties: {
      source: { type: "string" },
      reliability: { type: "number", min: 0, max: 1 }
    }
  }
}
```

---

This reference document serves as the definitive guide to UltraLink's syntax. For practical examples and use cases, see the [API Usage Guide](../API_USAGE.md) and [Examples](../examples/README.md). 