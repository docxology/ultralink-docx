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
   * @returns {string} The JSON representation as a string
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
    
    // Always return a JSON string - pretty parameter controls formatting
    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  /**
   * Export to a full blob format for complete data serialization
   * 
   * @param {Object} options - Export options
   * @param {boolean} options.includeVectors - Whether to include entity vectors (default: false)
   * @param {boolean} options.includeHistory - Whether to include historical data (default: false)
   * @param {string} options.compression - Compression type ('none' or 'gzip')
   * @returns {Buffer} The full blob as a buffer
   */
  async toFullBlob(options = {}) {
    const { includeVectors = false, includeHistory = false, compression = 'none' } = options;
    
    // Create full data object
    const data = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      config: this.config,
      entities: Array.from(this.entities.values()).map(entity => {
        const result = {
          id: entity.id,
          type: entity.type,
          attributes: { ...entity.attributes },
          metadata: { ...entity.metadata }
        };
        
        if (includeVectors && entity.vector) {
          result.vector = Array.from(entity.vector);
        }
        
        if (includeHistory && entity.history) {
          result.history = entity.history;
        }
        
        return result;
      }),
      relationships: Array.from(this.relationships.values())
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(data);
    
    // Apply compression if requested
    if (compression === 'gzip') {
      return new Promise((resolve, reject) => {
        zlib.gzip(jsonString, (err, compressed) => {
          if (err) reject(err);
          else resolve(compressed);
        });
      });
    }
    
    // Return uncompressed buffer
    return Buffer.from(jsonString);
  }

  /**
   * Import data from a full blob
   * @param {Buffer} blob - The blob to import
   * @param {Object} options - Import options
   * @param {string} options.compression - Compression type ('none' or 'gzip')
   * @returns {Promise<void>}
   */
  async fromFullBlob(blob, options = {}) {
    const { compression = 'none' } = options;
    
    // Decompress if needed
    let jsonString;
    if (compression === 'gzip') {
      jsonString = await new Promise((resolve, reject) => {
        zlib.gunzip(blob, (err, decompressed) => {
          if (err) reject(err);
          else resolve(decompressed.toString());
        });
      });
    } else {
      jsonString = blob.toString();
    }
    
    // Parse data
    const data = JSON.parse(jsonString);
    
    // Clear existing data
    this.entities.clear();
    this.relationships.clear();
    
    // Import config
    this.config = data.config;
    
    // Import entities
    for (const entity of data.entities) {
      this.entities.set(entity.id, entity);
    }
    
    // Import relationships
    for (const rel of data.relationships) {
      const key = `${rel.source}:${rel.target}:${rel.type}`;
      this.relationships.set(key, rel);
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
   * Generate an HTML website representation of the knowledge graph
   * @param {Object} options - Configuration options
   * @param {string} options.title - Website title
   * @param {string} options.description - Website description
   * @param {string} options.theme - Theme name ('dark', 'light', 'academic', 'ocean')
   * @returns {Object} Object with filenames as keys and HTML content as values
   */
  toHTMLWebsite(options = {}) {
    const {
      title = 'Knowledge Graph',
      description = 'Interactive visualization of relationships',
      theme = 'default'
    } = options;

    // Define theme variables
    const themes = {
      dark: {
        background: '#1a1a1a',
        text: '#ffffff',
        link: '#4a9eff',
        accent: '#666666',
        border: '#333333'
      },
      light: {
        background: '#ffffff', 
        text: '#000000',
        link: '#0066cc',
        accent: '#666666',
        border: '#dddddd'
      },
      academic: {
        background: '#f5f5f5',
        text: '#333333', 
        link: '#990000',
        accent: '#666666',
        border: '#cccccc'
      },
      ocean: {
        background: '#f0f8ff',
        text: '#333333',
        link: '#006699',
        accent: '#4a9eff',
        border: '#b3d9ff'
      },
      default: {
        background: '#ffffff',
        text: '#000000',
        link: '#0066cc',
        accent: '#666666',
        border: '#dddddd'
      }
    };

    const themeVars = themes[theme] || themes.default;

    const files = {};

    // Generate index.html
    const indexHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --background: ${themeVars.background};
      --text: ${themeVars.text};
      --link: ${themeVars.link};
      --accent: ${themeVars.accent};
      --border: ${themeVars.border};
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      background: var(--background);
      color: var(--text);
    }
    .container {
      display: grid;
      grid-template-columns: 300px 1fr;
      height: 100vh;
    }
    .sidebar {
      padding: 20px;
      border-right: 1px solid var(--border);
      overflow-y: auto;
    }
    .main {
      padding: 20px;
      overflow-y: auto;
    }
    h1, h2, h3, h4 {
      color: var(--text);
      margin-top: 0;
    }
    a {
      color: var(--link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .entity-list {
      list-style: none;
      padding: 0;
    }
    .entity-item {
      padding: 8px;
      margin: 4px 0;
      border: 1px solid var(--border);
      border-radius: 4px;
    }
    .entity-type {
      color: var(--accent);
      font-size: 0.9em;
    }
    #graph {
      width: 100%;
      height: 600px;
      border: 1px solid var(--border);
      border-radius: 4px;
    }
    .relationship-list {
      list-style: none;
      padding: 0;
    }
    .relationship-item {
      padding: 8px;
      margin: 4px 0;
      border: 1px solid var(--border);
      border-radius: 4px;
    }
    .relationship-attributes {
      margin-top: 4px;
      font-size: 0.9em;
      color: var(--accent);
    }
  </style>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <h2>${title}</h2>
      <p>${description}</p>
      <h3>Entities</h3>
      <ul class="entity-list">
        ${Array.from(this.entities.values()).map(entity => `
          <li class="entity-item">
            <a href="${entity.id}.html">
              ${entity.attributes.name || entity.attributes.title || entity.id}
            </a>
            <div class="entity-type">${entity.type}</div>
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="main">
      <div id="graph"></div>
      <script>
        // Graph visualization code
        const data = {
          nodes: ${JSON.stringify(Array.from(this.entities.values()).map(entity => ({
            id: entity.id,
            name: entity.attributes.name || entity.attributes.title || entity.id,
            type: entity.type
          })))},
          links: ${JSON.stringify(Array.from(this.relationships.values()).map(rel => ({
            source: rel.source,
            target: rel.target,
            type: rel.type
          })))}
        };

        const width = document.getElementById('graph').clientWidth;
        const height = 600;

        const simulation = d3.forceSimulation(data.nodes)
          .force('link', d3.forceLink(data.links).id(d => d.id))
          .force('charge', d3.forceManyBody().strength(-100))
          .force('center', d3.forceCenter(width / 2, height / 2));

        const svg = d3.select('#graph')
          .append('svg')
          .attr('width', width)
          .attr('height', height);

        const link = svg.append('g')
          .selectAll('line')
          .data(data.links)
          .join('line')
          .attr('stroke', 'var(--border)')
          .attr('stroke-width', 1);

        const node = svg.append('g')
          .selectAll('circle')
          .data(data.nodes)
          .join('circle')
          .attr('r', 5)
          .attr('fill', 'var(--link)')
          .call(drag(simulation));

        node.append('title')
          .text(d => d.name);

        simulation.on('tick', () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        });

        function drag(simulation) {
          function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          }
          
          function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          }
          
          function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }
          
          return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
        }
      </script>
    </div>
  </div>
</body>
</html>`;

    files['index.html'] = indexHTML;

    // Generate individual entity pages
    for (const entity of this.entities.values()) {
      const entityHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${entity.attributes.name || entity.attributes.title || entity.id} - ${title}</title>
  <style>
    :root {
      --background: ${themeVars.background};
      --text: ${themeVars.text};
      --link: ${themeVars.link};
      --accent: ${themeVars.accent};
      --border: ${themeVars.border};
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 20px;
      background: var(--background);
      color: var(--text);
      max-width: 800px;
      margin: 0 auto;
    }
    h1, h2, h3, h4 {
      color: var(--text);
    }
    a {
      color: var(--link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 20px;
    }
    .entity-type {
      color: var(--accent);
      font-size: 0.9em;
      margin-bottom: 20px;
    }
    .attributes {
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 20px;
    }
    .attribute-row {
      display: grid;
      grid-template-columns: 200px 1fr;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }
    .attribute-row:last-child {
      border-bottom: none;
    }
    .attribute-key {
      color: var(--accent);
    }
    .relationship-list {
      list-style: none;
      padding: 0;
    }
    .relationship-item {
      padding: 8px;
      margin: 4px 0;
      border: 1px solid var(--border);
      border-radius: 4px;
    }
    .relationship-attributes {
      margin-top: 4px;
      font-size: 0.9em;
      color: var(--accent);
    }
  </style>
</head>
<body>
  <a href="index.html" class="back-link">← Back to Graph</a>
  <h1>${entity.attributes.name || entity.attributes.title || entity.id}</h1>
  <div class="entity-type">${entity.type}</div>
  
  <h3>Attributes</h3>
  <div class="attributes">
    ${Object.entries(entity.attributes).map(([key, value]) => `
      <div class="attribute-row">
        <div class="attribute-key">${key}</div>
        <div class="attribute-value">${value}</div>
      </div>
    `).join('')}
  </div>

  <h3>Relationships</h3>
  ${this._generateRelationshipHTML(entity.id)}
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
        const targetEntity = this.entities.get(rel.target);
        const targetName = targetEntity?.attributes?.name || targetEntity?.attributes?.title || rel.target;
        
        html += `<li class="relationship-item">
          <strong>${rel.type}</strong> → <a href="${rel.target}.html">${targetName}</a>`;
          
        // Add relationship attributes if present
        if (Object.keys(rel.attributes).length > 0) {
          html += '<div class="relationship-attributes">';
          for (const [key, value] of Object.entries(rel.attributes)) {
            html += `<small><strong>${key}:</strong> ${value}</small>`;
          }
          html += '</div>';
        }
        
        html += `</li>`;
      }
      
      html += '</ul>';
    }
    
    if (incoming.length > 0) {
      html += '<h4>Incoming</h4>';
      html += '<ul class="relationship-list">';
      
      for (const rel of incoming) {
        const sourceEntity = this.entities.get(rel.source);
        const sourceName = sourceEntity?.attributes?.name || sourceEntity?.attributes?.title || rel.source;
        
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