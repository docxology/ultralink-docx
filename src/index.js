/**
 * UltraLink
 * 
 * A meta-linking paradigm for plain text relational content with 
 * deterministic deployment capabilities.
 */

// Core components
const { Link, Entity, EntityStore } = require('./core/types');
const { extractObsidianLinks, extractCustomLinks, UltraLinkParser } = require('./core/parser');

// Exporters
const { Exporter } = require('./exporters/base');
const { ObsidianExporter } = require('./exporters/obsidian');
const { DatabaseExporter } = require('./exporters/database');

// Entity templates
const { EntityTemplates, createEntityFromTemplate, formatEntity } = require('./types/entity-templates');

// Integrity checking
const { IntegrityCheckResult, IntegrityChecker } = require('./integrity/checker');

/**
 * UltraLink Core Class
 * 
 * Provides the core functionality for managing and exporting relational content
 * with support for LLM-generated metadata and vector embeddings.
 */

class UltraLink {
  constructor() {
    this.entities = new Map();
    this.metadata = {};
    this.links = new Map(); // Map<string, Set<{target: string, type: string}>>
  }

  /**
   * Create a new entity in the graph
   * @param {string} type - Entity type (e.g., 'person', 'project', 'knowledge-area')
   * @param {string} id - Unique identifier for the entity
   * @param {Object} attributes - Entity attributes
   * @returns {Object} The created entity
   */
  createEntity(type, id, attributes = {}) {
    const entity = { id, type, attributes };
    this.entities.set(id, entity);
    this.links.set(id, new Set());
    return entity;
  }

  /**
   * Create a link between two entities
   * @param {string} sourceId - Source entity ID
   * @param {string} targetId - Target entity ID
   * @param {string} type - Link type
   * @returns {Object} The source entity
   */
  createLink(sourceId, targetId, type = 'default') {
    if (!this.entities.has(sourceId)) {
      throw new Error(`Source entity not found: ${sourceId}`);
    }
    if (!this.entities.has(targetId)) {
      throw new Error(`Target entity not found: ${targetId}`);
    }

    const sourceLinks = this.links.get(sourceId);
    sourceLinks.add({ target: targetId, type });

    return this.entities.get(sourceId);
  }

  /**
   * Get all links for an entity
   * @param {string} entityId - Entity ID
   * @returns {Set<{target: string, type: string}>} Set of links
   */
  getLinks(entityId) {
    return this.links.get(entityId) || new Set();
  }

  /**
   * Export the entire graph to JSON format
   * @returns {Object} JSON representation of the graph
   */
  toJSON() {
    const entities = Array.from(this.entities.values()).map(entity => ({
      ...entity,
      links: Array.from(this.getLinks(entity.id))
    }));

    return {
      entities,
      metadata: this.metadata
    };
  }

  /**
   * Export the graph to CSV format
   * @returns {string} CSV representation of the graph
   */
  toCSV() {
    const allKeys = new Set();
    const rows = [];

    // Collect all possible keys from entities and their attributes
    for (const entity of this.entities.values()) {
      const flatKeys = this._flattenKeys(entity.attributes);
      flatKeys.forEach(key => allKeys.add(key));
      
      // Add special handling for LLM insights confidence
      if (entity.attributes.llm_insights?.key_findings) {
        entity.attributes.llm_insights.key_findings.forEach(finding => {
          if (finding.confidence) {
            allKeys.add('llm_insights_confidence');
          }
        });
      }
    }

    // Add metadata keys
    if (this.metadata) {
      const metadataKeys = this._flattenKeys(this.metadata);
      metadataKeys.forEach(key => allKeys.add(`metadata_${key}`));
      
      // Special handling for temporal metadata
      if (this.metadata.temporal_analysis?.knowledge_evolution) {
        this.metadata.temporal_analysis.knowledge_evolution.forEach(event => {
          if (event.timeframe) {
            allKeys.add(`metadata_temporal_timeframe`);
          }
        });
      }
    }

    // Create header row
    const headers = ['id', 'type', ...Array.from(allKeys).sort(), 'links'];
    rows.push(headers.join(','));

    // Create data rows
    for (const entity of this.entities.values()) {
      const row = new Array(headers.length).fill('');
      row[0] = entity.id;
      row[1] = entity.type;

      const flatData = this._flattenObject(entity.attributes);
      
      // Add special handling for LLM insights confidence
      if (entity.attributes.llm_insights?.key_findings) {
        const confidences = entity.attributes.llm_insights.key_findings
          .map(finding => finding.confidence)
          .filter(Boolean);
        if (confidences.length > 0) {
          flatData.llm_insights_confidence = Math.max(...confidences);
        }
      }

      // Add metadata to each row
      if (this.metadata) {
        const flatMetadata = this._flattenObject(this.metadata);
        for (const [key, value] of Object.entries(flatMetadata)) {
          flatData[`metadata_${key}`] = value;
        }
        
        // Special handling for temporal metadata
        if (this.metadata.temporal_analysis?.knowledge_evolution) {
          const timeframes = this.metadata.temporal_analysis.knowledge_evolution
            .map(event => event.timeframe)
            .filter(Boolean);
          if (timeframes.length > 0) {
            flatData.metadata_temporal_timeframe = JSON.stringify(timeframes);
          }
        }
      }

      for (const [key, value] of Object.entries(flatData)) {
        const index = headers.indexOf(key);
        if (index !== -1) {
          row[index] = this._escapeCSV(value);
        }
      }

      // Add links
      const links = Array.from(this.getLinks(entity.id));
      row[headers.length - 1] = this._escapeCSV(JSON.stringify(links));

      rows.push(row.join(','));
    }

    return rows.join('\n');
  }

  /**
   * Export the graph to GraphML format
   * @returns {string} GraphML representation of the graph
   */
  toGraphML() {
    let output = '<?xml version="1.0" encoding="UTF-8"?>\n';
    output += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns"\n';
    output += '         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
    output += '         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns\n';
    output += '         http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">\n';

    // Define keys for attributes and metadata
    const keys = new Set();
    for (const entity of this.entities.values()) {
      const flatKeys = this._flattenKeys(entity.attributes);
      flatKeys.forEach(key => keys.add(key));
    }
    
    // Add metadata keys
    if (this.metadata) {
      const metadataKeys = this._flattenKeys(this.metadata);
      metadataKeys.forEach(key => keys.add(`metadata_${key}`));
    }

    for (const key of keys) {
      output += `  <key id="${this._escapeXML(key)}" for="node" attr.name="${this._escapeXML(key)}" attr.type="string"/>\n`;
    }

    // Add key for edge type
    output += '  <key id="type" for="edge" attr.name="type" attr.type="string"/>\n';

    output += '  <graph id="G" edgedefault="directed">\n';

    // Add metadata node if present
    if (this.metadata) {
      output += '    <node id="metadata">\n';
      const flatMetadata = this._flattenObject(this.metadata);
      for (const [key, value] of Object.entries(flatMetadata)) {
        output += `      <data key="metadata_${this._escapeXML(key)}">${this._escapeXML(value)}</data>\n`;
      }
      output += '    </node>\n';
    }

    // Add nodes
    for (const entity of this.entities.values()) {
      output += `    <node id="${this._escapeXML(entity.id)}">\n`;
      
      const flatData = this._flattenObject(entity.attributes);
      for (const [key, value] of Object.entries(flatData)) {
        output += `      <data key="${this._escapeXML(key)}">${this._escapeXML(value)}</data>\n`;
      }
      
      output += '    </node>\n';
    }

    // Add edges
    let edgeId = 0;
    for (const [sourceId, links] of this.links.entries()) {
      for (const link of links) {
        output += `    <edge id="e${edgeId}" source="${this._escapeXML(sourceId)}" target="${this._escapeXML(link.target)}">\n`;
        output += `      <data key="type">${this._escapeXML(link.type)}</data>\n`;
        output += '    </edge>\n';
        edgeId++;
      }
    }

    output += '  </graph>\n';
    output += '</graphml>';

    return output;
  }

  /**
   * Export the graph to Obsidian format
   * @returns {Object} Map of filenames to markdown content
   */
  toObsidian() {
    const files = {};

    for (const entity of this.entities.values()) {
      let content = `# ${entity.id}\n\n`;
      content += `Type: ${entity.type}\n\n`;

      // Add metadata section
      content += '## Metadata\n\n';
      const flatData = this._flattenObject(entity.attributes);
      for (const [key, value] of Object.entries(flatData)) {
        content += `- ${key}: ${value}\n`;
      }

      // Add vector metadata if present
      if (entity.attributes.vector) {
        content += '\n## Vector Metadata\n\n';
        content += `- Cluster: ${entity.attributes.vector.cluster}\n`;
        content += `- Centroid Distance: ${entity.attributes.vector.centroid_distance}\n`;
        content += '- Similar Concepts:\n';
        for (const concept of entity.attributes.vector.similar_concepts) {
          content += `  - [[${concept.id}]] (similarity: ${concept.similarity})\n`;
        }
      }

      // Add LLM insights if present
      if (entity.attributes.llm_insights) {
        content += '\n## LLM Insights\n\n';
        content += '### Key Findings\n\n';
        for (const finding of entity.attributes.llm_insights.key_findings) {
          content += `- ${finding.statement}\n`;
          content += `  - Justification: ${finding.justification}\n`;
          content += `  - Confidence: ${finding.confidence}\n`;
          content += '  - Supporting Evidence:\n';
          for (const evidence of finding.supporting_evidence) {
            content += `    - [[${evidence}]]\n`;
          }
        }
      }

      // Add links section
      content += '\n## Links\n\n';
      const links = this.getLinks(entity.id);
      if (links.size > 0) {
        for (const link of links) {
          content += `- ${link.type} -> [[${link.target}]]\n`;
        }
      } else {
        content += 'No links\n';
      }

      files[entity.id] = content;
    }

    return files;
  }

  /**
   * Flatten an object's keys into dot notation
   * @param {Object} obj - Object to flatten
   * @param {String} prefix - Prefix for flattened keys
   * @returns {Object} Flattened object
   */
  _flattenObject(obj, prefix = '') {
    const flattened = {};
    
    if (!obj || typeof obj !== 'object') {
      return flattened;
    }
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      if (Array.isArray(value)) {
        // Handle arrays
        if (value.length > 0 && typeof value[0] === 'object') {
          // Array of objects - flatten each object
          value.forEach((item, index) => {
            if (item && typeof item === 'object') {
              const itemFlat = this._flattenObject(item);
              for (const [k, v] of Object.entries(itemFlat)) {
                flattened[`${newKey}_${index}_${k}`] = v;
              }
            }
          });
          
          // Special handling for LLM insights key findings
          if (newKey === 'llm_insights_key_findings') {
            const confidences = value.map(item => item.confidence).filter(Boolean);
            if (confidences.length > 0) {
              flattened.llm_insights_confidence = Math.max(...confidences);
            }
          }
        } else {
          // Array of primitives - stringify
          flattened[newKey] = JSON.stringify(value);
        }
      } else if (value && typeof value === 'object') {
        // Handle nested objects
        const nested = this._flattenObject(value, newKey);
        Object.assign(flattened, nested);
        
        // Special handling for vector metadata
        if (key === 'vector') {
          if (value.embedding) {
            flattened.vector_embedding = JSON.stringify(value.embedding);
          }
          if (value.cluster) {
            flattened.vector_cluster = value.cluster;
          }
          if (value.centroid_distance) {
            flattened.vector_centroid_distance = value.centroid_distance;
          }
          if (value.similar_concepts) {
            flattened.vector_similar_concepts = JSON.stringify(value.similar_concepts);
          }
        }
      } else {
        // Handle primitives
        flattened[newKey] = value;
      }
    }
    
    return flattened;
  }

  /**
   * Get all flattened keys from an object
   * @param {Object} obj - Object to get keys from
   * @param {String} prefix - Prefix for nested keys
   * @returns {Set<String>} Set of flattened keys
   */
  _flattenKeys(obj, prefix = '') {
    const keys = new Set();
    
    if (!obj || typeof obj !== 'object') {
      return keys;
    }
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      if (Array.isArray(value)) {
        keys.add(newKey);
        if (value.length > 0 && typeof value[0] === 'object') {
          value.forEach((item, index) => {
            if (item && typeof item === 'object') {
              const itemKeys = this._flattenKeys(item, `${newKey}_${index}`);
              itemKeys.forEach(k => keys.add(k));
            }
          });
          
          // Special handling for LLM insights key findings
          if (newKey === 'llm_insights_key_findings') {
            keys.add('llm_insights_confidence');
          }
        }
      } else if (value && typeof value === 'object') {
        keys.add(newKey);
        const nestedKeys = this._flattenKeys(value, newKey);
        nestedKeys.forEach(k => keys.add(k));
        
        // Special handling for vector metadata
        if (key === 'vector') {
          keys.add('vector_embedding');
          keys.add('vector_cluster');
          keys.add('vector_centroid_distance');
          keys.add('vector_similar_concepts');
        }
      } else {
        keys.add(newKey);
      }
    }
    
    return keys;
  }

  /**
   * Escape a value for CSV output
   * @param {*} value - Value to escape
   * @returns {string} Escaped value
   */
  _escapeCSV(value) {
    if (value === null || value === undefined) {
      return '';
    }
    
    const str = String(value);
    
    // Check if the value needs to be quoted
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      // Escape quotes by doubling them and wrap in quotes
      return `"${str.replace(/"/g, '""')}"`;
    }
    
    return str;
  }

  /**
   * Escape special characters for XML
   * @private
   * @param {*} value - Value to escape
   * @returns {string} Escaped value
   */
  _escapeXML(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

module.exports = {
  // Main class
  UltraLink,
  
  // Core components
  Link,
  Entity,
  EntityStore,
  UltraLinkParser,
  
  // Utility functions
  extractObsidianLinks,
  extractCustomLinks,
  
  // Exporters
  Exporter,
  ObsidianExporter,
  DatabaseExporter,
  
  // Entity templates
  EntityTemplates,
  createEntityFromTemplate,
  formatEntity,
  
  // Integrity checking
  IntegrityCheckResult,
  IntegrityChecker
}; 