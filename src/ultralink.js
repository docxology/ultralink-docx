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
const { toJSON, ARCHIVE_VERSION } = require('./lib/exporters/json');
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
const RxInferExporter = require('./lib/exporters/rxinfer');

function recordValues(records) {
  if (records instanceof Map) return records.values();
  if (records && typeof records[Symbol.iterator] === 'function') return records;
  return records && typeof records === 'object' ? Object.values(records) : [];
}

function parseArchiveText(text) {
  if (typeof JSON.rawJSON !== 'function') return JSON.parse(text);

  // Record only numbers whose original spelling would change on stringify.
  // Do not replace numbers in ordinary imports, graph attributes or summaries.
  let tokens;
  const parsed = JSON.parse(text, function (key, value, context) {
    if (typeof value === 'number' && context?.source && context.source !== String(value)) {
      tokens ??= new WeakMap();
      let fields = tokens.get(this);
      if (!fields) tokens.set(this, fields = new Map());
      fields.set(key, context.source);
    }
    return value;
  });
  const graph = parsed?.json ?? parsed;
  if (tokens && graph?.ultralinkArchiveVersion === ARCHIVE_VERSION) {
    for (const collection of [graph.entities, graph.relationships]) {
      for (const row of recordValues(collection)) {
        if (row && Object.hasOwn(row, 'metadata')) restoreNumericTokens(row, 'metadata', tokens);
      }
    }
  }
  return parsed;
}

function restoreNumericTokens(holder, key, tokens) {
  const token = tokens.get(holder)?.get(key);
  if (token !== undefined) {
    holder[key] = JSON.rawJSON(token);
    return;
  }
  const value = holder[key];
  if (value && typeof value === 'object') {
    for (const child of Object.keys(value)) restoreNumericTokens(value, child, tokens);
  }
}

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
    return RelationshipManager.delegateLink.call(this, sourceId, targetId, type, attributes, options);
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
   * Generate visualizations of the knowledge graph
   * @param {Object} options - Visualization options
   * @param {string} options.format - Visualization format ('svg', 'png', 'd3', 'cytoscape')
   * @param {string} options.layout - Graph layout ('force', 'radial', 'grid', 'cluster')
   * @param {Object} options.style - Visualization style options
   * @param {number} options.width - Width of the visualization in pixels
   * @param {number} options.height - Height of the visualization in pixels
   * @param {boolean} options.useSystemTemplate - Whether to use system-specific templated visualizations 
   * @param {string} options.systemName - Name of the system for system-specific visualizations
   * @param {boolean} options.throwOnError - Surface visualization generation errors instead of returning fallbacks (default: false)
   * @returns {Promise<Object>} Visualization output (format depends on options.format)
   */
  async toVisualization(options = {}) {
    // If system-specific visualization with templated summary is requested,
    // set the system name based on the class name or provided name
    if (options.useSystemTemplate === undefined && options.systemName) {
      // Auto-enable system template if system name is provided
      options.useSystemTemplate = true;
    }
    
    if (options.useSystemTemplate && !options.systemName) {
      // Use the class name as the system name if not provided
      // This allows custom subclasses to automatically use their specific template
      options.systemName = this.constructor.name !== 'UltraLink' ? 
        this.constructor.name : (this.name || 'UltraLink');
    }
    
    return toVisualization(this, options);
  }

  /**
   * Export the knowledge base as a Bayesian network
   * @param {Object} options - Export options
   * @returns {string|Object} The Bayesian network representation
   */
  toBayesianNetwork(options = {}) {
    // Include systemName in options if not already set
    if (!options.systemName && this.config && this.config.systemName) {
      options.systemName = this.config.systemName;
    }
    const exporter = new BayesianNetworkExporter(this);
    return exporter.export(options);
  }

  /**
   * Export data to Manim animation format
   * @param {Object} options - Export options
   * @param {string} options.animationStyle - Animation style ('default', 'explanatory', 'technical', 'narrative')
   * @param {string} options.visualTheme - Visual theme ('3b1b', 'dark', 'light', 'colorful')
   * @param {boolean} options.includeNarrationText - Whether to include narration text
   * @param {boolean} options.highlightCentralEntities - Whether to highlight central entities
   * @param {number} options.animationDuration - Target duration in seconds
   * @param {string} options.outputFormat - Output format ('mp4', 'gif', 'png_sequence')
   * @returns {string} Manim Python code
   */
  toManim(options = {}) {
    const {
      animationStyle = 'default',
      visualTheme = '3b1b',
      includeNarrationText = true,
      highlightCentralEntities = true,
      animationDuration = 30
    } = options;
    const systemName = options.systemName || this.systemName || this.config.systemName || 'UltraLink';
    const themes = {
      '3b1b': ['#000000', '#ffffff'],
      dark: ['#242428', '#ece6e2'],
      light: ['#ffffff', '#202124'],
      colorful: ['#17233a', '#f8edba']
    };
    const [background, foreground] = themes[Object.hasOwn(themes, visualTheme) ? visualTheme : '3b1b'];
    const narration = {
      explanatory: 'Follow the entities and their relationships',
      technical: 'Graph topology and relationships',
      narrative: 'A story told through connected entities'
    };
    const subtitle = Object.hasOwn(narration, animationStyle) ? narration[animationStyle] : 'System Visualization';
    const duration = Number.isFinite(animationDuration) && animationDuration > 0 ? animationDuration : 30;

    const degrees = highlightCentralEntities ? new Map() : null;
    const relationships = Array.from(this.relationships.values(), ({ source, target, type }) => {
      if (degrees) {
        degrees.set(source, (degrees.get(source) || 0) + 1);
        degrees.set(target, (degrees.get(target) || 0) + 1);
      }
      return { source, target, type };
    });
    let centralEntity;
    if (degrees) {
      let highestDegree = 0;
      for (const [id, degree] of degrees) {
        if (degree > highestDegree) {
          centralEntity = id;
          highestDegree = degree;
        }
      }
    }
    const graph = {
      systemName,
      centralEntity,
      entities: Array.from(this.entities.values(), ({ id, type, attributes }) => ({
        id,
        type,
        label: String(attributes.name || attributes.title || id),
        formula: typeof attributes.formula === 'string' ? attributes.formula : undefined,
        year: systemName === 'USAHistory' ? attributes.year ?? attributes.startYear : undefined
      })),
      relationships
    };
    // Quote the JSON as a Python string rather than embedding JSON values as Python literals.
    const graphLiteral = JSON.stringify(JSON.stringify(graph));

    return `#!/usr/bin/env python
import json
from manim import *

config.background_color = ${JSON.stringify(background)}

class UltraLinkGraph(Scene):
    def construct(self):
        graph = json.loads(${graphLiteral})
        system_name = graph["systemName"]
        text_color = ${JSON.stringify(foreground)}
        duration = ${duration}
        beat = duration / 16

        if not graph["entities"]:
            self.play(Write(Text("Empty Knowledge Graph", color=text_color)), run_time=beat)
            self.wait(max(beat, duration - self.time))
            return

        title = Text(f"{system_name} Knowledge Graph", color=text_color)
${includeNarrationText ? `        subtitle = Text(${JSON.stringify(subtitle)}, font_size=28, color=text_color)\n` : ''}        title_group = VGroup(title${includeNarrationText ? ', subtitle' : ''}).arrange(DOWN)
        title_group.scale(min(1, (config.frame_width - 1) / title_group.width))
        self.play(Write(title_group), run_time=beat)
        self.wait(beat)
        self.play(title_group.animate.scale(0.6).to_edge(UP), run_time=beat)

        palette = {"event": YELLOW, "system": RED, "component": GREEN, "space": PURPLE,
                   "plant": GREEN, "animal": BLUE, "abiotic_factor": GOLD}
        entities = {}
        entity_groups = VGroup()
        types = {}
        for entity in graph["entities"]:
            entity_type = entity["type"]
            color = palette.get(entity_type.lower(), BLUE)
            types[entity_type] = color
            dot = Dot(color=color)
            label = Text(entity["label"], font_size=20, color=text_color).next_to(dot, RIGHT)
            group = VGroup(dot, label)
            entities[entity["id"]] = group
            entity_groups.add(group)

        legend = VGroup(Text("Entity Types", font_size=20, color=text_color),
                        *(Text(kind, font_size=14, color=color) for kind, color in types.items()))
        legend.arrange(DOWN, aligned_edge=LEFT, buff=0.15).to_corner(UL).shift(DOWN)
        self.play(Write(legend), run_time=beat)

        entity_groups.arrange_in_grid(cols=min(4, len(entities)), buff=0.8)
        entity_groups.scale(min(1, (config.frame_width - 4) / entity_groups.width,
                                (config.frame_height - 3) / entity_groups.height)).shift(RIGHT)
        self.play(LaggedStart(*(FadeIn(group) for group in entity_groups), lag_ratio=0.12), run_time=2 * beat)

        links = VGroup()
        for relationship in graph["relationships"]:
            source = entities[relationship["source"]][0]
            target = entities[relationship["target"]][0]
            if source is target:
                arrow = CurvedArrow(source.get_top(), source.get_right(), color=text_color)
            else:
                arrow = Arrow(source.get_center(), target.get_center(), color=text_color, buff=0.12)
            label = Text(relationship["type"], font_size=14, color=text_color).next_to(arrow, UP, buff=0.08)
            links.add(VGroup(arrow, label))
        if len(links):
            self.play(LaggedStart(*(AnimationGroup(Create(arrow), Write(label)) for arrow, label in links),
                                  lag_ratio=0.12), run_time=2 * beat)
        self.wait(beat)

${centralEntity === undefined ? '' : '        self.play(Indicate(entities[graph["centralEntity"]]), run_time=beat)\n'}        formulas = VGroup(*(MathTex(entity["formula"], color=text_color)
                            for entity in graph["entities"] if entity.get("formula")))
        if len(formulas):
            formulas.arrange(DOWN).scale(0.7).to_edge(DOWN)
            self.play(Write(formulas), run_time=beat)

        if system_name == "USAHistory":
            dates = [entity["year"] for entity in graph["entities"]
                     if isinstance(entity.get("year"), (int, float))]
            if dates:
                start, end = min(dates) // 50 * 50, (max(dates) // 50 + 1) * 50
                timeline = NumberLine(x_range=[start, end, 50], length=10, include_numbers=True,
                                      color=text_color).to_edge(DOWN)
                markers = VGroup(*(Dot(timeline.n2p(year), color=YELLOW) for year in sorted(set(dates))))
                self.play(Create(timeline), FadeIn(markers), run_time=2 * beat)
        elif system_name == "POMDP":
            cycle = Circle(radius=1.2, color=BLUE)
            label = Text("State Transition", font_size=20, color=text_color).move_to(cycle)
            observation = Arrow(cycle.get_top(), UP * 2, color=GREEN)
            action = Arrow(DOWN * 2, cycle.get_bottom(), color=RED)
            self.play(Create(cycle), Write(label), Create(observation), Create(action), run_time=2 * beat)
        elif system_name == "Car":
            levels = VGroup(*(VGroup(Rectangle(height=1, width=3, color=BLUE),
                                     Text(level, font_size=20, color=text_color))
                              for level in ["System", "Subsystem", "Component"])).arrange(DOWN, buff=0.4)
            connectors = VGroup(*(Line(above.get_bottom(), below.get_top(), color=text_color)
                                  for above, below in zip(levels, levels[1:])))
            self.play(FadeIn(levels), Create(connectors), run_time=2 * beat)

        self.wait(max(beat, duration - self.time - beat))
        self.play(*(FadeOut(mob) for mob in self.mobjects), run_time=beat)
`;
  }

  /**
   * Export UltraLink data to a comprehensive blob containing all formats
   * @param {Object} options - Export options
   * @param {boolean} options.compressed - Whether to return a compressed (JSON string) version
   * @param {boolean} [options.throwOnError=false] - Reject the bundle if an embedded export throws
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
        data = parseArchiveText(blob);
      } 
      // Handle string blobs
      else if (typeof blob === 'string') {
        data = parseArchiveText(blob);
      }
      // Handle the case where blob is a files object with 'full-export.json' key
      else if (blob['full-export.json']) {
        data = parseArchiveText(blob['full-export.json']);
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
    
    // Full Blob wraps the graph in `json`; legacy exports store it at the root.
    if (data?.json) {
      data = data.json;
      if (typeof data === 'string') {
        try {
          data = parseArchiveText(data);
        } catch (error) {
          console.warn('Error parsing JSON data in blob:', error);
          data = null;
        }
      }
    }

    // Export summaries describe the wire payload, not authored graph metadata.
    const { exportDate, entityCount, relationshipCount, ...metadata } = data?.metadata ?? {};
    if (Object.keys(metadata).length > 0) this.metadata = { ...this.metadata, ...metadata };
    if (data?.entities) {
      const archive = Object.hasOwn(data, 'ultralinkArchiveVersion') &&
        data.ultralinkArchiveVersion === ARCHIVE_VERSION ? data : undefined;
      for (const { id, type, attributes, metadata } of recordValues(data.entities)) {
        const entity = this.addEntity(id, type, attributes) ?? this.entities.get(id);
        if (entity) Utils.restoreRowMetadata(entity, metadata, archive !== undefined);
      }
      RelationshipManager.restoreRelationships.call(this, recordValues(data.relationships), archive);
    }
    
    return this;
  }

  /**
   * Delete by the insertion tuple, which remains unchanged after retyping
   * @param {string} sourceId - Source entity ID
   * @param {string} targetId - Target entity ID
   * @param {string} type - Relationship type at insertion
   * @returns {boolean} True if the insertion tuple matched a live edge
   */
  deleteLink(sourceId, targetId, type) {
    const id = `${sourceId}_${type}_${targetId}`;
    const relationship = this.getRelationship(id);
    // Retyping preserves IDs: the insertion tuple still names its original
    // edge, even when another edge now has the requested type.
    if (relationship && relationship.source === sourceId && relationship.target === targetId) {
      return this.deleteRelationship(id);
    }
    return false;
  }

  /**
   * Export UltraLink data to RxInfer.jl model format
   * @param {Object} options - Export options
   * @param {boolean} options.includeComments - Whether to include descriptive comments (default: true)
   * @param {boolean} options.includeVectors - Whether to include vector representations (default: false)
   * @param {string} options.modelName - Name for the generated RxInfer model (default: 'ultralink_model')
   * @param {Object} options.distributionMapping - Mapping from entity types to distributions
   * @param {boolean} options.useConstraints - Whether to include variational constraints (default: false)
   * @param {boolean} options.generateTest - Whether to generate a test script (default: false)
   * @param {boolean} options.prettyPrint - Format output for readability (default: true)
   * @returns {string} RxInfer.jl model code
   */
  toRxInfer(options = {}) {
    const exporter = new RxInferExporter(this);
    return exporter.export(options);
  }
}

// Export both as a default and named export for backward compatibility
module.exports = UltraLink;
module.exports.UltraLink = UltraLink; 