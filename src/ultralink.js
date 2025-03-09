/**
 * UltraLink - Main Class for Knowledge Graph Management
 * 
 * UltraLink is the main entry point for the UltraLink system, providing a clean API
 * for interacting with a knowledge graph. It includes methods for managing entities
 * and relationships, exporting data in various formats, and generating visualizations.
 */

const EntityManager = require('./lib/entity-manager');
const RelationshipManager = require('./lib/relationship-manager');
const Utils = require('./lib/utils');
const { toJSON } = require('./lib/exporters/json');
const { toCSV } = require('./lib/exporters/csv');
const { toGraphML } = require('./lib/exporters/graphml');
const { toObsidian } = require('./lib/exporters/obsidian');
const { toHTMLWebsite } = require('./lib/exporters/html-website');
const { toKIF } = require('./lib/exporters/kif');
const { toVisualization } = require('./lib/exporters/visualization');
const { toBayesianNetwork } = require('./lib/exporters/bayesian-network');
const { toFullBlob } = require('./lib/exporters/full-blob');
const zlib = require('zlib');
const BayesianNetworkExporter = require('./lib/exporters/bayesian-network');

/**
 * UltraLink class for knowledge graph management
 */
class UltraLink {
  /**
   * Create a new UltraLink instance
   * @param {Object} config - Configuration options
   * @param {boolean} config.preventOverwrite - Whether to prevent overwriting entities with same ID (default: true)
   * @param {boolean} config.timestampEntities - Whether to add timestamps to entities (default: true)
   * @param {string} config.defaultRelationshipType - Default type for relationships (default: 'related_to')
   */
  constructor(config = {}) {
    this.config = {
      preventOverwrite: true,
      timestampEntities: true,
      defaultRelationshipType: 'related_to',
      ...config
    };
    
    this.store = {
      entities: {},
      relationships: {}
    };
    
    // Initialize data storage
    this.entities = new Map();
    this.relationships = new Map();
    this.relationshipsBySource = new Map();
    this.relationshipsByTarget = new Map();
    this.links = new Map();
  }

  /**
   * Add a new entity to the knowledge graph
   * @param {string} id - Unique identifier for the entity
   * @param {string} type - Type/category of the entity
   * @param {Object} attributes - Additional properties of the entity
   * @param {Object} options - Additional options
   * @returns {Object} The created entity
   */
  addEntity(id, type, attributes = {}, options = {}) {
    return EntityManager.addEntity.call(this, id, type, attributes, options);
  }

  /**
   * Retrieve an entity by ID
   * @param {string} id - Entity ID to retrieve
   * @returns {Object|null} The entity or null if not found
   */
  getEntity(id) {
    return EntityManager.getEntity.call(this, id);
  }

  /**
   * Update an existing entity
   * @param {string} id - ID of the entity to update
   * @param {Object} updates - Properties to update
   * @param {Object} options - Additional options
   * @returns {Object} The updated entity
   */
  updateEntity(id, updates, options = {}) {
    return EntityManager.updateEntity.call(this, id, updates, options);
  }

  /**
   * Delete an entity and its relationships
   * @param {string} id - ID of the entity to delete
   * @returns {boolean} Success status
   */
  deleteEntity(id) {
    return EntityManager.deleteEntity.call(this, id);
  }

  /**
   * Find entities matching specified criteria
   * @param {Object} criteria - Search criteria
   * @returns {Array} Matching entities
   */
  findEntities(criteria) {
    return EntityManager.findEntities.call(this, criteria);
  }

  /**
   * Add a relationship between entities
   * @param {string} sourceId - Source entity ID
   * @param {string} targetId - Target entity ID
   * @param {string} type - Relationship type
   * @param {Object} attributes - Additional relationship properties
   * @param {Object} options - Additional options
   * @returns {Object} The created relationship
   */
  addRelationship(sourceId, targetId, type = this.config.defaultRelationshipType, attributes = {}, options = {}) {
    return RelationshipManager.addRelationship.call(this, sourceId, targetId, type, attributes, options);
  }
  
  /**
   * Backward compatibility alias for addRelationship
   * @param {string} sourceId - Source entity ID
   * @param {string} targetId - Target entity ID
   * @param {string} type - Relationship type
   * @param {Object} attributes - Additional relationship properties
   * @param {Object} options - Additional options
   * @returns {Object} The created relationship
   */
  addLink(sourceId, targetId, type = this.config.defaultRelationshipType, attributes = {}, options = {}) {
    return this.addRelationship(sourceId, targetId, type, attributes, options);
  }

  /**
   * Retrieve a relationship by ID
   * @param {string} id - Relationship ID
   * @returns {Object|null} The relationship or null if not found
   */
  getRelationship(id) {
    return RelationshipManager.getRelationship.call(this, id);
  }

  /**
   * Update an existing relationship
   * @param {string} id - ID of relationship to update
   * @param {Object} updates - Properties to update
   * @param {Object} options - Additional options
   * @returns {Object} The updated relationship
   */
  updateRelationship(id, updates, options = {}) {
    return RelationshipManager.updateRelationship.call(this, id, updates, options);
  }

  /**
   * Delete a relationship
   * @param {string} id - ID of relationship to delete
   * @returns {boolean} Success status
   */
  deleteRelationship(id) {
    return RelationshipManager.deleteRelationship.call(this, id);
  }

  /**
   * Find relationships matching specified criteria
   * @param {Object} criteria - Search criteria
   * @returns {Array} Matching relationships
   */
  findRelationships(criteria) {
    return RelationshipManager.findRelationships.call(this, criteria);
  }

  /**
   * Get all relationships for an entity
   * @param {string} entityId - Entity ID
   * @param {Object} options - Filter options
   * @returns {Array} Relationships involving the entity
   */
  getEntityRelationships(entityId, options = {}) {
    return RelationshipManager.getEntityRelationships.call(this, entityId, options);
  }
  
  /**
   * Backward compatibility alias for getEntityRelationships
   * @param {string} entityId - Entity ID
   * @param {Object} options - Filter options 
   * @returns {Array} Relationships involving the entity
   */
  getRelationships(entityId, options = {}) {
    return this.getEntityRelationships(entityId, options);
  }
  
  /**
   * Backward compatibility - get relationships where entity is the target
   * @param {string} entityId - Entity ID
   * @param {Object} options - Filter options
   * @returns {Array} Relationships where entity is the target
   */
  getBacklinks(entityId, options = {}) {
    return this.getEntityRelationships(entityId, { ...options, direction: 'incoming' });
  }

  /**
   * Export data to JSON format
   * @param {Object} options - Export options
   * @returns {string|Object} JSON string or object
   */
  toJSON(options = {}) {
    return toJSON(this, options);
  }

  /**
   * Export data to CSV format
   * @param {Object} options - Export options
   * @returns {string} CSV string
   */
  toCSV(options = {}) {
    return toCSV(this, options);
  }

  /**
   * Export data to GraphML format
   * @param {Object} options - Export options
   * @returns {string} GraphML XML string
   */
  toGraphML(options = {}) {
    return toGraphML(this, options);
  }

  /**
   * Export data to Obsidian markdown format
   * @param {Object} options - Export options
   * @returns {Object} Object with file paths as keys and content as values
   */
  toObsidian(options = {}) {
    return toObsidian(this, options);
  }

  /**
   * Export data to HTML website
   * @param {Object} options - Export options
   * @returns {Object} Object with file paths as keys and content as values
   */
  toHTMLWebsite(options = {}) {
    return toHTMLWebsite(this, options);
  }

  /**
   * Export data to KIF format
   * @param {Object} options - Export options
   * @returns {string} KIF string
   */
  toKIF(options = {}) {
    return toKIF(this, options);
  }

  /**
   * Export the knowledge graph to a visualization format
   * @param {Object} options - Export options
   * @param {string} options.format - Output format (svg, png, d3, cytoscape)
   * @param {string} options.layout - Layout type (force, circular, grid, hierarchical)
   * @param {Object} options.style - Visual style options
   * @param {number} options.width - Canvas width
   * @param {number} options.height - Canvas height
   * @returns {Object} Map of filenames to file contents
   */
  async toVisualization(options = {}) {
    return toVisualization(this, options);
  }

  /**
   * Export the knowledge base as a Bayesian network
   * @param {Object} options - Export options
   * @returns {string|Object} The Bayesian network representation
   */
  toBayesianNetwork(options = {}) {
    const exporter = new BayesianNetworkExporter(this);
    return exporter.export(options);
  }

  /**
   * Export UltraLink data to a comprehensive blob containing all formats
   * @param {Object} options - Export options
   * @param {boolean} options.compressed - Whether to return a compressed (JSON string) version
   * @returns {Object|string} Object containing data in multiple formats, or a JSON string if compressed
   */
  toFullBlob(options = {}) {
    const blob = toFullBlob(this, options);
    
    // Return as JSON string if compressed option is true
    if (options.compressed) {
      return JSON.stringify(blob);
    }
    
    // Otherwise return the blob object directly
    return blob;
  }

  /**
   * Import data from JSON
   * @param {string|Object} json - JSON data to import
   * @param {Object} options - Import options
   * @returns {number} Number of entities imported
   */
  fromJSON(json, options = {}) {
    // To be implemented
    throw new Error('Not implemented');
  }

  /**
   * Import data from CSV
   * @param {string} csv - CSV data to import
   * @param {Object} options - Import options
   * @returns {number} Number of entities imported
   */
  fromCSV(csv, options = {}) {
    // To be implemented
    throw new Error('Not implemented');
  }

  /**
   * Clears all entities and relationships from the knowledge graph
   * @returns {UltraLink} The UltraLink instance for chaining
   */
  clear() {
    this.entities = new Map();
    this.relationships = new Map();
    this.relationshipsBySource = new Map();
    this.relationshipsByTarget = new Map();
    this.links = new Map();
    return this;
  }

  /**
   * Gets statistics about the knowledge graph
   * @returns {Object} Object containing counts of entities and relationships by type
   */
  getStats() {
    const stats = {
      entityCount: this.entities.size,
      relationshipCount: this.relationships.size,
      entityTypes: {},
      relationshipTypes: {}
    };

    // Count entity types
    for (const entity of this.entities.values()) {
      stats.entityTypes[entity.type] = (stats.entityTypes[entity.type] || 0) + 1;
    }

    // Count relationship types
    for (const rel of this.relationships.values()) {
      stats.relationshipTypes[rel.type] = (stats.relationshipTypes[rel.type] || 0) + 1;
    }

    return stats;
  }

  /**
   * Escapes special characters in a string for CSV output
   * @param {*} value - The value to escape
   * @returns {string} The escaped string
   * @private
   */
  _escapeCSV(value) {
    if (value === null || value === undefined) {
      return '';
    }
    
    const str = String(value);
    
    // If the string contains commas, quotes, or newlines, wrap it in quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      // Double any quotes within the string
      return `"${str.replace(/"/g, '""')}"`;
    }
    
    return str;
  }

  /**
   * Escapes special characters in a string for XML output
   * @param {*} value - The value to escape
   * @returns {string} The escaped string
   * @private
   */
  _escapeXML(value) {
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
   * Create a subset of the data based on a specific aspect
   * @param {string} aspect - The aspect to create a subset for (e.g., 'people', 'projects', 'publications')
   * @returns {Object} An object containing entities and links Maps for the subset
   */
  createSubset(aspect) {
    const result = { entities: new Map(), links: new Map() };
    
    if (aspect === 'people') {
      // Get all people
      const people = this.findEntities({ type: 'person' });
      people.forEach(person => result.entities.set(person.id, person));
    } else if (aspect === 'projects') {
      // Get all projects and people
      const projects = this.findEntities({ type: 'project' });
      const people = this.findEntities({ type: 'person' });
      
      projects.forEach(project => result.entities.set(project.id, project));
      people.forEach(person => result.entities.set(person.id, person));
      
      // Get all project-related links
      projects.forEach(project => {
        const links = this.getRelationships(project.id);
        links.forEach(link => result.links.set(`${link.source}-${link.target}-${link.type}`, link));
      });
    } else if (aspect === 'publications') {
      // Get all publications and people
      const publications = this.findEntities({ type: 'publication' });
      const people = this.findEntities({ type: 'person' });
      
      publications.forEach(pub => result.entities.set(pub.id, pub));
      people.forEach(person => result.entities.set(person.id, person));
      
      // Get all publication-related links
      publications.forEach(pub => {
        const links = this.getRelationships(pub.id);
        links.forEach(link => result.links.set(`${link.source}-${link.target}-${link.type}`, link));
      });
    } else {
      throw new Error(`Unknown aspect: ${aspect}`);
    }
    
    return result;
  }

  /**
   * Import data from a full blob
   * @param {Object|string} blob - Full blob data to import
   * @param {Object} options - Import options
   * @returns {UltraLink} The UltraLink instance for chaining
   */
  fromFullBlob(blob, options = {}) {
    let data;
    
    try {
      // Handle compressed blobs
      if (options.compressed) {
        // Decompress the blob (in a real implementation)
        // For now, just parse it
        data = JSON.parse(blob);
      } 
      // Handle string blobs
      else if (typeof blob === 'string') {
        data = JSON.parse(blob);
      }
      // Handle the case where blob is a files object with 'full-export.json' key
      else if (blob['full-export.json']) {
        data = JSON.parse(blob['full-export.json']);
      } else {
        // Use object directly
        data = blob;
      }
    } catch (error) {
      console.warn('Error parsing full blob:', error);
      // For backward compatibility, try to use the blob directly
      data = blob;
    }
    
    // Clear existing data
    this.clear();
    
    // Extract entities from the JSON data
    if (data.json) {
      let jsonData;
      
      // Handle case where data.json is a string that needs to be parsed
      if (typeof data.json === 'string') {
        try {
          jsonData = JSON.parse(data.json);
        } catch (e) {
          console.warn('Error parsing JSON data in blob:', e);
          jsonData = { entities: [], relationships: [] };
        }
      } else {
        jsonData = data.json;
      }
      
      // Process entities
      if (jsonData.entities) {
        // Handle case where entities is a Map or object
        const entities = jsonData.entities;
        if (typeof entities[Symbol.iterator] !== 'function') {
          // Convert to array if it's an object with entries
          if (typeof entities === 'object') {
            const entitiesArray = Object.values(entities);
            for (const entity of entitiesArray) {
              this.addEntity(entity.id, entity.type, entity.attributes);
            }
          }
        } else {
          // It's already iterable (array)
          for (const entity of entities) {
            this.addEntity(entity.id, entity.type, entity.attributes);
          }
        }
        
        // Process relationships
        if (jsonData.relationships) {
          const relationships = jsonData.relationships;
          if (typeof relationships[Symbol.iterator] !== 'function') {
            // Convert to array if it's an object with entries
            if (typeof relationships === 'object') {
              const relationshipsArray = Object.values(relationships);
              for (const rel of relationshipsArray) {
                this.addLink(rel.source, rel.target, rel.type, rel.attributes);
              }
            }
          } else {
            // It's already iterable (array)
            for (const rel of relationships) {
              this.addLink(rel.source, rel.target, rel.type, rel.attributes);
            }
          }
        }
      }
    } else if (data.entities) {
      // Handle legacy format where entities are directly in the data object
      // Handle case where entities is a Map or object
      if (typeof data.entities[Symbol.iterator] !== 'function') {
        // Convert to array if it's an object with entries
        if (typeof data.entities === 'object') {
          const entitiesArray = Object.values(data.entities);
          for (const entity of entitiesArray) {
            this.addEntity(entity.id, entity.type, entity.attributes);
          }
        }
      } else {
        // It's already iterable (array)
        for (const entity of data.entities) {
          this.addEntity(entity.id, entity.type, entity.attributes);
        }
      }
      
      // Process relationships from legacy format
      if (data.relationships) {
        if (typeof data.relationships[Symbol.iterator] !== 'function') {
          // Convert to array if it's an object with entries
          if (typeof data.relationships === 'object') {
            const relationshipsArray = Object.values(data.relationships);
            for (const rel of relationshipsArray) {
              this.addLink(rel.source, rel.target, rel.type, rel.attributes);
            }
          }
        } else {
          // It's already iterable (array)
          for (const rel of data.relationships) {
            this.addLink(rel.source, rel.target, rel.type, rel.attributes);
          }
        }
      }
    }
    
    return this;
  }

  /**
   * Delete a relationship between entities
   * @param {string} sourceId - Source entity ID
   * @param {string} targetId - Target entity ID
   * @param {string} type - Relationship type
   * @returns {boolean} True if the relationship was deleted, false if it didn't exist
   */
  deleteLink(sourceId, targetId, type) {
    // Generate relationship ID
    const id = `${sourceId}_${type}_${targetId}`;
    
    // Delete from relationships map
    const deleted = this.relationships.delete(id);
    
    // Clean up relationship indices
    if (deleted) {
      // Clean up relationshipsBySource
      if (this.relationshipsBySource.has(sourceId)) {
        this.relationshipsBySource.get(sourceId).delete(id);
      }
      
      // Clean up relationshipsByTarget
      if (this.relationshipsByTarget.has(targetId)) {
        this.relationshipsByTarget.get(targetId).delete(id);
      }
      
      // Clean up links map
      if (this.links.has(sourceId)) {
        this.links.get(sourceId).delete(`${targetId}-${type}`);
      }
    }
    
    return deleted;
  }
}

// Export both as a default and named export for backward compatibility
module.exports = UltraLink;
module.exports.UltraLink = UltraLink; 