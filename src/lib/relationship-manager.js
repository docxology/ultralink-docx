/**
 * RelationshipManager - Handles relationship operations for UltraLink
 * 
 * This module provides methods for adding, retrieving, updating, and deleting relationships
 * between entities in the knowledge graph.
 */

/**
 * Add a relationship between two entities
 * @param {string} sourceId - ID of the source entity
 * @param {string} targetId - ID of the target entity
 * @param {string} type - Type of relationship
 * @param {Object} attributes - Additional properties for the relationship
 * @param {Object} options - Additional options
 * @returns {Object} The created relationship
 */
function addRelationship(sourceId, targetId, type, attributes = {}, options = {}) {
  // Validate entities exist
  if (!this.entities.has(sourceId)) {
    throw new Error(`Source entity "${sourceId}" not found`);
  }
  if (!this.entities.has(targetId)) {
    throw new Error(`Target entity "${targetId}" not found`);
  }

  // Create relationship object
  const id = options.id || `${sourceId}_${type}_${targetId}_${Date.now()}`;
  
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

  // Store the relationship
  this.relationships.set(id, relationship);
  
  // Store by source and target for quick lookups
  if (!this.relationshipsBySource.has(sourceId)) {
    this.relationshipsBySource.set(sourceId, new Set());
  }
  this.relationshipsBySource.get(sourceId).add(id);
  
  if (!this.relationshipsByTarget.has(targetId)) {
    this.relationshipsByTarget.set(targetId, new Set());
  }
  this.relationshipsByTarget.get(targetId).add(id);

  return relationship;
}

/**
 * Get a specific relationship by ID
 * @param {string} id - ID of the relationship
 * @returns {Object|null} The relationship or null if not found
 */
function getRelationship(id) {
  return this.relationships.get(id) || null;
}

/**
 * Update an existing relationship
 * @param {string} id - ID of the relationship to update
 * @param {Object} updates - Properties to update
 * @param {Object} options - Additional options
 * @returns {Object} The updated relationship
 */
function updateRelationship(id, updates = {}, options = {}) {
  const relationship = this.relationships.get(id);
  if (!relationship) {
    throw new Error(`Relationship with ID "${id}" not found`);
  }
  
  // Update attributes
  if (updates.attributes) {
    relationship.attributes = {
      ...relationship.attributes,
      ...updates.attributes
    };
  }
  
  // Update type if provided
  if (updates.type) {
    relationship.type = updates.type;
  }

  // Update metadata
  relationship.metadata.modified = new Date().toISOString();
  
  // Save changes
  this.relationships.set(id, relationship);
  
  return relationship;
}

/**
 * Delete a relationship by ID
 * @param {string} id - ID of the relationship to delete
 * @returns {boolean} Success status
 */
function deleteRelationship(id) {
  const relationship = this.relationships.get(id);
  if (!relationship) {
    return false;
  }
  
  // Remove from the main relationships map
  this.relationships.delete(id);
  
  // Remove from source and target indices
  if (this.relationshipsBySource.has(relationship.source)) {
    this.relationshipsBySource.get(relationship.source).delete(id);
    if (this.relationshipsBySource.get(relationship.source).size === 0) {
      this.relationshipsBySource.delete(relationship.source);
    }
  }
  
  if (this.relationshipsByTarget.has(relationship.target)) {
    this.relationshipsByTarget.get(relationship.target).delete(id);
    if (this.relationshipsByTarget.get(relationship.target).size === 0) {
      this.relationshipsByTarget.delete(relationship.target);
    }
  }
  
  return true;
}

/**
 * Find relationships matching specified criteria
 * @param {Object} criteria - Search criteria
 * @returns {Array} Matching relationships
 */
function findRelationships(criteria = {}) {
  const results = [];
  
  for (const relationship of this.relationships.values()) {
    let match = true;
    
    // Match by type
    if (criteria.type && relationship.type !== criteria.type) {
      match = false;
    }
    
    // Match by source
    if (criteria.source && relationship.source !== criteria.source) {
      match = false;
    }
    
    // Match by target
    if (criteria.target && relationship.target !== criteria.target) {
      match = false;
    }
    
    // Match by attributes
    if (criteria.attributes) {
      for (const [key, value] of Object.entries(criteria.attributes)) {
        if (relationship.attributes[key] !== value) {
          match = false;
          break;
        }
      }
    }
    
    if (match) {
      results.push(relationship);
    }
  }
  
  return results;
}

/**
 * Get all relationships for a specific entity
 * @param {string} entityId - Entity ID
 * @param {Object} options - Filter options
 * @returns {Array} Relationships involving the entity
 */
function getEntityRelationships(entityId, options = {}) {
  const { direction = 'both', types = [] } = options;
  const results = [];
  
  // Get outgoing relationships (where entity is source)
  if (direction === 'outgoing' || direction === 'both') {
    if (this.relationshipsBySource.has(entityId)) {
      for (const id of this.relationshipsBySource.get(entityId)) {
        const relationship = this.relationships.get(id);
        if (types.length === 0 || types.includes(relationship.type)) {
          results.push(relationship);
        }
      }
    }
  }
  
  // Get incoming relationships (where entity is target)
  if (direction === 'incoming' || direction === 'both') {
    if (this.relationshipsByTarget.has(entityId)) {
      for (const id of this.relationshipsByTarget.get(entityId)) {
        const relationship = this.relationships.get(id);
        if (types.length === 0 || types.includes(relationship.type)) {
          results.push(relationship);
        }
      }
    }
  }
  
  return results;
}

module.exports = {
  addRelationship,
  getRelationship,
  updateRelationship,
  deleteRelationship,
  findRelationships,
  getEntityRelationships
}; 