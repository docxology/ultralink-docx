/**
 * RelationshipManager - Handles relationship operations for UltraLink
 * 
 * This module provides methods for adding, retrieving, updating, and deleting relationships
 * between entities in the knowledge graph.
 */

// The legacy map exposes only its latest write for a key. Keep displaced
// live records in write order so deleting that entry can restore its predecessor.
const shadowedLegacyLinks = new WeakMap();

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
  return storeRelationship.call(this, sourceId, targetId, type, attributes);
}

function storeRelationship(sourceId, targetId, type, attributes, storedId, metadata) {
  // Validate entities exist
  if (!this.entities.has(sourceId)) {
    throw new Error(`Source entity not found: ${sourceId}`);
  }
  if (!this.entities.has(targetId)) {
    throw new Error(`Target entity not found: ${targetId}`);
  }

  // Create relationship object
  const id = storedId ?? `${sourceId}_${type}_${targetId}`;
  
  const relationship = {
    id,
    source: sourceId,
    target: targetId,
    type,
    attributes: { ...attributes },
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      ...metadata
    }
  };
  const key = storedId === undefined ? `${targetId}-${type}` : legacyLinkKey(id, relationship);

  // A compound ID can be reused by a different endpoint tuple.
  const previous = this.relationships.get(id);
  if (previous && (previous.source !== sourceId || previous.target !== targetId)) {
    if (previous.source !== sourceId) {
      removeIndexEntry(this.relationshipsBySource, previous.source, id);
    }
    if (previous.target !== targetId) {
      removeIndexEntry(this.relationshipsByTarget, previous.target, id);
    }
    const previousKey = legacyLinkKey(id, previous);
    if (previous.source !== sourceId || previousKey !== key) {
      removeLegacyLink(this.links, previousKey, previous);
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

  // Initialize and update links map for backward compatibility
  if (!this.links.has(sourceId)) {
    this.links.set(sourceId, new Map());
  }
  setLegacyLink(this.links.get(sourceId), key, relationship, previous);

  return relationship;
}

function restoreRelationships(rows, archive) {
  const entries = [];
  const explicit = new Set();
  const lastImplicitById = new Map();
  for (const row of rows) {
    const { source, target } = row;
    const type = row.type === undefined ? this.config.defaultRelationshipType : row.type;
    const generatedId = `${source}_${type}_${target}`;
    let id;
    if (archive && typeof row.id === 'string') {
      const prefix = `${source}_`;
      const suffix = `_${target}`;
      if (isRecoveredId(row.id) || (row.id.length >= prefix.length + suffix.length &&
        row.id.startsWith(prefix) && row.id.endsWith(suffix))) id = row.id;
    }
    if (id !== undefined && explicit.has(id)) id = undefined;
    const entry = { row, type, generatedId, id };
    if (id === undefined) {
      // The published importer overwrote this ID on each write. Keep its last
      // owner and recover the earlier rows without changing their order.
      lastImplicitById.set(generatedId, entry);
    } else {
      explicit.add(id);
    }
    entries.push(entry);
  }

  let nextRecoveredId = 1;
  for (const entry of entries) {
    const { row, type, generatedId, id: storedId } = entry;
    const { source, target, attributes, metadata } = row;
    let id = storedId;
    if (id === undefined) {
      if (!explicit.has(generatedId) && lastImplicitById.get(generatedId) === entry) {
        id = generatedId;
      } else {
        // Recovered IDs cannot alias a later addLink or deleteLink insertion tuple.
        do {
          id = `legacy:${nextRecoveredId++}`;
        } while (explicit.has(id));
      }
    }
    storeRelationship.call(this, source, target, type, attributes, id, metadata);
  }

  if (!archive) return;
  const { legacyLinkOrder, relationshipOrder } = archive;
  restoreIndexOrder(this.relationshipsBySource, this.relationships, 'source', relationshipOrder?.outgoing);
  restoreIndexOrder(this.relationshipsByTarget, this.relationships, 'target', relationshipOrder?.incoming);

  if (Array.isArray(legacyLinkOrder)) {
    for (const id of legacyLinkOrder) {
      const relationship = this.relationships.get(id);
      if (!relationship) continue;
      const outgoing = this.links.get(relationship.source);
      const key = legacyLinkKey(id, relationship);
      if (shadowedLegacyLinks.get(outgoing)?.has(key)) {
        setLegacyLink(outgoing, key, relationship, relationship);
      }
    }
  }
  restoreLegacyMapOrder(this.links, this.entities, archive.legacyMapOrder);
}

function getLegacyLinkOrder() {
  let order;
  for (const outgoing of this.links?.values() ?? []) {
    const byKey = shadowedLegacyLinks.get(outgoing);
    if (!byKey) continue;
    order ??= [];
    for (const [key, shadowed] of byKey) {
      for (const relationship of shadowed) order.push(relationship.id);
      order.push(outgoing.get(key).id);
    }
  }
  return order;
}

function getLegacyMapOrder() {
  // Canonical rows recreate the first occurrence of each source and key.
  const canonical = new Map();
  for (const relationship of this.relationships.values()) {
    const { source, id } = relationship;
    if (!canonical.has(source)) canonical.set(source, new Set());
    canonical.get(source).add(legacyLinkKey(id, relationship));
  }

  const order = {};
  const initialSources = canonical.keys();
  for (const [source, outgoing] of this.links) {
    if (!order.sources && initialSources.next().value !== source) order.sources = [...this.links.keys()];
    const initialKeys = canonical.get(source)?.values();
    for (const key of outgoing.keys()) {
      if (initialKeys?.next().value !== key) {
        (order.keys ??= []).push([source, [...outgoing.keys()]]);
        break;
      }
    }
  }
  if (order.sources || order.keys) return order;
}

function restoreLegacyMapOrder(links, entities, order) {
  if (Array.isArray(order?.sources)) {
    // A previously used, still-live source can have an empty outgoing map.
    for (const source of order.sources) {
      if (!links.has(source) && entities.has(source)) links.set(source, new Map());
    }
    restoreMapOrder(links, order.sources);
  }
  if (!Array.isArray(order?.keys)) return;
  for (const entry of order.keys) {
    if (!Array.isArray(entry)) continue;
    const outgoing = links.get(entry[0]);
    if (outgoing) restoreMapOrder(outgoing, entry[1]);
  }
}

function restoreMapOrder(map, keys) {
  if (!Array.isArray(keys) || map.size !== keys.length ||
      new Set(keys).size !== keys.length || !keys.every(key => map.has(key))) return;
  for (const key of keys) {
    const value = map.get(key);
    map.delete(key);
    map.set(key, value);
  }
}

function getRelationshipOrder() {
  // A replacement retains its canonical Map slot but joins a changed
  // endpoint at the end of that endpoint's index.
  const positions = new Map();
  for (const id of this.relationships.keys()) positions.set(id, positions.size);
  const outgoing = nonCanonicalOrder(this.relationshipsBySource, positions);
  const incoming = nonCanonicalOrder(this.relationshipsByTarget, positions);
  if (outgoing && incoming) return { outgoing, incoming };
  if (outgoing) return { outgoing };
  if (incoming) return { incoming };
}

function nonCanonicalOrder(index, positions) {
  let groups;
  for (const ids of index.values()) {
    let previous = -1;
    for (const id of ids) {
      const position = positions.get(id);
      if (position < previous) {
        (groups ??= []).push([...ids]);
        break;
      }
      previous = position;
    }
  }
  return groups;
}

function restoreIndexOrder(index, relationships, endpoint, groups) {
  if (!Array.isArray(groups)) return;
  for (const order of groups) {
    if (!Array.isArray(order) || order.length < 2) continue;
    const relationship = relationships.get(order[0]);
    if (!relationship) continue;
    const id = relationship[endpoint];
    const current = index.get(id);
    if (current.size !== order.length || !order.every(edgeId => current.has(edgeId))) continue;
    const restored = new Set(order);
    if (restored.size === current.size) index.set(id, restored);
  }
}

function isRecoveredId(id) {
  return /^legacy:[1-9]\d*$/.test(id);
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
  
  removeIndexEntry(this.relationshipsBySource, relationship.source, id);
  removeIndexEntry(this.relationshipsByTarget, relationship.target, id);
  removeLegacyLink(this.links, legacyLinkKey(id, relationship), relationship);
  
  return true;
}

function removeIndexEntry(index, endpoint, id) {
  const ids = index?.get(endpoint);
  if (ids?.delete(id) && ids.size === 0) index.delete(endpoint);
}

function setLegacyLink(outgoing, key, relationship, previous) {
  const current = outgoing.get(key);
  if (current && current !== previous) {
    let byKey = shadowedLegacyLinks.get(outgoing);
    if (!byKey) {
      byKey = new Map();
      shadowedLegacyLinks.set(outgoing, byKey);
    }
    let shadowed = byKey.get(key);
    if (shadowed) removeShadowedLink(shadowed, previous);
    else {
      shadowed = [];
      byKey.set(key, shadowed);
    }
    shadowed.push(current);
  }
  outgoing.set(key, relationship);
}

function removeShadowedLink(shadowed, relationship) {
  const index = shadowed.indexOf(relationship);
  if (index !== -1) shadowed.splice(index, 1);
}

function legacyLinkKey(id, { source, target }) {
  // Type updates keep the ID and the legacy key from insertion. The stored
  // endpoints fix both boundaries even when they contain underscores.
  if (isRecoveredId(id)) return `${target}-${id}`;
  const typeAtInsertion = id.slice(String(source).length + 1, -String(target).length - 1);
  return `${target}-${typeAtInsertion}`;
}

function removeLegacyLink(links, key, relationship) {
  const { source } = relationship;
  const outgoing = links?.get(source);
  if (!outgoing) return;
  const current = outgoing.get(key);
  if (!current) return;

  const byKey = shadowedLegacyLinks.get(outgoing);
  const shadowed = byKey?.get(key);
  if (shadowed) {
    if (current === relationship) outgoing.set(key, shadowed.pop());
    else removeShadowedLink(shadowed, relationship);

    if (shadowed.length === 0) {
      byKey.delete(key);
      if (byKey.size === 0) shadowedLegacyLinks.delete(outgoing);
    }
  } else if (current === relationship) {
    outgoing.delete(key);
  }
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
  
  // If entityId is null, return all relationships that match the type
  if (entityId === null) {
    // Return all relationships, filtered by type if specified
    for (const relationship of this.relationships.values()) {
      if ((type && relationship.type === type) || 
          (options.type && relationship.type === options.type) || 
          (!type && !options.type)) {
        results.push(relationship);
      }
    }
    return results;
  }
  
  // Get outgoing relationships (where entity is source)
  if (direction === 'outgoing' || direction === 'both') {
    if (this.relationshipsBySource.has(entityId)) {
      for (const id of this.relationshipsBySource.get(entityId)) {
        const relationship = this.relationships.get(id);
        if ((type && relationship.type === type) || 
            (options.type && relationship.type === options.type) || 
            (!type && !options.type)) {
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
        // A self-loop has already been considered in the outgoing pass.
        if (direction === 'both' && relationship.source === entityId) continue;
        if ((type && relationship.type === type) || 
            (options.type && relationship.type === options.type) || 
            (!type && !options.type)) {
          results.push(relationship);
        }
      }
    }
  }
  
  return results;
}

module.exports = {
  addRelationship,
  restoreRelationships,
  getLegacyLinkOrder,
  getLegacyMapOrder,
  getRelationshipOrder,
  getRelationship,
  updateRelationship,
  deleteRelationship,
  findRelationships,
  getEntityRelationships
}; 