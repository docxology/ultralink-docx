# UltraLink Tutorials

Start with a short written walkthrough, then use the examples and format references
below to build on your first graph.

## Getting Started

- [Build your first graph](../README.md#getting-started). Set up a source checkout,
  then run a self-contained Node.js example that creates two entities, connects
  them with a `works_on` relationship, and prints JSON. No API keys or sample data
  are required.

## Core Concepts

- [Relationship direction](../concepts/core-concepts.md#relationship-direction) —
  understand why a link from one entity to another is not a link in both directions.
- [Creating entities](../API_USAGE.md#creating-entities) — use the guide's setup
  block to add, retrieve, and update entities.

## Format-Specific Tutorials

- [Exporting data](../API_USAGE.md#exporting-data) — call the export methods on a
  populated graph. Start with JSON for structured data or CSV for separate
  entity and relationship tables.
- [GraphML reference](../formats/GRAPHML_FORMAT.md#data-model-mapping) — see how
  entities and relationships map to XML nodes and edges.
- [Obsidian reference](../formats/OBSIDIAN_FORMAT.md#data-model-mapping) — see
  how entities and relationships map to Markdown notes and wiki-links.

## Advanced Topics

The older vector, LLM, and plugin walkthroughs describe extension interfaces
that are not shipped. See the [API design notes](../api/README.md#design-notes)
for the distinction between proposed interfaces and the shipped API.

## Integration Tutorials

For file-based workflows, see the [CSV layout](../formats/CSV_FORMAT.md#data-model-mapping)
for the entity and relationship tables you can take into a spreadsheet or data
analysis tool. Dedicated Neo4j, Python, and React tutorials are not published here.

## Applied Examples

- [Research team](../examples/research-team.md#overview) — model team members,
  projects, expertise, and collaborations.
- [Desert ecosystem](../examples/desert-ecosystem.md#overview) — model organisms,
  environmental factors, and their relationships.

These sections are written modeling examples, not setup or run instructions.

## Video Tutorials

No tutorial videos are published here. Use the [written first-graph walkthrough](#getting-started)
or the [written export material](#format-specific-tutorials) instead.

## Workshop Materials

The knowledge graph and data visualization workshops are not published.

## Tutorial Series: Building a Complete Knowledge Management System

The complete knowledge management series is not published. The
[historical development roadmap](../contributing/roadmap.md#developer-experience-ongoing)
lists interactive tutorials and example applications as proposals, not available
lessons or current release commitments.

## Contributing Tutorials

See the [documentation contribution guidelines](../../CONTRIBUTING.md#documentation)
to improve an existing walkthrough or contribute a new one.