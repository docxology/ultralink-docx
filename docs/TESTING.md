# UltraLink Testing Guide

This guide provides detailed information on how to run, extend, and understand the UltraLink test suite.

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Test Categories](#test-categories)
3. [Running Tests](#running-tests)
4. [Continuous Integration](#continuous-integration)
5. [Adding New Tests](#adding-new-tests)
6. [Mocking and Fixtures](#mocking-and-fixtures)
7. [Test Code Coverage](#test-code-coverage)
8. [Common Issues and Solutions](#common-issues-and-solutions)

## Testing Overview

UltraLink uses Jest as its primary testing framework and employs a multi-level testing strategy that includes:

- **Unit Tests**: Testing individual functions and methods in isolation
- **Integration Tests**: Testing interactions between components
- **System Tests**: Testing specific export formats with realistic datasets
- **End-to-End Tests**: Testing complete user workflows
- **Performance Tests**: Testing system performance under various loads

The test suite is organized by test category, with each category's tests in a separate directory:

```
tests/
├── unit/            # Unit tests
├── integration/     # Integration tests
├── system/          # System tests with realistic datasets
├── e2e/             # End-to-end workflow tests
├── performance/     # Performance and load tests
├── utils/           # Test utilities and fixtures
├── fixtures/        # Test datasets and sample data
│   └── Systems/     # Complete system datasets for testing
└── output/          # Test output directory
```

## Test Categories

### Unit Tests

Unit tests verify the correct behavior of individual functions, methods, and classes in isolation. Each file in the `src` directory should have a corresponding test file in the `tests/unit` directory.

Key unit test files include:

- `ultralink.test.js`: Tests for the main UltraLink class
- `entity-manager.test.js`: Tests for entity management functionality
- `relationship-manager.test.js`: Tests for relationship management
- `exporters/*.test.js`: Tests for each export format

### Integration Tests

Integration tests verify the interactions between multiple components. These tests focus on the integration points between different modules.

Key integration test files include:

- `export-formats.test.js`: Tests all export format integrations
- `bayesian-network.test.js`: Tests Bayesian network integration
- `visualization.test.js`: Tests visualization system integration

### System Tests

System tests verify the behavior of complete UltraLink instances with realistic datasets. Each test in this category uses one of the predefined test datasets to verify system-level functionality.

Key system test files include:

- `rendering.test.js`: Tests rendering all formats for all systems
- `desert-ecosystem.test.js`: Tests using the Desert Ecosystem dataset
- `research-team.test.js`: Tests using the Research Team dataset

### End-to-End Tests

End-to-end tests verify complete user workflows from start to finish, simulating real user scenarios.

Key E2E test files include:

- `knowledge-base.test.js`: Tests creating and using a complete knowledge base
- `export-workflow.test.js`: Tests exporting a knowledge graph in all formats

### Performance Tests

Performance tests measure the system's performance under various loads and help identify bottlenecks.

Key performance test files include:

- `large-graph.test.js`: Tests with large knowledge graphs
- `export-performance.test.js`: Measures export format performance
- `visualization-performance.test.js`: Tests visualization performance

## Running Tests

UltraLink provides several npm scripts for running tests:

```bash
# Run the default test suite (excludes performance tests)
npm test

# Run all tests including performance tests
npm run test:all

# Run only performance tests
npm run test:performance

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:system
npm run test:e2e
```

You can also run individual test files using Jest directly:

```bash
# Run a specific test file
npx jest tests/unit/ultralink.test.js

# Run tests matching a specific pattern
npx jest --testNamePattern="JSON Export"

# Run tests with increased verbosity
npx jest --verbose
```

For more advanced options, see the test help:

```bash
npm run test:help
```

## Continuous Integration

UltraLink uses continuous integration (CI) workflows to run the test suite automatically on each commit and pull request. The CI configuration is defined in `.github/workflows/test.yml`.

The CI workflow includes:

1. Setting up multiple Node.js environments
2. Installing dependencies
3. Running the test suite
4. Reporting test coverage
5. Publishing test artifacts

To see the latest CI results, check the GitHub Actions tab in the repository.

## Adding New Tests

When adding new functionality to UltraLink, you should also add corresponding tests. Follow these guidelines for adding new tests:

### Adding Unit Tests

1. Create a new test file in the `tests/unit` directory corresponding to the file you're testing
2. Import the module to be tested and any required test utilities
3. Use Jest's `describe` and `it` functions to structure your tests
4. Mock external dependencies using Jest's mocking capabilities

Example unit test:

```javascript
const { addEntity } = require('../../src/lib/entity-manager');

describe('Entity Manager', () => {
  describe('addEntity function', () => {
    it('should create an entity with the specified ID and type', () => {
      const context = {
        entities: new Map(),
        config: { preventOverwrite: true }
      };
      
      const entity = addEntity.call(context, 'test-entity', 'test-type', { name: 'Test' });
      
      expect(entity).toBeDefined();
      expect(entity.id).toBe('test-entity');
      expect(entity.type).toBe('test-type');
      expect(entity.attributes.name).toBe('Test');
    });
    
    it('should throw an error when trying to overwrite an existing entity', () => {
      const context = {
        entities: new Map([['test-entity', { id: 'test-entity' }]]),
        config: { preventOverwrite: true }
      };
      
      expect(() => {
        addEntity.call(context, 'test-entity', 'test-type', {});
      }).toThrow(/already exists/);
    });
  });
});
```

### Adding Integration Tests

1. Create a new test file in the `tests/integration` directory
2. Import the UltraLink class and any required test utilities
3. Create test scenarios that exercise multiple components together
4. Verify the integrated behavior of the components

Example integration test:

```javascript
const { UltraLink } = require('../../src');
const fs = require('fs');
const path = require('path');

describe('Export Integration', () => {
  let ultralink;
  
  beforeEach(() => {
    ultralink = new UltraLink();
    ultralink.addEntity('person1', 'person', { name: 'Alice' });
    ultralink.addEntity('person2', 'person', { name: 'Bob' });
    ultralink.addLink('person1', 'person2', 'knows');
  });
  
  it('should export entities and relationships to JSON', () => {
    const json = ultralink.toJSON();
    const data = JSON.parse(json);
    
    expect(data.entities.person1).toBeDefined();
    expect(data.entities.person2).toBeDefined();
    expect(Object.keys(data.relationships).length).toBe(1);
  });
  
  it('should export entities and relationships to GraphML', () => {
    const graphml = ultralink.toGraphML();
    
    expect(graphml).toContain('<node id="person1">');
    expect(graphml).toContain('<node id="person2">');
    expect(graphml).toContain('<edge source="person1" target="person2">');
  });
});
```

### Adding System Tests

1. Create a new test file in the `tests/system` directory
2. Import the required dataset creators and any test utilities
3. Create test scenarios that exercise UltraLink with realistic datasets
4. Verify the system-level behavior

Example system test:

```javascript
const { UltraLink } = require('../../src');
const { createResearchTeamDataset } = require('../fixtures/Systems/ResearchTeam/research-team');
const fs = require('fs');
const path = require('path');

describe('Research Team System Tests', () => {
  let ultralink;
  let outputDir;
  
  beforeEach(() => {
    ultralink = createResearchTeamDataset();
    outputDir = path.join(__dirname, '../output/research-team');
    fs.mkdirSync(outputDir, { recursive: true });
  });
  
  it('should export the research team to JSON', () => {
    const json = ultralink.toJSON({ pretty: true });
    const outputPath = path.join(outputDir, 'research-team.json');
    fs.writeFileSync(outputPath, json);
    
    const data = JSON.parse(json);
    expect(data.entities).toBeDefined();
    expect(Object.keys(data.entities).length).toBeGreaterThan(0);
  });
  
  it('should generate a visualization of the research team', async () => {
    const visualization = await ultralink.toVisualization({
      format: 'svg',
      layout: 'force'
    });
    
    const outputPath = path.join(outputDir, 'research-team.svg');
    fs.writeFileSync(outputPath, visualization.data);
    
    expect(visualization.data).toBeDefined();
    expect(visualization.data.length).toBeGreaterThan(0);
  });
});
```

## Mocking and Fixtures

UltraLink provides several utilities and fixtures to help with testing:

### Test Utilities

The `tests/utils` directory contains utilities for testing:

- `test-helpers.js`: Helper functions for creating test environments
- `assertions.js`: Custom assertions for UltraLink-specific testing
- `run-tests.js`: Test runner with enhanced reporting

### Test Fixtures

The `tests/fixtures` directory contains test data:

- `Systems/`: Complete system datasets for testing
  - `DesertEcosystem/`: Desert ecosystem dataset
  - `ResearchTeam/`: Research team dataset
  - `POMDP/`: POMDP model dataset
  - ...and more

### Using Test Fixtures

To use a test fixture in your tests:

```javascript
const { createResearchTeamDataset } = require('../fixtures/Systems/ResearchTeam/research-team');

describe('Research Team Tests', () => {
  let ultralink;
  
  beforeEach(() => {
    ultralink = createResearchTeamDataset();
  });
  
  it('should contain researchers', () => {
    const researchers = ultralink.findEntities({ type: 'researcher' });
    expect(researchers.length).toBeGreaterThan(0);
  });
});
```

### Creating Mock UltraLink Instances

For testing components that require an UltraLink instance, you can create a mock instance:

```javascript
const { createSampleUltraLink, createEmptyUltraLink } = require('../utils/test-helpers');

describe('Export Tests', () => {
  it('should export an empty UltraLink instance', () => {
    const ultralink = createEmptyUltraLink();
    const json = ultralink.toJSON();
    expect(JSON.parse(json).entities).toEqual({});
  });
  
  it('should export a sample UltraLink instance', () => {
    const ultralink = createSampleUltraLink();
    const json = ultralink.toJSON();
    expect(Object.keys(JSON.parse(json).entities).length).toBeGreaterThan(0);
  });
});
```

## Test Code Coverage

UltraLink tracks test code coverage using Jest's coverage tools. To generate a coverage report:

```bash
npm test
```

The coverage report will be generated in the `coverage` directory and includes:

- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

To view the coverage report, open `coverage/lcov-report/index.html` in a browser.

### Coverage Thresholds

UltraLink has set the following coverage thresholds:

- Global coverage: 80%
- Per-file coverage: 70%

If tests drop below these thresholds, the test suite will fail.

## Common Issues and Solutions

### Tests Failing Due to File System Access

Some tests require file system access to write output files. If you're running into permission issues:

1. Ensure the test process has write access to the `tests/output` directory
2. Try running the tests with elevated privileges if necessary
3. If on CI, check that the CI environment has proper permissions

### Visualization Tests Failing

Visualization tests may fail if the required dependencies are missing:

1. Ensure `sharp` is installed for PNG generation:
   ```bash
   npm install sharp
   ```

2. If tests are failing in a CI environment, check that the environment has the necessary system libraries installed.

3. If specific visualization formats are consistently failing, you can skip them:
   ```bash
   npx jest --testPathIgnorePatterns=visualization
   ```

### Performance Tests Taking Too Long

Performance tests are designed to test the system under load and may take longer to run:

1. Skip performance tests during development:
   ```bash
   npm test  # Excludes performance tests by default
   ```

2. If you need to run only specific performance tests:
   ```bash
   npx jest tests/performance/specific-test.js
   ```

3. Adjust timeouts for specific tests if needed:
   ```javascript
   it('should handle large datasets', async () => {
     // Set a longer timeout for this specific test
     jest.setTimeout(30000);
     
     // Test implementation
   });
   ```

### Memory Issues with Large Datasets

Some tests using large datasets may cause memory issues:

1. Increase Node.js memory limit:
   ```bash
   NODE_OPTIONS=--max_old_space_size=4096 npm test
   ```

2. Split large tests into smaller, more focused tests

3. Use test fixtures that load data lazily or in smaller chunks

For more help with testing issues, consult the Jest documentation or open an issue on the UltraLink repository. 