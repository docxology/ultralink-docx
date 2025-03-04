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
    test('should export to CSV format', () => {
      // Create test data
      const ultralink = new UltraLink();
      ultralink.addEntity('person1', 'person', { name: 'Alice', age: 30 });
      ultralink.addEntity('person2', 'person', { name: 'Bob', age: 25 });
      ultralink.addLink('person1', 'person2', 'knows');
      
      // Export to CSV
      const csvResult = ultralink.toCSV();
      
      expect(csvResult).toBeDefined();
      expect(typeof csvResult).toBe('object');
      expect(csvResult).toHaveProperty('entities');
      expect(csvResult).toHaveProperty('relationships');
      
      // Check CSV contains entity data
      expect(csvResult.entities).toContain('person1');
      expect(csvResult.entities).toContain('Alice');
      
      // Check CSV contains relationship data
      expect(csvResult.relationships).toContain('person1');
      expect(csvResult.relationships).toContain('person2');
      expect(csvResult.relationships).toContain('knows');
    });
  });

  describe('KIF Format Export', () => {
    it('should export to KIF format with correct structure', () => {
      // Create a new UltraLink instance with test data
      const ultralink = new UltraLink();
      ultralink.addEntity('person1', 'person', { name: 'Alice', age: 30 });
      ultralink.addEntity('person2', 'person', { name: 'Bob', age: 25 });
      ultralink.addEntity('project1', 'project', { title: 'Project Alpha', status: 'active' });
      
      // Add relationships
      ultralink.addLink('person1', 'project1', 'manages', { startDate: '2023-01-01' });
      ultralink.addLink('person2', 'project1', 'contributes_to', { role: 'developer' });
      
      // Export to KIF
      const kif = ultralink.toKIF();
      
      // Verify KIF structure
      expect(kif).toBeDefined();
      expect(typeof kif).toBe('string');
      
      // Check header
      expect(kif).toContain(';; UltraLink Knowledge Interchange Format (KIF) Export');
      expect(kif).toContain(';; Generated:');
      
      // Check entity definitions
      expect(kif).toContain('(instance person1 Person)');
      expect(kif).toContain('(name person1 "Alice")');
      expect(kif).toContain('(age person1 30)');
      
      expect(kif).toContain('(instance person2 Person)');
      expect(kif).toContain('(name person2 "Bob")');
      expect(kif).toContain('(age person2 25)');
      
      expect(kif).toContain('(instance project1 Project)');
      expect(kif).toContain('(title project1 "Project Alpha")');
      expect(kif).toContain('(status project1 "active")');
      
      // Check relationships
      expect(kif).toContain('(manages person1 project1)');
      expect(kif).toContain('(contributes_to person2 project1)');
      
      // Check relationship attributes
      expect(kif).toContain('(= (startDate-manages person1 project1) "2023-01-01")');
      expect(kif).toContain('(= (role-contributes_to person2 project1) "developer")');
    });
    
    it('should include meta-knowledge when requested', () => {
      // Create a simple UltraLink instance
      const ultralink = new UltraLink();
      ultralink.addEntity('person1', 'person', { name: 'Alice' });
      ultralink.addEntity('person2', 'person', { name: 'Bob' });
      ultralink.addLink('person1', 'person2', 'knows');
      
      // Export to KIF with meta-knowledge
      const kif = ultralink.toKIF({ includeMetaKnowledge: true });
      
      // Verify meta-knowledge sections
      expect(kif).toContain(';; Meta-knowledge');
      expect(kif).toContain('(= (creationDate UltraLinkExport)');
      expect(kif).toContain('(= (entityCount UltraLinkExport) 2)');
      expect(kif).toContain('(= (relationshipCount UltraLinkExport) 1)');
    });
    
    it('should include functions and rules when requested', () => {
      const ultralink = new UltraLink();
      
      // Export with functions and rules
      const kif = ultralink.toKIF({
        includeFunctions: true,
        includeRules: true
      });
      
      // Verify functions section
      expect(kif).toContain(';; Functions');
      expect(kif).toContain('(deffunction relationshipCount (?x)');
      
      // Verify rules section
      expect(kif).toContain(';; Rules');
      expect(kif).toContain('(forall (?x ?y)');
      expect(kif).toContain('(well-adapted ?x ?y)');
    });
    
    it('should handle complex entity attributes correctly', () => {
      const ultralink = new UltraLink();
      
      // Add entity with special characters and complex attributes
      ultralink.addEntity('test-entity', 'complex_type', {
        'name with spaces': 'Test Entity',
        numeric: 42,
        boolean: true,
        'nested.property': 'nested value',
        'special"characters': 'value with "quotes"'
      });
      
      // Export to KIF
      const kif = ultralink.toKIF();
      
      // Verify complex attributes are properly escaped
      expect(kif).toContain('(instance test-entity Complex_type)');
      expect(kif).toContain('(name with spaces test-entity "Test Entity")');
      expect(kif).toContain('(numeric test-entity 42)');
      expect(kif).toContain('(boolean test-entity true)');
      expect(kif).toContain('(nested.property test-entity "nested value")');
      expect(kif).toContain('(special"characters test-entity "value with \\"quotes\\"")');
    });
  });
}); 