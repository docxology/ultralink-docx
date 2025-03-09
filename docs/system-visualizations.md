# System-Specific Content Visualizations

UltraLink now supports system-specific content visualizations with templated summaries in PNG format. These visualizations provide a standardized way to represent different system types with customized visual elements and system-specific summary information.

## Overview

The system-specific visualization feature generates beautiful PNG images that combine:

1. A graph visualization of the system structure
2. A templated summary of the system's purpose and features
3. System-specific visual elements and color schemes
4. Key metrics and statistics about the system

These visualizations are perfect for:
- Documentation and reporting
- System dashboards
- Presentations and sharing
- Visual system comparisons

## Supported System Types

UltraLink includes built-in templates for the following system types:

| System Type | Description |
|------------|-------------|
| `neurofeedback` | EEG neurofeedback research system with training protocols for ADHD and anxiety |
| `car` | Automotive system knowledge graph with engine, electrical, wheel, and interior subsystems |
| `pomdp` | Partially Observable Markov Decision Process model |

## Usage

### Basic Usage

To generate a system-specific visualization with a templated summary:

```javascript
const UltraLink = require('ultralink');

// Create your UltraLink instance
const ul = new UltraLink();

// Add your entities and relationships
// ...

// Generate system-specific visualization
const result = await ul.toVisualization({
  format: 'png',
  systemName: 'neurofeedback',
  useSystemTemplate: true,
  width: 1200,
  height: 900
});

// result will contain a Buffer with the PNG data in 'graph.png'
// You can write this to a file
const fs = require('fs');
fs.writeFileSync('neurofeedback-visualization.png', result['graph.png']);
```

### Command-line Usage

You can also generate system-specific visualizations using the included script:

```bash
node scripts/generate-system-visualizations.js pomdp
```

Options:
- `--all-sizes` - Generate visualizations in multiple sizes (large, medium, small)
- `all` - Generate visualizations for all system types

Example:
```bash
node scripts/generate-system-visualizations.js all --all-sizes
```

## Customizing System Templates

You can customize the system templates or add new ones by modifying the `SYSTEM_TEMPLATES` object in `src/lib/exporters/system-template-visualizer.js`.

Each template includes:
- `title` - Main title for the visualization
- `summary` - Descriptive text about the system
- `nodeTypes` - Array of node type labels
- `colorScheme` - Array of colors for the nodes
- `metrics` - Array of key metrics to display

Example of adding a custom system template:

```javascript
const SYSTEM_TEMPLATES = {
  // ... existing templates
  
  // Add your custom template
  'mySystem': {
    title: 'My Custom System',
    summary: 'Description of my custom system and its purpose.',
    nodeTypes: ['Main Node', 'Node Type A', 'Node Type B', 'Node Type C'],
    colorScheme: ['#4682b4', '#3cb371', '#ff7f50', '#9370db'],
    metrics: [
      { label: 'Key Metric 1', value: '42' },
      { label: 'Key Metric 2', value: '78%' },
      { label: 'Key Metric 3', value: '1.23' }
    ]
  }
};
```

## Programmatic API

### Main Functions

- `generateSystemVisualization(systemType, options)` - Generate a visualization for a specific system type
- `generateAllSystemVisualizations(options)` - Generate visualizations for all known system types

### Options

- `width` - Width of the output PNG (default: 1200)
- `height` - Height of the output PNG (default: 900)
- `outputDir` - Directory to save the output PNG (default: './output/visualizations')
- `filename` - Filename for the output PNG (default: '{systemType}-system-visualization.png')

## Implementation Details

The system-specific visualizations are implemented using:

1. SVG templates for the visualization structure
2. Sharp for high-quality PNG rendering
3. Template-based system information
4. Customizable node and link layouts

The implementation is in:
- `src/lib/exporters/system-template-visualizer.js` - Core implementation
- `scripts/generate-system-visualizations.js` - Command-line tool 