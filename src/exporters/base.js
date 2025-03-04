/**
 * UltraLink Base Exporter
 * 
 * This module defines the base exporter interface for converting entity stores
 * to various output formats.
 */

/**
 * Abstract base exporter class
 */
class Exporter {
  constructor(store) {
    this.store = store;
  }
  
  /**
   * Export the entire entity store
   * @returns {*} - Format-specific output
   */
  exportAll() {
    throw new Error('exportAll method must be implemented by subclasses');
  }
  
  /**
   * Export a single entity
   * @param {string} entityId - ID of the entity to export
   * @returns {*} - Format-specific output
   */
  exportEntity(entityId) {
    throw new Error('exportEntity method must be implemented by subclasses');
  }
  
  /**
   * Export a specific relationship type
   * @param {string} type - Relationship type to export
   * @returns {*} - Format-specific output
   */
  exportRelationshipType(type) {
    throw new Error('exportRelationshipType method must be implemented by subclasses');
  }
}

const fs = require('fs');
const path = require('path');

/**
 * Base class for specialized exporters
 */
class SpecializedExporter {
  /**
   * @param {Object} store - The UltraLink entity store
   * @param {Object} options - Configuration options
   */
  constructor(store, options = {}) {
    this.store = store;
    this.options = {
      outputPath: './output',
      entityFilter: null,
      ...options
    };
  }

  /**
   * Export an entity
   * @param {Object} entity - The entity to export
   * @returns {string} Exported content
   */
  exportEntity(entity) {
    throw new Error('exportEntity() must be implemented by subclass');
  }

  /**
   * Export all entities
   * @returns {Object} Map of filenames to content
   */
  exportAll() {
    const output = {};
    const entities = this.filterEntities();
    for (const entity of entities) {
      const filename = this.getFilename(entity);
      output[filename] = this.exportEntity(entity);
    }
    return output;
  }

  /**
   * Get filename for an entity
   * @param {Object} entity - The entity
   * @returns {string} Filename
   */
  getFilename(entity) {
    return `${entity.id}.md`;
  }

  /**
   * Format a value for output
   * @param {any} value - The value to format
   * @returns {string} Formatted value
   */
  formatValue(value) {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  }

  /**
   * Filter entities based on options
   * @returns {Array} Filtered entities
   */
  filterEntities() {
    const entities = Array.from(this.store.entities.values());
    if (typeof this.options.entityFilter === 'function') {
      return entities.filter(this.options.entityFilter);
    }
    return entities;
  }

  /**
   * Generate metadata for an entity
   * @param {Object} entity - The entity
   * @returns {Object} Metadata object
   */
  generateMetadata(entity) {
    return {
      id: entity.id,
      type: entity.type,
      created: new Date().toISOString(),
      version: '1.0',
      generator: 'UltraLink',
      ...entity.metadata
    };
  }

  /**
   * Write output to a file
   * @param {string} content - Content to write
   * @param {string} filename - Filename to write to
   */
  writeOutput(content, filename) {
    const outputPath = path.join(this.options.outputPath, filename);
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, content);
  }
}

module.exports = {
  Exporter,
  SpecializedExporter
}; 