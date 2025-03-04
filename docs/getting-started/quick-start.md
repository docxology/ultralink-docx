# UltraLink Quick Start Guide

This guide will help you get started with UltraLink quickly. We'll cover the essential steps to create a knowledge graph, add entities and relationships, and perform basic operations.

## Prerequisites

Before starting, ensure you have:

- Installed UltraLink (see [Installation Guide](./installation-guide.md))
- Basic understanding of JavaScript
- Node.js environment or browser setup ready

## Creating Your First Knowledge Graph

Let's create a simple knowledge graph about research papers and their authors.

### Step 1: Initialize UltraLink

First, create a new JavaScript file and import UltraLink:

```javascript
// Import UltraLink
const { UltraLink } = require('ultralink');

// Create a new instance
const graph = new UltraLink();

console.log('UltraLink initialized successfully!');
```

### Step 2: Create Entities

Next, let's add some entities to our knowledge graph:

```javascript
// Add researchers as entities
const researcher1 = graph.createEntity('person', 'researcher-1', {
  name: 'Dr. Alice Johnson',
  institution: 'Stanford University',
  field: 'Machine Learning',
  h_index: 25
});

const researcher2 = graph.createEntity('person', 'researcher-2', {
  name: 'Dr. Bob Smith',
  institution: 'MIT',
  field: 'Natural Language Processing',
  h_index: 18
});

// Add research papers as entities
const paper1 = graph.createEntity('paper', 'paper-1', {
  title: 'Advances in Knowledge Graph Embedding',
  year: 2022,
  journal: 'Journal of AI Research',
  doi: '10.1234/jair.2022.123'
});

const paper2 = graph.createEntity('paper', 'paper-2', {
  title: 'Vector Representation in Knowledge Systems',
  year: 2021,
  journal: 'Computational Linguistics',
  doi: '10.5678/cl.2021.456'
});

console.log('Created entities:', graph.getEntitiesCount());
```

### Step 3: Create Relationships

Now let's establish relationships between the entities:

```javascript
// Create author relationships
graph.createLink('researcher-1', 'paper-1', 'authored', {
  role: 'lead author',
  year: 2022
});

graph.createLink('researcher-2', 'paper-1', 'authored', {
  role: 'co-author',
  year: 2022
});

graph.createLink('researcher-2', 'paper-2', 'authored', {
  role: 'lead author',
  year: 2021
});

// Create citation relationship
graph.createLink('paper-2', 'paper-1', 'cites', {
  section: 'methods',
  context: 'Building upon the vector representation approach...'
});

console.log('Created relationships:', graph.getLinksCount());
```

### Step 4: Query the Knowledge Graph

Now we can query our knowledge graph to extract information:

```javascript
// Get all papers authored by Researcher 2
const researcherLinks = graph.getLinks('researcher-2');
console.log('Dr. Bob Smith\'s publications:');

for (const link of researcherLinks) {
  if (link.type === 'authored') {
    const paper = graph.getEntity(link.target);
    console.log(`- ${paper.attributes.title} (${paper.attributes.year}), role: ${link.attributes.role}`);
  }
}

// Find who authored "Advances in Knowledge Graph Embedding"
const paper1Links = graph.getLinks('paper-1');
console.log('\nAuthors of "Advances in Knowledge Graph Embedding":');

for (const link of paper1Links) {
  if (link.type === 'authored') {
    const researcher = graph.getEntity(link.source);
    console.log(`- ${researcher.attributes.name} (${link.attributes.role})`);
  }
}

// Find papers that cite other papers
console.log('\nCitation network:');
const allEntities = graph.getAllEntities();

for (const entity of allEntities) {
  if (entity.type === 'paper') {
    const outgoingLinks = graph.getLinks(entity.id);
    
    for (const link of outgoingLinks) {
      if (link.type === 'cites') {
        const citedPaper = graph.getEntity(link.target);
        console.log(`- "${entity.attributes.title}" cites "${citedPaper.attributes.title}"`);
      }
    }
  }
}
```

### Step 5: Add Vector Embeddings

To enable semantic search and similarity analysis, let's add vector embeddings:

```javascript
// This requires the vector extension: npm install ultralink @ultralink/vector
// Add vector embeddings to papers (typically you would use a pre-trained model)
graph.addVectorEmbedding('paper-1', [0.2, 0.5, 0.1, 0.8, 0.3]);
graph.addVectorEmbedding('paper-2', [0.3, 0.4, 0.2, 0.7, 0.1]);

// Find similar papers based on vector similarity
const similarPapers = graph.findSimilar('paper-1', {
  threshold: 0.7,
  limit: 5
});

console.log('\nSimilar papers to "Advances in Knowledge Graph Embedding":');
for (const result of similarPapers) {
  const paper = graph.getEntity(result.id);
  console.log(`- ${paper.attributes.title} (similarity: ${result.similarity.toFixed(2)})`);
}
```

### Step 6: Export the Knowledge Graph

Finally, let's export our knowledge graph to different formats:

```javascript
// Export to JSON
const jsonExport = graph.toJSON();
console.log('\nJSON Export:', JSON.stringify(jsonExport, null, 2).substring(0, 200) + '...');

// Export to CSV
const csvExport = graph.toCSV();
console.log('\nCSV Export (first few lines):', csvExport.split('\n').slice(0, 3).join('\n'));

// Export to GraphML
const graphMLExport = graph.toGraphML();
console.log('\nGraphML Export (preview):', graphMLExport.substring(0, 200) + '...');

// Export to Obsidian format (returns an object with filenames as keys and content as values)
const obsidianExport = graph.toObsidian();
const firstFile = Object.keys(obsidianExport)[0];
console.log('\nObsidian Export (first file):', firstFile);
console.log(obsidianExport[firstFile].substring(0, 200) + '...');
```

## Complete Example

Here's the complete example script:

```javascript
const { UltraLink } = require('ultralink');

// Create a new instance
const graph = new UltraLink();
console.log('UltraLink initialized successfully!');

// Add researchers as entities
const researcher1 = graph.createEntity('person', 'researcher-1', {
  name: 'Dr. Alice Johnson',
  institution: 'Stanford University',
  field: 'Machine Learning',
  h_index: 25
});

const researcher2 = graph.createEntity('person', 'researcher-2', {
  name: 'Dr. Bob Smith',
  institution: 'MIT',
  field: 'Natural Language Processing',
  h_index: 18
});

// Add research papers as entities
const paper1 = graph.createEntity('paper', 'paper-1', {
  title: 'Advances in Knowledge Graph Embedding',
  year: 2022,
  journal: 'Journal of AI Research',
  doi: '10.1234/jair.2022.123'
});

const paper2 = graph.createEntity('paper', 'paper-2', {
  title: 'Vector Representation in Knowledge Systems',
  year: 2021,
  journal: 'Computational Linguistics',
  doi: '10.5678/cl.2021.456'
});

console.log('Created entities:', graph.getEntitiesCount());

// Create author relationships
graph.createLink('researcher-1', 'paper-1', 'authored', {
  role: 'lead author',
  year: 2022
});

graph.createLink('researcher-2', 'paper-1', 'authored', {
  role: 'co-author',
  year: 2022
});

graph.createLink('researcher-2', 'paper-2', 'authored', {
  role: 'lead author',
  year: 2021
});

// Create citation relationship
graph.createLink('paper-2', 'paper-1', 'cites', {
  section: 'methods',
  context: 'Building upon the vector representation approach...'
});

console.log('Created relationships:', graph.getLinksCount());

// Query the knowledge graph
const researcherLinks = graph.getLinks('researcher-2');
console.log('Dr. Bob Smith\'s publications:');

for (const link of researcherLinks) {
  if (link.type === 'authored') {
    const paper = graph.getEntity(link.target);
    console.log(`- ${paper.attributes.title} (${paper.attributes.year}), role: ${link.attributes.role}`);
  }
}

// Get authors of a paper
const paper1Links = graph.getLinks('paper-1');
console.log('\nAuthors of "Advances in Knowledge Graph Embedding":');

for (const link of paper1Links) {
  if (link.type === 'authored') {
    const researcher = graph.getEntity(link.source);
    console.log(`- ${researcher.attributes.name} (${link.attributes.role})`);
  }
}

// Export to JSON
const jsonExport = graph.toJSON();
console.log('\nJSON Export successfully generated!');
```

Save this file as `quickstart.js` and run it with Node.js:

```bash
node quickstart.js
```

## Next Steps

Now that you've created your first knowledge graph with UltraLink, you can:

1. **Explore advanced features**:
   - Add vector embeddings for semantic search
   - Use temporal tracking for version history
   - Implement LLM integration for content analysis

2. **Learn about specific use cases**:
   - [Building a Citation Network](../tutorials/citation-network.md)
   - [Creating a Semantic Knowledge Base](../tutorials/semantic-knowledge-base.md)
   - [Implementing a Recommendation System](../tutorials/recommendation-system.md)

3. **Dive deeper into the API**:
   - [Core API Reference](../api/core-api.md)
   - [Vector Operations](../api/vector-operations.md)
   - [Export Functions](../api/export-functions.md)

For more detailed information, check out the [full tutorials](../tutorials/README.md) and [API reference](../api/README.md). 