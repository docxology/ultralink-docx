# UltraLink Export Format Testing

This document provides a comprehensive overview of UltraLink's export format testing, including how each format is tested, potential pitfalls, and best practices.

## Overview

UltraLink supports various export formats to enable seamless integration with different tools and workflows. Each format is rigorously tested to ensure:

1. **Correctness**: Exported data accurately represents the UltraLink data model
2. **Completeness**: All entities, relationships, and attributes are included
3. **Format Compliance**: Output adheres to format specifications
4. **Roundtrip Fidelity**: Data can be exported and re-imported with no loss

## Supported Export Formats

UltraLink supports the following export formats, each with specific test coverage:

| Format | Method | Description | Test Files |
|--------|--------|-------------|------------|
| JSON | `toJSON()` | Standard JSON representation | `tests/unit/ultralink.test.js`, `tests/unit/data-export.test.js`, `tests/integration/export-formats.test.js` |
| GraphML | `toGraphML()` | Network graph XML format | `tests/unit/ultralink.test.js`, `tests/integration/export-formats.test.js` |
| CSV | `toCSV()` | Comma-separated values | `tests/unit/ultralink.test.js`, `tests/integration/export-formats.test.js` |
| Full Blob | `toFullBlob()` | Complete serialization format | `tests/unit/ultralink.test.js`, `tests/integration/export-formats.test.js` |
| Obsidian | `toObsidian()` | Markdown for Obsidian | `tests/integration/export-formats.test.js` |
| HTML Website | `toHTMLWebsite()` | Interactive HTML/JS visualization | `tests/integration/export-formats.test.js` |

## Testing Architecture

UltraLink employs a multi-layered approach to testing export formats:

### Unit Tests

Unit tests verify that individual export methods work correctly for simple data models. These tests focus on:

- Basic entity and relationship export
- Format-specific features (e.g., pretty-printing for JSON)
- Error handling
- Special cases (e.g., including vectors)

### Integration Tests

Integration tests use more complex data models to verify that exports work correctly for realistic scenarios. These tests focus on:

- Complete data model export
- Cross-format consistency
- Round-trip import/export
- Domain-specific validation

### System Export Tests

System export tests use complete "systems of interest" models to verify exports across all formats:

- Desert Ecosystem model
- Research Team model
- Domain-specific validation

## Full Blob Format

The Full Blob format deserves special attention as it's the most comprehensive export format in UltraLink, designed for complete data serialization.

### Format Overview

The Full Blob format serializes an entire UltraLink instance to a JSON string. It can be exported in two modes:

1. **Uncompressed**: Standard JSON string
2. **Compressed**: Base64-encoded string

### Implementation Details

The `toFullBlob()` method handles the export logic:

```javascript
toFullBlob(options = {}) {
  const { 
    compress = false, 
    includeVectors = false,
    includeHistory = false
  } = options;
  
  // Get JSON string directly from toJSON
  const jsonString = this.toJSON({ includeVectors, includeHistory });
  
  // Handle compression
  if (compress) {
    // Compress the JSON string
    return Buffer.from(jsonString).toString('base64');
  }
  
  // Return uncompressed JSON string
  return jsonString;
}
```

And the `fromFullBlob()` method handles import:

```javascript
fromFullBlob(blob, options = {}) {
  const { compressed = false, clearExisting = true } = options;
  
  // Handle compressed data
  let data = blob;
  if (compressed) {
    try {
      // Decompress from base64
      const decompressed = Buffer.from(blob, 'base64').toString();
      data = JSON.parse(decompressed);
    } catch (error) {
      console.error('Error decompressing blob:', error);
      throw new Error('Failed to decompress data blob');
    }
  } else if (typeof blob === 'string') {
    // If it's a string but not compressed, parse it as JSON
    try {
      data = JSON.parse(blob);
    } catch (error) {
      console.error('Error parsing blob JSON:', error);
      throw new Error('Failed to parse data blob as JSON');
    }
  }
  
  // Import the data...
}
```

### Critical Testing Considerations

When testing the Full Blob format, several important aspects need to be verified:

1. **String Return Value**: The `toJSON` method returns a JSON string, which `toFullBlob` uses directly.
2. **Compression Parameter**: When exporting, the `compress` option controls whether the output is Base64-encoded.
3. **Import Parameter**: When importing, the `compressed` option is **required** when handling compressed data.

### Common Pitfalls

The most common pitfall when working with the Full Blob format is the mismatch between export and import parameters:

```javascript
// Export with compression
const compressedBlob = ultralink.toFullBlob({ compress: true });

// ❌ INCORRECT: Missing compressed parameter
newUltralink.fromFullBlob(compressedBlob);

// ✅ CORRECT: Specify compressed: true when importing compressed data
newUltralink.fromFullBlob(compressedBlob, { compressed: true });
```

### Test Coverage

The Full Blob export format is tested in the following files:

- `tests/unit/ultralink.test.js`: Basic unit tests
- `tests/integration/export-formats.test.js`: Integration tests with complex data models

Both uncompressed and compressed modes are explicitly tested to ensure correct functionality.

## JSON Export

The standard JSON export format represents the most common way to export UltraLink data for general use.

### Format Overview

The JSON export provides a clean, structured representation of UltraLink data:

```json
{
  "entities": [
    {
      "id": "entity1",
      "type": "person",
      "attributes": { "name": "John Doe", "age": 30 }
    }
  ],
  "relationships": [
    {
      "source": "entity1",
      "target": "entity2",
      "type": "knows",
      "attributes": { "since": "2020" }
    }
  ]
}
```

### Implementation Details

The `toJSON()` method handles the export logic:

```javascript
toJSON(options = {}) {
  const { pretty = false, includeVectors = false, includeHistory = false } = options;
  
  // Prepare entities and relationships...
  
  // Always return a JSON string - pretty parameter controls formatting
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}
```

### Critical Testing Considerations

When testing JSON export, verify:

1. **String Return Value**: The method returns a JSON string, not an object
2. **Test Parse-Then-Access**: Always parse the string before accessing properties
3. **Format Options**: Test both standard and pretty-printed formats
4. **Special Content**: Test with vectors and history when those options are enabled

### Test Coverage

JSON export is tested in:

- `tests/unit/ultralink.test.js`: Basic unit tests
- `tests/unit/data-export.test.js`: Format-specific tests
- `tests/integration/export-formats.test.js`: Integration tests

## Best Practices

When writing tests for export formats, follow these best practices:

1. **Always Parse JSON Strings**: Never assume the return value is an object; parse JSON strings before accessing properties.
2. **Verify Output Type**: Check that the output is of the expected type (string, object, etc.).
3. **Check Content Before Format**: Verify the presence of expected content before testing format specifics.
4. **Test Round-Trip**: Import exported data and verify it matches the original.
5. **Match Parameters**: Ensure import parameters match export parameters (e.g., `compressed: true` when importing compressed data).
6. **Handle Vectors Correctly**: When testing vector data, account for potential precision differences in float values.

## Troubleshooting Common Issues

### Compressed Full Blob Import Failing

**Symptom**: Importing a compressed Full Blob fails with a parsing error.

**Solution**: Ensure the `compressed: true` option is provided when importing a compressed blob:

```javascript
// Correct way to import a compressed blob
newUltralink.fromFullBlob(compressedBlob, { compressed: true });
```

### JSON Parse Errors

**Symptom**: Tests fail with JSON parse errors.

**Solution**: Verify that you're treating the return value as a string and parsing it:

```javascript
// Incorrect
const json = ultralink.toJSON();
expect(json.entities).toBeDefined(); // ❌ Error: json is a string, not an object

// Correct
const jsonString = ultralink.toJSON();
const json = JSON.parse(jsonString);
expect(json.entities).toBeDefined(); // ✅ Correct
```

### Vector Export Comparison Failures

**Symptom**: Vector equality tests fail due to floating-point precision.

**Solution**: Use approximate comparison with tolerance:

```javascript
// Vector comparison with tolerance
const exportedVector = exportedEntity.vector;
expect(Math.abs(exportedVector[0] - 0.1)).toBeLessThan(0.0001);
expect(Math.abs(exportedVector[1] - 0.2)).toBeLessThan(0.0001);
```

## Recent Updates

### March 2025 - Compressed Full Blob Testing Fix

Recent updates fixed an issue with the compressed Full Blob tests in `tests/integration/export-formats.test.js`. The issue was related to missing the `compressed: true` parameter when importing compressed blob data:

```javascript
// Previous buggy code
const compressedBlob = ultralink.toFullBlob({ compress: true });
newUltralink.fromFullBlob(compressedBlob); // Missing compressed parameter

// Fixed code
const compressedBlob = ultralink.toFullBlob({ compress: true });
newUltralink.fromFullBlob(compressedBlob, { compressed: true }); // Added compressed parameter
```

This fix ensures that the compressed blob is correctly decoded from base64 before being parsed as JSON. 