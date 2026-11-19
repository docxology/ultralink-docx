/**
 * RelationshipManager - Handles relationship operations for UltraLink
 * 
 * This module provides methods for adding, retrieving, updating, and deleting relationships
 * between entities in the knowledge graph.
 */

const { GraphValidationError, restoreRowMetadata, stampRowModified } = require('./utils');

// The legacy map exposes only its latest write for a key. Keep displaced
// live records in write order so deleting that entry can restore its predecessor.
const shadowedLegacyLinks = new WeakMap();
const recoveredLegacyTypes = new WeakMap();
const activeRestore = new WeakMap();
const replayingLegacy = new WeakSet();
const replayedLegacyLinks = new WeakMap();

function delegateLink(source, target, type, attributes, options) {
  const state = activeRestore.get(this);
  const start = state?.inserted.length;
  const result = this.addRelationship(source, target, type, attributes, options);
  if (state && matchesImportTuple(this, state.row, source, target, type)) {
    const edge = result === undefined && state.inserted.length === start + 1 ? state.inserted[start] : result;
    if (state.inserted.includes(edge, start)) state.delegated.add(edge);
  }
  return result;
}

function matchesImportTuple(graph, row, source, target, type) {
  const inputType = row.type === undefined ? graph.config.defaultRelationshipType : row.type;
  return source === row.source && target === row.target && type === inputType;
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
  const state = activeRestore.get(this);
  if (!state) return storeRelationship.call(this, sourceId, targetId, type, attributes);

  const compoundId = `${sourceId}_${type}_${targetId}`;
  let id = compoundId;
  const previous = this.relationships.get(id);
  // Preserve colliding input rows, not receiver-owned side effects.
  if (state.accepted.has(previous) && this.entities.has(sourceId) && this.entities.has(targetId)) {
    if (state.reserved.has(id)) {
      id = nextRecoveryId(this.relationships, state);
      trackImportedOrder(this, state);
    } else recoverDisplacedEdge(this, previous, state);
  }
  const replaced = previous?.id === id ? previous : undefined;
  let overwritten;
  if (replaced && (replaced.source !== sourceId || replaced.target !== targetId)) {
    if (state.inserted.includes(replaced)) {
      // A hook can explicitly accept a write displaced by a later write.
      (state.displaced ??= new Set()).add(replaced);
      trackImportedOrder(this, state);
    }
    if (state.reserved.has(compoundId) && !state.accepted.has(replaced)) {
      // The hook freed an archive ID and a receiver edge now owns it.
      // Preserve normal overwrite visibility until we know which row it accepted.
      trackImportedOrder(this, state);
      overwritten = snapshotReceiverWrite(this, replaced);
    }
  }
  const relationship = storeRelationship.call(this, sourceId, targetId, type, attributes, id);
  state.inserted.push(relationship);
  if (state.order) rememberImportedSlot(state, relationship, replaced);
  if (overwritten || id !== compoundId || state.recoveredEffects.has(compoundId) || state.provisional.has(compoundId)) {
    recordReceiverWrite(this, state, compoundId, relationship, overwritten);
  }
  return relationship;
}

function storeRelationship(sourceId, targetId, type, attributes, storedId) {
  // Validate entities exist
  if (!this.entities.has(sourceId)) {
    throw new GraphValidationError(`Source entity not found: ${sourceId}`);
  }
  if (!this.entities.has(targetId)) {
    throw new GraphValidationError(`Target entity not found: ${targetId}`);
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
      modified: new Date().toISOString()
    }
  };
  if (isRecoveredId(id)) recoveredLegacyTypes.set(relationship, String(type));

  indexRelationship.call(this, relationship);
  return relationship;
}

function indexRelationship(relationship) {
  const { id, source: sourceId, target: targetId } = relationship;
  const key = legacyLinkKey(id, relationship);

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
      if (replayingLegacy.has(this) && this.links.get(previous.source)?.get(previousKey) === previous) {
        // Released unversioned replay preserves a distinct legacy slot, not
        // a second canonical relationship or directional index entry.
        let replayed = replayedLegacyLinks.get(this.links);
        if (!replayed) replayedLegacyLinks.set(this.links, replayed = new Set());
        replayed.add(previous);
      } else {
        removeLegacyLink(this.links, previousKey, previous);
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

  // Initialize and update links map for backward compatibility
  if (!this.links.has(sourceId)) {
    this.links.set(sourceId, new Map());
  }
  setLegacyLink(this.links.get(sourceId), key, relationship, previous, replayedLegacyLinks.get(this.links));
}

function restoreRelationships(rows, archive) {
  if (!archive) {
    const wasReplaying = replayingLegacy.has(this);
    replayingLegacy.add(this);
    try {
      for (const row of rows) this.addLink(row.source, row.target, row.type, row.attributes);
    } finally {
      if (!wasReplaying) replayingLegacy.delete(this);
    }
    return;
  }

  const state = {
    accepted: new WeakSet(), reserved: new Set(), recoveredEffects: new Map(),
    nextId: 1, inserted: [], delegated: new Set(), provisional: new Map(), compoundIds: new WeakMap()
  };
  const entries = reserveArchiveIds(rows, state.reserved);
  const previous = activeRestore.get(this);
  activeRestore.set(this, state);
  try {
    for (const row of entries) {
      state.row = row;
      state.inserted.length = 0;
      state.delegated.clear();
      state.displaced = undefined;
      state.provisional.clear();
      // Hooks may write other edges before returning or rejecting the row.
      // Do not attach the wire ID or metadata to those writes.
      let accepted;
      try {
        const result = this.addLink(row.source, row.target, row.type, row.attributes);
        accepted = acceptedRelationship(this, state, result);
      } finally {
        settleReceiverWrites(this, state, accepted);
      }
      if (!accepted) continue;
      state.accepted.add(accepted);
      if (row.id !== undefined) bindArchiveId(this, accepted, row, state);
      restoreRowMetadata(accepted, row.metadata);
    }
  } finally {
    if (previous) activeRestore.set(this, previous);
    else activeRestore.delete(this);
    if (state.order) restoreImportedRowOrder(this, state.order);
  }

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

function acceptedRelationship(graph, state, result) {
  if (result !== undefined) {
    return state.inserted.includes(result) && retainableWrite(graph, state, result)
      ? reviveAcceptedWrite(graph, state, result) : undefined;
  }

  // A void hook can accept one exact write, or a normalized write made by
  // delegating the input tuple through the public addLink implementation.
  let accepted;
  for (const edge of state.inserted) {
    if (!state.delegated.has(edge) && !matchesImportTuple(graph, state.row, edge.source, edge.target, edge.type)) continue;
    if (!retainableWrite(graph, state, edge)) continue;
    if (accepted) return;
    accepted = edge;
  }
  if (accepted) return reviveAcceptedWrite(graph, state, accepted);
}

function retainableWrite(graph, state, edge) {
  if (graph.relationships.get(edge.id) === edge) return true;
  if (!state.displaced?.has(edge) || !graph.entities.has(edge.source) || !graph.entities.has(edge.target)) return false;
  const { inserted } = state;
  const compoundId = state.compoundIds.get(edge) ?? edge.id;
  for (let i = inserted.indexOf(edge) + 1; i < inserted.length; i++) {
    const later = inserted[i];
    if (later.source === edge.source && later.target === edge.target &&
        (state.compoundIds.get(later) ?? later.id) === compoundId) return false;
  }
  return true;
}

function reviveAcceptedWrite(graph, state, edge) {
  if (graph.relationships.get(edge.id) === edge) return edge;
  // Revive only the identified input write. Rejection and unrelated effects
  // retain ordinary compound-ID replacement semantics.
  const key = legacyLinkKey(edge.id, edge);
  recoveredLegacyTypes.set(edge, key.slice(String(edge.target).length + 1));
  edge.id = nextRecoveryId(graph.relationships, state);
  indexRelationship.call(graph, edge);
  const slot = state.slots.get(edge);
  state.order.splice(slot, 0, edge);
  for (let i = slot + 1; i < state.order.length; i++) state.slots.set(state.order[i], i);
  return edge;
}

function bindArchiveId(graph, edge, row, state) {
  const { id } = row;
  const recovered = isRecoveredId(id);
  if (!recovered && (edge.source !== row.source || edge.target !== row.target)) return;

  const previous = graph.relationships.get(id);
  if (previous && previous !== edge) {
    recoverDisplacedEdge(graph, previous, state);
    if (!state.accepted.has(previous)) state.recoveredEffects.set(id, previous);
  }
  const oldKey = legacyLinkKey(edge.id, edge);
  if (recovered) recoveredLegacyTypes.set(edge, row.legacyType ?? oldKey.slice(String(edge.target).length + 1));
  const newKey = legacyLinkKey(id, edge);
  if (oldKey !== newKey) {
    removeLegacyLink(graph.links, oldKey, edge);
    setLegacyLink(graph.links.get(edge.source), newKey, edge);
  }
  if (edge.id !== id) rekeyRelationship(graph, edge, id, state);
  if (!recovered) recoveredLegacyTypes.delete(edge);
}

function recordReceiverWrite(graph, state, compoundId, edge, overwritten) {
  // Track writes by compound ID even if an accepted archive edge temporarily
  // owns it, so a receiver overwrite is visible to the rest of the hook.
  state.compoundIds.set(edge, compoundId);
  const priorWrite = state.provisional.get(compoundId);
  const previous = overwritten?.edge ?? priorWrite?.edge ?? state.recoveredEffects.get(compoundId);
  const write = { edge };
  state.provisional.set(compoundId, write);
  if (!previous || (!overwritten && graph.relationships.get(previous.id) !== previous)) return;
  write.displaced = overwritten ?? snapshotReceiverWrite(graph, previous);
  write.replaces = priorWrite?.replaces ?? previous;
  if (priorWrite && (previous.source !== edge.source || previous.target !== edge.target)) {
    (state.displaced ??= new Set()).add(previous);
  }
  if (!overwritten) deleteRelationship.call(graph, previous.id);
}

function snapshotReceiverWrite(graph, edge) {
  const map = graph.links.get(edge.source);
  const key = legacyLinkKey(edge.id, edge);
  const shadowed = shadowedLegacyLinks.get(map)?.get(key);
  const older = shadowed?.slice(0, map.get(key) === edge ? shadowed.length : shadowed.indexOf(edge));
  return { edge, keys: [...map.keys()], older };
}

function settleReceiverWrites(graph, state, accepted) {
  for (const [compoundId, { edge, displaced, replaces }] of state.provisional) {
    let effect;
    if (edge === accepted) {
      // An accepted archive row does not consume the receiver's prior write.
      if (displaced && graph.entities.has(displaced.edge.source) && graph.entities.has(displaced.edge.target)) {
        effect = displaced.edge;
        if (effect.id === edge.id) {
          // The hook previously observed this write at the freed compound ID.
          // Only move the accepted row now, leaving the receiver edge at that ID.
          recoverDisplacedEdge(graph, edge, state);
          rememberImportedSlot(state, edge);
          rememberImportedSlot(state, effect, replaces);
        } else {
          restoreReceiverSlot(state, effect, replaces);
        }
        restoreReceiverWrite(graph, displaced);
      }
    } else if (graph.relationships.get(edge.id) === edge) {
      effect = edge;
      if (replaces) restoreReceiverSlot(state, edge, replaces);
    }
    if (effect && effect.id !== compoundId) state.recoveredEffects.set(compoundId, effect);
    else state.recoveredEffects.delete(compoundId);
  }
}

function restoreReceiverSlot(state, edge, previous) {
  const slot = state.slots.get(edge);
  if (!previous || state.slots.get(previous) >= slot) return;
  state.order[slot] = previous; // The replaced edge is skipped during replay.
  rememberImportedSlot(state, edge, previous);
}

function restoreReceiverWrite(graph, { edge, keys, older }) {
  const map = graph.links.get(edge.source);
  const key = legacyLinkKey(edge.id, edge);
  const current = map.get(key);
  indexRelationship.call(graph, edge);
  if (current) {
    const shadowed = shadowedLegacyLinks.get(map).get(key);
    const next = shadowed.findIndex(peer => !older?.includes(peer));
    if (next !== -1) {
      shadowed.splice(next, 0, edge);
      map.set(key, shadowed.pop());
    }
  }
  const existing = keys.filter(key => map.has(key));
  const remembered = new Set(existing);
  restoreMapOrder(map, [...existing, ...[...map.keys()].filter(key => !remembered.has(key))]);
}

function reserveArchiveIds(rows, reserved) {
  const entries = [];
  for (const row of rows) {
    const { source, target } = row;
    const prefix = `${source}_`;
    const suffix = `_${target}`;
    const id = row.id;
    if (typeof id === 'string' && !reserved.has(id) &&
        (isRecoveredId(id) || (id.length >= prefix.length + suffix.length &&
          id.startsWith(prefix) && id.endsWith(suffix)))) {
      reserved.add(id);
      entries.push({ ...row, legacyType: typeof row.legacyType === 'string' ? row.legacyType : undefined });
    } else {
      entries.push({ ...row, id: undefined, legacyType: undefined });
    }
  }
  return entries;
}

function nextRecoveryId(relationships, state) {
  let id;
  do id = `legacy:${state.nextId++}`;
  while (state.reserved.has(id) || relationships.has(id));
  return id;
}

function recoverDisplacedEdge(graph, edge, state) {
  const key = legacyLinkKey(edge.id, edge);
  recoveredLegacyTypes.set(edge, key.slice(String(edge.target).length + 1));
  rekeyRelationship(graph, edge, nextRecoveryId(graph.relationships, state), state);
}

function rekeyRelationship(graph, edge, id, state) {
  trackImportedOrder(graph, state);
  const previousId = edge.id;
  edge.id = id;
  graph.relationships.delete(previousId);
  graph.relationships.set(id, edge);
  for (const ids of [graph.relationshipsBySource.get(edge.source), graph.relationshipsByTarget.get(edge.target)]) {
    ids.delete(previousId);
    ids.add(id);
  }
}

function trackImportedOrder(graph, state) {
  if (state.order) return;
  state.order = [];
  state.slots = new WeakMap();
  for (const edge of graph.relationships.values()) rememberImportedSlot(state, edge);
}

function rememberImportedSlot(state, edge, replaced) {
  // An ordinary overwrite does not move a relationship's canonical Map slot.
  const index = state.slots.get(replaced) ?? state.order.length;
  state.order[index] = edge;
  state.slots.set(edge, index);
}

function restoreImportedRowOrder(graph, order) {
  // Rekeying the earlier row changes its Map/Set slot, not its row order.
  // Reinsert the live imported records in their original order once.
  for (const edge of order) {
    const { id, source, target } = edge;
    if (graph.relationships.get(id) !== edge) continue;
    graph.relationships.delete(id);
    graph.relationships.set(id, edge);
    for (const ids of [graph.relationshipsBySource.get(source), graph.relationshipsByTarget.get(target)]) {
      ids.delete(id);
      ids.add(id);
    }
  }
}

function getLegacyLinkOrder() {
  let order;
  for (const outgoing of this.links?.values() ?? []) {
    const byKey = shadowedLegacyLinks.get(outgoing);
    if (!byKey) continue;
    order ??= [];
    for (const [key, shadowed] of byKey) {
      const start = order.length;
      for (const relationship of shadowed) {
        if (this.relationships.get(relationship.id) === relationship) order.push(relationship.id);
      }
      const visible = outgoing.get(key);
      if (this.relationships.get(visible.id) === visible) order.push(visible.id);
      if (order.length < start + 2) order.length = start;
    }
  }
  if (order?.length) return order;
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
    restoreArchivedMapOrder(links, order.sources);
  }
  if (!Array.isArray(order?.keys)) return;
  for (const entry of order.keys) {
    if (!Array.isArray(entry)) continue;
    const outgoing = links.get(entry[0]);
    const keys = entry[1];
    if (outgoing) restoreArchivedMapOrder(outgoing, keys);
  }
}

function restoreArchivedMapOrder(map, keys) {
  if (!Array.isArray(keys)) return;
  const present = keys.filter(key => map.has(key));
  const archived = new Set(present);
  if (present.length < 2 || archived.size !== present.length) return;
  // Reorder only the archived subsequence; leave receiver-only entries in place.
  let index = 0;
  restoreMapOrder(map, [...map.keys()].map(key => archived.has(key) ? present[index++] : key));
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
  stampRowModified(relationship);
  
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
  removeLegacyLink(graph.links, legacyLinkKey(id, relationship), relationship);
}

function removeEntityRelationships(entityId) {
  const state = activeRestore.get(this);
  if (state) {
    // Detached edges are absent from the indexes below but must not outlive
    // the endpoint either, even if the hook recreates the same entity ID.
    const touches = edge => edge?.source === entityId || edge?.target === entityId;
    for (const edge of state.displaced ?? []) {
      if (touches(edge)) state.displaced.delete(edge);
    }
    for (const write of state.provisional.values()) {
      if (touches(write.displaced?.edge)) write.displaced = undefined;
      if (touches(write.replaces)) write.replaces = undefined;
    }
  }
  const outgoing = this.relationshipsBySource.get(entityId);
  if (outgoing) for (const id of outgoing) deleteRelationship.call(this, id);
  const incoming = this.relationshipsByTarget.get(entityId);
  if (incoming) for (const id of incoming) deleteRelationship.call(this, id);

  const replayed = replayedLegacyLinks.get(this.links);
  if (replayed) {
    for (const relationship of replayed) {
      if (relationship.source !== entityId && relationship.target !== entityId) continue;
      removeLegacyLink(this.links, legacyLinkKey(relationship.id, relationship), relationship);
      replayed.delete(relationship);
    }
  }
  this.links.delete(entityId);
}

function removeIndexEntry(index, endpoint, id) {
  const ids = index?.get(endpoint);
  if (ids?.delete(id) && ids.size === 0) index.delete(endpoint);
}

function setLegacyLink(outgoing, key, relationship, previous, replayed) {
  const current = outgoing.get(key);
  if (current && current !== previous) {
    let byKey = shadowedLegacyLinks.get(outgoing);
    let shadowed = byKey?.get(key);
    if (shadowed && previous) removeShadowedLink(shadowed, previous);
    if (!replayed?.delete(current)) {
      if (!byKey) shadowedLegacyLinks.set(outgoing, byKey = new Map());
      if (!shadowed) byKey.set(key, shadowed = []);
      shadowed.push(current);
    } else if (shadowed?.length === 0) {
      byKey.delete(key);
    }
  }
  outgoing.set(key, relationship);
}

function removeShadowedLink(shadowed, relationship) {
  const index = shadowed.indexOf(relationship);
  if (index !== -1) shadowed.splice(index, 1);
}

function legacyLinkKey(id, relationship) {
  const { source, target } = relationship;
  // Type updates keep the ID and the legacy key from insertion. The stored
  // endpoints fix both boundaries even when they contain underscores.
  if (isRecoveredId(id)) return `${target}-${recoveredLegacyTypes.get(relationship) ?? relationship.type}`;
  const typeAtInsertion = id.slice(String(source).length + 1, -String(target).length - 1);
  return `${target}-${typeAtInsertion}`;
}

function getRecoveredLegacyType(relationship) {
  return recoveredLegacyTypes.get(relationship);
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
  delegateLink,
  restoreRelationships,
  getLegacyLinkOrder,
  getLegacyMapOrder,
  getRecoveredLegacyType,
  getRelationshipOrder,
  getRelationship,
  updateRelationship,
  deleteRelationship,
  deleteLink,
  removeEntityRelationships,
  findRelationships,
  getEntityRelationships
}; 