# Prepare graph data for a model application

Use `toJSON()` to serialize the graph. An application can parse the JSON,
select relevant entities and relationships, and retain only the fields
needed for its downstream context.

Keep original entity IDs when trimming context. Treat any returned graph
updates as proposals and validate their IDs, relationship endpoints and
types before applying them to a working graph.

The [verified walkthrough](../getting-started/quick-start.md) gives
an executable local graph example. [Vector export](vector-embeddings.md)
shows how to include vectors supplied by a separate application.
