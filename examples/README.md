# UltraLink Examples

This directory contains various examples demonstrating the capabilities of the UltraLink knowledge graph system. These examples are designed to help you understand how to use UltraLink in different scenarios.

## Getting Started

To run these examples, you'll need to have UltraLink installed. If you haven't installed it yet, follow the instructions in the main [README.md](../README.md) file.

All examples can be run with Node.js:

```bash
node examples/basic-usage.js
```

## Available Examples

### Basic Usage

**File**: [basic-usage.js](./basic-usage.js)

This example demonstrates the fundamental features of UltraLink:
- Creating entities with attributes
- Establishing relationships between entities
- Parsing text documents with Obsidian-style links
- Exporting entities to Obsidian format
- Using custom formatters
- Adding custom parsers for different link formats
- Querying relationships by type

This is a great starting point if you're new to UltraLink.

### Database Export

**File**: [database-export.js](./database-export.js)

This example shows how to export UltraLink data to SQL format:
- Creating entities and relationships
- Generating SQL statements for the entire knowledge base
- Exporting specific relationship types
- Exporting individual entities to SQL

Use this example if you need to integrate UltraLink with a relational database.

### Integrity Checking

**File**: [integrity-checking.js](./integrity-checking.js)

This example demonstrates UltraLink's data integrity features:
- Creating valid and invalid entities
- Establishing proper and improper relationships
- Running various integrity checks:
  - Link targets validation
  - Bidirectional relationship validation
  - Entity attribute validation
- Fixing integrity issues
- Re-running checks after fixes

Use this example to understand how to ensure data quality in your UltraLink knowledge base.

### Visualization Example

**File**: [visualization-example.js](./visualization-example.js)

This example demonstrates UltraLink's visualization capabilities:
- Creating a social network dataset with people, projects, and technologies
- Generating visualizations in multiple formats:
  - SVG (static vector graphics)
  - PNG (raster images)
  - D3.js (interactive browser visualizations)
  - Cytoscape.js (advanced network visualizations)
- Creating visualizations with different layout algorithms:
  - Force-directed (physics simulation)
  - Grid layout
  - Radial layout
- Handling errors and providing helpful fallbacks

See the [Visualization Guide](./visualization-guide.md) for more detailed information about UltraLink's visualization features.

Run this example to generate various visualizations:

```bash
node examples/visualization-example.js
```

The visualizations will be saved to the `examples/output/visualizations` directory.

### Rendering Examples

**File**: [render-examples.js](./render-examples.js)

This comprehensive example shows how to render UltraLink systems in multiple formats:
- Loading predefined datasets (Desert Ecosystem, Research Team, etc.)
- Rendering to various formats:
  - JSON
  - GraphML
  - CSV
  - Obsidian
  - HTML Website
  - Visualizations (SVG, PNG, D3.js, Cytoscape.js)
  - Bayesian Networks
  - KIF (Knowledge Interchange Format)
  - Full Blob export (compressed and uncompressed)

The rendered outputs are saved to the `examples/output` directory.

Run this example to see UltraLink's comprehensive export capabilities:

```bash
node examples/render-examples.js
```

## Documentation

### Visualization Guide

**File**: [visualization-guide.md](./visualization-guide.md)

This guide provides comprehensive documentation on UltraLink's visualization capabilities:
- Detailed explanation of visualization formats (SVG, PNG, D3.js, Cytoscape.js)
- Configuration options for customizing visualizations
- Environment compatibility information
- Recent improvements to the visualization module
- Troubleshooting tips for visualization issues

This guide is especially helpful if you're working with the visualization features or need to understand the recent enhancements to the visualization module.

## Creating Your Own Examples

Feel free to use these examples as templates for your own UltraLink implementations. To create a new example:

1. Copy an existing example that's similar to what you want to achieve
2. Modify the entities, relationships, and processing logic as needed
3. Add your example to this README.md file for documentation

## Related Documentation

- [Getting Started Guide](../docs/getting-started.md)
- [API Reference](../docs/api/README.md)
- [Visualization Documentation](../docs/reference/visualization.md)
- [Export Formats Documentation](../docs/formats/README.md)
- [Integrity Checking Guide](../docs/guides/integrity-checking.md)

## Troubleshooting

If you encounter issues with the examples:

- Ensure you're using a compatible Node.js version (v14+)
- Check that all dependencies are properly installed
- Verify that the UltraLink module is correctly imported
- For visualization issues, ensure required modules like JSDOM are available
- Check the console for specific error messages

For more assistance, see the [troubleshooting guide](../docs/troubleshooting/README.md) or open an issue on GitHub. 