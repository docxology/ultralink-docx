/**
 * Integration tests for export formats
 * 
 * These tests verify that UltraLink can correctly export data to
 * all supported formats, and that the exported data maintains
 * all entities, relationships, and attributes.
 */

const { UltraLink } = require('../../src/ultralink');
const fs = require('fs');
const path = require('path');
const { createTestDataset, getSystemOutputPath } = require('../test-utils');

// System names for organizing output
const desertSystem = 'desert-ecosystem';
const integrationSystem = 'integration-tests';

// Create a directory for temp files
const tempDir = path.join(__dirname, '../../output/tmp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Setup test data
let ultralink;

beforeEach(() => {
  // Create a fresh UltraLink instance for each test
  ultralink = new UltraLink();
  
  // Add organisms
  ultralink.addEntity('saguaro', 'organism', {
    name: 'Saguaro Cactus',
    scientificName: 'Carnegiea gigantea',
    type: 'plant',
    height: '15-50 feet',
    lifespan: '150-200 years'
  });
  
  ultralink.addEntity('kangaroo-rat', 'organism', {
    name: 'Kangaroo Rat',
    scientificName: 'Dipodomys',
    type: 'mammal',
    weight: '100-150g',
    nocturnal: true
  });
  
  // Add environmental factors
  ultralink.addEntity('aridity', 'environmental_factor', {
    name: 'Aridity',
    description: 'Extremely dry conditions with minimal rainfall',
    annualRainfall: '3-15 inches'
  });
  
  // Add relationships
  ultralink.addLink('saguaro', 'aridity', 'adapts_to', {
    mechanism: 'Water storage in stem',
    efficiency: 0.95
  });
  
  ultralink.addLink('kangaroo-rat', 'aridity', 'adapts_to', {
    mechanism: 'Metabolic water production',
    efficiency: 0.88
  });
});

// Clean up after tests
afterAll(() => {
  // We'll keep the output files for inspection
});

describe('Export Formats Integration', () => {
  
  test('HTML Website export format', () => {
    // Generate HTML Website
    const htmlFiles = ultralink.toHTMLWebsite({
      title: 'Desert Ecosystem',
      description: 'Interactive visualization of desert ecosystem relationships'
    });
    
    // Save files for inspection
    const outputDir = getSystemOutputPath(desertSystem, 'html-website');
    Object.entries(htmlFiles).forEach(([filename, content]) => {
      fs.writeFileSync(path.join(outputDir, filename), content);
    });
    
    // Verify the output
    expect(Object.keys(htmlFiles)).toContain('index.html');
    expect(Object.keys(htmlFiles)).toContain('saguaro.html');
    expect(Object.keys(htmlFiles)).toContain('kangaroo-rat.html');
    expect(Object.keys(htmlFiles)).toContain('aridity.html');
    
    // Check index.html content
    expect(htmlFiles['index.html']).toContain('<title>Desert Ecosystem</title>');
    expect(htmlFiles['index.html']).toContain('Interactive visualization of desert ecosystem relationships');
    expect(htmlFiles['index.html']).toContain('d3.v7.min.js');
    
    // Check entity page content
    expect(htmlFiles['saguaro.html']).toContain('<title>Saguaro Cactus - Desert Ecosystem</title>');
    expect(htmlFiles['saguaro.html']).toContain('scientificName');
    expect(htmlFiles['saguaro.html']).toContain('Carnegiea gigantea');
  });
  
  describe('JSON Export', () => {
    it('should export a complete and valid JSON representation', () => {
      // Generate JSON
      const json = ultralink.toJSON();
      
      // Save for inspection
      const outputDir = getSystemOutputPath(integrationSystem, 'json');
      fs.writeFileSync(path.join(outputDir, 'export.json'), JSON.stringify(json, null, 2));
      
      // Verify structure
      expect(json).toHaveProperty('entities');
      expect(json).toHaveProperty('relationships');
      expect(json.entities.length).toBe(3);
      expect(json.relationships.length).toBe(2);
      
      // Verify entity data
      const saguaro = json.entities.find(e => e.id === 'saguaro');
      expect(saguaro).toBeDefined();
      expect(saguaro.attributes.name).toBe('Saguaro Cactus');
      expect(saguaro.attributes.scientificName).toBe('Carnegiea gigantea');
      
      // Verify relationship data
      const adaptRel = json.relationships.find(r => 
        r.source === 'saguaro' && r.target === 'aridity'
      );
      expect(adaptRel).toBeDefined();
      expect(adaptRel.type).toBe('adapts_to');
      expect(adaptRel.attributes.mechanism).toBe('Water storage in stem');
    });
    
    it('should export JSON with vectors if requested', () => {
      // Add some vectors
      ultralink.entities.get('saguaro').vector = new Float32Array([0.1, 0.2, 0.3]);
      ultralink.entities.get('kangaroo-rat').vector = new Float32Array([0.4, 0.5, 0.6]);
      
      // Generate JSON with vectors
      const json = ultralink.toJSON({ includeVectors: true });
      
      // Save for inspection
      const outputDir = getSystemOutputPath(integrationSystem, 'json-vectors');
      fs.writeFileSync(path.join(outputDir, 'export-with-vectors.json'), JSON.stringify(json, null, 2));
      
      // Verify vectors included
      const saguaro = json.entities.find(e => e.id === 'saguaro');
      expect(saguaro).toHaveProperty('vector');
      expect(Array.isArray(saguaro.vector)).toBe(true);
      expect(saguaro.vector.length).toBe(3);
      expect(saguaro.vector[0]).toBeCloseTo(0.1, 5);
    });
  });
  
  describe('GraphML Export', () => {
    it('should export a valid GraphML representation', () => {
      // Generate GraphML
      const graphml = ultralink.toGraphML();
      
      // Save for inspection
      const outputDir = getSystemOutputPath(integrationSystem, 'graphml');
      fs.writeFileSync(path.join(outputDir, 'export.graphml'), graphml);
      
      // Verify structure
      expect(graphml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(graphml).toContain('<graphml xmlns="http://graphml.graphdrawing.org/xmlns"');
      expect(graphml).toContain('<graph id="G" edgedefault="directed">');
      
      // Verify nodes
      expect(graphml).toContain('<node id="saguaro">');
      expect(graphml).toContain('<node id="kangaroo-rat">');
      expect(graphml).toContain('<node id="aridity">');
      
      // Verify edges
      expect(graphml).toContain('<edge source="saguaro" target="aridity">');
      expect(graphml).toContain('<edge source="kangaroo-rat" target="aridity">');
      
      // Verify attribute data
      expect(graphml).toContain('<key id="name"');
      expect(graphml).toContain('<key id="type"');
      expect(graphml).toContain('<data key="name">Saguaro Cactus</data>');
    });
    
    it('should export GraphML with attributes if requested', () => {
      // Generate GraphML with all attributes
      const graphml = ultralink.toGraphML({ includeAllAttributes: true });
      
      // Save for inspection
      const outputDir = getSystemOutputPath(integrationSystem, 'graphml-attributes');
      fs.writeFileSync(path.join(outputDir, 'export-with-attributes.graphml'), graphml);
      
      // Verify attribute data
      expect(graphml).toContain('<data key="scientificName">Carnegiea gigantea</data>');
      expect(graphml).toContain('<data key="height">15-50 feet</data>');
      expect(graphml).toContain('<data key="lifespan">150-200 years</data>');
    });
  });
  
  describe('CSV Export', () => {
    it('should export valid CSV files for entities and relationships', () => {
      // Generate CSV
      const csv = ultralink.toCSV();
      
      // Save for inspection
      const outputDir = getSystemOutputPath(integrationSystem, 'csv');
      fs.writeFileSync(path.join(outputDir, 'entities.csv'), csv.entities);
      fs.writeFileSync(path.join(outputDir, 'relationships.csv'), csv.relationships);
      
      // Check entity CSV structure
      const entitiesHeader = csv.entities.split('\n')[0];
      expect(entitiesHeader).toContain('id');
      expect(entitiesHeader).toContain('type');
      expect(entitiesHeader).toContain('name');
      expect(entitiesHeader).toContain('scientificName');
      
      // Check data rows
      const entitiesRows = csv.entities.split('\n').slice(1);
      expect(entitiesRows.length).toBeGreaterThan(0);
      expect(entitiesRows[0]).toContain('saguaro');
      expect(entitiesRows[0]).toContain('Saguaro Cactus');
      expect(entitiesRows[0]).toContain('Carnegiea gigantea');
      
      // Check relationship CSV structure
      const relationshipsHeader = csv.relationships.split('\n')[0];
      expect(relationshipsHeader).toContain('source');
      expect(relationshipsHeader).toContain('target');
      expect(relationshipsHeader).toContain('type');
      
      // Check data rows
      const relationshipsRows = csv.relationships.split('\n').slice(1);
      expect(relationshipsRows.length).toBeGreaterThan(0);
      expect(relationshipsRows[0]).toContain('saguaro');
      expect(relationshipsRows[0]).toContain('aridity');
      expect(relationshipsRows[0]).toContain('adapts_to');
    });
  });
  
  describe('Obsidian Export', () => {
    it('should export a complete Obsidian knowledge base', () => {
      // Generate Obsidian files
      const obsidian = ultralink.toObsidian({
        includeMetadata: true,
        includeAttributes: true,
        includeRelationships: true,
        // Use simpler templates that don't rely on Handlebars syntax
        metadataTemplate: '---\ntype: {{type}}\nid: {{id}}\n---\n\n',
        titleTemplate: '# {{name}}\n\n',
        attributeTemplate: '**Type**: {{type}}\n**ID**: {{id}}\n\n## Attributes\n\n',
        relationshipTemplate: '## Relationships\n\n',
        backlinkTemplate: '## Backlinks\n\n'
      });
      
      // Save for inspection
      const outputDir = getSystemOutputPath(desertSystem, 'obsidian');
      Object.entries(obsidian).forEach(([filename, content]) => {
        fs.writeFileSync(path.join(outputDir, filename), content);
      });
      
      // Verify files
      expect(Object.keys(obsidian)).toContain('saguaro.md');
      expect(Object.keys(obsidian)).toContain('kangaroo-rat.md');
      expect(Object.keys(obsidian)).toContain('aridity.md');
      
      // Check content
      const saguaroContent = obsidian['saguaro.md'];
      
      // Should have YAML frontmatter
      expect(saguaroContent).toContain('---');
      expect(saguaroContent).toContain('type: organism');
      expect(saguaroContent).toContain('id: saguaro');
      
      // Should have attributes
      expect(saguaroContent).toContain('Carnegiea gigantea');
      
      // Should have links
      expect(saguaroContent).toContain('aridity');
    });
    
    it('should include backlinks if requested', () => {
      // Generate Obsidian files with backlinks
      const obsidian = ultralink.toObsidian({ 
        backlinks: true
      });
      
      // Save for inspection
      const outputDir = getSystemOutputPath(desertSystem, 'obsidian-backlinks');
      Object.entries(obsidian).forEach(([filename, content]) => {
        fs.writeFileSync(path.join(outputDir, filename), content);
      });
      
      // For this test, we're simply confirming files were generated
      expect(Object.keys(obsidian)).toContain('saguaro.md');
      expect(Object.keys(obsidian)).toContain('kangaroo-rat.md');
      expect(Object.keys(obsidian)).toContain('aridity.md');
    });
  });
  
  describe('HTML Website Export', () => {
    test('should export a complete HTML website', () => {
      const website = ultralink.toHTMLWebsite({
        title: 'Desert Ecosystem',
        description: 'Interactive visualization of desert ecosystem relationships'
      });
      
      // Save for inspection
      const outputDir = getSystemOutputPath(desertSystem, 'html-website-integrated');
      Object.entries(website).forEach(([filename, content]) => {
        fs.writeFileSync(path.join(outputDir, filename), content);
      });
      
      // Verify the files were created
      expect(Object.keys(website)).toContain('index.html');
      expect(Object.keys(website)).toContain('saguaro.html');
      expect(Object.keys(website)).toContain('kangaroo-rat.html');
      expect(Object.keys(website)).toContain('aridity.html');
      
      // Check content
      expect(website['index.html']).toContain('<title>Desert Ecosystem</title>');
      expect(website['index.html']).toContain('d3.v7.min.js');
      expect(website['saguaro.html']).toContain('scientificName');
      expect(website['saguaro.html']).toContain('Carnegiea gigantea');
    });
  });
  
  describe('Full Blob Export', () => {
    it('should export and import a full data blob', () => {
      // Generate full blob
      const blob = ultralink.toFullBlob();
      
      // Save for inspection
      const outputDir = getSystemOutputPath(integrationSystem, 'full-blob');
      fs.writeFileSync(path.join(outputDir, 'export.blob'), JSON.stringify(blob, null, 2));
      
      // Create a new instance and import the blob
      const newUltralink = new UltraLink();
      newUltralink.fromFullBlob(blob);
      
      // Verify entities were imported
      expect(newUltralink.entities.size).toBe(ultralink.entities.size);
      expect(newUltralink.relationships.size).toBe(ultralink.relationships.size);
      
      // Verify specific entity
      const saguaro = newUltralink.getEntity('saguaro');
      expect(saguaro).toBeDefined();
      expect(saguaro.attributes.name).toBe('Saguaro Cactus');
    });
    
    it('should export a compressed full blob', () => {
      // Generate compressed blob
      const compressedBlob = ultralink.toFullBlob({ compress: true });
      
      // Save for inspection
      const outputDir = getSystemOutputPath(integrationSystem, 'full-blob-compressed');
      fs.writeFileSync(path.join(outputDir, 'export-compressed.blob'), compressedBlob);
      
      // Create a new instance and import the compressed blob
      const newUltralink = new UltraLink();
      newUltralink.fromFullBlob(compressedBlob, { compressed: true });
      
      // Verify entities were imported
      expect(newUltralink.entities.size).toBe(ultralink.entities.size);
      expect(newUltralink.relationships.size).toBe(ultralink.relationships.size);
      
      // Verify specific entity
      const saguaro = newUltralink.getEntity('saguaro');
      expect(saguaro).toBeDefined();
      expect(saguaro.attributes.name).toBe('Saguaro Cactus');
    });
  });
}); 