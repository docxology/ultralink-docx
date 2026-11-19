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
 * - Fixed D3 and Cytoscape output to return proper HTML content
 * - Added proper object structure for visualization returns
 * - Enhanced PNG generation with better quality and error handling
 *
 * Dependencies:
 * - d3: Force positioning for headless SVG
 * - sharp: Optional, needed for PNG generation
 * 
 * @param {Object} ultralink - UltraLink instance
 * @param {Object} options - Configuration options for the export
 * @param {string} [options.format='svg'] - Output format ('svg', 'png', 'd3', 'cytoscape')
 * @param {string} [options.layout='force-directed'] - Layout algorithm to use
 * @param {string} [options.style='default'] - Visual styling to apply
 * @param {number} [options.width=800] - Visualization width
 * @param {number} [options.height=600] - Visualization height
 * @param {boolean} [options.throwOnError=false] - Surface generation errors instead of returning fallback visualization content
 * @returns {Object} Object containing visualization files
 */
// Use dynamic import for d3 (ES Module)
// We'll import d3 dynamically when needed
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

function getGraphData(ultralink) {
  return {
    nodes: Array.from(ultralink.entities.values(), ({ id, type, attributes }) => ({
      id, type, label: attributes.name || attributes.title || id, attributes
    })),
    links: Array.from(ultralink.relationships.values(), ({ source, target, type, attributes }) => ({
      source, target, type, attributes
    }))
  };
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
  const { throwOnError } = options;
  
  try {
    const graphData = getGraphData(ultralink);
    
    // Generate visualization in the requested format
    try {
      switch (format.toLowerCase()) {
        case 'svg':
          return { 'graph.svg': await generateSVG(graphData, { layout, style, width, height }) };
        case 'png':
          const result = {};
          const pngOptions = { layout, style, width, height, systemName, throwOnError };
          result['graph.png'] = await generatePNG(graphData, pngOptions);
          if (layout === 'radial' || layout === 'grid' || layout === 'cluster') {
            result[`graph-${layout}.png`] = await generatePNG(graphData, pngOptions);
          }
          return result;
        case 'd3':
          const d3Html = await generateD3(graphData, { layout, style, width, height, throwOnError });
          return { 'graph-d3.html': d3Html };
        case 'cytoscape':
          const cytoHtml = generateCytoscape(graphData, { layout, style, width, height, throwOnError });
          return { 'graph-cytoscape.html': cytoHtml };
        default:
          console.warn(`Unsupported visualization format: ${format}, using fallback`);
          return generateFallbackVisualization(format, ultralink.name || 'UltraLink', width, height);
      }
    } catch (error) {
      if (throwOnError) throw error;
      console.error(`Error generating ${format} visualization:`, error);
      return generateFallbackVisualization(format, ultralink.name || 'UltraLink', width, height);
    }
  } catch (error) {
    if (throwOnError) throw error;
    console.error('Error preparing graph data:', error);
    return generateFallbackVisualization(format, ultralink.name || 'UltraLink', width, height);
  }
}

async function generateSVG(graphData, options) {
  const { layout } = options;
  const d3 = layout === 'grid' || layout === 'radial' ? null : await getD3();
  return renderSVG(graphData, options, d3);
}

// Full Blob stays synchronous, sharing the SVG renderer with its grid layout.
function toGridSVG(ultralink) {
  return renderSVG(getGraphData(ultralink), { layout: 'grid' });
}

function renderSVG(graphData, { layout = 'force', width = 800, height = 600 }, d3) {
  // Resolve edge endpoints to the exact node objects that receive positions.
  const nodesById = new Map();
  for (const node of graphData.nodes) nodesById.set(node.id, node);
  const links = [];
  for (const link of graphData.links) {
    const source = nodesById.get(link.source);
    const target = nodesById.get(link.target);
    if (source && target) links.push({ source, target });
  }
  positionNodes(graphData.nodes, links, layout, width, height, d3);

  const w = escapeXML(width);
  const h = escapeXML(height);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0,0,${w},${h}">
<style>
  .node { cursor: pointer; }
  .link { stroke: #999; stroke-opacity: 0.6; }
  .label { font-family: sans-serif; font-size: 10px; }
</style>
<rect width="100%" height="100%" fill="#f8f9fa"/>
<g class="links">`;
  for (const { source, target } of links) {
    svg += `<line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" stroke="#999" stroke-width="1"/>`;
  }
  svg += '</g><g class="nodes">';
  for (const { x, y } of graphData.nodes) {
    svg += `<circle cx="${x}" cy="${y}" r="5" fill="#69b3a2"/>`;
  }
  svg += '</g><g class="labels">';
  for (const { x, y, label } of graphData.nodes) {
    svg += `<text x="${x + 8}" y="${y + 3}" class="label">${escapeXML(label)}</text>`;
  }
  return svg + '</g></svg>';
}

const XML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
function escapeXML(value) {
  return String(value).replace(/[&<>"]/g, character => XML_ENTITIES[character]);
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
        systemName: systemName,
        throwOnError: options.throwOnError
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
      systemName: options.systemName || '', // Pass the system name
      throwOnError: options.throwOnError
    });
  } catch (error) {
    if (options.throwOnError) throw error;
    console.error('Error generating PNG:', error);
    // Create a proper fallback PNG with a descriptive message
    return await createFallbackPNG(
      options.width || 800, 
      options.height || 600, 
      `UltraLink Visualization (${options.style || 'default'} style, ${options.layout || 'force'} layout)`
    );
  }
}

// D3's force layout mutates node positions. Grid and radial positions are exact.
function positionNodes(nodes, links, layout, width, height, d3) {
  if (layout === 'grid') {
    const columns = Math.ceil(Math.sqrt(nodes.length));
    const cellWidth = width / columns;
    const cellHeight = height / columns;
    nodes.forEach((node, index) => {
      node.x = (index % columns + 0.5) * cellWidth;
      node.y = (Math.floor(index / columns) + 0.5) * cellHeight;
    });
  } else if (layout === 'radial') {
    const radius = Math.max(0, Math.min(width, height) / 2 - 80);
    nodes.forEach((node, index) => {
      const angle = index * 2 * Math.PI / nodes.length;
      node.x = width / 2 + radius * Math.cos(angle);
      node.y = height / 2 + radius * Math.sin(angle);
    });
  } else {
    d3.forceSimulation(nodes)
      .stop()
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(links).distance(100))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .tick(300);
  }
}

/**
 * Generate D3.js visualization code
 * 
 * @param {Object} graphData - Network graph data
 * @param {Object} options - Visualization options
 * @returns {string} D3.js code as string
 */
async function generateD3(graphData, options) {
  const { width = 800, height = 600, throwOnError } = options;
  
  try {
    // Create a JSON representation of the graph data
    const graphDataJSON = JSON.stringify(graphData, null, 2);
    
    // Create HTML template with D3.js code
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>D3.js Visualization</title>
  <script src="https://cdn.jsdelivr.net/npm/d3@7.9.2/dist/d3.min.js" integrity="sha384-LxfWGZyh6PaLjBRPf7NWiEYs9Mn0UQ6ZmqbLLZhxlOBBNWF2a2K0Pfc5efkrNnhQ" crossorigin="anonymous"></script>
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
    if (throwOnError) throw error;
    console.error('Error generating D3 visualization:', error);
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>D3.js Visualization Error</title>
  <script src="https://cdn.jsdelivr.net/npm/d3@7.9.2/dist/d3.min.js" integrity="sha384-LxfWGZyh6PaLjBRPf7NWiEYs9Mn0UQ6ZmqbLLZhxlOBBNWF2a2K0Pfc5efkrNnhQ" crossorigin="anonymous"></script>
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
  const { width = 800, height = 600, throwOnError } = options;
  
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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js" integrity="sha384-Q20qNhd/ak9c9XLRBwy3jG/XxBWAdfQNYkZ0bYCKxx/9iI9bUVYvLzOf7lviiPKW" crossorigin="anonymous"></script>
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
    if (throwOnError) throw error;
    console.error('Error generating Cytoscape visualization:', error);
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cytoscape.js Visualization</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js" integrity="sha384-Q20qNhd/ak9c9XLRBwy3jG/XxBWAdfQNYkZ0bYCKxx/9iI9bUVYvLzOf7lviiPKW" crossorigin="anonymous"></script>
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
  <script src="https://cdn.jsdelivr.net/npm/d3@7.9.2/dist/d3.min.js" integrity="sha384-LxfWGZyh6PaLjBRPf7NWiEYs9Mn0UQ6ZmqbLLZhxlOBBNWF2a2K0Pfc5efkrNnhQ" crossorigin="anonymous"></script>
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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js" integrity="sha384-Q20qNhd/ak9c9XLRBwy3jG/XxBWAdfQNYkZ0bYCKxx/9iI9bUVYvLzOf7lviiPKW" crossorigin="anonymous"></script>
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

module.exports = { toVisualization, toGridSVG };
