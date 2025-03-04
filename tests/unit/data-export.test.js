/**
 * Data Export Tests
 * 
 * Comprehensive tests for UltraLink's data export capabilities
 */

const { UltraLink } = require('../../src/index');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Temporary directory for file output tests
const tempDir = path.join(os.tmpdir(), 'ultralink-tests');

// Ensure temp directory exists
beforeAll(() => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
});

// Clean up temp files after tests
afterAll(() => {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (err) {
    console.warn('Failed to clean up temp directory:', err.message);
  }
});

describe('UltraLink Data Export', () => {
  let ultralink;
  
  beforeEach(() => {
    ultralink = new UltraLink();
    
    // Add test data
    ultralink.addEntity('person1', 'person', { name: 'Alice', age: 30 });
    ultralink.addEntity('person2', 'person', { name: 'Bob', age: 25 });
    ultralink.addEntity('project1', 'project', { name: 'Project Alpha', status: 'active' });
    
    // Add some relationships
    ultralink.addLink('person1', 'project1', 'manages');
    ultralink.addLink('person2', 'project1', 'contributes_to');
  });
  
  describe('JSON Export', () => {
    it('should export to JSON format', () => {
      const jsonStr = ultralink.toJSON();
      
      expect(jsonStr).toBeDefined();
      expect(typeof jsonStr).toBe('string');
      
      // Parse and check JSON structure
      const json = JSON.parse(jsonStr);
      expect(Array.isArray(json.entities)).toBe(true);
      expect(json.entities.length).toBe(3);
      
      // Check entity properties
      const alice = json.entities.find(e => e.id === 'person1');
      expect(alice).toBeDefined();
      expect(alice.type).toBe('person');
      expect(alice.attributes.name).toBe('Alice');
    });
    
    it('should export to JSON with pretty formatting', () => {
      const prettyJson = ultralink.toJSON({ pretty: true });
      
      expect(typeof prettyJson).toBe('string');
      expect(prettyJson).toContain('{\n');
      expect(prettyJson).toContain('  "entities": [');
      
      // Verify that it's valid JSON
      const parsed = JSON.parse(prettyJson);
      expect(Array.isArray(parsed.entities)).toBe(true);
    });
    
    it('should export JSON with vectors when requested', () => {
      // Add a vector to an entity
      const person1 = ultralink.entities.get('person1');
      person1.vector = new Float32Array([0.1, 0.2, 0.3]);
      
      const jsonStr = ultralink.toJSON({ includeVectors: true });
      expect(typeof jsonStr).toBe('string');
      
      const json = JSON.parse(jsonStr);
      const exportedEntity = json.entities.find(e => e.id === 'person1');
      expect(exportedEntity.vector).toBeDefined();
      expect(Array.isArray(exportedEntity.vector)).toBe(true);
      
      // Check vector values with tolerance for Float32Array precision differences
      expect(Math.abs(exportedEntity.vector[0] - 0.1)).toBeLessThan(0.0001);
      expect(Math.abs(exportedEntity.vector[1] - 0.2)).toBeLessThan(0.0001);
      expect(Math.abs(exportedEntity.vector[2] - 0.3)).toBeLessThan(0.0001);
    });
  });
  
  describe('GraphML Export', () => {
    it('should export to GraphML format', () => {
      const graphml = ultralink.toGraphML();
      
      expect(graphml).toBeDefined();
      expect(typeof graphml).toBe('string');
      
      // Basic checks for GraphML structure
      expect(graphml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(graphml).toContain('<graphml');
      expect(graphml).toContain('<graph');
      expect(graphml).toContain('<node');
      expect(graphml).toContain('<edge');
    });
  });
  
  describe('CSV Export', () => {
    it('should export to CSV format', () => {
      const csvResult = ultralink.toCSV();
      
      expect(csvResult).toBeDefined();
      expect(typeof csvResult).toBe('string');
      
      // Check CSV contains entity data
      expect(csvResult).toContain('person1');
      expect(csvResult).toContain('person2');
      expect(csvResult).toContain('project1');
      
      // Check relationships are included
      expect(csvResult).toContain('manages');
      expect(csvResult).toContain('contributes_to');
    });
  });
}); 