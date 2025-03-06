/**
 * Obsidian Exporter
 * 
 * Export UltraLink data to Obsidian markdown format.
 */

/**
 * Converts knowledge base to Obsidian markdown files
 * @param {Object} ultralink - The UltraLink instance
 * @param {Object} options - Export options
 * @returns {Object} Object containing the exported file data
 */
function toObsidian(ultralink, options = {}) {
  const files = {};
  
  // Process each entity
  for (const entity of ultralink.entities.values()) {
    // Create a filename for the entity
    const filename = `${entity.id}.md`;
    let content = '';
    
    // Add YAML frontmatter
    content += '---\n';
    content += `type: ${entity.type}\n`;
    content += `id: ${entity.id}\n`;
    content += '---\n\n';
    
    // Add title
    const title = entity.attributes.name || entity.attributes.title || entity.id;
    content += `# ${title}\n\n`;
    
    // Add metadata section
    content += `## Metadata\n\n`;
    content += `- **Type**: ${entity.type}\n`;
    content += `- **ID**: ${entity.id}\n\n`;
    
    // Add attributes section
    content += `## Attributes\n\n`;
    for (const [key, value] of Object.entries(entity.attributes || {})) {
      if (key !== 'name' && key !== 'title') {
        content += `- **${key}**: ${value}\n`;
      }
    }
    content += '\n';
    
    // Add relationships section
    content += `## Relationships\n\n`;
    
    // Get relationships where this entity is the source
    const outgoingRelationships = Array.from(ultralink.relationships.values())
      .filter(rel => rel.source === entity.id);
    
    if (outgoingRelationships.length > 0) {
      content += `### Outgoing\n\n`;
      for (const rel of outgoingRelationships) {
        const targetEntity = ultralink.entities.get(rel.target);
        const targetName = targetEntity?.attributes?.name || targetEntity?.attributes?.title || rel.target;
        content += `- **${rel.type}** → [[${rel.target}]] (${targetName})\n`;
      }
      content += '\n';
    }
    
    // Get relationships where this entity is the target
    const incomingRelationships = Array.from(ultralink.relationships.values())
      .filter(rel => rel.target === entity.id);
    
    if (incomingRelationships.length > 0) {
      content += `### Incoming\n\n`;
      for (const rel of incomingRelationships) {
        const sourceEntity = ultralink.entities.get(rel.source);
        const sourceName = sourceEntity?.attributes?.name || sourceEntity?.attributes?.title || rel.source;
        content += `- **${rel.type}** ← [[${rel.source}]] (${sourceName})\n`;
      }
      content += '\n';
    }
    
    // Add the file to the result
    files[filename] = content;
  }
  
  // Create an index file
  let indexContent = `# UltraLink Knowledge Base\n\n`;
  indexContent += `## Entities\n\n`;
  
  // Group entities by type
  const entitiesByType = {};
  for (const entity of ultralink.entities.values()) {
    if (!entitiesByType[entity.type]) {
      entitiesByType[entity.type] = [];
    }
    entitiesByType[entity.type].push(entity);
  }
  
  // Add entities grouped by type
  for (const [type, entities] of Object.entries(entitiesByType)) {
    indexContent += `### ${type}\n\n`;
    for (const entity of entities) {
      const name = entity.attributes.name || entity.attributes.title || entity.id;
      indexContent += `- [[${entity.id}]] (${name})\n`;
    }
    indexContent += '\n';
  }
  
  files['index.md'] = indexContent;
  
  return files;
}

/**
 * Helper function to format values for YAML frontmatter
 * @param {any} value - Value to format
 * @returns {string} Formatted value
 */
function formatYamlValue(value) {
  if (value === undefined || value === null) {
    return 'null';
  } else if (typeof value === 'string') {
    // Check if we need to quote the string
    if (value.includes(':') || value.includes('\n') || value.includes("'") || value.includes('"')) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  } else if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  } else {
    return String(value);
  }
}

module.exports = { toObsidian }; 