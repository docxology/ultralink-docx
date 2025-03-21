/**
 * UltraLink Parser
 * 
 * This module provides functionality to parse text content and extract links and entities.
 */

const { Link, Entity } = require('./types');
const { EntityStore } = require('../lib/entity-manager');

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
   * @returns {Promise<Object>} - Extracted entities and links
   */
  parse(content, sourceId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Extract basic Obsidian links
        const obsidianLinks = extractObsidianLinks(content);
        
        // Create source entity if it doesn't exist
        if (sourceId && !this.store.getEntity(sourceId)) {
          await this.store.createEntity(sourceId, 'document', { content });
        }
        
        // Process Obsidian links
        for (const targetId of obsidianLinks) {
          // Create target entity if it doesn't exist
          if (!this.store.getEntity(targetId)) {
            await this.store.createEntity(targetId, 'reference');
          }
          
          // Create link from source to target
          if (sourceId) {
            await this.store.createLink(sourceId, targetId);
          }
        }
        
        // Process custom parsers
        for (const { regex, handler } of this.customParsers) {
          const links = extractCustomLinks(content, regex, handler);
          for (const link of links) {
            if (!this.store.getEntity(link.target)) {
              await this.store.createEntity(link.target, 'reference');
            }
            
            if (sourceId) {
              await this.store.createLink(sourceId, link.target, link.type, link.metadata);
            }
          }
        }
        
        resolve({
          links: obsidianLinks.map(target => ({ source: sourceId, target })),
          store: this.store
        });
      } catch (error) {
        // Gracefully handle errors
        console.error("Error parsing content:", error);
        resolve({
          links: [],
          store: this.store
        });
      }
    });
  }
}

module.exports = {
  UltraLinkParser,
  extractObsidianLinks,
  extractCustomLinks
}; 