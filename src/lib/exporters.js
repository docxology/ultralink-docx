/**
 * Exporters - Export UltraLink data to various formats
 * 
 * This module provides functions to export UltraLink data to different formats,
 * such as JSON, CSV, GraphML, Obsidian, HTML, KIF, and more.
 */

const zlib = require('zlib');

/**
 * Export to JSON format
 * @param {Object} options - Export options
 * @param {boolean} options.pretty - Whether to format the JSON with indentation
 * @param {boolean} options.includeMetadata - Whether to include metadata fields
 * @param {boolean} options.asString - Whether to return as a string or object
 * @param {boolean} options.includeVectors - Whether to include vector data
 * @returns {Object|string} JSON object or string
 */
function toJSON(options = {}) {
  const {
    pretty = true,
    includeMetadata = true,
    asString = true,
    includeVectors = false
  } = options;

  // Initialize result object
  const result = {
    entities: [],
    relationships: []
  };

  // Add entities
  for (const [id, entity] of this.entities.entries()) {
    const jsonEntity = {
      id,
      type: entity.type,
      attributes: entity.attributes instanceof Map ? Object.fromEntries(entity.attributes) : entity.attributes
    };

    // Add metadata if requested
    if (includeMetadata && entity.metadata) {
      jsonEntity.metadata = { ...entity.metadata };
    }

    // Add vector data if requested and available
    if (includeVectors && entity.vector) {
      jsonEntity.vector = Array.from(entity.vector);
    }

    result.entities.push(jsonEntity);
  }

  // Add relationships
  for (const [id, relationship] of this.relationships.entries()) {
    const jsonRelationship = {
      id,
      source: relationship.source,
      target: relationship.target,
      type: relationship.type,
      attributes: relationship.attributes instanceof Map ? Object.fromEntries(relationship.attributes) : relationship.attributes
    };

    // Add metadata if requested
    if (includeMetadata && relationship.metadata) {
      jsonRelationship.metadata = { ...relationship.metadata };
    }

    result.relationships.push(jsonRelationship);
  }

  return asString ? JSON.stringify(result, null, pretty ? 2 : 0) : result;
}

/**
 * Export to CSV format
 * @param {Object} options - Export options
 * @param {boolean} options.includeHeaders - Whether to include header row
 * @param {string} options.delimiter - Delimiter character for CSV
 * @param {boolean} options.includeMetadata - Whether to include metadata columns
 * @returns {Object} CSV data for entities and relationships
 */
function toCSV(options = {}) {
  const {
    includeHeaders = true,
    delimiter = ',',
    includeMetadata = false
  } = options;

  // Collect all possible entity attributes for headers
  const entityAttributes = new Set(['name', 'title']);
  const entityTypes = new Set();

  for (const entity of this.entities.values()) {
    entityTypes.add(entity.type);

    for (const attrName of Object.keys(entity.attributes)) {
      entityAttributes.add(attrName);
    }
  }

  // Collect all possible relationship attributes for headers
  const relationshipAttributes = new Set(['weight', 'strength']);
  const relationshipTypes = new Set();

  for (const relationship of this.relationships.values()) {
    relationshipTypes.add(relationship.type);

    for (const attrName of Object.keys(relationship.attributes)) {
      relationshipAttributes.add(attrName);
    }
  }

  // Create entities CSV
  let entitiesCsv = '';

  // Add header row if requested
  if (includeHeaders) {
    entitiesCsv += `id${delimiter}type`;

    // Add attribute columns
    for (const attr of entityAttributes) {
      entitiesCsv += `${delimiter}${attr}`;
    }

    // Add metadata columns if requested
    if (includeMetadata) {
      entitiesCsv += `${delimiter}created${delimiter}modified`;
    }

    entitiesCsv += '\n';
  }

  // Add entity rows
  for (const entity of this.entities.values()) {
    entitiesCsv += `${this._escapeCSV(entity.id)}${delimiter}${this._escapeCSV(entity.type)}`;

    // Add attribute values
    for (const attr of entityAttributes) {
      const value = entity.attributes[attr] || '';
      entitiesCsv += `${delimiter}${this._escapeCSV(value)}`;
    }

    // Add metadata if requested
    if (includeMetadata) {
      const created = entity.metadata?.created || '';
      const modified = entity.metadata?.modified || '';
      entitiesCsv += `${delimiter}${this._escapeCSV(created)}${delimiter}${this._escapeCSV(modified)}`;
    }

    entitiesCsv += '\n';
  }

  // Create relationships CSV
  let relationshipsCsv = '';

  // Add header row if requested
  if (includeHeaders) {
    relationshipsCsv += `source${delimiter}target${delimiter}type`;

    // Add attribute columns
    for (const attr of relationshipAttributes) {
      relationshipsCsv += `${delimiter}${attr}`;
    }

    // Add metadata columns if requested
    if (includeMetadata) {
      relationshipsCsv += `${delimiter}created${delimiter}modified`;
    }

    relationshipsCsv += '\n';
  }

  // Add relationship rows
  for (const relationship of this.relationships.values()) {
    relationshipsCsv += `${this._escapeCSV(relationship.source)}${delimiter}${this._escapeCSV(relationship.target)}${delimiter}${this._escapeCSV(relationship.type)}`;

    // Add attribute values
    for (const attr of relationshipAttributes) {
      const value = relationship.attributes[attr] || '';
      relationshipsCsv += `${delimiter}${this._escapeCSV(value)}`;
    }

    // Add metadata if requested
    if (includeMetadata) {
      const created = relationship.metadata?.created || '';
      const modified = relationship.metadata?.modified || '';
      relationshipsCsv += `${delimiter}${this._escapeCSV(created)}${delimiter}${this._escapeCSV(modified)}`;
    }

    relationshipsCsv += '\n';
  }

  return {
    entities: entitiesCsv,
    relationships: relationshipsCsv
  };
}

/**
 * Export to GraphML format
 * @param {Object} options - Export options
 * @param {boolean} options.includeAllAttributes - Whether to include all entity attributes
 * @param {boolean} options.prettyPrint - Whether to format the XML with indentation
 * @param {string} options.graphName - Name to use for the graph
 * @returns {string} GraphML document as string
 */
function toGraphML(options = {}) {
  const {
    includeAllAttributes = false,
    prettyPrint = true,
    graphName = 'G'
  } = options;

  // Collect all possible entity and relationship attributes
  const nodeAttributeKeys = new Set(['name', 'type']);
  const edgeAttributeKeys = new Set(['type']);

  // If we include all attributes, we need to scan for them first
  if (includeAllAttributes) {
    for (const entity of this.entities.values()) {
      for (const key of Object.keys(entity.attributes)) {
        nodeAttributeKeys.add(key);
      }
    }

    for (const rel of this.relationships.values()) {
      for (const key of Object.keys(rel.attributes)) {
        edgeAttributeKeys.add(key);
      }
    }
  }

  // Start constructing the GraphML
  let graphml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  graphml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns"\n';
  graphml += '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  graphml += '    xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns\n';
  graphml += '     http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">\n';

  // Define attribute keys for nodes
  for (const key of nodeAttributeKeys) {
    graphml += `  <key id="${key}" for="node" attr.name="${key}" attr.type="string"/>\n`;
  }

  // Define attribute keys for edges
  for (const key of edgeAttributeKeys) {
    graphml += `  <key id="${key}" for="edge" attr.name="${key}" attr.type="string"/>\n`;
  }

  // Start the graph
  graphml += `  <graph id="${graphName}" edgedefault="directed">\n`;

  // Add nodes
  for (const entity of this.entities.values()) {
    graphml += `    <node id="${this._escapeXML(entity.id)}">\n`;

    // Add node attributes
    graphml += `      <data key="type">${this._escapeXML(entity.type)}</data>\n`;

    if (entity.attributes.name) {
      graphml += `      <data key="name">${this._escapeXML(entity.attributes.name)}</data>\n`;
    }

    // Add all attributes if requested
    if (includeAllAttributes) {
      for (const [key, value] of Object.entries(entity.attributes)) {
        if (key === 'name') continue; // Already handled above

        // Convert value to string and escape XML entities
        const xmlValue = this._escapeXML(String(value));
        graphml += `      <data key="${key}">${xmlValue}</data>\n`;
      }
    }

    graphml += '    </node>\n';
  }

  // Add edges
  for (const rel of this.relationships.values()) {
    graphml += `    <edge source="${this._escapeXML(rel.source)}" target="${this._escapeXML(rel.target)}">\n`;

    // Add edge type
    graphml += `      <data key="type">${this._escapeXML(rel.type)}</data>\n`;

    // Add all attributes if requested
    if (includeAllAttributes) {
      for (const [key, value] of Object.entries(rel.attributes)) {
        // Convert value to string and escape XML entities
        const xmlValue = this._escapeXML(String(value));
        graphml += `      <data key="${key}">${xmlValue}</data>\n`;
      }
    }

    graphml += '    </edge>\n';
  }

  // Close the graph and GraphML
  graphml += '  </graph>\n';
  graphml += '</graphml>';

  return graphml;
}

/**
 * Export to Obsidian markdown format
 * @param {Object} options - Export options
 * @param {boolean} options.backlinks - Whether to include backlinks section
 * @param {boolean} options.includeMetadata - Whether to include metadata in frontmatter
 * @param {boolean} options.includeAttributes - Whether to include attributes
 * @param {string} options.folderPath - Path for the folder in Obsidian vault
 * @param {boolean} options.groupByType - Whether to group relationships by type
 * @returns {Object} Object with keys as filenames and values as markdown content
 */
function toObsidian(options = {}) {
  const {
    backlinks = true,
    includeMetadata = true,
    includeAttributes = true,
    folderPath = '',
    groupByType = true
  } = options;

  const files = {};

  // Process each entity
  for (const entity of this.entities.values()) {
    let content = '';

    // Add metadata section (YAML frontmatter)
    if (includeMetadata) {
      content += '---\n';
      content += `type: ${entity.type}\n`;
      content += `id: ${entity.id}\n`;
      
      if (entity.metadata) {
        content += `created: ${entity.metadata.created}\n`;
        content += `modified: ${entity.metadata.modified}\n`;
      }
      
      content += '---\n\n';
    }

    // Add title section
    const name = entity.attributes.name || entity.attributes.title || entity.id;
    content += `# ${name}\n\n`;

    // Add type and ID information
    content += `**Type**: ${entity.type}\n`;
    content += `**ID**: ${entity.id}\n\n`;

    // Add attributes section
    if (includeAttributes && Object.keys(entity.attributes).length > 0) {
      content += '## Attributes\n\n';
      
      for (const [key, value] of Object.entries(entity.attributes)) {
        if (key !== 'name' && key !== 'title') { // Skip name as it's already in the title
          const formattedValue = typeof value === 'object' 
            ? JSON.stringify(value) 
            : value;
            
          content += `- **${key}**: ${formattedValue}\n`;
        }
      }
      content += '\n';
    }

    // Add relationships section
    const outgoing = this.getRelationships(entity.id, { direction: 'outgoing' });
    
    if (outgoing.length > 0) {
      content += '## Relationships\n\n';
      
      if (groupByType) {
        // Group by relationship type
        const relationshipsByType = {};
        
        for (const rel of outgoing) {
          if (!relationshipsByType[rel.type]) {
            relationshipsByType[rel.type] = [];
          }
          relationshipsByType[rel.type].push(rel);
        }
        
        // Add each relationship type
        for (const [type, relations] of Object.entries(relationshipsByType)) {
          content += `### ${type}\n\n`;
          
          for (const rel of relations) {
            const targetEntity = this.entities.get(rel.target);
            const targetName = targetEntity?.attributes?.name || targetEntity?.attributes?.title || rel.target;
            
            content += `- [[${rel.target}|${targetName}]]`;
            
            // Add attributes if present
            if (Object.keys(rel.attributes).length > 0) {
              content += ' (';
              const attrParts = [];
              
              for (const [key, value] of Object.entries(rel.attributes)) {
                attrParts.push(`${key}: ${value}`);
              }
              
              content += attrParts.join(', ');
              content += ')';
            }
            
            content += '\n';
          }
          
          content += '\n';
        }
      } else {
        // List all relationships without grouping
        for (const rel of outgoing) {
          const targetEntity = this.entities.get(rel.target);
          const targetName = targetEntity?.attributes?.name || targetEntity?.attributes?.title || rel.target;
          
          content += `- **${rel.type}** → [[${rel.target}|${targetName}]]`;
          
          // Add attributes if present
          if (Object.keys(rel.attributes).length > 0) {
            content += ' (';
            const attrParts = [];
            
            for (const [key, value] of Object.entries(rel.attributes)) {
              attrParts.push(`${key}: ${value}`);
            }
            
            content += attrParts.join(', ');
            content += ')';
          }
          
          content += '\n';
        }
        
        content += '\n';
      }
    }

    // Add backlinks section
    if (backlinks) {
      const incoming = this.getRelationships(entity.id, { direction: 'incoming' });
      
      if (incoming.length > 0) {
        content += '## Backlinks\n\n';
        
        if (groupByType) {
          // Group by source entity
          const backlinksBySource = {};
          
          for (const rel of incoming) {
            if (!backlinksBySource[rel.source]) {
              backlinksBySource[rel.source] = [];
            }
            backlinksBySource[rel.source].push(rel);
          }
          
          // Add each backlink
          for (const [sourceId, links] of Object.entries(backlinksBySource)) {
            const sourceEntity = this.entities.get(sourceId);
            const sourceName = sourceEntity?.attributes?.name || sourceEntity?.attributes?.title || sourceId;
            
            content += `- [[${sourceId}|${sourceName}]]`;
            
            if (links.length > 1) {
              content += ' (';
              const relationTypes = links.map(link => link.type);
              content += relationTypes.join(', ');
              content += ')';
            } else {
              content += ` (${links[0].type})`;
            }
            
            content += '\n';
          }
        } else {
          // List all backlinks without grouping
          for (const rel of incoming) {
            const sourceEntity = this.entities.get(rel.source);
            const sourceName = sourceEntity?.attributes?.name || sourceEntity?.attributes?.title || rel.source;
            
            content += `- [[${rel.source}|${sourceName}]] → **${rel.type}**\n`;
          }
        }
        
        content += '\n';
      }
    }

    // Add file to output
    const filePath = folderPath ? `${folderPath}/${entity.id}.md` : `${entity.id}.md`;
    files[filePath] = content;
  }

  return files;
}

/**
 * Export to HTML website
 * @param {Object} options - Export options
 * @param {string} options.title - Website title
 * @param {string} options.description - Website description
 * @param {string} options.theme - Theme name ('dark', 'light', 'academic', 'ocean')
 * @param {boolean} options.includeSearch - Whether to include search functionality
 * @returns {Object} HTML files for website
 */
function toHTMLWebsite(options = {}) {
  const {
    title = 'Knowledge Graph',
    description = 'Interactive visualization of relationships',
    theme = 'default',
    includeSearch = true
  } = options;

  // Define theme variables
  const themes = {
    dark: {
      background: '#202124',
      text: '#e8eaed',
      link: '#4a9eff',
      accent: '#666666',
      border: '#333333',
      text_color: '#e8eaed',
      bg_color: '#202124',
      background_rgba: 'rgba(32, 33, 36, 0.8)'
    },
    light: {
      background: '#ffffff', 
      text: '#000000',
      link: '#0066cc',
      accent: '#666666',
      border: '#dddddd',
      text_color: '#000000',
      bg_color: '#ffffff'
    },
    academic: {
      background: '#f5f5f5',
      text: '#333333', 
      link: '#990000',
      accent: '#666666',
      border: '#cccccc',
      fontFamily: '\'Palatino Linotype\', serif',
      'background-color': '#7b1fa2',
      text_color: '#333333',
      bg_color: '#f5f5f5'
    },
    ocean: {
      background: '#f0f8ff',
      text: '#333333',
      link: '#006699',
      accent: '#4a9eff',
      border: '#b3d9ff',
      text_color: '#333333',
      bg_color: '#f0f8ff'
    },
    default: {
      background: '#ffffff',
      text: '#000000',
      link: '#0066cc',
      accent: '#666666',
      border: '#dddddd',
      text_color: '#000000',
      bg_color: '#ffffff'
    }
  };

  const themeVars = themes[theme] || themes.default;
  const files = {};

  // Generate index.html
  const indexHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${theme === 'academic' ? '<link rel="stylesheet" href="styles/academic.css">' : ''}
  <style>
    :root {
      --background: ${themeVars.background};
      --text: ${themeVars.text};
      --link: ${themeVars.link};
      --accent: ${themeVars.accent};
      --border: ${themeVars.border};
      --text-color: ${themeVars.text_color};
      --bg-color: ${themeVars.bg_color};
    }
    body {
      font-family: ${themeVars.fontFamily || 'system-ui, -apple-system, sans-serif'};
      margin: 0;
      padding: 0;
      background: var(--background);
      color: var(--text);
      ${theme === 'dark' ? 'background: rgba(32, 33, 36, 0.8);' : ''}
    }
    .container {
      display: grid;
      grid-template-columns: 300px 1fr;
      height: 100vh;
    }
    .sidebar {
      padding: 20px;
      border-right: 1px solid var(--border);
      overflow-y: auto;
    }
    .main {
      padding: 20px;
      overflow-y: auto;
    }
    h1, h2, h3, h4 {
      color: var(--text);
      margin-top: 0;
    }
    a {
      color: var(--link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .entity-list {
      list-style: none;
      padding: 0;
    }
    .entity-item {
      padding: 8px;
      margin: 4px 0;
      border: 1px solid var(--border);
      border-radius: 4px;
    }
    .entity-type {
      color: var(--accent);
      font-size: 0.9em;
    }
    #graph {
      width: 100%;
      height: 600px;
      border: 1px solid var(--border);
      border-radius: 4px;
    }
    .search-box {
      margin-bottom: 20px;
    }
    #search-input {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--background);
      color: var(--text);
    }
    .zoom-controls {
      position: absolute;
      top: 20px;
      right: 20px;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 5px;
      z-index: 100;
    }
    .zoom-btn {
      width: 30px;
      height: 30px;
      margin: 2px;
      border: 1px solid var(--border);
      background: var(--background);
      color: var(--text);
      cursor: pointer;
      border-radius: 3px;
    }
    .zoom-btn:hover {
      background: var(--border);
    }
    .btn {
      padding: 8px 12px;
      margin-top: 8px;
      border: 1px solid var(--border);
      background: var(--background);
      color: var(--text);
      cursor: pointer;
      border-radius: 4px;
      display: block;
      width: 100%;
    }
    .btn:hover {
      background: var(--border);
    }
    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
        flex-direction: column;
      }
      .sidebar {
        border-right: none;
        border-bottom: 1px solid var(--border);
      }
    }
  </style>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <h2>${title}</h2>
      <p>${description}</p>
      ${includeSearch ? `
      <div class="search-box">
        <input type="text" id="search-input" placeholder="Search entities..." />
        <button class="btn" id="clear-filters">Clear Filters</button>
      </div>
      
      <div class="type-filters" id="type-filters">
        <h4>Filter by Type</h4>
        ${Array.from(new Set(Array.from(this.entities.values()).map(e => e.type))).map(type => `
          <label>
            <input type="checkbox" data-type="${type}" checked> ${type}
          </label>
        `).join('')}
      </div>
      ` : ''}
      <h3>Entities</h3>
      <ul class="entity-list" id="entity-list">
        ${Array.from(this.entities.values()).map(entity => `
          <li class="entity-item" data-id="${entity.id}" data-type="${entity.type}">
            <a href="${entity.id}.html">
              ${entity.attributes.name || entity.attributes.title || entity.id}
            </a>
            <a href="javascript:void(0)" onclick="selectEntityById('${entity.id}')" class="select-link" title="Select in graph">(select)</a>
            <div class="entity-type">${entity.type}</div>
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="main">
      <div class="zoom-controls">
        <button class="zoom-btn" id="zoom-in">+</button>
        <button class="zoom-btn" id="zoom-reset">⟳</button>
        <button class="zoom-btn" id="zoom-out">−</button>
      </div>
      <div id="graph"></div>
      <script>
        // Graph visualization code
        const data = {
          nodes: [
            ${Array.from(this.entities.values()).map(entity => {
              const name = entity.attributes.name || entity.attributes.title || entity.id;
              const attrs = entity.attributes instanceof Map ? 
                Object.fromEntries(entity.attributes.entries()) : 
                { ...entity.attributes } || {};
              
              return `{
                "id": "${entity.id}",
                "name": "${name.replace(/"/g, '\\"')}",
                "type": "${entity.type}",
                "attributes": ${JSON.stringify(attrs)}
              }`;
            }).join(',\n            ')}
          ],
          links: [
            ${Array.from(this.relationships.values()).map(rel => 
              `{
                "source": "${rel.source}",
                "target": "${rel.target}",
                "type": "${rel.type}"
              }`
            ).join(',\n            ')}
          ]
        };

        const width = document.getElementById('graph').clientWidth;
        const height = 600;

        const simulation = d3.forceSimulation(data.nodes)
          .force('link', d3.forceLink(data.links).id(d => d.id))
          .force('charge', d3.forceManyBody().strength(-100))
          .force('center', d3.forceCenter(width / 2, height / 2));

        const svg = d3.select('#graph')
          .append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', [0, 0, width, height])
          .attr('preserveAspectRatio', 'xMidYMid meet');

        const link = svg.append('g')
          .selectAll('line')
          .data(data.links)
          .join('line')
          .attr('stroke', 'var(--border)')
          .attr('stroke-width', 1);

        const node = svg.append('g')
          .selectAll('circle')
          .data(data.nodes)
          .join('circle')
          .attr('r', 5)
          .attr('fill', 'var(--link)')
          .call(drag(simulation));

        node.append('title')
          .text(d => {
            const name = d.attributes.name || d.attributes.title || d.id;
            return name;
          });

        simulation.on('tick', () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        });

        // Entity selection functionality
        window.selectEntityById = (id) => {
          // Find the selected node
          const selectedNode = data.nodes.find(n => n.id === id);
          if (!selectedNode) return;
          
          // Reset all nodes
          node.attr('r', 5).attr('stroke', null);
          
          // Highlight the selected node
          const selectedNodeElement = node.filter(d => d.id === id)
            .attr('r', 8)
            .attr('stroke', 'var(--link)')
            .attr('stroke-width', 2);
          
          // Center and zoom on the selected node
          const scale = 2;
          const x = width / 2 - scale * selectedNode.x;
          const y = height / 2 - scale * selectedNode.y;
          
          svg.transition().duration(500)
            .attr('transform', 'translate(' + x + ',' + y + ') scale(' + scale + ')');
        };

        // Set up zoom behavior
        const zoom = d3.zoom()
          .scaleExtent([0.1, 4])
          .on('zoom', (event) => {
            svg.attr('transform', event.transform);
          });

        svg.call(zoom);

        // Add zoom button event listeners
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        const zoomResetBtn = document.getElementById('zoom-reset');

        zoomInBtn.addEventListener('click', function() {
          svg.transition().duration(300).call(zoom.scaleBy, 1.2);
        });

        zoomOutBtn.addEventListener('click', function() {
          svg.transition().duration(300).call(zoom.scaleBy, 0.8);
        });

        zoomResetBtn.addEventListener('click', function() {
          svg.transition().duration(300).call(
            zoom.transform,
            d3.zoomIdentity
          );
        });

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

        ${includeSearch ? `
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const entityList = document.getElementById('entity-list');
        const entityItems = entityList.querySelectorAll('.entity-item');

        searchInput.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase();
          
          entityItems.forEach(item => {
            const id = item.getAttribute('data-id').toLowerCase();
            const type = item.getAttribute('data-type').toLowerCase();
            const text = item.textContent.toLowerCase();
            
            if (id.includes(searchTerm) || type.includes(searchTerm) || text.includes(searchTerm)) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        });

        // Clear filters functionality
        const clearFiltersBtn = document.getElementById('clear-filters');
        clearFiltersBtn.addEventListener('click', function() {
          searchInput.value = '';
          entityItems.forEach(item => {
            item.style.display = '';
          });
          
          // Reset type filters
          const typeFilters = document.getElementById('type-filters');
          Array.from(typeFilters.querySelectorAll('input')).forEach(input => {
            input.checked = true;
          });
        });
        ` : ''}
      </script>
    </div>
  </div>
</body>
</html>`;

  files['index.html'] = indexHTML;

  // Generate individual entity pages
  for (const entity of this.entities.values()) {
    const entityHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${entity.attributes.name || entity.attributes.title || entity.id} - ${title}</title>
  <style>
    :root {
      --background: ${themeVars.background};
      --text: ${themeVars.text};
      --link: ${themeVars.link};
      --accent: ${themeVars.accent};
      --border: ${themeVars.border};
      --text-color: ${themeVars.text_color};
      --bg-color: ${themeVars.bg_color};
    }
    body {
      font-family: ${themeVars.fontFamily || 'system-ui, -apple-system, sans-serif'};
      padding: 20px;
      background: var(--background);
      color: var(--text);
      max-width: 800px;
      margin: 0 auto;
    }
    h1, h2, h3, h4 {
      color: var(--text);
    }
    a {
      color: var(--link);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 20px;
    }
    .entity-type {
      color: var(--accent);
      margin-bottom: 20px;
    }
    .entity-section {
      margin-bottom: 30px;
      padding: 15px;
      border: 1px solid var(--border);
      border-radius: 8px;
    }
    .attribute-table {
      width: 100%;
      border-collapse: collapse;
      background: rgba(255, 255, 255, 0.05);
    }
    .attribute-table tr:nth-child(even) {
      background: rgba(0, 0, 0, 0.03);
    }
    .attribute-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }
    .attribute-key {
      font-weight: bold;
      width: 30%;
    }
    .attribute-value {
      width: 70%;
    }
    .relationship-list {
      list-style: none;
      padding: 0;
    }
    .relationship-item {
      padding: 8px;
      margin: 4px 0;
      border: 1px solid var(--border);
      border-radius: 4px;
    }
    .relationship-attributes {
      margin-top: 4px;
      font-size: 0.9em;
      color: var(--accent);
    }
  </style>
</head>
<body>
  <a href="index.html" class="back-link">← Back to Graph</a>
  <h1>${entity.attributes.name || entity.attributes.title || entity.id}</h1>
  <div class="entity-type">${entity.type}</div>
  
  <div class="entity-section">
    <h3>Attributes</h3>
    <div class="attributes">
      <table class="attribute-table">
        ${Object.entries(entity.attributes).map(([key, value]) => `
          <tr class="attribute-row">
            <td class="attribute-key">${key}</td>
            <td class="attribute-value">${String(value)}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  </div>

  <div class="entity-section">
    <h3>Relationships</h3>
    ${generateRelationshipHTML.call(this, entity.id)}
  </div>
</body>
</html>`