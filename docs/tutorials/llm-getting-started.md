# Getting Started with LLMs in UltraLink 🚀

This tutorial will guide you through the process of integrating and using Large Language Models (LLMs) with UltraLink. By the end, you'll have a functional knowledge graph enhanced with LLM capabilities.

## Prerequisites

- UltraLink installed (version 1.0.0 or higher)
- Basic familiarity with JavaScript/Node.js
- An API key for an LLM provider (OpenAI, Anthropic, etc.)
- A sample dataset or domain to model

## Step 1: Setting Up LLM Integration

First, we need to configure UltraLink to work with your preferred LLM provider:

```javascript
// Import UltraLink
const { UltraLink } = require('ultralink');

// Create a new UltraLink instance
const ultralink = new UltraLink();

// Configure LLM integration
await ultralink.llm.configure({
  provider: 'openai',  // Can be 'openai', 'anthropic', 'huggingface', or 'custom'
  apiKey: process.env.OPENAI_API_KEY,  // Use environment variables for API keys
  defaultModel: 'gpt-4',
  embeddingModel: 'text-embedding-3-large',
  options: {
    temperature: 0.3,
    maxTokens: 1000,
    cacheEnabled: true,
    cacheExpiration: '1h'
  }
});

// Test the connection
const testResult = await ultralink.llm.process({
  template: "Respond with 'LLM integration successful' if you can read this message.",
  params: {}
});

console.log("Test result:", testResult);
```

Save this code in a file named `llm-setup.js` and run it to verify your LLM integration is working.

## Step 2: Creating a Simple Knowledge Graph

Let's create a small knowledge graph about a company and its employees:

```javascript
// Create sample-company.js
const { UltraLink } = require('ultralink');
const ultralink = new UltraLink();

// Configure LLM integration (same as Step 1)
await ultralink.llm.configure({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4',
  embeddingModel: 'text-embedding-3-large',
  options: { temperature: 0.3, maxTokens: 1000 }
});

// Add company entity
await ultralink.addEntity('acme-corp', 'organization', {
  name: 'Acme Corporation',
  industry: 'Technology',
  founded: '2005',
  employees: 250,
  revenue: '$25M'
});

// Add department entities
await ultralink.addEntity('engineering', 'department', {
  name: 'Engineering',
  headcount: 100,
  location: 'Main Office'
});

await ultralink.addEntity('marketing', 'department', {
  name: 'Marketing',
  headcount: 30,
  location: 'Main Office'
});

await ultralink.addEntity('sales', 'department', {
  name: 'Sales',
  headcount: 50,
  location: 'Various'
});

// Add employee entities
await ultralink.addEntity('john-smith', 'employee', {
  name: 'John Smith',
  title: 'CTO',
  joined: '2007',
  skills: ['machine learning', 'system architecture', 'team leadership']
});

await ultralink.addEntity('jane-doe', 'employee', {
  name: 'Jane Doe',
  title: 'Engineering Manager',
  joined: '2010',
  skills: ['software development', 'project management', 'Java', 'Python']
});

await ultralink.addEntity('bob-johnson', 'employee', {
  name: 'Bob Johnson',
  title: 'Marketing Director',
  joined: '2012',
  skills: ['digital marketing', 'brand strategy', 'market research']
});

// Add relationships
await ultralink.addLink('engineering', 'acme-corp', 'part_of');
await ultralink.addLink('marketing', 'acme-corp', 'part_of');
await ultralink.addLink('sales', 'acme-corp', 'part_of');

await ultralink.addLink('john-smith', 'acme-corp', 'works_for', {
  role: 'executive',
  level: 'C-Suite'
});
await ultralink.addLink('john-smith', 'engineering', 'leads');

await ultralink.addLink('jane-doe', 'acme-corp', 'works_for');
await ultralink.addLink('jane-doe', 'engineering', 'member_of', {
  role: 'manager'
});
await ultralink.addLink('jane-doe', 'john-smith', 'reports_to');

await ultralink.addLink('bob-johnson', 'acme-corp', 'works_for');
await ultralink.addLink('bob-johnson', 'marketing', 'leads');

console.log('Knowledge graph created successfully!');

// Save for later use
await ultralink.save('./company-knowledge.json');
```

## Step 3: Enhancing Entities with LLM-Generated Content

Now, let's use an LLM to enhance our entity descriptions:

```javascript
// Create enhance-descriptions.js
const { UltraLink } = require('ultralink');
const ultralink = new UltraLink();

// Load previously created knowledge graph
await ultralink.load('./company-knowledge.json');

// Configure LLM integration (same as before)
await ultralink.llm.configure({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4',
  options: { temperature: 0.4 }
});

// Define an enhancement prompt
const enhancementPrompt = `
System: You are an expert at creating rich, informative entity descriptions.

Entity Information:
Type: {{entityType}}
Name: {{entityName}}
{{#if attributes}}
Attributes:
{{#each attributes}}
- {{@key}}: {{this}}
{{/each}}
{{/if}}

Task:
Create a detailed description for this entity based on its attributes. 
The description should be informative, professional, and highlight key aspects of the entity.

Output Format:
Provide only the description paragraph without any introductory phrases like "Here is a description" or similar meta-commentary.
`;

// Function to enhance an entity description
async function enhanceEntityDescription(entityId) {
  // Get the entity
  const entity = await ultralink.getEntity(entityId);
  if (!entity) {
    console.log(`Entity ${entityId} not found.`);
    return;
  }
  
  // Extract attributes for the prompt
  const entityName = entity.attributes.name || entity.id;
  const entityType = entity.type;
  const attributes = { ...entity.attributes };
  delete attributes.description; // Remove existing description if present
  
  // Process with LLM
  console.log(`Enhancing description for ${entityName}...`);
  const description = await ultralink.llm.process({
    template: enhancementPrompt,
    params: {
      entityType,
      entityName,
      attributes
    },
    temperature: 0.4
  });
  
  // Update the entity
  await ultralink.updateEntity(entityId, {
    description,
    description_source: 'llm_generated',
    last_updated: new Date().toISOString()
  });
  
  console.log(`Enhanced description for ${entityName} added.`);
  return description;
}

// Enhance descriptions for all entities
async function enhanceAllEntities() {
  const entities = await ultralink.getEntities();
  
  for (const entityId of Object.keys(entities)) {
    await enhanceEntityDescription(entityId);
  }
  
  // Save the enhanced knowledge graph
  await ultralink.save('./enhanced-company-knowledge.json');
  console.log('All entities enhanced successfully!');
}

// Run the enhancement
enhanceAllEntities()
  .then(() => console.log('Enhancements complete'))
  .catch(err => console.error('Error enhancing entities:', err));
```

Run this script to enhance all entity descriptions using the LLM.

## Step 4: Generating Relationship Insights

Now, let's use an LLM to generate insights about relationships in our knowledge graph:

```javascript
// Create relationship-insights.js
const { UltraLink } = require('ultralink');
const ultralink = new UltraLink();

// Load the enhanced knowledge graph
await ultralink.load('./enhanced-company-knowledge.json');

// Configure LLM integration (same as before)
await ultralink.llm.configure({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4',
  options: { temperature: 0.5 }
});

// Define an insights prompt
const insightsPrompt = `
System: You are an expert at analyzing organizational structure and relationships.

Context:
I have a knowledge graph representing a company with the following entities and relationships:

{{#each entities}}
ENTITY: {{this.id}} ({{this.type}})
Name: {{this.attributes.name}}
{{#if this.attributes.description}}
Description: {{this.attributes.description}}
{{/if}}
{{#each this.attributes}}
{{#unless (isSpecialAttribute @key)}}
{{@key}}: {{this}}
{{/unless}}
{{/each}}

{{/each}}

RELATIONSHIPS:
{{#each relationships}}
- {{this.source}} {{this.type}} {{this.target}}{{#if this.attributes}} ({{formatAttributes this.attributes}}){{/if}}
{{/each}}

Task:
Analyze this organizational structure and provide 3-5 meaningful insights about:
1. The organizational hierarchy and reporting structure
2. Potential strengths in the current structure
3. Potential areas for improvement or risks
4. Any recommendations for organizational changes

Output Format:
Provide your analysis with clear headings for each insight, followed by a brief explanation and any recommendations.
`;

// Function to generate organizational insights
async function generateOrganizationalInsights() {
  // Get all entities and their relationships
  const entities = await ultralink.getEntities();
  
  // Format relationships for the prompt
  const relationships = [];
  for (const [entityId, entity] of Object.entries(entities)) {
    if (entity.relationships) {
      for (const [relType, rels] of Object.entries(entity.relationships)) {
        for (const rel of rels) {
          relationships.push({
            source: entityId,
            type: relType,
            target: rel.target,
            attributes: rel.attributes
          });
        }
      }
    }
  }
  
  // Process with LLM
  console.log('Generating organizational insights...');
  const insights = await ultralink.llm.process({
    template: insightsPrompt,
    params: {
      entities,
      relationships,
      isSpecialAttribute: (key) => ['description', 'description_source', 'last_updated'].includes(key),
      formatAttributes: (attrs) => {
        return Object.entries(attrs)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
      }
    },
    temperature: 0.5,
    maxTokens: 1200
  });
  
  // Store insights in the knowledge graph
  await ultralink.addEntity('organizational-insights', 'analysis', {
    title: 'Organizational Structure Analysis',
    content: insights,
    created_at: new Date().toISOString(),
    source: 'llm_generated'
  });
  
  // Save the knowledge graph with insights
  await ultralink.save('./insights-company-knowledge.json');
  
  console.log('Organizational insights generated successfully!');
  return insights;
}

// Run the insight generation
generateOrganizationalInsights()
  .then(insights => console.log('Insights:\n', insights))
  .catch(err => console.error('Error generating insights:', err));
```

## Step 5: Creating an Interactive Query Interface

Now, let's create a simple interactive query interface that uses LLMs to answer questions about our company:

```javascript
// Create query-interface.js
const { UltraLink } = require('ultralink');
const readline = require('readline');

// Initialize UltraLink and load knowledge
async function initializeSystem() {
  const ultralink = new UltraLink();
  
  // Load the knowledge graph with insights
  await ultralink.load('./insights-company-knowledge.json');
  
  // Configure LLM integration
  await ultralink.llm.configure({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: 'gpt-4',
    options: { temperature: 0.3 }
  });
  
  return ultralink;
}

// Query generation prompt
const queryPrompt = `
System: You are a knowledgeable assistant with access to a company knowledge graph.

Context:
You have access to information about Acme Corporation, including its departments, employees, and organizational structure. Below is the relevant information from the knowledge graph:

{{context}}

User Question:
{{question}}

Task:
Provide a detailed and accurate answer to the user's question based ONLY on the information provided in the context. 
If the information needed is not present in the context, state that the information is not available rather than making it up.

Output Format:
Provide a clear, concise answer without mentioning that you're using the provided context.
`;

// Function to extract relevant context for a query
async function extractRelevantContext(ultralink, question) {
  // Use semantic search to find relevant entities
  const relevantEntities = await ultralink.llm.semanticSearch(question, {
    limit: 5,
    minSimilarity: 0.5
  });
  
  // Get full entity details
  const context = [];
  for (const entityMatch of relevantEntities) {
    const entity = await ultralink.getEntity(entityMatch.id);
    context.push({
      id: entity.id,
      type: entity.type,
      attributes: entity.attributes
    });
    
    // Get direct relationships
    const relationships = [];
    if (entity.relationships) {
      for (const [relType, rels] of Object.entries(entity.relationships)) {
        for (const rel of rels) {
          const targetEntity = await ultralink.getEntity(rel.target);
          if (targetEntity) {
            relationships.push({
              type: relType,
              target: {
                id: targetEntity.id,
                type: targetEntity.type,
                name: targetEntity.attributes.name
              },
              attributes: rel.attributes
            });
          }
        }
      }
    }
    
    // Add relationships to context
    if (relationships.length > 0) {
      context[context.length - 1].relationships = relationships;
    }
  }
  
  // Format context for the prompt
  return JSON.stringify(context, null, 2);
}

// Function to answer a query
async function answerQuery(ultralink, question) {
  console.log('Processing query:', question);
  
  // Extract relevant context
  const context = await extractRelevantContext(ultralink, question);
  
  // Generate answer using LLM
  const answer = await ultralink.llm.process({
    template: queryPrompt,
    params: {
      context,
      question
    },
    temperature: 0.3,
    maxTokens: 800
  });
  
  return answer;
}

// Interactive command-line interface
async function startInteractiveInterface() {
  const ultralink = await initializeSystem();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('\n===== Acme Corp Knowledge Assistant =====');
  console.log('Ask questions about Acme Corporation, its departments, and employees.');
  console.log('Type "exit" to quit.\n');
  
  const askQuestion = () => {
    rl.question('Your question: ', async (question) => {
      if (question.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }
      
      try {
        const answer = await answerQuery(ultralink, question);
        console.log('\nAnswer:');
        console.log(answer);
        console.log('\n-----------------------------------\n');
        askQuestion();
      } catch (error) {
        console.error('Error processing query:', error);
        console.log('\n-----------------------------------\n');
        askQuestion();
      }
    });
  };
  
  askQuestion();
}

// Start the interactive interface
startInteractiveInterface()
  .catch(err => console.error('Error starting interactive interface:', err));
```

Run this script to interact with your knowledge graph using natural language queries.

## Step 6: Integrating Vector Embeddings

Finally, let's enhance our knowledge graph with vector embeddings for improved semantic search:

```javascript
// Create vector-embeddings.js
const { UltraLink } = require('ultralink');
const ultralink = new UltraLink();

// Load the knowledge graph
await ultralink.load('./insights-company-knowledge.json');

// Configure LLM integration with embedding model
await ultralink.llm.configure({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4',
  embeddingModel: 'text-embedding-3-large',
  options: { temperature: 0.3 }
});

// Function to generate embeddings for entities
async function generateEmbeddings() {
  const entities = await ultralink.getEntities();
  
  console.log(`Generating embeddings for ${Object.keys(entities).length} entities...`);
  
  for (const [entityId, entity] of Object.entries(entities)) {
    // Create text representation of the entity
    const entityText = [
      `Type: ${entity.type}`,
      `Name: ${entity.attributes.name || ''}`,
      `Description: ${entity.attributes.description || ''}`,
      // Add other relevant attributes
      ...Object.entries(entity.attributes)
        .filter(([key]) => !['name', 'description', 'description_source', 'last_updated'].includes(key))
        .map(([key, value]) => `${key}: ${value}`)
    ].join('\n');
    
    console.log(`Generating embedding for ${entityId}...`);
    
    // Generate embedding using the LLM service
    const embedding = await ultralink.llm.generateEmbedding(entityText);
    
    // Update entity with embedding
    await ultralink.updateEntity(entityId, {
      vector: embedding,
      vector_source: 'text-embedding-3-large',
      vector_updated: new Date().toISOString()
    });
  }
  
  // Save the knowledge graph with embeddings
  await ultralink.save('./vector-company-knowledge.json');
  
  console.log('Embeddings generated successfully!');
}

// Function to test semantic search
async function testSemanticSearch() {
  console.log('\nTesting semantic search:');
  
  // Example queries
  const queries = [
    "Who leads the engineering team?",
    "What skills does the marketing director have?",
    "How many employees are in the sales department?",
    "Who has been at the company the longest?"
  ];
  
  for (const query of queries) {
    console.log(`\nQuery: ${query}`);
    
    // Perform semantic search
    const results = await ultralink.semanticSearch(query, {
      limit: 3,
      minSimilarity: 0.5
    });
    
    console.log('Results:');
    for (const result of results) {
      const entity = await ultralink.getEntity(result.id);
      console.log(`- ${entity.attributes.name || entity.id} (${entity.type}) - Similarity: ${result.similarity.toFixed(3)}`);
    }
  }
}

// Run embedding generation and test search
async function run() {
  await generateEmbeddings();
  await testSemanticSearch();
}

run()
  .then(() => console.log('Completed successfully!'))
  .catch(err => console.error('Error:', err));
```

Run this script to generate embeddings for all entities and test semantic search functionality.

## Summary

Congratulations! 🎉 You've successfully completed the LLM integration tutorial with UltraLink. You've learned how to:

1. Set up LLM integration with UltraLink
2. Create a knowledge graph with entities and relationships
3. Enhance entity descriptions using LLMs
4. Generate insights about relationships in your knowledge graph
5. Create an interactive query interface
6. Integrate vector embeddings for semantic search

## Next Steps

To further expand your UltraLink LLM skills, consider:

- Exploring more advanced prompt engineering techniques ([Prompt Engineering Guide](../guides/prompt-engineering.md))
- Implementing LLM-powered knowledge extraction from documents
- Creating custom templates for different use cases
- Integrating with other AI services
- Implementing security best practices ([LLM Security Guide](../guides/llm-security.md))

## Troubleshooting

If you encounter issues:

- Verify your API key is correct and has sufficient permissions
- Check that you're using a supported LLM provider
- Ensure your UltraLink version is up to date
- Review the LLM provider's documentation for rate limits and usage guidelines
- Check the UltraLink logs for detailed error information

For more information, see the [UltraLink documentation](../README.md) and the [LLM Integration Guide](../guides/llm-integration.md). 