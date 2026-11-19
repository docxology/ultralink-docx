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
  const outgoingBySource = includeRelationships ? new Map() : null;
  const incomingByTarget = backlinks ? new Map() : null;

  // Use the stored endpoints; lookup indexes can retain an ID after an edge is deleted.
  if (outgoingBySource || incomingByTarget) {
    for (const rel of ultralink.relationships.values()) {
      if (outgoingBySource) {
        let byType = outgoingBySource.get(rel.source);
        if (!byType) {
          byType = new Map();
          outgoingBySource.set(rel.source, byType);
        }
        appendRelationship(byType, rel.type, rel);
      }
      if (incomingByTarget) appendRelationship(incomingByTarget, rel.target, rel);
    }
  }
  
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

    if (includeRelationships) content += '## Relationships\n\n';
    const byType = outgoingBySource?.get(entity.id);
    if (byType) {
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

    const incoming = incomingByTarget?.get(entity.id);
    if (incoming) {
      content += '## Backlinks\n\n';
      for (const rel of incoming) {
        const attributes = formatRelationshipAttributes(rel);
        content += `- ${noteLink(ultralink, rel.source)} (${rel.type}${attributes ? `: ${attributes}` : ''})\n`;
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

function appendRelationship(groups, key, relationship) {
  const group = groups.get(key);
  if (group) group.push(relationship);
  else groups.set(key, [relationship]);
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
