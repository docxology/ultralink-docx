# UltraLink Troubleshooting Guide

This guide helps you diagnose and resolve common issues when working with UltraLink.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Configuration Problems](#configuration-problems)
- [Performance Issues](#performance-issues)
- [Vector Operation Errors](#vector-operation-errors)
- [Storage Problems](#storage-problems)
- [API Errors](#api-errors)
- [Integration Issues](#integration-issues)
- [Browser-Specific Issues](#browser-specific-issues)
- [Visualization Problems](#visualization-problems)
- [Common Error Messages](#common-error-messages)
- [Diagnostic Tools](#diagnostic-tools)
- [Getting Help](#getting-help)

## Installation Issues

### Package Installation Fails

```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied
```

**Problem**: Permission issues when installing packages globally.

**Solutions**:
1. Use a package manager that supports user-level installations:
   ```bash
   npm install --user ultralink
   ```

2. Fix npm permissions:
   ```bash
   sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
   ```

3. Use nvm (Node Version Manager) for permissions-free installations:
   ```bash
   nvm install node
   nvm use node
   npm install ultralink
   ```

### Dependency Resolution Issues

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Problem**: Conflicting dependencies.

**Solutions**:
1. Use force install (not recommended for production):
   ```bash
   npm install --force ultralink
   ```

2. Use legacy peer dependencies:
   ```bash
   npm install --legacy-peer-deps ultralink
   ```

3. Update your package.json to use compatible versions:
   ```bash
   npm install ultralink@0.1.0
   ```

### Node.js Version Incompatibility

```
Error: UltraLink requires Node.js v14.0.0 or higher
```

**Problem**: Your Node.js version is too old.

**Solutions**:
1. Update Node.js:
   ```bash
   # Using nvm
   nvm install 16
   nvm use 16
   
   # Direct download
   # Visit https://nodejs.org and download the latest LTS version
   ```

2. Check your current version:
   ```bash
   node --version
   ```

## Configuration Problems

### Invalid Configuration Options

```
Error: Invalid configuration option 'storageType'
```

**Problem**: Using incorrect configuration property names.

**Solution**: Refer to the [Configuration Reference](./getting-started/installation-guide.md#configuration-reference) for the correct property names:

```javascript
// Incorrect
const ultralink = new UltraLink({
  storageType: 'memory'
});

// Correct
const ultralink = new UltraLink({
  storage: {
    type: 'memory'
  }
});
```

### Missing Required Configuration

```
Error: Missing required configuration: storage.database.url
```

**Problem**: A required configuration property is missing.

**Solution**: Add the missing configuration:

```javascript
const ultralink = new UltraLink({
  storage: {
    type: 'database',
    database: {
      type: 'mongodb',
      url: 'mongodb://localhost:27017/ultralink',
      // Other options...
    }
  }
});
```

### Environment Variables Not Applied

**Problem**: Environment variables don't seem to be affecting configuration.

**Solutions**:
1. Make sure environment variables are set before application startup:
   ```bash
   export ULTRALINK_STORAGE_TYPE=file
   node your-app.js
   ```

2. Verify environment variables are being loaded:
   ```javascript
   console.log(process.env.ULTRALINK_STORAGE_TYPE);
   ```

3. If using dotenv, ensure it's configured correctly:
   ```javascript
   require('dotenv').config();
   ```

## Performance Issues

### Slow Operations with Large Datasets

**Problem**: Operations become slow with large datasets.

**Solutions**:

1. Optimize memory usage:
   ```javascript
   const ultralink = new UltraLink({
     storage: {
       cache: {
         enabled: true,
         maxSize: 10000,  // Adjust based on available memory
         strategy: 'lru'
       }
     }
   });
   ```

2. Use batch operations for bulk changes:
   ```javascript
   // Instead of adding entities one by one
   const entities = [/* many entities */];
   await ultralink.addEntitiesBatch(entities);
   ```

3. Enable indexing for frequently queried attributes:
   ```javascript
   ultralink.enableIndexing('entities', 'type');
   ultralink.enableIndexing('relationships', 'type');
   ```

### Memory Leaks

**Problem**: Memory usage continually increases over time.

**Solutions**:
1. Dispose of unused resources:
   ```javascript
   // Release resources when done
   await ultralink.dispose();
   ```

2. Use a memory profiler to identify leaks:
   ```bash
   node --inspect your-app.js
   # Then open Chrome and visit chrome://inspect
   ```

3. Implement manual garbage collection for large operations:
   ```javascript
   // After large operations
   if (global.gc) {
     global.gc();
   }
   ```
   (Run Node.js with `--expose-gc` flag)

### High CPU Usage

**Problem**: UltraLink operations consume excessive CPU.

**Solutions**:
1. Limit concurrent operations:
   ```javascript
   const limiter = new Bottleneck({
     maxConcurrent: 5,
     minTime: 100
   });
   
   const tasks = entities.map(entity => {
     return limiter.schedule(() => ultralink.addEntity(entity));
   });
   
   await Promise.all(tasks);
   ```

2. Use worker threads for intensive operations:
   ```javascript
   const { Worker } = require('worker_threads');
   
   function runVectorTask(data) {
     return new Promise((resolve, reject) => {
       const worker = new Worker('./vector-worker.js');
       worker.on('message', resolve);
       worker.on('error', reject);
       worker.postMessage(data);
     });
   }
   ```

## Vector Operation Errors

### Model Loading Failures

```
Error: Failed to load vector model 'all-MiniLM-L6-v2'
```

**Problem**: Vector embedding model cannot be loaded.

**Solutions**:
1. Check internet connection (required for initial download):
   ```bash
   ping huggingface.co
   ```

2. Verify model path and permissions:
   ```javascript
   const ultralink = new UltraLink({
     vectors: {
       local: {
         modelPath: './models',  // Ensure this directory exists and is writable
         forceUpdate: true       // Force download of the model
       }
     }
   });
   ```

3. Use a different model:
   ```javascript
   const ultralink = new UltraLink({
     vectors: {
       model: 'paraphrase-MiniLM-L3-v2'  // Smaller, faster model
     }
   });
   ```

### Vector Dimension Mismatch

```
Error: Vector dimension mismatch. Expected 768, got 384
```

**Problem**: Mixing vectors with different dimensions.

**Solutions**:
1. Ensure consistent model usage:
   ```javascript
   // Initialize with specific dimensions
   const ultralink = new UltraLink({
     vectors: {
       dimensions: 768,
       model: 'all-MiniLM-L6-v2'  // Produces 384-dimensional vectors
     }
   });
   ```

2. Regenerate all vectors with the same model:
   ```javascript
   await ultralink.regenerateAllVectors();
   ```

### Out of Memory During Vector Operations

```
JavaScript heap out of memory
```

**Problem**: Vector operations exceed available memory.

**Solutions**:
1. Increase Node.js memory limit:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=8192"
   node your-app.js
   ```

2. Process vectors in batches:
   ```javascript
   const entities = await ultralink.findEntities();
   const batchSize = 100;
   
   for (let i = 0; i < entities.length; i += batchSize) {
     const batch = entities.slice(i, i + batchSize);
     await ultralink.generateVectorsForEntities(batch);
   }
   ```

## Storage Problems

### File Storage Permission Issues

```
Error: EACCES: permission denied, open '/path/to/data/ultralink.json'
```

**Problem**: Insufficient permissions to write to storage directory.

**Solutions**:
1. Change directory permissions:
   ```bash
   chmod 755 /path/to/data
   ```

2. Use a different directory with appropriate permissions:
   ```javascript
   const ultralink = new UltraLink({
     storage: {
       type: 'file',
       file: {
         path: './my-data'  // Make sure this directory exists and is writable
       }
     }
   });
   ```

### Database Connection Failures

```
Error: MongoNetworkError: failed to connect to server
```

**Problem**: Cannot connect to the database server.

**Solutions**:
1. Verify database is running:
   ```bash
   # For MongoDB
   mongosh --eval "db.adminCommand('ping')"
   ```

2. Check connection string:
   ```javascript
   const ultralink = new UltraLink({
     storage: {
       type: 'database',
       database: {
         type: 'mongodb',
         url: 'mongodb://username:password@localhost:27017/ultralink',
         options: {
           connectTimeoutMS: 5000,
           socketTimeoutMS: 45000
         }
       }
     }
   });
   ```

3. Ensure network access to the database:
   ```bash
   telnet localhost 27017
   ```

### Data Corruption

**Problem**: Stored data appears corrupted or incomplete.

**Solutions**:
1. Restore from backup:
   ```javascript
   await ultralink.restoreFromBackup('./backups/ultralink-backup-20230615.json');
   ```

2. Enable automatic backups:
   ```javascript
   const ultralink = new UltraLink({
     storage: {
       file: {
         backups: {
           enabled: true,
           maxBackups: 10,
           backupPath: './backups'
         }
       }
     }
   });
   ```

3. Implement data validation:
   ```javascript
   const ultralink = new UltraLink({
     core: {
       validateOnRead: true,
       validateOnWrite: true
     }
   });
   ```

## API Errors

### Invalid Parameter Types

```
Error: Invalid parameter type. Expected string for id, got object
```

**Problem**: Passing incorrect parameter types to API methods.

**Solution**: Check parameter types and ensure they match the API requirements:

```javascript
// Incorrect
ultralink.addEntity({ id: 'doc-1' }, 'document', { title: 'Document 1' });

// Correct
ultralink.addEntity('doc-1', 'document', { title: 'Document 1' });
```

### Entity Not Found

```
Error: Entity with id 'doc-1' not found
```

**Problem**: Attempting to access a non-existent entity.

**Solutions**:
1. Check if entity exists before accessing:
   ```javascript
   if (await ultralink.hasEntity('doc-1')) {
     const entity = await ultralink.getEntity('doc-1');
     // Process entity...
   }
   ```

2. Use try-catch to handle not found errors:
   ```javascript
   try {
     const entity = await ultralink.getEntity('doc-1');
     // Process entity...
   } catch (error) {
     if (error.code === 'ENTITY_NOT_FOUND') {
       // Handle not found case
     } else {
       throw error;
     }
   }
   ```

### Invalid Entity or Relationship Type

```
Error: Invalid entity type 'documant'. Did you mean 'document'?
```

**Problem**: Using undefined or misspelled entity/relationship types.

**Solutions**:
1. Register custom types before using them:
   ```javascript
   ultralink.defineEntityType('custom_document', {
     attributes: {
       title: { type: 'string', required: true },
       content: { type: 'text' }
     }
   });
   ```

2. Check available types:
   ```javascript
   const entityTypes = await ultralink.getEntityTypes();
   console.log(entityTypes); // ['document', 'concept', 'person', ...]
   ```

## Integration Issues

### LLM API Errors

```
Error: OpenAI API error: 401 - Invalid API key
```

**Problem**: Issues connecting to external LLM services.

**Solutions**:
1. Check API key:
   ```javascript
   const ultralink = new UltraLink({
     llm: {
       provider: 'openai',
       openai: {
         apiKey: process.env.OPENAI_API_KEY // Make sure this is set correctly
       }
     }
   });
   ```

2. Verify API access and limits:
   ```bash
   # Test OpenAI API access
   curl -X POST https://api.openai.com/v1/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $OPENAI_API_KEY" \
     -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello"}]}'
   ```

3. Implement fallbacks for LLM services:
   ```javascript
   const ultralink = new UltraLink({
     llm: {
       provider: 'openai',
       fallbackProvider: 'huggingface',
       // Configuration for both providers...
     }
   });
   ```

### Export Format Compatibility

**Problem**: Exported data doesn't work with target application.

**Solutions**:
1. Adjust export options for better compatibility:
   ```javascript
   const obsidianData = await ultralink.toObsidian({
     frontmatter: true,
     wikiLinks: true,
     embeddings: false,
     backlinks: true,
     customResolver: (id) => id.replace(/[^a-zA-Z0-9]/g, '-')
   });
   ```

2. Validate exported data against target specifications:
   ```javascript
   // For GraphML exports
   const graphML = await ultralink.toGraphML({ validateSchema: true });
   ```

## Browser-Specific Issues

### IndexedDB Not Available

```
Error: IndexedDB not available in this browser
```

**Problem**: Browser doesn't support IndexedDB or it's disabled.

**Solutions**:
1. Check browser compatibility and provide fallback:
   ```javascript
   const storageType = window.indexedDB ? 'indexeddb' : 'memory';
   
   const ultralink = new UltraLink({
     storage: {
       type: storageType
     }
   });
   ```

2. Enable IndexedDB in private browsing mode (Firefox):
   ```javascript
   // Detect Firefox private browsing
   try {
     localStorage.setItem('test', 'test');
     localStorage.removeItem('test');
     // Normal mode, IndexedDB should work
   } catch (e) {
     // Private browsing mode, IndexedDB might not work
     alert('Please enable DOM storage for this application to work properly.');
   }
   ```

### Web Worker Limitations

**Problem**: Web Workers not working or causing errors.

**Solutions**:
1. Check browser compatibility:
   ```javascript
   const useWorker = typeof Worker !== 'undefined';
   
   const ultralink = new UltraLink({
     vectors: {
       performance: {
         useWorker: useWorker
       }
     }
   });
   ```

2. Ensure correct paths for workers:
   ```javascript
   const ultralink = new UltraLink({
     vectors: {
       performance: {
         useWorker: true,
         workerPath: '/js/ultralink-worker.js' // Correct path relative to base URL
       }
     }
   });
   ```

### Cross-Origin Issues

```
Access to fetch at 'https://api.example.com' from origin 'https://your-app.com' has been blocked by CORS policy
```

**Problem**: Cross-Origin Resource Sharing (CORS) restrictions.

**Solutions**:
1. Configure server to allow CORS:
   ```javascript
   // On your server
   app.use(cors({
     origin: 'https://your-app.com',
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

2. Use a proxy server for development:
   ```javascript
   // In package.json
   {
     "proxy": "https://api.example.com"
   }
   ```

## Visualization Problems

### Visualization Not Rendering

**Problem**: Dashboard or visualizations don't appear.

**Solutions**:
1. Check container dimensions:
   ```javascript
   const container = document.getElementById('visualization');
   
   // Ensure container has dimensions
   container.style.width = '100%';
   container.style.height = '600px';
   
   const dashboard = ultralink.createDashboard({
     container: '#visualization',
     autoResize: true
   });
   ```

2. Verify data is available:
   ```javascript
   const entities = await ultralink.countEntities();
   const relationships = await ultralink.countRelationships();
   
   console.log(`Entities: ${entities}, Relationships: ${relationships}`);
   
   if (entities === 0 || relationships === 0) {
     console.warn('No data to visualize');
   }
   ```

3. Check browser console for errors:
   ```javascript
   // Enable debug mode
   const dashboard = ultralink.createDashboard({
     container: '#visualization',
     debug: true
   });
   ```

### Layout Issues

**Problem**: Network layout doesn't look right or is unstable.

**Solutions**:
1. Adjust physics settings:
   ```javascript
   const dashboard = ultralink.createDashboard({
     container: '#visualization',
     physics: {
       enabled: true,
       simulationIterations: 300,
       alpha: 0.3,
       alphaDecay: 0.028,
       velocityDecay: 0.4,
       forceStrength: 0.1
     }
   });
   ```

2. Try different layout algorithms:
   ```javascript
   dashboard.setLayout('hierarchical'); // Try 'force', 'radial', 'hierarchical', 'circular'
   ```

3. Filter data to reduce complexity:
   ```javascript
   dashboard.setFilter({
     entities: {
       type: ['document', 'concept'] // Only include these types
     },
     relationships: {
       type: ['references', 'related_to'] // Only include these types
     },
     maxNodes: 100 // Limit number of nodes
   });
   ```

## Common Error Messages

Here are explanations and solutions for common error messages:

### "Maximum call stack size exceeded"

**Problem**: Recursive function calls exceeding the stack limit, often due to circular references.

**Solutions**:
1. Check for circular references in your data
2. Use iterative approaches instead of recursive ones
3. Implement cycle detection in traversal algorithms

### "Unexpected token in JSON at position X"

**Problem**: Invalid JSON format in data files or API responses.

**Solutions**:
1. Validate JSON with a linter
2. Use try-catch when parsing JSON
3. Check for common JSON syntax errors (missing commas, quotes, etc.)

### "Not enough memory to complete operation"

**Problem**: Operation requires more memory than available.

**Solutions**:
1. Increase memory limit with `--max-old-space-size`
2. Process data in smaller batches
3. Optimize memory usage in your application

## Diagnostic Tools

Use these tools to diagnose UltraLink issues:

### UltraLink Diagnostics

```javascript
// Generate diagnostic report
const diagnostics = await ultralink.diagnostics();
console.log(diagnostics);

// Output includes:
// - Version information
// - Configuration
// - Storage statistics
// - Memory usage
// - Performance metrics
```

### Performance Profiling

```javascript
// Enable performance tracking
ultralink.enablePerformanceTracking();

// Run operations
await ultralink.addEntity('doc-1', 'document', { title: 'Test' });
await ultralink.findSimilar('doc-1');

// Get performance report
const performanceReport = ultralink.getPerformanceReport();
console.log(performanceReport);
```

### Data Validation

```javascript
// Check data integrity
const integrityReport = await ultralink.checkIntegrity();
console.log(integrityReport);

// Fix integrity issues
if (integrityReport.hasIssues) {
  await ultralink.repairIntegrity();
}
```

## Getting Help

If you're still experiencing issues after trying the solutions in this guide:

1. **Check Documentation**: Review the [API Reference](./api/README.md) for correct usage
2. **Search Known Issues**: Check [GitHub Issues](https://github.com/docxology/ultralink/issues) for similar problems
3. **Community Support**: Join the [Discord community](https://discord.gg/ultralink) for real-time help
4. **Stack Overflow**: Post on [Stack Overflow](https://stackoverflow.com/questions/tagged/ultralink) with the `ultralink` tag
5. **Contact Support**: Email the maintainers at DanielAriFriedman@gmail.com with:
   - UltraLink version
   - Environment details (Node.js version, browser, OS)
   - Minimal reproducible example
   - Error messages and stack traces

When reporting issues, please include:

```javascript
// Get version and environment info
const info = await ultralink.getSystemInfo();
console.log(JSON.stringify(info, null, 2));
``` 