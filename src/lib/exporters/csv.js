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
    entitiesCSV += `,${encodeCell(field)}`;
  }
  
  // Add entity rows
  for (const entity of ultralink.entities.values()) {
    let row = `\n${encodeCell(entity.id)},${encodeCell(entity.type)}`;
    
    // Add each attribute value
    for (const field of allAttributeFields) {
      row += `,${encodeAttribute(entity.attributes, field)}`;
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
    relationshipsCSV += `,${encodeCell(field)}`;
  }
  
  // Add relationship rows
  for (const relationship of ultralink.relationships.values()) {
    let row = `\n${encodeCell(relationship.source)},${encodeCell(relationship.target)},${encodeCell(relationship.type)}`;
    
    // Add each attribute value
    for (const field of allRelationshipFields) {
      row += `,${encodeAttribute(relationship.attributes, field)}`;
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

function encodeAttribute(attributes, field) {
  return attributes && Object.hasOwn(attributes, field) ? encodeCell(attributes[field]) : '';
}

function encodeCell(value) {
  if (value == null) return '';

  const text = typeof value === 'object' ? (JSON.stringify(value) ?? '') : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

module.exports = { toCSV }; 