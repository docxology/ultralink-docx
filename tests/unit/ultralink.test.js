/**
 * Unit tests for the UltraLink class
 * 
 * These tests verify the core functionality of the UltraLink class,
 * including entity and relationship management, export capabilities,
 * and advanced features.
 */

const { UltraLink } = require('../../src');
const fs = require('fs');
const path = require('path');

describe('UltraLink', () => {
  // Basic UltraLink instance creation and properties
  describe('Constructor', () => {
    it('should create an UltraLink instance with default options', () => {
      const ultralink = new UltraLink();
      
      expect(ultralink.config).toBeDefined();
      expect(ultralink.config.preventOverwrite).toBe(true);
      expect(ultralink.config.timestampEntities).toBe(true);
      expect(ultralink.config.defaultRelationshipType).toBe('related_to');
      
      expect(ultralink.entities).toBeDefined();
      expect(ultralink.relationships).toBeDefined();
    });
    
    it('should create an UltraLink instance with custom options', () => {
      const ultralink = new UltraLink({
        preventOverwrite: false,
        timestampEntities: false,
        defaultRelationshipType: 'custom_type'
      });
      
      expect(ultralink.config.preventOverwrite).toBe(false);
      expect(ultralink.config.timestampEntities).toBe(false);
      expect(ultralink.config.defaultRelationshipType).toBe('custom_type');
    });
  });
  
  // Entity management
  describe('Entity Management', () => {
    let ultralink;
    
    beforeEach(() => {
      ultralink = new UltraLink({ preventOverwrite: true });
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
      ultralink.addEntity('person3', 'person', { name: 'Bob Johnson', age: 35 });
      
      const over30 = ultralink.findEntities({
        filter: entity => entity.attributes.age > 30
      });
      
      expect(over30.length).toBe(1);
      expect(over30[0].attributes.name).toBe('Bob Johnson');
    });
  });
  
  // Relationship management
  describe('Relationship Management', () => {
    let ultralink;
    
    beforeEach(() => {
      ultralink = new UltraLink({ preventOverwrite: true });
      ultralink.addEntity('person1', 'person', { name: 'John Doe' });
      ultralink.addEntity('person2', 'person', { name: 'Jane Smith' });
      ultralink.addEntity('document1', 'document', { title: 'Report' });
    });
    
    it('should add a relationship with addLink method', () => {
      const relationship = ultralink.addLink('person1', 'document1', 'authored', { date: '2023-01-15' });
      
      expect(ultralink.relationships.size).toBe(1);
      expect(relationship.source).toBe('person1');
      expect(relationship.target).toBe('document1');
      expect(relationship.type).toBe('authored');
      expect(relationship.attributes).toEqual({ date: '2023-01-15' });
    });
    
    it('should throw an error when adding a link with non-existent source', () => {
      expect(() => {
        ultralink.addLink('nonexistent', 'document1', 'authored');
      }).toThrow(/Source entity not found: nonexistent/);
    });
    
    it('should throw an error when adding a link with non-existent target', () => {
      expect(() => {
        ultralink.addLink('person1', 'nonexistent', 'authored');
      }).toThrow(/Target entity not found: nonexistent/);
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

    it('keeps live endpoint lookups correct after an entity is deleted and its link IDs are reused', () => {
      for (const id of ['north', 'north_east', 'east_north', 'depot_hub', 'annex']) {
        ultralink.addEntity(id, 'location');
      }
      const outgoing = ultralink.addLink('north', 'annex', 'supports');
      const incoming = ultralink.addLink('annex', 'north', 'supports');
      const removedOut = ultralink.addLink('north', 'depot_hub', 'east_route');
      const removedIn = ultralink.addLink('depot_hub', 'north', 'route_east');
      expect(ultralink.deleteEntity('depot_hub')).toBe(true);
      expect(ultralink.getBacklinks('north', { type: 'route_east' })).toEqual([]);
      expect(ultralink.getRelationships('north')).toEqual([outgoing, incoming]);

      ultralink.addEntity('depot_hub', 'location');
      const routeIn = ultralink.addLink('north_east', 'depot_hub', 'route');
      const routeOut = ultralink.addLink('depot_hub', 'east_north', 'route');
      expect(routeIn.id).toBe(removedOut.id);
      expect(routeOut.id).toBe(removedIn.id);
      expect(ultralink.getRelationships('north', { direction: 'outgoing' })).toEqual([outgoing]);
      expect(ultralink.getBacklinks('north')).toEqual([incoming]);
      expect(ultralink.getRelationships('north')).toEqual([outgoing, incoming]);
      expect(ultralink.getRelationships('depot_hub')).toEqual([routeOut, routeIn]);
      expect([...ultralink.links.get('north').values()]).toEqual([outgoing]);
    });

    it('returns a self-loop once in combined reads without collapsing reciprocal edges', () => {
      const outgoing = ultralink.addLink('person1', 'person2', 'knows');
      const loop = ultralink.addLink('person1', 'person1', 'knows');
      const incoming = ultralink.addLink('person2', 'person1', 'knows');
      expect(ultralink.getRelationships('person1', { direction: 'outgoing' })).toEqual([outgoing, loop]);
      expect(ultralink.getBacklinks('person1')).toEqual([loop, incoming]);
      expect(ultralink.getRelationships('person1', { type: 'knows' })).toEqual([outgoing, loop, incoming]);
      expect(ultralink.deleteRelationship(loop.id)).toBe(true);
      expect(ultralink.getRelationships('person1')).toEqual([outgoing, incoming]);
    });

    it('can delegate to insertion-tuple deletion without redispatching or deleting a peer on retry', () => {
      class DeletesByTuple extends UltraLink {
        deleteRelationship(id) {
          const edge = this.getRelationship(id);
          return edge ? this.deleteLink(edge.source, edge.target, 'drafted') : false;
        }
      }
      const graph = new DeletesByTuple();
      graph.addEntity('author', 'person');
      graph.addEntity('paper', 'document');
      const first = graph.addLink('author', 'paper', 'drafted', { weight: 1 });
      const peer = graph.addLink('author', 'paper', 'reviewed', { weight: 2 });
      graph.updateRelationship(first.id, { type: 'edited' });
      graph.updateRelationship(peer.id, { type: 'drafted' });

      expect(graph.deleteRelationship(first.id)).toBe(true);
      expect(graph.deleteLink('author', 'paper', 'drafted')).toBe(false);
      expect(graph.getRelationships('author')).toEqual([peer]);
      expect(graph.getBacklinks('paper')).toEqual([peer]);
    });

    it('replaces a shared ID in place when the legacy key also matches', () => {
      for (const id of ['a', 'y', 'y-x_y', 'other']) ultralink.addEntity(id, 'node');
      const earlier = ultralink.addLink('a', 'y', 'x_y-x');
      const neighbor = ultralink.addLink('a', 'other', 'route');
      const legacy = ultralink.links.get('a');
      const latest = ultralink.addLink('a', 'y-x_y', 'x');
      expect(latest.id).toBe(earlier.id);
      expect(ultralink.deleteLink('a', 'y', 'x_y-x')).toBe(false);
      expect(ultralink.links.get('a')).toBe(legacy);
      expect([...legacy]).toEqual([['y-x_y-x', latest], ['other-route', neighbor]]);
      expect(ultralink.getBacklinks('y')).toEqual([]);
      expect(ultralink.getRelationships('a')).toEqual([latest, neighbor]);
    });

    it('reveals a live shadow in the same legacy slot and keeps the empty source map', () => {
      for (const id of ['a', 'station', 'station-north', 'other']) ultralink.addEntity(id, 'node');
      const earlier = ultralink.addLink('a', 'station', 'north-route');
      const neighbor = ultralink.addLink('a', 'other', 'route');
      const latest = ultralink.addLink('a', 'station-north', 'route');
      const legacy = ultralink.links.get('a');
      expect([...legacy.values()]).toEqual([latest, neighbor]);
      expect(ultralink.deleteEntity('station-north')).toBe(true);
      expect([...legacy.values()]).toEqual([earlier, neighbor]);
      expect(ultralink.deleteRelationship(earlier.id)).toBe(true);
      expect(ultralink.deleteLink('a', 'other', 'route')).toBe(true);
      expect(ultralink.links.get('a')).toBe(legacy);
      expect([...legacy]).toEqual([]);
    });
  });
  
  // Data export
  describe('Data Export', () => {
    let ultralink;
    
    beforeEach(() => {
      ultralink = new UltraLink({ preventOverwrite: true });
    });
    
    it('should export to JSON format', () => {
      ultralink.addEntity('person1', 'person', { name: 'John Doe' });
      ultralink.addEntity('document1', 'document', { title: 'Report' });
      ultralink.addLink('person1', 'document1', 'authored');
      
      const json = ultralink.toJSON();
      const data = JSON.parse(json);
      
      expect(data.entities).toBeDefined();
      expect(data.relationships).toBeDefined();
      expect(data.entities.length).toBe(2);
      expect(data.relationships.length).toBe(1);
    });
    
    it('should export to GraphML format', () => {
      ultralink.addEntity('person1', 'person', { name: 'John Doe' });
      ultralink.addEntity('document1', 'document', { title: 'Report' });
      ultralink.addLink('person1', 'document1', 'authored');
      
      const graphml = ultralink.toGraphML();
      
      expect(graphml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(graphml).toContain('<graphml');
      expect(graphml).toContain('<node id="person1"');
      expect(graphml).toContain('<node id="document1"');
      expect(graphml).toContain('<edge source="person1" target="document1"');
    });
    
    it('should export to CSV format', () => {
      ultralink.addEntity('person1', 'person', { name: 'John Doe' });
      ultralink.addEntity('document1', 'document', { title: 'Report' });
      ultralink.addLink('person1', 'document1', 'authored');
      
      const csv = ultralink.toCSV();
      
      expect(csv).toBeDefined();
      expect(csv.entities).toContain('id,type,name');
      expect(csv.relationships).toContain('source,target,type');
    });
  });
  
  // Full blob export/import
  describe('Full Blob Export/Import', () => {
    let ultralink;
    
    beforeEach(() => {
      ultralink = new UltraLink({ preventOverwrite: true });
    });
    
    it('should export and import a full blob', () => {
      // Add test data
      ultralink.addEntity('person1', 'person', { name: 'John Doe' });
      ultralink.addEntity('document1', 'document', { title: 'Report' });
      ultralink.addLink('person1', 'document1', 'authored');
      
      // Export to blob
      const blob = ultralink.toFullBlob();
      
      // Create new instance and import
      const newUltralink = new UltraLink();
      newUltralink.fromFullBlob(blob);
      
      // Verify imported data
      expect(newUltralink.entities.size).toBe(2);
      expect(newUltralink.relationships.size).toBe(1);
      
      const person = newUltralink.getEntity('person1');
      expect(person.attributes.name).toBe('John Doe');
      
      const document = newUltralink.getEntity('document1');
      expect(document.attributes.title).toBe('Report');
    });

    it('keeps distinct legacy slots after receiver normalization without a wrong endpoint lookup', () => {
      class Normalizing extends UltraLink {
        addEntity(id, type, attributes) {
          super.addEntity(id, type, attributes);
          return this;
        }

        addRelationship(source, target, type, attributes) {
          super.addRelationship(source, target, type.toLowerCase(), attributes);
        }
      }
      for (const id of ['a', 'c_d', 'a_b', 'd']) ultralink.addEntity(id, 'node');
      ultralink.addLink('a', 'c_d', 'b_M', { weight: 1 });
      const later = ultralink.addLink('a_b', 'd', 'draft', { weight: 2 });
      ultralink.updateRelationship(later.id, { type: 'M_c' });

      for (const input of [ultralink.toJSON(), ultralink.toFullBlob()]) {
        const receiver = new Normalizing();
        receiver.metadata = { provenance: 'receiver' };
        expect(receiver.fromFullBlob(input)).toBe(receiver);
        expect(receiver.metadata).toEqual({ provenance: 'receiver' });
        expect(receiver.links.get('a').get('c_d-b_m').attributes.weight).toBe(1);
        const winner = receiver.links.get('a_b').get('d-m_c');
        expect(receiver.getRelationship('a_b_m_c_d')).toBe(winner);
        expect(winner.attributes.weight).toBe(2);
        expect(receiver.getRelationships('a')).toEqual([]);
        expect(receiver.getBacklinks('c_d')).toEqual([]);
        expect(receiver.getBacklinks('d')).toEqual([winner]);
        expect(receiver.deleteLink('a', 'c_d', 'b_m')).toBe(false);
        expect(receiver.deleteLink('a_b', 'd', 'm_c')).toBe(true);
        expect(receiver.deleteLink('a_b', 'd', 'm_c')).toBe(false);
        expect(receiver.links.get('a').get('c_d-b_m').attributes.weight).toBe(1);
        expect(receiver.deleteEntity('c_d')).toBe(true);
        expect([...receiver.links.get('a')]).toEqual([]);
      }
    });
    
    it('should export a compressed full blob', () => {
      // Add test data
      ultralink.addEntity('person1', 'person', { name: 'John Doe' });
      ultralink.addEntity('document1', 'document', { title: 'Report' });
      ultralink.addLink('person1', 'document1', 'authored');
      
      // Export compressed blob
      const blob = ultralink.toFullBlob({ compress: true });
      
      // Create new instance and import
      const newUltralink = new UltraLink();
      newUltralink.fromFullBlob(blob);
      
      // Verify imported data
      expect(newUltralink.entities.size).toBe(2);
      expect(newUltralink.relationships.size).toBe(1);
      
      const person = newUltralink.getEntity('person1');
      expect(person.attributes.name).toBe('John Doe');
      
      const document = newUltralink.getEntity('document1');
      expect(document.attributes.title).toBe('Report');
    });
  });
}); 