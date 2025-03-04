/**
 * UltraLink Parser
 * 
 * This module provides functionality to parse text content and extract links and entities.
 */

const { Link, Entity, EntityStore } = require('./types');

/**
 * Extract Obsidian-style links from text content
 * @param {string} content - Text content to parse
 * @returns {Array} - Array of extracted links
 */
function extractObsidianLinks(content) {
  const regex = /\[\[([^\]]+)\]\]/g;
  const matches = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  
  return matches;
}

/**
 * Extract custom format links using a provided regex pattern
 * @param {string} content - Text content to parse
 * @param {RegExp} regex - Regular expression to use for extraction
 * @param {Function} mapFn - Function to map regex matches to link data
 * @returns {Array} - Array of extracted links
 */
function extractCustomLinks(content, regex, mapFn) {
  const matches = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    matches.push(mapFn(match));
  }
  
  return matches;
}

/**
 * Main parser class for UltraLink content
 */
class UltraLinkParser {
  constructor(store = null) {
    this.store = store || new EntityStore();
    this.customParsers = [];
  }
  
  /**
   * Add a custom parser for a specific link format
   * @param {RegExp} regex - Regular expression for matching
   * @param {Function} handler - Function to process matches
   */
  addCustomParser(regex, handler) {
    this.customParsers.push({ regex, handler });
  }
  
  /**
   * Parse content and extract entities and links
   * @param {string} content - Text content to parse
   * @param {string} sourceId - ID of the source document/entity
   * @returns {Object} - Extracted entities and links
   */
  parse(content, sourceId) {
    // Extract basic Obsidian links
    const obsidianLinks = extractObsidianLinks(content);
    
    // Create source entity if it doesn't exist
    if (sourceId && !this.store.getEntity(sourceId)) {
      this.store.createEntity(sourceId, 'document', { content });
    }
    
    // Process Obsidian links
    obsidianLinks.forEach(targetId => {
      // Create target entity if it doesn't exist
      if (!this.store.getEntity(targetId)) {
        this.store.createEntity(targetId, 'reference');
      }
      
      // Create link from source to target
      if (sourceId) {
        this.store.createLink(sourceId, targetId);
      }
    });
    
    // Process custom parsers
    this.customParsers.forEach(({ regex, handler }) => {
      const links = extractCustomLinks(content, regex, handler);
      links.forEach(link => {
        if (!this.store.getEntity(link.target)) {
          this.store.createEntity(link.target, 'reference');
        }
        
        if (sourceId) {
          this.store.createLink(sourceId, link.target, link.type, link.metadata);
        }
      });
    });
    
    return {
      links: obsidianLinks.map(target => ({ source: sourceId, target })),
      store: this.store
    };
  }
}

module.exports = {
  extractObsidianLinks,
  extractCustomLinks,
  UltraLinkParser
}; 