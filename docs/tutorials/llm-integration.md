# Integrating LLMs with UltraLink

This tutorial explores how to integrate Large Language Models (LLMs) with UltraLink to enhance knowledge graphs with AI-generated insights, automatic relationship discovery, and content analysis.

## Prerequisites

Before starting this tutorial, make sure you have:

- Installed UltraLink core package
- Installed the LLM extension: `npm install @ultralink/llm`
- Access to an LLM provider API key (OpenAI, Anthropic, etc.)
- Basic familiarity with UltraLink's core concepts

## Understanding LLM Integration

Large Language Models can significantly enhance knowledge graphs in several ways:

- **Entity Extraction**: Automatically identify and extract entities from unstructured text
- **Relationship Discovery**: Detect relationships between entities
- **Insight Generation**: Create rich insights about entities
- **Content Analysis**: Analyze and summarize document content
- **Knowledge Gap Detection**: Identify missing information in your knowledge graph

UltraLink provides built-in integration with popular LLM providers to enable these capabilities.

## 1. Setting Up LLM Integration

First, let's set up UltraLink with LLM integration:

```javascript
const { UltraLink } = require('ultralink');
const { LLMExtension, OpenAIProvider } = require('@ultralink/llm');

// Create UltraLink instance
const graph = new UltraLink();

// Configure LLM provider
const llmProvider = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo',
  temperature: 0.3
});

// Register LLM extension
graph.use(LLMExtension, { provider: llmProvider });

console.log('UltraLink initialized with LLM integration');
```

### Supported LLM Providers

UltraLink supports multiple LLM providers:

```javascript
// OpenAI provider
const openaiProvider = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo'
});

// Anthropic provider
const anthropicProvider = new AnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-opus'
});

// Mistral provider
const mistralProvider = new MistralProvider({
  apiKey: process.env.MISTRAL_API_KEY,
  defaultModel: 'mistral-large'
});

// Ollama provider (local LLMs)
const ollamaProvider = new OllamaProvider({
  baseUrl: 'http://localhost:11434',
  defaultModel: 'llama3'
});
```

## 2. Creating a Knowledge Graph

Let's create a knowledge graph about renewable energy technologies:

```javascript
// Create some entities related to renewable energy
const solarEntity = graph.createEntity('technology', 'solar-power', {
  name: 'Solar Power',
  description: 'Energy derived from sunlight through photovoltaic panels or concentrated solar plants',
  established: 1954,
  efficiency: {
    typical: '15-22%',
    maximum_lab: '47.1%'
  }
});

const windEntity = graph.createEntity('technology', 'wind-power', {
  name: 'Wind Power',
  description: 'Conversion of wind energy into electricity using wind turbines',
  established: 1887,
  efficiency: {
    typical: '35-45%',
    maximum_theoretical: '59.3%'
  }
});

const hydropowerEntity = graph.createEntity('technology', 'hydropower', {
  name: 'Hydroelectric Power',
  description: 'Electricity generated from flowing water using dams or run-of-river installations',
  established: 1878,
  efficiency: {
    typical: '85-95%'
  }
});

// Add some basic relationships
graph.createLink('solar-power', 'wind-power', 'related-to', {
  context: 'Complementary intermittent renewable sources'
});

console.log('Created renewable energy knowledge graph with basic entities');
```

## 3. Generating Insights with LLMs

Now, let's use LLMs to generate insights about our entities:

```javascript
// Generate insights for the solar power entity
const solarInsights = await graph.generateInsights('solar-power', {
  aspects: [
    'environmental_impact', 
    'economic_factors', 
    'technological_challenges', 
    'future_developments'
  ],
  depth: 'comprehensive'
});

// Update the entity with the generated insights
graph.updateEntityWithInsights('solar-power', solarInsights);

console.log('Generated insights for solar power:');
console.log(JSON.stringify(solarInsights, null, 2));

// We can also generate insights for multiple entities
const techIds = ['wind-power', 'hydropower'];
for (const id of techIds) {
  const insights = await graph.generateInsights(id, {
    aspects: ['environmental_impact', 'economic_factors'],
    depth: 'summary'
  });
  graph.updateEntityWithInsights(id, insights);
  console.log(`Generated insights for ${id}`);
}
```

### Example Generated Insights Structure

The `generateInsights` method returns structured insights that look like this:

```javascript
{
  "key_findings": [
    {
      "aspect": "environmental_impact",
      "findings": [
        {
          "statement": "Solar power produces no direct greenhouse gas emissions during operation",
          "confidence": 0.98,
          "supporting_evidence": ["Multiple lifecycle analysis studies", "IPCC reports"]
        },
        {
          "statement": "Manufacturing of solar panels involves energy-intensive processes and some toxic materials",
          "confidence": 0.95,
          "supporting_evidence": ["Industry manufacturing data", "Environmental impact assessments"]
        }
      ]
    },
    {
      "aspect": "economic_factors",
      "findings": [
        {
          "statement": "The levelized cost of solar energy has decreased by 90% since 2009",
          "confidence": 0.97,
          "supporting_evidence": ["Lazard's annual LCOE analysis", "IRENA renewable cost database"]
        }
      ]
    }
  ],
  "connections": [
    {
      "entity_type": "policy",
      "suggested_entities": ["carbon_pricing", "renewable_subsidies"],
      "relationship_type": "influenced_by",
      "confidence": 0.89
    }
  ],
  "knowledge_gaps": [
    {
      "description": "Long-term environmental impact of solar panel disposal",
      "importance": "high",
      "research_suggestion": "Analysis of recycling technologies and their scaling potential"
    }
  ]
}
```

## 4. Extracting Entities from Text

LLMs can help identify and extract entities from unstructured text:

```javascript
const text = `
Geothermal energy harnesses heat from beneath the Earth's surface. 
Heat pumps can be used in most parts of the world, while deep wells 
are more suitable for regions with tectonic activity. Iceland generates 
about 30% of its electricity from geothermal sources.
`;

// Extract entities from text
const extractedEntities = await graph.extractEntitiesFromText(text, {
  entityTypes: ['technology', 'location', 'statistic'],
  confidence_threshold: 0.7
});

// Add extracted entities to the graph
for (const entity of extractedEntities) {
  graph.createEntity(entity.type, entity.id, entity.attributes);
  console.log(`Added extracted entity: ${entity.id} (${entity.type})`);
}

// Example output of extracted entities
console.log(extractedEntities);
```

### Customizing Entity Extraction

You can customize the entity extraction process with prompts:

```javascript
const customExtractionResult = await graph.extractEntitiesFromText(text, {
  entityTypes: ['technology', 'location', 'statistic'],
  customPrompt: `
    Analyze the following text and extract entities.
    For technology entities, include fields for maturity_level and primary_application.
    For location entities, include latitude, longitude if mentioned.
    For statistic entities, include the numerical value, unit, and reliability_score.
  `,
  outputFormat: 'structured_json'
});
```

## 5. Discovering Relationships

LLMs can help discover implied relationships in content:

```javascript
const articleText = `
Bifacial solar panels are becoming increasingly popular as they can capture
reflected sunlight on their rear side, increasing generation by 5-30% depending
on installation conditions. They work particularly well in snowy regions where
the white ground can reflect significant light. However, they generally have
higher upfront costs than traditional monofacial panels.
`;

// Discover relationships from text
const discoveredRelationships = await graph.discoverRelationshipsFromText(articleText, {
  baseEntityId: 'solar-power',
  relationshipTypes: ['has_variant', 'performs_well_in', 'compared_to'],
  confidence_threshold: 0.75
});

// Add the discovered relationships and entities to the graph
for (const relationship of discoveredRelationships) {
  // Create the target entity if it doesn't exist
  if (!graph.hasEntity(relationship.target.id)) {
    graph.createEntity(
      relationship.target.type,
      relationship.target.id,
      relationship.target.attributes
    );
    console.log(`Created new entity: ${relationship.target.id}`);
  }
  
  // Create the relationship
  graph.createLink(
    relationship.source,
    relationship.target.id,
    relationship.type,
    relationship.attributes
  );
  
  console.log(`Created relationship: ${relationship.source} -[${relationship.type}]-> ${relationship.target.id}`);
}
```

## 6. Enhancing Knowledge Graph with LLM-Powered Analysis

Let's perform an overall analysis of our knowledge graph:

```javascript
// Analyze the entire knowledge graph for insights
const graphAnalysis = await graph.analyzeKnowledgeGraph({
  focus: 'renewable_energy',
  analysis_types: ['gaps', 'clusters', 'recommendations'],
  depth: 'comprehensive'
});

console.log('Knowledge Graph Analysis:');
console.log(JSON.stringify(graphAnalysis, null, 2));

// Example output
// {
//   "gaps": [
//     {
//       "description": "Missing biomass energy as a key renewable source",
//       "importance": "high",
//       "suggested_entities": [
//         {
//           "id": "biomass-energy",
//           "type": "technology",
//           "attributes": {
//             "name": "Biomass Energy",
//             "description": "Energy derived from organic materials like plants and animal waste"
//           }
//         }
//       ]
//     }
//   ],
//   "clusters": [
//     {
//       "name": "Intermittent Renewables",
//       "entities": ["solar-power", "wind-power"],
//       "common_attributes": ["variable output", "weather dependency"]
//     },
//     {
//       "name": "Stable Baseload Renewables",
//       "entities": ["hydropower", "geothermal-energy"],
//       "common_attributes": ["consistent output", "dispatchable"]
//     }
//   ],
//   "recommendations": [
//     {
//       "type": "Add Entity",
//       "details": "Add 'energy-storage' entity to complete the renewable ecosystem discussion"
//     },
//     {
//       "type": "Add Relationship",
//       "details": "Connect solar and wind to potential storage technologies"
//     }
//   ]
// }
```

## 7. Implementing the Analysis Recommendations

Let's implement some of the recommendations from our analysis:

```javascript
// Add the suggested biomass energy entity
graph.createEntity('technology', 'biomass-energy', {
  name: 'Biomass Energy',
  description: 'Energy derived from organic materials like plants and animal waste',
  established: 1800, // Approximate - biomass has been used for centuries
  efficiency: {
    typical: '20-25%'
  }
});

// Add energy storage entity
graph.createEntity('technology', 'energy-storage', {
  name: 'Energy Storage',
  description: 'Technologies that store energy for later use to balance supply and demand',
  types: ['battery', 'pumped hydro', 'thermal', 'hydrogen']
});

// Create relationships between intermittent renewables and storage
graph.createLink('solar-power', 'energy-storage', 'requires', {
  context: 'For nighttime energy supply',
  importance: 'critical'
});

graph.createLink('wind-power', 'energy-storage', 'requires', {
  context: 'For low-wind periods',
  importance: 'critical'
});

console.log('Implemented knowledge graph recommendations');
```

## 8. Generating Questions and Answers

UltraLink can leverage LLMs to generate and answer questions about your knowledge graph:

```javascript
// Generate potential questions about the knowledge graph
const questions = await graph.generateQuestionsAboutEntity('solar-power', {
  question_types: ['technical', 'economic', 'comparative'],
  count: 3
});

console.log('Generated Questions:');
console.log(questions);

// Answer a specific question using the knowledge graph
const answer = await graph.answerQuestion({
  question: "How does the efficiency of solar power compare to wind power?",
  entityContext: ['solar-power', 'wind-power'],
  citation_level: 'detailed'
});

console.log('Answer:');
console.log(answer);

// Example answer output:
// {
//   "answer": "Solar power typically has lower efficiency rates (15-22%) compared to wind power (35-45%). 
//             The maximum theoretical efficiency for solar is higher in laboratory conditions (47.1%) 
//             than wind power's theoretical limit (Betz limit of 59.3%).",
//   "confidence": 0.92,
//   "citations": [
//     {
//       "entity_id": "solar-power",
//       "attribute": "efficiency.typical",
//       "value": "15-22%"
//     },
//     {
//       "entity_id": "wind-power",
//       "attribute": "efficiency.typical",
//       "value": "35-45%"
//     }
//   ]
// }
```

## 9. Enriching Entities with External Knowledge

UltraLink can leverage LLMs to enrich entities with external knowledge:

```javascript
// Enrich an entity with external knowledge
const enrichedEntity = await graph.enrichEntityWithExternalKnowledge('solar-power', {
  aspects: ['recent_developments', 'market_trends', 'research_breakthroughs'],
  knowledge_cutoff: '2023-01', // Only include knowledge after this date
  citation_requirements: 'include_sources'
});

// Update the entity with enriched information
graph.updateEntity('solar-power', enrichedEntity.attributes);

// Also track the sources of this new information
for (const source of enrichedEntity.sources) {
  graph.createEntity('source', source.id, {
    title: source.title,
    publication_date: source.date,
    url: source.url,
    reliability: source.reliability_score
  });
  
  graph.createLink('solar-power', source.id, 'referenced_by', {
    context: source.context
  });
}

console.log('Enriched solar power entity with external knowledge');
```

## 10. Analyzing Potential Inconsistencies

LLMs can help identify potential inconsistencies or contradictions in your knowledge graph:

```javascript
// Find inconsistencies in the knowledge graph
const inconsistencies = await graph.findInconsistencies({
  severity_threshold: 'medium',
  entity_types: ['technology']
});

console.log('Potential inconsistencies found:');
console.log(inconsistencies);

// Example output:
// [
//   {
//     "type": "attribute_contradiction",
//     "entities": ["solar-power", "bifacial-panels"],
//     "description": "The efficiency listed for bifacial panels (30%) exceeds the maximum typical efficiency listed for solar power (22%)",
//     "severity": "medium",
//     "resolution_suggestion": "Clarify that bifacial panels represent a specific advanced technology with higher efficiency than conventional panels"
//   }
// ]

// Automatically resolve some inconsistencies
for (const inconsistency of inconsistencies) {
  if (inconsistency.severity === 'low') {
    await graph.resolveInconsistency(inconsistency.id, {
      apply_suggestion: true
    });
    console.log(`Resolved inconsistency: ${inconsistency.id}`);
  } else {
    console.log(`Please manually review inconsistency: ${inconsistency.description}`);
  }
}
```

## 11. Creating Documentation and Explanations

LLMs can help generate documentation and explanations for your knowledge graph:

```javascript
// Generate documentation for an entity
const documentation = await graph.generateEntityDocumentation('solar-power', {
  format: 'markdown',
  sections: ['overview', 'technical_details', 'applications', 'comparisons'],
  audience: 'technical'
});

console.log('Generated documentation:');
console.log(documentation);

// Generate an explanation of a relationship
const explanation = await graph.explainRelationship('solar-power', 'energy-storage', 'requires', {
  depth: 'detailed',
  include_examples: true
});

console.log('Relationship explanation:');
console.log(explanation);
```

## 12. Integrating Multiple LLM Providers

UltraLink allows you to use different LLM providers for different tasks:

```javascript
// Configure multiple providers
const openai = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo'
});

const claude = new AnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-opus'
});

const mistral = new MistralProvider({
  apiKey: process.env.MISTRAL_API_KEY,
  defaultModel: 'mistral-large'
});

// Create a multi-provider manager
const multiProvider = new MultiProviderManager({
  default: openai,
  providers: {
    analysis: claude,      // Use Claude for in-depth analysis
    extraction: openai,    // Use OpenAI for entity extraction
    generation: mistral    // Use Mistral for content generation
  }
});

// Register LLM extension with multi-provider
graph.use(LLMExtension, { provider: multiProvider });

// Now different operations will use different models
const analysis = await graph.analyzeKnowledgeGraph({ /* options */ }); // Uses Claude
const entities = await graph.extractEntitiesFromText(text); // Uses OpenAI
const docs = await graph.generateEntityDocumentation('solar-power'); // Uses Mistral
```

## Complete Example

Here's a complete example that demonstrates key LLM integration capabilities:

```javascript
const { UltraLink } = require('ultralink');
const { LLMExtension, OpenAIProvider } = require('@ultralink/llm');
require('dotenv').config(); // Load environment variables from .env file

async function main() {
  // Initialize UltraLink with LLM extension
  const graph = new UltraLink();
  
  const llmProvider = new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: 'gpt-4'
  });
  
  graph.use(LLMExtension, { provider: llmProvider });
  
  // Create a knowledge base about renewable energy
  const solarEntity = graph.createEntity('technology', 'solar-power', {
    name: 'Solar Power',
    description: 'Energy derived from sunlight through photovoltaic panels or concentrated solar plants',
    established: 1954
  });
  
  const windEntity = graph.createEntity('technology', 'wind-power', {
    name: 'Wind Power',
    description: 'Conversion of wind energy into electricity using wind turbines',
    established: 1887
  });
  
  // Add a relationship
  graph.createLink('solar-power', 'wind-power', 'related-to');
  
  // Generate insights for solar power
  console.log('Generating insights for solar power...');
  const insights = await graph.generateInsights('solar-power', {
    aspects: ['environmental_impact', 'economic_factors'],
    depth: 'summary'
  });
  
  // Update entity with insights
  graph.updateEntityWithInsights('solar-power', insights);
  
  console.log('Generated insights:');
  console.log(JSON.stringify(insights, null, 2));
  
  // Extract entities from text
  const text = `
    Geothermal energy harnesses heat from beneath the Earth's surface.
    Iceland generates about 30% of its electricity from geothermal sources.
  `;
  
  console.log('Extracting entities from text...');
  const extractedEntities = await graph.extractEntitiesFromText(text, {
    entityTypes: ['technology', 'location', 'statistic']
  });
  
  // Add extracted entities
  for (const entity of extractedEntities) {
    graph.createEntity(entity.type, entity.id, entity.attributes);
    console.log(`Added entity: ${entity.id} (${entity.type})`);
  }
  
  // Analyze the knowledge graph
  console.log('Analyzing knowledge graph...');
  const analysis = await graph.analyzeKnowledgeGraph({
    focus: 'renewable_energy',
    analysis_types: ['gaps', 'recommendations']
  });
  
  console.log('Knowledge Graph Analysis Recommendations:');
  for (const rec of analysis.recommendations) {
    console.log(`- ${rec.details}`);
  }
  
  // Generate documentation
  console.log('Generating documentation for solar power...');
  const documentation = await graph.generateEntityDocumentation('solar-power', {
    format: 'markdown',
    sections: ['overview', 'applications']
  });
  
  console.log('Documentation:');
  console.log(documentation.substring(0, 300) + '...');
}

main().catch(console.error);
```

## Next Steps

Now that you've learned about integrating LLMs with UltraLink, consider exploring:

1. [Advanced LLM Prompting](../advanced/llm-prompting.md) - Create custom prompts for specialized tasks
2. [Knowledge Graph Validation](../advanced/knowledge-validation.md) - Use LLMs to validate and improve your knowledge graph
3. [Multi-Modal Integration](../advanced/multi-modal.md) - Combine text, image, and other modalities
4. [LLM Performance Optimization](../performance/llm-optimization.md) - Optimize LLM usage for cost and performance

LLM integration with UltraLink opens up powerful capabilities for automating knowledge graph creation, analysis, and enrichment with AI-powered insights. 