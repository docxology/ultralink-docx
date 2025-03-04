/**
 * UltraLink Core Types
 * 
 * This file defines the fundamental types and interfaces for the UltraLink system.
 */

/**
 * Represents a link between two entities
 */
class Link {
  constructor(source, target, type = "default", metadata = {}) {
    this.source = source;   // Source entity ID
    this.target = target;   // Target entity ID
    this.type = type;       // Relationship type
    this.metadata = metadata; // Additional metadata about the relationship
  }

  toString() {
    return `[[${this.target}]]`;
  }

  toJSON() {
    return {
      source: this.source,
      target: this.target,
      type: this.type,
      metadata: this.metadata
    };
  }
}

/**
 * Represents an entity in the system (e.g., a person, place, concept)
 */
class Entity {
  constructor(id, type, attributes = {}) {
    this.id = id;           // Unique identifier
    this.type = type;       // Entity type (e.g., "person", "place", "concept")
    this.attributes = attributes; // Entity attributes
    this.links = [];        // Links to other entities
  }

  addLink(target, type = "default", metadata = {}) {
    const link = new Link(this.id, target, type, metadata);
    this.links.push(link);
    return link;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      attributes: this.attributes,
      links: this.links.map(link => link.toJSON())
    };
  }
}

/**
 * Collection of entities with relationship management
 */
class EntityStore {
  constructor() {
    this.entities = new Map();
  }

  addEntity(entity) {
    this.entities.set(entity.id, entity);
    return entity;
  }

  getEntity(id) {
    return this.entities.get(id);
  }

  createEntity(id, type, attributes = {}) {
    const entity = new Entity(id, type, attributes);
    return this.addEntity(entity);
  }

  /**
   * Clears all entities from the store
   * @returns {Promise<void>} Promise that resolves when the store is cleared
   */
  clear() {
    this.entities.clear();
    return Promise.resolve();
  }

  /**
   * Create a bidirectional link between two entities
   */
  createLink(sourceId, targetId, type = "default", metadata = {}) {
    const source = this.getEntity(sourceId);
    const target = this.getEntity(targetId);
    
    if (!source || !target) {
      throw new Error(`Entities not found: ${!source ? sourceId : ''} ${!target ? targetId : ''}`);
    }
    
    source.addLink(targetId, type, metadata);
    return source;
  }

  toJSON() {
    return Array.from(this.entities.values()).map(entity => entity.toJSON());
  }
}

module.exports = {
  Link,
  Entity,
  EntityStore
}; 