/**
 * Unit tests for the UltraLink class
 * 
 * These tests verify the core functionality of the UltraLink class,
 * including entity and relationship management, export capabilities,
 * and advanced features.
 */

const { UltraLink } = require('../../src/ultralink');
const fs = require('fs');
const path = require('path');

describe('UltraLink', () => {
  // Basic UltraLink instance creation and properties
  describe('Constructor', () => {
    it('should create an UltraLink instance with default options', () => {
      const ultralink = new UltraLink();
      
      expect(ultralink.entities).toBeDefined();
      expect(ultralink.relationships).toBeDefined();
      expect(ultralink.entities.size).toBe(0);
      expect(ultralink.relationships.size).toBe(0);
    });
    
    it('should create an UltraLink instance with custom options', () => {
      const options = {
        enableVectors: false,
        enableTemporal: false
      };
      
      const ultralink = new UltraLink(options);
      
      expect(ultralink.entities).toBeDefined();
      expect(ultralink.relationships).toBeDefined();
    });
  });
  
  // Entity management
  describe('Entity Management', () => {
    let ultralink;
    
    beforeEach(() => {
      ultralink = new UltraLink();
    });
    
    it('should add an entity with addEntity method', () => {
      const entity = ultralink.addEntity('entity1', 'person', { name: 'John Doe' });
      
      expect(ultralink.entities.size).toBe(1);
      expect(ultralink.entities.get('entity1')).toBe(entity);
      expect(entity.id).toBe('entity1');
      expect(entity.type).toBe('person');
      expect(entity.attributes).toEqual({ name: 'John Doe' });
    });
    
    it('should retrieve an entity with getEntity method', () => {
      ultralink.addEntity('entity1', 'person', { name: 'John Doe' });
      
      const entity = ultralink.getEntity('entity1');
      
      expect(entity).toBeDefined();
      expect(entity.id).toBe('entity1');
      expect(entity.type).toBe('person');
      expect(entity.attributes).toEqual({ name: 'John Doe' });
    });
    
    it('should return null when getting a non-existent entity', () => {
      const entity = ultralink.getEntity('nonexistent');
      
      expect(entity).toBeNull();
    });
    
    it('should update an entity with updateEntity method', () => {
      ultralink.addEntity('entity1', 'person', { 
        name: 'John Doe',
        age: 30
      });
      
      const updatedEntity = ultralink.updateEntity('entity1', { 
        name: 'John Smith',
        email: 'john@example.com'
      });
      
      expect(updatedEntity.attributes).toEqual({
        name: 'John Smith',
        age: 30,
        email: 'john@example.com'
      });
      
      const retrievedEntity = ultralink.getEntity('entity1');
      expect(retrievedEntity.attributes).toEqual({
        name: 'John Smith',
        age: 30,
        email: 'john@example.com'
      });
    });
    
    it('should throw an error when updating a non-existent entity', () => {
      expect(() => {
        ultralink.updateEntity('nonexistent', { name: 'New Name' });
      }).toThrow();
    });
    
    it('should delete an entity with deleteEntity method', () => {
      ultralink.addEntity('entity1', 'person', { name: 'John Doe' });
      
      const result = ultralink.deleteEntity('entity1');
      
      expect(result).toBe(true);
      expect(ultralink.entities.size).toBe(0);
      expect(ultralink.getEntity('entity1')).toBeNull();
    });
    
    it('should return false when deleting a non-existent entity', () => {
      const result = ultralink.deleteEntity('nonexistent');
      
      expect(result).toBe(false);
    });
    
    it('should find entities by type', () => {
      ultralink.addEntity('person1', 'person', { name: 'John Doe' });
      ultralink.addEntity('person2', 'person', { name: 'Jane Smith' });
      ultralink.addEntity('document1', 'document', { title: 'Report' });
      
      const people = ultralink.findEntities({ type: 'person' });
      
      expect(people.length).toBe(2);
      expect(people[0].type).toBe('person');
      expect(people[1].type).toBe('person');
    });
    
    it('should find entities by attribute value', () => {
      ultralink.addEntity('person1', 'person', { name: 'John Doe', age: 30 });
      ultralink.addEntity('person2', 'person', { name: 'Jane Smith', age: 25 });
      ultralink.addEntity('person3', 'person', { name: 'Bob Johnson', age: 30 });
      
      const age30 = ultralink.findEntities({ 
        attributes: { age: 30 }
      });
      
      expect(age30.length).toBe(2);
      expect(age30[0].attributes.age).toBe(30);
      expect(age30[1].attributes.age).toBe(30);
    });
    
    it('should find entities with custom filter', () => {
      ultralink.addEntity('person1', 'person', { name: 'John Doe', age: 30 });
      ultralink.addEntity('person2', 'person', { name: 'Jane Smith', age: 25 });
      ultralink.addEntity('person3', 'person', { name: 'Bob Johnson', age: 40 });
      
      const filtered = ultralink.findEntities({ 
        filter: entity => entity.attributes.age > 25 && entity.attributes.name.includes('o')
      });
      
      expect(filtered.length).toBe(2);
      expect(filtered[0].id).toBe('person1'); // John Doe
      expect(filtered[1].id).toBe('person3'); // Bob Johnson
    });
  });
  
  // Relationship management
  describe('Relationship Management', () => {
    let ultralink;
    
    beforeEach(() => {
      ultralink = new UltraLink();
      
      // Add some entities
      ultralink.addEntity('person1', 'person', { name: 'John Doe' });
      ultralink.addEntity('person2', 'person', { name: 'Jane Smith' });
      ultralink.addEntity('document1', 'document', { title: 'Report' });
    });
    
    it('should add a relationship with addLink method', () => {
      const relationship = ultralink.addLink('person1', 'document1', 'authored', { 
        date: '2023-01-15'
      });
      
      expect(ultralink.relationships.size).toBe(1);
      expect(relationship.source).toBe('person1');
      expect(relationship.target).toBe('document1');
      expect(relationship.type).toBe('authored');
      expect(relationship.attributes).toEqual({ date: '2023-01-15' });
    });
    
    it('should throw an error when adding a link with non-existent source', () => {
      expect(() => {
        ultralink.addLink('nonexistent', 'document1', 'authored');
      }).toThrow(/Source entity "nonexistent" not found/);
    });
    
    it('should throw an error when adding a link with non-existent target', () => {
      expect(() => {
        ultralink.addLink('person1', 'nonexistent', 'authored');
      }).toThrow(/Target entity "nonexistent" not found/);
    });
    
    it('should get relationships for an entity', () => {
      ultralink.addLink('person1', 'document1', 'authored', { date: '2023-01-15' });
      ultralink.addLink('person1', 'person2', 'knows', { since: '2020' });
      
      const relationships = ultralink.getRelationships('person1');
      
      expect(relationships.length).toBe(2);
      expect(relationships[0].source).toBe('person1');
      expect(relationships[0].type).toBe('authored');
      expect(relationships[1].source).toBe('person1');
      expect(relationships[1].type).toBe('knows');
    });
    
    it('should filter relationships by type', () => {
      ultralink.addLink('person1', 'document1', 'authored', { date: '2023-01-15' });
      ultralink.addLink('person1', 'person2', 'knows', { since: '2020' });
      
      const authoredOnly = ultralink.getRelationships('person1', { 
        type: 'authored'
      });
      
      expect(authoredOnly.length).toBe(1);
      expect(authoredOnly[0].type).toBe('authored');
    });
    
    it('should get incoming relationships (backlinks)', () => {
      ultralink.addLink('person1', 'document1', 'authored', { date: '2023-01-15' });
      ultralink.addLink('person2', 'document1', 'reviewed', { date: '2023-01-20' });
      
      const backlinks = ultralink.getBacklinks('document1');
      
      expect(backlinks.length).toBe(2);
      expect(backlinks[0].source).toBe('person1');
      expect(backlinks[0].type).toBe('authored');
      expect(backlinks[1].source).toBe('person2');
      expect(backlinks[1].type).toBe('reviewed');
    });
    
    it('should delete a relationship', () => {
      ultralink.addLink('person1', 'document1', 'authored', { date: '2023-01-15' });
      ultralink.addLink('person1', 'person2', 'knows', { since: '2020' });
      
      const result = ultralink.deleteLink('person1', 'document1', 'authored');
      
      expect(result).toBe(true);
      expect(ultralink.relationships.size).toBe(1);
      expect(ultralink.getRelationships('person1').length).toBe(1);
      expect(ultralink.getRelationships('person1')[0].type).toBe('knows');
    });
    
    it('should return false when deleting a non-existent relationship', () => {
      const result = ultralink.deleteLink('person1', 'document1', 'nonexistent');
      
      expect(result).toBe(false);
    });
  });
  
  // Data export
  describe('Data Export', () => {
    let ultralink;
    
    beforeEach(() => {
      ultralink = new UltraLink();
      
      // Add some entities
      ultralink.addEntity('person1', 'person', { 
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
      
      ultralink.addEntity('document1', 'document', { 
        title: 'Annual Report',
        year: 2023,
        pages: 42
      });
      
      ultralink.addEntity('topic1', 'topic', { 
        name: 'Financial Analysis',
        description: 'Methods for analyzing financial data'
      });
      
      // Add some relationships
      ultralink.addLink('person1', 'document1', 'authored', { 
        date: '2023-01-15',
        role: 'lead author'
      });
      
      ultralink.addLink('document1', 'topic1', 'covers', { 
        depth: 'detailed',
        chapters: [3, 4, 5]
      });
    });
    
    it('should export to JSON format', () => {
      const jsonString = ultralink.toJSON();
      
      expect(jsonString).toBeDefined();
      expect(typeof jsonString).toBe('string');
      
      // Parse the JSON string
      const json = JSON.parse(jsonString);
      
      expect(json.entities).toBeDefined();
      expect(json.relationships).toBeDefined();
      expect(Array.isArray(json.entities)).toBe(true);
      expect(Array.isArray(json.relationships)).toBe(true);
      
      // Check that entities are properly exported
      expect(json.entities.length).toBe(3);
      const person = json.entities.find(e => e.id === 'person1');
      expect(person).toBeDefined();
      expect(person.type).toBe('person');
      expect(person.attributes.name).toBe('John Doe');
      
      // Check that relationships are properly exported
      expect(json.relationships.length).toBe(2);
      const authorRel = json.relationships.find(r => 
        r.source === 'person1' && r.target === 'document1'
      );
      expect(authorRel).toBeDefined();
      expect(authorRel.type).toBe('authored');
    });

    it('should export to GraphML format', () => {
      const graphml = ultralink.toGraphML();
      
      expect(graphml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(graphml).toContain('<graphml xmlns="http://graphml.graphdrawing.org/xmlns"');
      expect(graphml).toContain('<graph id="G" edgedefault="directed">');
      
      // Check that nodes are included
      expect(graphml).toContain('<node id="person1">');
      expect(graphml).toContain('<node id="document1">');
      expect(graphml).toContain('<node id="topic1">');
      
      // Check that edges are included
      expect(graphml).toContain('<edge source="person1" target="document1">');
      expect(graphml).toContain('<edge source="document1" target="topic1">');
    });
    
    it('should export to CSV format', () => {
      const csv = ultralink.toCSV();
      
      // Check that we have both entities and relationships CSV
      expect(csv.entities).toBeDefined();
      expect(csv.relationships).toBeDefined();
      
      // Check entities CSV
      expect(csv.entities).toContain('id,type');
      expect(csv.entities).toContain('name');
      expect(csv.entities).toContain('email');
      expect(csv.entities).toContain('age');
      
      // Check that entity data is included
      const lines = csv.entities.split('\n');
      expect(lines.some(line => line.startsWith('person1,person') && line.includes('John Doe'))).toBe(true);
      expect(lines.some(line => line.startsWith('document1,document') && line.includes('Annual Report'))).toBe(true);
      
      // Check relationships CSV
      expect(csv.relationships).toContain('source,target,type');
      
      // Check that relationship data is included
      const relLines = csv.relationships.split('\n');
      expect(relLines.some(line => line.startsWith('person1,document1,authored'))).toBe(true);
      expect(relLines.some(line => line.startsWith('document1,topic1,covers'))).toBe(true);
    });
  });
  
  // Full-blob export/import
  describe('Full Blob Export/Import', () => {
    let ultralink;
    
    beforeEach(() => {
      ultralink = new UltraLink();
      
      // Add some entities
      ultralink.addEntity('person1', 'person', { name: 'John Doe' });
      ultralink.addEntity('document1', 'document', { title: 'Report' });
      
      // Add a relationship
      ultralink.addLink('person1', 'document1', 'authored', { date: '2023-01-15' });
    });
    
    it('should export and import a full blob', () => {
      // Export to full blob
      const blob = ultralink.toFullBlob();
      
      // Create a new UltraLink instance
      const newUltralink = new UltraLink();
      
      // Import the blob
      newUltralink.fromFullBlob(blob);
      
      // Verify the data was imported correctly
      expect(newUltralink.entities.size).toBe(ultralink.entities.size);
      expect(newUltralink.relationships.size).toBe(ultralink.relationships.size);
      
      // Verify a specific entity
      const person = newUltralink.getEntity('person1');
      expect(person).toBeDefined();
      expect(person.type).toBe('person');
      expect(person.attributes.name).toBe('John Doe');
      
      // Verify a specific relationship
      const relationships = newUltralink.getRelationships('person1');
      expect(relationships.length).toBe(1);
      expect(relationships[0].target).toBe('document1');
      expect(relationships[0].type).toBe('authored');
    });
    
    it('should export a compressed full blob', () => {
      // Export to compressed blob
      const compressedBlob = ultralink.toFullBlob({ compress: true });
      
      // Verify it's a string (base64 encoded)
      expect(typeof compressedBlob).toBe('string');
      
      // Create a new UltraLink instance
      const newUltralink = new UltraLink();
      
      // Import the compressed blob
      newUltralink.fromFullBlob(compressedBlob, { compressed: true });
      
      // Verify the data was imported correctly
      expect(newUltralink.entities.size).toBe(ultralink.entities.size);
      expect(newUltralink.relationships.size).toBe(ultralink.relationships.size);
    });
  });
}); 