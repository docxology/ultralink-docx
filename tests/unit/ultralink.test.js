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

    it('keeps live neighbors accurate when a recreated entity reuses relationship IDs', () => {
      for (const id of ['north', 'north_east', 'east_north', 'depot_hub', 'annex']) {
        ultralink.addEntity(id, 'location');
      }
      const outgoing = id => ultralink.getRelationships(id, { direction: 'outgoing' });
      const incoming = id => ultralink.getBacklinks(id);
      const trueOutgoing = ultralink.addLink('north', 'annex', 'route');
      const trueIncoming = ultralink.addLink('annex', 'north', 'route');
      const oldOutgoing = ultralink.addLink('north', 'depot_hub', 'east_route');
      const oldIncoming = ultralink.addLink('depot_hub', 'north', 'route_east');
      ultralink.addLink('depot_hub', 'depot_hub', 'loop');
      expect(outgoing('north')).toEqual([trueOutgoing, oldOutgoing]);
      expect(incoming('north')).toEqual([trueIncoming, oldIncoming]);

      expect(ultralink.deleteEntity('depot_hub')).toBe(true);
      expect(outgoing('north')).toEqual([trueOutgoing]);
      expect(incoming('north')).toEqual([trueIncoming]);
      expect(ultralink.getRelationships('depot_hub')).toEqual([]);
      expect([...ultralink.links.get('north').values()]).toEqual([trueOutgoing]);

      ultralink.addEntity('depot_hub', 'location');
      expect(ultralink.getRelationships('depot_hub')).toEqual([]);
      const newIncoming = ultralink.addLink('north_east', 'depot_hub', 'route');
      const newOutgoing = ultralink.addRelationship('depot_hub', 'east_north', 'route');
      const parallel = ultralink.addLink('depot_hub', 'east_north', 'express');
      const loop = ultralink.addLink('depot_hub', 'depot_hub', 'loop');
      expect(newIncoming.id).toBe(oldOutgoing.id);
      expect(newOutgoing.id).toBe(oldIncoming.id);
      expect(outgoing('north')).toEqual([trueOutgoing]);
      expect(incoming('north')).toEqual([trueIncoming]);
      expect(outgoing('north_east')).toEqual([newIncoming]);
      expect(outgoing('depot_hub')).toEqual([newOutgoing, parallel, loop]);
      expect(incoming('depot_hub')).toEqual([newIncoming, loop]);
      expect(incoming('east_north')).toEqual([newOutgoing, parallel]);
      expect(ultralink.getBacklinks('east_north', { type: 'express' })).toEqual([parallel]);

      expect(ultralink.deleteLink('north', 'depot_hub', 'east_route')).toBe(false);
      expect(ultralink.deleteLink('depot_hub', 'north', 'route_east')).toBe(false);
      expect(ultralink.deleteRelationship(loop.id)).toBe(true);
      expect(ultralink.deleteLink('depot_hub', 'east_north', 'route')).toBe(true);
      expect(outgoing('depot_hub')).toEqual([parallel]);
      expect(incoming('east_north')).toEqual([parallel]);
      expect(incoming('depot_hub')).toEqual([newIncoming]);
      expect(outgoing('north')).toEqual([trueOutgoing]);
      expect(incoming('north')).toEqual([trueIncoming]);
    });

    it('replaces a live compound ID without keeping it indexed under the old endpoints', () => {
      for (const id of ['a', 'a_b', 'd', 'c_d']) ultralink.addEntity(id, 'location');
      const original = ultralink.addLink('a', 'c_d', 'b');
      const replacement = ultralink.addLink('a_b', 'd', 'c');

      expect(replacement.id).toBe(original.id);
      expect(ultralink.getRelationship(original.id)).toEqual(replacement);
      expect(ultralink.getRelationships('a', { direction: 'outgoing' })).toEqual([]);
      expect(ultralink.getBacklinks('c_d')).toEqual([]);
      expect(ultralink.getRelationships('a_b', { direction: 'outgoing' })).toEqual([replacement]);
      expect(ultralink.getBacklinks('d')).toEqual([replacement]);
      expect(ultralink.links.get('a')?.get('c_d-b')).toBeUndefined();
    });

    it('removes a retyped edge from its legacy link entry without removing a parallel edge', () => {
      const authored = ultralink.addLink('person1', 'document1', 'co_authored');
      const reviewed = ultralink.addLink('person1', 'document1', 'reviewed');
      ultralink.updateRelationship(authored.id, { type: 'reviewed' });

      expect(ultralink.deleteRelationship(authored.id)).toBe(true);
      expect(ultralink.getBacklinks('document1')).toEqual([reviewed]);
      expect([...ultralink.links.get('person1').values()]).toEqual([reviewed]);
    });

    it('returns each self-loop once in combined lookups without dropping other incident edges', () => {
      const firstLoop = ultralink.addLink('person1', 'person1', 'knows');
      const secondLoop = ultralink.addLink('person1', 'person1', 'follows');
      const outward = ultralink.addLink('person1', 'person2', 'knows');
      const inward = ultralink.addLink('person2', 'person1', 'knows');

      expect(ultralink.getRelationships('person1')).toEqual([firstLoop, secondLoop, outward, inward]);
      expect(ultralink.getEntityRelationships('person1', { type: 'knows' })).toEqual([firstLoop, outward, inward]);
      expect(ultralink.getEntityRelationships('person1', { direction: 'outgoing' })).toEqual([firstLoop, secondLoop, outward]);
      expect(ultralink.getBacklinks('person1')).toEqual([firstLoop, secondLoop, inward]);
      expect(ultralink.deleteRelationship(firstLoop.id)).toBe(true);
      expect(ultralink.getRelationships('person1')).toEqual([secondLoop, outward, inward]);
    });

    it('deletes by current type after retyping without changing the relationship ID', () => {
      const original = ultralink.addLink('person1', 'document1', 'authored', { contribution: 'draft' });
      const id = original.id;
      const other = ultralink.addLink('person1', 'document1', 'reviewed');
      expect(ultralink.updateRelationship(id, { type: 'edited' })).toMatchObject({
        id, type: 'edited', attributes: { contribution: 'draft' }
      });
      expect(ultralink.deleteLink('person1', 'document1', 'authored')).toBe(false);
      expect(ultralink.getBacklinks('document1', { type: 'edited' })).toEqual([original]);
      expect(ultralink.deleteLink('person1', 'document1', 'edited')).toBe(true);
      expect(ultralink.getRelationship(id)).toBeNull();
      expect(ultralink.getBacklinks('document1')).toEqual([other]);
    });

    it('prefers the matching canonical ID and refuses an otherwise ambiguous current tuple', () => {
      const a = ultralink.addLink('person1', 'document1', 'authored');
      const b = ultralink.addLink('person1', 'document1', 'reviewed');
      const exact = ultralink.addLink('person1', 'document1', 'edited');
      ultralink.updateRelationship(a.id, { type: 'edited' });
      ultralink.updateRelationship(b.id, { type: 'edited' });

      expect(ultralink.deleteLink('person1', 'document1', 'edited')).toBe(true);
      expect(ultralink.getRelationship(exact.id)).toBeNull();
      expect(ultralink.getBacklinks('document1')).toEqual([a, b]);
      expect(ultralink.deleteLink('person1', 'document1', 'edited')).toBe(false);
      expect(ultralink.getBacklinks('document1')).toEqual([a, b]);
      expect(ultralink.deleteRelationship(a.id)).toBe(true);
      expect(ultralink.deleteLink('person1', 'document1', 'edited')).toBe(true);
      expect(ultralink.getBacklinks('document1')).toEqual([]);
    });

    it('keeps both legacy-key colliders live and restores the surviving legacy entry', () => {
      for (const id of ['anchor', 'station_north', 'station_north-old']) ultralink.addEntity(id, 'location');
      const key = 'station_north-old-route';
      const legacy = () => ultralink.links.get('anchor')?.get(key);
      const a = ultralink.addLink('anchor', 'station_north', 'old-route', { weight: 1 });
      const b = ultralink.addLink('anchor', 'station_north-old', 'route', { weight: 2 });
      expect(a.id).not.toBe(b.id);
      expect(legacy()).toBe(b);
      expect(ultralink.getRelationships('anchor')).toEqual([a, b]);

      const replacement = ultralink.addLink('anchor', 'station_north', 'old-route', { weight: 3 });
      expect(legacy()).toBe(replacement);
      expect(ultralink.deleteRelationship(b.id)).toBe(true);
      expect(legacy()).toBe(replacement);
      expect(ultralink.getRelationships('anchor')).toEqual([replacement]);
      const restoredWinner = ultralink.addLink('anchor', 'station_north-old', 'route');
      expect(legacy()).toBe(restoredWinner);
      expect(ultralink.deleteLink('anchor', 'station_north-old', 'route')).toBe(true);
      expect(legacy()).toBe(replacement);
      expect(ultralink.getBacklinks('station_north')).toEqual([replacement]);
      expect(ultralink.deleteEntity('station_north')).toBe(true);
      expect(legacy()).toBeUndefined();
      expect(ultralink.getRelationships('anchor')).toEqual([]);
    });

    it('exports both legacy-key colliders by actual endpoints and round-trips their unchanged JSON shape', () => {
      for (const id of ['anchor', 'station_north', 'station_north-old']) ultralink.addEntity(id, 'location');
      const a = ultralink.addLink('anchor', 'station_north', 'old-route', { weight: 1 });
      const b = ultralink.addLink('anchor', 'station_north-old', 'route', { weight: 2 });
      const json = ultralink.toJSON();
      const relationships = [
        { source: 'anchor', target: 'station_north', type: 'old-route', attributes: { weight: 1 } },
        { source: 'anchor', target: 'station_north-old', type: 'route', attributes: { weight: 2 } }
      ];
      expect(JSON.parse(json).relationships).toEqual(relationships);

      const imported = new UltraLink().fromFullBlob(json);
      expect(imported.toJSON({ asString: false }).relationships).toEqual(relationships);
      expect(imported.getBacklinks('station_north')[0].id).toBe(a.id);
      expect(imported.getBacklinks('station_north-old')[0].id).toBe(b.id);
      expect(imported.toRxInfer().split('\n').filter(line => line.includes('# Relationship:'))).toEqual([
        '    # Relationship: anchor (old-route) station_north',
        '    # Relationship: anchor (route) station_north-old'
      ]);
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