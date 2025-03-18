# UltraLink Semantic Model Reference

This document provides a comprehensive reference for UltraLink's semantic model, outlining how knowledge and meaning are represented and processed within the system.

## Table of Contents

1. [Core Semantic Principles](#core-semantic-principles)
2. [Entity Semantics](#entity-semantics)
3. [Relationship Semantics](#relationship-semantics)
4. [Semantic Type System](#semantic-type-system)
5. [Vector Semantics](#vector-semantics)
6. [Contextual Semantics](#contextual-semantics)
7. [Temporal Semantics](#temporal-semantics)
8. [Semantic Inference](#semantic-inference)
9. [Semantic Validation](#semantic-validation)
10. [Semantic Integration](#semantic-integration)

## Core Semantic Principles

UltraLink's semantic model is built on these foundational principles:

### Entity-Relationship Model

The foundation of UltraLink is a semantic entity-relationship model where:
- **Entities** represent discrete concepts, objects, or things
- **Relationships** represent meaningful connections between entities
- **Attributes** provide properties and characteristics to entities and relationships
- **Types** categorize entities and relationships with semantic meaning

### Semantic Richness

UltraLink prioritizes semantic richness, capturing not just connections but their meaning:
- Each relationship has a **semantic type** that defines its meaning
- Relationships can have **directionality** that implies semantic roles (source/target)
- **Attributes** provide contextual information that enriches semantic understanding
- **Vector embeddings** capture latent semantic dimensions

### Semantic Composability

Knowledge in UltraLink is built through composition:
- Simple semantic units combine to form complex knowledge structures
- The meaning of the whole derives from the meaning of its parts and their connections
- New semantic meaning emerges from the composition of existing concepts

### Context Sensitivity

Semantic meaning in UltraLink is context-sensitive:
- The same entity may have different meanings in different contexts
- Relationships establish contexts for interpreting entities
- Temporal dimensions provide historical context
- Vector spaces provide similarity contexts

## Entity Semantics

Entities are the core semantic units in UltraLink.

### Entity Identity

Each entity has a unique identity that anchors its semantic meaning:

```javascript
// Entity with specific identity
ultralink.addEntity("turing", "person", {
  name: "Alan Turing",
  birthDate: "1912-06-23"
});
```

### Entity Types

Entity types provide semantic categorization:

```javascript
// Different semantic types
ultralink.addEntity("turing", "person", {...});      // Person entity
ultralink.addEntity("computation", "concept", {...}); // Concept entity
ultralink.addEntity("enigma", "artifact", {...});    // Artifact entity
```

### Core Entity Types

UltraLink includes these core semantic entity types:

| Type | Semantic Meaning | Typical Attributes |
|------|------------------|-------------------|
| `person` | Human individual | name, birthDate, occupation |
| `organization` | Formal group of people | name, foundingDate, location |
| `concept` | Abstract idea or notion | name, description |
| `event` | Occurrence at a specific time | name, date, location |
| `artifact` | Physical or digital object | name, creator, creationDate |
| `document` | Written material | title, authors, publicationDate |
| `place` | Geographic location | name, coordinates, type |
| `topic` | Subject area | name, description |
| `process` | Series of actions | name, steps, inputs, outputs |

### Entity Attributes

Attributes provide semantic richness to entities:

```javascript
// Semantically rich entity
ultralink.addEntity("turing", "person", {
  name: "Alan Turing",
  birthDate: "1912-06-23",
  birthPlace: "London, UK",
  occupation: "Mathematician",
  contributions: ["Computer Science", "Cryptography", "AI"],
  significance: 0.95,
  fields: ["Mathematics", "Computer Science", "Philosophy"]
});
```

## Relationship Semantics

Relationships express semantic connections between entities.

### Relationship Types

Relationship types define the semantic meaning of connections:

```javascript
// Different semantic relationship types
ultralink.addRelationship("turing", "enigma", "worked_on", {...});  // Work relationship
ultralink.addRelationship("turing", "computation", "pioneered", {...});  // Contribution relationship
ultralink.addRelationship("enigma", "computation", "relates_to", {...});  // Association relationship
```

### Core Relationship Types

UltraLink includes these core semantic relationship types:

| Type | Semantic Meaning | Direction |
|------|------------------|-----------|
| `is_a` | Inheritance/subsumption | From specific to general |
| `has_part` | Composition/containment | From whole to part |
| `related_to` | General association | Bidirectional |
| `precedes` | Temporal ordering | From earlier to later |
| `causes` | Causal influence | From cause to effect |
| `authored` | Creative responsibility | From creator to creation |
| `located_in` | Spatial containment | From entity to location |
| `references` | Citation or mention | From referencer to referenced |
| `similar_to` | Conceptual similarity | Bidirectional |
| `opposite_of` | Conceptual opposition | Bidirectional |
| `instance_of` | Type instantiation | From instance to type |
| `collaborates_with` | Cooperative relationship | Bidirectional |

### Relationship Attributes

Attributes provide semantic richness to relationships:

```javascript
// Semantically rich relationship
ultralink.addRelationship("turing", "enigma", "worked_on", {
  time_period: "1939-1942",
  role: "Lead Cryptanalyst",
  location: "Bletchley Park",
  significance: "Major breakthrough",
  team_size: 15,
  classification: "Top Secret"
});
```

### Relationship Directionality

Directionality provides semantic meaning to relationships:

```javascript
// Directed relationship (person authored paper)
ultralink.addRelationship("turing", "computing-machinery", "authored", {
  year: 1950
});

// Reverse direction has different semantic meaning
ultralink.addRelationship("computing-machinery", "turing", "written_by", {
  year: 1950
});

// Bidirectional relationship (semantic equivalence in both directions)
ultralink.addRelationship("turing", "neumann", "collaborated_with", {
  project: "First digital computer"
}, {
  bidirectional: true
});
```

## Semantic Type System

UltraLink's type system formalizes semantics through type definitions.

### Type Hierarchies

Types form semantic hierarchies with inheritance:

```javascript
// Type hierarchy
ultralink.defineEntityType("document", {
  attributes: {
    title: { type: "string", required: true },
    creation_date: { type: "date" }
  }
});

ultralink.defineEntityType("research_paper", {
  parent: "document",
  attributes: {
    authors: { type: "string[]", required: true },
    abstract: { type: "text" },
    keywords: { type: "string[]" }
  }
});

ultralink.defineEntityType("conference_paper", {
  parent: "research_paper",
  attributes: {
    conference: { type: "string", required: true },
    presentation_date: { type: "date" }
  }
});
```

### Domain and Range Constraints

Type definitions provide semantic constraints on relationships:

```javascript
// Semantic constraints on relationship types
ultralink.defineRelationshipType("authored", {
  sourceTypes: ["person", "organization"],  // Domain constraint
  targetTypes: ["document", "creative_work"],  // Range constraint
  attributes: {
    contribution_type: { 
      type: "enum", 
      values: ["primary", "contributing", "editing"]
    },
    year: { type: "number" }
  }
});
```

### Semantic Validators

Type definitions include semantic validation rules:

```javascript
// Semantic validators
ultralink.defineEntityType("research_paper", {
  // ...other properties...
  validators: [
    // Semantic validation: papers must have at least one author
    (entity) => entity.attributes.authors.length > 0 
      ? null 
      : "Research papers must have at least one author",
      
    // Semantic validation: publication date must be valid
    (entity) => {
      const pubDate = new Date(entity.attributes.publication_date);
      const earliestValidDate = new Date("1650-01-01");
      const today = new Date();
      
      if (pubDate < earliestValidDate || pubDate > today) {
        return "Publication date must be between 1650 and the present";
      }
      return null;
    }
  ]
});
```

## Vector Semantics

UltraLink uses vector embeddings to capture semantic meaning in a continuous space.

### Semantic Embeddings

Vectors capture latent semantic dimensions:

```javascript
// Entity with semantic vector
ultralink.addEntity("neural-networks", "concept", {
  name: "Neural Networks",
  description: "Computational models inspired by biological neural networks"
}, {
  generateVector: true  // Generate semantic embedding
});
```

### Semantic Similarity

Vector proximity represents semantic similarity:

```javascript
// Find semantically similar entities
const similarConcepts = await ultralink.findSimilar("neural-networks", {
  threshold: 0.7,
  limit: 5
});

// Compare semantic similarity between entities
const similarity = await ultralink.getEntitySimilarity("neural-networks", "deep-learning");
```

### Semantic Search

Vector-based search finds semantically related entities:

```javascript
// Semantic search by text
const results = await ultralink.findSimilarToText(
  "computational models that mimic brain functions", 
  { threshold: 0.6 }
);
```

### Semantic Clusters

Vector proximity reveals semantic groupings:

```javascript
// Find semantic clusters
const clusters = await ultralink.findSemanticClusters({
  types: ["concept"],
  clusterCount: 5,
  algorithm: "kmeans"
});
```

## Contextual Semantics

UltraLink represents how semantic meaning changes with context.

### Contextual Entities

Entities can have different semantic meanings in different contexts:

```javascript
// Same term with different semantic meanings in different contexts
ultralink.addEntity("python-language", "programming_language", {
  name: "Python",
  paradigm: "multi-paradigm",
  first_appeared: 1991
});

ultralink.addEntity("python-snake", "animal", {
  name: "Python",
  class: "Reptilia",
  order: "Squamata"
});

// Relationship establishing context
ultralink.addRelationship("python-disambiguation", "python-language", "refers_to", {
  context: "computing"
});

ultralink.addRelationship("python-disambiguation", "python-snake", "refers_to", {
  context: "zoology"
});
```

### Context Graphs

Subgraphs provide contextual scope for interpretation:

```javascript
// Create a contextual subgraph
const computerScienceContext = ultralink.createContext("computer_science", {
  description: "Entities and relationships in the computer science domain"
});

// Add entity to specific context
computerScienceContext.addEntity("algorithm", "concept", {
  name: "Algorithm",
  description: "Step-by-step procedure for calculations or problem-solving"
});
```

### Semantic Framing

Relationships frame the semantic interpretation of entities:

```javascript
// Different semantic frames for the same entity
ultralink.addRelationship("turing", "cambridge", "studied_at", {
  years: "1931-1934",
  field: "Mathematics"
});  // Academic frame

ultralink.addRelationship("turing", "bletchley-park", "worked_at", {
  years: "1939-1945",
  role: "Cryptanalyst"
});  // Professional frame

ultralink.addRelationship("turing", "london", "lived_in", {
  years: "1945-1954"
});  // Biographical frame
```

## Temporal Semantics

UltraLink represents how semantic meaning evolves over time.

### Temporal Entities

Entities can have temporally-bound meaning:

```javascript
// Entity with temporal bounds
ultralink.addEntity("soviet-union", "country", {
  name: "Soviet Union",
  established: "1922-12-30",
  dissolved: "1991-12-26",
  capitals: ["Moscow"],
  official_languages: ["Russian"]
});
```

### Temporal Relationships

Relationships can have temporal constraints:

```javascript
// Temporally-bound relationship
ultralink.addRelationship("turing", "manchester-university", "worked_at", {
  start_date: "1948-05-01",
  end_date: "1954-06-07",
  role: "Reader in the Mathematics Department"
});
```

### Semantic Versioning

Entities and relationships maintain version history to track semantic evolution:

```javascript
// Retrieve historical version of entity
const turingEntity1950 = await ultralink.getEntityStateAt(
  "turing", 
  new Date("1950-01-01")
);

// Track semantic changes over time
const changes = await ultralink.getEntityChanges(
  "artificial-intelligence", 
  new Date("1950-01-01"), 
  new Date("2023-01-01")
);
```

## Semantic Inference

UltraLink supports derivation of implicit semantic meaning.

### Relationship Inference

New relationships can be inferred from existing ones:

```javascript
// Configure inference rules
ultralink.defineInferenceRule("transitivity_rule", {
  pattern: [
    { source: "A", target: "B", type: "has_part" },
    { source: "B", target: "C", type: "has_part" }
  ],
  inference: {
    source: "A", 
    target: "C", 
    type: "has_part"
  }
});

// Apply inference rules
const newRelationships = await ultralink.applyInference();
```

### Symmetric Relationships

Some relationships have symmetric semantic meaning:

```javascript
// Define symmetric relationship type
ultralink.defineRelationshipType("similar_to", {
  symmetric: true,
  attributes: {
    similarity_score: { type: "number", min: 0, max: 1 }
  }
});

// Adding a symmetric relationship automatically creates the reverse
ultralink.addRelationship("neural-networks", "deep-learning", "similar_to", {
  similarity_score: 0.85
});
// Automatically creates deep-learning -> neural-networks relationship
```

### Inverse Relationships

Some relationships have inverse semantic meaning:

```javascript
// Define inverse relationship types
ultralink.defineRelationshipType("parent_of", {
  inverse: "child_of",
  sourceTypes: ["person"],
  targetTypes: ["person"]
});

ultralink.defineRelationshipType("child_of", {
  inverse: "parent_of",
  sourceTypes: ["person"],
  targetTypes: ["person"]
});

// Adding a relationship with an inverse type automatically creates the inverse
ultralink.addRelationship("alan-turing", "john-turing", "child_of");
// Automatically creates john-turing -> alan-turing parent_of relationship
```

## Semantic Validation

UltraLink enforces semantic consistency through validation rules.

### Type Compatibility

Relationships enforce semantic compatibility between entity types:

```javascript
// Relationship type with strict semantic compatibility
ultralink.defineRelationshipType("enrolled_in", {
  sourceTypes: ["person", "student"],  // Must be person or student
  targetTypes: ["course", "program", "institution"],  // Must be educational offering
  strict: true  // Strictly enforce type compatibility
});

// This will throw an error if types don't match
ultralink.addRelationship("alice", "math-101", "enrolled_in", {
  semester: "Fall 2023"
});
```

### Semantic Constraints

Validation rules enforce semantic integrity:

```javascript
// Define semantic constraints
ultralink.defineConstraint("birth_before_death", {
  entityTypes: ["person"],
  validate: (entity) => {
    if (entity.attributes.birthDate && entity.attributes.deathDate) {
      const birth = new Date(entity.attributes.birthDate);
      const death = new Date(entity.attributes.deathDate);
      
      if (birth >= death) {
        return "Birth date must be before death date";
      }
    }
    return null;
  }
});

// Active constraints are checked during entity creation/update
ultralink.updateEntity("turing", {
  birthDate: "1912-06-23",
  deathDate: "1911-06-07"  // This will trigger constraint violation
});
```

### Semantic Uniqueness

Uniqueness constraints enforce semantic distinctness:

```javascript
// Define uniqueness constraint
ultralink.defineEntityType("isbn", {
  attributes: {
    code: { 
      type: "string", 
      required: true,
      unique: true  // Must be semantically unique
    },
    issued_date: { type: "date" }
  }
});
```

## Semantic Integration

UltraLink facilitates integration with external semantic systems.

### Semantic Web Integration

Support for standard semantic web formats:

```javascript
// Import from semantic web formats
const graph = ultralink.importFromRDF(rdfData);

// Export to semantic web formats
const rdfOutput = ultralink.toRDF();
const owlOutput = ultralink.toOWL();
const jsonLdOutput = ultralink.toJSONLD();
```

### Ontology Mapping

Map between semantic ontologies:

```javascript
// Define ontology mapping
ultralink.defineOntologyMapping("schema_org", {
  entityTypes: {
    "person": "https://schema.org/Person",
    "organization": "https://schema.org/Organization"
  },
  relationshipTypes: {
    "works_for": "https://schema.org/worksFor",
    "member_of": "https://schema.org/memberOf"
  },
  attributes: {
    "name": "https://schema.org/name",
    "birthDate": "https://schema.org/birthDate"
  }
});

// Import with ontology mapping
ultralink.importWithMapping(data, "schema_org");
```

### Knowledge Graph Alignment

Align semantic concepts across knowledge graphs:

```javascript
// Align entities between graphs
const alignments = ultralink.alignWithGraph(externalGraph, {
  threshold: 0.7,
  alignmentMethod: "vector_similarity"
});

// Merge aligned graphs
const mergedGraph = ultralink.mergeGraph(externalGraph, {
  alignments: alignments,
  conflictResolution: "prefer_this"
});
```

---

This reference document serves as the definitive guide to UltraLink's semantic model. For implementation details, see the [API Reference](../api/README.md) and [Syntax Reference](./syntax-reference.md). 