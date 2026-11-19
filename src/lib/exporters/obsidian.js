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
  const {
    includeMetadata = true,
    includeAttributes = true,
    includeRelationships = true,
    backlinks = true
  } = options;
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
    if (includeMetadata && entity.metadata) {
      const { created, modified } = entity.metadata;
      if (created) content += `created: ${created}\n`;
      if (modified) content += `modified: ${modified}\n`;
    }
    content += '---\n\n';

    // Add title
    const title = entity.attributes.name || entity.attributes.title || entity.id;
    content += `# ${title}\n\n`;
    
    if (includeMetadata) {
      content += `## Metadata\n\n- **Type**: ${entity.type}\n- **ID**: ${entity.id}\n\n`;
    }

    if (includeAttributes) {
      content += '## Attributes\n\n';
      for (const [key, value] of Object.entries(entity.attributes)) {
        if (key !== 'name' && key !== 'title') {
          content += `- **${key}**: ${formatValue(value)}\n`;
        }
      }
      content += '\n';
    }

    if (includeRelationships) {
      content += '## Relationships\n\n';
      const byType = new Map();
      for (const rel of ultralink.getEntityRelationships(entity.id, { direction: 'outgoing' })) {
        if (!rel) continue;
        if (!byType.has(rel.type)) byType.set(rel.type, []);
        byType.get(rel.type).push(rel);
      }
      for (const [type, relationships] of byType) {
        content += `### ${type}\n\n`;
        for (const rel of relationships) {
          const link = noteLink(ultralink, rel.target);
          const attributes = formatRelationshipAttributes(rel);
          content += `- ${link}${attributes ? ` (${attributes})` : ''}\n`;
        }
        content += '\n';
      }
    }

    if (backlinks) {
      let section = '';
      for (const rel of ultralink.getBacklinks(entity.id)) {
        if (!rel) continue;
        const attributes = formatRelationshipAttributes(rel);
        section += `- ${noteLink(ultralink, rel.source)} (${rel.type}${attributes ? `: ${attributes}` : ''})\n`;
      }
      if (section) content += `## Backlinks\n\n${section}\n`;
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

function noteLink(ultralink, id) {
  const attributes = ultralink.entities.get(id)?.attributes;
  const title = attributes?.name || attributes?.title || id;
  return title === id ? `[[${id}]]` : `[[${id}|${title}]]`;
}

function formatValue(value) {
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

function formatRelationshipAttributes(relationship) {
  return Object.entries(relationship.attributes)
    .map(([key, value]) => `${key}: ${formatValue(value)}`)
    .join(', ');
}

module.exports = { toObsidian }; 
