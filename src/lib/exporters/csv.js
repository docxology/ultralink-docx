/**
 * CSV Exporter
 * 
 * Export UltraLink data to CSV format.
 */

/**
 * Converts knowledge base to CSV format
 * @param {Object} ultralink - The UltraLink instance
 * @param {Object} options - Export options
 * @returns {Object} Object containing the exported file data
 */
function toCSV(ultralink, options = {}) {
  // Prepare entities CSV
  let entitiesCSV = 'id,type';
  
  // Collect all attribute fields across entities
  const allAttributeFields = new Set();
  
  for (const entity of ultralink.entities.values()) {
    Object.keys(entity.attributes || {}).forEach(attr => allAttributeFields.add(attr));
  }
  
  // Add all attribute fields to the header
  for (const field of allAttributeFields) {
    entitiesCSV += `,${field}`;
  }
  
  // Add entity rows
  for (const entity of ultralink.entities.values()) {
    let row = `\n${entity.id},${entity.type}`;
    
    // Add each attribute value
    for (const field of allAttributeFields) {
      const value = entity.attributes[field] || '';
      row += `,${typeof value === 'string' ? value.replace(/,/g, ';') : value}`;
    }
    
    entitiesCSV += row;
  }
  
  // Prepare relationships CSV
  let relationshipsCSV = 'source,target,type';
  
  // Collect all relationship attribute fields
  const allRelationshipFields = new Set();
  
  for (const relationship of ultralink.relationships.values()) {
    Object.keys(relationship.attributes || {}).forEach(attr => {
      if (attr !== 'type') {
        allRelationshipFields.add(attr);
      }
    });
  }
  
  // Add all relationship attribute fields to the header
  for (const field of allRelationshipFields) {
    relationshipsCSV += `,${field}`;
  }
  
  // Add relationship rows
  for (const relationship of ultralink.relationships.values()) {
    let row = `\n${relationship.source},${relationship.target},${relationship.type}`;
    
    // Add each attribute value
    for (const field of allRelationshipFields) {
      const value = relationship.attributes[field] || '';
      row += `,${typeof value === 'string' ? value.replace(/,/g, ';') : value}`;
    }
    
    relationshipsCSV += row;
  }
  
  // Create result object with files
  const result = {
    'entities.csv': entitiesCSV,
    'relationships.csv': relationshipsCSV
  };
  
  // Add direct properties for backward compatibility with e2e tests
  result.entities = entitiesCSV;
  result.relationships = relationshipsCSV;
  
  return result;
}

module.exports = { toCSV }; 