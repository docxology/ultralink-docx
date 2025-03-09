# UltraLink Visualization Guide

This guide explains how to use UltraLink's visualization capabilities, which enable you to convert your knowledge graphs into various visual formats.

## Overview

UltraLink provides several visualization formats:

1. **SVG** - Static vector graphics suitable for publications and presentations
2. **PNG** - Raster graphics for web and documents
3. **D3.js** - Interactive browser-based visualizations
4. **Cytoscape.js** - Advanced network visualizations with specialized layouts

## Basic Usage

To generate a visualization of your UltraLink graph, use the `toVisualization` method:

```javascript
const { UltraLink } = require('ultralink');

// Create a UltraLink instance and add data
const ultralink = new UltraLink();
ultralink.createEntity('person', 'Alice', { name: 'Alice' });
ultralink.createEntity('person', 'Bob', { name: 'Bob' });
ultralink.createLink('Alice', 'Bob', 'knows');

// Generate an SVG visualization (default format)
const svgOutput = await ultralink.toVisualization();
console.log(svgOutput['graph.svg']); // SVG content as string

// Generate a PNG visualization
const pngOutput = await ultralink.toVisualization({ format: 'png' });
// pngOutput['graph.png'] contains PNG data as Buffer

// Generate a D3.js visualization
const d3Output = await ultralink.toVisualization({ format: 'd3' });
// d3Output['graph-d3.html'] contains HTML with D3.js code

// Generate a Cytoscape.js visualization
const cytoOutput = await ultralink.toVisualization({ format: 'cytoscape' });
// cytoOutput['graph-cytoscape.html'] contains HTML with Cytoscape.js code
```

## Configuration Options

The `toVisualization` method accepts several configuration options:

```javascript
await ultralink.toVisualization({
  format: 'svg',       // 'svg', 'png', 'd3', or 'cytoscape'
  layout: 'force',     // 'force', 'grid', or 'radial'
  style: 'default',    // Visual styling
  width: 800,          // Width in pixels
  height: 600          // Height in pixels
});
```

### Format Options

- **svg**: Produces an SVG string with a static graph visualization
- **png**: Generates a PNG image as a Buffer
- **d3**: Creates an HTML file with D3.js code for interactive visualization
- **cytoscape**: Produces an HTML file with Cytoscape.js code for specialized network visualization

### Layout Options

- **force**: Force-directed layout using physics simulation (default)
- **grid**: Arranges nodes in a grid pattern
- **radial**: Places nodes in a circular arrangement

## SVG Visualization

The SVG format includes style definitions and proper node/edge rendering:

```javascript
const svgOutput = await ultralink.toVisualization({ format: 'svg' });
const svgContent = svgOutput['graph.svg'];

// Write to file
const fs = require('fs');
fs.writeFileSync('graph.svg', svgContent);
```

The SVG output includes:
- Style definitions for consistent appearance
- Node circles with appropriate colors
- Text labels for entities
- Edge lines connecting related entities

## D3.js Visualization

The D3.js format creates an interactive HTML file:

```javascript
const d3Output = await ultralink.toVisualization({ format: 'd3' });
const htmlContent = d3Output['graph-d3.html'];

// Write to file
fs.writeFileSync('graph-d3.html', htmlContent);
```

The D3.js visualization includes:
- Interactive force-directed layout
- Draggable nodes
- Automatic positioning of elements
- Hover effects for better interaction

## Cytoscape.js Visualization

Cytoscape.js provides advanced network visualization capabilities:

```javascript
const cytoOutput = await ultralink.toVisualization({ format: 'cytoscape' });
const htmlContent = cytoOutput['graph-cytoscape.html'];

// Write to file
fs.writeFileSync('graph-cytoscape.html', htmlContent);
```

The Cytoscape.js visualization includes:
- Specialized network layouts
- Advanced node and edge styling
- Interactive capabilities
- Better performance for large graphs

## PNG Generation

PNG generation requires the `sharp` module:

```javascript
const pngOutput = await ultralink.toVisualization({ format: 'png' });
const pngBuffer = pngOutput['graph.png'];

// Write to file
fs.writeFileSync('graph.png', pngBuffer);
```

## Recent Improvements

Recent updates to the visualization module have enhanced its capabilities and compatibility:

1. **Added style tags** to SVG output for consistent appearance
2. **Fixed node positioning** with a more reliable lookup approach
3. **Improved error handling** with meaningful fallback visualizations
4. **Enhanced browser compatibility** through proper HTML output
5. **Added Node.js compatibility** with proper JSDOM integration for headless environments

## Environment Compatibility

The visualization module works in both browser and Node.js environments:

- **Browser**: Uses native DOM capabilities when available
- **Node.js**: Uses JSDOM for DOM simulation in headless environments

For Node.js environments, make sure you have the required dependencies:

```bash
npm install jsdom
```

For PNG generation, you'll also need:

```bash
npm install sharp
```

## Handling Large Graphs

For large graphs (100+ nodes), consider these optimization strategies:

1. Use the `layout: 'grid'` option for better initial performance
2. Reduce the number of displayed relationships by filtering your data
3. Group related nodes by type or category
4. Use the PNG format for static representation of large graphs

## Troubleshooting

### SVG Rendering Issues

If SVG output doesn't display properly:
- Ensure the SVG has a proper XML declaration
- Verify that style elements are included
- Check for valid viewBox and dimensions

### D3/Cytoscape HTML Issues

If the HTML visualizations don't work:
- Verify that the HTML contains the correct script tags
- Check browser console for JavaScript errors
- Ensure data initialization is correct

### PNG Generation Failures

If PNG generation fails:
- Verify that the `sharp` module is installed
- Check for SVG validity before conversion
- Handle potential async errors properly

## Example Code

See the [render-examples.js](./render-examples.js) example for comprehensive demonstration of all visualization formats.

## Related Documentation

- [Export Formats Documentation](../docs/formats/README.md)
- [Visualization API Reference](../docs/api/visualization.md)
- [Customizing Visualizations](../docs/guides/custom-visualizations.md) 