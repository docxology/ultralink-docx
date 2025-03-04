# UltraLink Installation Guide

This guide will walk you through the process of installing UltraLink in your JavaScript project.

## Requirements

Before installing UltraLink, ensure your environment meets the following requirements:

- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher (or equivalent package manager)
- **JavaScript Environment**: UltraLink works in both Node.js and modern browsers

## Standard Installation

The most common way to install UltraLink is using npm:

```bash
npm install ultralink
```

Or if you prefer using yarn:

```bash
yarn add ultralink
```

This will install the core UltraLink package with its essential dependencies.

## Installation with Optional Features

UltraLink offers several optional features that can be installed as needed:

### Vector Embeddings Support

To use vector embeddings for semantic similarity and clustering:

```bash
npm install ultralink @ultralink/vector
```

### LLM Integration

To use LLM features for generating insights and analyzing content:

```bash
npm install ultralink @ultralink/llm
```

### Additional Export Formats

For specialized export formats beyond the standard ones:

```bash
npm install ultralink @ultralink/formats
```

### Complete Installation

To install UltraLink with all optional features:

```bash
npm install ultralink @ultralink/vector @ultralink/llm @ultralink/formats
```

## Using UltraLink in a Browser Environment

### Via npm and Bundlers

When using a bundler like webpack, Rollup, or Parcel, install UltraLink via npm and import it in your code:

```javascript
import { UltraLink } from 'ultralink';
```

The bundler will package UltraLink with your application.

### Via CDN

You can also use UltraLink directly in a browser via a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ultralink@0.5.0/dist/ultralink.min.js"></script>

<script>
  const graph = new UltraLink.UltraLink();
  // Use UltraLink...
</script>
```

## Environment-Specific Considerations

### Node.js

UltraLink works seamlessly in Node.js environments. To use it in a Node.js application:

```javascript
const { UltraLink } = require('ultralink');

const graph = new UltraLink();
// Use UltraLink...
```

### Browser Compatibility

UltraLink is compatible with all modern browsers (Chrome, Firefox, Safari, Edge) that support ES6+ features. The library is transpiled to support older browsers, but some advanced features may require polyfills.

### React Integration

To use UltraLink in a React application:

```jsx
import React, { useState, useEffect } from 'react';
import { UltraLink } from 'ultralink';

function KnowledgeGraph() {
  const [graph, setGraph] = useState(null);
  
  useEffect(() => {
    const ultraLink = new UltraLink();
    // Initialize your graph
    setGraph(ultraLink);
  }, []);
  
  // Render your component using the graph
}
```

### Vue Integration

To use UltraLink in a Vue application:

```javascript
import { UltraLink } from 'ultralink';

export default {
  data() {
    return {
      graph: null
    }
  },
  created() {
    this.graph = new UltraLink();
    // Initialize your graph
  }
}
```

## Verifying the Installation

After installing UltraLink, you can verify the installation by creating a simple test script:

```javascript
const { UltraLink } = require('ultralink');

// Create a new UltraLink instance
const graph = new UltraLink();

// Create a couple of entities
const entity1 = graph.createEntity('concept', 'concept-1', { name: 'Example Concept' });
const entity2 = graph.createEntity('concept', 'concept-2', { name: 'Related Concept' });

// Create a link between them
graph.createLink('concept-1', 'concept-2', 'relates-to');

// Get all links for concept-1
const links = graph.getLinks('concept-1');
console.log('Links:', links);

// Export to JSON
const jsonExport = graph.toJSON();
console.log('JSON Export:', JSON.stringify(jsonExport, null, 2));

console.log('UltraLink installation verified successfully!');
```

Save this file as `verify-installation.js` and run it with Node.js:

```bash
node verify-installation.js
```

If the script executes without errors and displays the expected output, UltraLink is correctly installed.

## Troubleshooting Installation Issues

### Dependency Conflicts

If you encounter dependency conflicts during installation, try using the `--force` flag:

```bash
npm install ultralink --force
```

### Version Mismatch

If you experience issues with version compatibility, specify the exact version:

```bash
npm install ultralink@0.5.0
```

### Node.js Version Issues

If you receive errors related to Node.js compatibility, update to a compatible version. UltraLink requires Node.js 16.x or higher.

### Memory Limitations

For large knowledge graphs, you might need to increase the memory limit for Node.js:

```bash
node --max-old-space-size=8192 your-script.js
```

## Next Steps

Now that you have UltraLink installed, you can:

1. Continue to the [Quick Start Guide](./quick-start.md) to create your first knowledge graph
2. Explore the [API Reference](../api/README.md) to learn about all available functions
3. Check out [Example Projects](../examples/README.md) for inspiration

If you encounter any issues with the installation process, please refer to the [Troubleshooting Guide](../troubleshooting.md) or [reach out to the community](../community-support.md) for assistance. 