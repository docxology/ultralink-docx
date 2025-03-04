# UltraLink Test Suite

This document describes the comprehensive test suite for UltraLink, focusing on the Systems of Interest testing framework.

## Overview

The UltraLink test suite includes various types of tests:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test complete workflows
- **Systems Tests**: Test with realistic data models representing different domains

This document focuses on the Systems Tests, which use complete data models to verify UltraLink's capabilities across different domains.

## Systems of Interest

The Systems of Interest testing framework provides a structured way to test UltraLink with realistic data models from different domains. Each system represents a distinct use case and helps verify that UltraLink can correctly model, render, and analyze diverse types of relational data.

### Available Systems

The test suite currently includes the following systems:

1. **Desert Ecosystem**: A model of a desert ecosystem with animals, plants, abiotic factors, and their relationships
2. **Research Team**: A model of an academic research team with members, projects, publications, and knowledge domains

### Directory Structure

Systems are organized in the following directory structure:

```
tests/
├── fixtures/
│   ├── Systems/
│   │   ├── DesertEcosystem/
│   │   │   └── desert-ecosystem.js
│   │   ├── ResearchTeam/
│   │   │   └── research-team.js
│   │   └── README.md
│   └── ...
├── runners/
│   ├── all-systems-render-test.js
│   ├── output-validator.js
│   └── ...
└── ...
```

Each system is contained in its own directory under `tests/fixtures/Systems/` and includes a JavaScript module that exports functions to create instances of the system.

## Running the Tests

To run tests for all systems:

```bash
npm run test:systems
```

This command will:

1. Discover all systems in the `tests/fixtures/Systems/` directory
2. Create instances of each system
3. Render each system in all supported formats (JSON, GraphML, CSV, Obsidian)
4. Validate the outputs to ensure they meet the expected format
5. Generate a comprehensive report of the results

### Test Output

Test outputs are saved to the following locations:

- **Rendered Files**: `output/systems/<SystemName>/`
- **Log Files**: `logs/systems/`
- **Test Report**: `output/systems/all-systems-test-report.json`

## Adding New Systems

To add a new System of Interest to the test suite:

1. Create a new directory under `tests/fixtures/Systems/` with a descriptive name
2. Create a JavaScript module that exports:
   - A function `createXXXDataset()` that returns a populated UltraLink instance
   - Optionally, a function `createXXXSubset(subset)` that returns a subset of the data

Example structure for a new system:

```javascript
/**
 * YourSystem Test Fixtures
 * 
 * Description of what this system models...
 */

const { UltraLink } = require('../../../../src');

/**
 * Create a complete YourSystem dataset
 * @returns {UltraLink} Populated UltraLink instance
 */
function createYourSystemDataset() {
  const ultralink = new UltraLink();
  
  // Create entities
  ultralink.createEntity('type1', 'entity1', { /* attributes */ });
  ultralink.createEntity('type2', 'entity2', { /* attributes */ });
  
  // Create relationships
  ultralink.createLink('entity1', 'entity2', 'relationship_type');
  
  return ultralink;
}

module.exports = {
  createYourSystemDataset
};
```

3. Update the `createSystem()` function in `tests/runners/all-systems-render-test.js` to include your new system:

```javascript
async function createSystem(systemName) {
  switch(systemName) {
    case 'DesertEcosystem':
      return createDesertEcosystemDataset();
    case 'ResearchTeam':
      return createResearchTeamDataset();
    case 'YourSystem':
      return createYourSystemDataset();
    default:
      throw new Error(`Unknown system: ${systemName}`);
  }
}
```

## Validation

The test suite includes a comprehensive validation system that checks the integrity and correctness of rendered outputs. The validator checks:

- **JSON Output**: Structure, entity and relationship format
- **GraphML Output**: XML structure, node and edge definitions
- **CSV Output**: Column structure, data integrity
- **Obsidian Output**: File structure, markdown format, links

## Extending the Test Suite

The Systems test framework can be extended in several ways:

1. **Add New Systems**: Create models for different domains
2. **Add New Formats**: Extend the renderer to support additional output formats
3. **Enhance Validation**: Add more detailed validation checks
4. **Add Performance Tests**: Measure performance with different system sizes

## Troubleshooting

If you encounter issues with the test suite:

- Check the log files in `logs/systems/` for detailed error information
- Verify that your system module follows the correct API usage
- Ensure that the `createSystem()` function in `all-systems-render-test.js` includes your system
- Check that your system uses the correct UltraLink API methods 