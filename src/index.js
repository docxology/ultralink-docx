/**
 * UltraLink
 * 
 * A meta-linking paradigm for plain text relational content with 
 * deterministic deployment capabilities.
 */

// Core components
const { Link, Entity, EntityStore } = require('./core/types');
const { extractObsidianLinks, extractCustomLinks, UltraLinkParser } = require('./core/parser');
const zlib = require('zlib');

// Exporters
const { Exporter } = require('./exporters/base');
const { ObsidianExporter } = require('./exporters/obsidian');
const { DatabaseExporter } = require('./exporters/database');

// Entity templates
const { EntityTemplates, createEntityFromTemplate, formatEntity } = require('./types/entity-templates');

// Integrity checking
const { IntegrityCheckResult, IntegrityChecker } = require('./integrity/checker');

/**
 * UltraLink Core Class
 * 
 * Provides the core functionality for managing and exporting relational content
 * with support for LLM-generated metadata and vector embeddings.
 */

class UltraLink {
  constructor(config = {}) {
    this.entities = new Map();
    this.relationships = new Map();
    this.links = new Map();
    this.config = {
      useVectors: config.useVectors || false,
      useTemporal: config.useTemporal || false
    };
  }

  addEntity(id, type, attributes = {}) {
    const entity = new Entity(id, type, attributes);
    this.entities.set(id, entity);
    this.links.set(id, new Map());
    return entity;
  }

  getEntity(id) {
    return this.entities.get(id) || null;
  }

  updateEntity(id, attributes) {
    const entity = this.getEntity(id);
    if (!entity) {
      throw new Error(`Entity not found: ${id}`);
    }
    Object.assign(entity.attributes, attributes);
    return entity;
  }

  deleteEntity(id) {
    if (!this.entities.has(id)) {
      return false;
    }

    // Delete all relationships involving this entity
    for (const [key, rel] of this.relationships.entries()) {
      if (rel.source === id || rel.target === id) {
        this.relationships.delete(key);
      }
    }

    // Delete from links map
    this.links.delete(id);

    // Delete the entity itself
    return this.entities.delete(id);
  }

  addLink(sourceId, targetId, type = 'default', attributes = {}) {
    if (!this.entities.has(sourceId)) {
      throw new Error(`Source entity "${sourceId}" not found`);
    }
    if (!this.entities.has(targetId)) {
      throw new Error(`Target entity "${targetId}" not found`);
    }

    const relationship = {
      source: sourceId,
      target: targetId,
      type,
      attributes
    };

    const key = `${sourceId}:${targetId}:${type}`;
    this.relationships.set(key, relationship);

    // Add to source entity's links
    if (!this.links.has(sourceId)) {
      this.links.set(sourceId, new Map());
    }
    const sourceLinks = this.links.get(sourceId);
    if (!sourceLinks.has(targetId)) {
      sourceLinks.set(targetId, new Map());
    }
    sourceLinks.get(targetId).set(type, relationship);

    return relationship;
  }

  getRelationships(entityId, type = null) {
    const relationships = [];
    for (const rel of this.relationships.values()) {
      if (rel.source === entityId && (!type || rel.type === type)) {
        relationships.push(rel);
      }
    }
    return relationships;
  }

  getBacklinks(entityId, type = null) {
    const backlinks = [];
    for (const rel of this.relationships.values()) {
      if (rel.target === entityId && (!type || rel.type === type)) {
        backlinks.push(rel);
      }
    }
    return backlinks;
  }

  deleteLink(sourceId, targetId, type = 'default') {
    const key = `${sourceId}:${targetId}:${type}`;
    if (!this.relationships.has(key)) {
      return false;
    }

    // Remove from relationships map
    this.relationships.delete(key);

    // Remove from source entity's links
    if (this.links.has(sourceId)) {
      const sourceLinks = this.links.get(sourceId);
      if (sourceLinks.has(targetId)) {
        const targetLinks = sourceLinks.get(targetId);
        targetLinks.delete(type);
        if (targetLinks.size === 0) {
          sourceLinks.delete(targetId);
        }
      }
    }

    return true;
  }

  /**
   * Export the entire graph to JSON format
   * @param {Object} options - Export options
   * @param {boolean} options.pretty - Whether to format the JSON with indentation (default: false)
   * @param {boolean} options.includeVectors - Whether to include entity vectors (default: false)
   * @returns {string} JSON representation of the graph as a string
   */
  toJSON(options = {}) {
    const { pretty = false, includeVectors = false } = options;
    
    const entities = Array.from(this.entities.values()).map(entity => {
      const result = {
        ...entity,
        links: Array.from(this.getRelationships(entity.id))
      };
      
      // Include vector if requested and available
      if (includeVectors && entity.vector) {
        result.vector = Array.from(entity.vector);
      }
      
      return result;
    });

    const data = {
      entities,
      relationships: Array.from(this.relationships.values()),
      metadata: this.metadata
    };
    
    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  /**
   * Export the graph to CSV format
   * @param {Object} options - Export options
   * @param {boolean} options.includeMetadata - Whether to include metadata columns
   * @returns {string} CSV representation of the graph
   */
  toCSV(options = {}) {
    const { includeMetadata = false } = options;
    
    // Collect all possible entity attributes for headers
    const entityAttributes = new Set(['name']);
    const entityTypes = new Set();
    
    for (const entity of this.entities.values()) {
      entityTypes.add(entity.type);
      
      for (const attrName of Object.keys(entity.attributes)) {
        entityAttributes.add(attrName);
      }
    }
    
    // Collect all possible relationship attributes for headers
    const relationshipAttributes = new Set();
    const relationshipTypes = new Set();
    
    for (const [sourceId, links] of this.links.entries()) {
      for (const link of links.values()) {
        relationshipTypes.add(link.type);
        
        if (link.attributes) {
          for (const attrName of Object.keys(link.attributes)) {
            relationshipAttributes.add(attrName);
          }
        }
      }
    }
    
    // Create entities CSV
    let entitiesCsv = 'id,type';
    
    // Add attribute columns
    for (const attr of entityAttributes) {
      entitiesCsv += `,${attr}`;
    }
    
    // Add metadata columns if requested
    if (includeMetadata) {
      entitiesCsv += ',created,modified';
    }
    
    entitiesCsv += '\n';
    
    // Add entity rows
    for (const entity of this.entities.values()) {
      entitiesCsv += `${this._escapeCSV(entity.id)},${this._escapeCSV(entity.type)}`;
      
      // Add attribute values
      for (const attr of entityAttributes) {
        let value = entity.attributes[attr] || '';
        entitiesCsv += `,${this._escapeCSV(value)}`;
      }
      
      // Add metadata if requested
      if (includeMetadata) {
        const created = entity.metadata?.created || '';
        const modified = entity.metadata?.modified || '';
        entitiesCsv += `,${this._escapeCSV(created)},${this._escapeCSV(modified)}`;
      }
      
      entitiesCsv += '\n';
    }
    
    // Create relationships CSV
    let relationshipsCsv = 'source,target,type';
    
    // Add attribute columns
    for (const attr of relationshipAttributes) {
      relationshipsCsv += `,${attr}`;
    }
    
    // Add metadata columns if requested
    if (includeMetadata) {
      relationshipsCsv += ',created,modified';
    }
    
    relationshipsCsv += '\n';
    
    // Add relationship rows
    for (const [sourceId, links] of this.links.entries()) {
      for (const link of links.values()) {
        relationshipsCsv += `${this._escapeCSV(sourceId)},${this._escapeCSV(link.target)},${this._escapeCSV(link.type)}`;
        
        // Add attribute values
        for (const attr of relationshipAttributes) {
          let value = link.attributes?.[attr] || '';
          relationshipsCsv += `,${this._escapeCSV(value)}`;
        }
        
        // Add metadata if requested
        if (includeMetadata) {
          const created = link.metadata?.created || '';
          const modified = link.metadata?.modified || '';
          relationshipsCsv += `,${this._escapeCSV(created)},${this._escapeCSV(modified)}`;
        }
        
        relationshipsCsv += '\n';
      }
    }
    
    // Return both CSVs concatenated with a separator
    return entitiesCsv + '\n---\n' + relationshipsCsv;
  }

  /**
   * Export the graph to GraphML format
   * @param {Object} options - Export options
   * @param {boolean} options.includeAllAttributes - Whether to include all attributes
   * @param {boolean} options.prettyPrint - Whether to pretty print the output
   * @returns {string} GraphML representation of the graph
   */
  toGraphML(options = {}) {
    const { includeAllAttributes = false, prettyPrint = true } = options;
    
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
    graphml += '  <graph id="G" edgedefault="directed">\n';
    
    // Add metadata node if present
    if (this.metadata) {
      graphml += '    <node id="metadata">\n';
      const flatMetadata = this._flattenObject(this.metadata);
      for (const [key, value] of Object.entries(flatMetadata)) {
        graphml += `      <data key="metadata_${this._escapeXML(key)}">${this._escapeXML(value)}</data>\n`;
      }
      graphml += '    </node>\n';
    }
    
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
    
    // Add edges from relationships
    for (const [sourceId, links] of this.links.entries()) {
      for (const link of links.values()) {
        graphml += `    <edge source="${this._escapeXML(sourceId)}" target="${this._escapeXML(link.target)}">\n`;
        graphml += `      <data key="type">${this._escapeXML(link.type)}</data>\n`;
        
        // Add relationship attributes if present
        if (includeAllAttributes && link.attributes) {
          for (const [key, value] of Object.entries(link.attributes)) {
            const xmlValue = this._escapeXML(String(value));
            graphml += `      <data key="${key}">${xmlValue}</data>\n`;
          }
        }
        
        graphml += '    </edge>\n';
      }
    }
    
    // Close the graph and GraphML
    graphml += '  </graph>\n';
    graphml += '</graphml>';
    
    return graphml;
  }

  /**
   * Export the graph to Obsidian format
   * @param {string} options - Export options
   * @param {string} options.outputPath - Directory to write markdown files to
   * @param {boolean} options.includeBacklinks - Whether to include backlinks (default: true)
   * @param {boolean} options.includeType - Whether to include entity type (default: true)
   * @param {boolean} options.includeAttributes - Whether to include entity attributes (default: true)
   * @returns {Object} Map of filenames to markdown content
   */
  toObsidian(options) {
    // Handle both string paths and option objects
    let outputPath;
    let includeBacklinks = true;
    let includeType = true;
    let includeAttributes = true;

    if (typeof options === 'string') {
      outputPath = options;
    } else if (typeof options === 'object') {
      outputPath = options.outputPath || '';  // Default to empty string if not provided
      includeBacklinks = options.includeBacklinks ?? true;
      includeType = options.includeType ?? true;
      includeAttributes = options.includeAttributes ?? true;
    } else {
      outputPath = '';  // Default to empty string if no options provided
    }
    
    // Create output directory if it doesn't exist and path is provided
    if (outputPath && typeof outputPath === 'string') {
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
    }

    const files = {};

    for (const entity of this.entities.values()) {
      let content = `# ${entity.id}\n\n`;
      
      if (includeType) {
        content += `Type: ${entity.type}\n\n`;
      }

      // Add metadata section if includeAttributes is true
      if (includeAttributes) {
        content += '## Metadata\n\n';
        const flatData = this._flattenObject(entity.attributes);
        for (const [key, value] of Object.entries(flatData)) {
          content += `- ${key}: ${value}\n`;
        }

        // Add vector metadata if present
        if (entity.attributes.vector) {
          content += '\n## Vector Metadata\n\n';
          content += `- Cluster: ${entity.attributes.vector.cluster}\n`;
          content += `- Centroid Distance: ${entity.attributes.vector.centroid_distance}\n`;
          content += '- Similar Concepts:\n';
          for (const concept of entity.attributes.vector.similar_concepts) {
            content += `  - [[${concept.id}]] (similarity: ${concept.similarity})\n`;
          }
        }

        // Add LLM insights if present
        if (entity.attributes.llm_insights) {
          content += '\n## LLM Insights\n\n';
          content += '### Key Findings\n\n';
          for (const finding of entity.attributes.llm_insights.key_findings) {
            content += `- ${finding.statement}\n`;
            content += `  - Justification: ${finding.justification}\n`;
            content += `  - Confidence: ${finding.confidence}\n`;
            content += '  - Supporting Evidence:\n';
            for (const evidence of finding.supporting_evidence) {
              content += `    - [[${evidence}]]\n`;
            }
          }
        }
      }

      // Add links section
      content += '\n## Links\n\n';
      const links = this.getRelationships(entity.id);
      if (links.length > 0) {
        for (const link of links) {
          content += `- ${link.type} -> [[${link.target}]]\n`;
        }
      } else {
        content += 'No links\n';
      }

      // Add backlinks section if includeBacklinks is true
      if (includeBacklinks) {
        content += '\n## Backlinks\n\n';
        const backlinks = [];
        
        // Find all entities that link to this entity
        for (const [sourceId, sourceLinks] of this.links.entries()) {
          for (const link of sourceLinks.values()) {
            if (link.target === entity.id) {
              backlinks.push({ source: sourceId, type: link.type });
            }
          }
        }
        
        if (backlinks.length > 0) {
          for (const backlink of backlinks) {
            content += `- [[${backlink.source}]] -> ${backlink.type}\n`;
          }
        } else {
          content += 'No backlinks\n';
        }
      }

      files[entity.id] = content;
      
      // Write file to disk if outputPath is provided
      if (outputPath) {
        const filePath = path.join(outputPath, `${entity.id}.md`);
        fs.writeFileSync(filePath, content);
      }
    }

    return files;
  }

  /**
   * Export the graph to HTML website format
   * @param {Object} options - Export options
   * @param {string} options.title - Website title
   * @param {string} options.description - Website description
   * @param {string} options.theme - Theme name (default, dark, light, academic, ocean)
   * @returns {Object} Object containing HTML files
   */
  toHTMLWebsite(options = {}) {
    const {
      title = 'Knowledge Graph',
      description = 'Interactive visualization of relationships',
      theme = 'default'
    } = options;

    const files = {};

    // Get all relationships from the links map
    const relationships = [];
    for (const [sourceId, links] of this.links.entries()) {
      for (const link of links.values()) {
        relationships.push({
          source: sourceId,
          target: link.target,
          type: link.type
        });
      }
    }

    // Generate index.html with improved interactivity
    const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="stylesheet" href="styles/${theme}.css">
    <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body class="theme-${theme}">
    <header>
        <h1>${title}</h1>
        <p>${description}</p>
        <div class="controls">
            <div class="legend"></div>
            <div class="filters">
                <label>Filter by type:
                    <select id="typeFilter">
                        <option value="all">All</option>
                    </select>
                </label>
                <label>Search:
                    <input type="text" id="searchInput" placeholder="Search nodes...">
                </label>
            </div>
        </div>
    </header>
    <main>
        <div id="graph"></div>
        <div id="details" class="details-panel">
            <h2>Details</h2>
            <div id="nodeDetails">
                <p>Click a node to see details</p>
            </div>
        </div>
    </main>
    <script>
        const data = {
            entities: ${JSON.stringify(Array.from(this.entities.values()))},
            relationships: ${JSON.stringify(relationships)}
        };
        
        // Color scale for different node types
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        
        // Set up the SVG
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        
        const svg = d3.select('#graph')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            
        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                container.attr('transform', event.transform);
            });
            
        svg.call(zoom);
        
        // Create container for the graph
        const container = svg.append('g');
        
        // Create arrow marker for directed edges
        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-5 -5 10 10')
            .attr('refX', 15)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M -5,-5 L 5,0 L -5,5')
            .attr('fill', '#999');
            
        // Create the links
        const links = container.append('g')
            .selectAll('line')
            .data(data.relationships)
            .enter()
            .append('line')
            .attr('stroke', '#999')
            .attr('stroke-width', 1)
            .attr('marker-end', 'url(#arrowhead)')
            .attr('stroke-opacity', 0.6);
            
        // Create the nodes
        const nodes = container.append('g')
            .selectAll('g')
            .data(data.entities)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));
                
        // Add circles for nodes
        nodes.append('circle')
            .attr('r', 8)
            .attr('fill', d => colorScale(d.type))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);
            
        // Add labels to nodes
        nodes.append('text')
            .attr('dx', 12)
            .attr('dy', '.35em')
            .text(d => d.attributes.name || d.id)
            .attr('font-size', '12px')
            .attr('fill', '#333');
            
        // Set up the simulation
        const simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));
            
        // Update the simulation
        simulation
            .nodes(data.entities)
            .on('tick', ticked);
            
        simulation.force('link')
            .links(data.relationships);
            
        // Create the legend
        const types = [...new Set(data.entities.map(d => d.type))];
        const legend = d3.select('.legend')
            .append('div')
            .attr('class', 'legend-items');
            
        legend.selectAll('.legend-item')
            .data(types)
            .enter()
            .append('div')
            .attr('class', 'legend-item')
            .html(d => '<span class="legend-color" style="background-color: ' + colorScale(d) + '"></span><span class="legend-label">' + d + '</span>');
            
        // Populate type filter
        const typeFilter = document.getElementById('typeFilter');
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
        
        // Add event listeners
        typeFilter.addEventListener('change', filterNodes);
        document.getElementById('searchInput').addEventListener('input', filterNodes);
        
        // Node click handler
        nodes.on('click', (event, d) => {
            showNodeDetails(d);
        });
        
        // Hover effects
        nodes
            .on('mouseover', highlightConnections)
            .on('mouseout', resetHighlight);
            
        // Functions
        function ticked() {
            links
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
                
            nodes.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
        }
        
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
        
        function showNodeDetails(node) {
            const details = document.getElementById('nodeDetails');
            let html = '<h3>' + (node.attributes.name || node.id) + '</h3>' +
                      '<p><strong>Type:</strong> ' + node.type + '</p>';
            
            for (const [key, value] of Object.entries(node.attributes)) {
                if (key !== 'name' && typeof value !== 'object') {
                    html += '<p><strong>' + key + ':</strong> ' + value + '</p>';
                }
            }
            
            details.innerHTML = html;
        }
        
        function highlightConnections(event, d) {
            // Reduce opacity of all elements
            nodes.style('opacity', 0.2);
            links.style('opacity', 0.1);
            
            // Highlight connected nodes and links
            const connectedNodes = new Set();
            links.each(l => {
                if (l.source === d || l.target === d) {
                    connectedNodes.add(l.source.id);
                    connectedNodes.add(l.target.id);
                }
            });
            
            nodes.filter(n => connectedNodes.has(n.id))
                .style('opacity', 1);
                
            links.filter(l => l.source === d || l.target === d)
                .style('opacity', 1)
                .style('stroke-width', 2);
                
            // Show the current node
            d3.select(event.currentTarget).style('opacity', 1);
        }
        
        function resetHighlight() {
            nodes.style('opacity', 1);
            links.style('opacity', 0.6)
                .style('stroke-width', 1);
        }
        
        function filterNodes() {
            const selectedType = typeFilter.value;
            const searchText = document.getElementById('searchInput').value.toLowerCase();
            
            nodes.style('display', d => {
                const matchesType = selectedType === 'all' || d.type === selectedType;
                const matchesSearch = !searchText || 
                    d.id.toLowerCase().includes(searchText) || 
                    (d.attributes.name && d.attributes.name.toLowerCase().includes(searchText));
                return matchesType && matchesSearch ? null : 'none';
            });
            
            links.style('display', d => {
                const sourceVisible = selectedType === 'all' || d.source.type === selectedType;
                const targetVisible = selectedType === 'all' || d.target.type === selectedType;
                return sourceVisible && targetVisible ? null : 'none';
            });
        }
    </script>
</body>
</html>`;

    // Generate theme CSS with improved styling
    const themeCSS = `/* Theme: ${theme} */
body.theme-${theme} {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 20px;
    ${theme === 'dark' ? 'background: #1a1a1a; color: #ffffff;' : ''}
    ${theme === 'light' ? 'background: #ffffff; color: #000000;' : ''}
    ${theme === 'academic' ? 'background: #f5f5f5; color: #333333;' : ''}
    ${theme === 'ocean' ? 'background: #1e3d59; color: #f5f5f5;' : ''}
}

header {
    margin-bottom: 2em;
    padding: 1em;
    background: ${theme === 'dark' ? '#2d2d2d' : '#f0f0f0'};
    border-radius: 8px;
}

h1 {
    margin: 0 0 0.5em;
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;
    gap: 2em;
}

.legend {
    flex: 1;
}

.legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5em;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.filters {
    flex: 2;
    display: flex;
    gap: 1em;
}

.filters label {
    display: flex;
    align-items: center;
    gap: 0.5em;
}

select, input {
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

main {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2em;
}

#graph {
    border: 1px solid #ccc;
    border-radius: 8px;
    background: ${theme === 'dark' ? '#2d2d2d' : '#ffffff'};
    overflow: hidden;
}

.details-panel {
    padding: 1em;
    background: ${theme === 'dark' ? '#2d2d2d' : '#f9f9f9'};
    border-radius: 8px;
    border: 1px solid #ccc;
}

.details-panel h2 {
    margin-top: 0;
    padding-bottom: 0.5em;
    border-bottom: 1px solid #ccc;
}

.node text {
    pointer-events: none;
    text-shadow: 0 1px 0 ${theme === 'dark' ? '#000' : '#fff'},
                 1px 0 0 ${theme === 'dark' ? '#000' : '#fff'},
                 0 -1px 0 ${theme === 'dark' ? '#000' : '#fff'},
                 -1px 0 0 ${theme === 'dark' ? '#000' : '#fff'};
}

.node:hover {
    cursor: pointer;
}

.node circle {
    transition: r 0.2s;
}

.node:hover circle {
    r: 10;
}`;

    files['index.html'] = indexHTML;
    files[`styles/${theme}.css`] = themeCSS;

    return files;
  }

  /**
   * Export the graph to various visualization formats
   * @param {Object} options - Visualization options
   * @param {string} options.format - Output format (png, svg, d3, cytoscape)
   * @param {string} options.layout - Layout algorithm
   * @param {string} options.style - Visual style
   * @returns {Object} Object containing visualization files
   */
  toVisualization(options = {}) {
    const {
      format = 'svg',
      layout = 'force-directed',
      style = 'default'
    } = options;

    const files = {};
    const filename = `graph.${format}`;

    // Get all relationships from the links map
    const relationships = [];
    for (const [sourceId, links] of this.links.entries()) {
      for (const link of links) {
        relationships.push({
          source: sourceId,
          target: link.target,
          type: link.type
        });
      }
    }

    switch (format) {
      case 'svg':
        // Generate SVG using D3.js
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <style>
        .node { fill: #69b3a2; }
        .link { stroke: #999; stroke-opacity: 0.6; }
        text { font-family: sans-serif; font-size: 10px; }
    </style>
    <g class="links">
        ${relationships.map(rel => 
          `<line class="link" x1="0" y1="0" x2="100" y2="100"/>`
        ).join('\n')}
    </g>
    <g class="nodes">
        ${Array.from(this.entities.values()).map((entity, i) => 
          `<circle class="node" cx="${100 + i * 50}" cy="${100 + i * 30}" r="5">
              <title>${entity.id}</title>
           </circle>`
        ).join('\n')}
    </g>
</svg>`;
        files[filename] = svgContent;
        break;

      case 'png':
        // For PNG, we'll create a simple placeholder
        // In a real implementation, this would use a library like sharp or canvas
        // to render the graph to PNG
        const pngPlaceholder = Buffer.from('PNG placeholder');
        files[filename] = pngPlaceholder;
        break;

      case 'd3':
        // Generate D3.js visualization code
        const d3Code = `
// D3.js visualization code
const width = 800;
const height = 600;

const svg = d3.select('#graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const data = {
    entities: ${JSON.stringify(Array.from(this.entities.values()))},
    relationships: ${JSON.stringify(relationships)}
};

const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

const links = svg.append('g')
    .selectAll('line')
    .data(data.relationships)
    .enter()
    .append('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6);

const nodes = svg.append('g')
    .selectAll('circle')
    .data(data.entities)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', '#69b3a2');

simulation
    .nodes(data.entities)
    .on('tick', () => {
        links
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
            
        nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });

simulation.force('link')
    .links(data.relationships);`;
        files[filename] = d3Code;
        break;

      case 'cytoscape':
        // Generate Cytoscape.js visualization code
        const cytoscapeCode = `
// Cytoscape.js visualization code
const cy = cytoscape({
    container: document.getElementById('graph'),
    elements: {
        nodes: ${JSON.stringify(Array.from(this.entities.values()).map(entity => ({
          data: { id: entity.id, ...entity.attributes }
        })))},
        edges: ${JSON.stringify(relationships.map(rel => ({
          data: { source: rel.source, target: rel.target, type: rel.type }
        })))}
    },
    style: [
        {
            selector: 'node',
            style: {
                'background-color': '#69b3a2',
                'label': 'data(id)'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 1,
                'line-color': '#999',
                'curve-style': 'bezier'
            }
        }
    ],
    layout: {
        name: '${layout}',
        animate: true
    }
});`;
        files[filename] = cytoscapeCode;
        break;
    }

    return files;
  }

  /**
   * Flatten an object's keys into dot notation
   * @param {Object} obj - Object to flatten
   * @param {String} prefix - Prefix for flattened keys
   * @returns {Object} Flattened object
   */
  _flattenObject(obj, prefix = '') {
    const flattened = {};
    
    if (!obj || typeof obj !== 'object') {
      return flattened;
    }
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      if (Array.isArray(value)) {
        // Handle arrays
        if (value.length > 0 && typeof value[0] === 'object') {
          // Array of objects - flatten each object
          value.forEach((item, index) => {
            if (item && typeof item === 'object') {
              const itemFlat = this._flattenObject(item);
              for (const [k, v] of Object.entries(itemFlat)) {
                flattened[`${newKey}_${index}_${k}`] = v;
              }
            }
          });
          
          // Special handling for LLM insights key findings
          if (newKey === 'llm_insights_key_findings') {
            const confidences = value.map(item => item.confidence).filter(Boolean);
            if (confidences.length > 0) {
              flattened.llm_insights_confidence = Math.max(...confidences);
            }
          }
        } else {
          // Array of primitives - stringify
          flattened[newKey] = JSON.stringify(value);
        }
      } else if (value && typeof value === 'object') {
        // Handle nested objects
        const nested = this._flattenObject(value, newKey);
        Object.assign(flattened, nested);
        
        // Special handling for vector metadata
        if (key === 'vector') {
          if (value.embedding) {
            flattened.vector_embedding = JSON.stringify(value.embedding);
          }
          if (value.cluster) {
            flattened.vector_cluster = value.cluster;
          }
          if (value.centroid_distance) {
            flattened.vector_centroid_distance = value.centroid_distance;
          }
          if (value.similar_concepts) {
            flattened.vector_similar_concepts = JSON.stringify(value.similar_concepts);
          }
        }
      } else {
        // Handle primitives
        flattened[newKey] = value;
      }
    }
    
    return flattened;
  }

  /**
   * Get all flattened keys from an object
   * @param {Object} obj - Object to get keys from
   * @param {String} prefix - Prefix for nested keys
   * @returns {Set<String>} Set of flattened keys
   */
  _flattenKeys(obj, prefix = '') {
    const keys = new Set();
    
    if (!obj || typeof obj !== 'object') {
      return keys;
    }
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      if (Array.isArray(value)) {
        keys.add(newKey);
        if (value.length > 0 && typeof value[0] === 'object') {
          value.forEach((item, index) => {
            if (item && typeof item === 'object') {
              const itemKeys = this._flattenKeys(item, `${newKey}_${index}`);
              itemKeys.forEach(k => keys.add(k));
            }
          });
          
          // Special handling for LLM insights key findings
          if (newKey === 'llm_insights_key_findings') {
            keys.add('llm_insights_confidence');
          }
        }
      } else if (value && typeof value === 'object') {
        keys.add(newKey);
        const nestedKeys = this._flattenKeys(value, newKey);
        nestedKeys.forEach(k => keys.add(k));
        
        // Special handling for vector metadata
        if (key === 'vector') {
          keys.add('vector_embedding');
          keys.add('vector_cluster');
          keys.add('vector_centroid_distance');
          keys.add('vector_similar_concepts');
        }
      } else {
        keys.add(newKey);
      }
    }
    
    return keys;
  }

  /**
   * Escape a value for CSV output
   * @param {*} value - Value to escape
   * @returns {string} Escaped value
   */
  _escapeCSV(value) {
    if (value === null || value === undefined) {
      return '';
    }
    
    const str = String(value);
    
    // Check if the value needs to be quoted
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      // Escape quotes by doubling them and wrap in quotes
      return `"${str.replace(/"/g, '""')}"`;
    }
    
    return str;
  }

  /**
   * Escape special characters for XML
   * @private
   * @param {*} value - Value to escape
   * @returns {string} Escaped value
   */
  _escapeXML(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Find entities based on criteria
   * @param {Object} criteria - Search criteria
   * @param {string} criteria.type - Entity type to filter by
   * @param {Object} criteria.attributes - Attribute key-value pairs to match
   * @returns {Array} Array of matching entities
   */
  findEntities(criteria = {}) {
    const results = [];
    for (const entity of this.entities.values()) {
      if (criteria.type && entity.type !== criteria.type) {
        continue;
      }
      
      if (criteria.attributes) {
        let matchesAttributes = true;
        for (const [key, value] of Object.entries(criteria.attributes)) {
          if (entity.attributes[key] !== value) {
            matchesAttributes = false;
            break;
          }
        }
        if (!matchesAttributes) {
          continue;
        }
      }
      
      results.push(entity);
    }
    return results;
  }

  /**
   * Get relationships for an entity
   * @param {string} entityId - Entity ID
   * @param {Object} options - Filter options
   * @param {string} options.type - Filter by relationship type
   * @param {string} options.direction - Filter by direction ('outgoing' or 'incoming')
   * @returns {Array} Array of relationships
   */
  getRelationships(entityId, options = {}) {
    const results = [];
    for (const relationship of this.relationships.values()) {
      if (options.direction === 'outgoing' && relationship.source !== entityId) {
        continue;
      }
      if (options.direction === 'incoming' && relationship.target !== entityId) {
        continue;
      }
      if (!options.direction && relationship.source !== entityId && relationship.target !== entityId) {
        continue;
      }
      if (options.type && relationship.type !== options.type) {
        continue;
      }
      results.push(relationship);
    }
    return results;
  }

  /**
   * Export the graph to a full blob format
   * @param {Object} options - Export options
   * @param {boolean} options.includeVectors - Whether to include vector embeddings
   * @param {boolean} options.includeHistory - Whether to include history
   * @param {string} options.compression - Compression type ('none' or 'gzip')
   * @returns {Promise<Buffer|string>} The exported blob
   */
  async toFullBlob(options = {}) {
    const data = {
      entities: Array.from(this.entities.values()),
      relationships: Array.from(this.relationships.values()),
      metadata: this.metadata,
      config: this.config
    };

    if (!options.includeVectors) {
      data.entities = data.entities.map(entity => {
        const { vector, ...rest } = entity;
        return rest;
      });
    }

    if (!options.includeHistory) {
      data.entities = data.entities.map(entity => {
        const { history, ...rest } = entity;
        return rest;
      });
    }

    const jsonString = JSON.stringify(data);

    if (options.compression === 'gzip') {
      return new Promise((resolve, reject) => {
        zlib.gzip(jsonString, (err, compressed) => {
          if (err) reject(err);
          else resolve(compressed);
        });
      });
    }

    return jsonString;
  }

  /**
   * Import data from a full blob
   * @param {Buffer|string} blob - The blob to import
   * @param {Object} options - Import options
   * @param {string} options.compression - Compression type ('none' or 'gzip')
   * @returns {Promise<void>}
   */
  async fromFullBlob(blob, options = {}) {
    const { compression = 'none' } = options;
    
    // Decompress if needed
    let jsonString;
    if (compression === 'gzip') {
      jsonString = await new Promise((resolve, reject) => {
        zlib.gunzip(blob, (err, decompressed) => {
          if (err) reject(err);
          else resolve(decompressed.toString());
        });
      });
    } else {
      // Handle both string and Buffer inputs
      jsonString = Buffer.isBuffer(blob) ? blob.toString() : blob;
    }
    
    // Parse data
    const data = JSON.parse(jsonString);
    
    // Clear existing data
    this.entities.clear();
    this.relationships.clear();
    this.links.clear();
    this.metadata = {};
    
    // Import config
    this.config = data.config || this.config;
    
    // Import metadata
    this.metadata = data.metadata || {};
    
    // Import entities
    for (const entity of data.entities) {
      this.entities.set(entity.id, entity);
    }
    
    // Import relationships and links
    for (const rel of data.relationships) {
      // Add to relationships map
      const key = `${rel.source}:${rel.target}:${rel.type}`;
      this.relationships.set(key, rel);
      
      // Add to links map
      if (!this.links.has(rel.source)) {
        this.links.set(rel.source, new Set());
      }
      this.links.get(rel.source).add({
        target: rel.target,
        type: rel.type,
        attributes: rel.attributes || {}
      });
    }
  }
}

module.exports = {
  // Main class
  UltraLink,
  
  // Core components
  Link,
  Entity,
  EntityStore,
  UltraLinkParser,
  
  // Utility functions
  extractObsidianLinks,
  extractCustomLinks,
  
  // Exporters
  Exporter,
  ObsidianExporter,
  DatabaseExporter,
  
  // Entity templates
  EntityTemplates,
  createEntityFromTemplate,
  formatEntity,
  
  // Integrity checking
  IntegrityCheckResult,
  IntegrityChecker
}; 