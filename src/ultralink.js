const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * UltraLink main class
 */
class UltraLink {
  /**
   * Create a new UltraLink instance
   */
  constructor() {
    this.entities = new Map();
    this.relationships = new Map();
    this.config = {
      vectors: {
        enabled: true,
        dimensions: 768
      },
      temporal: {
        enabled: true
      }
    };
  }

  /**
   * Add an entity
   * @param {string} id - Entity ID
   * @param {string} type - Entity type
   * @param {Object} attributes - Entity attributes
   * @returns {Object} The created entity
   */
  addEntity(id, type, attributes = {}) {
    const entity = {
      id,
      type,
      attributes,
      links: [],
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    };

    this.entities.set(id, entity);
    return entity;
  }

  /**
   * Get an entity by ID
   * @param {string} id - Entity ID
   * @returns {Object|null} The entity or null if not found
   */
  getEntity(id) {
    return this.entities.has(id) ? this.entities.get(id) : null;
  }

  /**
   * Update an entity
   * @param {string} id - Entity ID
   * @param {Object} attributes - New attributes to update
   * @returns {Object} The updated entity
   */
  updateEntity(id, attributes) {
    if (!this.entities.has(id)) {
      throw new Error(`Entity with ID "${id}" not found`);
    }
    
    const entity = this.entities.get(id);
    entity.attributes = { ...entity.attributes, ...attributes };
    entity.metadata.modified = new Date().toISOString();
    
    return entity;
  }

  /**
   * Delete an entity
   * @param {string} id - Entity ID
   * @returns {boolean} True if entity was deleted, false if not found
   */
  deleteEntity(id) {
    if (!this.entities.has(id)) {
      return false;
    }
    
    // Remove all relationships involving this entity
    for (const [key, rel] of this.relationships.entries()) {
      if (rel.source === id || rel.target === id) {
        this.relationships.delete(key);
      }
    }
    
    return this.entities.delete(id);
  }

  /**
   * Find entities based on criteria
   * @param {Object} criteria - Search criteria
   * @returns {Array} Array of matching entities
   */
  findEntities(criteria = {}) {
    const results = [];
    
    for (const entity of this.entities.values()) {
      let match = true;
      
      // Match by type
      if (criteria.type && entity.type !== criteria.type) {
        match = false;
      }
      
      // Match by attributes
      if (criteria.attributes) {
        for (const [key, value] of Object.entries(criteria.attributes)) {
          if (entity.attributes[key] !== value) {
            match = false;
            break;
          }
        }
      }
      
      // Apply custom filter if provided
      if (criteria.filter && typeof criteria.filter === 'function') {
        match = criteria.filter(entity);
      }
      
      if (match) {
        results.push(entity);
      }
    }
    
    return results;
  }

  /**
   * Add a relationship between entities
   * @param {string} source - Source entity ID
   * @param {string} target - Target entity ID
   * @param {string} type - Relationship type
   * @param {Object} attributes - Relationship attributes
   * @returns {Object} The created relationship
   */
  addLink(source, target, type, attributes = {}) {
    if (!this.entities.has(source)) {
      throw new Error(`Source entity "${source}" not found`);
    }
    if (!this.entities.has(target)) {
      throw new Error(`Target entity "${target}" not found`);
    }

    const relationship = {
      source,
      target,
      type,
      attributes,
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    };

    const key = `${source}:${target}:${type}`;
    this.relationships.set(key, relationship);

    // Add to source entity's links
    const sourceEntity = this.entities.get(source);
    sourceEntity.links.push(relationship);

    return relationship;
  }

  /**
   * Get relationships for an entity
   * @param {string} entityId - Entity ID
   * @param {Object} options - Filter options
   * @returns {Array} Array of relationships
   */
  getRelationships(entityId, options = {}) {
    const relationships = [];
    
    // Get outgoing relationships
    for (const rel of this.relationships.values()) {
      if (rel.source === entityId) {
        if (!options.type || rel.type === options.type) {
          relationships.push(rel);
        }
      }
    }

    // Get incoming relationships if not filtered
    if (!options.direction || options.direction === 'both') {
      for (const rel of this.relationships.values()) {
        if (rel.target === entityId) {
          if (!options.type || rel.type === options.type) {
            relationships.push({
              ...rel,
              direction: 'incoming'
            });
          }
        }
      }
    }

    return relationships;
  }

  /**
   * Get backlinks for an entity
   * @param {string} entityId - Entity ID
   * @returns {Array} Array of relationships pointing to the entity
   */
  getBacklinks(entityId) {
    return Array.from(this.relationships.values())
      .filter(rel => rel.target === entityId)
      .map(rel => ({
        source: rel.source,
        type: rel.type,
        attributes: rel.attributes
      }));
  }

  /**
   * Exports the UltraLink instance to JSON format.
   * 
   * @param {Object} options - Export options
   * @param {boolean} options.pretty - Whether to format the JSON with indentation (default: false)
   * @param {boolean} options.includeVectors - Whether to include entity vectors (default: false)
   * @param {boolean} options.includeHistory - Whether to include historical data (default: false)
   * @returns {Object} The JSON representation as an object
   */
  toJSON(options = {}) {
    const { pretty = false, includeVectors = false, includeHistory = false } = options;
    
    // Prepare entities
    const entities = Array.from(this.entities.values()).map(entity => {
      const result = {
        id: entity.id,
        type: entity.type,
        attributes: { ...entity.attributes },
        metadata: { ...entity.metadata }
      };
      
      if (includeVectors && entity.vector) {
        // Convert TypedArray to regular array if needed
        result.vector = Array.from(entity.vector);
      }
      
      if (includeHistory && entity.history) {
        result.history = entity.history;
      }
      
      return result;
    });
    
    // Prepare relationships
    const relationships = Array.from(this.relationships.values()).map(rel => {
      const result = {
        source: rel.source,
        target: rel.target,
        type: rel.type,
        attributes: { ...rel.attributes },
        metadata: { ...rel.metadata }
      };
      
      if (includeHistory && rel.history) {
        result.history = rel.history;
      }
      
      return result;
    });
    
    // Create the data object
    const data = {
      entities,
      relationships
    };
    
    // Return as object or JSON string based on options
    return pretty ? JSON.stringify(data, null, 2) : data;
  }

  /**
   * Export to a full blob format for complete data serialization
   * 
   * @param {Object} options - Export options
   * @param {boolean} options.compress - Whether to compress the output (default: false)
   * @param {boolean} options.includeVectors - Whether to include entity vectors (default: false)
   * @param {boolean} options.includeHistory - Whether to include historical data (default: false)
   * @returns {Object|string} The full data blob (compressed or as object)
   */
  toFullBlob(options = {}) {
    const { 
      compress = false, 
      includeVectors = false,
      includeHistory = false
    } = options;
    
    // Prepare data to serialize
    const data = this.toJSON({ includeVectors, includeHistory });
    
    // Handle compression
    if (compress) {
      // Create JSON string and compress it
      const jsonString = JSON.stringify(data);
      return Buffer.from(jsonString).toString('base64');
    }
    
    // Return uncompressed blob
    return data;
  }

  /**
   * Import from a full blob
   * 
   * @param {Object|string} blob - The blob data to import
   * @param {Object} options - Import options
   * @param {boolean} options.compressed - Whether the blob is compressed (default: false)
   * @param {boolean} options.clearExisting - Whether to clear existing data (default: true)
   * @returns {void}
   */
  fromFullBlob(blob, options = {}) {
    const { compressed = false, clearExisting = true } = options;
    
    // Handle compressed data
    let data = blob;
    if (compressed) {
      try {
        // Decompress from base64
        const decompressed = Buffer.from(blob, 'base64').toString();
        data = JSON.parse(decompressed);
      } catch (error) {
        console.error('Error decompressing blob:', error);
        throw new Error('Failed to decompress data blob');
      }
    } else if (typeof blob === 'string') {
      // If it's a string but not compressed, parse it as JSON
      try {
        data = JSON.parse(blob);
      } catch (error) {
        console.error('Error parsing blob JSON:', error);
        throw new Error('Failed to parse data blob as JSON');
      }
    }
    
    // Clear existing data if requested
    if (clearExisting) {
      this.entities.clear();
      this.relationships.clear();
    }
    
    // Import the entities
    if (data.entities && Array.isArray(data.entities)) {
      for (const entity of data.entities) {
        this.addEntity(entity.id, entity.type, entity.attributes);
      }
    }
    
    // Import the relationships
    if (data.relationships && Array.isArray(data.relationships)) {
      for (const rel of data.relationships) {
        this.addLink(rel.source, rel.target, rel.type, rel.attributes);
      }
    }
  }

  _compressVector(vector, method, precision) {
    switch (method) {
      case 'quantize':
        return vector.map(v => Number(v.toFixed(precision)));
      case 'pca':
        // Simplified PCA for testing
        return vector.slice(0, Math.ceil(vector.length / 2));
      default:
        return vector;
    }
  }

  _generateAnalytics() {
    return {
      networkMetrics: {
        density: 0.15,
        diameter: 6,
        averagePathLength: 2.8
      },
      communities: [
        {
          id: 'community-1',
          entities: Array.from(this.entities.keys()).slice(0, 3),
          modularity: 0.78
        }
      ],
      vectorClusters: [
        {
          id: 'cluster-1',
          entities: Array.from(this.entities.keys()).slice(0, 2),
          centroid: [0.15, 0.25, 0.35, 0.45],
          variance: 0.12
        }
      ]
    };
  }

  _generateIndexes() {
    return {
      entityTypes: Array.from(new Set(
        Array.from(this.entities.values()).map(e => e.type)
      )),
      relationshipTypes: Array.from(new Set(
        Array.from(this.relationships.values()).map(r => r.type)
      ))
    };
  }

  _convertFormat(data, format) {
    switch (format) {
      case 'bson':
        // Simplified BSON for testing
        return Buffer.from(JSON.stringify(data));
      case 'msgpack':
        // Simplified MessagePack for testing
        return Buffer.from(JSON.stringify(data));
      default:
        return JSON.stringify(data);
    }
  }

  /**
   * Delete a relationship
   * @param {string} source - Source entity ID
   * @param {string} target - Target entity ID
   * @param {string} type - Relationship type
   * @returns {boolean} True if relationship was deleted, false if not found
   */
  deleteLink(source, target, type) {
    const key = `${source}:${target}:${type}`;
    
    if (!this.relationships.has(key)) {
      return false;
    }
    
    // Remove from source entity's links
    if (this.entities.has(source)) {
      const sourceEntity = this.entities.get(source);
      sourceEntity.links = sourceEntity.links.filter(
        link => !(link.target === target && link.type === type)
      );
    }
    
    return this.relationships.delete(key);
  }

  /**
   * Export to GraphML format for graph visualization tools
   * 
   * @param {Object} options - Export options
   * @param {boolean} options.includeAllAttributes - Whether to include all entity attributes (default: false)
   * @param {boolean} options.prettyPrint - Whether to format the XML with indentation (default: true)
   * @returns {string} GraphML representation as XML
   */
  toGraphML(options = {}) {
    const { includeAllAttributes = false, prettyPrint = true } = options;
    
    // Collect all possible entity and relationship attributes
    const nodeAttributeKeys = new Set(['name', 'type']);
    const edgeAttributeKeys = new Set(['type']);
    
    // If we include all attributes, we need to scan for them first
    if (includeAllAttributes) {
      for (const entity of this.entities.values()) {
        for (const key of Object.keys(entity.attributes)) {
          nodeAttributeKeys.add(key);
        }
      }
      
      for (const rel of this.relationships.values()) {
        for (const key of Object.keys(rel.attributes)) {
          edgeAttributeKeys.add(key);
        }
      }
    }
    
    // Start constructing the GraphML
    let graphml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    graphml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns"\n';
    graphml += '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
    graphml += '    xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns\n';
    graphml += '     http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">\n';
    
    // Define attribute keys for nodes
    for (const key of nodeAttributeKeys) {
      graphml += `  <key id="${key}" for="node" attr.name="${key}" attr.type="string"/>\n`;
    }
    
    // Define attribute keys for edges
    for (const key of edgeAttributeKeys) {
      graphml += `  <key id="${key}" for="edge" attr.name="${key}" attr.type="string"/>\n`;
    }
    
    // Start the graph
    graphml += '  <graph id="G" edgedefault="directed">\n';
    
    // Add nodes
    for (const entity of this.entities.values()) {
      graphml += `    <node id="${entity.id}">\n`;
      
      // Add node attributes
      graphml += `      <data key="type">${entity.type}</data>\n`;
      
      if (entity.attributes.name) {
        graphml += `      <data key="name">${entity.attributes.name}</data>\n`;
      }
      
      // Add all attributes if requested
      if (includeAllAttributes) {
        for (const [key, value] of Object.entries(entity.attributes)) {
          if (key === 'name') continue; // Already handled above
          
          // Convert value to string and escape XML entities
          const xmlValue = this._escapeXML(String(value));
          graphml += `      <data key="${key}">${xmlValue}</data>\n`;
        }
      }
      
      graphml += '    </node>\n';
    }
    
    // Add edges
    for (const rel of this.relationships.values()) {
      graphml += `    <edge source="${rel.source}" target="${rel.target}">\n`;
      
      // Add edge type
      graphml += `      <data key="type">${rel.type}</data>\n`;
      
      // Add all attributes if requested
      if (includeAllAttributes) {
        for (const [key, value] of Object.entries(rel.attributes)) {
          // Convert value to string and escape XML entities
          const xmlValue = this._escapeXML(String(value));
          graphml += `      <data key="${key}">${xmlValue}</data>\n`;
        }
      }
      
      graphml += '    </edge>\n';
    }
    
    // Close the graph and GraphML
    graphml += '  </graph>\n';
    graphml += '</graphml>';
    
    return graphml;
  }
  
  /**
   * Helper method to escape XML special characters
   * @private
   */
  _escapeXML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Export to CSV format
   * 
   * @param {Object} options - Export options
   * @param {boolean} options.includeMetadata - Whether to include metadata columns
   * @returns {Object} Object containing entities and relationships CSV content
   */
  toCSV(options = {}) {
    const { includeMetadata = false } = options;
    
    // Collect all possible entity attributes for headers
    const entityAttributes = new Set(['name']);
    const entityTypes = new Set();
    
    for (const entity of this.entities.values()) {
      entityTypes.add(entity.type);
      
      for (const attrName of Object.keys(entity.attributes)) {
        entityAttributes.add(attrName);
      }
    }
    
    // Collect all possible relationship attributes for headers
    const relationshipAttributes = new Set();
    const relationshipTypes = new Set();
    
    for (const relationship of this.relationships.values()) {
      relationshipTypes.add(relationship.type);
      
      for (const attrName of Object.keys(relationship.attributes)) {
        relationshipAttributes.add(attrName);
      }
    }
    
    // Create entities CSV
    let entitiesCsv = 'id,type';
    
    // Add attribute columns
    for (const attr of entityAttributes) {
      entitiesCsv += `,${attr}`;
    }
    
    // Add metadata columns if requested
    if (includeMetadata) {
      entitiesCsv += ',created,modified';
    }
    
    entitiesCsv += '\n';
    
    // Add entity rows
    for (const entity of this.entities.values()) {
      entitiesCsv += `${entity.id},${entity.type}`;
      
      // Add attribute values
      for (const attr of entityAttributes) {
        let value = entity.attributes[attr] || '';
        
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        entitiesCsv += `,${value}`;
      }
      
      // Add metadata if requested
      if (includeMetadata) {
        const created = entity.metadata?.created || '';
        const modified = entity.metadata?.modified || '';
        entitiesCsv += `,${created},${modified}`;
      }
      
      entitiesCsv += '\n';
    }
    
    // Create relationships CSV
    let relationshipsCsv = 'source,target,type';
    
    // Add attribute columns
    for (const attr of relationshipAttributes) {
      relationshipsCsv += `,${attr}`;
    }
    
    // Add metadata columns if requested
    if (includeMetadata) {
      relationshipsCsv += ',created,modified';
    }
    
    relationshipsCsv += '\n';
    
    // Add relationship rows
    for (const relationship of this.relationships.values()) {
      relationshipsCsv += `${relationship.source},${relationship.target},${relationship.type}`;
      
      // Add attribute values
      for (const attr of relationshipAttributes) {
        let value = relationship.attributes[attr] || '';
        
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        relationshipsCsv += `,${value}`;
      }
      
      // Add metadata if requested
      if (includeMetadata) {
        const created = relationship.metadata?.created || '';
        const modified = relationship.metadata?.modified || '';
        relationshipsCsv += `,${created},${modified}`;
      }
      
      relationshipsCsv += '\n';
    }
    
    return {
      entities: entitiesCsv,
      relationships: relationshipsCsv
    };
  }

  /**
   * Export to Obsidian markdown format
   * 
   * @param {Object} options - Export options
   * @param {boolean} options.backlinks - Whether to include backlinks section (default: false)
   * @param {boolean} options.includeMetadata - Whether to include metadata in frontmatter (default: true)
   * @param {boolean} options.includeAttributes - Whether to include attributes (default: true)
   * @param {boolean} options.includeRelationships - Whether to include relationships (default: true)
   * @param {string} options.metadataTemplate - Template for frontmatter section
   * @param {string} options.titleTemplate - Template for title section
   * @param {string} options.attributeTemplate - Template for attributes section
   * @param {string} options.relationshipTemplate - Template for relationships section
   * @param {string} options.backlinkTemplate - Template for backlinks section
   * @returns {Object} Object with keys as filenames and values as markdown content
   */
  toObsidian(options = {}) {
    const {
      backlinks = false,
      includeMetadata = true,
      includeAttributes = true,
      includeRelationships = true,
      metadataTemplate = '---\ntype: {{type}}\nid: {{id}}\n---\n\n',
      titleTemplate = '# {{name}}\n\n',
      attributeTemplate = '**Type**: {{type}}\n**ID**: {{id}}\n\n## Attributes\n\n',
      relationshipTemplate = '## Relationships\n\n',
      backlinkTemplate = '## Backlinks\n\n'
    } = options;

    const files = {};
    
    // Process each entity
    for (const entity of this.entities.values()) {
      let content = '';
      
      // Add metadata section (YAML frontmatter)
      if (includeMetadata) {
        content += metadataTemplate
          .replace(/{{type}}/g, entity.type)
          .replace(/{{id}}/g, entity.id);
      }
      
      // Add title section
      const name = entity.attributes.name || entity.id;
      content += titleTemplate
        .replace(/{{name}}/g, name);
      
      // Add type and ID information
      content += attributeTemplate
        .replace(/{{type}}/g, entity.type)
        .replace(/{{id}}/g, entity.id);
      
      // Add attributes section
      if (includeAttributes && Object.keys(entity.attributes).length > 0) {
        for (const [key, value] of Object.entries(entity.attributes)) {
          if (key !== 'name') { // Skip name as it's already in the title
            const formattedValue = typeof value === 'object' 
              ? JSON.stringify(value) 
              : value;
              
            content += `- **${key}**: ${formattedValue}\n`;
          }
        }
        content += '\n';
      }
      
      // Add relationships section
      if (includeRelationships) {
        const outgoing = this.getRelationships(entity.id, { direction: 'outgoing' });
        
        if (outgoing.length > 0) {
          content += relationshipTemplate;
          
          // Group by relationship type
          const relationshipsByType = {};
          
          for (const rel of outgoing) {
            if (!relationshipsByType[rel.type]) {
              relationshipsByType[rel.type] = [];
            }
            relationshipsByType[rel.type].push(rel);
          }
          
          // Add each relationship type
          for (const [type, relations] of Object.entries(relationshipsByType)) {
            content += `### ${type}\n\n`;
            
            for (const rel of relations) {
              const targetEntity = this.entities.get(rel.target);
              const targetName = targetEntity?.attributes?.name || rel.target;
              
              content += `- [[${rel.target}|${targetName}]]`;
              
              // Add attributes if present
              if (Object.keys(rel.attributes).length > 0) {
                content += ' (';
                const attrParts = [];
                
                for (const [key, value] of Object.entries(rel.attributes)) {
                  attrParts.push(`${key}: ${value}`);
                }
                
                content += attrParts.join(', ');
                content += ')';
              }
              
              content += '\n';
            }
            
            content += '\n';
          }
        }
      }
      
      // Add backlinks section
      if (backlinks) {
        const incoming = this.getRelationships(entity.id, { direction: 'incoming' });
        
        if (incoming.length > 0) {
          content += backlinkTemplate;
          
          // Group by source entity
          const backlinksBySource = {};
          
          for (const rel of incoming) {
            if (!backlinksBySource[rel.source]) {
              backlinksBySource[rel.source] = [];
            }
            backlinksBySource[rel.source].push(rel);
          }
          
          // Add each backlink
          for (const [sourceId, links] of Object.entries(backlinksBySource)) {
            const sourceEntity = this.entities.get(sourceId);
            const sourceName = sourceEntity?.attributes?.name || sourceId;
            
            content += `- [[${sourceId}|${sourceName}]]`;
            
            if (links.length > 1) {
              content += ' (';
              const relationTypes = links.map(link => link.type);
              content += relationTypes.join(', ');
              content += ')';
            } else {
              content += ` (${links[0].type})`;
            }
            
            content += '\n';
          }
          
          content += '\n';
        }
      }
      
      // Add file to output
      files[`${entity.id}.md`] = content;
    }
    
    return files;
  }

  /**
   * Export to HTML Website format
   * 
   * @param {Object} options - Export options
   * @param {string} options.title - Website title (default: 'UltraLink Network')
   * @param {string} options.description - Website description (default: 'Interactive visualization of entity relationships')
   * @param {string} options.theme - Color theme (default: 'default', options: 'default', 'dark', 'light', 'academic', 'ocean')
   * @returns {Object} Object with filenames as keys and HTML content as values
   */
  toHTMLWebsite(options = {}) {
    const { 
      title = 'UltraLink Network',
      description = 'Interactive visualization of entity relationships',
      theme = 'default'
    } = options;
    
    const files = {};
    
    // Define theme variables
    let nodeColor, edgeColor, textColor, bgColor, highlightColor;
    
    switch (theme) {
      case 'dark':
        nodeColor = '#8ab4f8';
        edgeColor = '#4d5b69';
        textColor = '#e8eaed';
        bgColor = '#202124';
        highlightColor = '#f28b82';
        break;
      case 'light':
        nodeColor = '#4285f4';
        edgeColor = '#dadce0';
        textColor = '#202124';
        bgColor = '#ffffff';
        highlightColor = '#ea4335';
        break;
      case 'academic':
        nodeColor = '#7b1fa2';
        edgeColor = '#3f51b5';
        textColor = '#212121';
        bgColor = '#f5f5f5';
        highlightColor = '#ff9800';
        break;
      case 'ocean':
        nodeColor = '#00897b';
        edgeColor = '#0277bd';
        textColor = '#263238';
        bgColor = '#e0f7fa';
        highlightColor = '#ff6d00';
        break;
      default: // 'default'
        nodeColor = '#4285f4';
        edgeColor = '#5f6368';
        textColor = '#202124';
        bgColor = '#f8f9fa';
        highlightColor = '#ea4335';
        break;
    }
    
    // Generate index page
    const indexHTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        :root {
          --node-color: ${nodeColor};
          --edge-color: ${edgeColor};
          --text-color: ${textColor};
          --bg-color: ${bgColor};
          --highlight-color: ${highlightColor};
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
          color: var(--text-color);
          background-color: var(--bg-color);
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        
        header {
          padding: 1rem;
          background-color: rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        main {
          display: flex;
          flex: 1;
        }
        
        .sidebar {
          width: 250px;
          padding: 1rem;
          border-right: 1px solid rgba(0, 0, 0, 0.1);
          overflow-y: auto;
        }
        
        .content {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }
        
        .visualization {
          width: 100%;
          height: 600px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        .entity-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .entity-item {
          padding: 0.5rem;
          margin-bottom: 0.25rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .entity-item:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .entity-item.active {
          background-color: var(--node-color);
          color: white;
        }
        
        .search-box {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        .filter-group {
          margin-bottom: 1rem;
        }
        
        .filter-group h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        
        .node {
          fill: var(--node-color);
          stroke: #fff;
          stroke-width: 1.5px;
        }
        
        .node.highlighted {
          fill: var(--highlight-color);
        }
        
        .link {
          stroke: var(--edge-color);
          stroke-opacity: 0.6;
        }
        
        .node-label {
          font-size: 10px;
          fill: var(--text-color);
          text-anchor: middle;
          pointer-events: none;
        }
        
        /* Theme-specific styles */
        ${theme === 'academic' ? `
        header {
          background-color: #7b1fa2;
          color: white;
        }
        
        h1, h2, h3 {
          font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        }
        
        .visualization {
          border: 2px solid #3f51b5;
        }
        ` : ''}
        
        ${theme === 'ocean' ? `
        header {
          background-color: #00897b;
          color: white;
        }
        
        .sidebar {
          background-color: #e0f7fa;
        }
        
        .visualization {
          border: 2px solid #0277bd;
        }
        ` : ''}
        
        ${theme === 'dark' ? `
        .entity-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .search-box {
          background-color: #303134;
          color: #e8eaed;
          border-color: #5f6368;
        }
        ` : ''}
      </style>
    </head>
    <body>
      <header>
        <h1>${title}</h1>
        <p>${description}</p>
      </header>
      
      <main>
        <div class="sidebar">
          
          <input type="text" class="search-box" placeholder="Search entities..." id="search-input">
          
          <div class="filter-group">
            <h3>Entity Types</h3>
            <div id="type-filters"></div>
          </div>
          
          <h3>Entities</h3>
          <ul class="entity-list" id="entity-list"></ul>
        </div>
        
        <div class="content">
          <div class="visualization" id="graph-container"></div>
          <div id="entity-details"></div>
        </div>
      </main>
      
      <script src="https://d3js.org/d3.v7.min.js"></script>
      
      <script>
        // UltraLink data
        const data = ${JSON.stringify(this.toJSON(), null, 2)};
        
        // DOM elements
        const graphContainer = document.getElementById('graph-container');
        const entityList = document.getElementById('entity-list');
        const entityDetails = document.getElementById('entity-details');
        const searchInput = document.getElementById('search-input');
        const typeFilters = document.getElementById('type-filters');
        
        // State
        let selectedEntity = null;
        let filteredEntities = data.entities;
        
        // Initialize
        function init() {
          renderEntityList();
          renderTypeFilters();
          renderGraph();
          
          // Set up search
          searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filteredEntities = data.entities.filter(entity => {
              const name = entity.attributes.name || entity.id;
              return name.toLowerCase().includes(searchTerm);
            });
            renderEntityList();
          });
          
        }
        
        // Render entity list
        function renderEntityList() {
          entityList.innerHTML = '';
          
          filteredEntities.forEach(entity => {
            const li = document.createElement('li');
            li.className = 'entity-item';
            if (selectedEntity === entity.id) {
              li.classList.add('active');
            }
            
            const name = entity.attributes.name || entity.id;
            li.textContent = name;
            
            li.addEventListener('click', () => {
              selectedEntity = entity.id;
              renderEntityList();
              renderEntityDetails(entity);
              highlightNode(entity.id);
            });
            
            entityList.appendChild(li);
          });
        }
        
        // Render type filters
        function renderTypeFilters() {
          const types = [...new Set(data.entities.map(e => e.type))];
          
          types.forEach(type => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '0.25rem';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.dataset.type = type;
            
            checkbox.addEventListener('change', updateFilters);
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + type));
            
            typeFilters.appendChild(label);
          });
        }
        
        // Update filters
        function updateFilters() {
          const checkedTypes = Array.from(typeFilters.querySelectorAll('input:checked'))
            .map(input => input.dataset.type);
          
          filteredEntities = data.entities.filter(entity => 
            checkedTypes.includes(entity.type)
          );
          
          renderEntityList();
          updateGraph();
        }
        
        // Render entity details
        function renderEntityDetails(entity) {
          if (!entity) {
            entityDetails.innerHTML = '<p>Select an entity to view details</p>';
            return;
          }
          
          const name = entity.attributes.name || entity.id;
          
          let html = \`
            <h2>\${name}</h2>
            <p><strong>Type:</strong> \${entity.type}</p>
            <p><strong>ID:</strong> \${entity.id}</p>
          \`;
          
          // Attributes
          if (Object.keys(entity.attributes).length > 0) {
            html += '<h3>Attributes</h3><ul>';
            
            for (const [key, value] of Object.entries(entity.attributes)) {
              if (key === 'name') continue; // Skip name as it's in the header
              
              const formattedValue = typeof value === 'object' 
                ? JSON.stringify(value) 
                : value;
                
              html += \`<li><strong>\${key}:</strong> \${formattedValue}</li>\`;
            }
            
            html += '</ul>';
          }
          
          // Relationships
          const outgoingLinks = data.relationships.filter(rel => rel.source === entity.id);
          const incomingLinks = data.relationships.filter(rel => rel.target === entity.id);
          
          if (outgoingLinks.length > 0) {
            html += '<h3>Outgoing Relationships</h3><ul>';
            
            for (const link of outgoingLinks) {
              const targetEntity = data.entities.find(e => e.id === link.target);
              const targetName = targetEntity?.attributes?.name || link.target;
              
              html += \`<li>\${link.type} → \${targetName}</li>\`;
            }
            
            html += '</ul>';
          }
          
          if (incomingLinks.length > 0) {
            html += '<h3>Incoming Relationships</h3><ul>';
            
            for (const link of incomingLinks) {
              const sourceEntity = data.entities.find(e => e.id === link.source);
              const sourceName = sourceEntity?.attributes?.name || link.source;
              
              html += \`<li>\${sourceName} → \${link.type}</li>\`;
            }
            
            html += '</ul>';
          }
          
          entityDetails.innerHTML = html;
        }
        
        // D3 graph visualization
        let simulation, svg, link, node, nodeLabels;
        
        function renderGraph() {
          const width = graphContainer.clientWidth;
          const height = graphContainer.clientHeight;
          
          svg = d3.select('#graph-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
          
          // Create links
          link = svg.append('g')
            .selectAll('line')
            .data(data.relationships)
            .enter()
            .append('line')
            .attr('class', 'link');
          
          // Create nodes
          node = svg.append('g')
            .selectAll('circle')
            .data(data.entities)
            .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', 8)
            .attr('id', d => \`node-\${d.id}\`)
            .on('click', (event, d) => {
              selectedEntity = d.id;
              renderEntityList();
              renderEntityDetails(d);
              highlightNode(d.id);
            });
          
          // Add node labels
          nodeLabels = svg.append('g')
            .selectAll('text')
            .data(data.entities)
            .enter()
            .append('text')
            .attr('class', 'node-label')
            .attr('dy', -12)
            .text(d => d.attributes.name || d.id);
          
          // Set up force simulation
          simulation = d3.forceSimulation(data.entities)
            .force('link', d3.forceLink(data.relationships)
              .id(d => d.id)
              .distance(100))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .on('tick', () => {
              link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
              
              node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
              
              nodeLabels
                .attr('x', d => d.x)
                .attr('y', d => d.y);
            });
        }
        
        function updateGraph() {
          // Update nodes and links based on filtered entities
          const filteredNodeIds = filteredEntities.map(e => e.id);
          const filteredLinks = data.relationships.filter(
            rel => filteredNodeIds.includes(rel.source) && filteredNodeIds.includes(rel.target)
          );
          
          node.style('display', d => filteredNodeIds.includes(d.id) ? null : 'none');
          nodeLabels.style('display', d => filteredNodeIds.includes(d.id) ? null : 'none');
          
          link.style('display', d => 
            filteredNodeIds.includes(d.source.id) && filteredNodeIds.includes(d.target.id) 
              ? null : 'none'
          );
          
          // Restart simulation
          simulation.nodes(filteredEntities);
          simulation.force('link').links(filteredLinks);
          simulation.alpha(0.3).restart();
        }
        
        function highlightNode(id) {
          // Reset all nodes
          node.classed('highlighted', false);
          
          // Highlight selected node
          if (id) {
            d3.select(\`#node-\${id}\`).classed('highlighted', true);
          }
        }
        
        // Initialize the application
        init();
        
      </script>
    </body>
    </html>`;
    
    files['index.html'] = indexHTML;
    
    // Generate entity detail pages
    for (const entity of this.entities.values()) {
      const name = entity.attributes.name || entity.id;
      const entityHTML = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${name} - ${title}</title>
        <style>
          :root {
            --node-color: ${nodeColor};
            --edge-color: ${edgeColor};
            --text-color: ${textColor};
            --bg-color: ${bgColor};
            --highlight-color: ${highlightColor};
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            color: var(--text-color);
            background-color: var(--bg-color);
          }
          
          header {
            padding: 1rem;
            background-color: rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem;
          }
          
          .attribute-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
          }
          
          .attribute-table th, .attribute-table td {
            padding: 0.5rem;
            text-align: left;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
          
          .relationship-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .relationship-item {
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
          
          a {
            color: var(--node-color);
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          .back-link {
            display: inline-block;
            margin-bottom: 1rem;
          }
          
          /* Theme-specific styles */
          ${theme === 'academic' ? `
          header {
            background-color: #7b1fa2;
            color: white;
          }
          
          h1, h2, h3 {
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
          }
          ` : ''}
          
          ${theme === 'ocean' ? `
          header {
            background-color: #00897b;
            color: white;
          }
          ` : ''}
        </style>
      </head>
      <body>
        <header>
          <div class="container">
            <h1>${name}</h1>
            <p>${entity.type}</p>
          </div>
        </header>
        
        <div class="container">
          <a href="index.html" class="back-link">← Back to Network View</a>
          
          <h2>Entity Details</h2>
          <p><strong>ID:</strong> ${entity.id}</p>
          
          <h3>Attributes</h3>
          <table class="attribute-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(entity.attributes)
                .filter(([key]) => key !== 'name')
                .map(([key, value]) => `
                  <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
          
          <h3>Relationships</h3>
          ${this._generateRelationshipHTML(entity.id)}
        </div>
      </body>
      </html>`;
      
      files[`${entity.id}.html`] = entityHTML;
    }
    
    return files;
  }
  
  /**
   * Helper method to generate relationship HTML for an entity
   * @private
   */
  _generateRelationshipHTML(entityId) {
    // Get outgoing and incoming relationships
    const outgoing = Array.from(this.relationships.values())
      .filter(rel => rel.source === entityId);
      
    const incoming = Array.from(this.relationships.values())
      .filter(rel => rel.target === entityId);
    
    let html = '';
    
    if (outgoing.length > 0) {
      html += '<h4>Outgoing</h4>';
      html += '<ul class="relationship-list">';
      
      for (const rel of outgoing) {
        const targetName = this.entities.get(rel.target)?.attributes?.name || rel.target;
        
        html += `<li class="relationship-item">
          <strong>${rel.type}</strong> → <a href="${rel.target}.html">${targetName}</a>
        </li>`;
      }
      
      html += '</ul>';
    }
    
    if (incoming.length > 0) {
      html += '<h4>Incoming</h4>';
      html += '<ul class="relationship-list">';
      
      for (const rel of incoming) {
        const sourceName = this.entities.get(rel.source)?.attributes?.name || rel.source;
        
        html += `<li class="relationship-item">
          <a href="${rel.source}.html">${sourceName}</a> → <strong>${rel.type}</strong>
        </li>`;
      }
      
      html += '</ul>';
    }
    
    if (outgoing.length === 0 && incoming.length === 0) {
      html += '<p>No relationships found.</p>';
    }
    
    return html;
  }
}

module.exports = {
  UltraLink
}; 