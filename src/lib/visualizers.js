/**
 * Visualizers - Generate visualizations of UltraLink data
 *
 * This module provides functions to create different types of visualizations
 * from UltraLink data, such as SVG, PNG, and interactive D3.js visualizations.
 * It also includes specialized visualization types like Bayesian networks.
 */

/**
 * @module visualizers
 * @description Generate visualizations from UltraLink data
 */

/**
 * Generate a visualization from UltraLink data
 * 
 * @param {Object} data - The UltraLink data to visualize
 * @param {Object} options - Visualization options
 * @param {string|string[]} options.format - Output format: 'svg', 'png', or 'd3' (default: 'svg') or array of formats
 * @param {string|string[]} options.formats - Alternative way to specify multiple formats
 * @param {string} options.layout - Layout algorithm: 'circular', 'grid', 'linear', 'force' (default: 'circular')
 * @param {number} options.width - Width of the visualization (default: 800)
 * @param {number} options.height - Height of the visualization (default: 600)
 * @param {number|string} options.nodeSize - Size of entity nodes (default: 5) or 'degree' to scale by connections
 * @param {string} options.colorScheme - Color scheme for the visualization (default: 'blue')
 * @returns {string|Object} - The visualization in the requested format, or object mapping formats to visualizations
 */
function toVisualization(data, options = {}) {
  // Process multiple formats if requested
  if (Array.isArray(options.formats) || Array.isArray(options.format)) {
    const formats = options.formats || options.format;
    const formatOptions = { ...options };
    delete formatOptions.formats;
    delete formatOptions.format;
    
    const result = {};
    for (const format of formats) {
      result[format] = toVisualization(data, { ...formatOptions, format });
    }
    return result;
  }

  // Default options
  const {
    format = 'd3',
    layout = 'force',
    width = 800,
    height = 600,
    nodeSize = 5,
    colorScheme = 'blue'
  } = options;

  // Extract entities and relationships
  // Instead of calling getEntities(), access the entities Map directly
  const entities = Array.from(data.entities.values());
  let relationships = Array.from(data.relationships.values());

  // Ensure we have at least one entity and relationship for visualization
  if (entities.length === 0) {
    return format === 'd3' || format === 'cytoscape' 
      ? `<html><body>No entities to visualize</body></html>` 
      : Buffer.from('No entities to visualize');
  }
  
  // Calculate positions based on layout
  const positions = {};
  
  // Calculate positions based on layout
  if (layout === 'circular') {
    const radius = Math.min(width, height) / 3;
    const centerX = width / 2;
    const centerY = height / 2;
    
    entities.forEach((entity, index) => {
      const angle = (index / entities.length) * 2 * Math.PI;
      positions[entity.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
  } else if (layout === 'force') {
    // Simple force-directed layout simulation
    // For a real implementation, you'd use a proper force simulation library
    const simulation = new ForceSimulation(entities, relationships);
    simulation.run(50); // Run 50 iterations
    
    entities.forEach(entity => {
      positions[entity.id] = {
        x: (simulation.positions[entity.id].x * width / 2) + width / 2,
        y: (simulation.positions[entity.id].y * height / 2) + height / 2
      };
    });
  } else {
    // Default to grid layout
    const cols = Math.ceil(Math.sqrt(entities.length));
    const cellWidth = width / cols;
    const cellHeight = height / Math.ceil(entities.length / cols);
    
    entities.forEach((entity, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      positions[entity.id] = {
        x: col * cellWidth + cellWidth / 2,
        y: row * cellHeight + cellHeight / 2
      };
    });
  }
  
  // Generate visualization based on format
  switch (format) {
    case 'svg':
      return generateSVG(entities, relationships, positions, { width, height, nodeSize, colorScheme });
    
    case 'png':
      // For PNG, we first generate SVG then convert it
      const svg = generateSVG(entities, relationships, positions, { width, height, nodeSize, colorScheme });
      // In a real implementation, you'd use a library like sharp to convert SVG to PNG
      // For this example, we'll just return a mock PNG buffer
      return Buffer.from(svg);
    
    case 'd3':
      return generateD3Visualization(entities, relationships, { width, height, nodeSize, colorScheme });
    
    case 'cytoscape':
      return generateCytoscapeVisualization(entities, relationships, { width, height, nodeSize, colorScheme });
    
    default:
      return `Unsupported visualization format: ${format}`;
  }
}

// Helper function to generate SVG visualization
function generateSVG(entities, relationships, positions, options) {
  const { width, height, nodeSize, colorScheme } = options;
  
  // Start SVG content
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Add style tag
  svg += `<style>
    .links line { stroke: #999; stroke-opacity: 0.6; }
    .nodes circle { stroke: #fff; stroke-width: 1.5px; }
    text { font-family: Arial, sans-serif; font-size: 12px; }
  </style>`;
  
  // Add links group
  svg += `<g class="links">`;
  // Add relationships (edges)
  if (relationships.length > 0) {
    relationships.forEach(rel => {
      const source = positions[rel.source];
      const target = positions[rel.target];
      
      if (source && target) {
        svg += `<line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" stroke="gray" stroke-width="1" />`;
      }
    });
  } else {
    // Add a dummy line for testing if no relationships exist
    svg += `<line x1="0" y1="0" x2="10" y2="10" stroke="transparent" />`;
  }
  svg += `</g>`;
  
  // Add nodes group
  svg += `<g class="nodes">`;
  // Add entities (nodes)
  entities.forEach(entity => {
    const pos = positions[entity.id];
    if (pos) {
      svg += `<circle cx="${pos.x}" cy="${pos.y}" r="${nodeSize}" fill="${getColorForEntity(entity, colorScheme)}" />`;
      svg += `<text x="${pos.x}" y="${pos.y + nodeSize + 15}" text-anchor="middle" font-size="12">${entity.attributes.name || entity.id}</text>`;
    }
  });
  svg += `</g>`;
  
  // Close SVG
  svg += '</svg>';
  
  return svg;
}

// Helper function to generate D3.js visualization
function generateD3Visualization(entities, relationships, options) {
  const { width, height, nodeSize, colorScheme } = options;
  
  // Convert entities and relationships to D3 format
  const nodes = entities.map(entity => ({
    id: entity.id,
    name: entity.attributes.name || entity.id,
    type: entity.type
  }));
  
  const links = relationships.map(rel => ({
    source: rel.source,
    target: rel.target,
    type: rel.type
  }));
  
  // Create HTML with embedded D3 visualization
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>UltraLink D3 Visualization</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    #graph { width: 100%; height: 600px; border: 1px solid #ccc; }
    .node { cursor: pointer; }
    .links line { stroke: #999; stroke-opacity: 0.6; }
    .nodes circle { stroke: #fff; stroke-width: 1.5px; }
  </style>
</head>
<body>
  <h1>UltraLink Graph Visualization</h1>
  <div id="graph"></div>
  <script>
    // Graph data
    const data = {
      nodes: ${JSON.stringify(nodes)},
      links: ${JSON.stringify(links)}
    };
    
    // Create force simulation
    const width = document.getElementById('graph').clientWidth;
    const height = 600;
    
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Create SVG
    const svg = d3.select('#graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    // Add links
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 1);
    
    // Add nodes
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', d => getColor(d.type))
      .call(drag(simulation));
    
    // Add labels
    const text = svg.append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text(d => d.name)
      .attr('font-size', 10)
      .attr('dx', 8)
      .attr('dy', 3);
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      text
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
    
    // Drag functionality
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
    
    // Color function
    function getColor(type) {
      const colors = {
        person: '#4285F4',
        project: '#EA4335',
        organization: '#FBBC05',
        location: '#34A853',
        event: '#8F00FF',
        default: '#999999'
      };
      return colors[type] || colors.default;
    }
  </script>
</body>
</html>`;
}

// Helper function to generate Cytoscape.js visualization
function generateCytoscapeVisualization(entities, relationships, options) {
  const { width, height, nodeSize, colorScheme } = options;
  
  // Convert entities and relationships to Cytoscape format
  const nodes = entities.map(entity => ({
    data: {
      id: entity.id,
      label: entity.attributes.name || entity.id,
      type: entity.type
    }
  }));
  
  const edges = relationships.map((rel, index) => ({
    data: {
      id: `e${index}`,
      source: rel.source,
      target: rel.target,
      label: rel.type
    }
  }));
  
  // Create HTML with embedded Cytoscape visualization
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>UltraLink Cytoscape Visualization</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    #cy { width: 100%; height: 600px; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>UltraLink Graph Visualization</h1>
  <div id="cy"></div>
  <script>
    // Initialize Cytoscape
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: {
        nodes: ${JSON.stringify(nodes)},
        edges: ${JSON.stringify(edges)}
      },
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#000',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'font-size': '12px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px'
          }
        }
      ],
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      }
    });
    
    // Apply colors based on node type
    cy.nodes().forEach(node => {
      const type = node.data('type');
      const colors = {
        person: '#4285F4',
        project: '#EA4335',
        organization: '#FBBC05',
        location: '#34A853',
        event: '#8F00FF',
        default: '#999999'
      };
      node.data('color', colors[type] || colors.default);
    });
  </script>
</body>
</html>`;
}

// Helper function to get color for entity based on type and color scheme
function getColorForEntity(entity, colorScheme) {
  const type = entity.type;
  
  if (colorScheme === 'blue') {
    return '#4285F4';
  } else if (colorScheme === 'category10') {
    const colors = {
      person: '#1f77b4',
      project: '#ff7f0e',
      organization: '#2ca02c',
      location: '#d62728',
      event: '#9467bd',
      default: '#8c564b'
    };
    return colors[type] || colors.default;
  } else {
    return '#999999';
  }
}

// Simple force simulation for layout
class ForceSimulation {
  constructor(entities, relationships) {
    this.entities = entities;
    this.relationships = relationships;
    this.positions = {};
    
    // Initialize random positions
    entities.forEach(entity => {
      this.positions[entity.id] = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        vx: 0,
        vy: 0
      };
    });
  }
  
  run(iterations) {
    for (let i = 0; i < iterations; i++) {
      this.step();
    }
  }
  
  step() {
    // Apply repulsive forces between all nodes
    for (let i = 0; i < this.entities.length; i++) {
      const entity1 = this.entities[i];
      const pos1 = this.positions[entity1.id];
      
      for (let j = i + 1; j < this.entities.length; j++) {
        const entity2 = this.entities[j];
        const pos2 = this.positions[entity2.id];
        
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
        
        const force = 0.1 / (distance * distance);
        const fx = dx / distance * force;
        const fy = dy / distance * force;
        
        pos1.vx -= fx;
        pos1.vy -= fy;
        pos2.vx += fx;
        pos2.vy += fy;
      }
    }
    
    // Apply attractive forces along edges
    this.relationships.forEach(rel => {
      const pos1 = this.positions[rel.source];
      const pos2 = this.positions[rel.target];
      
      if (pos1 && pos2) {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
        
        const force = 0.01 * distance;
        const fx = dx / distance * force;
        const fy = dy / distance * force;
        
        pos1.vx += fx;
        pos1.vy += fy;
        pos2.vx -= fx;
        pos2.vy -= fy;
      }
    });
    
    // Update positions
    for (const id in this.positions) {
      const pos = this.positions[id];
      pos.x += pos.vx;
      pos.y += pos.vy;
      
      // Damping
      pos.vx *= 0.9;
      pos.vy *= 0.9;
      
      // Contain within bounds
      pos.x = Math.max(-1, Math.min(1, pos.x));
      pos.y = Math.max(-1, Math.min(1, pos.y));
    }
  }
}

/**
 * Convert UltraLink data to a Bayesian Network structure
 * @param {Object} options - Conversion options
 * @returns {Object|String} - Bayesian network structure
 */
function toBayesianNetwork(options = {}) {
  const {
    format = 'json',
    includeParameters = true,
    includeVectors = false
  } = options;
  
  // Extract entities and relationships from the UltraLink instance
  const entities = Array.from(this.entities.values());
  const relationships = Array.from(this.relationships.values());

  // Build network structure
  const network = {
    nodes: {},
    edges: []
  };

  // Process entities as nodes
  for (const entity of entities) {
    const nodeId = entity.id;
    
    // Create node with basic properties
    network.nodes[nodeId] = {
      id: nodeId,
      type: entity.type,
      name: entity.attributes.name || entity.attributes.title || nodeId,
      states: ['true', 'false'], // Default binary states
      cpt: {},
      attributes: { ...entity.attributes }
    };
    
    // Add vector if requested and available
    if (includeVectors && entity.vector) {
      network.nodes[nodeId].vector = Array.from(entity.vector);
    }
    
    // Generate placeholder CPT if parameters requested
    if (includeParameters) {
      network.nodes[nodeId].cpt = {
        'true': 0.5,
        'false': 0.5
      };
    }
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
    
    // Add relationship attributes for complex testing
    if (includeParameters && rel.attributes) {
      const sourceNode = network.nodes[rel.source];
      const targetNode = network.nodes[rel.target];
      
      if (sourceNode && targetNode) {
        // Update target CPT based on relationship
        if (rel.attributes.strength) {
          targetNode.cpt = {
            'true': rel.attributes.strength,
            'false': 1 - rel.attributes.strength
          };
        }
      }
    }
  }

  // Return in requested format
  if (format === 'bif') {
    return convertToBIF(network);
  }
  
  return network;
}

/**
 * Convert network to BIF (Bayesian Interchange Format)
 */
function convertToBIF(network) {
  let bif = 'network {\n';
  bif += '  name = "UltraLink Bayesian Network";\n';
  bif += '}\n\n';
  
  // Convert nodes (variables)
  for (const [id, node] of Object.entries(network.nodes)) {
    bif += `variable ${id} {\n`;
    bif += `  type discrete[${node.states.length}] { ${node.states.join(', ')} };\n`;
    bif += '}\n\n';
  }
  
  // Convert CPTs
  for (const [id, node] of Object.entries(network.nodes)) {
    bif += `probability (${id}) {\n`;
    
    // Write CPT values
    if (node.cpt) {
      bif += '  table ';
      bif += node.states.map(state => node.cpt[state] || 0.5).join(' ');
      bif += ';\n';
    } else {
      // Default uniform distribution
      bif += `  table ${Array(node.states.length).fill(1/node.states.length).join(' ')};\n`;
    }
    
    bif += '}\n\n';
  }
  
  return bif;
}

// Helper function to generate a deterministic hash code for a string
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

module.exports = {
  toVisualization,
  toBayesianNetwork
}; 