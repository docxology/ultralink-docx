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
 * @returns {Object|string} JSON object or string
 */
function toJSON(options = {}) {
  const {
    pretty = false,
    includeMetadata = true,
    asString = true
  } = options;

  // Convert entities to array format
  const entities = Array.from(this.entities.values()).map(entity => {
    const result = {
      id: entity.id,
      type: entity.type,
      attributes: { ...entity.attributes }
    };

    if (includeMetadata && entity.metadata) {
      result.metadata = { ...entity.metadata };
    }

    return result;
  });

  // Convert relationships to array format
  const relationships = Array.from(this.relationships.values()).map(rel => {
    const result = {
      source: rel.source,
      target: rel.target,
      type: rel.type,
      attributes: { ...rel.attributes }
    };

    if (includeMetadata && rel.metadata) {
      result.metadata = { ...rel.metadata };
    }

    return result;
  });

  const data = { entities, relationships };

  if (asString) {
    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  return data;
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
      border: '#333333'
    },
    light: {
      background: '#ffffff', 
      text: '#000000',
      link: '#0066cc',
      accent: '#666666',
      border: '#dddddd'
    },
    academic: {
      background: '#f5f5f5',
      text: '#333333', 
      link: '#990000',
      accent: '#666666',
      border: '#cccccc',
      backgroundColor: '#7b1fa2',
      fontFamily: '\'Palatino Linotype\', serif'
    },
    ocean: {
      background: '#f0f8ff',
      text: '#333333',
      link: '#006699',
      accent: '#4a9eff',
      border: '#b3d9ff'
    },
    default: {
      background: '#ffffff',
      text: '#000000',
      link: '#0066cc',
      accent: '#666666',
      border: '#dddddd'
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
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      background: var(--background);
      color: var(--text);
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
      </div>
      ` : ''}
      <h3>Entities</h3>
      <ul class="entity-list" id="entity-list">
        ${Array.from(this.entities.values()).map(entity => `
          <li class="entity-item" data-id="${entity.id}" data-type="${entity.type}">
            <a href="${entity.id}.html">
              ${entity.attributes.name || entity.attributes.title || entity.id}
            </a>
            <div class="entity-type">${entity.type}</div>
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="main">
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
          .attr('width', width)
          .attr('height', height);

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
          .text(d => d.attributes.name || d.attributes.title || d.id);

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
        window.selectEntityById = function(id) {
          // Find the selected node
          const selectedNode = data.nodes.find(function(n) { return n.id === id; });
          if (!selectedNode) return;
          
          // Reset all nodes
          node.attr('r', 5).attr('stroke', null);
          
          // Highlight the selected node
          const selectedNodeElement = node.filter(function(d) { return d.id === id; })
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
  ${theme === 'academic' ? '<link rel="stylesheet" href="styles/academic.css">' : ''}
  <style>
    :root {
      --background: ${themeVars.background};
      --text: ${themeVars.text};
      --link: ${themeVars.link};
      --accent: ${themeVars.accent};
      --border: ${themeVars.border};
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
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
      font-size: 0.9em;
      margin-bottom: 20px;
    }
    .attributes {
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 20px;
    }
    .attribute-row {
      display: grid;
      grid-template-columns: 200px 1fr;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }
    .attribute-row:last-child {
      border-bottom: none;
    }
    .attribute-key {
      color: var(--accent);
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
  
  <h3>Attributes</h3>
  <div class="attributes">
    ${Object.entries(entity.attributes).map(([key, value]) => `
      <div class="attribute-row">
        <div class="attribute-key">${key}</div>
        <div class="attribute-value">${String(value)}</div>
      </div>
    `).join('')}
  </div>

  <h3>Relationships</h3>
  ${generateRelationshipHTML.call(this, entity.id)}
</body>
</html>`;

    files[`${entity.id}.html`] = entityHTML;
  }

  return files;
}

/**
 * Helper method to generate relationship HTML for an entity
 * @param {string} entityId - Entity ID
 * @returns {string} HTML for relationships
 */
function generateRelationshipHTML(entityId) {
  // Get outgoing and incoming relationships
  const outgoing = this.getRelationships(entityId, { direction: 'outgoing' });
  const incoming = this.getRelationships(entityId, { direction: 'incoming' });

  let html = '';

  if (outgoing.length > 0) {
    html += '<h4>Outgoing</h4>';
    html += '<ul class="relationship-list">';

    for (const rel of outgoing) {
      const targetEntity = this.entities.get(rel.target);
      const targetName = targetEntity?.attributes?.name || targetEntity?.attributes?.title || rel.target;

      html += `<li class="relationship-item">
        <strong>${rel.type}</strong> → <a href="${rel.target}.html">${targetName}</a>`;

      // Add relationship attributes if present
      if (Object.keys(rel.attributes).length > 0) {
        html += '<div class="relationship-attributes">';
        for (const [key, value] of Object.entries(rel.attributes)) {
          html += `<small><strong>${key}:</strong> ${value}</small> `;
        }
        html += '</div>';
      }

      html += `</li>`;
    }

    html += '</ul>';
  }

  if (incoming.length > 0) {
    html += '<h4>Incoming</h4>';
    html += '<ul class="relationship-list">';

    for (const rel of incoming) {
      const sourceEntity = this.entities.get(rel.source);
      const sourceName = sourceEntity?.attributes?.name || sourceEntity?.attributes?.title || rel.source;

      html += `<li class="relationship-item">
        <a href="${rel.source}.html">${sourceName}</a> → <strong>${rel.type}</strong>
      </li>`;
    }

    html += '</ul>';
  }

  if (outgoing.length === 0 && incoming.length === 0) {
    html += '<p>No relationships found.</p>';
  }

  return html;
}

/**
 * Export to KIF (Knowledge Interchange Format)
 * @param {Object} options - Export options
 * @param {boolean} options.includeAttributes - Whether to include entity attributes
 * @param {string} options.baseNamespace - Base namespace for entity IDs
 * @returns {string} KIF document as string
 */
function toKIF(options = {}) {
  const {
    includeAttributes = true,
    baseNamespace = ''
  } = options;

  // Initialize KIF string with header
  let kif = `;; UltraLink Knowledge Interchange Format (KIF) Export
;; Generated: ${new Date().toISOString()}
;; Entities and their attributes\n`;

  // Add entity definitions
  for (const entity of this.entities.values()) {
    kif += `(instance ${entity.id} ${entity.type.charAt(0).toUpperCase() + entity.type.slice(1)})\n`;

    // Add attributes if requested
    if (includeAttributes && entity.attributes) {
      // Handle both Map and plain object attributes
      if (entity.attributes instanceof Map) {
        for (const [key, value] of entity.attributes.entries()) {
          if (value !== undefined) {
            // Check if value is a number and format accordingly
            if (typeof value === 'number') {
              kif += `(${key} ${baseNamespace}${entity.id} ${value})\n`;
            } else {
              kif += `(${key} ${baseNamespace}${entity.id} "${value}")\n`;
            }
          }
        }
      } else {
        for (const [key, value] of Object.entries(entity.attributes)) {
          if (value !== undefined) {
            // Check if value is a number and format accordingly
            if (typeof value === 'number') {
              kif += `(${key} ${baseNamespace}${entity.id} ${value})\n`;
            } else {
              kif += `(${key} ${baseNamespace}${entity.id} "${value}")\n`;
            }
          }
        }
      }
    }

    kif += `\n`;
  }

  // Add relationships section
  kif += `;; Relationships\n`;
  for (const rel of this.relationships.values()) {
    kif += `(${rel.type} ${baseNamespace}${rel.source} ${baseNamespace}${rel.target})\n`;
  }

  // Add meta-knowledge section
  kif += `\n;; Meta-knowledge\n`;
  kif += `(= (entityCount UltraLinkExport) ${this.entities.size})\n`;
  kif += `(= (relationshipCount UltraLinkExport) ${this.relationships.size})\n`;
  kif += `(= (exportDate UltraLinkExport) "${new Date().toISOString()}")\n`;
  kif += `(= (exportVersion UltraLinkExport) "1.0")\n`;

  // Add Functions section
  kif += `\n;; Functions\n`;
  kif += `(deffunction relationshipCount (?kb)\n`;
  kif += `  :documentation "Returns the total number of relationships in a knowledge base"\n`;
  kif += `  :return-type Integer)\n\n`;
  kif += `(deffunction entityCount (?kb)\n`;
  kif += `  :documentation "Returns the total number of entities in a knowledge base"\n`;
  kif += `  :return-type Integer)\n`;

  // Add Rules section
  kif += `\n;; Rules\n`;
  kif += `(defrule temporal-ordering\n`;
  kif += `  :documentation "Rule for temporal ordering of events"\n`;
  kif += `  (and (instance ?e1 Event)\n`;
  kif += `       (instance ?e2 Event)\n`;
  kif += `       (date ?e1 ?d1)\n`;
  kif += `       (date ?e2 ?d2)\n`;
  kif += `       (evaluate ?before (string< ?d1 ?d2)))\n`;
  kif += `  (before ?e1 ?e2))\n`;

  return kif;
}

/**
 * Export a complete blob containing all data in multiple formats
 * @param {Object} options - Export options
 * @param {boolean} options.includeMetadata - Whether to include metadata
 * @param {string} options.compression - Compression type ('none' or 'gzip')
 * @returns {Object} Object containing various export formats
 */
function toFullBlob(options = {}) {
  const {
    includeMetadata = true,
    compression = 'none'
  } = options;

  // Create basic JSON data
  const jsonData = this.toJSON({ 
    pretty: false, 
    includeMetadata, 
    asString: false 
  });

  // Add export metadata
  const fullData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    format: 'UltraLink-FullBlob',
    entities: jsonData.entities,
    relationships: jsonData.relationships,
    exports: {}
  };

  // Add various export formats
  try {
    fullData.exports.csv = this.toCSV({ includeMetadata });
  } catch (e) {
    fullData.exports.csv = { error: e.message };
  }

  try {
    fullData.exports.graphml = this.toGraphML({ includeAllAttributes: true });
  } catch (e) {
    fullData.exports.graphml = { error: e.message };
  }

  try {
    fullData.exports.kif = this.toKIF({ includeAttributes: true });
  } catch (e) {
    fullData.exports.kif = { error: e.message };
  }

  // Apply compression if requested
  if (compression === 'gzip') {
    const zlib = require('zlib');
    const jsonString = JSON.stringify(fullData);
    return zlib.gzipSync(jsonString);
  }

  // Return the object directly
  return fullData;
}

module.exports = {
  toJSON,
  toCSV,
  toGraphML,
  toObsidian,
  toHTMLWebsite,
  toKIF,
  toFullBlob,
  generateRelationshipHTML
}; 