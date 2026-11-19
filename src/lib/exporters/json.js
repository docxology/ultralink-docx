/**
 * JSON Exporter
 * 
 * Export UltraLink data to JSON format.
 */

const { types: { isBigIntObject, isBooleanObject, isNumberObject, isStringObject } } = require('node:util');
const { getLegacyLinkOrder, getRelationshipOrder } = require('../relationship-manager');

const ARCHIVE_VERSION = 1;

// Snapshot only optional row metadata. An unreadable property or a failed
// toJSON hook makes that value unavailable, not the containing graph row.
function jsonMetadata(row) {
  return jsonProperty(row, 'metadata', new Set(), '');
}

function jsonProperty(holder, key, ancestors, jsonKey = key) {
  try {
    let value = holder[key];
    const type = typeof value;
    if (value !== null && (type === 'object' || type === 'function' || type === 'bigint')) {
      const toJSON = value.toJSON;
      if (typeof toJSON === 'function') value = Reflect.apply(toJSON, value, [jsonKey]);
    }
    return jsonValue(value, ancestors);
  } catch {
    return undefined;
  }
}

function jsonValue(value, ancestors) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value || 0 : null;
  if (typeof value !== 'object' || isBigIntObject(value) || ancestors.has(value)) return undefined;
  if (JSON.isRawJSON?.(value)) return JSON.parse(value.rawJSON);
  if (isNumberObject(value)) return jsonValue(+value, ancestors);
  if (isStringObject(value)) return String(value);
  if (isBooleanObject(value)) return Boolean.prototype.valueOf.call(value);

  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      return Array.from({ length: value.length }, (_, i) => jsonProperty(value, String(i), ancestors) ?? null);
    }
    const result = {};
    for (const key of Object.keys(value)) {
      const child = jsonProperty(value, key, ancestors);
      if (child !== undefined) {
        Object.defineProperty(result, key, { value: child, enumerable: true, configurable: true, writable: true });
      }
    }
    return result;
  } finally {
    ancestors.delete(value);
  }
}

/**
 * Converts knowledge base to JSON format
 * @param {Object} ultralink - The UltraLink instance
 * @param {Object} options - Export options
 * @param {boolean} options.pretty - Whether to pretty-print the JSON (default: false)
 * @param {boolean} options.asString - Whether to return a string or object (default: true)
 * @param {boolean} options.includeVectors - Whether to include vector embeddings (default: false)
 * @param {boolean} options.lossless - Write a versioned archive with stored relationship IDs and index order (default: false)
 * @param {boolean} options.includeMetadata - Include metadata on entity and relationship rows (defaults to lossless)
 * @returns {string|Object} JSON string or object
 */
function toJSON(ultralink, options = {}) {
  const { pretty = false, asString = true, includeVectors = false, lossless = false, includeMetadata = lossless } = options;
  
  // Extract entities
  const entities = [];
  for (const entity of ultralink.entities.values()) {
    const entityObj = {
      id: entity.id,
      type: entity.type,
      attributes: entity.attributes || {}
    };
    if (includeMetadata) entityObj.metadata = jsonMetadata(entity);
    
    if (includeVectors && entity.vector) {
      entityObj.vector = Array.isArray(entity.vector) ? entity.vector : Array.from(entity.vector);
    }
    
    entities.push(entityObj);
  }
  
  // Extract relationships
  const relationships = [];
  for (const rel of ultralink.relationships.values()) {
    const record = {
      source: rel.source,
      target: rel.target,
      type: rel.type,
      attributes: rel.attributes || {}
    };
    if (lossless) record.id = rel.id;
    if (includeMetadata) record.metadata = jsonMetadata(rel);
    relationships.push(record);
  }
  
  // Create the result object
  const result = {
    metadata: {
      ...ultralink.metadata,
      exportDate: new Date().toISOString(),
      entityCount: entities.length,
      relationshipCount: relationships.length
    },
    entities,
    relationships
  };
  if (lossless) {
    result.ultralinkArchiveVersion = ARCHIVE_VERSION;
    const legacyLinkOrder = getLegacyLinkOrder.call(ultralink);
    if (legacyLinkOrder) result.legacyLinkOrder = legacyLinkOrder;
    const relationshipOrder = getRelationshipOrder.call(ultralink);
    if (relationshipOrder) result.relationshipOrder = relationshipOrder;
  }
  
  // Return as string or object based on options
  if (asString) {
    return pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);
  } else {
    return result;
  }
}

module.exports = { toJSON, ARCHIVE_VERSION };