# UltraLink API Reference

## Core Classes

### UltraLink

The main class for managing the knowledge graph and its operations.

#### Constructor

```typescript
constructor(options?: {
  validateOnCreate?: boolean;
  strictMode?: boolean;
  vectorDimensions?: number;
})
```

#### Entity Management

```typescript
createEntity(type: string, id: string, attributes: object): Entity
getEntity(id: string): Entity | null
updateEntity(id: string, updates: object): Entity
deleteEntity(id: string): boolean
```

#### Relationship Management

```typescript
createLink(sourceId: string, targetId: string, type: string): Link
getLinks(entityId: string): Set<Link>
updateLink(sourceId: string, targetId: string, updates: object): Link
deleteLink(sourceId: string, targetId: string): boolean
```

#### Vector Operations

```typescript
addVectorEmbedding(entityId: string, embedding: number[]): void
findSimilar(entityId: string, options: {
  threshold?: number;
  limit?: number;
  includeMetadata?: boolean;
}): Array<{id: string; similarity: number}>
analyzeClusters(options: {
  method: 'kmeans' | 'dbscan' | 'hierarchical';
  dimensions: string[];
  k?: number;
  minPoints?: number;
}): ClusterAnalysis[]
```

#### LLM Integration

```typescript
async generateInsights(entityId: string, options: {
  model: string;
  aspects: string[];
  maxTokens?: number;
}): Promise<LLMInsights>

updateWithInsights(insights: LLMInsights, options: {
  confidence_threshold?: number;
  require_evidence?: boolean;
}): void

async analyzeContent(content: string, options: {
  extractEntities?: boolean;
  generateEmbeddings?: boolean;
  inferRelationships?: boolean;
}): Promise<ContentAnalysis>
```

#### Temporal Analysis

```typescript
getTemporalChanges(entityId: string, options: {
  startDate: string;
  endDate: string;
  granularity?: 'day' | 'week' | 'month' | 'quarter';
}): TemporalChanges[]

trackEvolution(options: {
  aspects: string[];
  timeframe: string;
}): void

getVersionHistory(entityId: string): VersionHistory[]
```

#### Export Operations

```typescript
toJSON(): object
toCSV(): string
toGraphML(): string
toObsidian(): {[filename: string]: string}

createExportStream(format: string, options: {
  batch_size?: number;
  compress?: boolean;
}): ReadableStream
```

#### Analysis Operations

```typescript
analyzeCentrality(options: {
  measures: string[];
  weightAttribute?: string;
}): CentralityMeasures

findKeyNodes(options: {
  metric: string;
  threshold: number;
}): string[]

analyzeImpact(entityId: string, options: {
  timeframe: string;
  metrics: string[];
}): ImpactAnalysis

generateImpactReport(impact: ImpactAnalysis, options: {
  format: 'markdown' | 'html' | 'pdf';
  includePlots?: boolean;
}): string
```

#### Extension Points

```typescript
registerEntityType(type: string, entityClass: typeof CustomEntity): void
registerPlugin(plugin: AnalysisPlugin): void
registerTransformation(transformation: CustomTransformation): void
```

## Type Definitions

### Entity

```typescript
interface Entity {
  id: string;
  type: string;
  attributes: {
    [key: string]: any;
    vector?: VectorMetadata;
    llm_insights?: LLMInsights;
    temporal?: TemporalData;
  };
  getLinks(): Set<Link>;
  update(updates: object): void;
  validate(): boolean;
}
```

### Link

```typescript
interface Link {
  source: string;
  target: string;
  type: string;
  attributes?: {[key: string]: any};
  getSourceEntity(): Entity;
  getTargetEntity(): Entity;
  update(updates: object): void;
}
```

### VectorMetadata

```typescript
interface VectorMetadata {
  embedding: number[];
  cluster?: string;
  centroid_distance?: number;
  similar_concepts?: Array<{
    id: string;
    similarity: number;
  }>;
}
```

### LLMInsights

```typescript
interface LLMInsights {
  key_findings: Array<{
    statement: string;
    justification: string;
    confidence: number;
    supporting_evidence: string[];
  }>;
  critical_parameters?: {
    [key: string]: {
      value: any;
      justification: string;
    };
  };
  risk_assessment?: {
    technical_risks: Array<{
      risk: string;
      probability: number;
      impact: number;
    }>;
  };
}
```

### TemporalData

```typescript
interface TemporalData {
  knowledge_evolution: Array<{
    timeframe: string;
    key_developments: string[];
    impact_score: number;
  }>;
  version_history?: Array<{
    version: string;
    changes: Change[];
    metadata: any;
  }>;
}
```

### Analysis Results

```typescript
interface ClusterAnalysis {
  name: string;
  centroid: number[];
  members: string[];
  coherence: number;
  temporal_stability: number;
}

interface CentralityMeasures {
  betweenness: {[key: string]: number};
  eigenvector: {[key: string]: number};
  degree: {[key: string]: number};
}

interface ImpactAnalysis {
  citation_network: {
    vector: number[];
    influential_citations: Citation[];
    research_threads: ResearchThread[];
  };
  methodology_assessment: {
    novelty_score: number;
    reproducibility_score: number;
    justification: string;
  };
}
```

### Extension Interfaces

```typescript
interface CustomEntity extends Entity {
  static validationRules: ValidationRule[];
  [key: string]: any;
}

interface AnalysisPlugin {
  name: string;
  description: string;
  compute(graph: UltraLink): AnalysisResult;
}

interface CustomTransformation {
  source_format: string;
  target_format: string;
  transform(data: any): any;
  validate(result: any): boolean;
}
```

## Error Types

```typescript
class UltraLinkError extends Error {
  constructor(message: string, code?: string);
}

class UltraLinkValidationError extends UltraLinkError {
  constructor(message: string, details: object);
}

class UltraLinkTypeError extends UltraLinkError {
  constructor(message: string, type: string);
}

class UltraLinkReferenceError extends UltraLinkError {
  constructor(message: string, id: string);
}
```

## Constants

```typescript
const VECTOR_OPERATIONS = {
  COSINE_SIMILARITY: 'cosine',
  EUCLIDEAN_DISTANCE: 'euclidean',
  MANHATTAN_DISTANCE: 'manhattan'
};

const CLUSTERING_METHODS = {
  KMEANS: 'kmeans',
  DBSCAN: 'dbscan',
  HIERARCHICAL: 'hierarchical'
};

const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  GRAPHML: 'graphml',
  OBSIDIAN: 'obsidian'
};

const TEMPORAL_GRANULARITY = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter'
};
``` 