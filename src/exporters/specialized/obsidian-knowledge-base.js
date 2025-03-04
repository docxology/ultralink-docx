/**
 * Obsidian Knowledge Base Exporter
 * 
 * Specialized exporter for generating Obsidian-compatible knowledge bases
 * with enhanced features like cross-referencing, MOCs (Maps of Content),
 * and metadata for PKM (Personal Knowledge Management) workflows.
 */

const { SpecializedExporter } = require('../base');
const { ObsidianExporter } = require('../obsidian');
const path = require('path');

/**
 * Specialized exporter for Obsidian knowledge bases
 */
class ObsidianKnowledgeBaseExporter extends SpecializedExporter {
  /**
   * @param {Object} store - The UltraLink entity store
   * @param {Object} options - Configuration options
   * @param {String} options.outputPath - Directory to output markdown files
   * @param {Boolean} options.createMOCs - Whether to create Maps of Content
   * @param {Boolean} options.includeBacklinks - Whether to add backlinks sections
   * @param {Boolean} options.addFrontmatter - Whether to add YAML frontmatter
   * @param {Array} options.templateMappings - Map entity types to note templates
   */
  constructor(store, options = {}) {
    super(store, options);
    this.frontmatter = options.frontmatter ?? true;
    this.backlinks = options.backlinks ?? true;
    this.tags = options.tags ?? true;
    
    // Use the built-in ObsidianExporter for core functionality
    this.obsidianExporter = new ObsidianExporter(store);
  }
  
  /**
   * Export an entity to Obsidian markdown format
   * @param {Object} entity - The entity to export
   * @returns {string} Markdown content
   */
  exportEntity(entity) {
    let content = '';

    // Add frontmatter if enabled
    if (this.frontmatter) {
      content += '---\n';
      content += `type: ${entity.type}\n`;
      content += `id: ${entity.id}\n`;
      if (entity.attributes.tags) {
        content += `tags: [${entity.attributes.tags.join(', ')}]\n`;
      }
      content += '---\n\n';
    }

    // Add title
    content += `# ${entity.attributes.name || entity.id}\n\n`;

    // Add attributes section
    content += '## Attributes\n\n';
    for (const [key, value] of Object.entries(entity.attributes)) {
      if (key !== 'name' && key !== 'tags') {
        content += `- **${key}**: ${this.formatValue(value)}\n`;
      }
    }
    content += '\n';

    // Add relationships section
    const relationships = this.store.getRelationships(entity.id);
    if (relationships.length > 0) {
      content += '## Relationships\n\n';
      for (const rel of relationships) {
        content += `- **${rel.type}**: [[${rel.target}]]\n`;
        if (Object.keys(rel.attributes).length > 0) {
          content += '  - Attributes:\n';
          for (const [key, value] of Object.entries(rel.attributes)) {
            content += `    - ${key}: ${this.formatValue(value)}\n`;
          }
        }
      }
      content += '\n';
    }

    // Add backlinks section if enabled
    if (this.backlinks) {
      const backlinks = this.store.getBacklinks(entity.id);
      if (backlinks.length > 0) {
        content += '## Backlinks\n\n';
        for (const backlink of backlinks) {
          content += `- [[${backlink.source}]] (${backlink.type})\n`;
        }
        content += '\n';
      }
    }

    return content;
  }
  
  /**
   * Format a value for markdown output
   * @param {any} value - The value to format
   * @returns {string} Formatted value
   */
  formatValue(value) {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }
  
  /**
   * Generate a Map of Content (MOC) for a specific entity type
   * @param {String} entityType - Type of entities to include in MOC
   * @returns {String} - Markdown MOC content
   */
  generateMOC(entityType) {
    const entities = this.filterEntities(entity => entity.type === entityType);
    
    if (entities.length === 0) {
      return '';
    }
    
    let mocContent = `# ${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Map of Content\n\n`;
    mocContent += `This is a Map of Content (MOC) for all ${entityType} entities in the knowledge base.\n\n`;
    
    // Group by categories if available
    const categorized = {};
    const uncategorized = [];
    
    for (const entity of entities) {
      const category = entity.attributes.category;
      
      if (category) {
        if (!categorized[category]) {
          categorized[category] = [];
        }
        categorized[category].push(entity);
      } else {
        uncategorized.push(entity);
      }
    }
    
    // Output categorized entities
    for (const [category, categoryEntities] of Object.entries(categorized)) {
      mocContent += `## ${category}\n\n`;
      
      for (const entity of categoryEntities) {
        const title = entity.attributes.title || entity.attributes.name || entity.id;
        mocContent += `- [[${title}]] - ${entity.attributes.summary || ''}\n`;
      }
      
      mocContent += '\n';
    }
    
    // Output uncategorized entities
    if (uncategorized.length > 0) {
      mocContent += `## Uncategorized\n\n`;
      
      for (const entity of uncategorized) {
        const title = entity.attributes.title || entity.attributes.name || entity.id;
        mocContent += `- [[${title}]] - ${entity.attributes.summary || ''}\n`;
      }
    }
    
    return mocContent;
  }
  
  /**
   * Generate a main index page for the knowledge base
   * @returns {String} - Markdown index content
   */
  generateIndex() {
    // Get all entity types in the store
    const entityTypes = new Set();
    for (const entity of this.store.entities.values()) {
      entityTypes.add(entity.type);
    }
    
    let indexContent = `# Knowledge Base Index\n\n`;
    indexContent += `This is the main index for your UltraLink-powered Obsidian Knowledge Base.\n\n`;
    
    // Add links to MOCs
    indexContent += `## Maps of Content\n\n`;
    
    for (const type of entityTypes) {
      indexContent += `- [[${type}-MOC|${type.charAt(0).toUpperCase() + type.slice(1)} Map of Content]]\n`;
    }
    
    // Add statistics
    indexContent += `\n## Knowledge Base Statistics\n\n`;
    indexContent += `- Total Entities: ${this.store.entities.size}\n`;
    
    // Count by type
    indexContent += `- Entities by Type:\n`;
    const countByType = {};
    for (const entity of this.store.entities.values()) {
      countByType[entity.type] = (countByType[entity.type] || 0) + 1;
    }
    
    for (const [type, count] of Object.entries(countByType)) {
      indexContent += `  - ${type}: ${count}\n`;
    }
    
    // Count relationships
    let totalRelationships = 0;
    for (const entity of this.store.entities.values()) {
      totalRelationships += entity.links.length;
    }
    
    indexContent += `- Total Relationships: ${totalRelationships}\n`;
    indexContent += `- Generated: ${new Date().toISOString()}\n`;
    
    return indexContent;
  }
  
  /**
   * Export all entities and generate knowledge base structure
   * @returns {Object} - Object mapping entity IDs to markdown content
   */
  exportAll() {
    const output = {};
    const entities = this.filterEntities();
    
    // Generate individual notes for each entity
    for (const entity of entities) {
      const title = entity.attributes.title || entity.attributes.name || entity.id;
      const filename = `${title}.md`;
      const content = this.exportEntity(entity);
      
      output[filename] = content;
      
      // Write to file if outputPath is specified
      if (this.options.outputPath) {
        this.writeOutput(content, filename);
      }
    }
    
    // Generate MOCs if enabled
    if (this.options.createMOCs) {
      const entityTypes = new Set();
      for (const entity of entities) {
        entityTypes.add(entity.type);
      }
      
      for (const type of entityTypes) {
        const mocContent = this.generateMOC(type);
        const mocFilename = `${type}-MOC.md`;
        
        output[mocFilename] = mocContent;
        
        // Write to file if outputPath is specified
        if (this.options.outputPath) {
          this.writeOutput(mocContent, mocFilename);
        }
      }
    }
    
    // Generate main index
    const indexContent = this.generateIndex();
    output['index.md'] = indexContent;
    
    // Write index to file if outputPath is specified
    if (this.options.outputPath) {
      this.writeOutput(indexContent, 'index.md');
    }
    
    return output;
  }
  
  /**
   * Get information about what this exporter does
   * @returns {Object} - Information about the exporter
   */
  getInfo() {
    return {
      name: 'ObsidianKnowledgeBaseExporter',
      description: 'Exports entities as an interconnected Obsidian Knowledge Base',
      outputFormats: ['Markdown files with Obsidian-style links'],
      supportedOptions: {
        outputPath: 'Directory to output markdown files',
        createMOCs: 'Whether to create Maps of Content',
        includeBacklinks: 'Whether to add backlinks sections',
        addFrontmatter: 'Whether to add YAML frontmatter'
      }
    };
  }
}

module.exports = ObsidianKnowledgeBaseExporter; 