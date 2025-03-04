/**
 * UltraLink Base Exporter
 * 
 * This module defines the base exporter interface for converting entity stores
 * to various output formats.
 */

const fs = require('fs');
const path = require('path');

/**
 * Base exporter class
 */
class BaseExporter {
  /**
   * @param {Object} store - The UltraLink entity store
   * @param {Object} options - Configuration options
   */
  constructor(store, options = {}) {
    this.store = store;
    this.options = options;
  }
  
  /**
   * Get information about what this exporter does
   * @returns {Object} - Information about the exporter
   */
  getInfo() {
    return {
      name: 'BaseExporter',
      description: 'Base exporter class',
      outputFormats: [],
      supportedOptions: {}
    };
  }
}

/**
 * Specialized exporter base class
 */
class SpecializedExporter extends BaseExporter {
  /**
   * @param {Object} store - The UltraLink entity store
   * @param {Object} options - Configuration options
   */
  constructor(store, options = {}) {
    super(store, options);
    this.options = {
      outputPath: './output',
      entityFilter: null,
      ...options
    };
  }
  
  /**
   * Export an entity
   * @param {Object} entity - The entity to export
   * @returns {Object} Exported entity
   */
  exportEntity(entity) {
    throw new Error('exportEntity must be implemented by subclasses');
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
  
  /**
   * Get information about what this exporter does
   * @returns {Object} - Information about the exporter
   */
  getInfo() {
    return {
      name: 'SpecializedExporter',
      description: 'Base class for specialized exporters',
      outputFormats: [],
      supportedOptions: {}
    };
  }
}

module.exports = {
  BaseExporter,
  SpecializedExporter
}; 