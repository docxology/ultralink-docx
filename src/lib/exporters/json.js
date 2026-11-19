/**
 * JSON Exporter
 * 
 * Export UltraLink data to JSON format.
 */

const { getLegacyLinkOrder } = require('../relationship-manager');

/**
 * Converts knowledge base to JSON format
 * @param {Object} ultralink - The UltraLink instance
 * @param {Object} options - Export options
 * @param {boolean} options.pretty - Whether to pretty-print the JSON (default: false)
 * @param {boolean} options.asString - Whether to return a string or object (default: true)
 * @param {boolean} options.includeVectors - Whether to include vector embeddings (default: false)
 * @param {boolean} options.includeMetadata - Include entity and relationship metadata (default: true)
 * @returns {string|Object} JSON string or object
 */
function toJSON(ultralink, options = {}) {
  const { pretty = false, asString = true, includeVectors = false, includeMetadata = true } = options;
  
  // Extract entities
  const entities = [];
  for (const entity of ultralink.entities.values()) {
    const entityObj = {
      id: entity.id,
      type: entity.type,
      attributes: entity.attributes || {}
    };
    if (includeMetadata) entityObj.metadata = entity.metadata;
    
    if (includeVectors && entity.vector) {
      entityObj.vector = Array.isArray(entity.vector) ? entity.vector : Array.from(entity.vector);
    }
    
    entities.push(entityObj);
  }
  
  // Extract relationships
  const relationships = [];
  for (const rel of ultralink.relationships.values()) {
    const record = {
      id: rel.id,
      source: rel.source,
      target: rel.target,
      type: rel.type,
      attributes: rel.attributes || {}
    };
    if (includeMetadata) record.metadata = rel.metadata;
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
  const legacyLinkOrder = getLegacyLinkOrder.call(ultralink);
  if (legacyLinkOrder) result.legacyLinkOrder = legacyLinkOrder;
  
  // Return as string or object based on options
  if (asString) {
    return pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);
  } else {
    return result;
  }
}

module.exports = { toJSON }; 