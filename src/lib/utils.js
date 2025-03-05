/**
 * Utils - Helper functions for the UltraLink system
 * 
 * This module provides utility functions that are used throughout the UltraLink system
 * for operations like object flattening, string escaping, and format conversion.
 */

/**
 * Flatten a nested object into a single-level object with dot notation keys
 * @param {Object} obj - The object to flatten
 * @param {string} prefix - Prefix for the keys
 * @returns {Object} Flattened object
 */
function flattenObject(obj, prefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively flatten objects
      Object.assign(result, flattenObject(value, newKey));
    } else {
      // Assign non-object values directly
      result[newKey] = value;
    }
  }
  
  return result;
}

/**
 * Flatten only the keys of an object for indexing
 * @param {Object} obj - The object to flatten keys for
 * @param {string} prefix - Prefix for the keys
 * @returns {Array} Array of flattened keys
 */
function flattenKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    keys.push(newKey);
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively flatten object keys
      keys.push(...flattenKeys(value, newKey));
    }
  }
  
  return keys;
}

/**
 * Escape special characters in CSV values
 * @param {*} value - The value to escape
 * @returns {string} Escaped CSV value
 */
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If value contains comma, new line, or double quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Escape special characters in XML
 * @param {*} value - The value to escape
 * @returns {string} Escaped XML value
 */
function escapeXML(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Convert a Bayesian network to BIF format
 * @param {Object} network - The network object to convert
 * @returns {string} BIF formatted network
 */
function convertToBIF(network) {
  let bif = 'network {\n';
  bif += '  name = "UltraLink Bayesian Network";\n';
  bif += '}\n\n';
  
  // Convert nodes (variables)
  for (const [id, node] of Object.entries(network.nodes)) {
    bif += `variable ${id} {\n`;
    bif += `  type discrete[${node.states.length}] { ${node.states.join(', ')} };\n`;
    bif += '}\n\n';
  }
  
  // Convert CPTs
  for (const [id, node] of Object.entries(network.nodes)) {
    bif += `probability ( ${id} `;
    
    // Add parents if any
    if (node.parents.length > 0) {
      const parentIds = node.parents.map(parent => parent.id);
      bif += `| ${parentIds.join(', ')} `;
    }
    
    bif += ') {\n';
    
    // Add CPT values
    if (node.parents.length === 0) {
      // Simple table for root nodes
      bif += '  table ';
      const values = node.states.map(state => node.cpt[state] || (1.0 / node.states.length));
      bif += values.join(', ');
      bif += ';\n';
    } else {
      // Conditional probability table
      bif += '  // Conditional probabilities omitted for brevity\n';
      bif += '  // Use specialized BIF tools to view or edit\n';
    }
    
    bif += '}\n\n';
  }
  
  return bif;
}

/**
 * Generate unique IDs for entities or relationships
 * @param {number} length - Length of the ID
 * @returns {string} Unique ID
 */
function generateId(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    id += charset[randomIndex];
  }
  
  return id;
}

/**
 * Parse a string value to its appropriate type
 * @param {string} value - The value to parse
 * @returns {*} Parsed value
 */
function parseValue(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  
  // Try to parse as number
  const numberValue = Number(value);
  if (!isNaN(numberValue) && String(numberValue) === value) {
    return numberValue;
  }
  
  // Try to parse as date
  const dateValue = new Date(value);
  if (!isNaN(dateValue.getTime()) && value.includes('-') && value.length >= 10) {
    return dateValue;
  }
  
  // If JSON object or array
  if ((value.startsWith('{') && value.endsWith('}')) || 
      (value.startsWith('[') && value.endsWith(']'))) {
    try {
      return JSON.parse(value);
    } catch (e) {
      // Not valid JSON, return as string
    }
  }
  
  return value;
}

module.exports = {
  flattenObject,
  flattenKeys,
  escapeCSV,
  escapeXML,
  convertToBIF,
  generateId,
  parseValue
}; 