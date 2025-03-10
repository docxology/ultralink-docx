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

UltraLink's test suite aims to provide comprehensive code coverage. We track code coverage metrics using Jest's coverage reporter and aim for high coverage across all modules.

To run tests with coverage reporting:

```bash
# Run tests with coverage report
npm run test:coverage
```

This will generate a coverage report in the `coverage` directory and display a summary in the terminal. The report includes coverage metrics for:

- Statements: Percentage of code statements executed
- Branches: Percentage of code branches (if/else) executed
- Functions: Percentage of functions called
- Lines: Percentage of code lines executed

### Testing Visualization and Rendering

UltraLink employs a comprehensive approach to testing visualization and rendering functionality, which can be challenging due to their dependency on external libraries and complex outputs.

#### Visualization Testing Strategy

Our visualization testing focuses on:

1. **Fallback Mechanisms:** Testing that appropriate fallback content is generated when standard visualization fails
2. **Input Validation:** Validating that visualization functions handle different input scenarios appropriately
3. **Output Format Verification:** Ensuring that outputs match expected formats (SVG, PNG, etc.)
4. **End-to-End Testing:** Verifying that complete rendering workflows produce expected outputs

#### Mock Implementation

To effectively test visualization components that depend on external libraries like D3.js, we use mocking:

```javascript
// Example of D3 mocking in tests
jest.mock('d3', () => ({
  forceSimulation: jest.fn().mockReturnValue({
    nodes: jest.fn().mockReturnThis(),
    force: jest.fn().mockReturnThis(),
    tick: jest.fn(),
    alpha: jest.fn().mockReturnThis(),
    restart: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis()
  }),
  forceManyBody: jest.fn().mockReturnValue({}),
  forceCenter: jest.fn().mockReturnValue({}),
  forceLink: jest.fn().mockReturnValue({
    links: jest.fn().mockReturnThis()
  })
}));

// Example of visualization module mocking
jest.mock('../../src/lib/exporters/visualization', () => {
  return {
    toVisualization: jest.fn().mockImplementation(async (ultralink, options = {}) => {
      const systemName = ultralink?.name || 'test-system';
      return {
        [`${systemName}.svg`]: '<svg>Test SVG</svg>',
        [`${systemName}.png`]: Buffer.from('test-png-data'),
        [`${systemName}-graph.svg`]: '<svg>Test Graph SVG</svg>',
        [`${systemName}-graph.png`]: Buffer.from('test-graph-png-data')
      };
    })
  };
});
```

#### Running Visualization Tests

To run tests specific to visualization functionality:

```bash
# Run visualization-related tests
npm test -- --testPathPattern="visualization|rendering"
```

This will run all tests that have "visualization" or "rendering" in their file paths.

## Common Issues and Solutions

### D3.js Related Errors

**Issue**: Tests fail with `TypeError: simulation.tick is not a function` or similar D3.js-related errors.

**Solution**: Ensure proper mocking of D3.js functions:

```javascript
jest.mock('d3', () => ({
  forceSimulation: jest.fn().mockReturnValue({
    nodes: jest.fn().mockReturnThis(),
    force: jest.fn().mockReturnThis(),
    tick: jest.fn(),
    alpha: jest.fn().mockReturnThis(),
    restart: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis()
  }),
  // Add other D3 functions as needed
}));
```

### File System Write Errors

**Issue**: Tests fail with file system write errors.

**Solution**: Mock the file system functions in your tests:

```javascript
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true),
}));
```

### Async Operation Handling

**Issue**: Tests complete before async operations finish, causing unexpected errors.

**Solution**: Ensure proper async handling in tests:

```javascript
test('Async operations are handled correctly', async () => {
  // Mock any functions that should be prevented from running
  jest.spyOn(someModule, 'functionToPrevent').mockImplementation(() => Promise.resolve());
  
  // Run your test
  await expect(yourAsyncFunction()).resolves.toBeTruthy();
  
  // Verify expected outcomes
  expect(someModule.functionToPrevent).toHaveBeenCalled();
});
```

Additionally, make sure to clean up after tests:

```javascript
beforeAll(() => {
  // Save original functions
  originalFunction = someModule.someFunction;
  
  // Mock console methods to prevent test output pollution
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  // Restore original functions
  someModule.someFunction = originalFunction;
  
  // Restore console methods
  console.log.mockRestore();
  console.error.mockRestore();
  
  // Reset modules
  jest.resetModules();
  jest.restoreAllMocks();
});
```

### UltraLink Constructor Issues

**Issue**: Tests fail with `UltraLink is not a constructor` error.

**Solution**: There are several approaches:

1. Skip problematic tests using `test.skip()`
2. Mock the UltraLink class:

```javascript
jest.mock('../../src/ultralink', () => {
  return {
    UltraLink: jest.fn().mockImplementation(() => ({
      // Implement required methods and properties
      addEntity: jest.fn(),
      addRelationship: jest.fn(),
      toJSON: jest.fn(),
      store: {
        entities: {},
        relationships: {}
      }
    }))
  };
});
```

For more help with testing issues, consult the Jest documentation or open an issue on the UltraLink repository. 