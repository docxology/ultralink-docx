# UltraLink Installation and Configuration Guide

This guide provides detailed instructions for installing, configuring, and optimizing UltraLink for different environments and use cases.

## Table of Contents

- [Installation Methods](#installation-methods)
  - [NPM/Yarn/PNPM Installation](#npmyarnpnpm-installation)
  - [Browser/CDN Installation](#browsercdn-installation)
  - [Docker Installation](#docker-installation)
  - [Build from Source](#build-from-source)
- [Environment Setup](#environment-setup)
  - [Node.js Environment](#nodejs-environment)
  - [Browser Environment](#browser-environment)
  - [Docker Environment](#docker-environment)
- [Configuration Reference](#configuration-reference)
  - [Core Configuration](#core-configuration)
  - [Storage Configuration](#storage-configuration)
  - [Vector Configuration](#vector-configuration)
  - [Temporal Configuration](#temporal-configuration)
  - [Export Configuration](#export-configuration)
  - [Visualization Configuration](#visualization-configuration)
  - [LLM Integration Configuration](#llm-integration-configuration)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
  - [Performance Optimization](#performance-optimization)
  - [Scaling Strategies](#scaling-strategies)
  - [Security Considerations](#security-considerations)
- [Platform-Specific Notes](#platform-specific-notes)
- [Troubleshooting Installation Issues](#troubleshooting-installation-issues)

## Installation Methods

### NPM/Yarn/PNPM Installation

UltraLink can be installed as a Node.js package using your preferred package manager:

```bash
# Using npm
npm install ultralink

# Using yarn
yarn add ultralink

# Using pnpm
pnpm add ultralink
```

#### Additional Dependencies

Depending on your use case, you may need to install additional optional dependencies:

```bash
# For vector embedding capabilities
npm install @xenova/transformers

# For visualization features
npm install d3

# For advanced analytics
npm install ml-matrix ml-pca

# Full installation with all optional dependencies
npm install ultralink --include=optional
```

### Browser/CDN Installation

For browser-based applications, you can include UltraLink directly from a CDN:

```html
<!-- Latest version (not recommended for production) -->
<script src="https://cdn.jsdelivr.net/npm/ultralink@latest/dist/ultralink.min.js"></script>

<!-- Specific version (recommended for production) -->
<script src="https://cdn.jsdelivr.net/npm/ultralink@0.1.0/dist/ultralink.min.js"></script>

<!-- ES Module version -->
<script type="module">
  import { UltraLink } from 'https://cdn.jsdelivr.net/npm/ultralink@0.1.0/dist/ultralink.esm.js';
  
  const ultralink = new UltraLink();
  // Your code here...
</script>
```

#### Browser Compatibility

UltraLink is compatible with all modern browsers:

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 60+            |
| Firefox | 60+            |
| Safari  | 12+            |
| Edge    | 79+            |

For older browser support, consider using the compatibility build:

```html
<script src="https://cdn.jsdelivr.net/npm/ultralink@0.1.0/dist/ultralink.compat.min.js"></script>
```

### Docker Installation

UltraLink is available as a Docker image for containerized environments:

```bash
# Pull the UltraLink image
docker pull ultralink/ultralink:latest

# Run with mounted volume for data persistence
docker run -v $(pwd)/data:/app/data -p 3000:3000 ultralink/ultralink:latest
```

#### Docker Compose Example

For more complex setups, you can use Docker Compose:

```yaml
# docker-compose.yml
version: '3'
services:
  ultralink:
    image: ultralink/ultralink:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - ULTRALINK_STORAGE_TYPE=file
      - ULTRALINK_STORAGE_PATH=/app/data
      - ULTRALINK_VECTOR_ENABLED=true
```

### Build from Source

For the latest features or custom builds, you can compile UltraLink from source:

```bash
# Clone the repository
git clone https://github.com/ultralink/ultralink.git
cd ultralink

# Install dependencies
npm install

# Build the project
npm run build

# Optional: Link for local development
npm link
```

## Environment Setup

### Node.js Environment

UltraLink requires Node.js v14.0.0 or later. For optimal performance, we recommend:

- Node.js v16.0.0 or later
- At least 4GB of available RAM
- SSD storage for better performance

Environment setup example:

```bash
# Check Node.js version
node --version

# Configure Node.js for better performance
export NODE_OPTIONS="--max-old-space-size=4096"

# Initialize a project
mkdir my-ultralink-project
cd my-ultralink-project
npm init -y
npm install ultralink
```

### Browser Environment

When using UltraLink in the browser, consider these setup recommendations:

- Use IndexedDB for storage in browser environments
- Set appropriate cache limits based on expected data size
- Consider using Web Workers for vector operations to avoid UI freezing

Browser setup example:

```javascript
// Initialize UltraLink with browser-optimized settings
const ultralink = new UltraLink({
  storage: {
    type: 'indexeddb',
    database: 'ultralink-data',
    version: 1
  },
  vectors: {
    useWebWorker: true,
    maxCacheSize: 1000 // entities
  }
});
```

### Docker Environment

When running UltraLink in Docker, consider these configurations:

- Map a volume for persistent data storage
- Set appropriate environment variables for your use case
- Consider Docker networking for connecting to other services

## Configuration Reference

UltraLink can be extensively configured to meet your specific requirements. This section details all available configuration options.

### Core Configuration

The core configuration controls the fundamental behavior of UltraLink:

```javascript
const ultralink = new UltraLink({
  // Core settings
  core: {
    debug: false,                 // Enable debug mode
    logLevel: 'info',             // 'error', 'warn', 'info', 'debug', 'trace'
    defaultIdGenerator: 'uuid',   // 'uuid', 'nanoid', 'sequential', or custom function
    validateOnWrite: true,        // Validate entities and relationships on write
    maxEntities: 1000000,         // Maximum number of entities (for memory protection)
    maxRelationships: 5000000,    // Maximum number of relationships
    autoGenerateIds: true,        // Auto-generate IDs if not provided
    caseSensitiveIds: true        // Whether IDs are case sensitive
  }
});
```

### Storage Configuration

Configure how and where UltraLink stores data:

```javascript
const ultralink = new UltraLink({
  // Storage configuration
  storage: {
    type: 'memory',               // 'memory', 'file', 'indexeddb', 'database'
    
    // For file storage
    file: {
      path: './data',             // Path to data directory
      format: 'json',             // 'json', 'bson', 'msgpack'
      pretty: false,              // Pretty-print JSON (development only)
      compression: false,         // Enable compression
      autoSave: true,             // Auto-save changes
      saveInterval: 60000,        // Auto-save interval in ms
      backups: {
        enabled: true,            // Create backups before saving
        maxBackups: 5,            // Maximum number of backups to keep
        backupPath: './backups'   // Path to backup directory
      }
    },
    
    // For IndexedDB storage (browser)
    indexeddb: {
      database: 'ultralink',      // Database name
      version: 1,                 // Database version
      stores: {                   // Define object stores
        entities: 'id',           // Store name: key path
        relationships: ['source', 'target', 'type'] // Compound key
      }
    },
    
    // For database storage
    database: {
      type: 'mongodb',            // 'mongodb', 'postgresql', 'mysql', etc.
      url: 'mongodb://localhost:27017/ultralink',
      options: {                  // Database-specific options
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      collections: {              // Collection/table names
        entities: 'entities',
        relationships: 'relationships',
        vectors: 'vectors'
      }
    },
    
    // Cache settings
    cache: {
      enabled: true,              // Enable caching
      maxSize: 10000,             // Maximum cache size (items)
      ttl: 3600000,               // Time-to-live in ms (1 hour)
      strategy: 'lru'             // 'lru', 'lfu', 'fifo'
    }
  }
});
```

### Vector Configuration

Configure vector embedding capabilities:

```javascript
const ultralink = new UltraLink({
  // Vector configuration
  vectors: {
    enabled: true,                // Enable vector features
    dimensions: 768,              // Embedding dimensions
    model: 'all-MiniLM-L6-v2',    // Default embedding model
    source: 'local',              // 'local', 'remote', 'custom'
    
    // For local models
    local: {
      modelPath: './models',      // Path to models directory
      quantized: true,            // Use quantized models (smaller, faster)
      forceUpdate: false          // Force model update
    },
    
    // For remote models
    remote: {
      endpoint: 'https://api.example.com/embeddings',
      apiKey: process.env.EMBEDDINGS_API_KEY,
      headers: {                  // Additional headers
        'X-Custom-Header': 'value'
      },
      timeout: 5000               // Request timeout in ms
    },
    
    // Performance optimization
    performance: {
      batchSize: 32,              // Batch size for embedding generation
      cacheEnabled: true,         // Cache embeddings
      cacheSize: 10000,           // Maximum cache size
      useWorker: true,            // Use Web Worker (browser)
      workerCount: 2              // Number of workers
    },
    
    // Index configuration
    index: {
      type: 'hnsw',               // 'flat', 'hnsw', 'ivf'
      options: {                  // Index-specific options
        efConstruction: 200,      // HNSW parameter
        M: 16                     // HNSW parameter
      }
    }
  }
});
```

### Temporal Configuration

Configure temporal tracking and analysis:

```javascript
const ultralink = new UltraLink({
  // Temporal configuration
  temporal: {
    enabled: true,                // Enable temporal tracking
    trackCreated: true,           // Track creation time
    trackModified: true,          // Track modification time
    trackAccessed: false,         // Track access time
    timezone: 'UTC',              // Default timezone
    
    // Version control
    versions: {
      enabled: true,              // Enable versioning
      autoVersion: false,         // Create versions automatically
      maxVersions: 50,            // Maximum versions per entity
      strategy: 'delta'           // 'delta', 'snapshot'
    },
    
    // Change tracking
    changes: {
      level: 'attribute',         // 'entity', 'attribute'
      metadata: true,             // Track change metadata
      actorTracking: true,        // Track who made changes
      reason: false               // Track change reasons
    }
  }
});
```

### Export Configuration

Configure export functionality:

```javascript
const ultralink = new UltraLink({
  // Export configuration
  export: {
    formats: ['json', 'csv', 'graphml', 'obsidian'],
    prettyPrint: true,            // Pretty-print output
    includeMetadata: true,        // Include metadata in exports
    includeVectors: false,        // Include vector embeddings
    
    // Format-specific options
    json: {
      indent: 2,                  // Indentation spaces
      escapeNonASCII: false,      // Escape non-ASCII characters
      replacer: null              // Custom JSON replacer
    },
    
    csv: {
      delimiter: ',',             // Field delimiter
      newline: '\n',              // Newline character
      quoteChar: '"',             // Quote character
      escapeChar: '"',            // Escape character
      header: true                // Include header row
    },
    
    graphml: {
      includeAttributes: true,    // Include attributes as GraphML data
      prettyPrint: true,          // Pretty-print output
      metadataAsAttributes: true  // Convert metadata to GraphML attributes
    },
    
    obsidian: {
      templatePath: './templates/obsidian',
      frontmatter: true,          // Include YAML frontmatter
      wikiLinks: true,            // Use wiki-style links
      embeddings: false,          // Include embeddings
      backlinks: true             // Generate backlinks
    }
  }
});
```

### Visualization Configuration

Configure visualization options:

```javascript
const ultralink = new UltraLink({
  // Visualization configuration
  visualization: {
    defaultLayout: 'force',       // 'force', 'radial', 'hierarchical', etc.
    darkMode: false,              // Use dark mode
    nodeSize: 'degree',           // 'fixed', 'degree', 'custom'
    defaultNodeSize: 8,           // Default node size
    defaultLinkWidth: 1,          // Default link width
    fitToContainer: true,         // Fit visualization to container
    interactive: true,            // Enable interactivity
    
    // Color scheme
    colors: {
      nodes: {
        default: '#4a6fa5',
        document: '#4a6fa5',
        concept: '#57a773',
        person: '#ef8354'
      },
      links: {
        default: '#999999',
        references: '#999999',
        contradicts: '#e63946',
        supports: '#57a773'
      },
      background: '#ffffff',
      text: '#333333'
    },
    
    // Physics simulation (for force layout)
    physics: {
      enabled: true,
      simulationIterations: 300,  // Maximum simulation iterations
      alpha: 0.3,                 // Initial alpha value
      alphaDecay: 0.028,          // Alpha decay rate
      velocityDecay: 0.4,         // Velocity decay rate
      forceStrength: 0.1          // Force strength multiplier
    },
    
    // Labels
    labels: {
      enabled: true,              // Show labels
      property: 'name',           // Property to use as label
      maxLength: 20,              // Maximum label length
      fontSize: 12,               // Label font size
      fontFamily: 'sans-serif'    // Label font family
    }
  }
});
```

### LLM Integration Configuration

Configure integration with Language Learning Models:

```javascript
const ultralink = new UltraLink({
  // LLM integration configuration
  llm: {
    enabled: true,                // Enable LLM integration
    provider: 'openai',           // 'openai', 'huggingface', 'local', 'custom'
    defaultModel: 'gpt-3.5-turbo',// Default model to use
    
    // OpenAI configuration
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION,
      models: {
        embedding: 'text-embedding-ada-002',
        completion: 'gpt-3.5-turbo',
        analysis: 'gpt-4'
      },
      maxTokens: 1000,            // Maximum tokens per request
      temperature: 0.7,           // Response randomness (0-1)
      timeout: 10000              // Request timeout in ms
    },
    
    // HuggingFace configuration
    huggingface: {
      apiKey: process.env.HUGGINGFACE_API_KEY,
      models: {
        embedding: 'sentence-transformers/all-MiniLM-L6-v2',
        completion: 'gpt2',
        analysis: 'facebook/bart-large-mnli'
      },
      useInference: true,         // Use Inference API
      timeout: 15000              // Request timeout in ms
    },
    
    // Local model configuration
    local: {
      modelPath: './models',      // Path to models directory
      models: {
        embedding: 'all-MiniLM-L6-v2',
        completion: 'llama2-7b-chat-q4',
        analysis: 'mistral-7b-instruct-q4'
      },
      maxTokens: 1000,            // Maximum tokens per request
      temperature: 0.7            // Response randomness (0-1)
    },
    
    // Caching
    cache: {
      enabled: true,              // Enable caching
      ttl: 86400000,              // Cache TTL in ms (24 hours)
      maxSize: 1000               // Maximum cache size
    }
  }
});
```

## Environment Variables

UltraLink supports configuration via environment variables. This is especially useful for deployments where configuration may vary by environment.

| Environment Variable | Description | Default |
|----------------------|-------------|---------|
| `ULTRALINK_ENV` | Environment ('development', 'test', 'production') | `'development'` |
| `ULTRALINK_LOG_LEVEL` | Logging level | `'info'` |
| `ULTRALINK_STORAGE_TYPE` | Storage type | `'memory'` |
| `ULTRALINK_STORAGE_PATH` | File storage path | `'./data'` |
| `ULTRALINK_VECTOR_ENABLED` | Enable vector features | `'true'` |
| `ULTRALINK_VECTOR_DIMENSIONS` | Vector dimensions | `'768'` |
| `ULTRALINK_VECTOR_MODEL` | Vector model name | `'all-MiniLM-L6-v2'` |
| `ULTRALINK_TEMPORAL_ENABLED` | Enable temporal features | `'true'` |
| `ULTRALINK_LLM_ENABLED` | Enable LLM integration | `'false'` |
| `ULTRALINK_LLM_PROVIDER` | LLM provider | `'openai'` |
| `ULTRALINK_OPENAI_API_KEY` | OpenAI API key | `''` |
| `ULTRALINK_HUGGINGFACE_API_KEY` | HuggingFace API key | `''` |

Example `.env` file:

```
ULTRALINK_ENV=production
ULTRALINK_STORAGE_TYPE=file
ULTRALINK_STORAGE_PATH=/data
ULTRALINK_VECTOR_ENABLED=true
ULTRALINK_LLM_ENABLED=true
ULTRALINK_LLM_PROVIDER=openai
ULTRALINK_OPENAI_API_KEY=sk-...
```

## Production Deployment

### Performance Optimization

For optimal performance in production:

1. **Memory Management**:
   - Set appropriate cache sizes based on your dataset
   - Consider using a memory manager for large datasets
   - Monitor memory usage and adjust settings as needed

2. **Storage Optimization**:
   - Use file storage with compression for large datasets
   - Consider database storage for multi-user scenarios
   - Implement appropriate indexing strategies

3. **Vector Operations**:
   - Use quantized models for faster embedding generation
   - Batch vector operations for better throughput
   - Consider using a dedicated vector database for large collections

### Scaling Strategies

For handling larger workloads:

1. **Vertical Scaling**:
   - Increase memory allocation
   - Use more CPU cores for parallel processing
   - Upgrade to faster storage

2. **Horizontal Scaling**:
   - Distribute data across multiple instances
   - Use shared storage for coordination
   - Implement a load balancer for API requests

3. **Hybrid Approaches**:
   - Partition data by domain or time period
   - Distribute read and write operations
   - Use caching layers for frequently accessed data

### Security Considerations

For secure deployments:

1. **Authentication and Authorization**:
   - Implement user authentication
   - Define access control policies
   - Use secure API keys for service access

2. **Data Protection**:
   - Enable encryption for sensitive data
   - Implement backup strategies
   - Validate inputs to prevent injection attacks

3. **Network Security**:
   - Use HTTPS for all communications
   - Implement rate limiting
   - Configure appropriate firewall rules

## Platform-Specific Notes

### Node.js Server

When deploying on a Node.js server:

```javascript
const express = require('express');
const { UltraLink } = require('ultralink');

const app = express();
const ultralink = new UltraLink({
  storage: {
    type: 'file',
    file: {
      path: process.env.ULTRALINK_STORAGE_PATH || './data'
    }
  }
});

app.use(express.json());

app.post('/api/entities', async (req, res) => {
  try {
    const entity = await ultralink.addEntity(
      req.body.id,
      req.body.type,
      req.body.attributes
    );
    res.json(entity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// More API endpoints...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`UltraLink API server running on port ${PORT}`);
});
```

### Browser Application

For browser applications:

```javascript
// Initialize UltraLink in the browser
const ultralink = new UltraLink({
  storage: {
    type: 'indexeddb',
    indexeddb: {
      database: 'ultralink-app'
    }
  },
  vectors: {
    enabled: true,
    performance: {
      useWorker: true
    }
  }
});

// Handle UI interactions
document.getElementById('create-entity-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;
  
  try {
    const entity = await ultralink.addEntity(
      form.elements.id.value,
      form.elements.type.value,
      {
        name: form.elements.name.value,
        description: form.elements.description.value
      }
    );
    
    // Update UI with new entity
    updateEntityList();
  } catch (error) {
    showError(error.message);
  }
});
```

### Docker Deployment

For Docker deployments:

```bash
# Build a custom Docker image
docker build -t my-ultralink-app .

# Run the container
docker run -d \
  --name ultralink-app \
  -p 3000:3000 \
  -v ultralink-data:/app/data \
  -e ULTRALINK_ENV=production \
  -e ULTRALINK_STORAGE_TYPE=file \
  -e ULTRALINK_STORAGE_PATH=/app/data \
  my-ultralink-app
```

## Troubleshooting Installation Issues

### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Installation fails with permission errors | Insufficient permissions | Use `sudo` or adjust directory permissions |
| "Module not found" errors | Missing dependencies | Run `npm install` to install required dependencies |
| Vector operations fail | Missing model files | Check model path and download models if needed |
| Memory errors | Dataset too large for available memory | Increase Node.js memory limit or adjust cache size |
| Slow performance | Unoptimized configuration | Review performance settings and adjust as needed |
| Error connecting to external services | Network issues or invalid credentials | Check API keys and network connectivity |

### Diagnostic Commands

```bash
# Check Node.js version
node --version

# Check installed UltraLink version
npm list ultralink

# Verify environment variables
env | grep ULTRALINK_

# Check available disk space
df -h

# Check memory usage
free -h
```

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/ultralink/ultralink/issues) for similar problems
2. Join the [Discord community](https://discord.gg/ultralink) for real-time help
3. Post your question on [Stack Overflow](https://stackoverflow.com/questions/tagged/ultralink) with the `ultralink` tag
4. Contact the maintainers via email at support@ultralink.dev

---

This installation and configuration guide should help you get started with UltraLink. For more detailed information on using UltraLink, refer to the [API Reference](../api/README.md) and [Tutorials](../tutorials/). 