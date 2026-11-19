# UltraLink API Reference

Use this index to find examples for the API shipped in the source checkout.
Start with the [first graph walkthrough](../README.md#getting-started), then use
the [API Usage Guide](../API_USAGE.md) for method names and examples.

## API Structure

- [Core API](#core-api) — create, link, and query entities.
- [Export API](#export-api) — get graph data in supported formats.
- [Design notes](#design-notes) — proposed interfaces, not part of the shipped API.

## Core API

- [Creating Entities](../API_USAGE.md#creating-entities) — add entities with
  `addEntity(id, type, attributes)`, then retrieve, update, or delete them.
- [Managing Relationships](../API_USAGE.md#managing-relationships) — connect
  existing entities with `addLink` or `addRelationship`.
- [Querying the Knowledge Graph](../API_USAGE.md#querying-the-knowledge-graph) —
  find entities and relationships or retrieve backlinks.

## Export API

- [Exporting Data](../API_USAGE.md#exporting-data) — call export methods such as
  `toJSON()`, `toCSV()`, and `toGraphML()` on a populated graph.
- [Export Formats](../EXPORT_FORMATS.md) — compare the available formats.

## Configuration Options

Pass `{ allowOverwrite: true }` to `new UltraLink(...)` to let `addEntity`
replace an existing entity with the same ID. Set `defaultRelationshipType` to
choose the type used when `addLink` or `addRelationship` is called without one.

The `preventOverwrite` and `timestampEntities` keys shown in the API Usage
Guide do not control entity creation. Newly added entities always receive
`metadata.created` and `metadata.modified` timestamps.

## Design Notes

- [Temporal API design (not shipped)](./temporal-api.md) describes proposed
  graph methods for snapshots and history. Its examples are not runnable against
  this checkout.
- The standalone vector operations, LLM integration, and plugin/extension
  APIs described in older documentation are designs, not shipped `UltraLink`
  interfaces. The checkout does not ship TypeScript declarations.