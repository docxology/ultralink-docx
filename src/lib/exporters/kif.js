/**
 * KIF Exporter
 * 
 * Export UltraLink data to Knowledge Interchange Format (KIF).
 */

/**
 * Converts knowledge base to KIF format
 * @param {Object} ultralink - The UltraLink instance
 * @param {Object} options - Export options
 * @param {boolean} options.includeMeta - Whether to include meta-knowledge (default: true)
 * @param {boolean} options.includeFunctions - Whether to include function definitions (default: true)
 * @param {boolean} options.includeRules - Whether to include rule definitions (default: true)
 * @returns {string} KIF string
 */
function toKIF(ultralink, options = {}) {
  const {
    includeMeta = true,
    includeFunctions = true,
    includeRules = true
  } = options;
  
  const timestamp = new Date().toISOString();
  let kif = `;; UltraLink Knowledge Interchange Format (KIF) Export\n`;
  kif += `;; Generated: ${timestamp}\n`;
  
  // Add meta-knowledge
  if (includeMeta) {
    kif += `\n;; Meta-knowledge\n`;
    kif += `(= (creationDate UltraLinkExport) "${timestamp}")\n`;
    kif += `(= (entityCount UltraLinkExport) ${ultralink.entities.size})\n`;
    kif += `(= (relationshipCount UltraLinkExport) ${ultralink.relationships.size})\n`;
  }
  
  // Add function definitions
  if (includeFunctions) {
    kif += `\n;; Functions\n`;
    kif += `(deffunction relationshipCount (?x) (length ?kb.relationships))\n`;
  }
  
  // Add rule definitions
  if (includeRules) {
    kif += `\n;; Rules\n`;
    
    // Example rule for inferring attributes based on entity type
    kif += `(defrule entity-attributes-rule\n`;
    kif += `    "A rule to infer additional attributes for entities based on their type"\n`;
    kif += `    (instance ?entity ?type)\n`;
    kif += `    =>\n`;
    kif += `    (if (eq ?type Person)\n`;
    kif += `        then (assert (isAgent ?entity true))))\n`;
    
    // Example rule for adaptation relationships
    kif += `\n(forall (?x ?y)\n`;
    kif += `    (=> (and (adapts_to ?x ?y) (> (efficiency-adapts_to ?x ?y) 0.8))\n`;
    kif += `        (well-adapted ?x ?y)))\n`;
  }
  
  // Add entities and their attributes
  kif += `\n;; Entities and their attributes\n`;
  for (const entity of ultralink.entities.values()) {
    // Define the entity as an instance of its type
    // Capitalize the first letter of the type
    const capitalizedType = entity.type.charAt(0).toUpperCase() + entity.type.slice(1);
    kif += `(instance ${entity.id} ${capitalizedType})\n`;
    
    // Add entity attributes
    for (const [key, value] of Object.entries(entity.attributes || {})) {
      if (key !== 'type') {
        // Format the value based on its type
        let formattedValue;
        if (typeof value === 'string') {
          formattedValue = `"${value.replace(/"/g, '\\"')}"`;
        } else if (typeof value === 'number') {
          formattedValue = value;
        } else if (typeof value === 'boolean') {
          formattedValue = value ? 'true' : 'false';
        } else {
          formattedValue = `"${JSON.stringify(value).replace(/"/g, '\\"')}"`;
        }
        
        kif += `(${key} ${entity.id} ${formattedValue})\n`;
      }
    }
    kif += `\n`;
  }
  
  // Add relationships
  kif += `;; Relationships\n`;
  for (const rel of ultralink.relationships.values()) {
    // Define the relationship
    kif += `(${rel.type} ${rel.source} ${rel.target})\n`;
    
    // Add relationship attributes
    for (const [key, value] of Object.entries(rel.attributes || {})) {
      if (key !== 'type') {
        // Format the value based on its type
        let formattedValue;
        if (typeof value === 'string') {
          formattedValue = `"${value.replace(/"/g, '\\"')}"`;
        } else if (typeof value === 'number') {
          formattedValue = value;
        } else if (typeof value === 'boolean') {
          formattedValue = value ? 'true' : 'false';
        } else {
          formattedValue = `"${JSON.stringify(value).replace(/"/g, '\\"')}"`;
        }
        
        kif += `(${key}-${rel.type} ${rel.source} ${rel.target} ${formattedValue})\n`;
      }
    }
    kif += `\n`;
  }
  
  return kif;
}

/**
 * Format a string for KIF
 * @param {string} str - String to format
 * @returns {string} Formatted string for KIF
 */
function formatKIFString(str) {
  if (str === null || str === undefined) return 'nil';
  
  str = String(str);
  
  // If it contains spaces, special characters, or is a number, wrap in quotes
  if (/\s/.test(str) || 
      str.includes('(') || 
      str.includes(')') || 
      str.includes(',') || 
      str.includes('.') || 
      !isNaN(Number(str))) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

/**
 * Format any value as a KIF atom
 * @param {any} value - Value to format
 * @returns {string} Formatted value for KIF
 */
function formatKIFAtom(value) {
  if (typeof value === 'string') {
    return formatKIFString(value);
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  } else if (value === null || value === undefined) {
    return 'nil';
  } else if (Array.isArray(value)) {
    // Format array as a list
    return `(list ${value.map(formatKIFAtom).join(' ')})`;
  } else if (typeof value === 'object') {
    // Format object as a property list
    const pairs = [];
    for (const [k, v] of Object.entries(value)) {
      pairs.push(formatKIFString(k));
      pairs.push(formatKIFAtom(v));
    }
    return `(plist ${pairs.join(' ')})`;
  } else {
    return formatKIFString(String(value));
  }
}

module.exports = { toKIF }; 