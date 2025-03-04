# System Tests

This directory contains system tests for UltraLink, which test the rendering of complete systems into various output formats.

## Overview

The system tests ensure that UltraLink can correctly render different types of knowledge graphs (systems) into all supported output formats. Each system is rendered into its own subfolder in the output directory.

## Systems Tested

The following systems are tested:

1. **Research Team** - A knowledge graph representing a research team, their projects, publications, and expertise.
2. **Desert Ecosystem** - A knowledge graph representing a desert ecosystem with species, habitats, and ecological relationships.
3. **Active Inference Lab** - A knowledge graph representing an active inference research lab, their projects, and experimental models.

## Output Formats

Each system is rendered into the following formats:

- **JSON** - Standard JSON representation of the knowledge graph
- **GraphML** - Network format for visualization in tools like Gephi
- **CSV** - Separate files for entities and relationships
- **Obsidian** - Markdown files for use in Obsidian
- **HTML Website** - Interactive web visualization with D3.js
- **Full Blob** - Complete serialization of the knowledge graph (raw and compressed)

## Running the Tests

To run the system tests:

```bash
npm run test:system
```

Or to run all tests including system tests:

```bash
npm test
```

## Output Directory Structure

All system test outputs are saved to the `output/systems/` directory with the following structure:

```
output/
  systems/
    ResearchTeam/
      json/
      graphml/
      csv/
      obsidian/
      html-website/
      full-blob/
    DesertEcosystem/
      json/
      graphml/
      csv/
      obsidian/
      html-website/
      full-blob/
    ActiveInferenceLab/
      json/
      graphml/
      csv/
      obsidian/
      html-website/
      full-blob/
```

## Validation

The tests include validation of the output files to ensure they:

1. Exist and have non-zero content
2. Contain the expected entities and relationships
3. Properly represent the source data structure

## Adding New Systems

To add a new system to test:

1. Create a dataset generator in `tests/fixtures/Systems/YourSystem/your-system.js`
2. Add the system to the `SYSTEMS` object in `tests/system/rendering.test.js`
3. Run the tests to verify that your system renders correctly 