/**
 * Unit tests for the Entity class
 * 
 * These tests verify the behavior of the Entity class in isolation,
 * ensuring that all methods and properties work as expected.
 */

const { Entity, Link } = require('../../src/core/types');

describe('Entity', () => {
  // Basic entity creation and properties
  describe('Constructor', () => {
    it('should create an entity with the specified properties', () => {
      const entity = new Entity('entity1', 'person', { name: 'John Doe' });
      
      expect(entity.id).toBe('entity1');
      expect(entity.type).toBe('person');
      expect(entity.attributes).toEqual({ name: 'John Doe' });
      expect(entity.links).toEqual([]);
    });
    
    it('should create an entity with default empty attributes when not provided', () => {
      const entity = new Entity('entity1', 'person');
      
      expect(entity.attributes).toEqual({});
    });
    
    it('should handle complex attribute objects', () => {
      const attributes = {
        name: 'John Doe',
        birthDate: '1980-01-01',
        contact: {
          email: 'john@example.com',
          phone: '123-456-7890'
        },
        tags: ['developer', 'writer']
      };
      
      const entity = new Entity('entity1', 'person', attributes);
      
      expect(entity.attributes).toEqual(attributes);
    });
  });
  
  // Link management
  describe('Link Management', () => {
    let entity;
    
    beforeEach(() => {
      entity = new Entity('source', 'document', { title: 'Source Document' });
    });
    
    it('should add a link with addLink method', () => {
      const link = entity.addLink('target', 'references');
      
      expect(entity.links.length).toBe(1);
      expect(entity.links[0]).toBe(link);
      expect(link.source).toBe('source');
      expect(link.target).toBe('target');
      expect(link.type).toBe('references');
    });
    
    it('should use default link type when not specified', () => {
      const link = entity.addLink('target');
      
      expect(link.type).toBe('default');
    });
    
    it('should store metadata with links', () => {
      const metadata = { 
        date: '2023-01-01',
        importance: 'high',
        note: 'Important reference'
      };
      
      const link = entity.addLink('target', 'references', metadata);
      
      expect(link.metadata).toEqual(metadata);
    });
    
    it('should add multiple links to different targets', () => {
      entity.addLink('target1', 'references');
      entity.addLink('target2', 'mentions');
      entity.addLink('target3', 'relates_to');
      
      expect(entity.links.length).toBe(3);
      expect(entity.links[0].target).toBe('target1');
      expect(entity.links[1].target).toBe('target2');
      expect(entity.links[2].target).toBe('target3');
    });
    
    it('should allow multiple links to the same target with different types', () => {
      entity.addLink('target', 'references');
      entity.addLink('target', 'mentions');
      
      expect(entity.links.length).toBe(2);
      expect(entity.links[0].target).toBe('target');
      expect(entity.links[0].type).toBe('references');
      expect(entity.links[1].target).toBe('target');
      expect(entity.links[1].type).toBe('mentions');
    });
  });
  
  // JSON serialization
  describe('JSON Serialization', () => {
    it('should properly serialize an entity to JSON', () => {
      const entity = new Entity('entity1', 'person', { name: 'John Doe' });
      entity.addLink('entity2', 'knows', { since: '2020' });
      entity.addLink('entity3', 'works_with');
      
      const json = entity.toJSON();
      
      expect(json).toEqual({
        id: 'entity1',
        type: 'person',
        attributes: { name: 'John Doe' },
        links: [
          {
            source: 'entity1',
            target: 'entity2',
            type: 'knows',
            metadata: { since: '2020' }
          },
          {
            source: 'entity1',
            target: 'entity3',
            type: 'works_with',
            metadata: {}
          }
        ]
      });
    });
    
    it('should handle empty entities correctly', () => {
      const entity = new Entity('empty', 'unknown');
      
      const json = entity.toJSON();
      
      expect(json).toEqual({
        id: 'empty',
        type: 'unknown',
        attributes: {},
        links: []
      });
    });
  });
  
  // Edge cases and error handling
  describe('Edge Cases', () => {
    it('should handle entities with special characters in IDs', () => {
      const entity = new Entity('entity/with.special~characters', 'test');
      
      expect(entity.id).toBe('entity/with.special~characters');
    });
    
    it('should handle very long attribute values', () => {
      const longText = 'a'.repeat(10000);
      const entity = new Entity('long', 'document', { content: longText });
      
      expect(entity.attributes.content.length).toBe(10000);
    });
    
    it('should maintain link order as added', () => {
      const entity = new Entity('source', 'document');
      
      // Add links in specific order
      entity.addLink('target1', 'first');
      entity.addLink('target2', 'second');
      entity.addLink('target3', 'third');
      
      expect(entity.links.map(link => link.target)).toEqual(['target1', 'target2', 'target3']);
      expect(entity.links.map(link => link.type)).toEqual(['first', 'second', 'third']);
    });
  });
}); 