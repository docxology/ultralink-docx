/**
 * Bayesian Network Exporter for UltraLink
 * 
 * This module exports UltraLink data to Bayesian Network formats, including:
 * - JSON format for Bayesian networks
 * - BIF (Bayesian Interchange Format) for compatibility with Bayesian tools
 * 
 * @param {Object} ultralink - UltraLink instance
 * @param {Object} options - Configuration options for the export
 * @param {string} [options.outputFormat='json'] - Output format ('json' or 'bif')
 * @param {boolean} [options.includeParameters=true] - Whether to include CPT parameters
 * @param {Object} [options.nodeTypeMapping] - Mapping of entity types to Bayesian node types
 * @returns {Object} Object containing Bayesian network files
 */
function toBayesianNetwork(ultralink, options = {}) {
  const {
    outputFormat = 'json',
    includeParameters = true,
    nodeTypeMapping = {}
  } = options;

  // Get entities and relationships from context
  const entities = Array.from(ultralink.entities.values());
  const relationships = [];

  // Process relationships
  for (const relationship of ultralink.relationships.values()) {
    relationships.push({
      source: relationship.source,
      target: relationship.target,
      type: relationship.type,
      attributes: relationship.attributes || {}
    });
  }

  // Create a Bayesian network structure
  const network = {
    nodes: {},
    edges: [],
    metadata: {
      name: "UltraLink Bayesian Network",
      description: "Automatically generated from UltraLink data",
      variables: []
    }
  };

  // Process entities as nodes
  for (const entity of entities) {
    // Determine node type (default to 'discrete' if not specified)
    const bayesianType = nodeTypeMapping[entity.type] || 'discrete';
    
    // Create base node structure
    network.nodes[entity.id] = {
      id: entity.id,
      name: entity.attributes.name || entity.id,
      type: entity.type,
      bayesianType: bayesianType,
      // Default states for discrete variables
      states: ["true", "false"],
      // Default conditional probability table
      cpt: {
        "true": 0.5,
        "false": 0.5
      },
      parents: [],
      attributes: { ...entity.attributes }
    };
    
    // Add to variables list in metadata
    network.metadata.variables.push({
      name: entity.id,
      type: bayesianType,
      states: ["true", "false"] 
    });
  }

  // Process relationships as edges
  for (const rel of relationships) {
    network.edges.push({
      source: rel.source,
      target: rel.target,
      type: rel.type,
      weight: rel.attributes?.weight || 1.0,
      attributes: { ...rel.attributes }
    });
    
    // Add relationship parent info
    if (network.nodes[rel.target]) {
      network.nodes[rel.target].parents.push(rel.source);
    }
    
    // Add relationship attributes for CPT generation
    if (includeParameters && rel.attributes) {
      const sourceNode = network.nodes[rel.source];
      const targetNode = network.nodes[rel.target];
      
      if (sourceNode && targetNode) {
        // Update target CPT based on relationship strength if available
        // This is a simplified approach - in a real implementation, CPTs would be 
        // calculated based on more sophisticated methods
        if (rel.attributes.strength) {
          // If the source is true, the target has this probability of being true
          const strength = parseFloat(rel.attributes.strength);
          
          // Simple CPT update for binary variables
          // In a real system, this would be much more sophisticated
          if (targetNode.parents.length === 1) {
            targetNode.cpt = {
              [`${rel.source}=true`]: {
                "true": strength,
                "false": 1 - strength
              },
              [`${rel.source}=false`]: {
                "true": 0.1, // Default low probability when parent is false
                "false": 0.9  
              }
            };
          }
        }
      }
    }
  }

  // Return the appropriate format
  if (outputFormat === 'bif') {
    const bifContent = convertToBIF(network);
    return { 'network.json': bifContent };
  } else {
    // Return the network object directly
    return network;
  }
}

/**
 * Convert the network structure to BIF (Bayesian Interchange Format)
 * 
 * @param {Object} network - The Bayesian network object
 * @returns {string} The BIF format as a string
 */
function convertToBIF(network) {
  let bif = `<?xml version="1.0"?>\n<BIF VERSION="0.3">\n<NETWORK>\n<NAME>${network.metadata.name}</NAME>\n\n`;
  
  // Add variable definitions
  for (const nodeId in network.nodes) {
    const node = network.nodes[nodeId];
    bif += `<VARIABLE TYPE="${node.bayesianType}">\n`;
    bif += `    <NAME>${escapeXml(nodeId)}</NAME>\n`;
    
    // Add states/outcomes
    for (const state of node.states) {
      bif += `    <OUTCOME>${escapeXml(state)}</OUTCOME>\n`;
    }
    
    bif += `</VARIABLE>\n\n`;
  }
  
  // Add probability definitions
  for (const nodeId in network.nodes) {
    const node = network.nodes[nodeId];
    bif += `<DEFINITION>\n`;
    bif += `    <FOR>${escapeXml(nodeId)}</FOR>\n`;
    
    // Add parent nodes
    for (const parentId of node.parents) {
      bif += `    <GIVEN>${escapeXml(parentId)}</GIVEN>\n`;
    }
    
    // Add probability table
    bif += `    <TABLE>`;
    
    // Simple case: no parents
    if (node.parents.length === 0) {
      // Just output probabilities for each state
      bif += node.states.map(state => node.cpt[state]).join(' ');
    } 
    // With parents - create conditional probability table
    else {
      // This is a simplified approach for binary variables
      // In a real implementation, this would handle arbitrary states and parents
      if (node.parents.length === 1 && node.states.length === 2) {
        const parentId = node.parents[0];
        // Parent true -> child true, Parent true -> child false
        // Parent false -> child true, Parent false -> child false
        bif += [
          node.cpt[`${parentId}=true`].true,
          node.cpt[`${parentId}=true`].false,
          node.cpt[`${parentId}=false`].true,
          node.cpt[`${parentId}=false`].false
        ].join(' ');
      }
    }
    
    bif += `</TABLE>\n`;
    bif += `</DEFINITION>\n\n`;
  }
  
  bif += `</NETWORK>\n</BIF>`;
  return bif;
}

/**
 * Escape special characters for XML
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = { toBayesianNetwork }; 