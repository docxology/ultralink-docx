# UltraLink Rendering Targets

UltraLink supports multiple export formats for different use cases. This document provides details on each format, its purpose, and how to use it.

## Overview

UltraLink can export data to the following formats:

1. **JSON** - Universal data exchange format
2. **GraphML** - XML-based graph format for visualization tools
3. **CSV** - Tabular format for spreadsheet analysis
4. **Obsidian** - Markdown files with wiki-links for knowledge management
5. **HTML Website** - Self-contained interactive website for sharing and exploration
6. **Full Blob** - Complete serialization of UltraLink data for backup and transfer

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
│       ├── website/
│       │   ├── index.html
│       │   ├── alice.html
│       │   └── ...
│       └── full-blob/
│           ├── ResearchTeam-full.json
│           └── ResearchTeam-full-compressed.blob
```

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
      }
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

## Conclusion

UltraLink's multiple export formats provide flexibility for different use cases, from data analysis to knowledge management to interactive visualization. Each format is optimized for its intended purpose, and all formats maintain the rich relationships and attributes of the UltraLink data model. 