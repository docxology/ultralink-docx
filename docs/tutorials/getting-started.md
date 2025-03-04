# Getting Started with UltraLink

Welcome to UltraLink! This tutorial will walk you through the basics of creating, manipulating, and exporting knowledge graphs using UltraLink.

## Prerequisites

- Node.js 14.x or higher
- Basic knowledge of JavaScript
- A code editor of your choice

## Installation

First, let's create a new project and install UltraLink:

```bash
# Create a new project directory
mkdir ultralink-tutorial
cd ultralink-tutorial

# Initialize a new Node.js project
npm init -y

# Install UltraLink
npm install ultralink
```

## Creating Your First Knowledge Graph

Let's start by creating a simple knowledge graph representing a team and its members.

Create a file named `first-graph.js` with the following content:

```javascript
const { UltraLink } = require('ultralink');
const fs = require('fs').promises;

async function createTeamGraph() {
  // Create a new UltraLink instance
  const ultralink = new UltraLink();
  
  console.log('Creating team knowledge graph...');
  
  // Add team entity
  await ultralink.addEntity('engineering-team', 'team', {
    name: 'Engineering Team',
    department: 'Technology',
    founded: '2020-01-15',
  });
  
  // Add team members
  await ultralink.addEntity('alice', 'person', {
    name: 'Alice Johnson',
    title: 'Lead Developer',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: 8
  });
  
  await ultralink.addEntity('bob', 'person', {
    name: 'Bob Smith',
    title: 'Backend Developer',
    skills: ['Python', 'Django', 'PostgreSQL'],
    experience: 5
  });
  
  await ultralink.addEntity('charlie', 'person', {
    name: 'Charlie Garcia',
    title: 'Frontend Developer',
    skills: ['JavaScript', 'Vue.js', 'CSS'],
    experience: 3
  });
  
  // Add projects
  await ultralink.addEntity('project-a', 'project', {
    name: 'Customer Portal',
    status: 'in-progress',
    deadline: '2023-06-30',
    priority: 'high'
  });
  
  await ultralink.addEntity('project-b', 'project', {
    name: 'Internal Dashboard',
    status: 'planning',
    deadline: '2023-09-15',
    priority: 'medium'
  });
  
  // Create relationships
  // Team membership
  await ultralink.addLink('alice', 'engineering-team', 'member_of', {
    role: 'Team Lead',
    joined: '2020-01-15'
  });
  
  await ultralink.addLink('bob', 'engineering-team', 'member_of', {
    role: 'Member',
    joined: '2020-03-01'
  });
  
  await ultralink.addLink('charlie', 'engineering-team', 'member_of', {
    role: 'Member',
    joined: '2021-02-15'
  });
  
  // Project assignments
  await ultralink.addLink('alice', 'project-a', 'works_on', {
    role: 'Project Manager',
    allocation: 0.5
  });
  
  await ultralink.addLink('alice', 'project-b', 'works_on', {
    role: 'Architect',
    allocation: 0.5
  });
  
  await ultralink.addLink('bob', 'project-a', 'works_on', {
    role: 'Backend Developer',
    allocation: 0.8
  });
  
  await ultralink.addLink('charlie', 'project-a', 'works_on', {
    role: 'Frontend Developer',
    allocation: 1.0
  });
  
  // Team relationships
  await ultralink.addLink('alice', 'bob', 'manages');
  await ultralink.addLink('alice', 'charlie', 'manages');
  await ultralink.addLink('bob', 'charlie', 'collaborates_with');
  
  console.log('Knowledge graph created successfully!');
  
  // Export to JSON
  const jsonOutput = await ultralink.toJSON({ pretty: true });
  await fs.writeFile('team-graph.json', jsonOutput);
  console.log('Exported to JSON: team-graph.json');
  
  // Export to GraphML
  const graphmlOutput = await ultralink.toGraphML();
  await fs.writeFile('team-graph.graphml', graphmlOutput);
  console.log('Exported to GraphML: team-graph.graphml');
  
  // Export to CSV
  const csvOutput = await ultralink.toCSV();
  await fs.writeFile('entities.csv', csvOutput.entities);
  await fs.writeFile('relationships.csv', csvOutput.relationships);
  console.log('Exported to CSV: entities.csv and relationships.csv');
  
  return ultralink;
}

// Run the function
createTeamGraph().catch(error => {
  console.error('Error creating knowledge graph:', error);
});
```

Run the script:

```bash
node first-graph.js
```

You should see output indicating that the knowledge graph was created and exported to various formats.

## Querying the Knowledge Graph

Now, let's create another script to query the knowledge graph we just created.

Create a file named `query-graph.js`:

```javascript
const { UltraLink } = require('ultralink');
const fs = require('fs').promises;

async function queryGraph() {
  // Create a new UltraLink instance
  const ultralink = new UltraLink();
  
  // Load the knowledge graph from JSON
  const jsonData = await fs.readFile('team-graph.json', 'utf8');
  await ultralink.fromJSON(JSON.parse(jsonData));
  
  console.log('Knowledge graph loaded successfully!');
  
  // Query 1: Find all persons
  console.log('\nAll persons:');
  const persons = await ultralink.findEntities({ type: 'person' });
  persons.forEach(person => {
    console.log(`- ${person.attributes.name} (${person.attributes.title})`);
  });
  
  // Query 2: Find experienced developers (more than 5 years)
  console.log('\nExperienced developers (>5 years):');
  const experiencedDevs = await ultralink.findEntities({
    type: 'person',
    attributes: {
      experience: { $gt: 5 }
    }
  });
  experiencedDevs.forEach(dev => {
    console.log(`- ${dev.attributes.name} (${dev.attributes.experience} years)`);
  });
  
  // Query 3: Find team members working on project-a
  console.log('\nTeam members working on Customer Portal:');
  const projectA = await ultralink.getEntity('project-a');
  const projectLinks = await ultralink.getIncomingLinksByType('project-a', 'works_on');
  
  for (const link of projectLinks) {
    const person = await ultralink.getEntity(link.source);
    console.log(`- ${person.attributes.name} (${link.attributes.role}, ${link.attributes.allocation * 100}% allocation)`);
  }
  
  // Query 4: Find all relationships for Alice
  console.log('\nAll relationships for Alice:');
  const aliceLinks = await ultralink.getEntityLinks('alice');
  
  // Group by relationship type
  const groupedLinks = {};
  for (const link of aliceLinks) {
    const type = link.type;
    if (!groupedLinks[type]) {
      groupedLinks[type] = [];
    }
    groupedLinks[type].push(link);
  }
  
  // Print grouped relationships
  for (const [type, links] of Object.entries(groupedLinks)) {
    console.log(`\n${type}:`);
    for (const link of links) {
      const targetId = link.source === 'alice' ? link.target : link.source;
      const target = await ultralink.getEntity(targetId);
      const direction = link.source === 'alice' ? 'outgoing' : 'incoming';
      console.log(`- ${direction} connection to ${target.attributes.name || target.id}`);
    }
  }
}

// Run the function
queryGraph().catch(error => {
  console.error('Error querying knowledge graph:', error);
});
```

Run the script:

```bash
node query-graph.js
```

This will load the knowledge graph from the JSON file and run several queries to demonstrate UltraLink's query capabilities.

## Visualizing Your Knowledge Graph

One of UltraLink's strengths is its ability to export to various formats for visualization and analysis.

### Exporting to HTML Website

Let's create a script to generate an interactive HTML visualization of our knowledge graph.

Create a file named `generate-website.js`:

```javascript
const { UltraLink } = require('ultralink');
const fs = require('fs').promises;

async function generateWebsite() {
  // Create a new UltraLink instance
  const ultralink = new UltraLink();
  
  // Load the knowledge graph from JSON
  const jsonData = await fs.readFile('team-graph.json', 'utf8');
  await ultralink.fromJSON(JSON.parse(jsonData));
  
  console.log('Knowledge graph loaded successfully!');
  
  // Export to HTML Website
  await ultralink.toHTMLWebsite({
    outputDir: './team-website',
    title: 'Engineering Team Knowledge Graph',
    description: 'Interactive visualization of our engineering team structure',
    theme: 'light',
    features: {
      search: true,
      filter: true,
      visualization: true
    }
  });
  
  console.log('HTML website generated successfully in ./team-website');
  console.log('Open ./team-website/index.html in your browser to view it.');
}

// Run the function
generateWebsite().catch(error => {
  console.error('Error generating website:', error);
});
```

Run the script:

```bash
node generate-website.js
```

This will generate an interactive HTML website in the `./team-website` directory. Open the `index.html` file in a web browser to explore your knowledge graph.

### Exporting to Obsidian

If you use Obsidian for knowledge management, UltraLink can export directly to Obsidian markdown format.

Create a file named `export-to-obsidian.js`:

```javascript
const { UltraLink } = require('ultralink');
const fs = require('fs').promises;

async function exportToObsidian() {
  // Create a new UltraLink instance
  const ultralink = new UltraLink();
  
  // Load the knowledge graph from JSON
  const jsonData = await fs.readFile('team-graph.json', 'utf8');
  await ultralink.fromJSON(JSON.parse(jsonData));
  
  console.log('Knowledge graph loaded successfully!');
  
  // Export to Obsidian
  await ultralink.toObsidian({
    directory: './obsidian-vault',
    frontmatter: true,
    wikiLinks: true,
    includeBacklinks: true,
    includeTags: true
  });
  
  console.log('Exported to Obsidian successfully in ./obsidian-vault');
  console.log('You can now open this directory as a vault in Obsidian.');
}

// Run the function
exportToObsidian().catch(error => {
  console.error('Error exporting to Obsidian:', error);
});
```

Run the script:

```bash
node export-to-obsidian.js
```

This will generate an Obsidian-compatible vault in the `./obsidian-vault` directory, which you can open in Obsidian.

## Working with Vector Embeddings

UltraLink supports vector embeddings for semantic search capabilities. Let's demonstrate this with a simple example.

First, install a package for generating embeddings:

```bash
npm install openai
```

Create a file named `vector-embeddings.js`:

```javascript
const { UltraLink } = require('ultralink');
const { OpenAI } = require('openai');
const fs = require('fs').promises;

// Initialize OpenAI (you need an API key)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Set this environment variable with your API key
});

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return new Float32Array(response.data[0].embedding);
}

async function workWithEmbeddings() {
  // Create a new UltraLink instance with vector support
  const ultralink = new UltraLink({
    vectors: {
      enabled: true,
      dimensions: 1536 // Dimensions for text-embedding-3-small
    }
  });
  
  // Load the knowledge graph from JSON
  const jsonData = await fs.readFile('team-graph.json', 'utf8');
  await ultralink.fromJSON(JSON.parse(jsonData));
  
  console.log('Knowledge graph loaded successfully!');
  
  // Generate embeddings for person entities based on their skills and title
  for (const person of await ultralink.findEntities({ type: 'person' })) {
    const text = `${person.attributes.name} is a ${person.attributes.title} with skills in ${person.attributes.skills.join(', ')}.`;
    const embedding = await generateEmbedding(text);
    
    // Add the embedding to the entity
    await ultralink.setEntityEmbedding(person.id, embedding);
    console.log(`Generated embedding for ${person.attributes.name}`);
  }
  
  // Perform similarity search
  console.log('\nFinding team members with frontend development skills:');
  const queryEmbedding = await generateEmbedding('frontend development with JavaScript and CSS');
  
  const similarPersons = await ultralink.findSimilarByVector(queryEmbedding, {
    entityType: 'person',
    limit: 3,
    includeDistance: true
  });
  
  for (const result of similarPersons) {
    const person = await ultralink.getEntity(result.id);
    console.log(`- ${person.attributes.name} (Similarity: ${(result.similarity * 100).toFixed(1)}%)`);
  }
  
  // Export the updated graph with embeddings
  const updatedJson = await ultralink.toJSON({ includeEmbeddings: true });
  await fs.writeFile('team-graph-with-embeddings.json', updatedJson);
  console.log('\nSaved knowledge graph with embeddings to team-graph-with-embeddings.json');
}

// Run the function if OpenAI API key is set
if (process.env.OPENAI_API_KEY) {
  workWithEmbeddings().catch(error => {
    console.error('Error working with embeddings:', error);
  });
} else {
  console.log('Please set the OPENAI_API_KEY environment variable to use embedding functionality.');
  console.log('Example: OPENAI_API_KEY=your-api-key node vector-embeddings.js');
}
```

Run the script with your OpenAI API key:

```bash
OPENAI_API_KEY=your-api-key node vector-embeddings.js
```

This script demonstrates how to:
1. Add vector embeddings to entities
2. Perform semantic search based on these embeddings
3. Export the graph with the embeddings included

## Converting to a Bayesian Network

UltraLink can convert your knowledge graph to a Bayesian network for probabilistic reasoning.

Create a file named `bayesian-network.js`:

```javascript
const { UltraLink } = require('ultralink');
const fs = require('fs').promises;

async function createBayesianNetwork() {
  // Create a new UltraLink instance
  const ultralink = new UltraLink();
  
  // Create a small probabilistic network
  // Project status affects team member workload
  await ultralink.addEntity('project-status', 'variable', {
    name: 'Project Status',
    states: ['on-track', 'delayed', 'critical'],
    probabilities: [0.7, 0.2, 0.1]
  });
  
  await ultralink.addEntity('team-workload', 'variable', {
    name: 'Team Workload', 
    states: ['normal', 'high', 'overloaded'],
    // Conditional probabilities depend on project status
    cpt: {
      'on-track': [0.8, 0.15, 0.05],
      'delayed': [0.3, 0.5, 0.2],
      'critical': [0.1, 0.3, 0.6]
    }
  });
  
  await ultralink.addEntity('team-morale', 'variable', {
    name: 'Team Morale',
    states: ['good', 'neutral', 'poor'],
    // Conditional probabilities depend on workload
    cpt: {
      'normal': [0.9, 0.08, 0.02],
      'high': [0.4, 0.5, 0.1],
      'overloaded': [0.1, 0.3, 0.6]
    }
  });
  
  // Create relationships representing conditional dependencies
  await ultralink.addLink('project-status', 'team-workload', 'influences');
  await ultralink.addLink('team-workload', 'team-morale', 'influences');
  
  console.log('Created probabilistic knowledge graph');
  
  // Export to Bayesian Network format (BIF)
  const bayesianNetwork = await ultralink.toBayesianNetwork({
    outputFormat: 'bif',
    nodeTypeMapping: {
      'variable': 'discrete'
    }
  });
  
  await fs.writeFile('team-model.bif', bayesianNetwork.data);
  console.log('Exported Bayesian Network to team-model.bif');
  
  // Export to Bayesian Network format (JSON)
  const bayesianNetworkJson = await ultralink.toBayesianNetwork({
    outputFormat: 'json',
    nodeTypeMapping: {
      'variable': 'discrete'
    }
  });
  
  await fs.writeFile('team-model.json', JSON.stringify(bayesianNetworkJson.data, null, 2));
  console.log('Exported Bayesian Network to team-model.json');
}

// Run the function
createBayesianNetwork().catch(error => {
  console.error('Error creating Bayesian network:', error);
});
```

Run the script:

```bash
node bayesian-network.js
```

This will create a simple Bayesian network representing the relationship between project status, team workload, and team morale, and export it in both BIF and JSON formats.

## Next Steps

Congratulations! You've learned the basics of UltraLink:

1. Creating knowledge graphs with entities and relationships
2. Querying and extracting information
3. Exporting to various formats (JSON, GraphML, CSV, HTML, Obsidian)
4. Working with vector embeddings for semantic search
5. Converting to a Bayesian network for probabilistic reasoning

To learn more, check out the following resources:

- [API User Guide](../guides/api-user-guide.md) - Comprehensive guide to UltraLink's API
- [Format Documentation](../formats/README.md) - Details about the supported import and export formats
- [Integration Guide](../integration/format-integration.md) - How to integrate UltraLink with other tools and systems
- [Architecture Overview](../architecture/overview.md) - Understanding UltraLink's architecture and design

## Complete Project Structure

After completing this tutorial, your project structure should look like this:

```
ultralink-tutorial/
├── node_modules/
├── first-graph.js
├── query-graph.js
├── generate-website.js
├── export-to-obsidian.js
├── vector-embeddings.js
├── bayesian-network.js
├── team-graph.json
├── team-graph.graphml
├── entities.csv
├── relationships.csv
├── team-graph-with-embeddings.json
├── team-model.bif
├── team-model.json
├── team-website/
└── obsidian-vault/
```

Happy knowledge graph building! 