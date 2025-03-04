# UltraLink Rendering Targets

UltraLink supports multiple export formats for different use cases. This document provides details on each format, its purpose, and how to use it.

## The UltraLink Paradigm

At its core, UltraLink is a powerful knowledge representation system built on these key principles:

1. **Entity-Relationship Model**: Knowledge is represented as entities connected by typed relationships, creating a rich semantic network.

2. **Multi-Dimensional Knowledge**: UltraLink supports various dimensions of knowledge representation:
   - **Semantic Dimension**: Entities and relationships with typed attributes
   - **Vector Dimension**: Neural embeddings for semantic similarity and clustering
   - **Temporal Dimension**: Time-aware entities and relationships that can evolve
   - **Probabilistic Dimension**: Uncertainties and likelihoods through Bayesian representations

3. **Cross-Format Rendering**: The same knowledge graph can be seamlessly transformed into multiple representations to serve different purposes:
   - Human-readable formats for exploration and understanding
   - Machine-readable formats for computational processing
   - Interactive formats for visualization and presentation
   - Formal logic representations for automated reasoning

4. **Extensibility**: The system is designed to be extended with new entity types, relationship types, attributes, and rendering formats.

### Semantic Foundations

UltraLink's semantic model is based on:

- **Entities**: Objects or concepts with unique identifiers, types, and attributes
- **Relationships**: Directed connections between entities with types and attributes
- **Metadata**: Information about entities and relationships (creation time, last modified, etc.)
- **Attributes**: Key-value pairs that describe properties of entities and relationships

### Rendering Semantics

UltraLink's rendering system transforms this semantic model into different representations while preserving these key semantics:

1. **Preservation of Identity**: Entity and relationship identities are maintained across formats
2. **Type Preservation**: Entity and relationship types inform the structure in target formats
3. **Attribute Mapping**: Attributes are mapped to appropriate constructs in each format
4. **Relationship Directionality**: The direction of relationships is preserved where applicable
5. **Metadata Inclusion**: Metadata is included when the target format supports it

## Overview

UltraLink can export data to the following formats:

1. **JSON** - Universal data exchange format
2. **GraphML** - XML-based graph format for visualization tools
3. **CSV** - Tabular format for spreadsheet analysis
4. **Obsidian** - Markdown files with wiki-links for knowledge management
5. **HTML Website** - Self-contained interactive website for sharing and exploration
6. **Visualization** - Direct visual representations in SVG, PNG, D3.js, and Cytoscape.js
7. **Bayesian Network** - Probabilistic graphical models in BIF format
8. **KIF** - Knowledge Interchange Format for AI and knowledge-based systems
9. **Full Blob** - Complete serialization of UltraLink data for backup and transfer

## System-Specific Output Organization

All rendering outputs are organized by system and format in the `output/` directory:

```
output/
├── systems/
│   ├── desert-ecosystem/
│   │   ├── DesertEcosystem.json
│   │   ├── DesertEcosystem.graphml
│   │   ├── csv/
│   │   │   ├── entities.csv
│   │   │   └── relationships.csv
│   │   ├── obsidian/
│   │   │   ├── saguaro.md
│   │   │   ├── kangaroo-rat.md
│   │   │   └── ...
│   │   ├── bayesian/
│   │   │   ├── DesertEcosystem-bayesian.json
│   │   │   └── DesertEcosystem.bif
│   │   ├── kif/
│   │   │   └── DesertEcosystem.kif
│   │   ├── visualization/
│   │   │   ├── graph.svg
│   │   │   ├── graph.png
│   │   │   ├── graph.d3
│   │   │   └── graph.cytoscape
│   │   ├── website/
│   │   │   ├── index.html
│   │   │   ├── saguaro.html
│   │   │   └── ...
│   │   └── full-blob/
│   │       ├── DesertEcosystem-full.json
│   │       └── DesertEcosystem-full-compressed.blob
│   │
│   └── research-team/
│       ├── ResearchTeam.json
│       ├── ResearchTeam.graphml
│       ├── csv/
│       │   ├── entities.csv
│       │   └── relationships.csv
│       ├── obsidian/
│       │   ├── alice.md
│       │   ├── bob.md
│       │   └── ...
│       ├── bayesian/
│       │   ├── ResearchTeam-bayesian.json
│       │   └── ResearchTeam.bif
│       ├── kif/
│       │   └── ResearchTeam.kif
│       ├── visualization/
│       │   ├── graph.svg
│       │   ├── graph.png
│       │   ├── graph.d3
│       │   └── graph.cytoscape
│       ├── website/
│       │   ├── index.html
│       │   ├── alice.html
│       │   └── ...
│       └── full-blob/
│           ├── ResearchTeam-full.json
│           └── ResearchTeam-full-compressed.blob
```

## Cross-Rendering Capabilities

UltraLink's cross-rendering capabilities enable the transformation of the same knowledge graph into multiple formats, each highlighting different aspects of the knowledge:

| Format | Primary Focus | Best For | Knowledge Dimensions |
|--------|--------------|----------|---------------------|
| JSON | Complete data serialization | API integration, programmatic access | Semantic, Vector, Temporal |
| GraphML | Graph structure | Network analysis tools, visualization | Semantic, Structural |
| CSV | Tabular data | Spreadsheet analysis, data import/export | Semantic |
| Obsidian | Human-readable documents | Knowledge management, note-taking | Semantic, Linked |
| HTML Website | Interactive exploration | Sharing, presentation, exploration | Semantic, Visual, Interactive |
| Visualization | Visual representation | Presentations, diagrams, embedding in other media | Visual, Structural |
| Bayesian Network | Probabilistic relationships | Causal inference, probability analysis | Semantic, Probabilistic |
| KIF | Formal logic | Automated reasoning, AI systems | Semantic, Logical |
| Full Blob | Complete system state | Backup, system transfer | All dimensions |

### Transformation Examples

How entity attributes are transformed across formats:

| UltraLink Entity | JSON | GraphML | Obsidian | KIF | HTML |
|------------------|------|---------|----------|-----|------|
| `id: "saguaro"` | `"id": "saguaro"` | `<node id="saguaro">` | Filename: `saguaro.md` | `saguaro` as term | `<div id="saguaro">` |
| `type: "organism"` | `"type": "organism"` | `<data key="type">organism</data>` | Front matter: `type: organism` | `(instance saguaro Organism)` | Class: `"entity organism"` |
| `name: "Saguaro Cactus"` | `"name": "Saguaro Cactus"` | `<data key="name">Saguaro Cactus</data>` | `# Saguaro Cactus` | `(name saguaro "Saguaro Cactus")` | `<h1>Saguaro Cactus</h1>` |

How relationships are transformed:

| UltraLink Relationship | JSON | GraphML | Obsidian | KIF | HTML |
|------------------------|------|---------|----------|-----|------|
| `source: "saguaro", target: "aridity", type: "adapts_to"` | JSON object with source, target, type | `<edge source="saguaro" target="aridity">` | Wiki-link: `[[aridity\|Aridity]]` | `(adapts-to saguaro aridity)` | Hyperlink: `<a href="aridity.html">` |
| Relationship attribute: `efficiency: 0.95` | `"efficiency": 0.95` | `<data key="efficiency">0.95</data>` | Markdown text | `(= (adaptationEfficiency saguaro aridity) 0.95)` | HTML element |

## JSON Format

The JSON format provides a complete representation of the UltraLink data in a widely-supported format.

### Usage

```javascript
// Export to JSON object
const json = ultralink.toJSON();

// Export with options
const jsonWithVectors = ultralink.toJSON({
  includeVectors: true,
  includeHistory: true
});

// Convert to string for storage
const jsonString = JSON.stringify(json, null, 2);
```

### Output Structure

```json
{
  "entities": [
    {
      "id": "saguaro",
      "type": "organism",
      "attributes": {
        "name": "Saguaro Cactus",
        "scientificName": "Carnegiea gigantea",
        "height": "15-50 feet",
        "lifespan": "150-200 years"
      },
      "metadata": {
        "created": "2023-06-15T10:30:00Z",
        "modified": "2023-06-15T10:30:00Z"
      },
      "vector": [0.1, 0.2, 0.3, ...] // When includeVectors is true
    },
    // More entities...
  ],
  "relationships": [
    {
      "source": "saguaro",
      "target": "aridity",
      "type": "adapts_to",
      "attributes": {
        "mechanism": "Water storage in stem",
        "efficiency": 0.95
      },
      "metadata": {
        "created": "2023-06-15T10:30:00Z",
        "modified": "2023-06-15T10:30:00Z"
      }
    },
    // More relationships...
  ]
}
```

## GraphML Format

GraphML is an XML-based format for graphs, widely supported by graph visualization tools like Gephi and Cytoscape.

### Usage

```javascript
// Export to GraphML
const graphml = ultralink.toGraphML();

// Export with all attributes
const detailedGraphML = ultralink.toGraphML({
  includeAllAttributes: true
});
```

### Output Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
     http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <key id="name" for="node" attr.name="name" attr.type="string"/>
  <key id="type" for="node" attr.name="type" attr.type="string"/>
  <key id="scientificName" for="node" attr.name="scientificName" attr.type="string"/>
  <key id="height" for="node" attr.name="height" attr.type="string"/>
  <key id="lifespan" for="node" attr.name="lifespan" attr.type="string"/>
  <key id="type" for="edge" attr.name="type" attr.type="string"/>
  <key id="mechanism" for="edge" attr.name="mechanism" attr.type="string"/>
  <key id="efficiency" for="edge" attr.name="efficiency" attr.type="double"/>
  <graph id="G" edgedefault="directed">
    <node id="saguaro">
      <data key="type">organism</data>
      <data key="name">Saguaro Cactus</data>
      <data key="scientificName">Carnegiea gigantea</data>
      <data key="height">15-50 feet</data>
      <data key="lifespan">150-200 years</data>
    </node>
    <!-- More nodes... -->
    <edge source="saguaro" target="aridity">
      <data key="type">adapts_to</data>
      <data key="mechanism">Water storage in stem</data>
      <data key="efficiency">0.95</data>
    </edge>
    <!-- More edges... -->
  </graph>
</graphml>
```

## CSV Format

CSV (Comma-Separated Values) is a simple tabular format that can be opened in spreadsheet applications and imported into databases.

### Usage

```javascript
// Export to CSV
const csv = ultralink.toCSV();

// Export with metadata
const csvWithMetadata = ultralink.toCSV({
  includeMetadata: true
});
```

### Output Structure

UltraLink exports two CSV files:

#### Entities CSV

```csv
id,type,name,scientificName,height,lifespan,description,annualRainfall
saguaro,organism,Saguaro Cactus,Carnegiea gigantea,15-50 feet,150-200 years,,
kangaroo-rat,organism,Kangaroo Rat,Dipodomys,,,nocturnal desert rodent,
aridity,environmental_factor,Aridity,,,,"Extremely dry conditions with minimal rainfall",3-15 inches
```

#### Relationships CSV

```csv
source,target,type,mechanism,efficiency
saguaro,aridity,adapts_to,Water storage in stem,0.95
kangaroo-rat,aridity,adapts_to,Metabolic water production,0.88
```

## Obsidian Format

Obsidian export creates a set of Markdown files with wiki-links, suitable for import into Obsidian or other knowledge management tools.

### Usage

```javascript
// Export to Obsidian
const obsidian = ultralink.toObsidian();

// Export with backlinks
const obsidianWithBacklinks = ultralink.toObsidian({
  backlinks: true,
  includeMetadata: true,
  includeAttributes: true,
  includeRelationships: true
});
```

### Output Structure

Each entity becomes a Markdown file with frontmatter, attributes, and relationships:

```markdown
---
type: organism
id: saguaro
---

# Saguaro Cactus

**Type**: organism
**ID**: saguaro

## Attributes

- **scientificName**: Carnegiea gigantea
- **height**: 15-50 feet
- **lifespan**: 150-200 years

## Relationships

### adapts_to

- [[aridity|Aridity]] (mechanism: Water storage in stem, efficiency: 0.95)

## Backlinks

- [[kangaroo-rat|Kangaroo Rat]] (shares_habitat)
```

## Visualization Format

UltraLink can generate various visualization formats directly, enabling immediate visual representation of the knowledge graph.

### Usage

```javascript
// Export to visualization formats
const visualizations = ultralink.toVisualization({
  format: 'svg', // Options: 'svg', 'png', 'd3', 'cytoscape'
  layout: 'force-directed', // Layout algorithm
  style: 'default' // Visual styling
});
```

### Output Structure

UltraLink supports these visualization formats:

#### SVG Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <style>
        .node { fill: #69b3a2; }
        .link { stroke: #999; stroke-opacity: 0.6; }
        text { font-family: sans-serif; font-size: 10px; }
    </style>
    <g class="links">
        <line class="link" x1="0" y1="0" x2="100" y2="100"/>
    </g>
    <g class="nodes">
        <circle class="node" cx="100" cy="100" r="5">
            <title>saguaro</title>
        </circle>
    </g>
</svg>
```

#### D3.js Format

```javascript
// D3.js visualization code
const width = 800;
const height = 600;

const svg = d3.select('#graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const data = {
    entities: [...],
    relationships: [...]
};

// Force simulation setup and rendering code
const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

// Node and link rendering
// ...
```

#### Cytoscape.js Format

```javascript
// Cytoscape.js visualization code
const cy = cytoscape({
    container: document.getElementById('graph'),
    elements: {
        nodes: [...],
        edges: [...]
    },
    style: [
        {
            selector: 'node',
            style: {
                'background-color': '#69b3a2',
                'label': 'data(id)'
            }
        },
        // More styles...
    ],
    layout: {
        name: 'force-directed',
        animate: true
    }
});
```

## Bayesian Network Format

The Bayesian Network format exports UltraLink data as a probabilistic graphical model, suitable for causal inference and reasoning under uncertainty.

### Usage

```javascript
// Export to Bayesian Network
const bayesianNetwork = ultralink.toBayesianNetwork();

// Export with specific options
const customBayesianNetwork = ultralink.toBayesianNetwork({
  outputFormat: 'bif',  // Options: 'json', 'bif' (Bayesian Interchange Format)
  includeParameters: true,
  nodeTypeMapping: {
    'person': 'discrete',
    'event': 'discrete'
  }
});
```

### Output Structure

UltraLink exports Bayesian networks in two formats:

#### JSON Format

```json
{
  "nodes": {
    "saguaro": {
      "id": "saguaro",
      "type": "organism",
      "states": ["true", "false"],
      "cpt": {
        "true": 0.5,
        "false": 0.5
      },
      "parents": [],
      "children": ["ecosystem_health"]
    },
    "ecosystem_health": {
      "id": "ecosystem_health",
      "type": "concept",
      "states": ["good", "fair", "poor"],
      "cpt": {
        "saguaro=true": {
          "good": 0.7,
          "fair": 0.2,
          "poor": 0.1
        },
        "saguaro=false": {
          "good": 0.1,
          "fair": 0.3,
          "poor": 0.6
        }
      },
      "parents": ["saguaro"],
      "children": []
    }
  }
}
```

#### BIF Format (Bayesian Interchange Format)

```xml
<?xml version="1.0"?>
<BIF VERSION="0.3">
<NETWORK>
<NAME>Desert Ecosystem</NAME>

<VARIABLE TYPE="discrete">
    <NAME>saguaro</NAME>
    <OUTCOME>true</OUTCOME>
    <OUTCOME>false</OUTCOME>
</VARIABLE>

<VARIABLE TYPE="discrete">
    <NAME>ecosystem_health</NAME>
    <OUTCOME>good</OUTCOME>
    <OUTCOME>fair</OUTCOME>
    <OUTCOME>poor</OUTCOME>
</VARIABLE>

<DEFINITION>
    <FOR>saguaro</FOR>
    <TABLE>0.5 0.5</TABLE>
</DEFINITION>

<DEFINITION>
    <FOR>ecosystem_health</FOR>
    <GIVEN>saguaro</GIVEN>
    <TABLE>0.7 0.2 0.1 0.1 0.3 0.6</TABLE>
</DEFINITION>

</NETWORK>
</BIF>
```

## KIF Format

The Knowledge Interchange Format (KIF) exports UltraLink data as a formal logical representation, ideal for AI systems, knowledge bases, and automated reasoning.

### Usage

```javascript
// Export to KIF format
const kif = ultralink.toKIF();

// Export with specific options
const customKIF = ultralink.toKIF({
  includeMetaKnowledge: true,
  includeFunctions: true,
  includeRules: true,
  prettyPrint: true
});
```

### Output Structure

KIF exports represent entities, attributes, and relationships in a logical notation:

```lisp
;; UltraLink Knowledge Interchange Format (KIF) Export
;; Generated: 2023-06-15T10:30:00Z

;; Entities and their attributes
(instance saguaro Organism)
(scientificName saguaro "Carnegiea gigantea")
(height saguaro "15-50 feet")
(lifespan saguaro "150-200 years")

(instance kangaroo-rat Organism)
(scientificName kangaroo-rat "Dipodomys")

(instance aridity EnvironmentalFactor)
(description aridity "Extremely dry conditions with minimal rainfall")
(annualRainfall aridity "3-15 inches")

;; Relationships
(adapts-to saguaro aridity)
(= (adaptationMechanism saguaro aridity) "Water storage in stem")
(= (adaptationEfficiency saguaro aridity) 0.95)

(adapts-to kangaroo-rat aridity)
(= (adaptationMechanism kangaroo-rat aridity) "Metabolic water production")
(= (adaptationEfficiency kangaroo-rat aridity) 0.88)

;; Rules
(forall (?x ?y)
  (=> (and (instance ?x Organism) 
           (instance ?y EnvironmentalFactor)
           (adapts-to ?x ?y)
           (> (adaptationEfficiency ?x ?y) 0.9))
      (well-adapted ?x ?y)))

(defrule entity-relationship-rule
  (entity ?id ?type)
  (relationship ?src ?dest ?type)
  =>
  (assert (connected ?src ?dest)))

;; Functions
(deffunction relationshipCount (?x)
  (length (getRelationships ?x)))

;; Meta-knowledge
(= (creationDate UltraLinkExport) "2023-06-15T10:30:00Z")
(= (entityCount UltraLinkExport) 10)
(= (relationshipCount UltraLinkExport) 15)
```

## HTML Website Format

The HTML Website export creates a self-contained interactive website for exploring the UltraLink data.

### Usage

```javascript
// Export to HTML Website
const htmlWebsite = ultralink.toHTMLWebsite({
  title: 'Desert Ecosystem',
  description: 'Interactive visualization of desert ecosystem relationships',
  theme: 'academic' // Options: 'default', 'dark', 'light', 'academic', 'ocean'
});
```

### Output Structure

The HTML Website export creates multiple HTML files:

- `index.html` - Main page with interactive visualization
- Entity pages (e.g., `saguaro.html`, `kangaroo-rat.html`) - Detail pages for each entity

Features include:

- Interactive D3.js visualization of the entity network
- Entity list with search and filtering
- Detailed entity pages with attributes and relationships
- Responsive design for desktop and mobile
- Multiple theme options

## Full Blob Format

The Full Blob format provides a complete serialization of UltraLink data for backup, transfer, and persistence.

### Usage

```javascript
// Export to Full Blob
const blob = ultralink.toFullBlob();

// Export with compression
const compressedBlob = ultralink.toFullBlob({
  compress: true,
  includeVectors: true,
  includeHistory: true
});

// Import from Full Blob
ultralink.fromFullBlob(blob);

// Import from compressed Full Blob
ultralink.fromFullBlob(compressedBlob, {
  compressed: true
});
```

### Output Structure

The Full Blob format includes all entity and relationship data, including optional vectors and history:

```json
{
  "entities": [
    {
      "id": "saguaro",
      "type": "organism",
      "attributes": { ... },
      "metadata": { ... },
      "vector": [0.1, 0.2, 0.3, ...],
      "history": [ ... ]
    },
    // More entities...
  ],
  "relationships": [
    {
      "source": "saguaro",
      "target": "aridity",
      "type": "adapts_to",
      "attributes": { ... },
      "metadata": { ... },
      "history": [ ... ]
    },
    // More relationships...
  ]
}
```

## Integrating Multiple Formats

UltraLink's rendering capabilities can be combined to create rich, multi-format knowledge representations:

```javascript
// Export the same knowledge graph to multiple formats
async function exportKnowledgeGraph(ultralink, outputPath) {
  // Create output directory
  fs.mkdirSync(outputPath, { recursive: true });
  
  // Export to multiple formats
  const json = ultralink.toJSON({ includeVectors: true });
  fs.writeFileSync(`${outputPath}/graph.json`, JSON.stringify(json, null, 2));
  
  const graphml = ultralink.toGraphML({ includeAllAttributes: true });
  fs.writeFileSync(`${outputPath}/graph.graphml`, graphml);
  
  const csvFiles = ultralink.toCSV();
  fs.mkdirSync(`${outputPath}/csv`, { recursive: true });
  fs.writeFileSync(`${outputPath}/csv/entities.csv`, csvFiles.entities);
  fs.writeFileSync(`${outputPath}/csv/relationships.csv`, csvFiles.relationships);
  
  const obsidianFiles = ultralink.toObsidian({ backlinks: true });
  fs.mkdirSync(`${outputPath}/obsidian`, { recursive: true });
  for (const [filename, content] of Object.entries(obsidianFiles)) {
    fs.writeFileSync(`${outputPath}/obsidian/${filename}`, content);
  }
  
  const kifOutput = ultralink.toKIF({ 
    includeMetaKnowledge: true,
    includeFunctions: true,
    includeRules: true
  });
  fs.writeFileSync(`${outputPath}/graph.kif`, kifOutput);
  
  const vizFiles = ultralink.toVisualization({ format: 'svg' });
  fs.mkdirSync(`${outputPath}/viz`, { recursive: true });
  for (const [filename, content] of Object.entries(vizFiles)) {
    fs.writeFileSync(`${outputPath}/viz/${filename}`, content);
  }
  
  // Generate HTML website
  const websiteFiles = ultralink.toHTMLWebsite({
    title: 'Knowledge Graph Explorer',
    description: 'Interactive exploration of our knowledge graph'
  });
  fs.mkdirSync(`${outputPath}/website`, { recursive: true });
  for (const [filename, content] of Object.entries(websiteFiles)) {
    fs.writeFileSync(`${outputPath}/website/${filename}`, content);
  }
}
```

## Extending UltraLink with Custom Formats

UltraLink can be extended to support additional rendering formats:

```javascript
// Add a custom format renderer to UltraLink
UltraLink.prototype.toCustomFormat = function(options = {}) {
  // Implementation for custom format
  const { includeMetadata = true } = options;
  
  // Extract entities and relationships
  const entities = Array.from(this.entities.values());
  const relationships = [];
  
  for (const [sourceId, links] of this.links.entries()) {
    for (const [targetId, link] of links.entries()) {
      relationships.push({
        source: sourceId,
        target: link.target,
        type: link.type,
        attributes: link.attributes || {}
      });
    }
  }
  
  // Generate custom format
  return {
    // Your custom format implementation
  };
};
```

## Conclusion

UltraLink's multiple export formats provide flexibility for different use cases, from data analysis to knowledge management to interactive visualization and advanced reasoning. Each format is optimized for its intended purpose, and all formats maintain the rich relationships and attributes of the UltraLink data model.

By supporting this extensive range of rendering targets, UltraLink truly fulfills its role as a comprehensive knowledge representation system, adaptable to a wide variety of applications and use cases - from academic research and scientific exploration to business intelligence and AI system development. 