/**
 * HTML Website Exporter
 * 
 * This module exports UltraLink data as an interactive HTML website
 * with D3.js visualizations and responsive design.
 */

const { generateRelationshipHTML } = require('./utils/relationship-html');

/**
 * Export UltraLink data as an interactive HTML website
 * @param {Object} ultralink - The UltraLink instance
 * @param {Object} options - Export options
 * @param {string} options.title - Website title
 * @param {string} options.description - Website description
 * @param {string} options.theme - Theme name (default, light, dark, academic)
 * @param {boolean} options.includeSearch - Whether to include search functionality
 * @returns {Object} Map of filenames to file contents
 */
function toHTMLWebsite(ultralink, options = {}) {
  const {
    title = 'Knowledge Graph',
    description = 'Interactive visualization of relationships',
    theme = 'default',
    includeSearch = true
  } = options;

  const files = {};
  
  // Create nodes from entities
  for (const [id, entity] of ultralink.entities.entries()) {
    const name = entity.attributes.name || entity.attributes.title || id;
    
    // Generate entity page
    let content = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${title}</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    .attribute-table tr:nth-child(odd) {
      background: rgba(255, 255, 255, 0.05);
    }
  </style>
</head>
<body>
  <header>
    <h1>${name}</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="entities.html">All Entities</a>
      <a href="relationships.html">All Relationships</a>
    </nav>
  </header>
  
  <main>
    <section class="entity-details">
      <h2>Entity Details</h2>
      <div class="entity-section">
        <table class="attribute-table">
          <tr>
            <th>ID</th>
            <td>${id}</td>
          </tr>
          <tr>
            <th>Type</th>
            <td>${entity.type}</td>
          </tr>`;
    
    // Add all attributes
    for (const [key, value] of Object.entries(entity.attributes || {})) {
      if (key !== 'name' && key !== 'title') {
        content += `
          <tr>
            <th>${key}</th>
            <td>${value}</td>
          </tr>`;
      }
    }
    
    content += `
        </table>
      </div>
    </section>
    
    <section class="relationships">
      <h2>Relationships</h2>`;
    
    // Get outgoing relationships
    const outgoingRelationships = Array.from(ultralink.relationships.values())
      .filter(rel => rel.source === id);
    
    if (outgoingRelationships.length > 0) {
      content += `
      <h3>Outgoing</h3>
      <ul>`;
      
      for (const rel of outgoingRelationships) {
        const targetEntity = ultralink.entities.get(rel.target);
        const targetName = targetEntity?.attributes?.name || targetEntity?.attributes?.title || rel.target;
        
        content += `
        <li class="relationship-item">
          <strong>${rel.type}</strong> → 
          <a href="${rel.target}.html">${targetName}</a>
          <a href="javascript:void(0)" onclick="selectEntityById('${rel.target}')" class="visualize-link">(visualize)</a>`;
          
        // Add relationship attributes if any
        if (rel.attributes && Object.keys(rel.attributes).length > 0) {
          content += `
          <div class="relationship-attributes">`;
          
          for (const [key, value] of Object.entries(rel.attributes)) {
            content += `
            <span><strong>${key}:</strong> ${value}</span>`;
          }
          
          content += `
          </div>`;
        }
        
        content += `
        </li>`;
      }
      
      content += `
      </ul>`;
    }
    
    // Get incoming relationships
    const incomingRelationships = Array.from(ultralink.relationships.values())
      .filter(rel => rel.target === id);
    
    if (incomingRelationships.length > 0) {
      content += `
      <h3>Incoming</h3>
      <ul>`;
      
      for (const rel of incomingRelationships) {
        const sourceEntity = ultralink.entities.get(rel.source);
        const sourceName = sourceEntity?.attributes?.name || sourceEntity?.attributes?.title || rel.source;
        
        content += `
        <li class="relationship-item">
          <a href="${rel.source}.html">${sourceName}</a> → 
          <strong>${rel.type}</strong>
          <a href="javascript:void(0)" onclick="selectEntityById('${rel.source}')" class="visualize-link">(visualize)</a>`;
          
        // Add relationship attributes if any
        if (rel.attributes && Object.keys(rel.attributes).length > 0) {
          content += `
          <div class="relationship-attributes">`;
          
          for (const [key, value] of Object.entries(rel.attributes)) {
            content += `
            <span><strong>${key}:</strong> ${value}</span>`;
          }
          
          content += `
          </div>`;
        }
        
        content += `
        </li>`;
      }
      
      content += `
      </ul>`;
    }
    
    content += `
    </section>
  </main>
  
  <footer>
    <p>Generated with UltraLink</p>
  </footer>
</body>
</html>`;
    
    files[`${id}.html`] = content;
  }
  
  // Create index page
  let indexContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="styles/academic.css">
  ${options.theme === 'dark' ? `
  <style>
    :root {
      --text-color: #e8eaed;
      --bg-color: #202124;
      --header-bg: #303134;
      --card-bg: #303134;
      --border-color: #5f6368;
      --link-color: #8ab4f8;
      --hover-color: #c58af9;
    }
    
    body {
      background: var(--bg-color);
      color: var(--text-color);
    }
    
    header, footer {
      background: rgba(32, 33, 36, 0.8);
    }
  </style>
  ` : ''}
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    :root {
      ${options.theme === 'dark' ? `
      --text-color: #e8eaed;
      --bg-color: #202124;
      --header-bg: #303134;
      --card-bg: #303134;
      --border-color: #5f6368;
      --link-color: #8ab4f8;
      --hover-color: #c58af9;
      ` : ''}
      ${options.theme === 'academic' ? `
      --text-color: #333;
      --bg-color: #f5f5f5;
      --header-bg: #7b1fa2;
      --card-bg: #fff;
      --border-color: #ddd;
      --link-color: #7b1fa2;
      --hover-color: #4a148c;
      ` : ''}
    }
    
    body {
      background: var(--bg-color);
      color: var(--text-color);
      ${options.theme === 'academic' ? `font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;` : ''}
    }
    
    header, footer {
      background: rgba(32, 33, 36, 0.8);
      ${options.theme === 'academic' ? `background-color: #7b1fa2;` : ''}
    }

    @media (max-width: 768px) {
      nav {
        flex-direction: column;
      }
      .visualization-controls {
        flex-direction: column;
      }
      .entity-types ul {
        padding-left: 1rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>${title}</h1>
    <p>${description}</p>
    <nav>
      <a href="index.html" class="active">Home</a>
      <a href="entities.html">All Entities</a>
      <a href="relationships.html">All Relationships</a>
    </nav>
  </header>
  
  <main>
    <section class="summary">
      <h2>Knowledge Base Summary</h2>
      <p>System: ${title}</p>
      <p>Total Entities: ${ultralink.entities.size}</p>
      <p>Total Relationships: ${ultralink.relationships.size}</p>
      <p>Interactive visualization of research team relationships</p>
    </section>
    
    <section class="visualization-controls">
      <div class="filters">
        <div id="type-filters">
          <h3>Filter by Type</h3>
          <!-- Type filters will be generated by JavaScript -->
        </div>
        <button class="btn" id="clear-filters">Clear Filters</button>
      </div>
      <div class="zoom-controls">
        <button class="zoom-btn" id="zoom-in">+</button>
        <button class="zoom-btn" id="zoom-reset">⟳</button>
        <button class="zoom-btn" id="zoom-out">−</button>
      </div>
    </section>
    
    <section class="visualization">
      <div id="graph"></div>
    </section>
    
    <section class="entity-types">
      <h2>Entity Types</h2>
      <ul>`;
  
  // Group entities by type
  const entityTypes = {};
  for (const entity of ultralink.entities.values()) {
    if (!entityTypes[entity.type]) {
      entityTypes[entity.type] = [];
    }
    entityTypes[entity.type].push(entity);
  }
  
  // Add entity types with counts
  for (const [type, entities] of Object.entries(entityTypes)) {
    indexContent += `
            <li>
              <strong>${type}</strong>: ${entities.length} entities
              <ul>`;
    
    // Add entities of this type with links
    for (const entity of entities) {
      const name = entity.attributes.name || entity.attributes.title || entity.id;
      indexContent += `
                <li>
                  <a href="${entity.id}.html">${name}</a>
                  <a href="javascript:void(0)" onclick="selectEntityById('${entity.id}')" class="visualize-link">(visualize)</a>
                </li>`;
    }
    
    indexContent += `
              </ul>
            </li>`;
  }
  
  indexContent += `
          </ul>
        </section>
  </main>
  
  <footer>
    <p>Generated with UltraLink</p>
  </footer>

  <script>
    // Graph visualization
    const width = 800;
    const height = 600;
    const svg = d3.select('#graph')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height])
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Create graph data
    const nodes = [
      ${Array.from(ultralink.entities.values()).map(entity => `
        {
          id: "${entity.id}",
          type: "${entity.type}",
          attributes: ${JSON.stringify(entity.attributes || {})}
        }`).join(',')}
    ];
    
    const links = [
      ${Array.from(ultralink.relationships.values()).map(rel => `
        {
          source: "${rel.source}",
          target: "${rel.target}",
          type: "${rel.type}",
          attributes: ${JSON.stringify(rel.attributes || {})}
        }`).join(',')}
    ];
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5);
    
    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', d => getColorByType(d.type))
      .call(drag(simulation));
    
    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.attributes.name || d.attributes.title || d.id)
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
      
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
    
    // Implement zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    // Zoom controls
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    
    zoomInBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    });
    
    zoomOutBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.75);
    });
    
    zoomResetBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });
    
    // Implement drag functionality
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
    
    // Get color by entity type
    function getColorByType(type) {
      const colors = {
        person: '#4285F4',
        organization: '#EA4335',
        project: '#FBBC05',
        publication: '#34A853',
        event: '#8F44AD',
        location: '#16A085',
        concept: '#E67E22',
        resource: '#1ABC9C'
      };
      
      return colors[type] || '#999';
    }
    
    // Generate type filters
    const typeFilters = document.getElementById('type-filters');
    const types = [...new Set(nodes.map(node => node.type))];
    
    types.forEach(type => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = type;
      input.checked = true;
      input.dataset.type = type;
      
      label.appendChild(input);
      label.appendChild(document.createTextNode(type));
      typeFilters.appendChild(label);
      
      input.addEventListener('change', updateFilters);
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    clearFiltersBtn.addEventListener('click', () => {
      Array.from(typeFilters.querySelectorAll('input')).forEach(input => {
        input.checked = true;
      });
      updateFilters();
    });
    
    // Update filters
    function updateFilters() {
      const selectedTypes = Array.from(typeFilters.querySelectorAll('input:checked'))
        .map(input => input.value);
      
      node.attr('visibility', d => selectedTypes.includes(d.type) ? 'visible' : 'hidden');
      label.attr('visibility', d => selectedTypes.includes(d.type) ? 'visible' : 'hidden');
      
      link.attr('visibility', d => {
        const sourceNode = nodes.find(node => node.id === d.source.id);
        const targetNode = nodes.find(node => node.id === d.target.id);
        return selectedTypes.includes(sourceNode.type) && selectedTypes.includes(targetNode.type) ? 'visible' : 'hidden';
      });
    }
    
    // Function to select entity by ID
    window.selectEntityById = (id) => {
      const selectedNode = nodes.find(node => node.id === id);
      if (!selectedNode) return;
      
      // Highlight the selected node
      node.attr('stroke', d => d.id === id ? '#000' : null)
          .attr('stroke-width', d => d.id === id ? 2 : null);
      
      // Center and zoom to the selected node
      const scale = 2;
      const x = width / 2 - scale * selectedNode.x;
      const y = height / 2 - scale * selectedNode.y;
      
      svg.transition().duration(500)
        .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
    };
    
    // Helper function to get entity name
    function getEntityName(entity) {
      const name = entity.attributes.name || entity.attributes.title || entity.id;
      return name;
    }
  </script>
</body>
</html>`;
  
  files['index.html'] = indexContent;
  
  // Create CSS file with theme support
  let cssContent = '';
  
  // Add theme-specific CSS
  if (theme === 'dark') {
    cssContent += `
:root {
  --text-color: #e8eaed;
  --bg-color: #202124;
  --header-bg: #303134;
  --card-bg: #303134;
  --border-color: #5f6368;
  --link-color: #8ab4f8;
  --hover-color: #c58af9;
}

body {
  background: var(--bg-color);
  color: var(--text-color);
}

header, footer {
  background: rgba(32, 33, 36, 0.8);
}
`;
  } else if (theme === 'academic') {
    cssContent += `
:root {
  --text-color: #333;
  --bg-color: #f5f5f5;
  --header-bg: #7b1fa2;
  --card-bg: #fff;
  --border-color: #ddd;
  --link-color: #7b1fa2;
  --hover-color: #9c27b0;
}

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}

header {
  background-color: #7b1fa2;
  color: white;
}
`;
  } else {
    cssContent += `
:root {
  --text-color: #333;
  --bg-color: #fff;
  --header-bg: #f8f9fa;
  --card-bg: #fff;
  --border-color: #eee;
  --link-color: #0066cc;
  --hover-color: #004499;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background: var(--bg-color);
  color: var(--text-color);
}

header {
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: var(--link-color);
  padding: 0.5rem;
  border-radius: 4px;
}

nav a:hover, nav a.active {
  background: rgba(255, 255, 255, 0.05);
  color: var(--hover-color);
}

section {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--card-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2, h3 {
  margin-top: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-weight: bold;
  background: rgba(255, 255, 255, 0.05);
}

a {
  color: var(--link-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: var(--hover-color);
}

.visualization {
  height: 600px;
  margin-bottom: 2rem;
}

#graph {
  width: 100%;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.visualization-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.zoom-controls {
  display: flex;
  gap: 0.5rem;
}

.zoom-controls button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: var(--header-bg);
  color: white;
  cursor: pointer;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#type-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

#type-filters label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--header-bg);
  color: white;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: var(--header-bg);
  color: white;
  cursor: pointer;
}

.entity-section {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.attribute-table {
  width: 100%;
}

.relationship-item {
  margin-bottom: 0.5rem;
}

.relationship-attributes {
  margin-top: 0.25rem;
  padding-left: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.relationship-attributes span {
  display: block;
}

@media (max-width: 768px) {
  .visualization-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  #type-filters {
    flex-direction: column;
  }
}
`;
  }
  
  // Add common CSS
  cssContent += `
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background: var(--bg-color);
  color: var(--text-color);
}

header {
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: var(--link-color);
  padding: 0.5rem;
  border-radius: 4px;
}

nav a:hover, nav a.active {
  background: rgba(255, 255, 255, 0.05);
  color: var(--hover-color);
}

section {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--card-bg);
  boxshadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2, h3 {
  margin-top: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-weight: bold;
  background: rgba(255, 255, 255, 0.05);
}

a {
  color: var(--link-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: var(--hover-color);
}

.visualization {
  height: 600px;
  margin-bottom: 2rem;
}

#graph {
  width: 100%;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.visualization-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.zoom-controls {
  display: flex;
  gap: 0.5rem;
}

.zoom-controls button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: var(--header-bg);
  color: white;
  cursor: pointer;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#type-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

#type-filters label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--header-bg);
  color: white;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: var(--header-bg);
  color: white;
  cursor: pointer;
}

.entity-section {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.attribute-table {
  width: 100%;
}

.relationship-item {
  margin-bottom: 0.5rem;
}

.relationship-attributes {
  margin-top: 0.25rem;
  padding-left: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.relationship-attributes span {
  display: block;
}

@media (max-width: 768px) {
  .visualization-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  #type-filters {
    flex-direction: column;
  }
}
`;
  
  files['styles.css'] = cssContent;
  
  return files;
}

module.exports = { toHTMLWebsite }; 