/**
 * UltraLink Obsidian Exporter
 * 
 * This module implements an exporter for Obsidian markdown format.
 */

const { Exporter } = require('./base');

/**
 * Exporter for Obsidian markdown format
 */
class ObsidianExporter extends Exporter {
  constructor(store) {
    super(store);
  }
  
  /**
   * Export all entities to Obsidian markdown format
   * @returns {Object} - Map of entity IDs to markdown content
   */
  exportAll() {
    const result = {};
    
    for (const [id, entity] of this.store.entities) {
      result[id] = this.exportEntity(id);
    }
    
    return result;
  }
  
  /**
   * Export a single entity to Obsidian markdown format
   * @param {string} entityId - ID of the entity to export
   * @returns {string} - Markdown content
   */
  exportEntity(entityId) {
    const entity = this.store.getEntity(entityId);
    
    if (!entity) {
      throw new Error(`Entity not found: ${entityId}`);
    }
    
    let markdown = `# ${entity.id}\n\n`;
    
    // Add type and attributes section
    markdown += `## Metadata\n\n`;
    markdown += `- Type: ${entity.type}\n`;
    
    for (const [key, value] of Object.entries(entity.attributes)) {
      if (key === 'content') continue; // Content will be added separately
      markdown += `- ${key}: ${value}\n`;
    }
    
    // Add content if available
    if (entity.attributes.content) {
      markdown += `\n## Content\n\n${entity.attributes.content}\n\n`;
    }
    
    // Add links section
    if (entity.links.length > 0) {
      markdown += `\n## Links\n\n`;
      
      // Group links by type
      const linksByType = entity.links.reduce((acc, link) => {
        if (!acc[link.type]) {
          acc[link.type] = [];
        }
        acc[link.type].push(link);
        return acc;
      }, {});
      
      for (const [type, links] of Object.entries(linksByType)) {
        markdown += `### ${type}\n\n`;
        
        for (const link of links) {
          markdown += `- [[${link.target}]]`;
          
          // Add metadata if available
          if (Object.keys(link.metadata).length > 0) {
            markdown += ` (${Object.entries(link.metadata)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')})`;
          }
          
          markdown += '\n';
        }
        
        markdown += '\n';
      }
    }
    
    return markdown;
  }
  
  /**
   * Export all entities with a specific relationship type
   * @param {string} type - Relationship type to export
   * @returns {Object} - Map of source entity IDs to target entity IDs
   */
  exportRelationshipType(type) {
    const result = {};
    
    for (const [id, entity] of this.store.entities) {
      const relevantLinks = entity.links.filter(link => link.type === type);
      
      if (relevantLinks.length > 0) {
        result[id] = relevantLinks.map(link => link.target);
      }
    }
    
    return result;
  }
}

module.exports = {
  ObsidianExporter
}; 