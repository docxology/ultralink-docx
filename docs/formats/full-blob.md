# Full Blob Format

The UltraLink Full Blob format is a comprehensive serialization format designed for complete data preservation, backup, and transfer of UltraLink datasets.

## Overview

Full Blob provides a complete snapshot of an UltraLink dataset, including all entities, relationships, attributes, and metadata. Unlike other export formats that may focus on specific aspects or representations, Full Blob is designed to capture the entire state of an UltraLink instance, enabling perfect reconstruction.

## Use Cases

- **Data Backup**: Create complete backups of UltraLink datasets
- **State Persistence**: Save and restore application state
- **Data Migration**: Move data between different UltraLink instances
- **Versioning**: Track changes to datasets over time
- **Distribution**: Share complete datasets with collaborators

## Format Specification

The Full Blob format consists of a JSON structure with the following top-level properties:

```json
{
  "version": "0.1.0",
  "metadata": {
    "created": "2023-03-04T12:30:45.123Z",
    "description": "Optional dataset description",
    "author": "Optional author information"
  },
  "schema": {
    "entityTypes": [...],
    "relationshipTypes": [...]
  },
  "entities": [...],
  "relationships": [...],
  "vectors": {...}
}
```

### Version

The `version` field specifies the UltraLink Full Blob format version, allowing for backward compatibility as the format evolves.

### Metadata

The `metadata` object contains information about the blob itself:

- `created`: ISO timestamp of when the blob was created
- `description`: Optional description of the dataset
- `author`: Optional author information
- Additional custom metadata properties may be included

### Schema

The `schema` object defines the structure of the data:

- `entityTypes`: Array of entity type definitions
- `relationshipTypes`: Array of relationship type definitions

Example:

```json
"schema": {
  "entityTypes": [
    {
      "name": "person",
      "attributes": {
        "name": { "type": "string", "required": true },
        "age": { "type": "number" },
        "birthdate": { "type": "date" }
      }
    }
  ],
  "relationshipTypes": [
    {
      "name": "knows",
      "attributes": {
        "since": { "type": "date" },
        "strength": { "type": "number", "min": 0, "max": 1 }
      }
    }
  ]
}
```

### Entities

The `entities` array contains all entity objects with their complete data:

```json
"entities": [
  {
    "id": "person-1",
    "type": "person",
    "attributes": {
      "name": "Alice Johnson",
      "age": 32,
      "birthdate": "1991-05-15"
    },
    "metadata": {
      "created": "2023-02-10T08:15:30.000Z",
      "modified": "2023-03-01T14:22:10.000Z"
    }
  }
]
```

### Relationships

The `relationships` array contains all relationship objects:

```json
"relationships": [
  {
    "id": "rel-1",
    "source": "person-1",
    "target": "person-2",
    "type": "knows",
    "attributes": {
      "since": "2015-08-24",
      "strength": 0.85
    },
    "metadata": {
      "created": "2023-02-12T10:30:00.000Z"
    }
  }
]
```

### Vectors

The `vectors` object contains vector embeddings associated with entities:

```json
"vectors": {
  "person-1": [0.123, 0.456, 0.789, ...],
  "person-2": [0.321, 0.654, 0.987, ...]
}
```

## Compression

UltraLink supports both uncompressed and compressed Full Blob formats:

1. **Uncompressed**: Standard JSON format, human-readable
2. **Compressed**: Binary format using compression algorithms

Compressed blobs have the following advantages:
- Smaller file size (typically 70-90% reduction)
- Faster to transmit over networks
- More efficient storage

Use compression for production backups and large datasets. Use uncompressed for debugging and when human readability is important.

## Working with Full Blobs

### Exporting to Full Blob

```javascript
const { UltraLink } = require('ultralink');
const fs = require('fs');

// Create and populate an UltraLink instance
const ultralink = new UltraLink();
// ... add entities and relationships ...

// Export to uncompressed Full Blob
const fullBlob = ultralink.toFullBlob({ compress: false });
fs.writeFileSync('my-dataset.json', JSON.stringify(fullBlob, null, 2));

// Export to compressed Full Blob
const compressedBlob = ultralink.toFullBlob({ compress: true });
fs.writeFileSync('my-dataset.blob', compressedBlob);
```

### Importing from Full Blob

```javascript
const { UltraLink } = require('ultralink');
const fs = require('fs');

// Import from uncompressed Full Blob
const jsonData = fs.readFileSync('my-dataset.json', 'utf8');
const jsonBlob = JSON.parse(jsonData);
const ultralinkFromJson = UltraLink.fromFullBlob(jsonBlob);

// Import from compressed Full Blob
const compressedData = fs.readFileSync('my-dataset.blob');
const ultralinkFromCompressed = UltraLink.fromFullBlob(compressedData);
```

## Best Practices

1. **Regular Backups**: Create Full Blob backups at regular intervals
2. **Version Control**: Store Full Blobs in version control for change tracking
3. **Compression**: Use compression for production and large datasets
4. **Naming Convention**: Use descriptive filenames with timestamps
5. **Metadata**: Include detailed metadata for better organization
6. **Encryption**: Consider encrypting blobs containing sensitive data

## Security Considerations

Full Blobs contain complete data, which may include sensitive information. Consider:

- Encrypting Full Blobs containing sensitive data
- Implementing access controls for blob storage
- Sanitizing data before creating public blobs
- Validating blobs before importing from untrusted sources

## Performance Considerations

For large datasets:

- Use compressed blobs to reduce memory usage
- Consider incremental backups for frequently changing data
- Implement pagination or streaming for very large blobs
- Schedule blob operations during off-peak hours

## Related Resources

- [Full Blob API Reference](../api/full-blob.md)
- [Data Backup Strategy Guide](../guides/backup-strategy.md)
- [Performance Optimization](../advanced/performance.md) 