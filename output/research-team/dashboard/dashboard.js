// Dashboard Initialization
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeNetwork();
  initializeVectorSpace();
  initializeTimeline();
  initializeImpact();
  initializeClusters();
  initializeEntityExplorer();
});

// Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      
      // Update active states
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// Network Visualization
function initializeNetwork() {
  const networkStats = document.getElementById('network-stats');
  const entityDistribution = document.getElementById('entity-distribution');
  const data = window.researchData;

  // Calculate statistics
  const stats = {
    entities: data.entities.length,
    types: new Set(data.entities.map(e => e.type)).size,
    clusters: new Set(data.entities
      .filter(e => e.attributes.vector)
      .map(e => e.attributes.vector.cluster)).size
  };

  // Render statistics
  networkStats.innerHTML = `
    <div class="stat">
      <span class="stat-value">${stats.entities}</span>
      <span class="stat-label">Total Entities</span>
    </div>
    <div class="stat">
      <span class="stat-value">${stats.types}</span>
      <span class="stat-label">Entity Types</span>
    </div>
    <div class="stat">
      <span class="stat-value">${stats.clusters}</span>
      <span class="stat-label">Research Clusters</span>
    </div>
  `;

  // Create interactive network visualization using D3
  const networkViz = d3.select('#network-viz');
  const width = networkViz.node().clientWidth;
  const height = 600;

  const svg = networkViz
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create force simulation
  const simulation = d3.forceSimulation(data.entities)
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(width / 2, height / 2));

  // Add links
  const links = svg.append('g')
    .selectAll('line')
    .data(Array.from(data.links.values()).flat())
    .enter()
    .append('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6);

  // Add nodes
  const nodes = svg.append('g')
    .selectAll('circle')
    .data(data.entities)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', d => getClusterColor(d.attributes.vector?.cluster))
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  // Add node labels
  const labels = svg.append('g')
    .selectAll('text')
    .data(data.entities)
    .enter()
    .append('text')
    .text(d => d.id)
    .attr('font-size', '10px')
    .attr('dx', 8)
    .attr('dy', 3);

  // Update positions on tick
  simulation.on('tick', () => {
    links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    labels
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });

  // Drag functions
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
}

// Vector Space Visualization
function initializeVectorSpace() {
  const vectorSpace = document.getElementById('vector-space-interactive');
  const data = window.researchData;
  const dimension = document.getElementById('vector-dimension').value;
  
  // Extract entities with vector embeddings
  const entities = data.entities.filter(e => e.attributes.vector);
  
  // Prepare data for visualization
  const traces = [{
    type: dimension === '3d' ? 'scatter3d' : 'scatter',
    mode: 'markers+text',
    x: entities.map(e => e.attributes.vector.embedding[0]),
    y: entities.map(e => e.attributes.vector.embedding[1]),
    z: dimension === '3d' ? entities.map(e => e.attributes.vector.embedding[2] || 0) : undefined,
    text: entities.map(e => e.id),
    textposition: 'top center',
    textfont: {
      size: 10,
      color: '#666'
    },
    marker: {
      size: 8,
      color: entities.map(e => getClusterColor(e.attributes.vector.cluster)),
      opacity: 0.8,
      line: {
        color: '#fff',
        width: 1
      }
    },
    hoverinfo: 'text',
    hovertext: entities.map(e => generateHoverText(e))
  }];

  const layout = {
    title: 'Vector Space Visualization',
    showlegend: false,
    margin: { l: 0, r: 0, b: 0, t: 40 },
    scene: dimension === '3d' ? {
      xaxis: { title: 'Dimension 1' },
      yaxis: { title: 'Dimension 2' },
      zaxis: { title: 'Dimension 3' }
    } : undefined,
    xaxis: dimension === '2d' ? { title: 'Dimension 1' } : undefined,
    yaxis: dimension === '2d' ? { title: 'Dimension 2' } : undefined,
    hovermode: 'closest'
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d']
  };

  Plotly.newPlot(vectorSpace, traces, layout, config);

  // Add click handlers
  vectorSpace.on('plotly_click', (data) => {
    const point = data.points[0];
    const entity = entities[point.pointNumber];
    showVectorDetails(entity);
  });

  // Update cluster legend
  updateClusterLegend(entities);
}

function generateHoverText(entity) {
  return `
    ${entity.id}
    Type: ${entity.type}
    Cluster: ${entity.attributes.vector.cluster}
    Distance to Centroid: ${entity.attributes.vector.centroid_distance.toFixed(3)}
  `;
}

function updateClusterLegend(entities) {
  const legend = document.getElementById('cluster-legend');
  const clusters = [...new Set(entities.map(e => e.attributes.vector.cluster))];
  
  legend.innerHTML = clusters.map(cluster => `
    <div class="legend-item">
      <span class="color-dot" style="background-color: ${getClusterColor(cluster)}"></span>
      <span class="cluster-name">${cluster}</span>
      <span class="entity-count">(${entities.filter(e => e.attributes.vector.cluster === cluster).length})</span>
    </div>
  `).join('');
}

function showVectorDetails(entity) {
  const details = document.getElementById('vector-details');
  
  details.innerHTML = `
    <h4>${entity.id}</h4>
    <div class="detail-section">
      <h5>Vector Information</h5>
      <p><strong>Cluster:</strong> ${entity.attributes.vector.cluster}</p>
      <p><strong>Centroid Distance:</strong> ${entity.attributes.vector.centroid_distance.toFixed(3)}</p>
      ${entity.attributes.vector.similar_concepts ? `
        <h5>Similar Concepts</h5>
        <ul>
          ${entity.attributes.vector.similar_concepts.map(concept => `
            <li>${concept.id} (similarity: ${concept.similarity.toFixed(3)})</li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
    ${entity.attributes.llm_insights ? `
      <div class="detail-section">
        <h5>LLM Insights</h5>
        <ul>
          ${entity.attributes.llm_insights.key_findings.map(finding => `
            <li>
              <p><strong>${finding.statement}</strong></p>
              <p>Confidence: ${(finding.confidence * 100).toFixed(1)}%</p>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
  `;
}

// Timeline Visualization
function initializeTimeline() {
  const timeline = document.getElementById('temporal-viz');
  const data = window.researchData;
  const evolution = data.metadata.temporal_analysis.knowledge_evolution;

  // Create interactive timeline
  const timelineData = [{
    x: evolution.map(e => e.timeframe),
    y: evolution.map(e => e.impact_score),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Impact Score'
  }];

  const layout = {
    title: 'Knowledge Evolution',
    xaxis: { title: 'Time' },
    yaxis: { title: 'Impact Score' }
  };

  Plotly.newPlot(timeline, timelineData, layout);

  // Add animation controls
  let currentFrame = 0;
  const playButton = document.getElementById('play-timeline');
  const slider = document.getElementById('timeline-slider');

  playButton.addEventListener('click', () => {
    const interval = setInterval(() => {
      if (currentFrame >= evolution.length) {
        clearInterval(interval);
        return;
      }
      updateTimelineFrame(currentFrame++);
    }, 1000);
  });

  slider.addEventListener('input', (e) => {
    currentFrame = Math.floor((e.target.value / 100) * evolution.length);
    updateTimelineFrame(currentFrame);
  });
}

// Impact Analysis
function initializeImpact() {
  const impactViz = document.getElementById('impact-viz');
  const data = window.researchData;
  const publications = data.entities.filter(e => e.type === 'publication');

  // Create interactive impact visualization
  const impactData = [{
    x: publications.map(p => p.id),
    y: publications.map(p => p.attributes.impact_metrics?.citation_network?.impact_score || 0),
    type: 'bar',
    name: 'Impact Score'
  }];

  const layout = {
    title: 'Publication Impact',
    xaxis: { title: 'Publications' },
    yaxis: { title: 'Impact Score' }
  };

  Plotly.newPlot(impactViz, impactData, layout);
}

// Cluster Analysis
function initializeClusters() {
  const clusterNetwork = document.getElementById('cluster-network');
  const data = window.researchData;
  const clusters = data.metadata.cluster_analysis;

  // Create force-directed cluster visualization using D3
  const width = clusterNetwork.clientWidth;
  const height = 600;
  const svg = d3.select(clusterNetwork)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create cluster nodes
  const nodes = clusters.map(cluster => ({
    id: cluster.id,
    size: cluster.members.length,
    cohesion: cluster.cohesion_score
  }));

  // Create cluster links based on similarity
  const links = [];
  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      const similarity = calculateClusterSimilarity(clusters[i], clusters[j]);
      if (similarity > 0.3) { // Only show strong connections
        links.push({
          source: clusters[i].id,
          target: clusters[j].id,
          value: similarity
        });
      }
    }
  }

  // Create force simulation
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  // Add links
  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke-width', d => d.value * 2)
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6);

  // Add nodes
  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', d => Math.sqrt(d.size) * 5)
    .attr('fill', d => d3.interpolateViridis(d.cohesion))
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  // Add labels
  const label = svg.append('g')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .text(d => d.id)
    .attr('font-size', '10px')
    .attr('dx', 12)
    .attr('dy', 4);

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
      .attr('y', d => d.y);
  });

  // Drag functions
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

  // Add click handlers
  node.on('click', (event, d) => {
    showClusterDetails(d.id);
  });
}

// Entity Explorer
function initializeEntityExplorer() {
  const entityList = document.getElementById('entity-list');
  const entityDetails = document.getElementById('entity-details');
  const searchInput = document.getElementById('entity-search');
  const typeFilter = document.getElementById('entity-type-filter');
  const data = window.researchData;

  // Render entity list
  function renderEntityList(filter = '', type = 'all') {
    const filtered = data.entities.filter(e => 
      (type === 'all' || e.type === type) &&
      e.id.toLowerCase().includes(filter.toLowerCase())
    );

    entityList.innerHTML = filtered.map(entity => `
      <div class="entity-item" data-id="${entity.id}">
        <span class="entity-type">${entity.type}</span>
        <span class="entity-id">${entity.id}</span>
      </div>
    `).join('');
  }

  // Show entity details
  function showEntityDetails(entity) {
    entityDetails.innerHTML = `
      <h3>${entity.id}</h3>
      <div class="entity-type">${entity.type}</div>
      <div class="entity-attributes">
        <h4>Attributes</h4>
        <pre>${JSON.stringify(entity.attributes, null, 2)}</pre>
      </div>
      <div class="entity-links">
        <h4>Relationships</h4>
        <ul>
          ${Array.from(window.researchData.links.get(entity.id) || [])
            .map(link => `<li>${link.type} → ${link.target}</li>`)
            .join('')}
        </ul>
      </div>
    `;
  }

  // Add event listeners
  searchInput.addEventListener('input', (e) => {
    renderEntityList(e.target.value, typeFilter.value);
  });

  typeFilter.addEventListener('change', (e) => {
    renderEntityList(searchInput.value, e.target.value);
  });

  entityList.addEventListener('click', (e) => {
    const item = e.target.closest('.entity-item');
    if (item) {
      const entity = data.entities.find(e => e.id === item.dataset.id);
      showEntityDetails(entity);
    }
  });

  // Initial render
  renderEntityList();
}

// Helper Functions
function getClusterColor(cluster) {
  const colors = {
    'machine-learning': '#FF6B6B',
    'computer-vision': '#4ECDC4',
    'natural-language-processing': '#45B7D1',
    'robotics': '#96CEB4',
    'data-science': '#FFEEAD',
    'deep-learning': '#D4A5A5',
    'reinforcement-learning': '#9B59B6',
    'computer-graphics': '#3498DB',
    'human-computer-interaction': '#2ECC71',
    'artificial-intelligence': '#E74C3C'
  };
  return colors[cluster] || '#808080';
}

function calculateClusterSimilarity(cluster1, cluster2) {
  // Calculate Jaccard similarity between clusters
  const set1 = new Set(cluster1.members);
  const set2 = new Set(cluster2.members);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function updateTimelineFrame(frame) {
  const evolution = window.researchData.metadata.temporal_analysis.knowledge_evolution;
  const event = evolution[frame];
  
  document.getElementById('timeline-details').innerHTML = `
    <div class="timeline-event">
      <h4>${event.timeframe}</h4>
      <p>Impact Score: ${event.impact_score.toFixed(2)}</p>
      <ul>
        ${event.key_developments.map(dev => `<li>${dev}</li>`).join('')}
      </ul>
    </div>
  `;
}

function showClusterDetails(clusterId) {
  const cluster = window.researchData.metadata.cluster_analysis.find(c => c.id === clusterId);
  const clusterInfo = document.getElementById('cluster-info');
  const clusterMembers = document.getElementById('cluster-members');

  clusterInfo.innerHTML = `
    <h4>${cluster.id}</h4>
    <p><strong>Size:</strong> ${cluster.members.length} members</p>
    <p><strong>Cohesion Score:</strong> ${cluster.cohesion_score.toFixed(3)}</p>
    <p><strong>Key Themes:</strong></p>
    <ul>
      ${cluster.key_themes.map(theme => `<li>${theme}</li>`).join('')}
    </ul>
  `;

  clusterMembers.innerHTML = `
    <div class="member-list">
      ${cluster.members.map(member => `
        <div class="member-item">
          <span class="member-id">${member}</span>
          <span class="member-type">${getMemberType(member)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function getMemberType(memberId) {
  const entity = window.researchData.entities.find(e => e.id === memberId);
  return entity ? entity.type : 'unknown';
} 