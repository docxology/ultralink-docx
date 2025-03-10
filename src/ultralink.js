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
const RxInferExporter = require('./lib/exporters/rxinfer');

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
   * Generate visualizations of the knowledge graph
   * @param {Object} options - Visualization options
   * @param {string} options.format - Visualization format ('svg', 'png', 'd3', 'cytoscape')
   * @param {string} options.layout - Graph layout ('force', 'radial', 'grid', 'cluster')
   * @param {Object} options.style - Visualization style options
   * @param {number} options.width - Width of the visualization in pixels
   * @param {number} options.height - Height of the visualization in pixels
   * @param {boolean} options.useSystemTemplate - Whether to use system-specific templated visualizations 
   * @param {string} options.systemName - Name of the system for system-specific visualizations
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
    const defaultOptions = {
      includeDate: true,
      includeLinks: true,
      includeLegend: true, 
      includeAnimations: true,
      includeTitle: true,
      systemName: this.systemName // Ensure we use the system name
    };
    const opts = { ...defaultOptions, ...options };
    
    // Make sure the system name is properly set
    const systemName = opts.systemName || this.systemName || 'UltraLink';

    // Function to safely stringify empty/null/undefined values to empty arrays
    const safeJsonStringify = (obj) => {
      if (!obj || Object.keys(obj).length === 0) {
        return "[]";
      }
      return JSON.stringify(Object.values(obj));
    };

    // Add sample data if we don't have entities
    let sampleAdded = false;
    let sampleEntities = {};
    let sampleRelationships = {};
    
    if (!this.store) {
      this.store = { entities: {}, relationships: {} };
    }
    
    if (Object.keys(this.store.entities || {}).length === 0) {
      sampleAdded = true;
      
      if (systemName === "USAHistory") {
        sampleEntities = {
          "event1": { id: "event1", type: "Event", name: "American Revolution", attributes: { year: 1776 } },
          "event2": { id: "event2", type: "Event", name: "Civil War", attributes: { year: 1861 } },
          "event3": { id: "event3", type: "Event", name: "World War II", attributes: { year: 1941 } }
        };
        sampleRelationships = {
          "rel1": { id: "rel1", source: "event1", target: "event2", type: "PRECEDES" },
          "rel2": { id: "rel2", source: "event2", target: "event3", type: "PRECEDES" }
        };
      } else if (systemName === "Car") {
        sampleEntities = {
          "sys1": { id: "sys1", type: "System", name: "Engine System" },
          "comp1": { id: "comp1", type: "Component", name: "Engine Block" },
          "comp2": { id: "comp2", type: "Component", name: "Transmission" }
        };
        sampleRelationships = {
          "rel1": { id: "rel1", source: "sys1", target: "comp1", type: "CONTAINS" },
          "rel2": { id: "rel2", source: "comp1", target: "comp2", type: "CONNECTS" }
        };
      } else if (systemName === "POMDP") {
        sampleEntities = {
          "state1": { id: "state1", type: "State", name: "Hidden State" },
          "obs1": { id: "obs1", type: "Observation", name: "Sensor Reading" },
          "action1": { id: "action1", type: "Action", name: "Control Signal" }
        };
        sampleRelationships = {
          "rel1": { id: "rel1", source: "state1", target: "obs1", type: "GENERATES" },
          "rel2": { id: "rel2", source: "action1", target: "state1", type: "AFFECTS" }
        };
      }
      
      // Use the sample data for the Manim generation
      this.store.entities = sampleEntities;
      this.store.relationships = sampleRelationships;
    }

    const code = `#!/usr/bin/env python
from manim import *

class UltraLinkGraph(Scene):
    def construct(self):
        # Theme setup
        config.background_color = "BLACK"
        
        # Title
        title = Text("${systemName} Knowledge Graph", color="WHITE")
        subtitle = Text("System Visualization", font_size=36, color="WHITE")
        title_group = VGroup(title, subtitle).arrange(DOWN)
        
        self.play(
            Write(title),
            FadeIn(subtitle, shift=DOWN)
        )
        self.wait(1)
        
        # Move title to top
        self.play(
            title_group.animate.scale(0.6).to_edge(UP)
        )
        
        # Create legend
        legend_items = VGroup()
        legend_title = Text("Entity Types", font_size=24, color="WHITE")
        legend_items.add(legend_title)

        # Position legend
        legend_items.arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        legend_items.to_edge(LEFT)
        self.play(Write(legend_items))
        
        # Create entity groups
        entity_groups = VGroup()
        
        # Add entities based on type
        entities = {}
        for entity in ${safeJsonStringify(this.store.entities)}: 
            color = BLUE
            if entity["type"] == "Event":
                color = YELLOW
            elif entity["type"] == "System":
                color = RED
            elif entity["type"] == "Component":
                color = GREEN
            elif entity["type"] == "Space":
                color = PURPLE
                
            dot = Dot(color=color)
            label = Text(entity["name"], font_size=20).next_to(dot, RIGHT)
            entity_group = VGroup(dot, label)
            entities[entity["id"]] = entity_group
            entity_groups.add(entity_group)
        
        # Position all entity groups
        if len(entity_groups) > 0:
            entity_groups.arrange(RIGHT, buff=2)
            entity_groups.move_to(ORIGIN)
            
            # Animate entities appearance
            for entity_group in entity_groups:
                self.play(
                    *[Create(mob) for mob in entity_group],
                    run_time=0.5
                )

        # Add relationships
        relationships = VGroup()
        for rel in ${safeJsonStringify(this.store.relationships)}: 
            if rel["source"] in entities and rel["target"] in entities:
                start = entities[rel["source"]].get_center()
                end = entities[rel["target"]].get_center()
                arrow = Arrow(start, end, color="WHITE")
                label = Text(rel["type"], font_size=16).next_to(arrow, UP)
                relationships.add(VGroup(arrow, label))

        # Animate relationships
        if len(relationships) > 0:
            for relationship in relationships:
                self.play(
                    Create(relationship[0]),  # Arrow
                    Write(relationship[1]),   # Label
                    run_time=0.3
                )

        # System-specific animations
        if "${systemName}" == "USAHistory":
            # Timeline-based animation
            timeline = NumberLine(
                x_range=[1700, 2024, 50],
                length=10,
                include_numbers=True,
                label_direction=UP,
                color="WHITE"
            ).to_edge(DOWN)
            self.play(Create(timeline))
            
            # Add year markers for events
            event_years = VGroup()
            for entity in ${safeJsonStringify(this.store.entities)}: 
                if entity.get("attributes", {}).get("year"):
                    year_dot = Dot(point=timeline.n2p(entity["attributes"]["year"]), color=YELLOW)
                    year_label = Text(str(entity["attributes"]["year"]), font_size=16).next_to(year_dot, UP)
                    event_years.add(VGroup(year_dot, year_label))
            if len(event_years) > 0:
                self.play(Create(event_years))
            
        elif "${systemName}" == "POMDP":
            # State transition diagram
            belief_update = VGroup()
            
            # Create state transition cycle
            state_cycle = Circle(radius=2, color=BLUE)
            state_label = Text("State Transition", font_size=20).move_to(state_cycle)
            
            # Create observation emission
            obs_arrow = Arrow(state_cycle.get_top(), UP * 2, color=GREEN)
            obs_label = Text("Observation", font_size=20).next_to(obs_arrow, RIGHT)
            
            # Create action influence
            action_arrow = Arrow(DOWN * 2, state_cycle.get_bottom(), color=RED)
            action_label = Text("Action", font_size=20).next_to(action_arrow, LEFT)
            
            belief_update.add(state_cycle, state_label, obs_arrow, obs_label, action_arrow, action_label)
            
            self.play(
                Create(state_cycle),
                Write(state_label),
                Create(obs_arrow),
                Write(obs_label),
                Create(action_arrow),
                Write(action_label)
            )
            
        elif "${systemName}" == "Car":
            # Component hierarchy animation
            hierarchy = VGroup()
            
            # Create system levels
            levels = ["System", "Subsystem", "Component"]
            level_boxes = []
            
            for i, level in enumerate(levels):
                box = Rectangle(height=1, width=3, color=BLUE)
                text = Text(level, font_size=20)
                group = VGroup(box, text)
                group.shift(DOWN * (i * 1.5))
                hierarchy.add(group)
                level_boxes.append(box)
            
            # Add connecting lines
            for i in range(len(level_boxes) - 1):
                line = Line(
                    level_boxes[i].get_bottom(),
                    level_boxes[i + 1].get_top(),
                    color="WHITE"
                )
                hierarchy.add(line)
            
            self.play(Create(hierarchy))
            
        # Final layout adjustments
        if len(entity_groups) > 0 or len(relationships) > 0:
            self.play(
                *[group.animate.scale(0.8) for group in [*entity_groups, relationships] if len(group) > 0]
            )
        
        # Conclusion
        if True:
            conclusion_text = Text(
                f"${systemName} Knowledge Graph Visualization",
                color="WHITE"
            )
            self.play(
                *[FadeOut(mob) for mob in self.mobjects if mob != title_group],
                run_time=1
            )
            self.play(Write(conclusion_text))
            self.wait(1)
            self.play(
                FadeOut(conclusion_text),
                FadeOut(title_group)
            )
        else:
            self.wait(2)
            self.play(
                *[FadeOut(mob) for mob in self.mobjects]
            )
`;

    // Cleanup if we only added sample data
    if (sampleAdded) {
      this.store.entities = {};
      this.store.relationships = {};
    }
    
    return code;
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