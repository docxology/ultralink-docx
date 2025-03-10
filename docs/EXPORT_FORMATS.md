# UltraLink Export Formats Guide

UltraLink provides a rich set of export formats to integrate your knowledge graphs with different tools and systems. This guide details each export format, its usage, options, and common applications.

## Table of Contents

1. [JSON Format](#json-format)
2. [CSV Format](#csv-format)
3. [GraphML Format](#graphml-format)
4. [Obsidian Format](#obsidian-format)
5. [HTML Website Format](#html-website-format)
6. [KIF Format](#kif-format)
7. [Bayesian Network Format](#bayesian-network-format)
8. [RxInfer Format](#rxinfer-format)
9. [Full Blob Format](#full-blob-format)
10. [Visualization Formats](#visualization-formats)

## JSON Format

The JSON format provides a standard, machine-readable representation of your knowledge graph.

### Usage

```javascript
const jsonOutput = ultralink.toJSON(options);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pretty` | boolean | `false` | Whether to format the JSON with indentation |
| `includeMetadata` | boolean | `true` | Whether to include metadata like timestamps |
| `includeVectors` | boolean | `false` | Whether to include vector embeddings |

### Example

```javascript
const jsonOutput = ultralink.toJSON({ pretty: true });
fs.writeFileSync('knowledge-graph.json', jsonOutput);
```

### Output Format

```json
{
  "entities": {
    "alan-turing": {
      "id": "alan-turing",
      "type": "person",
      "attributes": {
        "name": "Alan Turing",
        "birthDate": "1912-06-23"
      },
      "metadata": {
        "created": "2023-09-01T12:34:56Z",
        "modified": "2023-09-01T12:34:56Z"
      }
    },
    // More entities...
  },
  "relationships": {
    "alan-turing_studied_at_cambridge": {
      "id": "alan-turing_studied_at_cambridge",
      "source": "alan-turing",
      "target": "cambridge",
      "type": "studied_at",
      "attributes": {
        "years": "1931-1934"
      },
      "metadata": {
        "created": "2023-09-01T12:35:12Z"
      }
    },
    // More relationships...
  },
  "metadata": {
    "version": "1.0.0",
    "entityCount": 5,
    "relationshipCount": 8,
    "exportDate": "2023-09-01T15:30:00Z"
  }
}
```

### Common Applications

- API responses for web applications
- Data exchange between systems
- Input for analysis tools
- Backup/archive format

## CSV Format

The CSV format exports entities and relationships as separate CSV files, ideal for spreadsheet analysis or database import.

### Usage

```javascript
const csvOutput = ultralink.toCSV(options);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delimiter` | string | `,` | The delimiter character for the CSV |
| `includeHeaders` | boolean | `true` | Whether to include column headers |
| `includeMetadata` | boolean | `false` | Whether to include metadata columns |
| `attributesAsColumns` | boolean | `false` | Whether to expand attributes into separate columns |

### Example

```javascript
const csvOutput = ultralink.toCSV({ attributesAsColumns: true });
fs.writeFileSync('entities.csv', csvOutput.entities);
fs.writeFileSync('relationships.csv', csvOutput.relationships);
```

### Output Format

#### Entities CSV
```
id,type,name,birthDate,occupation,created,modified
alan-turing,person,Alan Turing,1912-06-23,Mathematician,2023-09-01T12:34:56Z,2023-09-01T12:34:56Z
cambridge,institution,University of Cambridge,,,"2023-09-01T12:34:57Z",2023-09-01T12:34:57Z
```

#### Relationships CSV
```
id,source,target,type,years,created
alan-turing_studied_at_cambridge,alan-turing,cambridge,studied_at,1931-1934,2023-09-01T12:35:12Z
```

### Common Applications

- Data analysis in spreadsheet applications
- Database imports
- Data visualization tools
- Data cleaning and transformation

## GraphML Format

GraphML is an XML-based file format for graphs, supported by many graph visualization and analysis tools.

### Usage

```javascript
const graphmlOutput = ultralink.toGraphML(options);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeAttributes` | boolean | `true` | Whether to include entity and relationship attributes |
| `includeMetadata` | boolean | `false` | Whether to include metadata |
| `prettyPrint` | boolean | `true` | Whether to format the XML with indentation |

### Example

```javascript
const graphmlOutput = ultralink.toGraphML({ includeAttributes: true });
fs.writeFileSync('knowledge-graph.graphml', graphmlOutput);
```

### Output Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns">
  <key id="type" for="node" attr.name="type" attr.type="string"/>
  <key id="name" for="node" attr.name="name" attr.type="string"/>
  <key id="birthDate" for="node" attr.name="birthDate" attr.type="string"/>
  <key id="relationshipType" for="edge" attr.name="type" attr.type="string"/>
  <key id="years" for="edge" attr.name="years" attr.type="string"/>
  <graph id="G" edgedefault="directed">
    <node id="alan-turing">
      <data key="type">person</data>
      <data key="name">Alan Turing</data>
      <data key="birthDate">1912-06-23</data>
    </node>
    <node id="cambridge">
      <data key="type">institution</data>
      <data key="name">University of Cambridge</data>
    </node>
    <edge id="alan-turing_studied_at_cambridge" source="alan-turing" target="cambridge">
      <data key="relationshipType">studied_at</data>
      <data key="years">1931-1934</data>
    </edge>
  </graph>
</graphml>
```

### Common Applications

- Network analysis tools (e.g., Gephi, Cytoscape)
- Graph visualization software
- Social network analysis
- Complex network research

## Obsidian Format

The Obsidian format exports your knowledge graph as a set of interconnected Markdown files for use with the Obsidian knowledge management system.

### Usage

```javascript
const obsidianOutput = ultralink.toObsidian(options);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backlinks` | boolean | `true` | Whether to include backlinks sections |
| `includeFrontMatter` | boolean | `true` | Whether to include YAML front matter |
| `includeTags` | boolean | `true` | Whether to include entity types as tags |
| `template` | string | null | Custom template for entity pages |

### Example

```javascript
const obsidianOutput = ultralink.toObsidian({ 
  backlinks: true,
  includeFrontMatter: true 
});

// Create directory for Obsidian vault
const obsidianDir = path.join(__dirname, 'knowledge-base');
fs.mkdirSync(obsidianDir, { recursive: true });

// Write files
Object.entries(obsidianOutput).forEach(([id, content]) => {
  fs.writeFileSync(path.join(obsidianDir, `${id}.md`), content);
});
```

### Output Format

#### Alan Turing.md
```markdown
---
type: person
created: 2023-09-01T12:34:56Z
modified: 2023-09-01T12:34:56Z
tags: [person, mathematician]
---

# Alan Turing

- **Birth Date**: June 23, 1912
- **Occupation**: Mathematician

## Relationships

- Studied at [[Cambridge]] (1931-1934)

## Attributes

- **name**: Alan Turing
- **birthDate**: 1912-06-23
- **occupation**: Mathematician
```

#### Cambridge.md
```markdown
---
type: institution
created: 2023-09-01T12:34:57Z
modified: 2023-09-01T12:34:57Z
tags: [institution]
---

# Cambridge

## Relationships

## Backlinks

- [[Alan Turing]] studied at Cambridge (1931-1934)

## Attributes

- **name**: University of Cambridge
```

### Common Applications

- Personal knowledge management
- Research notes
- Project documentation
- Study materials
- Zettelkasten method

## HTML Website Format

The HTML Website format exports your knowledge graph as an interactive, browsable website.

### Usage

```javascript
const htmlOutput = ultralink.toHTMLWebsite(options);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Knowledge Graph'` | Website title |
| `description` | string | `''` | Website description |
| `theme` | string | `'light'` | Website theme (`'light'` or `'dark'`) |
| `includeSearch` | boolean | `true` | Whether to include search functionality |
| `includeVisualization` | boolean | `true` | Whether to include an interactive visualization |
| `customCSS` | string | `''` | Custom CSS to include |
| `customJS` | string | `''` | Custom JavaScript to include |

### Example

```javascript
const htmlOutput = ultralink.toHTMLWebsite({
  title: 'Research Knowledge Base',
  description: 'An interactive knowledge base of research topics and connections',
  theme: 'dark',
  includeVisualization: true
});

// Create directory for website
const websiteDir = path.join(__dirname, 'website');
fs.mkdirSync(websiteDir, { recursive: true });

// Write files
Object.entries(htmlOutput).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(websiteDir, filename), content);
});
```

### Output Format

The HTML Website export produces multiple files:

1. `index.html` - Main entry page with search and visualization
2. `styles.css` - Stylesheet for the website
3. `graph.js` - JavaScript for interactive visualization
4. Entity pages (e.g., `alan-turing.html`, `cambridge.html`)
5. Various asset files

### Common Applications

- Sharing knowledge graphs with non-technical users
- Interactive data exploration
- Public documentation
- Educational resources
- Client deliverables

## KIF Format

The Knowledge Interchange Format (KIF) exports your knowledge graph in a standardized logical format for knowledge representation.

### Usage

```javascript
const kifOutput = ultralink.toKIF(options);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeMetaKnowledge` | boolean | `true` | Whether to include meta-knowledge |
| `includeFunctions` | boolean | `true` | Whether to include functions |
| `includeRules` | boolean | `false` | Whether to include inference rules |

### Example

```javascript
const kifOutput = ultralink.toKIF({ 
  includeMetaKnowledge: true,
  includeFunctions: true
});
fs.writeFileSync('knowledge-graph.kif', kifOutput);
```

### Output Format

```lisp
;; UltraLink Knowledge Graph in KIF Format
;; Generated: 2023-09-01T15:30:00Z

(defrelation studied_at (?person ?institution) :=> (and (person ?person) (institution ?institution)))

(instance Alan-Turing person)
(attribute Alan-Turing name "Alan Turing")
(attribute Alan-Turing birthDate "1912-06-23")
(attribute Alan-Turing occupation "Mathematician")

(instance Cambridge institution)
(attribute Cambridge name "University of Cambridge")

(studied_at Alan-Turing Cambridge)
(attribute studied_at-1 years "1931-1934")
```

### Common Applications

- Formal knowledge representation
- Integration with expert systems
- AI reasoning systems
- Knowledge engineering
- Academic research

## Bayesian Network Format

The Bayesian Network format exports your knowledge graph as a probabilistic model, supporting both JSON and BIF formats.

### Usage

```javascript
const bayesianOutput = ultralink.toBayesianNetwork(options);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | string | `'json'` | Output format (`'json'` or `'bif'`) |
| `includeMetadata` | boolean | `true` | Whether to include metadata |
| `computeProbabilities` | boolean | `true` | Whether to compute conditional probabilities |

### Example

```javascript
const bayesianOutput = ultralink.toBayesianNetwork({ 
  format: 'bif',
  computeProbabilities: true
});
fs.writeFileSync('bayesian-network.bif', bayesianOutput);
```

### Output Format

#### JSON Format
```json
{
  "metadata": {
    "type": "BayesianNetwork",
    "version": "1.0.0"
  },
  "nodes": [
    {
      "id": "alan-turing",
      "name": "Alan Turing",
      "type": "person",
      "states": ["present", "absent"],
      "probability": [0.5, 0.5]
    },
    {
      "id": "cambridge",
      "name": "Cambridge",
      "type": "institution",
      "states": ["present", "absent"],
      "probability": [0.5, 0.5]
    }
  ],
  "edges": [
    {
      "source": "alan-turing",
      "target": "cambridge",
      "relationship": "studied_at",
      "cpt": [
        {
          "when": { "alan-turing": "present" },
          "then": { "cambridge": ["0.9", "0.1"] }
        },
        {
          "when": { "alan-turing": "absent" },
          "then": { "cambridge": ["0.5", "0.5"] }
        }
      ]
    }
  ]
}
```

#### BIF Format
```
network knowledge_graph {
  property version 1.0;
}

variable alan_turing {
  type discrete[2] { present, absent };
  property entity_type "person";
}

variable cambridge {
  type discrete[2] { present, absent };
  property entity_type "institution";
}

probability ( alan_turing ) {
  table 0.5, 0.5;
}

probability ( cambridge | alan_turing ) {
  (present) 0.9, 0.1;
  (absent) 0.5, 0.5;
}
```

### Common Applications

- Probabilistic reasoning
- Machine learning models
- Decision support systems
- Risk analysis
- Predictive analytics

## RxInfer Format

The RxInfer format exports your knowledge graph as Julia code for the RxInfer probabilistic programming library.

### Usage

```javascript
const rxinferOutput = ultralink.toRxInfer(options);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | string | `'model'` | Output format (`'model'`, `'model-with-constraints'`, or `'model-with-test'`) |
| `filePrefix` | string | `'ultralink_model'` | Prefix for the generated file |
| `includeComments` | boolean | `true` | Whether to include comments in the code |

### Example

```javascript
const rxinferOutput = ultralink.toRxInfer({
  format: 'model-with-constraints',
  filePrefix: 'knowledge_graph'
});
fs.writeFileSync('knowledge_graph.jl', rxinferOutput);
```

### Output Format

```julia
# knowledge_graph.jl
# Generated by UltraLink on 2023-09-01T15:30:00Z
# This file contains a RxInfer.jl model generated from an UltraLink knowledge graph

using RxInfer, Distributions

@model function knowledge_graph_model()
    # Define variables for entities
    # Entity: alan_turing (type: person)
    alan_turing ~ Normal(0.0, 1.0)
    alan_turing_name ~ Categorical([0.5, 0.5])
    alan_turing_birth_date ~ Beta(1.0, 1.0)
    
    # Entity: cambridge (type: institution)
    cambridge ~ Categorical([0.5, 0.5])
    cambridge_name ~ Categorical([0.5, 0.5])
    
    # Define relationships between variables
    # Relationship: studied_at (alan_turing → cambridge)
    alan_turing_studied_at_cambridge ~ Bernoulli(sigmoid(alan_turing))
    
    # Return variables of interest
    return (alan_turing, cambridge, alan_turing_studied_at_cambridge)
end
```

### Common Applications

- Probabilistic programming
- Bayesian inference
- Statistical modeling
- Simulation of stochastic processes
- Scientific computing

## Full Blob Format

The Full Blob format exports your entire knowledge graph as a comprehensive data dump, with optional compression.

### Usage

```javascript
const fullBlobOutput = ultralink.toFullBlob(options);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `compress` | boolean | `false` | Whether to compress the output |
| `includeVectors` | boolean | `true` | Whether to include vector embeddings |
| `includeTemporal` | boolean | `true` | Whether to include temporal data |
| `includeVisualization` | boolean | `true` | Whether to include visualization data |

### Example

```javascript
const fullBlobOutput = ultralink.toFullBlob({
  compress: true,
  includeVectors: true,
  includeTemporal: true
});
fs.writeFileSync('knowledge-graph-full.blob', fullBlobOutput);
```

### Output Format

The full blob format includes all aspects of your knowledge graph in a single JSON object (or compressed binary if the `compress` option is used):

```json
{
  "metadata": {
    "version": "1.0.0",
    "exportDate": "2023-09-01T15:30:00Z",
    "compressionFormat": "none"
  },
  "entities": {
    /* All entities with complete data */
  },
  "relationships": {
    /* All relationships with complete data */
  },
  "vectors": {
    /* Vector embeddings for entities */
  },
  "temporal": {
    /* Temporal data and history */
  },
  "schema": {
    /* Schema definitions */
  },
  "visualization": {
    /* Visualization settings and cached data */
  },
  "bayesianNetwork": {
    /* Bayesian network representation */
  }
}
```

### Common Applications

- Complete system backups
- Data migration between systems
- Archive format
- Full-system restore points

## Visualization Formats

UltraLink's visualization export system is covered in detail in the [Visualization Guide](VISUALIZATION_GUIDE.md), but here's a brief overview:

### Usage

```javascript
const visualizationOutput = await ultralink.toVisualization(options);
```

### Available Formats

- **SVG** - Vector graphics format for high-quality static visualizations
- **PNG** - Raster graphics format for sharing and presentations
- **D3.js** - Interactive web-based visualization with D3.js
- **Cytoscape.js** - Network analysis visualization with Cytoscape.js

### Common Applications

- Interactive data exploration
- Presentation materials
- Publications and documentation
- Web applications
- Data dashboards

## Combining Export Formats

For comprehensive documentation and analysis, you can combine multiple export formats:

```javascript
// Generate exports in multiple formats
const exports = {
  json: ultralink.toJSON({ pretty: true }),
  graphml: ultralink.toGraphML(),
  obsidian: ultralink.toObsidian(),
  website: ultralink.toHTMLWebsite({
    title: 'My Knowledge Graph'
  }),
  visualization: await ultralink.toVisualization({
    format: 'svg',
    style: 'colorful'
  })
};

// Save all exports to appropriate files/directories
// ... (file writing code) ...
```

## Export Format Comparison

| Format | Interactivity | Machine Readable | Human Readable | File Size | Common Use Cases |
|--------|---------------|------------------|----------------|-----------|------------------|
| JSON | No | High | Medium | Medium | API responses, data exchange |
| CSV | No | High | High | Small | Data analysis, database import |
| GraphML | No | High | Low | Medium | Network analysis tools |
| Obsidian | Limited | Low | High | Small | Personal knowledge management |
| HTML Website | High | Low | High | Large | Interactive exploration |
| KIF | No | High | Medium | Small | Formal knowledge representation |
| Bayesian Network | No | High | Low | Medium | Probabilistic reasoning |
| RxInfer | No | Medium | Medium | Small | Statistical modeling |
| Full Blob | No | High | Low | Large/Small (compressed) | System backups |
| Visualization | Varies | Low | High | Varies | Presentation, exploration |

For more details on any specific format, refer to the corresponding section in this guide or check the API documentation. 