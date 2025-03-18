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

const SUPPORTED_FORMATS = ['svg', 'png', 'd3', 'cytoscape'];
const SUPPORTED_LAYOUTS = ['circular', 'grid', 'linear', 'force'];
const SUPPORTED_COLOR_SCHEMES = ['blue', 'green', 'red', 'purple', 'orange'];

/**
 * Validate visualization options
 * @private
 * @param {Object} options - Visualization options to validate
 * @throws {Error} If options are invalid
 */
function validateOptions(options) {
  const { format, layout, colorScheme } = options;
  
  if (format && !SUPPORTED_FORMATS.includes(format)) {
    throw new Error(`Unsupported visualization format: ${format}. Supported formats are: ${SUPPORTED_FORMATS.join(', ')}`);
  }
  
  if (layout && !SUPPORTED_LAYOUTS.includes(layout)) {
    throw new Error(`Unsupported layout algorithm: ${layout}. Supported layouts are: ${SUPPORTED_LAYOUTS.join(', ')}`);
  }
  
  if (colorScheme && !SUPPORTED_COLOR_SCHEMES.includes(colorScheme)) {
    throw new Error(`Unsupported color scheme: ${colorScheme}. Supported color schemes are: ${SUPPORTED_COLOR_SCHEMES.join(', ')}`);
  }
}

/**
 * Validate data for visualization
 * @private
 */
function validateData(data) {
  if (!data) {
    throw new Error('No data provided for visualization');
  }
  
  if (!Array.isArray(data.entities)) {
    throw new Error('Entities must be an array');
  }
  
  if (!Array.isArray(data.relationships)) {
    throw new Error('Relationships must be an array');
  }
  
  // Check for duplicate entity IDs
  const entityIds = new Set();
  data.entities.forEach(entity => {
    if (!entity.id) {
      throw new Error('Entity missing ID');
    }
    if (entityIds.has(entity.id)) {
      throw new Error(`Duplicate entity ID: ${entity.id}`);
    }
    entityIds.add(entity.id);
  });
  
  // Validate relationships and filter out invalid ones
  const validatedRelationships = [];
  data.relationships.forEach((rel, index) => {
    if (!rel.source) {
      console.warn(`Relationship at index ${index} missing source`);
      return;
    }
    if (!rel.target) {
      console.warn(`Relationship at index ${index} missing target`);
      return;
    }
    
    const sourceExists = data.entities.some(e => e.id === rel.source);
    const targetExists = data.entities.some(e => e.id === rel.target);
    
    if (!sourceExists) {
      console.warn(`Relationship source '${rel.source}' does not exist in entities`);
      return;
    }
    if (!targetExists) {
      console.warn(`Relationship target '${rel.target}' does not exist in entities`);
      return;
    }
    
    // Only include valid relationships
    validatedRelationships.push(rel);
  });
  
  // Replace relationships with validated ones
  data.relationships = validatedRelationships;
  
  return data;
}

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
 * @throws {Error} If options are invalid or visualization generation fails
 */
function toVisualization(data, options = {}) {
  try {
    // Validate options
    validateOptions(options);
    
    // Process and validate data
    const processedData = {
      entities: Array.isArray(data.entities) ? data.entities : [],
      relationships: Array.isArray(data.relationships) ? data.relationships : []
    };
    
    try {
      validateData(processedData);
    } catch (error) {
      console.error('Data validation warning:', error);
      // We'll continue with a warning instead of failing completely
    }

  // Process multiple formats if requested
  if (Array.isArray(options.formats) || Array.isArray(options.format)) {
    const formats = options.formats || options.format;
    const formatOptions = { ...options };
    delete formatOptions.formats;
    delete formatOptions.format;
    
    const result = {};
    for (const format of formats) {
        try {
          result[format] = toVisualization({ ...processedData }, { ...formatOptions, format });
        } catch (error) {
          console.error(`Failed to generate ${format} visualization:`, error);
          result[format] = generateFallbackForFormat(format, error.message);
        }
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

    // Generate visualization based on format
    try {
      switch (format) {
        case 'svg':
          return generateSVG(processedData.entities, processedData.relationships, { layout, width, height, nodeSize, colorScheme });
        case 'png':
          return generatePNG(processedData, processedData.entities, processedData.relationships, { layout, width, height, nodeSize, colorScheme });
        case 'd3':
          return generateD3Visualization(processedData, { layout, width, height, nodeSize, colorScheme });
        case 'cytoscape':
          return generateCytoscapeVisualization(processedData, { layout, width, height, nodeSize, colorScheme });
        default:
          throw new Error(`Unsupported visualization format: ${format}`);
      }
    } catch (error) {
      console.error(`Failed to generate ${format} visualization:`, error);
      return generateFallbackForFormat(format, error.message);
    }
  } catch (error) {
    console.error('Visualization generation failed:', error);
    return generateErrorMessage(error.message);
  }
}

/**
 * Calculate node positions using the specified layout algorithm
 * @private
 * @param {Array} entities - Array of entities to position
 * @param {Array} relationships - Array of relationships between entities
 * @param {Object} options - Layout options
 * @param {string} options.layout - Layout algorithm to use
 * @param {number} options.width - Width of the visualization area
 * @param {number} options.height - Height of the visualization area
 * @returns {Object} Map of entity IDs to their positions
 */
function calculateLayout(entities, relationships, options) {
  const { layout, width, height } = options;
  const positions = {};
  
  switch (layout) {
    case 'circular':
      return circularLayout(entities, width, height);
    case 'grid':
      return gridLayout(entities, width, height);
    case 'linear':
      return linearLayout(entities, relationships, width, height);
    case 'force':
      return forceLayout(entities, relationships, width, height);
    default:
      throw new Error(`Unsupported layout algorithm: ${layout}`);
  }
}

/**
 * Circular layout algorithm
 * @private
 */
function circularLayout(entities, width, height) {
  const positions = {};
    const centerX = width / 2;
    const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;
    
    entities.forEach((entity, index) => {
      const angle = (index / entities.length) * 2 * Math.PI;
      positions[entity.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
  
  return positions;
}

/**
 * Grid layout algorithm
 * @private
 */
function gridLayout(entities, width, height) {
  const positions = {};
    const cols = Math.ceil(Math.sqrt(entities.length));
  const rows = Math.ceil(entities.length / cols);
    const cellWidth = width / cols;
  const cellHeight = height / rows;
    
    entities.forEach((entity, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      positions[entity.id] = {
        x: col * cellWidth + cellWidth / 2,
        y: row * cellHeight + cellHeight / 2
      };
    });
  
  return positions;
}

/**
 * Linear layout algorithm
 * @private
 */
function linearLayout(entities, relationships, width, height) {
  const positions = {};
  const centerY = height / 2;
  const spacing = width / (entities.length + 1);
  
  // Sort entities by number of relationships
  const entityScores = {};
  entities.forEach(entity => {
    entityScores[entity.id] = relationships.filter(rel => 
      rel.source === entity.id || rel.target === entity.id
    ).length;
  });
  
  const sortedEntities = [...entities].sort((a, b) => 
    entityScores[b.id] - entityScores[a.id]
  );
  
  sortedEntities.forEach((entity, index) => {
    positions[entity.id] = {
      x: (index + 1) * spacing,
      y: centerY
    };
  });
  
  return positions;
}

/**
 * Force-directed layout algorithm
 * @private
 */
function forceLayout(entities, relationships, width, height) {
  const positions = {};
  const centerX = width / 2;
  const centerY = height / 2;
  
  try {
    // Create and run force simulation with optimized parameters
    const simulation = new ForceSimulation(entities, relationships, {
      repulsionStrength: 0.2,
      attractionStrength: 0.015,
      centerGravity: 0.05,
      maxIterations: 200,
      coolingFactor: 0.98,
      initialTemperature: 0.8
    });
    
    // Run simulation
    simulation.run();
    
    // Extract final positions and scale to fit width/height
    entities.forEach(entity => {
      const pos = simulation.positions[entity.id];
      if (pos) {
        positions[entity.id] = {
          x: centerX + pos.x * (width * 0.4),
          y: centerY + pos.y * (height * 0.4)
        };
      } else {
        // Fallback for any entities without positions
        positions[entity.id] = {
          x: centerX + (Math.random() - 0.5) * width * 0.5,
          y: centerY + (Math.random() - 0.5) * height * 0.5
        };
      }
    });
    
    return positions;
  } catch (error) {
    console.error('Force layout failed, falling back to grid layout:', error);
    // Fallback to grid layout if force layout fails
    return gridLayout(entities, width, height);
  }
}

/**
 * Generate SVG visualization
 * @private
 */
function generateSVG(entities, relationships, options) {
  const { width = 800, height = 600, layout = 'force', colorScheme = 'blue' } = options;
  
  // Calculate node positions using layout algorithm
  const positions = calculateLayout(entities, relationships, { width, height, layout });
  
  // Generate SVG content with interactivity and accessibility
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" 
    aria-labelledby="title desc" role="img" viewBox="0 0 ${width} ${height}">
    <title id="title">UltraLink Graph Visualization</title>
    <desc id="desc">Graph visualization showing ${entities.length} entities and ${relationships.length} relationships</desc>
    
    <style>
      ${getColorSchemeStyles(colorScheme)}
      .node { cursor: pointer; }
      .node:hover { opacity: 0.8; filter: brightness(1.2); }
      .node:hover .node-tooltip { opacity: 1; }
      .relationship { stroke-width: 1px; transition: stroke-width 0.2s; }
      .relationship:hover { stroke-width: 3px; filter: brightness(1.2); }
      .text { font-family: Arial, sans-serif; font-size: 12px; pointer-events: none; }
      .node-tooltip {
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      .tooltip-bg {
        fill: white;
        stroke: #ccc;
        stroke-width: 1px;
        rx: 4;
        ry: 4;
        opacity: 0.9;
      }
      .tooltip-text {
        font-family: Arial, sans-serif;
        font-size: 11px;
        fill: #333;
      }
      
      /* Animation for nodes */
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      .node {
        animation: fadeIn 0.5s ease-out forwards;
      }
      .node:nth-child(odd) {
        animation-delay: 0.1s;
      }
      .node:nth-child(even) {
        animation-delay: 0.2s;
      }
    </style>
    
    <rect width="${width}" height="${height}" fill="#f8f9fa" fill-opacity="0.5" />
    
    <g class="graph-container">
      <!-- Relationships -->
      ${relationships.map((rel, index) => {
      const source = positions[rel.source];
      const target = positions[rel.target];
        if (!source || !target) return '';
        
        const strokeWidth = getRelationshipWidth(rel);
        const color = getRelationshipColor(rel, colorScheme);
        const sourceEntity = entities.find(e => e.id === rel.source);
        const targetEntity = entities.find(e => e.id === rel.target);
        const relType = rel.type || 'related';
        
        // Create unique ID for potential accessibility and interaction purposes
        const relationshipId = `rel-${index}`;
        
        let arrowMarker = '';
        if (rel.directed) {
          const markerId = `arrowhead-${index}`;
          arrowMarker = `
            <defs>
              <marker id="${markerId}" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="${color}" />
              </marker>
            </defs>
          `;
          
          return `
            ${arrowMarker}
            <line 
              id="${relationshipId}"
              class="relationship relationship-${relType}"
              x1="${source.x}" y1="${source.y}"
              x2="${target.x}" y2="${target.y}"
              stroke="${color}"
              stroke-width="${strokeWidth}"
              marker-end="url(#${markerId})"
              aria-label="${sourceEntity?.name || rel.source} ${relType} ${targetEntity?.name || rel.target}"
            >
              <title>${sourceEntity?.name || rel.source} ${relType} ${targetEntity?.name || rel.target}</title>
            </line>
          `;
        }
        
        return `
          <line 
            id="${relationshipId}"
            class="relationship relationship-${relType}"
            x1="${source.x}" y1="${source.y}"
            x2="${target.x}" y2="${target.y}"
            stroke="${color}"
            stroke-width="${strokeWidth}"
            aria-label="${sourceEntity?.name || rel.source} ${relType} ${targetEntity?.name || rel.target}"
          >
            <title>${sourceEntity?.name || rel.source} ${relType} ${targetEntity?.name || rel.target}</title>
          </line>
        `;
      }).join('\n')}
      
      <!-- Nodes -->
      ${entities.map((entity, index) => {
    const pos = positions[entity.id];
        if (!pos) return '';
        
        const size = getNodeSize(entity, relationships);
        const color = getColorForEntity(entity, colorScheme);
        const nodeType = entity.type || 'default';
        const label = entity.name || entity.id;
        const connections = relationships.filter(rel => 
          rel.source === entity.id || rel.target === entity.id
        ).length;
        
        // Create unique ID for accessibility and interaction
        const nodeId = `node-${index}`;
        
        // Tooltip text including entity details
        const tooltipInfo = [
          `Name: ${label}`,
          `Type: ${nodeType}`,
          `Connections: ${connections}`
        ];
        
        // Include any key attributes in tooltip, limited to 3
        if (entity.attributes) {
          const attributeEntries = Object.entries(entity.attributes)
            .filter(([key]) => key !== 'name' && key !== 'type') // Skip fields already shown
            .slice(0, 3); // Limit to 3 additional attributes
            
          attributeEntries.forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
              tooltipInfo.push(`${key}: ${value}`);
            }
          });
        }
        
        // Calculate tooltip dimensions
        const tooltipWidth = 160;
        const tooltipLineHeight = 16;
        const tooltipHeight = (tooltipInfo.length + 1) * tooltipLineHeight + 4;
        
        return `
          <g id="${nodeId}" class="node node-${nodeType}" transform="translate(${pos.x},${pos.y})" 
             aria-label="${label} (${nodeType})" role="img">
            <title>${label} (${nodeType})</title>
            <circle r="${size}" fill="${color}" />
            <text 
              class="text"
              x="0" 
              y="${size + 15}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="${getTextColor(colorScheme)}"
            >${label}</text>
            
            <!-- Interactive tooltip -->
            <g class="node-tooltip" transform="translate(${size + 5}, ${-tooltipHeight/2})">
              <rect class="tooltip-bg" width="${tooltipWidth}" height="${tooltipHeight}" />
              ${tooltipInfo.map((line, i) => 
                `<text class="tooltip-text" x="8" y="${(i+1) * tooltipLineHeight}">${line}</text>`
              ).join('\n')}
            </g>
          </g>
        `;
      }).join('\n')}
    </g>
    
    <!-- Add accessibility metadata -->
    <metadata>
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
               xmlns:dc="http://purl.org/dc/elements/1.1/">
        <rdf:Description about="https://ultralink.io/"
                         dc:title="UltraLink Graph Visualization"
                         dc:description="Visualization of entities and relationships"
                         dc:creator="UltraLink Visualization System"
                         dc:date="${new Date().toISOString()}"
                         dc:format="image/svg+xml">
        </rdf:Description>
      </rdf:RDF>
    </metadata>
  </svg>`;
  
  return svg;
}

/**
 * Generate D3.js visualization
 * @private
 */
function generateD3Visualization(data, options) {
  const { entities, relationships } = data;
  const { width = 800, height = 600, layout = 'force', colorScheme = 'blue' } = options;
  
  // Calculate initial positions using layout algorithm
  const positions = calculateLayout(entities, relationships, { width, height, layout });
  
  // Generate HTML content with D3.js
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>UltraLink Visualization</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    ${getColorSchemeStyles(colorScheme)}
    body { margin: 0; font-family: Arial, sans-serif; }
    #graph { width: 100vw; height: 100vh; }
    .node { cursor: pointer; }
    .node:hover { opacity: 0.8; }
    .relationship { stroke-width: 1px; }
    .relationship:hover { stroke-width: 2px; }
    .text { font-size: 12px; }
    .tooltip {
      position: absolute;
      padding: 8px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ddd;
      border-radius: 4px;
      pointer-events: none;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div id="graph"></div>
  <script>
    // Data
    const data = ${JSON.stringify({
      nodes: entities.map(entity => ({
        id: entity.id,
        name: entity.name,
        type: entity.type || 'default',
        x: positions[entity.id]?.x || 0,
        y: positions[entity.id]?.y || 0
      })),
      links: relationships.map(rel => ({
        source: rel.source,
        target: rel.target,
        type: rel.type || 'default',
        strength: rel.attributes?.strength || 1
      }))
    })};
    
    // Setup
    const width = ${width};
    const height = ${height};
    const svg = d3.select('#graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    
    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links)
        .id(d => d.id)
        .distance(d => 100 / d.strength)
        .strength(d => d.strength))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => 30));
    
    // Create relationships
    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('class', 'relationship')
      .style('stroke', d => getRelationshipColor(d, '${colorScheme}'))
      .style('stroke-width', d => getRelationshipWidth(d));
    
    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('class', d => \`node node-\${d.type}\`)
      .call(drag(simulation));
    
    // Add circles to nodes
    node.append('circle')
      .attr('r', d => 10)
      .style('fill', d => getNodeColor(d, '${colorScheme}'))
      .style('stroke', '#fff')
      .style('stroke-width', 2);
    
    // Add labels to nodes
    node.append('text')
      .attr('class', 'text')
      .attr('dx', 15)
      .attr('dy', 4)
      .text(d => d.name || d.id)
      .style('fill', '#333');
    
    // Add tooltips
    node.on('mouseover', (event, d) => {
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(\`<strong>\${d.name || d.id}</strong><br/>\${d.type || 'Entity'}\`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
    
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('transform', d => \`translate(\${d.x},\${d.y})\`);
    });
    
    // Drag functions
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
    
    // Helper functions (would be imported in a real app)
    function getNodeColor(node, scheme) {
      return node.type === 'default' ? '#6baed6' : '#3182bd';
    }
    
    function getRelationshipColor(relationship, scheme) {
      return '#999';
    }
    
    function getRelationshipWidth(relationship) {
      return relationship.strength || 1;
    }
  </script>
</body>
</html>`;

  // Return object with HTML content and metadata
  return {
    'd3.html': htmlContent,
    'graph-d3.html': htmlContent,
    'metadata': {
      format: 'd3',
      entityCount: entities.length,
      relationshipCount: relationships.length,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Generate Cytoscape visualization
 * @private
 */
function generateCytoscapeVisualization(data, options) {
  const { entities, relationships } = data;
  const { width = 800, height = 600, layout = 'force', colorScheme = 'blue' } = options;
  
  // Calculate initial positions using layout algorithm
  const positions = calculateLayout(entities, relationships, { width, height, layout });
  
  // Generate HTML content with Cytoscape.js
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>UltraLink Visualization</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dagre/0.8.5/dagre.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/cytoscape-dagre@2.5.0/cytoscape-dagre.min.js"></script>
  <style>
    ${getColorSchemeStyles(colorScheme)}
    body { margin: 0; font-family: Arial, sans-serif; }
    #graph { width: 100vw; height: 100vh; }
    .node { cursor: pointer; }
    .node:hover { opacity: 0.8; }
    .relationship { stroke-width: 1px; }
    .relationship:hover { stroke-width: 2px; }
    .text { font-size: 12px; }
    .tooltip {
      position: absolute;
      padding: 8px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ddd;
      border-radius: 4px;
      pointer-events: none;
      font-size: 12px;
      z-index: 1000;
    }
    .controls {
      position: absolute;
      top: 10px;
      right: 10px;
      background: white;
      padding: 10px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    .controls button {
      margin: 0 5px;
      padding: 5px 10px;
      border: none;
      border-radius: 3px;
      background: #4285F4;
      color: white;
      cursor: pointer;
    }
    .controls button:hover {
      background: #1A73E8;
    }
  </style>
</head>
<body>
  <div id="graph"></div>
  <div class="controls">
    <button onclick="cy.fit()">Fit</button>
    <button onclick="cy.center()">Center</button>
    <button onclick="cy.layout({name: 'dagre'}).run()">DAG Layout</button>
    <button onclick="cy.layout({name: 'cose'}).run()">Force Layout</button>
    <button onclick="cy.layout({name: 'grid'}).run()">Grid Layout</button>
  </div>
  <div class="tooltip"></div>
  <script>
    // Data
    const data = ${JSON.stringify({
      nodes: entities.map(entity => ({
        id: entity.id,
        name: entity.name,
        type: entity.type || 'default',
        x: positions[entity.id]?.x || 0,
        y: positions[entity.id]?.y || 0
      })),
      edges: relationships.map(rel => ({
        id: rel.source + '-' + rel.target,
        source: rel.source,
        target: rel.target,
        type: rel.type || 'default',
        strength: rel.attributes?.strength || 1
      }))
    })};
    
    // Initialize Cytoscape
    const cy = cytoscape({
      container: document.getElementById('graph'),
      elements: {
        nodes: data.nodes.map(node => ({
          data: {
            id: node.id,
            name: node.name || node.id,
            type: node.type
          },
          position: { x: node.x, y: node.y }
        })),
        edges: data.edges.map(edge => ({
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            strength: edge.strength
          }
        }))
      },
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(name)',
            'width': 30,
            'height': 30,
            'background-color': '#6baed6',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'color': '#333',
            'font-size': '12px',
            'text-margin-y': 10
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'preset'
      }
    });
    
    // Add tooltip functionality
    const tooltip = document.querySelector('.tooltip');
    
    cy.on('mouseover', 'node', function(evt) {
      const node = evt.target;
      const position = evt.renderedPosition;
      
      tooltip.style.left = (position.x + 10) + 'px';
      tooltip.style.top = (position.y + 10) + 'px';
      tooltip.innerHTML = \`
        <strong>\${node.data('name')}</strong><br>
        Type: \${node.data('type') || 'Entity'}<br>
        Connections: \${node.connectedEdges().length}
      \`;
      tooltip.style.display = 'block';
    });
    
    cy.on('mouseout', 'node', function() {
      tooltip.style.display = 'none';
    });
  </script>
</body>
</html>`;

  // Return object with HTML content and metadata
  return {
    'cytoscape.html': htmlContent,
    'graph-cytoscape.html': htmlContent,
    'metadata': {
      format: 'cytoscape',
      entityCount: entities.length,
      relationshipCount: relationships.length,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Get color scheme styles
 * @private
 */
function getColorSchemeStyles(colorScheme) {
  const schemes = {
    blue: `
      .node-person { fill: #4285F4; }
      .node-project { fill: #EA4335; }
      .node-organization { fill: #FBBC05; }
      .node-location { fill: #34A853; }
      .node-event { fill: #8F00FF; }
      .node-default { fill: #999999; }
      .relationship { stroke: #4285F4; }
      .text { fill: #333333; }
    `,
    green: `
      .node-person { fill: #2E7D32; }
      .node-project { fill: #4CAF50; }
      .node-organization { fill: #81C784; }
      .node-location { fill: #A5D6A7; }
      .node-event { fill: #C8E6C9; }
      .node-default { fill: #E8F5E9; }
      .relationship { stroke: #2E7D32; }
      .text { fill: #1B5E20; }
    `,
    red: `
      .node-person { fill: #D32F2F; }
      .node-project { fill: #F44336; }
      .node-organization { fill: #E57373; }
      .node-location { fill: #EF5350; }
      .node-event { fill: #FF8A80; }
      .node-default { fill: #FFCDD2; }
      .relationship { stroke: #D32F2F; }
      .text { fill: #B71C1C; }
    `,
    purple: `
      .node-person { fill: #7B1FA2; }
      .node-project { fill: #9C27B0; }
      .node-organization { fill: #BA68C8; }
      .node-location { fill: #CE93D8; }
      .node-event { fill: #E1BEE7; }
      .node-default { fill: #F3E5F5; }
      .relationship { stroke: #7B1FA2; }
      .text { fill: #4A148C; }
    `,
    orange: `
      .node-person { fill: #F57C00; }
      .node-project { fill: #FF9800; }
      .node-organization { fill: #FFB74D; }
      .node-location { fill: #FFCC80; }
      .node-event { fill: #FFE0B2; }
      .node-default { fill: #FFF3E0; }
      .relationship { stroke: #F57C00; }
      .text { fill: #E65100; }
    `
  };
  
  return schemes[colorScheme] || schemes.blue;
}

/**
 * Get color for an entity based on type and color scheme
 * @private
 */
function getColorForEntity(entity, colorScheme) {
  const type = entity.type || 'default';
  const schemes = {
    blue: {
      person: '#4285F4',
      project: '#EA4335',
      organization: '#FBBC05',
      location: '#34A853',
      event: '#8F00FF',
      default: '#999999'
    },
    green: {
      person: '#2E7D32',
      project: '#4CAF50',
      organization: '#81C784',
      location: '#A5D6A7',
      event: '#C8E6C9',
      default: '#E8F5E9'
    },
    red: {
      person: '#D32F2F',
      project: '#F44336',
      organization: '#E57373',
      location: '#EF5350',
      event: '#FF8A80',
      default: '#FFCDD2'
    },
    purple: {
      person: '#7B1FA2',
      project: '#9C27B0',
      organization: '#BA68C8',
      location: '#CE93D8',
      event: '#E1BEE7',
      default: '#F3E5F5'
    },
    orange: {
      person: '#F57C00',
      project: '#FF9800',
      organization: '#FFB74D',
      location: '#FFCC80',
      event: '#FFE0B2',
      default: '#FFF3E0'
    }
  };
  
  return (schemes[colorScheme] || schemes.blue)[type] || schemes.blue.default;
}

/**
 * Get color for a relationship based on type and color scheme
 * @private
 */
function getRelationshipColor(relationship, colorScheme) {
  const type = relationship.type || 'default';
  const schemes = {
    blue: {
      default: '#4285F4',
      strong: '#1A73E8',
      weak: '#8AB4F8'
    },
    green: {
      default: '#2E7D32',
      strong: '#1B5E20',
      weak: '#81C784'
    },
    red: {
      default: '#D32F2F',
      strong: '#B71C1C',
      weak: '#E57373'
    },
    purple: {
      default: '#7B1FA2',
      strong: '#4A148C',
      weak: '#BA68C8'
    },
    orange: {
      default: '#F57C00',
      strong: '#E65100',
      weak: '#FFB74D'
    }
  };
  
  return (schemes[colorScheme] || schemes.blue)[type] || schemes.blue.default;
}

/**
 * Get width for a relationship based on its attributes
 * @private
 */
function getRelationshipWidth(relationship) {
  const strength = relationship.attributes?.strength || 1;
  return Math.max(1, Math.min(3, strength * 2));
}

/**
 * Get size for a node based on its degree (number of connections)
 * @private
 */
function getNodeSize(entity, relationships) {
  const degree = relationships.filter(rel => 
    rel.source === entity.id || rel.target === entity.id
  ).length;
  return Math.max(3, Math.min(10, 3 + degree));
}

/**
 * Get text color based on color scheme
 * @private
 */
function getTextColor(colorScheme) {
  const schemes = {
    blue: '#333333',
    green: '#1B5E20',
    red: '#B71C1C',
    purple: '#4A148C',
    orange: '#E65100'
  };
  return schemes[colorScheme] || schemes.blue;
}

// Enhanced force simulation for layout with better physics
class ForceSimulation {
  constructor(entities, relationships, options = {}) {
    this.entities = entities;
    this.relationships = relationships;
    this.positions = {};
    
    // Configuration options with defaults
    this.options = {
      repulsionStrength: options.repulsionStrength || 0.15,
      attractionStrength: options.attractionStrength || 0.01,
      dampingFactor: options.dampingFactor || 0.9,
      maxIterations: options.maxIterations || 100,
      minDistance: options.minDistance || 0.1,
      maxDistance: options.maxDistance || 10,
      centerGravity: options.centerGravity || 0.01,
      initialTemperature: options.initialTemperature || 0.5,
      coolingFactor: options.coolingFactor || 0.95
    };
    
    // Initialize random positions
    entities.forEach(entity => {
      this.positions[entity.id] = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        vx: 0,
        vy: 0
      };
    });
    
    // Track simulation state
    this.temperature = this.options.initialTemperature;
    this.stabilized = false;
  }
  
  run(iterations) {
    const maxIterations = iterations || this.options.maxIterations;
    let i = 0;
    
    while (i < maxIterations && !this.stabilized) {
      this.step();
      i++;
      
      // Cool down temperature
      this.temperature *= this.options.coolingFactor;
      
      // Check for stabilization (very low kinetic energy)
      if (this.getSystemEnergy() < 0.001) {
        this.stabilized = true;
        console.log(`Force simulation stabilized after ${i} iterations`);
      }
    }
    
    // Apply final centering and scaling
    this.centerAndScale();
  }
  
  getSystemEnergy() {
    let energy = 0;
    for (const id in this.positions) {
      const pos = this.positions[id];
      // Kinetic energy = 0.5 * m * v^2 (assuming m=1)
      energy += 0.5 * (pos.vx * pos.vx + pos.vy * pos.vy);
    }
    return energy;
  }
  
  centerAndScale() {
    // Find bounds
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    for (const id in this.positions) {
      const pos = this.positions[id];
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x);
      maxY = Math.max(maxY, pos.y);
    }
    
    const width = maxX - minX || 2;
    const height = maxY - minY || 2;
    const scale = 1.8 / Math.max(width, height);
    
    // Center and scale
    for (const id in this.positions) {
      const pos = this.positions[id];
      pos.x = (pos.x - (minX + maxX) / 2) * scale;
      pos.y = (pos.y - (minY + maxY) / 2) * scale;
    }
  }
  
  step() {
    // Reset forces
    const forces = {};
    for (const id in this.positions) {
      forces[id] = { fx: 0, fy: 0 };
    }
    
    // Apply repulsive forces between all nodes (nodes repel each other)
    for (let i = 0; i < this.entities.length; i++) {
      const entity1 = this.entities[i];
      const pos1 = this.positions[entity1.id];
      
      for (let j = i + 1; j < this.entities.length; j++) {
        const entity2 = this.entities[j];
        const pos2 = this.positions[entity2.id];
        
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared) || this.options.minDistance;
        
        // Calculate repulsive force (inverse square law)
        const force = this.options.repulsionStrength / (distanceSquared);
        const fx = dx / distance * force;
        const fy = dy / distance * force;
        
        // Apply forces to both nodes in opposite directions
        forces[entity1.id].fx -= fx;
        forces[entity1.id].fy -= fy;
        forces[entity2.id].fx += fx;
        forces[entity2.id].fy += fy;
      }
    }
    
    // Apply attractive forces along edges (connected nodes attract)
    this.relationships.forEach(rel => {
      const sourcePos = this.positions[rel.source];
      const targetPos = this.positions[rel.target];
      
      if (sourcePos && targetPos) {
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || this.options.minDistance;
        
        // Calculate attractive force (like spring force)
        const strength = rel.attributes?.strength || 1;
        const force = this.options.attractionStrength * distance * strength;
        const fx = dx / distance * force;
        const fy = dy / distance * force;
        
        // Apply forces to both nodes
        forces[rel.source].fx += fx;
        forces[rel.source].fy += fy;
        forces[rel.target].fx -= fx;
        forces[rel.target].fy -= fy;
      }
    });
    
    // Apply center gravity force
    for (const id in this.positions) {
      const pos = this.positions[id];
      
      // Gravity toward center (0,0)
      const dx = -pos.x;
      const dy = -pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || this.options.minDistance;
      
      const force = this.options.centerGravity;
      forces[id].fx += dx / distance * force;
      forces[id].fy += dy / distance * force;
    }
    
    // Update positions based on forces and current temperature
    for (const id in this.positions) {
      const pos = this.positions[id];
      const force = forces[id];
      
      // Apply force with temperature as a scaling factor
      pos.vx = (pos.vx + force.fx) * this.options.dampingFactor;
      pos.vy = (pos.vy + force.fy) * this.options.dampingFactor;
      
      // Limit velocity by temperature
      const velocity = Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy);
      if (velocity > this.temperature) {
        pos.vx = pos.vx / velocity * this.temperature;
        pos.vy = pos.vy / velocity * this.temperature;
      }
      
      // Update position
      pos.x += pos.vx;
      pos.y += pos.vy;
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

/**
 * Draw visualization on a canvas
 * @private
 */
function drawOnCanvas(canvas, entities, relationships, positions, options) {
  const { width = 800, height = 600, colorScheme = 'blue' } = options;
  const ctx = canvas.getContext('2d');
  
  // Set background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  // Draw relationships
  relationships.forEach(rel => {
    const source = positions[rel.source];
    const target = positions[rel.target];
    if (!source || !target) return;
    
    const width = getRelationshipWidth(rel);
    const color = getRelationshipColor(rel, colorScheme);
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    
    // Add arrow for directed relationships
    if (rel.directed) {
      const angle = Math.atan2(target.y - source.y, target.x - source.x);
      const arrowLength = 10;
      
      const targetEntity = entities.find(e => e.id === rel.target);
      const nodeSize = targetEntity ? getNodeSize(targetEntity, relationships) : 5;
      
      const tipX = target.x - Math.cos(angle) * (nodeSize + 2);
      const tipY = target.y - Math.sin(angle) * (nodeSize + 2);
      
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(
        tipX - arrowLength * Math.cos(angle - Math.PI/6),
        tipY - arrowLength * Math.sin(angle - Math.PI/6)
      );
      ctx.lineTo(
        tipX - arrowLength * Math.cos(angle + Math.PI/6),
        tipY - arrowLength * Math.sin(angle + Math.PI/6)
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  });
  
  // Draw nodes
  entities.forEach(entity => {
    const pos = positions[entity.id];
    if (!pos) return;
    
    const size = getNodeSize(entity, relationships);
    const color = getColorForEntity(entity, colorScheme);
    
    // Draw node circle
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw node label
    const label = entity.name || entity.id;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = getTextColor(colorScheme);
    
    // Add text shadow for better readability
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(label, pos.x, pos.y + size + 15);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });
  
  // Convert canvas to PNG
  try {
    return canvas.toDataURL('image/png');
  } catch (error) {
    // Handle Node.js canvas
    if (canvas.toBuffer) {
      const buffer = canvas.toBuffer('image/png');
      return `data:image/png;base64,${buffer.toString('base64')}`;
    }
    throw error;
  }
}

/**
 * Generates a PNG visualization from UltraLink data
 * @param {Object} data - UltraLink data object
 * @param {Array} entities - Array of entity objects
 * @param {Array} relationships - Array of relationship objects
 * @param {Object} options - Visualization options
 * @returns {Buffer|string|null} - PNG data as Buffer or fallback SVG string if Canvas not available
 */
function generatePNG(data, entities, relationships, options) {
  try {
    // Try to load the canvas module if available
    let canvas;
    let canvasAvailable = false;
    
    try {
      // Check if we're in a browser environment with canvas support
      if (typeof document !== 'undefined' && document.createElement) {
        canvas = document.createElement('canvas');
        canvasAvailable = true;
      } else {
        // Try to load the node-canvas module
        const { createCanvas } = require('canvas');
        canvas = createCanvas(options.width || 800, options.height || 600);
        canvasAvailable = true;
      }
    } catch (e) {
      // Canvas is not available, log the error and continue with fallback
      console.warn('Canvas is not available for PNG generation:', e.message);
      console.warn('Falling back to SVG generation');
      
      // Return SVG with a note about fallback
      const svgContent = generateSVG(data, entities, relationships, options);
      return addFallbackNotice(svgContent);
    }
    
    if (!canvasAvailable) {
      // Return SVG with a note about fallback
      const svgContent = generateSVG(data, entities, relationships, options);
      return addFallbackNotice(svgContent);
    }
    
    // Canvas is available, generate PNG
    const ctx = canvas.getContext('2d');
    const width = options.width || 800;
    const height = options.height || 600;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate positions
    const positions = calculateLayout(entities, relationships, options);
    
    // Draw relationships
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    
    relationships.forEach(rel => {
      const source = entities.find(e => e.id === rel.source);
      const target = entities.find(e => e.id === rel.target);
      
      if (source && target && positions[source.id] && positions[target.id]) {
        const sourcePos = positions[source.id];
        const targetPos = positions[target.id];
        
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();
        
        // Draw arrow if directed
        if (rel.directed) {
          drawArrow(ctx, sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
        }
      }
    });
    
    // Draw nodes
    entities.forEach(entity => {
      if (positions[entity.id]) {
        const pos = positions[entity.id];
        const radius = entity.relationships?.length ? 6 + Math.min(entity.relationships.length, 10) : 6;
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = getColorForEntity(entity, options);
        ctx.fill();
        ctx.stroke();
        
        // Draw label
        ctx.font = '10px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(entity.name || entity.id, pos.x, pos.y + radius + 12);
      }
    });
    
    // Add metadata
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'left';
    ctx.fillText(`${data.name || 'UltraLink Visualization'} - ${new Date().toISOString().split('T')[0]}`, 10, height - 10);
    
    // Return PNG data
    if (typeof document !== 'undefined') {
      // Browser environment
      return canvas.toDataURL('image/png');
    } else {
      // Node.js environment
      return canvas.toBuffer('image/png');
    }
  } catch (error) {
    console.error('Error generating PNG visualization:', error);
    
    // Return SVG with a note about fallback
    try {
      const svgContent = generateSVG(data, entities, relationships, options);
      return addFallbackNotice(svgContent);
    } catch (svgError) {
      console.error('Error generating fallback SVG:', svgError);
      return null;
    }
  }
}

/**
 * Adds a fallback notice to an SVG string
 * @param {string} svgContent - The SVG content
 * @returns {string} - SVG with fallback notice
 */
function addFallbackNotice(svgContent) {
  // Find where to insert the notice (before the closing svg tag)
  const insertIndex = svgContent.lastIndexOf('</svg>');
  
  if (insertIndex === -1) {
    return svgContent;
  }
  
  const notice = `
    <g transform="translate(10, 20)">
      <rect x="0" y="0" width="250" height="40" fill="rgba(255,255,0,0.2)" stroke="#999" />
      <text x="10" y="15" font-family="Arial" font-size="12" fill="#333">
        <tspan x="10" y="20">PNG generation not available.</tspan>
        <tspan x="10" y="35">SVG fallback displayed instead.</tspan>
      </text>
    </g>
  `;
  
  return svgContent.substring(0, insertIndex) + notice + svgContent.substring(insertIndex);
}

/**
 * Draws an arrow head at the end of a line
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} fromX - Start X
 * @param {number} fromY - Start Y
 * @param {number} toX - End X
 * @param {number} toY - End Y
 */
function drawArrow(ctx, fromX, fromY, toX, toY) {
  const headLength = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  // Move to the end point
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  
  // Draw the arrow head
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

/**
 * Generate fallback content for a failed visualization
 * @private
 */
function generateFallbackForFormat(format, errorMessage) {
  const timestamp = new Date().toISOString();
  const safeErrorMessage = errorMessage || 'Failed to generate visualization';
  
  switch (format) {
    case 'svg':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#bg-gradient)" />
        <g transform="translate(40, 40)">
          <text x="0" y="0" font-family="Arial" font-size="24" font-weight="bold" fill="#dc3545">
            Visualization Error
          </text>
          <text x="0" y="40" font-family="Arial" font-size="16" fill="#343a40">
            ${safeErrorMessage}
          </text>
          <text x="0" y="70" font-family="Arial" font-size="12" fill="#6c757d">
            Timestamp: ${timestamp}
          </text>
          
          <!-- Visual representation of the error -->
          <g transform="translate(350, 120)">
            <circle cx="0" cy="0" r="80" fill="#f8d7da" stroke="#dc3545" stroke-width="2" />
            <path d="M-40,-40 L40,40 M-40,40 L40,-40" stroke="#dc3545" stroke-width="6" stroke-linecap="round" />
          </g>
          
          <!-- Suggestions -->
          <text x="0" y="220" font-family="Arial" font-size="16" font-weight="bold" fill="#343a40">
            Troubleshooting suggestions:
          </text>
          <text x="0" y="250" font-family="Arial" font-size="14" fill="#343a40">
            • Check that your data contains valid entities and relationships
          </text>
          <text x="0" y="275" font-family="Arial" font-size="14" fill="#343a40">
            • Verify visualization options (format, layout, etc.)
          </text>
          <text x="0" y="300" font-family="Arial" font-size="14" fill="#343a40">
            • For PNG format, install the "canvas" package
          </text>
        </g>
      </svg>`;
      
    case 'png':
      // Return data URL of error SVG
      const errorSvg = generateFallbackForFormat('svg', safeErrorMessage);
      if (typeof Buffer !== 'undefined') {
        return `data:image/svg+xml;base64,${Buffer.from(errorSvg).toString('base64')}`;
      } else if (typeof window !== 'undefined') {
        return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(errorSvg)))}`;
      }
      return `data:image/svg+xml,${encodeURIComponent(errorSvg)}`;
      
    case 'd3':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Visualization Error</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }
    .container {
      max-width: 800px;
      padding: 40px;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    .error { 
      color: #dc3545; 
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .details { 
      margin: 20px 0 30px 0;
      color: #343a40;
      font-size: 16px;
      line-height: 1.5;
    }
    .timestamp {
      font-size: 12px;
      color: #6c757d;
      margin-bottom: 30px;
    }
    .icon {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }
    .icon svg {
      width: 120px;
      height: 120px;
    }
    .suggestions {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 4px;
    }
    .suggestions h3 {
      color: #343a40;
      margin-top: 0;
    }
    .suggestions ul {
      margin: 0;
      padding-left: 20px;
    }
    .suggestions li {
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="error">Visualization Error</h1>
    <div class="timestamp">Timestamp: ${timestamp}</div>
    <div class="details">${safeErrorMessage}</div>
    
    <div class="icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" fill="#f8d7da"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    </div>
    
    <div class="suggestions">
      <h3>Troubleshooting suggestions:</h3>
      <ul>
        <li>Check that your data contains valid entities and relationships</li>
        <li>Verify visualization options (format, layout, etc.)</li>
        <li>For PNG format, install the "canvas" package</li>
        <li>Check browser console for detailed error message</li>
      </ul>
    </div>
  </div>
</body>
</html>`;
      
    case 'cytoscape':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Visualization Error</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }
    .container {
      max-width: 800px;
      padding: 40px;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    .error { 
      color: #dc3545; 
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .details { 
      margin: 20px 0 30px 0;
      color: #343a40;
      font-size: 16px;
      line-height: 1.5;
    }
    .timestamp {
      font-size: 12px;
      color: #6c757d;
      margin-bottom: 30px;
    }
    .icon {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }
    .icon svg {
      width: 120px;
      height: 120px;
    }
    .suggestions {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 4px;
    }
    .suggestions h3 {
      color: #343a40;
      margin-top: 0;
    }
    .suggestions ul {
      margin: 0;
      padding-left: 20px;
    }
    .suggestions li {
      margin-bottom: 8px;
    }
    .cytoscape-specific {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="error">Cytoscape Visualization Error</h1>
    <div class="timestamp">Timestamp: ${timestamp}</div>
    <div class="details">${safeErrorMessage}</div>
    
    <div class="icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" fill="#f8d7da"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    </div>
    
    <div class="suggestions">
      <h3>Troubleshooting suggestions:</h3>
      <ul>
        <li>Check that your data contains valid entities and relationships</li>
        <li>Verify visualization options (format, layout, etc.)</li>
        <li>Ensure Cytoscape.js dependencies are available</li>
        <li>Check browser console for detailed error message</li>
      </ul>
      
      <div class="cytoscape-specific">
        <h3>Cytoscape-specific tips:</h3>
        <ul>
          <li>Ensure node IDs are unique and valid</li>
          <li>Check that your edges reference valid source and target nodes</li>
          <li>Try a different layout algorithm</li>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>`;
      
    default:
      return {
        error: true,
        message: safeErrorMessage,
        timestamp: timestamp,
        format: format,
        suggestions: [
          'Check that your data contains valid entities and relationships',
          'Verify visualization options (format, layout, etc.)',
          'For PNG format, install the "canvas" package'
        ]
      };
  }
}

/**
 * Generate a standard error message
 * @private
 */
function generateErrorMessage(message) {
  return {
    error: true,
    message: message || 'Unknown error occurred during visualization generation',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  toVisualization,
  toBayesianNetwork
}; 