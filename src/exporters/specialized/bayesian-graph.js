/**
 * Bayesian Graph Exporter
 * 
 * Specialized exporter for representing UltraLink entities as Bayesian Network nodes
 * where nodes represent random variables and edges represent probabilistic dependencies.
 * The exporter can output in multiple formats including JSON for visualization libraries,
 * and specialized Bayesian Network formats like BIF (Bayesian Interchange Format).
 */

const { SpecializedExporter } = require('../base');

/**
 * Specialized exporter for Bayesian Networks
 */
class BayesianGraphExporter extends SpecializedExporter {
  /**
   * @param {Object} store - The UltraLink entity store
   * @param {Object} options - Configuration options
   * @param {String} options.outputFormat - Format to output ('json', 'bif', 'pgmx')
   * @param {Boolean} options.includeParameters - Whether to include CPT parameters
   * @param {Boolean} options.autoGenerateProbabilities - Generate placeholder probabilities if missing
   * @param {String} options.nodeTypeMapping - Entity type to use as nodes (default: all types)
   * @param {Array} options.edgeTypeMapping - Link types to use as edges
   */
  constructor(store, options = {}) {
    super(store, options);
    this.probabilityThreshold = options.probabilityThreshold ?? 0.5;
    this.includeWeights = options.includeWeights ?? true;
  }
  
  /**
   * Export an entity to Bayesian network format
   * @param {Object} entity - The entity to export
   * @returns {Object} Bayesian network node representation
   */
  exportEntity(entity) {
    const node = {
      id: entity.id,
      type: entity.type,
      states: this.extractStates(entity),
      cpt: this.calculateCPT(entity),
      parents: this.getParentNodes(entity),
      children: this.getChildNodes(entity)
    };

    if (this.includeWeights) {
      node.weights = this.calculateWeights(entity);
    }

    return node;
  }
  
  /**
   * Extract possible states from entity attributes
   * @param {Object} entity - The entity to analyze
   * @returns {Array} Possible states
   */
  extractStates(entity) {
    if (entity.attributes.states) {
      return entity.attributes.states;
    }
    
    // Default binary states if none specified
    return ['true', 'false'];
  }
  
  /**
   * Calculate Conditional Probability Table
   * @param {Object} entity - The entity to analyze
   * @returns {Object} CPT for the node
   */
  calculateCPT(entity) {
    const cpt = {};
    const parents = this.getParentNodes(entity);
    const states = this.extractStates(entity);
    
    if (parents.length === 0) {
      // Prior probabilities for root nodes
      states.forEach(state => {
        cpt[state] = entity.attributes[`p_${state}`] || 1 / states.length;
      });
    } else {
      // Conditional probabilities
      const parentStates = parents.map(parent => this.extractStates(parent));
      this.generateCombinations(parentStates).forEach(combination => {
        states.forEach(state => {
          const key = this.getCPTKey(combination, state);
          cpt[key] = entity.attributes[`p_${key}`] || 1 / states.length;
        });
      });
    }
    
    return cpt;
  }
  
  /**
   * Get parent nodes of an entity
   * @param {Object} entity - The entity to analyze
   * @returns {Array} Parent nodes
   */
  getParentNodes(entity) {
    const parents = [];
    for (const [id, otherEntity] of this.store.entities) {
      if (id === entity.id) continue;
      
      const relationships = this.getRelationships(id);
      for (const rel of relationships) {
        if (rel.target === entity.id && rel.type === 'influences') {
          parents.push(otherEntity);
        }
      }
    }
    return parents;
  }
  
  /**
   * Get child nodes of an entity
   * @param {Object} entity - The entity to analyze
   * @returns {Array} Child nodes
   */
  getChildNodes(entity) {
    const children = [];
    const relationships = this.getRelationships(entity.id);
    
    for (const rel of relationships) {
      if (rel.type === 'influences') {
        const child = this.store.entities.get(rel.target);
        if (child) {
          children.push(child);
        }
      }
    }
    
    return children;
  }
  
  /**
   * Get relationships for an entity
   * @param {string} entityId - Entity ID
   * @returns {Array} Relationships
   */
  getRelationships(entityId) {
    const relationships = [];
    for (const [key, rel] of this.store.relationships) {
      if (rel.source === entityId) {
        relationships.push(rel);
      }
    }
    return relationships;
  }
  
  /**
   * Calculate weights for relationships
   * @param {Object} entity - The entity to analyze
   * @returns {Object} Relationship weights
   */
  calculateWeights(entity) {
    const weights = {
      incoming: {},
      outgoing: {}
    };

    // Calculate incoming weights
    const parents = this.getParentNodes(entity);
    parents.forEach(parent => {
      const relationships = this.getRelationships(parent.id);
      for (const rel of relationships) {
        if (rel.target === entity.id && rel.type === 'influences') {
          weights.incoming[parent.id] = rel.attributes?.weight || 1.0;
        }
      }
    });

    // Calculate outgoing weights
    const relationships = this.getRelationships(entity.id);
    for (const rel of relationships) {
      if (rel.type === 'influences') {
        weights.outgoing[rel.target] = rel.attributes?.weight || 1.0;
      }
    }

    return weights;
  }
  
  /**
   * Generate all possible combinations of parent states
   * @param {Array} parentStates - Array of possible states for each parent
   * @returns {Array} All possible combinations
   */
  generateCombinations(parentStates) {
    if (parentStates.length === 0) return [[]];
    
    const result = [];
    const restCombinations = this.generateCombinations(parentStates.slice(1));
    
    parentStates[0].forEach(state => {
      restCombinations.forEach(combination => {
        result.push([state, ...combination]);
      });
    });
    
    return result;
  }
  
  /**
   * Generate a key for the CPT based on parent states and current state
   * @param {Array} parentStates - States of parent nodes
   * @param {string} currentState - Current node state
   * @returns {string} CPT key
   */
  getCPTKey(parentStates, currentState) {
    return `${parentStates.join('_')}_${currentState}`;
  }
  
  /**
   * Export the entire Bayesian network
   * @returns {Object} Complete Bayesian network representation
   */
  exportNetwork() {
    const network = {
      nodes: {},
      edges: []
    };

    // Export nodes
    for (const entity of this.store.entities.values()) {
      network.nodes[entity.id] = this.exportEntity(entity);
    }

    // Export edges
    for (const entity of this.store.entities.values()) {
      const relationships = this.getRelationships(entity.id);
      for (const rel of relationships) {
        // Add all relationships as edges, not just influences
        network.edges.push({
          source: entity.id,
          target: rel.target,
          type: rel.type,
          weight: rel.attributes?.weight || 1.0
        });
      }
    }

    return network;
  }
  
  /**
   * Get information about what this exporter does
   * @returns {Object} - Information about the exporter
   */
  getInfo() {
    return {
      name: 'BayesianGraphExporter',
      description: 'Exports entities as a Bayesian Network representation',
      outputFormats: ['JSON', 'BIF (Bayesian Interchange Format)'],
      supportedOptions: {
        outputFormat: 'Format to output (json, bif)',
        includeParameters: 'Whether to include probability parameters',
        autoGenerateProbabilities: 'Generate placeholder probabilities if missing',
        nodeTypeMapping: 'Entity type to use as nodes',
        edgeTypeMapping: 'Link types to use as edges'
      }
    };
  }
}

module.exports = BayesianGraphExporter; 