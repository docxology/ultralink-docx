# UltraLink Configuration Reference 🔧

This document provides a comprehensive reference for all configuration options available in UltraLink. These options can be specified when creating a new UltraLink instance or modified through the configuration API.

## Basic Configuration

When creating a new UltraLink instance, you can pass a configuration object:

```javascript
const ultralink = new UltraLink({
  // Configuration options
  storage: 'memory',
  vectorDimensions: 1536,
  caching: true,
  llmIntegration: false
});
```

You can also update the configuration after creation:

```javascript
// Update configuration
ultralink.configure({
  caching: true,
  vectorDimensions: 768
});
```

## Configuration Categories

- [Core Configuration](#core-configuration)
- [Storage Configuration](#storage-configuration)
- [Vector Configuration](#vector-configuration)
- [Performance Configuration](#performance-configuration)
- [LLM Configuration](#llm-configuration)
- [Visualization Configuration](#visualization-configuration)
- [Temporal Configuration](#temporal-configuration)
- [Export Configuration](#export-configuration)
- [Security Configuration](#security-configuration)
- [Advanced Configuration](#advanced-configuration)

## Core Configuration

These options control the core behavior of UltraLink.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialCapacity` | `number` | `1000` | Initial capacity for entities and relationships. |
| `strictMode` | `boolean` | `false` | Enables strict validation of entities and relationships. |
| `autoValidate` | `boolean` | `true` | Automatically validates entities and relationships when added. |
| `logging` | `boolean` \| `object` | `false` | Enables logging. Can be a boolean or a logging configuration object. |
| `defaultEntityType` | `string` | `'generic'` | Default type for entities if not specified. |
| `defaultLinkType` | `string` | `'generic'` | Default type for relationships if not specified. |

### Logging Configuration

```javascript
// Detailed logging configuration
ultralink.configure({
  logging: {
    level: 'info',  // 'debug', 'info', 'warn', 'error'
    format: 'json', // 'json', 'text'
    destination: 'console', // 'console', 'file', 'custom'
    file: './logs/ultralink.log', // Only if destination is 'file'
    customLogger: myLogger, // Only if destination is 'custom'
    includeTimestamp: true,
    includeSource: true
  }
});
```

## Storage Configuration

These options control how UltraLink stores data.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `string` | `'memory'` | Storage mechanism to use. Options: `'memory'`, `'file'`, `'indexeddb'`, `'custom'`. |
| `storagePath` | `string` | `'./ultralink-data'` | Path for file-based storage. |
| `persistence` | `boolean` | `false` | Whether to persist data across sessions. |
| `customStorage` | `object` | `null` | Custom storage adapter implementation. |
| `autoSave` | `boolean` | `false` | Automatically save changes to persistent storage. |
| `saveInterval` | `number` | `60000` | Interval (ms) for auto-saving if enabled. |

### File Storage Configuration

```javascript
// Configure file-based storage
ultralink.configure({
  storage: 'file',
  storagePath: './my-data',
  persistence: true,
  autoSave: true,
  saveInterval: 30000,  // 30 seconds
  fileOptions: {
    encoding: 'utf8',
    format: 'json',
    pretty: true,
    backup: true,
    backupCount: 5
  }
});
```

### Custom Storage Configuration

```javascript
// Configure custom storage
const myStorageAdapter = {
  load: async () => { /* implementation */ },
  save: async (data) => { /* implementation */ },
  clear: async () => { /* implementation */ }
};

ultralink.configure({
  storage: 'custom',
  customStorage: myStorageAdapter
});
```

## Vector Configuration

These options control vector embedding behavior.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `vectorEnabled` | `boolean` | `true` | Enables vector embeddings. |
| `vectorDimensions` | `number` | `1536` | Dimensions for vector embeddings. |
| `vectorModel` | `string` | `'text-embedding-3-large'` | Model to use for generating vector embeddings. |
| `vectorNormalization` | `boolean` | `true` | Normalize vectors to unit length. |
| `vectorProvider` | `string` | `'openai'` | Provider for vector embeddings. |
| `vectorApiKey` | `string` | `undefined` | API key for vector provider. |
| `vectorEndpoint` | `string` | `undefined` | Custom endpoint for vector provider. |

### Vector Provider Configuration

```javascript
// Configure OpenAI vector provider
ultralink.configure({
  vectorEnabled: true,
  vectorModel: 'text-embedding-3-large',
  vectorProvider: 'openai',
  vectorApiKey: process.env.OPENAI_API_KEY
});

// Configure custom vector provider
ultralink.configure({
  vectorProvider: 'custom',
  vectorModel: 'my-custom-model',
  vectorCustomProvider: myCustomEmbeddingProvider
});
```

## Performance Configuration

These options optimize performance.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `caching` | `boolean` | `false` | Enables caching of computed values. |
| `cacheSize` | `number` | `1000` | Maximum number of items to cache. |
| `cacheTTL` | `number` | `3600000` | Time-to-live for cached items (ms). |
| `indexing` | `boolean` | `true` | Enables indexing for faster queries. |
| `batchSize` | `number` | `100` | Default batch size for batch operations. |
| `workerThreads` | `number` | `0` | Number of worker threads for parallel processing. |
| `maxConcurrency` | `number` | `4` | Maximum number of concurrent operations. |

### Advanced Performance Configuration

```javascript
// Detailed performance configuration
ultralink.configure({
  performance: {
    caching: {
      enabled: true,
      strategy: 'lru',
      size: 5000,
      ttl: 1800000  // 30 minutes
    },
    indexing: {
      enabled: true,
      types: ['byId', 'byType', 'byAttribute'],
      customIndices: [
        { name: 'byImportance', field: 'attributes.importance' }
      ]
    },
    concurrency: {
      workers: 4,
      maxConcurrent: 8,
      queueSize: 100
    },
    memory: {
      optimizeFor: 'speed',  // 'speed', 'memory', 'balanced'
      maxMemoryUsage: '4GB',
      gcThreshold: 0.8
    }
  }
});
```

## LLM Configuration

These options control LLM integration.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `llmIntegration` | `boolean` | `false` | Enables LLM integration. |
| `llmProvider` | `string` | `'openai'` | Provider for LLM services. |
| `llmModel` | `string` | `'gpt-4'` | Default LLM model to use. |
| `llmApiKey` | `string` | `undefined` | API key for LLM provider. |
| `llmEndpoint` | `string` | `undefined` | Custom endpoint for LLM provider. |
| `llmTemperature` | `number` | `0.7` | Default temperature for LLM requests. |

### Detailed LLM Configuration

```javascript
// Configure LLM integration
ultralink.configure({
  llm: {
    enabled: true,
    provider: 'openai',
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
    parameters: {
      temperature: 0.3,
      maxTokens: 2000,
      topP: 1.0,
      presencePenalty: 0.0,
      frequencyPenalty: 0.0
    },
    timeout: 30000,  // 30 seconds
    retry: {
      attempts: 3,
      backoff: 'exponential',
      maxBackoff: 30000
    },
    cache: {
      enabled: true,
      ttl: 86400000  // 24 hours
    }
  }
});
```

## Visualization Configuration

These options control visualization behavior.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `vizDefaultRenderer` | `string` | `'svg'` | Default renderer for visualizations. Options: `'svg'`, `'canvas'`, `'webgl'`. |
| `vizDefaultTheme` | `string` | `'light'` | Default theme for visualizations. Options: `'light'`, `'dark'`, `'custom'`. |
| `vizInteractive` | `boolean` | `true` | Enables interactive visualizations. |
| `vizResponseive` | `boolean` | `true` | Enables responsive visualizations. |
| `vizAccessibility` | `boolean` | `true` | Enables accessibility features in visualizations. |

### Detailed Visualization Configuration

```javascript
// Configure visualizations
ultralink.configure({
  visualization: {
    renderer: 'webgl',
    theme: {
      name: 'custom',
      colors: {
        background: '#f8f9fa',
        node: '#3498db',
        edge: '#95a5a6',
        text: '#2c3e50',
        highlight: '#e74c3c'
      },
      fonts: {
        family: 'Inter, sans-serif',
        size: {
          node: 12,
          label: 10,
          title: 16
        }
      }
    },
    defaults: {
      network: {
        layout: 'force-directed',
        nodeSize: 8,
        edgeWidth: 1,
        labels: true,
        physics: {
          enabled: true,
          stabilization: true
        }
      },
      vector: {
        dimensions: 2,
        pointSize: 5,
        algorithm: 'tsne'
      },
      timeline: {
        orientation: 'horizontal',
        scale: 'linear'
      }
    },
    performance: {
      maxNodes: 5000,
      maxEdges: 10000,
      lodThresholds: [
        { nodes: 500, detail: 'high' },
        { nodes: 2000, detail: 'medium' },
        { nodes: 5000, detail: 'low' }
      ]
    }
  }
});
```

## Temporal Configuration

These options control temporal evolution tracking.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `temporalEnabled` | `boolean` | `true` | Enables temporal tracking. |
| `versioningStrategy` | `string` | `'timestamp'` | Strategy for versioning. Options: `'timestamp'`, `'semantic'`, `'incremental'`. |
| `historyRetention` | `number` | `100` | Number of historical versions to retain. |
| `changeGranularity` | `string` | `'entity'` | Granularity for change tracking. Options: `'entity'`, `'attribute'`. |

### Detailed Temporal Configuration

```javascript
// Configure temporal features
ultralink.configure({
  temporal: {
    enabled: true,
    versioning: {
      strategy: 'semantic',
      initialVersion: '1.0.0',
      autoIncrement: true,
      retention: {
        count: 50,
        duration: '365d'  // Keep history for one year
      }
    },
    changes: {
      granularity: 'attribute',
      trackActor: true,
      reasons: true
    },
    snapshots: {
      enabled: true,
      interval: '1d',  // Daily snapshots
      maxCount: 30     // Keep last 30 snapshots
    }
  }
});
```

## Export Configuration

These options control data export behavior.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `exportDefaultFormat` | `string` | `'json'` | Default format for exports. |
| `exportPrettyPrint` | `boolean` | `true` | Pretty print exported data when applicable. |
| `exportIncludeMetadata` | `boolean` | `true` | Include metadata in exports. |
| `exportIncludeVectors` | `boolean` | `false` | Include vector embeddings in exports. |

### Detailed Export Configuration

```javascript
// Configure export options
ultralink.configure({
  export: {
    defaults: {
      format: 'json',
      prettyPrint: true,
      includeMetadata: true,
      includeVectors: false
    },
    json: {
      indent: 2,
      escapeHTML: false
    },
    csv: {
      delimiter: ',',
      header: true,
      quoteStrings: true
    },
    graphml: {
      includeAttributes: true,
      attributeTypes: true
    },
    obsidian: {
      frontmatter: true,
      backlinks: true,
      templating: true
    }
  }
});
```

## Security Configuration

These options control security features.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `securityEnabled` | `boolean` | `false` | Enables security features. |
| `authentication` | `boolean` | `false` | Enables authentication. |
| `authorization` | `boolean` | `false` | Enables authorization. |
| `dataEncryption` | `boolean` | `false` | Enables data encryption. |
| `inputValidation` | `boolean` | `true` | Enables input validation. |

### Detailed Security Configuration

```javascript
// Configure security features
ultralink.configure({
  security: {
    authentication: {
      enabled: true,
      method: 'jwt',
      secret: process.env.JWT_SECRET,
      expiresIn: '7d'
    },
    authorization: {
      enabled: true,
      defaultPolicy: 'deny',
      roles: {
        admin: { permissions: ['read', 'write', 'delete', 'manage'] },
        editor: { permissions: ['read', 'write'] },
        viewer: { permissions: ['read'] }
      }
    },
    encryption: {
      enabled: true,
      algorithm: 'aes-256-gcm',
      key: process.env.ENCRYPTION_KEY,
      fields: ['attributes.sensitive', 'metadata.private']
    },
    validation: {
      enabled: true,
      sanitize: true,
      maxDepth: 10,
      maxSize: '10MB'
    }
  }
});
```

## Advanced Configuration

These are advanced configuration options for special use cases.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `experimental` | `boolean` | `false` | Enables experimental features. |
| `strictTyping` | `boolean` | `false` | Enforces strict type checking for attributes. |
| `debugMode` | `boolean` | `false` | Enables debug mode with additional logging and features. |
| `customPlugins` | `array` | `[]` | List of custom plugins to load. |

### Plugin Configuration

```javascript
// Configure plugins
ultralink.configure({
  plugins: {
    enabled: true,
    autoLoad: true,
    directory: './plugins',
    registry: 'local',  // 'local', 'remote', 'both'
    remoteUrl: 'https://registry.ultralink.dev',
    installed: [
      { name: 'vector-database', version: '1.0.0', enabled: true },
      { name: 'advanced-analytics', version: '2.1.0', enabled: true },
      { name: 'custom-visualization', version: '0.5.0', enabled: false }
    ]
  }
});
```

### Integration Configuration

```javascript
// Configure external integrations
ultralink.configure({
  integrations: {
    vectorDb: {
      enabled: true,
      provider: 'pinecone',
      apiKey: process.env.PINECONE_API_KEY,
      environment: 'us-west1-gcp',
      index: 'ultralink-vectors'
    },
    graphDb: {
      enabled: false,
      provider: 'neo4j',
      url: 'neo4j://localhost:7687',
      username: 'neo4j',
      password: process.env.NEO4J_PASSWORD
    },
    storage: {
      enabled: true,
      provider: 's3',
      bucket: 'ultralink-data',
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
      }
    }
  }
});
```

## Environment Variables

UltraLink supports configuration via environment variables, which take precedence over programmatic configuration:

| Environment Variable | Description |
|----------------------|-------------|
| `ULTRALINK_STORAGE` | Storage mechanism to use. |
| `ULTRALINK_STORAGE_PATH` | Path for file-based storage. |
| `ULTRALINK_VECTOR_ENABLED` | Enables vector embeddings. |
| `ULTRALINK_VECTOR_MODEL` | Model to use for vector embeddings. |
| `ULTRALINK_VECTOR_API_KEY` | API key for vector provider. |
| `ULTRALINK_LLM_ENABLED` | Enables LLM integration. |
| `ULTRALINK_LLM_PROVIDER` | Provider for LLM services. |
| `ULTRALINK_LLM_MODEL` | Default LLM model to use. |
| `ULTRALINK_LLM_API_KEY` | API key for LLM provider. |
| `ULTRALINK_LOG_LEVEL` | Logging level. |
| `ULTRALINK_CACHE_ENABLED` | Enables caching. |
| `ULTRALINK_DEBUG` | Enables debug mode. |

## Configuration File

You can also use a configuration file to set defaults:

```javascript
// Load configuration from file
const ultralink = new UltraLink({
  configFile: './ultralink.config.js'
});
```

Example `ultralink.config.js`:

```javascript
module.exports = {
  storage: 'file',
  storagePath: './data',
  vectorEnabled: true,
  vectorModel: 'text-embedding-3-large',
  caching: true,
  llmIntegration: true,
  llmModel: 'gpt-4'
};
```

## Dynamic Configuration

Some configuration options can be changed at runtime:

```javascript
// Update configuration dynamically
ultralink.configure({
  caching: false,
  maxConcurrency: 8
});

// Get current configuration
const config = ultralink.getConfiguration();
console.log('Current vector model:', config.vectorModel);

// Reset configuration to defaults
ultralink.resetConfiguration();
```

## Related Documentation

- [Quick Start Guide](../getting-started/quick-start.md)
- [API Reference](../api/README.md)
- [Performance Optimization](../guides/performance.md)
- [Extension Development](../guides/extension-development.md) 