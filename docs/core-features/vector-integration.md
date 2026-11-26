# Vector data in exports

UltraLink can carry application-provided vector metadata in a graph.
Store ordinary metadata in the entity's `attributes` and use the
entity's dedicated `vector` field for an optional raw vector.

`toJSON({ includeVectors: true })` includes raw vectors in exported
entity records. The JSON exporter converts a typed array in the dedicated
field to a plain array. Nested application metadata such as
`attributes.vector` remains an ordinary attribute.

Use the [local vector example](../tutorials/vector-embeddings.md) to
check the distinction against an installed checkout. The application
supplies any embeddings and similarity model.
