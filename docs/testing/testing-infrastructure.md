# UltraLink Testing Infrastructure

This document provides a comprehensive overview of the UltraLink testing infrastructure, including the architecture, components, and processes used to ensure code quality and correctness.

## Overview

UltraLink employs a multi-layered testing approach to ensure quality across different levels of the codebase:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test interactions between components
3. **System Export Tests**: Test all rendering formats using complete system models
4. **End-to-End Tests**: Test complete workflows from a user perspective
5. **Performance Tests**: Measure and validate performance characteristics

The test suite is orchestrated through a centralized test runner that manages the execution of all test types, collects results, and generates comprehensive reports.

## Directory Structure

```
tests/
├── unit/                     # Unit tests
├── integration/              # Integration tests
├── e2e/                      # End-to-end tests
├── performance/              # Performance tests
├── format-tests/             # Format-specific tests
│   ├── graphml-export.test.js
│   ├── html-website.test.js
│   ├── full-blob-export.test.js
│   └── ...
├── fixtures/                 # Test data and fixtures
│   ├── Systems/              # System models for comprehensive testing
│   │   ├── DesertEcosystem/
│   │   ├── ResearchTeam/
│   │   └── ...
│   └── ...
├── runners/                  # Test orchestration
│   ├── run-all-tests.js      # Main test runner
│   ├── all-systems-render-test.js  # System-specific renderer
│   ├── output-validator.js   # Validation utilities
│   └── ...
└── utils/                    # Testing utilities
    ├── test-utils.js
    └── ...
```

## Test Categories

### Unit Tests

Unit tests focus on testing individual functions and components in isolation, with dependencies mocked or stubbed as necessary.

```javascript
// Example unit test
test('should add an entity with correct attributes', () => {
  const ultralink = new UltraLink();
  const entityId = 'test-entity';
  const entityType = 'test-type';
  const attributes = { name: 'Test Entity', value: 42 };
  
  ultralink.addEntity(entityId, entityType, attributes);
  
  const entity = ultralink.getEntity(entityId);
  expect(entity).toBeDefined();
  expect(entity.id).toBe(entityId);
  expect(entity.type).toBe(entityType);
  expect(entity.attributes).toEqual(attributes);
});
```

### Integration Tests

Integration tests verify that different components work together correctly.

```javascript
// Example integration test
test('should create relationship and query connected entities', () => {
  const ultralink = new UltraLink();
  
  ultralink.addEntity('entity1', 'type1', { name: 'Entity 1' });
  ultralink.addEntity('entity2', 'type2', { name: 'Entity 2' });
  
  ultralink.addLink('entity1', 'entity2', 'relates_to', { strength: 0.75 });
  
  const relationships = ultralink.getRelationships('entity1');
  expect(relationships).toHaveLength(1);
  expect(relationships[0].target).toBe('entity2');
  
  const connectedEntities = ultralink.findConnected('entity1');
  expect(connectedEntities).toHaveLength(1);
  expect(connectedEntities[0].id).toBe('entity2');
});
```

### System Export Tests

System Export Tests use complete system models to test export functionality across all supported formats.

```javascript
// Example system export test
test('should export DesertEcosystem to GraphML correctly', async () => {
  const desertSystem = createDesertEcosystemDataset();
  
  const graphml = desertSystem.toGraphML();
  
  // Verify structure
  expect(graphml).toContain('<graphml');
  expect(graphml).toContain('<graph');
  
  // Verify nodes
  expect(graphml).toContain('id="saguaro"');
  expect(graphml).toContain('id="kangaroo-rat"');
  
  // Verify edges
  expect(graphml).toContain('<edge source="saguaro" target="aridity"');
});
```

### End-to-End Tests

End-to-End tests verify complete workflows from a user perspective.

```javascript
// Example E2E test
test('should create a knowledge base and export to multiple formats', async () => {
  // Set up the knowledge base
  const ultralink = new UltraLink();
  
  // Load data
  await ultralink.importFromCSV('test-data.csv');
  
  // Run operations
  ultralink.findByType('document');
  ultralink.findSimilar('doc-1');
  
  // Export to multiple formats
  const json = ultralink.toJSON();
  const graphml = ultralink.toGraphML();
  const obsidian = ultralink.toObsidian();
  
  // Verify exports contain expected content
  expect(JSON.parse(json).entities.length).toBeGreaterThan(0);
  expect(graphml).toContain('<graphml');
  expect(Object.keys(obsidian).length).toBeGreaterThan(0);
});
```

### Performance Tests

Performance tests measure and validate the performance characteristics of UltraLink.

```javascript
// Example performance test
test('should efficiently find entities by attribute in a large dataset', () => {
  // Set up test data
  const { ultralink, config } = createLargeDataset();
  
  // Measure performance
  const startTime = process.hrtime.bigint();
  const startMemory = process.memoryUsage();
  
  // Run the operation being tested
  const results = ultralink.find({
    type: 'document',
    attributes: { category: 'research' }
  });
  
  // Calculate metrics
  const endTime = process.hrtime.bigint();
  const endMemory = process.memoryUsage();
  
  const duration = Number(endTime - startTime) / 1_000_000; // Convert to ms
  const memoryDelta = {
    rss: (endMemory.rss - startMemory.rss) / (1024 * 1024),
    heapTotal: (endMemory.heapTotal - startMemory.heapTotal) / (1024 * 1024),
    heapUsed: (endMemory.heapUsed - startMemory.heapUsed) / (1024 * 1024)
  };
  
  // Log performance metrics
  console.log(`Duration: ${duration.toFixed(2)} ms`);
  console.log(`Memory delta: RSS ${memoryDelta.rss.toFixed(2)} MB, Heap ${memoryDelta.heapUsed.toFixed(2)} MB`);
  
  // Verify results
  expect(results.length).toBeGreaterThan(0);
  expect(results[0].attributes.category).toBe('research');
  
  // Validate performance
  expect(duration).toBeLessThan(config.thresholds.query);
  expect(memoryDelta.heapUsed).toBeLessThan(config.thresholds.memory);
});
```

## Test Runners

UltraLink employs a centralized test runner infrastructure to manage test execution, collect results, and generate reports.

### Main Test Runner

The main test runner (`run-all-tests.js`) orchestrates the execution of all test categories:

```javascript
/**
 * Main test runner for UltraLink
 * Executes all test categories in sequence and generates reports
 */
const TEST_SEQUENCE = [
  { name: 'Unit Tests', command: 'npm', args: ['run', 'test:unit'], required: true },
  { name: 'Integration Tests', command: 'npm', args: ['run', 'test:integration'], required: true },
  { name: 'System Export Tests', command: 'npm', args: ['run', 'test:exports'], required: true },
  { name: 'End-to-End Tests', command: 'npm', args: ['run', 'test:e2e'], required: true },
  { name: 'Performance Tests', command: 'npm', args: ['run', 'test:performance'], required: false }
];

async function runAllTests() {
  // Test sequence execution
  for (const test of TEST_SEQUENCE) {
    try {
      await runTest(test);
    } catch (error) {
      // Handle test failures
      if (test.required) {
        throw error; // Fail the entire suite for required tests
      }
    }
  }
  
  // Generate and save test report
  const reportPath = path.join(__dirname, '../../output/test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
}
```

### System Render Tests

The systems render test runner (`all-systems-render-test.js`) is responsible for rendering all supported systems in all export formats:

```javascript
/**
 * System render test runner
 * Discovers all systems, renders them in all formats, and validates outputs
 */
async function runAllSystemsTests() {
  try {
    // Discover all systems
    const systems = await discoverSystems();
    
    // Process each system
    for (const systemName of systems) {
      try {
        // Create the system
        const system = await createSystem(systemName);
        
        // Render the system in all formats
        const outputPaths = await renderSystem(systemName, system);
        
        // Validate the outputs
        await validateSystemOutputs(systemName, outputPaths);
      } catch (error) {
        // Handle system-specific failures
      }
    }
    
    // Generate summary report
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'all-systems-test-report.json'),
      JSON.stringify(summaryReport, null, 2)
    );
  } catch (error) {
    // Handle fatal errors
  }
}
```

## Output Validation

The `OutputValidator` class provides comprehensive validation of all export formats:

```javascript
/**
 * Validation utility for UltraLink exports
 */
class OutputValidator {
  constructor(outputDir) {
    this.outputDir = outputDir;
    this.results = { total: 0, passed: 0, failed: 0, tests: [] };
  }
  
  // Validate JSON output
  async validateJSON(filePath) {
    // Validation logic for JSON format
  }
  
  // Validate GraphML output
  async validateGraphML(filePath) {
    // Validation logic for GraphML format
  }
  
  // Validate CSV output
  async validateCSV(filePath) {
    // Validation logic for CSV format
  }
  
  // Validate Obsidian output
  async validateObsidian(dirPath) {
    // Validation logic for Obsidian format
  }
  
  // Validate HTML Website output
  async validateHTMLWebsite(dirPath) {
    // Validation logic for HTML Website format
  }
  
  // Validate Full Blob output
  async validateFullBlob(filePath, compressed = false) {
    // Validation logic for Full Blob format
  }
  
  // Generate validation report
  generateReport() {
    return {
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        status: this.results.failed === 0 ? 'passed' : 'failed'
      },
      tests: this.results.tests
    };
  }
}
```

## Continuous Integration

UltraLink tests are designed to run in continuous integration environments:

```yaml
# GitHub Actions workflow
name: UltraLink CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]
        
    steps:
    - uses: actions/checkout@v2
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Upload test artifacts
      uses: actions/upload-artifact@v2
      with:
        name: test-outputs
        path: output/
```

## Adding New Tests

### Adding a New Unit Test

```javascript
// tests/unit/entity-manager.test.js
const { EntityManager } = require('../../src/entity-manager');

describe('EntityManager', () => {
  let entityManager;
  
  beforeEach(() => {
    entityManager = new EntityManager();
  });
  
  test('should add entity with valid data', () => {
    const result = entityManager.addEntity('test-id', 'test-type', { name: 'Test' });
    expect(result).toBeTruthy();
    expect(entityManager.getEntity('test-id')).toBeDefined();
  });
  
  test('should validate entity data', () => {
    expect(() => {
      entityManager.addEntity(null, 'test-type', { name: 'Test' });
    }).toThrow();
  });
});
```

### Adding a New System Model

1. Create a new directory in `tests/fixtures/Systems/`
2. Create the system definition file

```javascript
// tests/fixtures/Systems/NewSystem/new-system.js
const { UltraLink } = require('../../../../src');

function createNewSystemDataset() {
  const ultralink = new UltraLink();
  
  // Add entities
  ultralink.addEntity('entity-1', 'type-1', { name: 'Entity 1', value: 42 });
  ultralink.addEntity('entity-2', 'type-2', { name: 'Entity 2', value: 84 });
  
  // Add relationships
  ultralink.addLink('entity-1', 'entity-2', 'relates_to', { strength: 0.75 });
  
  return ultralink;
}

module.exports = {
  createNewSystemDataset
};
```

3. Update the system renderer to include the new system

```javascript
// tests/runners/all-systems-render-test.js
async function createSystem(systemName) {
  switch(systemName) {
    case 'DesertEcosystem':
      return createDesertEcosystemDataset();
    case 'ResearchTeam':
      return createResearchTeamDataset();
    case 'NewSystem':
      return createNewSystemDataset();
    default:
      throw new Error(`Unknown system: ${systemName}`);
  }
}
```

## Report Formats

Test reports are generated in JSON format with the following structure:

```json
{
  "startTime": "2023-03-04T12:30:45.123Z",
  "endTime": "2023-03-04T12:35:12.456Z",
  "summary": {
    "total": 5,
    "passed": 4,
    "failed": 1,
    "skipped": 0
  },
  "tests": [
    {
      "name": "Unit Tests",
      "status": "passed",
      "duration": 1234
    },
    {
      "name": "Integration Tests",
      "status": "passed",
      "duration": 2345
    },
    {
      "name": "System Export Tests",
      "status": "passed",
      "duration": 3456
    },
    {
      "name": "End-to-End Tests",
      "status": "passed",
      "duration": 4567
    },
    {
      "name": "Performance Tests",
      "status": "failed",
      "duration": 5678,
      "error": "Performance threshold exceeded"
    }
  ]
}
```

## Troubleshooting Tests

### Common Issues

1. **Test Timeouts**: Increase timeouts for long-running tests
   ```javascript
   jest.setTimeout(30000); // 30 seconds
   ```

2. **Memory Issues**: Increase Node.js memory limit
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096 npm test
   ```

3. **Test Isolation**: Ensure tests are properly isolated and don't depend on shared state
   ```javascript
   // Reset state before each test
   beforeEach(() => {
     // Clean up any shared state
   });
   ```

### Debugging Tests

1. **Selective Test Execution**:
   ```bash
   # Run specific test file
   npm test -- tests/unit/specific-test.js
   
   # Run tests matching a pattern
   npm test -- -t "should validate entity data"
   ```

2. **Verbose Output**:
   ```bash
   npm test -- --verbose
   ```

3. **Debug Mode**:
   ```bash
   # Add debugger statements in your code
   debugger;
   
   # Run with Node.js inspector
   node --inspect-brk node_modules/.bin/jest --runInBand
   ```

## Related Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [UltraLink API Reference](../api/README.md)
- [Systems of Interest](./test-suite.md)
- [Performance Testing Guide](./performance-testing.md) 