# UltraLink Practical Examples

## 1. Basic Usage

### 1.1 Creating a Knowledge Graph

```javascript
const { UltraLink } = require('ultralink');

// Initialize UltraLink
const ultralink = new UltraLink();

// Create entities with vector embeddings
const entity = ultralink.createEntity('concept', 'machine-learning', {
  name: 'Machine Learning',
  description: 'A field of AI focused on learning from data',
  vector: {
    embedding: [0.23, 0.45, -0.12, 0.78],
    cluster: 'ai-concepts',
    centroid_distance: 0.12
  }
});

// Create relationships
ultralink.createLink('machine-learning', 'deep-learning', 'is_parent_of');
```

### 1.2 Adding LLM Insights

```javascript
// Add LLM-generated insights
entity.attributes.llm_insights = {
  key_findings: [{
    statement: "Shows strong correlation with statistical methods",
    justification: "Based on citation network analysis",
    confidence: 0.92,
    supporting_evidence: ['stats-paper-1', 'ml-review-2022']
  }],
  critical_parameters: {
    complexity: {
      value: "high",
      justification: "Requires significant computational resources"
    }
  }
};
```

## 2. Advanced Features

### 2.1 Temporal Analysis

```javascript
// Track knowledge evolution
ultralink.metadata.temporal_analysis = {
  knowledge_evolution: [{
    timeframe: "2023-Q1",
    key_developments: ["transformer_architecture", "attention_mechanisms"],
    impact_score: 0.85
  }]
};

// Query temporal changes
const evolution = ultralink.getTemporalChanges('machine-learning', {
  startDate: '2023-01-01',
  endDate: '2023-12-31'
});
```

### 2.2 Vector Operations

```javascript
// Find similar concepts
const similar = ultralink.findSimilar('machine-learning', {
  threshold: 0.8,
  limit: 5
});

// Cluster analysis
const clusters = ultralink.analyzeClusters({
  method: 'kmeans',
  dimensions: ['embedding'],
  k: 5
});
```

## 3. Export Examples

### 3.1 JSON Export

```javascript
const jsonOutput = ultralink.toJSON();
console.log(JSON.stringify(jsonOutput, null, 2));

// Output structure:
{
  "entities": [{
    "id": "machine-learning",
    "type": "concept",
    "attributes": {
      "name": "Machine Learning",
      "vector": {
        "embedding": [0.23, 0.45, -0.12, 0.78],
        "cluster": "ai-concepts"
      }
    }
  }],
  "metadata": {
    "temporal_analysis": {
      "knowledge_evolution": [...]
    }
  }
}
```

### 3.2 GraphML Export

```javascript
const graphml = ultralink.toGraphML();

// Output structure:
<?xml version="1.0" encoding="UTF-8"?>
<graphml>
  <key id="vector_embedding" for="node" attr.name="vector_embedding"/>
  <graph id="G" edgedefault="directed">
    <node id="machine-learning">
      <data key="vector_embedding">[0.23,0.45,-0.12,0.78]</data>
    </node>
  </graph>
</graphml>
```

### 3.3 Obsidian Export

```javascript
const obsidianFiles = ultralink.toObsidian();

// Example output for machine-learning.md:
# Machine Learning

Type: concept

## Vector Metadata
- Cluster: ai-concepts
- Centroid Distance: 0.12
- Similar Concepts:
  - [[statistical-learning]] (similarity: 0.92)
  - [[deep-learning]] (similarity: 0.85)

## LLM Insights
### Key Findings
- Shows strong correlation with statistical methods
  - Justification: Based on citation network analysis
  - Confidence: 0.92
  - Supporting Evidence:
    - [[stats-paper-1]]
    - [[ml-review-2022]]
```

## 4. Analysis Examples

### 4.1 Graph Analysis

```javascript
// Calculate centrality measures
const centrality = ultralink.analyzeCentrality({
  measures: ['betweenness', 'eigenvector'],
  weightAttribute: 'similarity'
});

// Find important nodes
const keyNodes = ultralink.findKeyNodes({
  metric: 'centrality',
  threshold: 0.8
});
```

### 4.2 Impact Analysis

```javascript
// Analyze research impact
const impact = ultralink.analyzeImpact('machine-learning', {
  timeframe: '2023',
  metrics: ['citations', 'applications']
});

// Generate impact report
const report = ultralink.generateImpactReport(impact, {
  format: 'markdown',
  includePlots: true
});
```

## 5. Integration Examples

### 5.1 LLM Integration

```javascript
// Generate insights from content
const insights = await ultralink.generateInsights('machine-learning', {
  model: 'gpt-4',
  aspects: ['technical', 'applications', 'trends']
});

// Update knowledge graph with new insights
ultralink.updateWithInsights(insights, {
  confidence_threshold: 0.8,
  require_evidence: true
});
```

### 5.2 Vector Database Integration

```javascript
// Index vectors in external database
await ultralink.indexVectors({
  provider: 'pinecone',
  namespace: 'concepts',
  batch_size: 100
});

// Perform similarity search
const results = await ultralink.similaritySearch('machine-learning', {
  k: 10,
  threshold: 0.7
});
```

## 6. Best Practice Examples

### 6.1 Error Handling

```javascript
try {
  const entity = ultralink.createEntity('invalid-type', 'test', {});
} catch (error) {
  if (error instanceof UltraLinkValidationError) {
    console.error('Validation failed:', error.details);
  }
}
```

### 6.2 Performance Optimization

```javascript
// Batch operations
await ultralink.batchProcess([
  { operation: 'create', type: 'concept', id: 'c1' },
  { operation: 'create', type: 'concept', id: 'c2' },
  { operation: 'link', source: 'c1', target: 'c2' }
], {
  transaction: true,
  validateAll: true
});

// Efficient exports
const stream = ultralink.createExportStream('graphml', {
  batch_size: 1000,
  compress: true
});
```

## 7. Extension Examples

### 7.1 Custom Entity Type

```javascript
class ResearchPaper extends CustomEntity {
  static validationRules = [{
    field: 'doi',
    validator: (doi) => /10\.\d{4,}\/\S+/.test(doi)
  }];
  
  calculateImpact() {
    return this.attributes.citations * this.attributes.influence_factor;
  }
}

ultralink.registerEntityType('research-paper', ResearchPaper);
```

### 7.2 Custom Analysis Plugin

```javascript
class CitationAnalysis implements AnalysisPlugin {
  name = 'citation-analysis';
  description = 'Analyzes citation patterns and impact';
  
  compute(graph: UltraLink): AnalysisResult {
    const citations = this.analyzeCitationNetwork(graph);
    const impact = this.calculateImpactFactors(citations);
    return { citations, impact };
  }
}

ultralink.registerPlugin(new CitationAnalysis());
``` 