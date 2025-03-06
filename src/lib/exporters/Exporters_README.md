# UltraLink Exporters

This directory contains the different export formats supported by UltraLink, separated into individual modules for better maintainability and extensibility.

## Directory Structure

- `index.js` - Main entry point that imports and re-exports all exporters
- Individual exporters:
  - `json.js` - JSON exporter (`toJSON`)
  - `csv.js` - CSV exporter (`toCSV`)
  - `graphml.js` - GraphML exporter (`toGraphML`)
  - `obsidian.js` - Obsidian Markdown exporter (`toObsidian`)
  - `html-website.js` - HTML Website exporter (`toHTMLWebsite`)
  - `kif.js` - Knowledge Interchange Format exporter (`toKIF`)
  - `visualization.js` - Visualization formats exporter (`toVisualization`)
  - `bayesian-network.js` - Bayesian Network exporter (`toBayesianNetwork`)
  - `full-blob.js` - Full blob exporter that combines all formats (`toFullBlob`)
- `utils/` - Directory containing utility functions:
  - `relationship-html.js` - Utility for generating HTML for entity relationships

## Adding New Exporters

To add a new exporter:

1. Create a new file in this directory, e.g., `my-format.js`
2. Implement your exporter function, e.g., `toMyFormat()`
3. Export your function using `module.exports`
4. Add your exporter to `index.js`:
   - Import it: `const { toMyFormat } = require('./my-format');`
   - Add it to the exports object: `module.exports = { ..., toMyFormat };`

## Export Function Interface

All exporters follow the same interface:

```javascript
/**
 * Export data to a specific format
 * @param {Object} options - Format-specific options
 * @returns {Object} Object containing file paths as keys and content as values
 */
function toSomeFormat(options = {}) {
  // Implementation...
  
  return {
    'filename.ext': 'file content',
    // ...other files
  };
}
```

Each exporter returns an object where:
- Keys are filenames (possibly including subdirectories)
- Values are the content of those files as strings

This allows UltraLink to support exporting to both single files and multiple files within a directory structure. 

## Supported Export Formats

The UltraLink library supports the following export formats, as described in detail in the [RENDERING_TARGETS.md](../../../RENDERING_TARGETS.md) document:

1. **JSON** - Universal data exchange format for API integration and system interoperability
2. **GraphML** - XML-based graph format for visualization tools like Gephi and Cytoscape
3. **CSV** - Tabular format for spreadsheet analysis and database import/export
4. **Obsidian** - Markdown files with wiki-links for knowledge management applications
5. **HTML Website** - Self-contained interactive website for sharing and exploration
6. **Visualization** - Direct visual representations (SVG, PNG, D3.js, Cytoscape.js)
7. **Bayesian Network** - Probabilistic graphical models in JSON and BIF formats
8. **KIF** - Knowledge Interchange Format for AI and knowledge-based systems
9. **Full Blob** - Complete serialization of all formats for backup and transfer

See the [RENDERING_TARGETS.md](../../../RENDERING_TARGETS.md) document for comprehensive documentation of all supported formats, their purpose, and usage examples. 