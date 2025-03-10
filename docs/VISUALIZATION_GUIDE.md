# UltraLink Visualization Guide

This guide provides detailed instructions on how to use UltraLink's powerful visualization capabilities to create interactive and static visualizations of your knowledge graphs.

## Table of Contents

1. [Introduction](#introduction)
2. [Visualization Formats](#visualization-formats)
3. [Layout Options](#layout-options)
4. [Style Options](#style-options)
5. [Advanced Customization](#advanced-customization)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)

## Introduction

UltraLink provides a flexible visualization system that supports multiple output formats, layout algorithms, and style options. The visualization functionality is accessed through the `toVisualization()` method, which generates visual representations of your knowledge graph.

```javascript
const visualization = await ultralink.toVisualization(options);
```

## Visualization Formats

UltraLink supports four primary visualization formats:

### SVG Format

SVG (Scalable Vector Graphics) provides a crisp, resolution-independent visualization that's ideal for printing and embedding in documents.

```javascript
const svgVisualization = await ultralink.toVisualization({
  format: 'svg',
  width: 800,
  height: 600,
  layout: 'force',
  style: 'default'
});

// Save to file
fs.writeFileSync('graph.svg', svgVisualization.data);
```

### PNG Format

PNG format is ideal for sharing images or including in presentations, providing a standard raster image format.

```javascript
const pngVisualization = await ultralink.toVisualization({
  format: 'png',
  width: 1200,
  height: 900,
  layout: 'radial',
  style: 'colorful',
  density: 300 // Higher for better quality, e.g., 300 DPI
});

// Save to file
fs.writeFileSync('graph.png', pngVisualization.data);
```

### D3.js Interactive Visualization

D3.js visualizations provide interactive, web-based visualizations with zoom, pan, and hover capabilities.

```javascript
const d3Visualization = await ultralink.toVisualization({
  format: 'd3',
  includeControls: true,
  title: 'Knowledge Graph Visualization',
  description: 'Interactive visualization of my knowledge graph',
  theme: 'light'
});

// Save to file
fs.writeFileSync('interactive-graph.html', d3Visualization.data);
```

### Cytoscape.js Interactive Visualization

Cytoscape.js provides advanced graph analysis and interaction capabilities for web-based visualizations.

```javascript
const cytoscapeVisualization = await ultralink.toVisualization({
  format: 'cytoscape',
  includeControls: true,
  title: 'Network Analysis',
  description: 'Interactive visualization with analysis capabilities',
  enableNodeDragging: true
});

// Save to file
fs.writeFileSync('cytoscape-graph.html', cytoscapeVisualization.data);
```

## Layout Options

UltraLink supports multiple layout algorithms for organizing your knowledge graph:

### Force-Directed Layout

The default layout uses force-directed placement to create a balanced network visualization:

```javascript
const forceLayout = await ultralink.toVisualization({
  format: 'svg',
  layout: 'force',
  // Force layout options
  forceStrength: 0.3,
  linkDistance: 100,
  chargeStrength: -30
});
```

### Radial Layout

Radial layouts place nodes in concentric circles, with central nodes in the middle:

```javascript
const radialLayout = await ultralink.toVisualization({
  format: 'svg',
  layout: 'radial',
  // Radial layout options
  centerEntity: 'central-node-id', // Optional: entity ID to place at center
  sortBy: 'degree' // Sort by: 'degree', 'type', 'connections', etc.
});
```

### Grid Layout

Grid layouts place nodes in a regular grid pattern:

```javascript
const gridLayout = await ultralink.toVisualization({
  format: 'svg',
  layout: 'grid',
  // Grid layout options
  rows: 5, // Optional: number of rows
  columns: 5, // Optional: number of columns
  sortBy: 'type' // Sort by: 'type', 'id', 'attributes.name', etc.
});
```

### Cluster Layout

Cluster layouts group nodes by type or other attributes:

```javascript
const clusterLayout = await ultralink.toVisualization({
  format: 'svg',
  layout: 'cluster',
  // Cluster layout options
  clusterBy: 'type', // Cluster by: 'type', 'attributes.category', etc.
  clusterPadding: 20, // Space between clusters
  nodePadding: 5 // Space between nodes in a cluster
});
```

## Style Options

UltraLink offers multiple style options to customize the appearance of your visualizations:

### Default Style

The default style provides a clean, professional look:

```javascript
const defaultStyle = await ultralink.toVisualization({
  format: 'svg',
  style: 'default'
});
```

### Colorful Style

The colorful style uses a vibrant color palette with high contrast:

```javascript
const colorfulStyle = await ultralink.toVisualization({
  format: 'svg',
  style: 'colorful'
});
```

### Grayscale Style

The grayscale style uses shades of gray, ideal for formal documents or printing:

```javascript
const grayscaleStyle = await ultralink.toVisualization({
  format: 'svg',
  style: 'grayscale'
});
```

### Minimal Style

The minimal style provides a clean, minimalist look with less visual noise:

```javascript
const minimalStyle = await ultralink.toVisualization({
  format: 'svg',
  style: 'minimal'
});
```

## Advanced Customization

### Custom Colors

You can customize colors for specific entity types:

```javascript
const customColorStyle = await ultralink.toVisualization({
  format: 'svg',
  colors: {
    person: '#4a6fa5',
    organization: '#57a773',
    event: '#ef8354',
    default: '#c1cefe'
  }
});
```

### Custom Node Sizing

Control node sizes based on attributes or relationship counts:

```javascript
const customSizedNodes = await ultralink.toVisualization({
  format: 'svg',
  nodeSizing: {
    attribute: 'attributes.importance', // Size based on an attribute
    min: 5, // Minimum node size
    max: 30, // Maximum node size
    default: 10 // Default size if attribute missing
  }
});
```

### Custom Labels

Control which labels are displayed and how:

```javascript
const customLabels = await ultralink.toVisualization({
  format: 'svg',
  labelOptions: {
    attribute: 'attributes.name', // Which attribute to use for labels
    fontSize: 12,
    fontFamily: 'Arial',
    showOnHover: true, // Only show labels on hover (for interactive formats)
    maxLength: 20 // Truncate long labels
  }
});
```

### Custom Relationship Rendering

Customize how relationships (links) are displayed:

```javascript
const customRelationships = await ultralink.toVisualization({
  format: 'svg',
  relationshipOptions: {
    showLabels: true, // Show relationship type as label
    curved: true, // Use curved lines for relationships
    thickness: {
      attribute: 'attributes.strength', // Vary thickness based on attribute
      min: 1,
      max: 5,
      default: 2
    },
    colors: {
      collaborated_with: '#57a773',
      reports_to: '#ef8354',
      default: '#999999'
    }
  }
});
```

## Fallback Visualizations

UltraLink includes a robust fallback visualization system that ensures you always get usable output, even when the standard visualization process encounters issues. This is particularly useful in automated environments or when dealing with edge cases in knowledge graph structure.

### Automatic Fallback Generation

When the standard visualization process encounters an error, UltraLink automatically generates a fallback visualization:

```javascript
try {
  const visualization = await ultralink.toVisualization({ format: 'svg' });
  fs.writeFileSync('graph.svg', visualization.data);
} catch (error) {
  console.warn("Standard visualization failed, using fallback");
  const fallback = generateFallbackVisualization('svg', ultralink.name);
  fs.writeFileSync('graph.svg', fallback);
}
```

In most cases, you don't need to manually handle fallbacks - UltraLink does this automatically when you call `toVisualization()`.

### Customizing Fallback Visualizations

You can generate customized fallback content for different formats:

```javascript
const { generateFallbackVisualization, createFallbackPNG } = require('ultralink/src/lib/exporters/visualization-helpers');

// Generate a fallback SVG
const svgFallback = generateFallbackVisualization('svg', 'MySystem', 1000, 800);

// Generate a fallback PNG with a custom message
const pngFallback = await createFallbackPNG(800, 600, 'Custom fallback visualization', 'MySystem');
```

### Available Fallback Formats

UltraLink supports fallbacks for all standard visualization formats:

- SVG: Clean, simple SVG with system name and timestamp
- PNG: Generated image with system name and optional message
- D3.js: Simple interactive visualization with basic node structure
- Cytoscape.js: Basic interactive visualization with minimal functionality

### Detecting Fallback Output

You can detect if you received fallback content by checking for marker text or attributes:

```javascript
const visualization = await ultralink.toVisualization({ format: 'svg' });
const isFallback = visualization.data.includes('Fallback Visualization');

if (isFallback) {
  console.log('Received fallback visualization - you may want to check your knowledge graph structure');
}
```

## Examples

### Basic Social Network Visualization

```javascript
// Create a social network dataset
const ultralink = new UltraLink();

// Add people
ultralink.addEntity('alice', 'person', { name: 'Alice Chen', age: 32 });
ultralink.addEntity('bob', 'person', { name: 'Bob Smith', age: 28 });
ultralink.addEntity('charlie', 'person', { name: 'Charlie Davis', age: 35 });

// Add relationships
ultralink.addLink('alice', 'bob', 'collaborates_with');
ultralink.addLink('bob', 'alice', 'collaborates_with');
ultralink.addLink('alice', 'charlie', 'manages');
ultralink.addLink('charlie', 'alice', 'reports_to');
ultralink.addLink('bob', 'charlie', 'collaborates_with');
ultralink.addLink('charlie', 'bob', 'collaborates_with');

// Create an interactive D3.js visualization
const visualization = await ultralink.toVisualization({
  format: 'd3',
  layout: 'force',
  style: 'colorful',
  title: 'Social Network Visualization',
  description: 'A simple social network with 3 people',
  includeControls: true
});

// Save the visualization
fs.writeFileSync('social-network.html', visualization.data);
```

### Research Knowledge Graph

```javascript
// Create a research knowledge graph
const ultralink = new UltraLink();

// Add researchers, papers, and topics
ultralink.addEntity('researcher1', 'person', { name: 'Dr. Jane Smith', institution: 'MIT' });
ultralink.addEntity('researcher2', 'person', { name: 'Dr. John Doe', institution: 'Stanford' });
ultralink.addEntity('paper1', 'publication', { title: 'Advanced ML Techniques', year: 2022 });
ultralink.addEntity('paper2', 'publication', { title: 'Graph Neural Networks', year: 2023 });
ultralink.addEntity('topic1', 'topic', { name: 'Machine Learning' });
ultralink.addEntity('topic2', 'topic', { name: 'Graph Theory' });

// Add relationships
ultralink.addLink('researcher1', 'paper1', 'authored');
ultralink.addLink('researcher1', 'paper2', 'authored');
ultralink.addLink('researcher2', 'paper2', 'authored');
ultralink.addLink('paper1', 'topic1', 'about');
ultralink.addLink('paper2', 'topic1', 'about');
ultralink.addLink('paper2', 'topic2', 'about');
ultralink.addLink('researcher1', 'researcher2', 'collaborates_with');
ultralink.addLink('researcher2', 'researcher1', 'collaborates_with');

// Create a cluster visualization with custom colors
const visualization = await ultralink.toVisualization({
  format: 'svg',
  layout: 'cluster',
  clusterBy: 'type',
  style: 'default',
  width: 1000,
  height: 800,
  colors: {
    person: '#4a6fa5',
    publication: '#57a773',
    topic: '#ef8354'
  },
  nodeSizing: {
    byType: {
      person: 15,
      publication: 12,
      topic: 18
    }
  }
});

// Save the visualization
fs.writeFileSync('research-network.svg', visualization.data);
```

## Troubleshooting

### PNG Generation Issues

If you encounter issues generating PNG visualizations:

1. Ensure the `sharp` library is installed:
   ```bash
   npm install sharp
   ```

2. For high-resolution images, reduce the dimensions:
   ```javascript
   const visualization = await ultralink.toVisualization({
     format: 'png',
     width: 800,  // Reduced from 1200
     height: 600, // Reduced from 900
     density: 150 // Reduced from 300
   });
   ```

3. Check for missing elements in the visualization:
   ```javascript
   // Ensure there are visible elements
   if (visualization.data.length < 1000) {
     console.warn('Visualization may be empty or malformed');
   }
   ```

### Interactive Visualization Not Working

If interactive visualizations (D3 or Cytoscape) aren't working correctly:

1. Ensure all dependencies are included in the HTML output
2. Check browser console for JavaScript errors
3. Try a different browser
4. Reduce the complexity of your knowledge graph for better performance

### Layout Issues

If your layout doesn't look optimal:

1. For force-directed layouts, adjust the force parameters:
   ```javascript
   const visualization = await ultralink.toVisualization({
     format: 'svg',
     layout: 'force',
     forceStrength: 0.2,  // Reduced from default
     linkDistance: 150,   // Increased from default
     chargeStrength: -50  // Increased repulsion
   });
   ```

2. For cluster layouts, try grouping by different attributes:
   ```javascript
   const visualization = await ultralink.toVisualization({
     format: 'svg',
     layout: 'cluster',
     clusterBy: 'attributes.category' // Instead of 'type'
   });
   ```

3. For large graphs, consider filtering to show only key relationships:
   ```javascript
   const visualization = await ultralink.toVisualization({
     format: 'svg',
     filter: {
       nodeTypes: ['person', 'organization'], // Only show specific types
       maxNodes: 100, // Limit total nodes shown
       relationshipTypes: ['manages', 'reports_to'] // Only show specific relationships
     }
   });
   ```

For more visualization examples and techniques, see the [examples directory](../examples/) and specifically the [visualization example](../examples/visualization-example.js). 