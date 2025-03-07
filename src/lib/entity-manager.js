/**
 * EntityManager - Handles entity operations for UltraLink
 * 
 * This module provides methods for adding, retrieving, updating, and deleting entities
 * in the knowledge graph. It also includes entity search functionality.
 */

/**
 * Add a new entity to the knowledge graph
 * @param {string} id - Unique identifier for the entity
 * @param {string} type - Type/category of the entity
 * @param {Object} attributes - Additional properties of the entity
 * @returns {Object} The created entity
 */
function addEntity(id, type, attributes = {}) {
  // Prevent overwriting existing entities unless explicitly allowed
  if (this.entities.has(id) && !this.config.allowOverwrite) {
    throw new Error(`Entity with ID "${id}" already exists. Set allowOverwrite: true in config to override.`);
  }

  const entity = {
    id,
    type,
    attributes: { ...attributes },
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
  };

  this.entities.set(id, entity);
  return entity;
}

/**
 * Retrieve an entity by its ID
 * @param {string} id - The entity's unique identifier
 * @returns {Object|null} The entity or null if not found
 */
function getEntity(id) {
  return this.entities.has(id) ? this.entities.get(id) : null;
}

/**
 * Update an existing entity's attributes
 * @param {string} id - The entity's unique identifier
 * @param {Object} attributes - New attributes to merge with existing ones
 * @returns {Object|null} The updated entity or null if not found
 */
function updateEntity(id, attributes) {
  if (!this.entities.has(id)) {
    throw new Error(`Entity with ID "${id}" not found`);
  }
  
  const entity = this.entities.get(id);
  entity.attributes = { ...entity.attributes, ...attributes };
  entity.metadata.modified = new Date().toISOString();
  
  return entity;
}

/**
 * Delete an entity and all its relationships
 * @param {string} id - The entity's unique identifier
 * @returns {boolean} True if entity was deleted, false if not found
 */
function deleteEntity(id) {
  if (!this.entities.has(id)) {
    return false;
  }
  
  // Remove all relationships involving this entity
  for (const [key, rel] of this.relationships.entries()) {
    if (rel.source === id || rel.target === id) {
      this.relationships.delete(key);
    }
  }
  
  // Clean up links map
  if (this.links && this.links.has(id)) {
    this.links.delete(id);
  }
  
  // Clean up relationshipsBySource and relationshipsByTarget
  if (this.relationshipsBySource && this.relationshipsBySource.has(id)) {
    this.relationshipsBySource.delete(id);
  }
  
  if (this.relationshipsByTarget && this.relationshipsByTarget.has(id)) {
    this.relationshipsByTarget.delete(id);
  }
  
  return this.entities.delete(id);
}

/**
 * Find entities matching certain criteria
 * @param {Object} options - Search options
 * @param {string|null} options.type - Entity type to filter by
 * @param {Object} options.attributes - Attribute key-values to match
 * @param {Function|null} options.filter - Custom filter function
 * @returns {Array} Array of matching entities
 */
function findEntities({ type = null, attributes = {}, filter = null } = {}) {
  const results = [];
  
  for (const entity of this.entities.values()) {
    let match = true;
    
    // Match by type
    if (type && entity.type !== type) {
      match = false;
    }
    
    // Match by attributes
    if (Object.keys(attributes).length > 0) {
      for (const [key, value] of Object.entries(attributes)) {
        if (entity.attributes[key] !== value) {
          match = false;
          break;
        }
      }
    }
    
    // Apply custom filter if provided
    if (match && filter && typeof filter === 'function') {
      match = filter(entity);
    }
    
    if (match) {
      results.push(entity);
    }
  }
  
  return results;
}

/**
 * EntityStore - Class for storing and managing entities
 * 
 * This class provides a simple interface for storing and retrieving entities.
 * It is used by the UltraLinkParser for integration tests.
 */
class EntityStore {
  /**
   * Create a new EntityStore instance
   */
  constructor() {
    this.entities = new Map();
    this.relationships = new Map();
  }

  /**
   * Add a new entity to the store
   * @param {string} id - Unique identifier for the entity
   * @param {string} type - Type/category of the entity
   * @param {Object} attributes - Additional properties of the entity
   * @returns {Object} The created entity
   */
  addEntity(id, type, attributes = {}) {
    const entity = {
      id,
      type,
      attributes: { ...attributes },
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    };

    this.entities.set(id, entity);
    return entity;
  }

  /**
   * Get an entity by ID
   * @param {string} id - Entity ID
   * @returns {Object|null} The entity or null if not found
   */
  getEntity(id) {
    return this.entities.get(id) || null;
  }

  /**
   * Add a relationship between entities
   * @param {string} sourceId - Source entity ID
   * @param {string} targetId - Target entity ID
   * @param {string} type - Relationship type
   * @param {Object} attributes - Additional properties
   * @returns {Object} The created relationship
   */
  addRelationship(sourceId, targetId, type = 'related_to', attributes = {}) {
    const id = `${sourceId}-${type}-${targetId}`;
    
    const relationship = {
      id,
      source: sourceId,
      target: targetId,
      type,
      attributes: { ...attributes },
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    };

    this.relationships.set(id, relationship);
    return relationship;
  }

  /**
   * Clear all entities and relationships
   */
  async clear() {
    this.entities.clear();
    this.relationships.clear();
  }
}

module.exports = {
  addEntity,
  getEntity,
  updateEntity,
  deleteEntity,
  findEntities,
  EntityStore
}; 