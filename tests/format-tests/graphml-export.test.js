/**
 * GraphML Export Tests
 * Tests the GraphML export functionality of UltraLink
 */

const fs = require('fs');
const path = require('path');
const { UltraLink } = require('../../src');
const { createTestLogger, getSystemOutputPath } = require('../test-utils');

// Create a logger for the test
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'graphml-export-test.log');
const logger = createTestLogger(logFile);

// System name for organizing output
const desertSystem = 'desert-ecosystem';

// Tests for the GraphML export functionality
test('Basic GraphML export structure', () => {
  logger.info('Setting up test dataset');
  
  // Create a sample UltraLink instance
  const ultralink = new UltraLink();
  
  // Add some entities
  ultralink.addEntity('e1', 'person', { name: 'Alice' });
  ultralink.addEntity('e2', 'project', { name: 'ML Research' });
  ultralink.addEntity('e3', 'technology', { name: 'Python' });
  
  // Add some relationships
  ultralink.addLink('e1', 'e2', 'works_on', { role: 'Lead Researcher' });
  ultralink.addLink('e2', 'e3', 'uses', { proficiency: 'Advanced' });
  
  // Generate GraphML
  logger.info('Generating GraphML');
  const graphml = ultralink.toGraphML();
  
  // Save the GraphML to a file for inspection
  const outputDir = getSystemOutputPath(desertSystem, 'graphml');
  const outputFile = path.join(outputDir, 'test-graphml-export.xml');
  fs.writeFileSync(outputFile, graphml);
  
  logger.info(`Saved GraphML to ${outputFile}`);
  
  // Check the structure of the GraphML
  expect(graphml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  expect(graphml).toContain('<graphml xmlns="http://graphml.graphdrawing.org/xmlns"');
  expect(graphml).toContain('<key id="type" for="node"');
  expect(graphml).toContain('<key id="attributes" for="node"');
  expect(graphml).toContain('<key id="relType" for="edge"');
  expect(graphml).toContain('<key id="relAttributes" for="edge"');
  expect(graphml).toContain('<graph id="G" edgedefault="directed">');
  
  // Check that our entities are in the GraphML
  expect(graphml).toContain('<node id="e1">');
  expect(graphml).toContain('<node id="e2">');
  expect(graphml).toContain('<node id="e3">');
  
  // Check that our relationships are in the GraphML
  expect(graphml).toContain('<edge source="e1" target="e2">');
  expect(graphml).toContain('<edge source="e2" target="e3">');
});

test('Detailed attribute handling in GraphML', () => {
  logger.info('Setting up test dataset with detailed attributes');
  
  // Create a sample UltraLink instance
  const ultralink = new UltraLink();
  
  // Add an entity with various attribute types
  ultralink.addEntity('e1', 'dataset', {
    name: 'Test Dataset',
    size: 1024,
    labels: ['test', 'sample', 'example'],
    metadata: {
      created: '2023-01-01',
      updated: '2023-02-15',
      source: 'https://example.com/data'
    }
  });
  
  // Generate GraphML with all attributes
  logger.info('Generating GraphML with full attributes');
  const graphml = ultralink.toGraphML({ includeAllAttributes: true });
  
  // Save the GraphML to a file for inspection
  const outputDir = getSystemOutputPath(desertSystem, 'graphml');
  const outputFile = path.join(outputDir, 'test-graphml-attributes.xml');
  fs.writeFileSync(outputFile, graphml);
  
  logger.info(`Saved GraphML with attributes to ${outputFile}`);
  
  // Check that JSON serialization is used for complex attributes
  expect(graphml).toContain('Test Dataset');
  expect(graphml).toContain('1024');
  expect(graphml).toContain('"labels":["test","sample","example"]');
  expect(graphml).toContain('"metadata":{"created":"2023-01-01","updated":"2023-02-15","source":"https://example.com/data"}');
});

// Clean up resources after tests
afterAll(() => {
  logger.info('Cleaning up test resources');
  // We'll keep the output files for inspection
});

// Export the test runner
module.exports = {
  runGraphMLExportTests
};

// If this script is run directly, execute the tests
if (require.main === module) {
  runGraphMLExportTests()
    .then(results => {
      console.log('GraphML Export Tests completed');
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Error running GraphML Export Tests:', error);
      process.exit(1);
    });
} 