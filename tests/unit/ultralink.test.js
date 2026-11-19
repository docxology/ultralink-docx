/**
 * Unit tests for the UltraLink class
 * 
 * These tests verify the core functionality of the UltraLink class,
 * including entity and relationship management, export capabilities,
 * and advanced features.
 */

const { UltraLink } = require('../../src');
const { createEnhancedResearchTeamDataset } = require('../fixtures/research-team-llm');
const fs = require('fs');
const path = require('path');
const { runInNewContext } = require('node:vm');

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

    it('finds a retyped edge by current type and deletes it by its stable ID', () => {
      const original = ultralink.addLink('person1', 'document1', 'authored', { contribution: 'draft' });
      const id = original.id;
      const other = ultralink.addLink('person1', 'document1', 'reviewed');
      expect(ultralink.updateRelationship(id, { type: 'edited' })).toMatchObject({
        id, type: 'edited', attributes: { contribution: 'draft' }
      });
      expect(ultralink.getBacklinks('document1', { type: 'edited' })).toEqual([original]);
      expect(ultralink.deleteLink('person1', 'document1', 'edited')).toBe(false);
      expect(ultralink.deleteRelationship(id)).toBe(true);
      expect(ultralink.getRelationship(id)).toBeNull();
      expect(ultralink.getBacklinks('document1')).toEqual([other]);
    });

    it('retries an insertion-tuple deletion without deleting a retyped parallel edge', () => {
      const drafted = ultralink.addLink('person1', 'document1', 'drafted', { weight: 1 });
      const reviewed = ultralink.addLink('person1', 'document1', 'reviewed', { weight: 2 });
      ultralink.updateRelationship(drafted.id, { type: 'edited' });
      ultralink.updateRelationship(reviewed.id, { type: 'drafted' });

      expect(ultralink.deleteLink('person1', 'document1', 'drafted')).toBe(true);
      expect(ultralink.getRelationship(drafted.id)).toBeNull();
      expect(ultralink.deleteLink('person1', 'document1', 'drafted')).toBe(false);
      expect(ultralink.getRelationship(reviewed.id)).toMatchObject({
        id: reviewed.id, type: 'drafted', attributes: { weight: 2 }
      });
      expect(ultralink.getBacklinks('document1', { type: 'drafted' })).toEqual([reviewed]);
      expect(ultralink.getRelationships('person1', { direction: 'outgoing' })).toEqual([reviewed]);
    });

    it('never uses the current type to select a different edge for tuple deletion', () => {
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
      expect(ultralink.deleteLink('person1', 'document1', 'edited')).toBe(false);
      expect(ultralink.getBacklinks('document1')).toEqual([b]);
      expect(ultralink.deleteLink('person1', 'document1', 'reviewed')).toBe(true);
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

    it('replaces a reused compound ID in place when it retains the legacy key', () => {
      for (const id of ['a', 'y', 'y-x_y']) ultralink.addEntity(id, 'location');
      const first = ultralink.addLink('a', 'y', 'x_y-x');
      const legacy = ultralink.links.get('a');
      const replacement = ultralink.addLink('a', 'y-x_y', 'x');
      expect(replacement.id).toBe(first.id);
      expect(legacy.get('y-x_y-x')).toBe(replacement);
      expect(ultralink.getBacklinks('y')).toEqual([]);
      expect(ultralink.getBacklinks('y-x_y')).toEqual([replacement]);

      const independent = ultralink.addLink('a', 'document1', 'route');
      const restored = ultralink.addLink('a', 'y', 'x_y-x');
      expect([...ultralink.links.get('a').values()]).toEqual([restored, independent]);
      expect(ultralink.getBacklinks('y')).toEqual([restored]);
      expect(ultralink.getBacklinks('y-x_y')).toEqual([]);
    });

    it('keeps the live source map after deleting its last link, until the source is deleted', () => {
      ultralink.addEntity('s', 'node');
      ultralink.addEntity('t', 'node');
      ultralink.addLink('s', 't', 'route');
      ultralink.addLink('t', 'document1', 'route');
      const legacy = ultralink.links.get('s');

      expect(ultralink.deleteLink('s', 't', 'route')).toBe(true);
      expect(ultralink.getEntity('s').id).toBe('s');
      expect(ultralink.links.get('s')).toBe(legacy);
      expect(legacy.size).toBe(0);
      expect(ultralink.getBacklinks('t')).toEqual([]);
      const archived = new UltraLink().fromFullBlob(ultralink.toJSON({ lossless: true }));
      expect(archived.links.get('s').size).toBe(0);
      expect([...archived.links.keys()]).toEqual(['s', 't']);
      const replacement = ultralink.addLink('s', 't', 'route');
      expect(legacy.get('t-route')).toBe(replacement);
      expect(ultralink.deleteEntity('s')).toBe(true);
      expect(ultralink.links.has('s')).toBe(false);
    });

    it('preserves legacy map key iteration when a reused ID moves to a different key', () => {
      for (const id of ['a', 'c_d', 'other', 'd']) ultralink.addEntity(id, 'node');
      const old = ultralink.addLink('a', 'c_d', 'b');
      const other = ultralink.addLink('a', 'other', 'route');
      const replacement = ultralink.addLink('a', 'd', 'b_c');
      expect(replacement.id).toBe(old.id);

      for (const input of [ultralink.toJSON({ lossless: true }), ultralink.toFullBlob()]) {
        const restored = new UltraLink().fromFullBlob(input);
        const legacy = restored.links.get('a');
        expect([...legacy]).toEqual([['other-route', other], ['d-b_c', replacement]]);
        expect(restored.getRelationships('a', { direction: 'outgoing' })).toEqual([replacement, other]);
        expect(restored.deleteLink('a', 'd', 'b_c')).toBe(true);
        expect([...legacy]).toEqual([['other-route', other]]);
      }
    });

    it('round-trips legacy-key colliders without changing their lookup or write order', () => {
      for (const id of ['anchor', 'station_north', 'station_north-old']) ultralink.addEntity(id, 'location');
      ultralink.addLink('anchor', 'station_north', 'old-route');
      const b = ultralink.addLink('anchor', 'station_north-old', 'route', { weight: 2 });
      const a = ultralink.addLink('anchor', 'station_north', 'old-route', { weight: 1 });
      ultralink.updateRelationship(b.id, { type: 'express' });
      const key = 'station_north-old-route';
      expect(ultralink.links.get('anchor').get(key)).toBe(a);
      const json = ultralink.toJSON({ lossless: true });
      const relationships = [
        { id: a.id, source: 'anchor', target: 'station_north', type: 'old-route', attributes: { weight: 1 }, metadata: a.metadata },
        { id: b.id, source: 'anchor', target: 'station_north-old', type: 'express', attributes: { weight: 2 }, metadata: b.metadata }
      ];
      expect(JSON.parse(json).relationships).toEqual(relationships);

      const imported = new UltraLink().fromFullBlob(json);
      expect(imported.toJSON({ asString: false, lossless: true }).relationships).toEqual(relationships);
      expect(imported.getBacklinks('station_north')[0].id).toBe(a.id);
      expect(imported.getBacklinks('station_north-old')[0].id).toBe(b.id);
      expect(imported.links.get('anchor').get(key).id).toBe(a.id);
      expect(imported.toRxInfer().split('\n').filter(line => line.includes('# Relationship:'))).toEqual([
        '    # Relationship: anchor (old-route) station_north',
        '    # Relationship: anchor (express) station_north-old'
      ]);
      expect(imported.deleteRelationship(a.id)).toBe(true);
      expect(imported.links.get('anchor').get(key).id).toBe(b.id);
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

    it('retains receiver metadata when a legacy mapped graph omits it', () => {
      ultralink.metadata = { name: 'Existing graph catalog', provenance: { source: 'local catalog' } };
      ultralink.addEntity('stale', 'person');
      const legacy = {
        entities: { author: { id: 'author_team', type: 'person' }, paper: { id: 'paper_v1', type: 'document' } },
        relationships: { link: { source: 'author_team', target: 'paper_v1', type: 'reviewed', attributes: { weight: 2 } } }
      };

      ultralink.fromFullBlob(legacy);
      expect(ultralink.getEntity('stale')).toBeNull();
      expect(ultralink.getBacklinks('paper_v1')).toMatchObject([{ type: 'reviewed', attributes: { weight: 2 } }]);
      expect(ultralink.toJSON({ asString: false }).metadata).toMatchObject({
        name: 'Existing graph catalog', provenance: { source: 'local catalog' }
      });

      const metadata = { name: 'Imported graph', provenance: { source: 'archive' } };
      ultralink.fromFullBlob({ json: JSON.stringify({ ...legacy, metadata }) });
      expect(ultralink.toJSON({ asString: false }).metadata).toMatchObject(metadata);
    });

    it.each([
      ['JSON', graph => graph.toJSON()],
      ['Full Blob', graph => graph.toFullBlob()]
    ])('keeps receiver metadata when a stock %s has only the export summary', (_format, exportGraph) => {
      const source = new UltraLink();
      source.addEntity('author_team', 'person');
      source.addEntity('paper_v1', 'document');
      const edge = source.addLink('author_team', 'paper_v1', 'reviewed', { weight: 2 });
      edge.metadata.created = '2000-01-01T00:00:00.000Z';
      const { metadata: rowMetadata, ...row } = edge;
      const expected = _format === 'JSON' ? row : { ...row, metadata: rowMetadata };
      const catalog = { name: 'Existing graph catalog', provenance: { source: 'local catalog' } };
      ultralink.metadata = catalog;
      ultralink.addEntity('stale', 'person');

      ultralink.fromFullBlob(exportGraph(source));
      expect(ultralink.getEntity('stale')).toBeNull();
      expect(ultralink.getBacklinks('paper_v1')).toMatchObject([expected]);
      expect(ultralink.toJSON({ asString: false }).metadata).toMatchObject(catalog);

      source.metadata = { name: 'Imported catalog', provenance: { source: 'archive' } };
      ultralink.fromFullBlob(exportGraph(source));
      expect(ultralink.getBacklinks('paper_v1')).toMatchObject([expected]);
      expect(ultralink.metadata).toEqual(source.metadata);
    });

    it.each([
      ['JSON', graph => graph.toJSON()],
      ['Full Blob', graph => graph.toFullBlob()]
    ])('merges bundled Research Team metadata by key when importing %s', (_format, exportGraph) => {
      const source = createEnhancedResearchTeamDataset();
      const catalog = { name: 'Local catalog', provenance: { source: 'local registry' } };
      ultralink.metadata = { ...catalog, graph_metrics: { stale: true } };

      ultralink.fromFullBlob(exportGraph(source));

      const { entities, relationships } = ultralink.toJSON({ asString: false });
      const exported = source.toJSON({ asString: false });
      expect(entities).toEqual(exported.entities);
      expect(relationships).toEqual(exported.relationships);
      expect(ultralink.metadata).toEqual({ ...catalog, ...source.metadata });
    });

    it('restores independent retyped edges with stable IDs, metadata and deletion indexes', () => {
      ultralink.metadata = { name: 'Round trip', provenance: { source: 'review' } };
      const author = ultralink.addEntity('author_team', 'person', { name: 'Author' });
      Object.assign(author.metadata, { created: '2020-01-01T00:00:00.000Z', locale: 'en' });
      ultralink.addEntity('paper_v1', 'document');
      const drafted = ultralink.addLink(author.id, 'paper_v1', 'first_draft', { weight: 1, notes: ['edit'] });
      Object.assign(drafted.metadata, { created: '2020-01-02T00:00:00.000Z', provenance: { batch: 1 } });
      const reviewed = ultralink.addLink(author.id, 'paper_v1', 'reviewed', { weight: 2 });
      ultralink.updateRelationship(drafted.id, { type: 'reviewed' });
      const json = ultralink.toJSON({ lossless: true });
      const blob = ultralink.toFullBlob();
      const rows = JSON.parse(json);
      expect(rows.relationships).toEqual([drafted, reviewed]);
      expect(rows.entities.find(entity => entity.id === author.id)).toEqual(author);

      for (const input of [json, blob, { json }, { 'full-export.json': JSON.stringify(blob) },
        { ...rows, entities: { author: rows.entities[0], paper: rows.entities[1] },
          relationships: { draft: rows.relationships[0], review: rows.relationships[1] } }]) {
        const restored = new UltraLink().fromFullBlob(input);
        expect(restored.getEntity(author.id)).toEqual(author);
        expect(restored.getBacklinks('paper_v1', { type: 'reviewed' })).toEqual([drafted, reviewed]);
        expect(restored.getRelationship(drafted.id)).toEqual(drafted);
        expect(restored.deleteLink(author.id, 'paper_v1', 'first_draft')).toBe(true);
        expect(restored.getRelationships(author.id, { direction: 'outgoing' })).toEqual([reviewed]);
        expect(restored.getBacklinks('paper_v1')).toEqual([reviewed]);
      }

      const restored = new UltraLink().fromFullBlob(blob);
      expect(restored.toJSON({ asString: false }).metadata).toMatchObject(ultralink.metadata);

      const compact = JSON.parse(ultralink.toJSON({ lossless: true, includeMetadata: false }));
      expect(compact.entities[0]).not.toHaveProperty('metadata');
      expect(compact.relationships[0]).not.toHaveProperty('metadata');
      expect(new UltraLink().fromFullBlob(compact).getBacklinks('paper_v1').map(({ id }) => id))
        .toEqual([drafted.id, reviewed.id]);
    });

    describe.each([
      ['JSON', graph => graph.toJSON()],
      ['Full Blob JSON', graph => ({ json: JSON.parse(graph.toJSON()) })]
    ])('legacy %s without stored IDs', (_format, exportGraph) => {
      it.each([['first_draft', 'reviewed'], ['reviewed', 'first_draft']])(
        'retains the last compound ID owner for insertion order %s then %s', (first, last) => {
          const source = 'author_team';
          const target = 'paper_v1';
          ultralink.addEntity(source, 'person');
          ultralink.addEntity(target, 'document');
          const inserted = {};
          for (const type of [first, last]) {
            inserted[type] = ultralink.addLink(source, target, type, { weight: type === 'first_draft' ? 1 : 2 });
          }
          ultralink.updateRelationship(inserted.first_draft.id, { type: 'reviewed' });

          const restored = new UltraLink().fromFullBlob(exportGraph(ultralink));
          const edges = restored.getBacklinks(target);
          expect(edges.map(edge => edge.attributes.weight)).toEqual([first, last].map(type => inserted[type].attributes.weight));
          expect(restored.getRelationships(source, { direction: 'outgoing' })).toEqual(edges);
          expect(restored.getRelationship(inserted.reviewed.id)).toEqual(edges[1]);
          expect(restored.deleteLink(source, target, 'reviewed')).toBe(true);
          expect(restored.deleteLink(source, target, 'reviewed')).toBe(false);
          expect(restored.getRelationships(source, { direction: 'outgoing' })).toEqual([edges[0]]);
          expect(restored.getBacklinks(target)).toEqual([edges[0]]);
        }
      );
    });

    it.each([
      ['root JSON', graph => JSON.stringify(graph)],
      ['wrapped graph', graph => ({ json: graph })]
    ])('derives relationship IDs from the current tuple in unversioned %s', (_format, wrap) => {
      const payload = {
        entities: [{ id: 'a', type: 'node' }, { id: 'b', type: 'node' }],
        relationships: [{ id: 'a_draft_b', source: 'a', target: 'b', type: 'reviewed', attributes: { revision: 1 } }]
      };
      ultralink.fromFullBlob(wrap(payload));
      expect(ultralink.getRelationship('a_draft_b')).toBeNull();
      expect(ultralink.getRelationship('a_reviewed_b').attributes).toEqual({ revision: 1 });
      expect(ultralink.deleteLink('a', 'b', 'reviewed')).toBe(true);
      const replacement = ultralink.addLink('a', 'b', 'reviewed', { revision: 2 });
      expect(ultralink.getBacklinks('b')).toEqual([replacement]);
      expect(ultralink.getRelationships('a', { direction: 'outgoing' })).toEqual([replacement]);
    });

    it('preserves directional index order and canonical order after live compound ID reuse', () => {
      for (const id of ['a', 'c_d', 'q', 'd', 'a_b', 'other']) ultralink.addEntity(id, 'node');
      ultralink.addLink('a', 'c_d', 'b');
      const incoming = ultralink.addLink('q', 'd', 'route');
      const outgoing = ultralink.addLink('a_b', 'other', 'route');
      const reused = ultralink.addLink('a_b', 'd', 'c');

      for (const input of [ultralink.toJSON({ lossless: true }), ultralink.toFullBlob()]) {
        const restored = new UltraLink().fromFullBlob(input);
        expect([...restored.relationships.values()]).toEqual([reused, incoming, outgoing]);
        expect(restored.getBacklinks('d')).toEqual([incoming, reused]);
        expect(restored.getRelationships('a_b', { direction: 'outgoing' })).toEqual([outgoing, reused]);
        expect(restored.deleteLink('a_b', 'd', 'c')).toBe(true);
        expect(restored.getBacklinks('d')).toEqual([incoming]);
        expect(restored.getRelationships('a_b', { direction: 'outgoing' })).toEqual([outgoing]);
      }
    });

    it('archives JSON-safe row metadata beside same- and cross-realm BigInts and cycles', () => {
      const author = ultralink.addEntity('a', 'node');
      ultralink.addEntity('b', 'node');
      author.metadata.sequence = 100n;
      author.metadata.boxedSequence = Object(13n);
      author.metadata.locale = 'en';
      const draft = ultralink.addLink('a', 'b', 'draft', { weight: 2 });
      ultralink.updateRelationship(draft.id, { type: 'reviewed' });
      const foreign = runInNewContext('Object(21n)');
      const provenance = { source: 'local', sequence: foreign, samples: [1, foreign, 2] };
      provenance.self = provenance;
      draft.metadata.provenance = provenance;

      for (const archive of [
        ultralink.toJSON({ lossless: true }),
        ultralink.toFullBlob(),
        ultralink.toFullBlob({ compressed: true }),
        ultralink.toFullBlob({ compressed: true, throwOnError: true })
      ]) {
        const restored = new UltraLink().fromFullBlob(archive);
        expect(restored.getEntity('a').metadata).toMatchObject({ locale: 'en' });
        expect(restored.getEntity('a').metadata).not.toHaveProperty('sequence');
        expect(restored.getEntity('a').metadata).not.toHaveProperty('boxedSequence');
        const edge = restored.getRelationship(draft.id);
        expect(edge).toMatchObject({ type: 'reviewed', attributes: { weight: 2 } });
        expect(edge.metadata.provenance).toEqual({ source: 'local', samples: [1, null, 2] });
        expect(restored.getBacklinks('b')).toEqual([edge]);
      }
      expect(author.metadata.sequence).toBe(100n);
      expect(provenance.sequence).toBe(foreign);
      expect(provenance.self).toBe(provenance);
    });

    it('isolates failing metadata fields without losing serializable siblings in graph archives', () => {
      const dt = new Date('2025-01-02T03:04:05Z');
      const unreadable = new Proxy(dt, {});
      const details = {
        date: dt,
        invalid: unreadable,
        get inaccessible() { throw new Error('metadata getter'); },
        throwingHook: { toJSON() { throw new Error('metadata hook'); } },
        projected: { toJSON(key) { return { key, present: true, invalid: unreadable }; } },
        items: [unreadable, dt]
      };
      const author = ultralink.addEntity('a', 'person', { name: 'Author' });
      ultralink.addEntity('b', 'paper');
      const edge = ultralink.addLink('a', 'b', 'reviewed', { revision: 1 });
      author.metadata.details = details;
      edge.metadata.details = details;
      const expected = {
        date: dt.toISOString(), projected: { key: 'projected', present: true }, items: [null, dt.toISOString()]
      };
      if (typeof JSON.rawJSON === 'function') {
        details.raw = JSON.rawJSON('21');
        details.rawFromHook = { toJSON() { return JSON.rawJSON('42'); } };
        details.rawLookalike = { rawJSON: '7' };
        Object.assign(expected, { raw: 21, rawFromHook: 42, rawLookalike: { rawJSON: '7' } });
      }

      const plain = ultralink.toJSON({ asString: false });
      expect(plain.entities[0]).not.toHaveProperty('metadata');
      expect(plain.relationships[0]).toEqual({ source: 'a', target: 'b', type: 'reviewed', attributes: { revision: 1 } });
      const optional = ultralink.toJSON({ asString: false, includeMetadata: true });
      expect(JSON.parse(JSON.stringify(optional.entities[0].metadata.details))).toEqual(expected);

      for (const archive of [
        ultralink.toJSON({ lossless: true, asString: false }),
        ultralink.toJSON({ lossless: true }),
        ultralink.toFullBlob(),
        ultralink.toFullBlob({ compressed: true }),
        ultralink.toFullBlob({ compressed: true, throwOnError: true })
      ]) {
        const restored = new UltraLink().fromFullBlob(archive);
        expect(restored.getEntity('a').attributes).toEqual({ name: 'Author' });
        expect(JSON.parse(JSON.stringify(restored.getEntity('a').metadata.details))).toEqual(expected);
        expect(restored.getEntity('b').type).toBe('paper');
        const restoredEdge = restored.getRelationship(edge.id);
        expect(restoredEdge.attributes).toEqual({ revision: 1 });
        expect(JSON.parse(JSON.stringify(restoredEdge.metadata.details))).toEqual(expected);
        expect(restored.getBacklinks('b')).toEqual([restoredEdge]);
        expect(restored.getRelationships('a', { direction: 'outgoing' })).toEqual([restoredEdge]);
      }
      expect(details.invalid).toBe(unreadable);
    });

    it('uses the row property key for metadata hooks and retains exact raw JSON numeric tokens', () => {
      const metadata = {
        toJSON(key) {
          const result = { calledAs: key };
          if (typeof JSON.rawJSON === 'function') {
            result.large = JSON.rawJSON('9007199254740993');
            result.fromHook = { toJSON() { return JSON.rawJSON('1e400'); } };
          }
          return result;
        }
      };
      ultralink.addEntity('a', 'node').metadata = metadata;
      ultralink.addEntity('b', 'node');
      ultralink.addLink('a', 'b', 'reviewed').metadata = metadata;
      function fields(text) {
        const values = [];
        JSON.parse(text, (key, value, context) => {
          if (key === 'calledAs') values.push(value);
          if (key === 'large' || key === 'fromHook') values.push(context.source);
          return value;
        });
        return values;
      }
      const expected = fields(JSON.stringify({ metadata }));
      expect(expected[0]).toBe('metadata');
      for (const text of [
        ultralink.toJSON({ includeMetadata: true }),
        ultralink.toJSON({ lossless: true }),
        JSON.stringify(ultralink.toJSON({ lossless: true, asString: false })),
        JSON.stringify(ultralink.toFullBlob()),
        ultralink.toFullBlob({ compressed: true, throwOnError: true })
      ]) {
        expect(fields(text)).toEqual([...expected, ...expected]);
      }
    });

    it('still reports serialization errors from graph attributes', () => {
      ultralink.addEntity('a', 'node');
      ultralink.addEntity('b', 'node');
      ultralink.addLink('a', 'b', 'reviewed', { invalid: 1n });

      expect(() => ultralink.toJSON({ lossless: true })).toThrow(/BigInt/);
      expect(() => ultralink.toFullBlob({ compressed: true, throwOnError: true })).toThrow(/BigInt/);
    });

    it('recovers archive rows without stealing explicit or tuple-derived IDs', () => {
      const source = 'author_team';
      const target = 'paper_v1';
      const common = { source, target, type: 'reviewed' };
      const explicitId = `${source}_reviewed_${target}`;
      const ordinaryId = `${source}_reviewed~2_${target}`;
      const payload = {
        ultralinkArchiveVersion: ultralink.toJSON({ asString: false, lossless: true }).ultralinkArchiveVersion,
        entities: { person: { id: source, type: 'person' }, paper: { id: target, type: 'document' } },
        relationships: {
          first: { ...common, attributes: { weight: 1 }, metadata: { created: '2019-08-01T00:00:00.000Z', origin: 'legacy' } },
          second: { ...common, attributes: { weight: 2 } },
          explicit: { ...common, id: explicitId, attributes: { weight: 3 } },
          ordinary: { ...common, type: 'reviewed~2', id: 'legacy-label', attributes: { weight: 4 } },
          recovered: { ...common, id: 'legacy:1', attributes: { weight: 5 } },
          duplicate: { ...common, type: 'edited', id: 'legacy:1', attributes: { weight: 6 } }
        }
      };
      const restored = new UltraLink().fromFullBlob({ json: JSON.stringify(payload) });
      const edges = restored.getBacklinks(target);
      expect(edges.map(edge => edge.attributes.weight)).toEqual([1, 2, 3, 4, 5, 6]);
      expect(new Set(edges.map(edge => edge.id)).size).toBe(6);
      expect(restored.getRelationship(explicitId).attributes.weight).toBe(3);
      expect(restored.getRelationship(ordinaryId).attributes.weight).toBe(4);
      expect(restored.getRelationship('legacy:1').attributes.weight).toBe(5);
      expect(restored.getRelationship(`${source}_edited_${target}`).attributes.weight).toBe(6);
      expect(edges[0].metadata).toMatchObject({ created: '2019-08-01T00:00:00.000Z', origin: 'legacy' });
      expect(new UltraLink().fromFullBlob(restored.toJSON({ lossless: true })).getBacklinks(target)).toEqual(edges);
      expect(restored.deleteLink(source, target, edges[0].id)).toBe(false);
      const independent = restored.addLink(source, target, edges[0].id, { weight: 7 });
      expect(restored.getBacklinks(target)).toEqual([...edges, independent]);
      expect(restored.deleteRelationship(edges[0].id)).toBe(true);
      expect(restored.getBacklinks(target)).toEqual([...edges.slice(1), independent]);
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