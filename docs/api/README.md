# UltraLink API Reference 📚

## Overview

This document provides a comprehensive reference for the UltraLink API, including all classes, methods, parameters, and examples. The API is organized by module and includes detailed descriptions of each component.

## Table of Contents

- [Core API](#core-api)
- [Entity Management](#entity-management)
- [Relationship Management](#relationship-management)
- [Vector Operations](#vector-operations)
- [Temporal Management](#temporal-management)
- [Visualization](#visualization)
- [Export](#export)
- [LLM Integration](#llm-integration)
- [Utilities](#utilities)

## Core API

### UltraLink Class

The main class that provides access to all UltraLink functionality.

```typescript
class UltraLink {
    // Constructor
    constructor(options?: UltraLinkOptions);
    
    // Properties
    entities: Map<string, Entity>;
    links: Map<string, Link[]>;
    metadata: Metadata;
    
    // Core Methods
    addEntity(id: string, type: string, attributes?: object): Entity;
    getEntity(id: string): Entity | undefined;
    removeEntity(id: string): boolean;
    updateEntity(id: string, updates: object): Entity;
    
    addLink(source: string, target: string, type: string, attributes?: object): Link;
    getLinks(source: string, options?: LinkQueryOptions): Link[];
    removeLink(source: string, target: string, type?: string): boolean;
    updateLink(source: string, target: string, type: string, updates: object): Link;
    
    // Export Methods
    toJSON(): object;
    toCSV(options?: CSVOptions): string;
    toGraphML(options?: GraphMLOptions): string;
    toObsidian(options?: ObsidianOptions): string;
    toDOT(options?: DOTOptions): string;
    
    // Vector Methods
    generateVectors(options?: VectorOptions): Promise<void>;
    findSimilar(entityId: string, options?: SimilarityOptions): Entity[];
    
    // Analysis Methods
    analyze(options?: AnalysisOptions): AnalysisResult;
}
```

#### UltraLinkOptions

```typescript
interface UltraLinkOptions {
    // Storage options
    storage?: 'memory' | 'file' | 'database';
    
    // Vector options
    vectorDimensions?: number;
    vectorModel?: string;
    
    // Performance options
    caching?: boolean;
    indexing?: boolean;
    
    // Integration options
    llmIntegration?: boolean;
    llmOptions?: LLMOptions;
}
```

#### Examples

```javascript
// Create a new UltraLink instance
const ultralink = new UltraLink({
    storage: 'memory',
    vectorDimensions: 1536,
    caching: true
});

// Add entities and links
const entity1 = ultralink.addEntity('doc-1', 'document', { title: 'Introduction to UltraLink' });
const entity2 = ultralink.addEntity('doc-2', 'document', { title: 'Advanced UltraLink Usage' });
const link = ultralink.addLink('doc-1', 'doc-2', 'references', { strength: 0.85 });

// Export to different formats
const jsonData = ultralink.toJSON();
const csvData = ultralink.toCSV();
const graphMLData = ultralink.toGraphML();
```

## Entity Management

### Entity Class

Represents a node in the knowledge graph.

```typescript
class Entity {
    // Properties
    id: string;
    type: string;
    attributes: Map<string, any>;
    
    // Methods
    addAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
    removeAttribute(key: string): boolean;
    updateAttribute(key: string, value: any): void;
    
    // Vector Methods
    hasVector(): boolean;
    getVector(): number[] | undefined;
    setVector(vector: number[]): void;
    
    // Temporal Methods
    getHistory(): Change[];
    getVersion(version: string): EntityVersion;
    revertTo(version: string): void;
}
```

#### EntityOptions

```typescript
interface EntityOptions {
    id: string;
    type: string;
    attributes?: Record<string, any>;
    vector?: number[];
    temporal?: TemporalData;
}
```

#### Examples

```javascript
// Create entity
const entity = ultralink.addEntity('concept-1', 'concept', {
    name: 'Vector Embeddings',
    description: 'Numerical representations of text in vector space'
});

// Update entity
entity.addAttribute('importance', 0.85);
entity.updateAttribute('description', 'Numerical representations of semantic meaning in vector space');

// Vector operations
await ultralink.generateVectors({ entities: [entity] });
const vector = entity.getVector();
```

## Relationship Management

### Link Class

Represents a directed edge between two entities.

```typescript
class Link {
    // Properties
    source: string;
    target: string;
    type: string;
    attributes: Map<string, any>;
    
    // Methods
    addAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
    removeAttribute(key: string): boolean;
    updateAttribute(key: string, value: any): void;
    
    // Utility Methods
    getStrength(): number;
    setStrength(strength: number): void;
    getReciprocal(): Link | undefined;
}
```

#### LinkOptions

```typescript
interface LinkOptions {
    source: string;
    target: string;
    type: string;
    attributes?: Record<string, any>;
    bidirectional?: boolean;
    strength?: number;
}
```

#### LinkQueryOptions

```typescript
interface LinkQueryOptions {
    type?: string | string[];
    targetType?: string | string[];
    minStrength?: number;
    maxStrength?: number;
    limit?: number;
    sortBy?: 'strength' | 'type' | 'created';
    direction?: 'outgoing' | 'incoming' | 'both';
}
```

#### Examples

```javascript
// Create link
const link = ultralink.addLink('concept-1', 'concept-2', 'related_to', {
    strength: 0.75,
    context: 'semantic similarity'
});

// Query links
const outgoingLinks = ultralink.getLinks('concept-1', {
    type: 'related_to',
    minStrength: 0.5,
    sortBy: 'strength'
});

// Update link
link.updateAttribute('strength', 0.85);
```

## Vector Operations

### VectorManager Class

Manages vector operations including generation, similarity, and clustering.

```typescript
class VectorManager {
    // Constructor
    constructor(ultralink: UltraLink, options?: VectorManagerOptions);
    
    // Generation Methods
    generateVector(text: string, options?: VectorGenerationOptions): Promise<number[]>;
    generateVectorsForEntities(entities: Entity[], options?: VectorGenerationOptions): Promise<void>;
    
    // Similarity Methods
    calculateSimilarity(vector1: number[], vector2: number[]): number;
    findSimilarEntities(entity: Entity, options?: SimilaritySearchOptions): Entity[];
    findSimilarByVector(vector: number[], options?: SimilaritySearchOptions): Entity[];
    
    // Clustering Methods
    clusterEntities(entities: Entity[], options?: ClusteringOptions): Cluster[];
    
    // Dimensionality Reduction
    reduceVectorDimensions(vectors: number[][], dimensions: number, method?: ReductionMethod): number[][];
}
```

#### VectorManagerOptions

```typescript
interface VectorManagerOptions {
    defaultModel?: string;
    dimensions?: number;
    normalization?: boolean;
    caching?: boolean;
    storage?: VectorStorageOptions;
}
```

#### VectorGenerationOptions

```typescript
interface VectorGenerationOptions {
    model?: string;
    dimensions?: number;
    normalize?: boolean;
    contextual?: boolean;
    batchSize?: number;
}
```

#### SimilaritySearchOptions

```typescript
interface SimilaritySearchOptions {
    minSimilarity?: number;
    maxResults?: number;
    types?: string[];
    includeMetadata?: boolean;
    sortBy?: 'similarity' | 'type' | 'created';
}
```

#### Examples

```javascript
// Generate vectors
const vectorManager = ultralink.vectors;
await vectorManager.generateVectorsForEntities(ultralink.entities.values());

// Find similar entities
const similar = vectorManager.findSimilarEntities(entity, {
    minSimilarity: 0.7,
    maxResults: 10
});

// Cluster entities
const clusters = vectorManager.clusterEntities(Array.from(ultralink.entities.values()), {
    method: 'kmeans',
    numberOfClusters: 5
});
```

## Temporal Management

### TemporalManager Class

Manages temporal aspects of entities and relationships.

```typescript
class TemporalManager {
    // Constructor
    constructor(ultralink: UltraLink, options?: TemporalManagerOptions);
    
    // Versioning Methods
    createVersion(options?: VersionOptions): Version;
    getVersion(versionId: string): Version;
    listVersions(options?: ListVersionOptions): Version[];
    
    // Change Tracking
    trackChanges(entity: Entity, options?: TrackChangesOptions): Change[];
    revertChange(changeId: string): boolean;
    
    // Evolution Analysis
    analyzeEvolution(entityId: string, options?: EvolutionOptions): EvolutionResult;
    compareVersions(version1: string, version2: string): VersionDiff;
    
    // Temporal Queries
    queryAtTime(timestamp: Date, options?: TemporalQueryOptions): TemporalSnapshot;
    getHistory(entityId: string, options?: HistoryOptions): TemporalHistory;
}
```

#### TemporalManagerOptions

```typescript
interface TemporalManagerOptions {
    versioningStrategy?: 'semantic' | 'timestamp' | 'incremental';
    changeTracking?: boolean;
    historyRetention?: number; // in days
    changeGranularity?: 'entity' | 'attribute';
}
```

#### VersionOptions

```typescript
interface VersionOptions {
    name?: string;
    description?: string;
    type?: 'major' | 'minor' | 'patch';
    entities?: string[];
    metadata?: Record<string, any>;
}
```

#### Examples

```javascript
// Create a version
const version = ultralink.temporal.createVersion({
    name: 'v1.0.0',
    description: 'Initial release',
    type: 'major'
});

// Track changes
const changes = ultralink.temporal.trackChanges(entity, {
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31')
});

// Analyze evolution
const evolution = ultralink.temporal.analyzeEvolution('concept-1', {
    metrics: ['complexity', 'centrality', 'connections'],
    interval: 'month'
});
```

## Visualization

### VisualizationManager Class

Manages the creation and configuration of visualizations.

```typescript
class VisualizationManager {
    // Constructor
    constructor(ultralink: UltraLink, options?: VisualizationManagerOptions);
    
    // Creation Methods
    createNetworkVisualization(options?: NetworkVisualizationOptions): NetworkVisualization;
    createVectorVisualization(options?: VectorVisualizationOptions): VectorVisualization;
    createTimelineVisualization(options?: TimelineVisualizationOptions): TimelineVisualization;
    createMatrixVisualization(options?: MatrixVisualizationOptions): MatrixVisualization;
    
    // Dashboard
    createDashboard(options?: DashboardOptions): Dashboard;
    
    // Utility Methods
    registerVisualizationType(name: string, creator: VisualizationCreator): void;
    getAvailableVisualizationTypes(): string[];
}
```

#### VisualizationManagerOptions

```typescript
interface VisualizationManagerOptions {
    defaultRenderer?: 'svg' | 'canvas' | 'webgl';
    defaultTheme?: 'light' | 'dark' | 'custom';
    interactive?: boolean;
    responsive?: boolean;
    accessibility?: boolean;
}
```

#### NetworkVisualizationOptions

```typescript
interface NetworkVisualizationOptions {
    container?: string | HTMLElement;
    layout?: 'force' | 'hierarchical' | 'circular' | 'grid';
    nodeSize?: number | ((node: Entity) => number);
    nodeColor?: string | ((node: Entity) => string);
    edgeWidth?: number | ((edge: Link) => number);
    edgeColor?: string | ((edge: Link) => string);
    labels?: boolean | LabelOptions;
    events?: VisualizationEvents;
}
```

#### Examples

```javascript
// Create network visualization
const networkViz = ultralink.visualize.createNetworkVisualization({
    container: '#visualization',
    layout: 'force',
    nodeSize: node => node.getAttribute('importance') * 10 || 5,
    nodeColor: node => colorByType(node.type),
    labels: true
});

// Create dashboard
const dashboard = ultralink.visualize.createDashboard({
    container: '#dashboard',
    layout: 'grid',
    views: [
        { type: 'network', options: networkOptions },
        { type: 'vector', options: vectorOptions },
        { type: 'timeline', options: timelineOptions }
    ]
});
```

## Export

### ExportManager Class

Manages the export of UltraLink data to various formats.

```typescript
class ExportManager {
    // Constructor
    constructor(ultralink: UltraLink, options?: ExportManagerOptions);
    
    // Export Methods
    toJSON(options?: JSONExportOptions): object;
    toCSV(options?: CSVExportOptions): string;
    toGraphML(options?: GraphMLExportOptions): string;
    toObsidian(options?: ObsidianExportOptions): ObsidianExport;
    toDOT(options?: DOTExportOptions): string;
    
    // File Export
    exportToFile(format: ExportFormat, filePath: string, options?: any): Promise<void>;
    
    // Batch Export
    batchExport(exports: BatchExportItem[]): Promise<BatchExportResult>;
}
```

#### ExportManagerOptions

```typescript
interface ExportManagerOptions {
    defaultFormat?: ExportFormat;
    prettyPrint?: boolean;
    includeMetadata?: boolean;
    filesystem?: FileSystemOptions;
}
```

#### JSONExportOptions

```typescript
interface JSONExportOptions {
    pretty?: boolean;
    includeVectors?: boolean;
    includeTemporal?: boolean;
    filter?: ExportFilter;
}
```

#### Examples

```javascript
// Export to JSON
const jsonData = ultralink.export.toJSON({
    pretty: true,
    includeVectors: true
});

// Export to GraphML
const graphMLData = ultralink.export.toGraphML({
    includeAttributes: true,
    includeMetadata: true
});

// Batch export
const exportResult = await ultralink.export.batchExport([
    { format: 'json', options: jsonOptions, path: 'export/data.json' },
    { format: 'csv', options: csvOptions, path: 'export/data.csv' },
    { format: 'graphml', options: graphmlOptions, path: 'export/data.graphml' }
]);
```

## LLM Integration

### LLMManager Class

Manages the integration with Large Language Models for content enhancement.

```typescript
class LLMManager {
    // Constructor
    constructor(ultralink: UltraLink, options?: LLMManagerOptions);
    
    // Configuration
    configure(options: LLMConfigOptions): void;
    getConfiguration(): LLMConfigOptions;
    
    // Content Generation
    generateInsights(content: string, options?: InsightOptions): Promise<Insights>;
    enhanceEntity(entity: Entity, options?: EnhancementOptions): Promise<Entity>;
    
    // Relation Extraction
    extractRelations(content: string, options?: RelationExtractionOptions): Promise<ExtractedRelation[]>;
    
    // Utility Methods
    definePrompt(name: string, template: string, options?: PromptOptions): void;
    process(content: string, promptName: string, options?: ProcessOptions): Promise<any>;
}
```

#### LLMManagerOptions

```typescript
interface LLMManagerOptions {
    provider?: 'openai' | 'anthropic' | 'local' | 'custom';
    defaultModel?: string;
    apiKey?: string;
    endpoint?: string;
    timeout?: number;
    caching?: boolean;
}
```

#### InsightOptions

```typescript
interface InsightOptions {
    aspects?: string[];
    depth?: 'basic' | 'detailed' | 'comprehensive';
    format?: 'text' | 'json' | 'structured';
    maxResults?: number;
    language?: string;
}
```

#### Examples

```javascript
// Configure LLM integration
ultralink.llm.configure({
    provider: 'openai',
    defaultModel: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY
});

// Generate insights
const insights = await ultralink.llm.generateInsights(documentContent, {
    aspects: ['technical', 'implications', 'risks'],
    depth: 'detailed',
    format: 'json'
});

// Extract relations
const relations = await ultralink.llm.extractRelations(documentContent, {
    relationTypes: ['depends_on', 'references', 'contradicts'],
    confidence: true
});
```

## Utilities

### SearchManager Class

Provides search functionality across the UltraLink graph.

```typescript
class SearchManager {
    // Constructor
    constructor(ultralink: UltraLink, options?: SearchManagerOptions);
    
    // Search Methods
    searchByText(query: string, options?: TextSearchOptions): SearchResult[];
    searchByVector(vector: number[], options?: VectorSearchOptions): SearchResult[];
    searchByAttributes(attributes: Record<string, any>, options?: AttributeSearchOptions): SearchResult[];
    
    // Advanced Search
    query(queryObject: QueryObject): SearchResult[];
    
    // Index Management
    buildIndex(options?: IndexOptions): Promise<void>;
    updateIndex(entityIds?: string[]): Promise<void>;
}
```

#### SearchManagerOptions

```typescript
interface SearchManagerOptions {
    indexing?: boolean;
    defaultSearchFields?: string[];
    fuzzyMatching?: boolean;
    maxResults?: number;
}
```

#### TextSearchOptions

```typescript
interface TextSearchOptions {
    fields?: string[];
    fuzzy?: boolean;
    boost?: Record<string, number>;
    filter?: SearchFilter;
    limit?: number;
}
```

#### Examples

```javascript
// Text search
const results = ultralink.search.searchByText('machine learning', {
    fields: ['title', 'content', 'description'],
    fuzzy: true,
    limit: 10
});

// Vector search
const similarResults = ultralink.search.searchByVector(queryVector, {
    minSimilarity: 0.7,
    types: ['document', 'concept'],
    limit: 5
});

// Advanced query
const queryResults = ultralink.search.query({
    must: [
        { field: 'type', value: 'document' },
        { field: 'attributes.status', value: 'published' }
    ],
    should: [
        { field: 'content', value: 'machine learning', boost: 2.0 },
        { field: 'content', value: 'deep learning', boost: 1.5 }
    ],
    mustNot: [
        { field: 'attributes.deprecated', value: true }
    ]
});
```

### ValidationManager Class

Provides validation functionality for UltraLink data.

```typescript
class ValidationManager {
    // Constructor
    constructor(ultralink: UltraLink, options?: ValidationManagerOptions);
    
    // Validation Methods
    validateEntity(entity: Entity, schema?: EntitySchema): ValidationResult;
    validateLink(link: Link, schema?: LinkSchema): ValidationResult;
    validateGraph(options?: GraphValidationOptions): ValidationResult;
    
    // Schema Management
    defineEntitySchema(type: string, schema: EntitySchema): void;
    defineLinkSchema(type: string, schema: LinkSchema): void;
    
    // Fixing Methods
    fixValidationIssues(issues: ValidationIssue[]): FixResult;
}
```

#### ValidationManagerOptions

```typescript
interface ValidationManagerOptions {
    autoValidate?: boolean;
    strictMode?: boolean;
    defaultSchemas?: Record<string, any>;
}
```

#### Examples

```javascript
// Validate entity
const validationResult = ultralink.validate.validateEntity(entity, {
    required: ['title', 'content'],
    properties: {
        title: { type: 'string', minLength: 3 },
        content: { type: 'string' },
        importance: { type: 'number', minimum: 0, maximum: 1 }
    }
});

// Define schema
ultralink.validate.defineEntitySchema('document', {
    required: ['title', 'content'],
    properties: {
        title: { type: 'string', minLength: 3 },
        content: { type: 'string' },
        status: { type: 'string', enum: ['draft', 'review', 'published'] }
    }
});

// Validate graph
const graphValidation = ultralink.validate.validateGraph({
    checkConsistency: true,
    checkConnectivity: true,
    checkOrphans: true
});
```

## Event System

### EventManager Class

Manages the event system for UltraLink.

```typescript
class EventManager {
    // Constructor
    constructor(ultralink: UltraLink);
    
    // Event Methods
    on(event: EventType, handler: EventHandler): void;
    off(event: EventType, handler?: EventHandler): void;
    once(event: EventType, handler: EventHandler): void;
    
    // Emission Methods
    emit(event: EventType, data: any): void;
    
    // Utility Methods
    getListeners(event: EventType): EventHandler[];
    clearListeners(event?: EventType): void;
}
```

#### EventTypes

```typescript
type EventType = 
    // Entity events
    'entity:added' | 'entity:updated' | 'entity:removed' |
    
    // Link events
    'link:added' | 'link:updated' | 'link:removed' |
    
    // Vector events
    'vector:generated' | 'vector:updated' |
    
    // Data events
    'data:imported' | 'data:exported' |
    
    // System events
    'system:error' | 'system:warning' | 'system:info';
```

#### Examples

```javascript
// Subscribe to entity events
ultralink.events.on('entity:added', (entity) => {
    console.log(`Entity added: ${entity.id}`);
});

// Subscribe to link events
ultralink.events.on('link:added', (link) => {
    console.log(`Link added: ${link.source} -> ${link.target}`);
});

// One-time event
ultralink.events.once('data:exported', (data) => {
    console.log(`Data exported: ${data.format}`);
});
```

## Further Reading

- [Getting Started Guide](../guides/getting-started.md)
- [Examples Repository](https://github.com/ultralink/examples)
- [Contribution Guidelines](../contributing.md)
- [Changelog](../changelog.md) 