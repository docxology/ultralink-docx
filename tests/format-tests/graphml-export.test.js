/**
 * GraphML Export Tests
 * Tests the GraphML export functionality of UltraLink
 */

const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');
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

function attributesByName(keys, element, scope) {
  return Object.fromEntries(element.data.map(({ $: { key }, _: value }) => {
    const declaration = keys.find(candidate => candidate.id === key);
    expect(declaration).toMatchObject({ for: scope, 'attr.type': 'string' });
    return [declaration['attr.name'], value];
  }));
}

// Tests for the GraphML export functionality
test('Basic GraphML export structure', async () => {
  logger.info('Setting up test dataset');
  
  // Create a sample UltraLink instance
  const ultralink = new UltraLink();
  
  // Add some entities
  ultralink.addEntity('e1', 'person', {
    name: 'Alice',
    role: 'Researcher',
    relationship_type: 'Research'
  });
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
  
  expect(graphml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  const { graphml: document } = await parseStringPromise(graphml);
  expect(document.$.xmlns).toBe('http://graphml.graphdrawing.org/xmlns');
  const [graph] = document.graph;
  expect(document.graph).toHaveLength(1);
  expect(graph.$).toEqual({ id: 'G', edgedefault: 'directed' });

  const keys = document.key.map(({ $ }) => $);
  expect(graph.key).toBeUndefined();
  expect(graphml.lastIndexOf('<key ')).toBeLessThan(graphml.indexOf('<graph '));
  expect(new Set(keys.map(key => key.id)).size).toBe(keys.length);

  expect(graph.node.map(({ $ }) => $.id)).toEqual(['e1', 'e2', 'e3']);
  expect(graph.node.map(node => attributesByName(keys, node, 'node'))).toEqual([
    { type: 'person', name: 'Alice', role: 'Researcher', relationship_type: 'Research' },
    { type: 'project', name: 'ML Research' },
    { type: 'technology', name: 'Python' }
  ]);

  expect(graph.edge.map(({ $ }) => $)).toEqual([
    { source: 'e1', target: 'e2' },
    { source: 'e2', target: 'e3' }
  ]);
  expect(graph.edge.map(edge => attributesByName(keys, edge, 'edge'))).toEqual([
    { type: 'works_on', role: 'Lead Researcher' },
    { type: 'uses', proficiency: 'Advanced' }
  ]);
});

test('Detailed attribute handling in GraphML', async () => {
  logger.info('Setting up test dataset with detailed attributes');
  
  // Create a sample UltraLink instance
  const ultralink = new UltraLink();
  
  const specialAttribute = 'R&D <label> "status"';
  const name = 'Test Dataset & "Reference"';
  const labels = ['test', 'sample', 'example'];
  const metadata = {
    created: '2023-01-01',
    updated: '2023-02-15',
    source: 'https://example.com/data'
  };
  const entityType = 'dataset & collection';
  const edgeType = 'cites <reference>';
  ultralink.addEntity('e1', entityType, {
    name,
    size: 1024,
    labels,
    metadata,
    [specialAttribute]: '"Ready" & <verified> \'notes\''
  });
  ultralink.addEntity('e2', 'reference');
  ultralink.addLink('e1', 'e2', edgeType, { [specialAttribute]: 'peer reviewed & accepted' });
  
  // Generate GraphML with all attributes
  logger.info('Generating GraphML with full attributes');
  const graphml = ultralink.toGraphML({ includeAllAttributes: true });
  
  // Save the GraphML to a file for inspection
  const outputDir = getSystemOutputPath(desertSystem, 'graphml');
  const outputFile = path.join(outputDir, 'test-graphml-attributes.xml');
  fs.writeFileSync(outputFile, graphml);
  
  logger.info(`Saved GraphML with attributes to ${outputFile}`);
  
  const { graphml: document } = await parseStringPromise(graphml);
  const keys = document.key.map(({ $ }) => $);
  const [graph] = document.graph;
  const node = graph.node.find(({ $ }) => $.id === 'e1');
  const attrs = attributesByName(keys, node, 'node');
  expect(attrs).toMatchObject({
    type: entityType,
    name,
    size: '1024',
    [specialAttribute]: '"Ready" & <verified> \'notes\''
  });
  expect(JSON.parse(attrs.labels)).toEqual(labels);
  expect(JSON.parse(attrs.metadata)).toEqual(metadata);
  expect(attributesByName(keys, graph.edge[0], 'edge')).toEqual({
    type: edgeType,
    [specialAttribute]: 'peer reviewed & accepted'
  });
});

// Clean up resources after tests
afterAll(() => {
  logger.info('Cleaning up test resources');
  // We'll keep the output files for inspection
});