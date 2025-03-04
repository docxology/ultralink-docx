# UltraLink Testing Suite

This directory contains the complete testing suite for the UltraLink project. Our testing strategy follows a comprehensive, multi-layered approach to ensure robustness, reliability, and maintainability of the codebase.

## Testing Philosophy

UltraLink's testing philosophy is built on the following principles:

1. **Comprehensive Coverage**: Tests should cover all aspects of the system
2. **Real-World Scenarios**: Tests should reflect real-world usage patterns
3. **Performance Awareness**: Tests should verify performance characteristics
4. **Maintainability**: Tests should be easy to maintain and understand
5. **Documentation**: Tests serve as living documentation of system behavior

## Test Types

The testing suite is organized into several test types:

### Unit Tests

Located in the [unit](./unit/) directory, these tests focus on individual components and classes in isolation. Each class and function should have corresponding unit tests that verify its behavior under various conditions.

Unit tests follow these naming conventions:
- Test files: `[component-name].test.js`
- Test suites: `describe('[Component/Function Name]', ...)`
- Test cases: `it('should [expected behavior]', ...)`

### Integration Tests

Located in the [integration](./integration/) directory, these tests verify that components work together correctly. Integration tests focus on the interaction between subsystems and ensure that data flows correctly through the system.

Integration tests typically cover:
- Parser integration with the entity store
- Exporter integration with various formats
- Template system integration with entities
- Integrity checker integration with the system

### End-to-End (E2E) Tests

Located in the [e2e](./e2e/) directory, these tests simulate real-world usage of the UltraLink system from end to end. They typically involve creating entities, establishing relationships, and verifying exports.

E2E tests are organized by use case:
- Knowledge base creation and querying
- Database import and export
- Format conversion
- Integrity verification workflows

### Performance Tests

Located in the [performance](./performance/) directory, these tests verify the system's performance characteristics under various conditions. Performance tests focus on:

- Memory usage during large dataset processing
- Processing time for various operations
- Scalability with increasing dataset size
- Export performance for different formats

## Running Tests

UltraLink uses Jest as its testing framework. To run the tests:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance

# Run specific test file
npm test -- tests/unit/entity.test.js

# Run with coverage
npm run test:coverage
```

## Code Coverage

We aim for high code coverage but prioritize meaningful tests over coverage for its own sake. The coverage report is generated during the test run and can be found in the `coverage` directory.

## Writing Tests

When writing tests for UltraLink, follow these guidelines:

1. **Isolation**: Unit tests should not depend on other units
2. **Completeness**: Test both happy paths and error conditions
3. **Readability**: Tests should be easy to read and understand
4. **Performance**: Tests should be efficient and fast-running
5. **Independence**: Tests should not depend on execution order

## Test Data

Test data is stored in the [fixtures](./fixtures/) directory and is organized by test type. This data includes:

- Sample entities and relationships
- Expected export outputs
- Performance test datasets
- Error case examples

## Continuous Integration

Tests are automatically run in CI for all pull requests and commits to the main branch. PRs cannot be merged if tests fail.

## Test Documentation

Each test file should include comprehensive JSDoc comments explaining the purpose of the tests and any special considerations. Complex test scenarios should include a detailed explanation of the test setup and expected outcomes. 