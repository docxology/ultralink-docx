/**
 * JSON Exporter
 * 
 * Export UltraLink data to JSON format.
 */

const { getLegacyLinkOrder, getRelationshipOrder } = require('../relationship-manager');

const ARCHIVE_VERSION = 1;

// Runtime metadata was not part of the published rows. Keep JSON-compatible
// values without letting newly exported BigInts or cycles break the archive.
function jsonMetadata(metadata) {
  const ancestors = [];
  const text = JSON.stringify(metadata, function (_key, value) {
    if (typeof value === 'bigint') return undefined;
    if (value === null || typeof value !== 'object') return value;
    if (Object.getPrototypeOf(value) === BigInt.prototype) return undefined;
    while (ancestors.length && ancestors[ancestors.length - 1] !== this) ancestors.pop();
    if (ancestors.includes(value)) return undefined;
    ancestors.push(value);
    return value;
  });
  return text === undefined ? undefined : JSON.parse(text);
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
    if (includeMetadata) entityObj.metadata = jsonMetadata(entity.metadata);
    
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
    if (includeMetadata) record.metadata = jsonMetadata(rel.metadata);
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