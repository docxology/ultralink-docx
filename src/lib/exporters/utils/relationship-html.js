/**
 * Relationship HTML utility
 * 
 * This module provides utility functions for rendering relationships as HTML.
 */

/**
 * Generate HTML for entity relationships
 * @param {string} entityId - Entity ID to generate relationships for
 * @returns {string} HTML representation of relationships
 */
function generateRelationshipHTML(entityId) {
  // Get outgoing and incoming relationships for the entity
  const relationships = Array.isArray(this.relationships) ? this.relationships : [];
  const outgoing = relationships.filter(rel => rel && rel.source === entityId);
  const incoming = relationships.filter(rel => rel && rel.target === entityId);
  
  let html = '';
  
  // Generate outgoing relationships HTML
  if (outgoing.length > 0) {
    html += '<h3>Outgoing Relationships</h3>\n';
    html += '<ul class="relationship-list">\n';
    
    for (const rel of outgoing) {
      const targetEntity = this.entities.get(rel.target);
      const targetName = targetEntity ? 
        (targetEntity.attributes && (targetEntity.attributes.name || targetEntity.attributes.title) || rel.target) : 
        rel.target;
      
      html += '<li class="relationship-item">';
      html += `<a href="${rel.target}.html">${targetName}</a> <strong>${rel.type}</strong>`;
      
      // Add relationship attributes if present
      if (rel.attributes && Object.keys(rel.attributes).length > 0) {
        html += '<div class="relationship-attributes">';
        for (const [key, value] of Object.entries(rel.attributes)) {
          html += `<small><strong>${key}:</strong> ${value}</small> `;
        }
        html += '</div>';
      }
      
      html += '</li>';
    }
    
    html += '</ul>';
  }
  
  // Generate incoming relationships HTML
  if (incoming.length > 0) {
    html += '<h3>Incoming Relationships</h3>\n';
    html += '<ul class="relationship-list">\n';
    
    for (const rel of incoming) {
      const sourceEntity = this.entities.get(rel.source);
      const sourceName = sourceEntity ? 
        (sourceEntity.attributes && (sourceEntity.attributes.name || sourceEntity.attributes.title) || rel.source) : 
        rel.source;
      
      html += '<li class="relationship-item">';
      html += `<a href="${rel.source}.html">${sourceName}</a> <strong>${rel.type}</strong> →`;
      
      // Add relationship attributes if present
      if (rel.attributes && Object.keys(rel.attributes).length > 0) {
        html += '<div class="relationship-attributes">';
        for (const [key, value] of Object.entries(rel.attributes)) {
          html += `<small><strong>${key}:</strong> ${value}</small> `;
        }
        html += '</div>';
      }
      
      html += '</li>';
    }
    
    html += '</ul>';
  }
  
  return html;
}

module.exports = {
  generateRelationshipHTML
}; 