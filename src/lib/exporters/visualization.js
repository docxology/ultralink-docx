/**
 * Visualization Exporter for UltraLink
 * 
 * This module exports UltraLink data to various visualization formats:
 * - SVG - Vector graphics for publications and presentations
 * - PNG - Raster graphics for web and documents
 * - D3.js - Interactive visualizations using D3 library
 * - Cytoscape.js - Network visualizations using Cytoscape.js
 * 
 * Recent improvements:
 * - Added style tags to SVG output for consistent appearance
 * - Fixed node positioning with a more reliable lookup approach using Map
 * - Improved error handling with meaningful fallback visualizations
 * - Enhanced browser compatibility through proper HTML output
 * - Added Node.js compatibility with proper JSDOM integration
 * - Fixed D3 and Cytoscape output to return proper HTML content
 * - Added proper object structure for visualization returns
 * - Enhanced PNG generation with better quality and error handling
 * 
 * Environment compatibility:
 * - Browser: Uses native DOM capabilities when available
 * - Node.js: Uses JSDOM for DOM simulation in headless environments
 * 
 * Dependencies:
 * - jsdom: Required for Node.js environments
 * - sharp: Optional, needed for PNG generation
 * 
 * @param {Object} ultralink - UltraLink instance
 * @param {Object} options - Configuration options for the export
 * @param {string} [options.format='svg'] - Output format ('svg', 'png', 'd3', 'cytoscape')
 * @param {string} [options.layout='force-directed'] - Layout algorithm to use
 * @param {string} [options.style='default'] - Visual styling to apply
 * @param {number} [options.width=800] - Visualization width
 * @param {number} [options.height=600] - Visualization height
 * @returns {Object} Object containing visualization files
 */
// Use dynamic import for d3 (ES Module)
// We'll import d3 dynamically when needed
const { JSDOM } = require('jsdom');
const cytoscape = require('cytoscape');
const path = require('path');
const fs = require('fs');

// Import our enhanced visualization helpers
const { 
  enhancedSVGtoPNG, 
  createFallbackPNG 
} = require('./visualization-helpers');

const { generateSystemVisualization } = require('./system-template-visualizer');

// Helper function to load d3 dynamically
async function getD3() {
  return await import('d3');
}

/**
 * Main visualization export function
 * Converts UltraLink data to the specified visualization format
 * 
 * @param {Object} ultralink - UltraLink instance
 * @param {Object} options - Configuration options
 * @returns {Object} Object containing visualization files
 */
async function toVisualization(ultralink, options = {}) {
  // Default options
  const format = options.format || 'svg';
  const layout = options.layout || 'force';
  const style = options.style || 'default';
  const width = options.width || 800;
  const height = options.height || 600;
  const systemName = options.systemName || ''; // Capture system name from options
  
  // Prepare graph data
  const graphData = {
    nodes: [],
    links: []
  };
  
  try {
    // Transform entities to nodes
    if (ultralink.store && ultralink.store.entities) {
      for (const [id, entity] of Object.entries(ultralink.store.entities)) {
        graphData.nodes.push({
          id,
          type: entity.type || 'entity',
          label: entity.attributes?.name || id,
          attributes: entity.attributes || {}
        });
      }
    } else if (ultralink.entities && ultralink.entities.size > 0) {
      // Fallback to entities Map if store is not available
      for (const [id, entity] of ultralink.entities.entries()) {
        graphData.nodes.push({
          id,
          type: entity.type || 'entity',
          label: entity.attributes?.name || id,
          attributes: entity.attributes || {}
        });
      }
    }
    
    // Transform relationships to links
    if (ultralink.store && ultralink.store.relationships) {
      for (const [sourceId, targets] of Object.entries(ultralink.store.relationships)) {
        for (const [targetId, relationship] of Object.entries(targets)) {
          // Ensure relationship is an array
          const relationships = Array.isArray(relationship) ? relationship : [relationship];
          
          for (const rel of relationships) {
            if (rel) {
              graphData.links.push({
                source: sourceId,
                target: targetId,
                type: rel.type || 'related_to',
                attributes: rel.attributes || {}
              });
            }
          }
        }
      }
    } else if (ultralink.relationships && ultralink.relationships.size > 0) {
      // Fallback to relationships Map if store is not available
      for (const [sourceId, targets] of ultralink.relationships.entries()) {
        if (targets instanceof Map) {
          for (const [targetId, relationship] of targets.entries()) {
            // Ensure relationship is an array
            const relationships = Array.isArray(relationship) ? relationship : [relationship];
            
            for (const rel of relationships) {
              if (rel) {
                graphData.links.push({
                  source: sourceId,
                  target: targetId,
                  type: rel.type || 'related_to',
                  attributes: rel.attributes || {}
                });
              }
            }
          }
        }
      }
    }
    
    // Generate visualization in the requested format
    try {
      switch (format.toLowerCase()) {
        case 'svg':
          return { 'graph.svg': await generateSVG(graphData, { layout, style, width, height }) };
        case 'png':
          const result = {};
          result['graph.png'] = await generatePNG(graphData, { layout, style, width, height, systemName });
          if (layout === 'radial') {
            result['graph-radial.png'] = await generatePNG(graphData, { 
              layout: 'radial', 
              style: style, 
              width, 
              height,
              systemName
            });
          }
          if (layout === 'grid') {
            result['graph-grid.png'] = await generatePNG(graphData, { 
              layout: 'grid', 
              style: style, 
              width, 
              height,
              systemName
            });
          }
          if (layout === 'cluster') {
            result['graph-cluster.png'] = await generatePNG(graphData, { 
              layout: 'cluster', 
              style: style, 
              width, 
              height,
              systemName
            });
          }
          return result;
        case 'd3':
          const d3Html = await generateD3(graphData, { layout, style, width, height });
          return { 'graph-d3.html': d3Html };
        case 'cytoscape':
          const cytoHtml = generateCytoscape(graphData, { layout, style, width, height });
          return { 'graph-cytoscape.html': cytoHtml };
        default:
          console.warn(`Unsupported visualization format: ${format}, using fallback`);
          return generateFallbackVisualization(format, ultralink.name || 'UltraLink', width, height);
      }
    } catch (error) {
      console.error(`Error generating ${format} visualization:`, error);
      return generateFallbackVisualization(format, ultralink.name || 'UltraLink', width, height);
    }
  } catch (error) {
    console.error('Error preparing graph data:', error);
    return generateFallbackVisualization(format, ultralink.name || 'UltraLink', width, height);
  }
}

/**
 * Generate SVG visualization
 * @param {Object} graphData - Graph data with nodes and links
 * @param {Object} options - Visualization options
 * @returns {string} SVG content
 */
async function generateSVG(graphData, options) {
  const { layout = 'force', styleOption = 'default', width = 800, height = 600 } = options;
  
  // Create a new JSDOM instance for SVG generation
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const document = dom.window.document;
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0,0,${width},${height}`);
  
  // Add style definitions
  const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleElement.textContent = `
    .node { cursor: pointer; }
    .link { stroke: #999; stroke-opacity: 0.6; }
    .label { font-family: sans-serif; font-size: 10px; }
  `;
  svg.appendChild(styleElement);
  
  // Add background
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  background.setAttribute('width', width);
  background.setAttribute('height', height);
  background.setAttribute('fill', '#f8f9fa');
  svg.appendChild(background);
  
  // Create groups for links, nodes, and labels
  const linksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  linksGroup.setAttribute('class', 'links');
  svg.appendChild(linksGroup);
  
  const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodesGroup.setAttribute('class', 'nodes');
  svg.appendChild(nodesGroup);
  
  const labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  labelsGroup.setAttribute('class', 'labels');
  svg.appendChild(labelsGroup);
  
  // Create simulation for node positioning
  const d3 = await getD3();
  const simulation = await createSimulation(graphData, layout, width, height, d3);
  
  // Run simulation to get node positions
  for (let i = 0; i < 300; ++i) simulation.tick();
  
  // Draw links
  graphData.links.forEach(link => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', link.source.x);
    line.setAttribute('y1', link.source.y);
    line.setAttribute('x2', link.target.x);
    line.setAttribute('y2', link.target.y);
    line.setAttribute('stroke', '#999');
    line.setAttribute('stroke-width', '1');
    linksGroup.appendChild(line);
  });
  
  // Draw nodes
  graphData.nodes.forEach(node => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', '5');
    circle.setAttribute('fill', '#69b3a2');
    nodesGroup.appendChild(circle);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x + 8);
    text.setAttribute('y', node.y + 3);
    text.setAttribute('class', 'label');
    text.textContent = node.label;
    labelsGroup.appendChild(text);
  });
  
  return svg.outerHTML;
}

/**
 * Enhanced PNG generation from graph data
 * @param {Object} graphData - Graph data with nodes and links
 * @param {Object} options - Visualization options including systemName
 * @returns {Buffer} PNG buffer
 */
async function generatePNG(graphData, options) {
  try {
    // Check if we should use the system-specific template visualizer
    if (options.systemName && options.useSystemTemplate) {
      // Generate system-specific visualization with templated summary
      const { enhancedSVGtoPNG } = require('./visualization-helpers');
      const { generateSystemSVG } = require('./system-template-visualizer');
      
      // Get correct parameters
      const width = options.width || 1200;
      const height = options.height || 900;
      const layout = options.layout || 'force';
      const style = options.style || 'default';
      const systemName = options.systemName;
      
      console.log(`Generating system-specific visualization for ${systemName} with layout ${layout} and style ${style}`);
      
      // Generate the system-specific SVG first
      const svgString = generateSystemSVG(
        systemName,
        null, // Let the function lookup the template
        width,
        height,
        layout,
        style
      );
      
      // Convert SVG to PNG directly without writing temp files
      const pngBuffer = await enhancedSVGtoPNG(svgString, {
        width: width,
        height: height,
        density: 300,
        message: 'UltraLink Graph Visualization',
        style: style,
        layout: layout,
        systemName: systemName
      });
      
      return pngBuffer;
    }
    
    // If not using system template, use the standard approach
    // Generate SVG first
    const svgString = await generateSVG(graphData, options);
    
    // Convert SVG to PNG using our enhanced function
    return await enhancedSVGtoPNG(svgString, {
      width: options.width || 800,
      height: options.height || 600,
      density: 300, // Higher density for better quality
      message: 'UltraLink Graph Visualization',
      style: options.style || 'default',  // Pass the style parameter
      layout: options.layout || 'force',  // Pass the layout parameter
      systemName: options.systemName || '' // Pass the system name
    });
  } catch (error) {
    console.error('Error generating PNG:', error);
    // Create a proper fallback PNG with a descriptive message
    return await createFallbackPNG(
      options.width || 800, 
      options.height || 600, 
      `UltraLink Visualization (${options.style || 'default'} style, ${options.layout || 'force'} layout)`
    );
  }
}

/**
 * Create a force-directed graph simulation
 * @param {Object} graphData - Graph data with nodes and links
 * @param {string} layout - Layout type (force, grid, radial)
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {Object} d3Instance - D3 instance to use (optional)
 * @returns {Object} D3 simulation
 */
async function createSimulation(graphData, layout, width, height, d3Instance = null) {
  try {
    // Get D3 instance
    const d3 = d3Instance || await getD3();
    
    // Sanitize graph data to ensure all nodes and links reference valid IDs
    // This prevents the "node not found" errors
    const sanitizedGraph = sanitizeGraphData(graphData);
    
    // Create simulation based on layout
    let simulation;
    
    switch (layout) {
      case 'grid':
        // Simple grid layout
        const gridSize = Math.ceil(Math.sqrt(sanitizedGraph.nodes.length));
        const cellWidth = width / gridSize;
        const cellHeight = height / gridSize;
        
        sanitizedGraph.nodes.forEach((node, i) => {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          node.x = (col + 0.5) * cellWidth;
          node.y = (row + 0.5) * cellHeight;
        });
        
        simulation = d3.forceSimulation(sanitizedGraph.nodes)
          .force('charge', d3.forceManyBody().strength(-30))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .stop();
        
        // Run the simulation in advance
        simulation.tick(100);
        break;
        
      case 'radial':
        // Radial layout
        const radius = Math.min(width, height) / 2 - 80;
        sanitizedGraph.nodes.forEach((node, i) => {
          const angle = (i / sanitizedGraph.nodes.length) * 2 * Math.PI;
          node.x = width / 2 + radius * Math.cos(angle);
          node.y = height / 2 + radius * Math.sin(angle);
        });
        
        simulation = d3.forceSimulation(sanitizedGraph.nodes)
          .force('charge', d3.forceManyBody().strength(-50))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .stop();
        
        // Run the simulation in advance
        simulation.tick(50);
        break;
        
      case 'force':
      default:
        // Force-directed layout
        simulation = d3.forceSimulation(sanitizedGraph.nodes)
          .force('charge', d3.forceManyBody().strength(-300))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('link', d3.forceLink(sanitizedGraph.links).id(d => d.id).distance(100))
          .force('x', d3.forceX(width / 2).strength(0.1))
          .force('y', d3.forceY(height / 2).strength(0.1))
          .stop();
        
        // Run the simulation in advance
        simulation.tick(300);
        break;
    }
    
    return simulation;
  } catch (error) {
    console.error('Error creating simulation:', error);
    // Return a minimal simulation with default positions
    return {
      nodes: graphData.nodes.map(node => ({
        ...node,
        x: width / 2 + (Math.random() - 0.5) * width / 2,
        y: height / 2 + (Math.random() - 0.5) * height / 2
      })),
      links: graphData.links
    };
  }
}

/**
 * Sanitize graph data to ensure all links reference valid nodes
 * This helps prevent "node not found" errors in D3 force layouts
 * @param {Object} graphData - Original graph data
 * @returns {Object} Sanitized graph data
 */
function sanitizeGraphData(graphData) {
  // Create a map of node IDs for quick lookup
  const nodeMap = new Map();
  graphData.nodes.forEach(node => {
    nodeMap.set(node.id, node);
  });
  
  // Filter out links that reference non-existent nodes
  const validLinks = graphData.links.filter(link => {
    // Check if source and target IDs exist in the nodes array
    const sourceExists = typeof link.source === 'object' || nodeMap.has(link.source);
    const targetExists = typeof link.target === 'object' || nodeMap.has(link.target);
    return sourceExists && targetExists;
  });
  
  // Ensure all links use string IDs, not object references
  const sanitizedLinks = validLinks.map(link => ({
    ...link,
    source: typeof link.source === 'object' ? link.source.id : link.source,
    target: typeof link.target === 'object' ? link.target.id : link.target
  }));
  
  return {
    nodes: graphData.nodes,
    links: sanitizedLinks
  };
}

/**
 * Generate D3.js visualization code
 * 
 * @param {Object} graphData - Network graph data
 * @param {Object} options - Visualization options
 * @returns {string} D3.js code as string
 */
async function generateD3(graphData, options) {
  const { layout = 'force', style = 'default', width = 800, height = 600 } = options;
  
  try {
    // Create a JSON representation of the graph data
    const graphDataJSON = JSON.stringify(graphData, null, 2);
    
    // Create HTML template with D3.js code
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>D3.js Visualization</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    html, body { margin: 0; height: 100%; overflow: hidden; }
    #graph { width: 100%; height: 100%; }
    .node { cursor: pointer; }
    .link { stroke: #999; stroke-opacity: 0.6; }
  </style>
</head>
<body>
  <div id="graph"></div>
  <script>
    const data = ${graphDataJSON};
    
    // Create SVG
    const svg = d3.select('#graph')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, ${width}, ${height}]);
      
    // Add background
    svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', '#f8f9fa');
      
    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(${width/2}, ${height/2}))
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(100));
      
    // Create links
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);
      
    // Create nodes
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 8)
      .attr('fill', '#69b3a2')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
        
    // Add node labels
    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(data.nodes)
      .enter().append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '10px')
      .text(d => d.label || d.id);
      
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
        
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
        
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y + 20);
    });
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  </script>
</body>
</html>`;
    
    return html;
  } catch (error) {
    console.error('Error generating D3 visualization:', error);
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>D3.js Visualization Error</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div id="error" style="text-align: center; margin-top: 100px;">
    <h1>Visualization Error</h1>
    <p>${error.message || 'Unknown error'}</p>
  </div>
</body>
</html>`;
  }
}

/**
 * Generate a Cytoscape.js visualization
 * 
 * @param {Object} graphData - The graph data to visualize
 * @param {Object} options - Visualization options
 * @returns {string} HTML content with Cytoscape.js visualization
 */
function generateCytoscape(graphData, options) {
  const { width = 800, height = 600 } = options;
  
  try {
    // Ensure graphData has nodes and links
    if (!graphData || !graphData.nodes || !graphData.links) {
      throw new Error('Invalid graph data structure');
    }
    
    // Ensure all nodes have a type property
    graphData.nodes.forEach(node => {
      if (!node.type) {
        node.type = 'default';
      }
    });
    
    const elements = {
      nodes: graphData.nodes.map(node => ({
        data: {
          id: node.id,
          label: node.label || node.id,
          type: node.type
        }
      })),
      edges: graphData.links.map(link => ({
        data: {
          id: `${link.source}-${link.target}`,
          source: link.source,
          target: link.target,
          type: link.type || 'default'
        }
      }))
    };
    
    // Create a minimal HTML template for Cytoscape
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cytoscape.js Visualization</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js"></script>
  <style>
    html, body { margin: 0; height: 100%; overflow: hidden; }
    #cy { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="cy"></div>
  <script>
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: ${JSON.stringify(elements)},
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#95A5A6',
            'label': 'data(label)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc'
          }
        }
      ]
    });
  </script>
</body>
</html>`;
  } catch (error) {
    console.error('Error generating Cytoscape visualization:', error);
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cytoscape.js Visualization</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js"></script>
</head>
<body>
  <div id="cy"></div>
  <script>
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: { nodes: [], edges: [] },
      style: []
    });
  </script>
</body>
</html>`;
  }
}

/**
 * Escape XML special characters
 * 
 * @param {string} unsafe - Unsafe string that may contain XML special characters
 * @returns {string} Safe string with escaped XML special characters
 */
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate fallback visualization when rendering fails
 * @param {string} format - Visualization format
 * @param {string} systemName - System name
 * @param {number} width - Width of the visualization
 * @param {number} height - Height of the visualization
 * @returns {Object} Fallback visualization content
 */
function generateFallbackVisualization(format, name, width, height) {
  const fallbackSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <style>
      text { font-family: sans-serif; }
      .title { font-size: 24px; fill: #333; }
      .subtitle { font-size: 14px; fill: #666; }
    </style>
    <rect width="100%" height="100%" fill="#f8f9fa"/>
    <text x="50%" y="45%" class="title" text-anchor="middle">Visualization Fallback</text>
    <text x="50%" y="55%" class="subtitle" text-anchor="middle">Unable to generate ${format} visualization for ${name}</text>
  </svg>`;

  switch (format.toLowerCase()) {
    case 'svg':
      return { 'graph.svg': fallbackSVG };
    case 'png':
      // Return 1x1 transparent PNG as fallback
      return { 'graph.png': Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64') };
    case 'd3':
      const fallbackD3 = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>D3.js Visualization Fallback</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div style="text-align: center; margin-top: 100px;">
    <h1>Visualization Fallback</h1>
    <p>Unable to generate D3 visualization for ${name}</p>
  </div>
</body>
</html>`;
      return { 'graph-d3.html': fallbackD3 };
    case 'cytoscape':
      const fallbackCytoscape = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cytoscape.js Visualization Fallback</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js"></script>
</head>
<body>
  <div style="text-align: center; margin-top: 100px;">
    <h1>Visualization Fallback</h1>
    <p>Unable to generate Cytoscape visualization for ${name}</p>
  </div>
</body>
</html>`;
      return { 'graph-cytoscape.html': fallbackCytoscape };
    default:
      return { 'graph.txt': `Unable to generate ${format} visualization for ${name}` };
  }
}

module.exports = { toVisualization }; 