/**
 * RelationshipManager - Handles relationship operations for UltraLink
 * 
 * This module provides methods for adding, retrieving, updating, and deleting relationships
 * between entities in the knowledge graph.
 */

// Legacy slots keep their insertion key and newest live value. Only collisions
// need extra bookkeeping; none of it is part of the exported graph.
const shadowedLegacyLinks = new WeakMap();
const replayedLegacyLinks = new WeakMap();
const replaying = new WeakSet();

function legacyKey({ id, source, target }) {
  const insertionType = id.slice(String(source).length + 1, -String(target).length - 1);
  return `${target}-${insertionType}`;
}

function removeIndexEntry(index, endpoint, id) {
  const ids = index.get(endpoint);
  if (ids?.delete(id) && ids.size === 0) index.delete(endpoint);
}

function removeShadow(shadows, relationship) {
  const index = shadows.indexOf(relationship);
  if (index !== -1) shadows.splice(index, 1);
}

function removeLegacyLink(outgoing, key, relationship) {
  if (!outgoing) return;
  const byKey = shadowedLegacyLinks.get(outgoing);
  const shadows = byKey?.get(key);
  if (outgoing.get(key) === relationship) {
    if (shadows?.length) outgoing.set(key, shadows.pop());
    else outgoing.delete(key);
  } else if (shadows) {
    removeShadow(shadows, relationship);
  }
  if (shadows?.length === 0) byKey.delete(key);
}

function setLegacyLink(links, source, key, relationship, previous) {
  let outgoing = links.get(source);
  if (!outgoing) links.set(source, outgoing = new Map());
  const current = outgoing.get(key);
  if (current && current !== previous) {
    let byKey = shadowedLegacyLinks.get(outgoing);
    let shadows = byKey?.get(key);
    if (shadows && previous) removeShadow(shadows, previous);
    if (!replayedLegacyLinks.get(links)?.delete(current)) {
      if (!byKey) shadowedLegacyLinks.set(outgoing, byKey = new Map());
      if (!shadows) byKey.set(key, shadows = []);
      shadows.push(current);
    } else if (shadows?.length === 0) {
      byKey.delete(key);
    }
  }
  outgoing.set(key, relationship);
}

function replayLinks(rows) {
  if (typeof rows[Symbol.iterator] !== 'function') {
    if (typeof rows !== 'object') return;
    rows = Object.values(rows);
  }
  const alreadyReplaying = replaying.has(this);
  replaying.add(this);
  try {
    for (const rel of rows) {
      this.addLink(rel.source, rel.target, rel.type, rel.attributes);
    }
  } finally {
    if (!alreadyReplaying) replaying.delete(this);
  }
}

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
    throw new Error(`Source entity not found: ${sourceId}`);
  }
  if (!this.entities.has(targetId)) {
    throw new Error(`Target entity not found: ${targetId}`);
  }

  // Create relationship object
  const id = `${sourceId}_${type}_${targetId}`;
  
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

  const key = `${targetId}-${type}`;
  const previous = this.relationships.get(id);
  if (previous && (previous.source !== sourceId || previous.target !== targetId)) {
    if (previous.source !== sourceId) removeIndexEntry(this.relationshipsBySource, previous.source, id);
    if (previous.target !== targetId) removeIndexEntry(this.relationshipsByTarget, previous.target, id);
    const oldKey = legacyKey(previous);
    if (previous.source !== sourceId || oldKey !== key) {
      const outgoing = this.links.get(previous.source);
      if (replaying.has(this) && outgoing?.get(oldKey) === previous) {
        // Old imports exposed both distinct legacy keys, but only the last
        // accepted tuple owned the compound ID. Keep the old slot off the indexes.
        let replayed = replayedLegacyLinks.get(this.links);
        if (!replayed) replayedLegacyLinks.set(this.links, replayed = new Set());
        replayed.add(previous);
      } else {
        removeLegacyLink(outgoing, oldKey, previous);
      }
    }
  }

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

  setLegacyLink(this.links, sourceId, key, relationship, previous);

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
  if (!relationship) return false;
  removeRelationship(this, relationship);
  return true;
}

function deleteLink(source, target, type) {
  const relationship = this.relationships.get(`${source}_${type}_${target}`);
  if (!relationship || relationship.source !== source || relationship.target !== target) return false;
  removeRelationship(this, relationship);
  return true;
}

function removeRelationship(graph, relationship) {
  const { id, source, target } = relationship;
  graph.relationships.delete(id);
  removeIndexEntry(graph.relationshipsBySource, source, id);
  removeIndexEntry(graph.relationshipsByTarget, target, id);
  removeLegacyLink(graph.links.get(source), legacyKey(relationship), relationship);
}

function removeEntityRelationships(entityId) {
  const outgoing = this.relationshipsBySource.get(entityId);
  if (outgoing) for (const id of outgoing) deleteRelationship.call(this, id);
  const incoming = this.relationshipsByTarget.get(entityId);
  if (incoming) for (const id of incoming) deleteRelationship.call(this, id);

  const replayed = replayedLegacyLinks.get(this.links);
  if (replayed) {
    for (const relationship of replayed) {
      const { source, target } = relationship;
      if (source !== entityId && target !== entityId) continue;
      removeLegacyLink(this.links.get(source), legacyKey(relationship), relationship);
      replayed.delete(relationship);
    }
  }
  this.links.delete(entityId);
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
  const { direction = 'both', type = null } = options;
  const results = [];
  
  if (entityId === null) {
    for (const relationship of this.relationships.values()) {
      if (!type || relationship.type === type) results.push(relationship);
    }
    return results;
  }

  if (direction === 'outgoing' || direction === 'both') {
    const outgoing = this.relationshipsBySource.get(entityId);
    if (outgoing) {
      for (const id of outgoing) {
        const relationship = this.relationships.get(id);
        if (!type || relationship.type === type) results.push(relationship);
      }
    }
  }

  if (direction === 'incoming' || direction === 'both') {
    const incoming = this.relationshipsByTarget.get(entityId);
    if (incoming) {
      for (const id of incoming) {
        const relationship = this.relationships.get(id);
        if (direction === 'both' && relationship.source === entityId) continue;
        if (!type || relationship.type === type) results.push(relationship);
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
  deleteLink,
  removeEntityRelationships,
  replayLinks,
  findRelationships,
  getEntityRelationships
}; 