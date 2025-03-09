// Graph visualization data
const data = {
  "nodes": [
    {
      "id": "alice",
      "type": "researcher",
      "label": "Dr. Alice Chen",
      "attributes": {
        "name": "Dr. Alice Chen",
        "role": "Principal Investigator",
        "department": "Cognitive Science",
        "email": "alice.chen@example.edu",
        "publications": 42,
        "expertise": [
          "active inference",
          "computational neuroscience",
          "bayesian modeling"
        ],
        "yearsExperience": 15
      }
    },
    {
      "id": "bob",
      "type": "researcher",
      "label": "Dr. Bob Smith",
      "attributes": {
        "name": "Dr. Bob Smith",
        "role": "Senior Researcher",
        "department": "Biology",
        "email": "bob.smith@example.edu",
        "publications": 28,
        "expertise": [
          "ant colony behavior",
          "entomology",
          "swarm intelligence"
        ],
        "yearsExperience": 12
      }
    },
    {
      "id": "carol",
      "type": "researcher",
      "label": "Dr. Carol Jimenez",
      "attributes": {
        "name": "Dr. Carol Jimenez",
        "role": "Postdoctoral Researcher",
        "department": "Cognitive Science",
        "email": "carol.jimenez@example.edu",
        "publications": 11,
        "expertise": [
          "active inference",
          "machine learning",
          "cognitive modeling"
        ],
        "yearsExperience": 3
      }
    },
    {
      "id": "david",
      "type": "researcher",
      "label": "David Wilson",
      "attributes": {
        "name": "David Wilson",
        "role": "PhD Student",
        "department": "Biology",
        "email": "david.wilson@example.edu",
        "publications": 3,
        "expertise": [
          "ant colony optimization",
          "collective behavior",
          "stigmergy"
        ],
        "yearsExperience": 3
      }
    },
    {
      "id": "emma",
      "type": "researcher",
      "label": "Emma Taylor",
      "attributes": {
        "name": "Emma Taylor",
        "role": "PhD Student",
        "department": "Computer Science",
        "email": "emma.taylor@example.edu",
        "publications": 4,
        "expertise": [
          "machine learning",
          "reinforcement learning",
          "neural networks"
        ],
        "yearsExperience": 2
      }
    },
    {
      "id": "frank",
      "type": "researcher",
      "label": "Dr. Frank Martinez",
      "attributes": {
        "name": "Dr. Frank Martinez",
        "role": "Research Associate",
        "department": "Mathematics",
        "email": "frank.martinez@example.edu",
        "publications": 16,
        "expertise": [
          "dynamical systems",
          "chaos theory",
          "mathematical modeling"
        ],
        "yearsExperience": 8
      }
    },
    {
      "id": "grace",
      "type": "researcher",
      "label": "Grace Kim",
      "attributes": {
        "name": "Grace Kim",
        "role": "Lab Technician",
        "department": "Biology",
        "email": "grace.kim@example.edu",
        "publications": 0,
        "expertise": [
          "ant husbandry",
          "experiment design",
          "data collection"
        ],
        "yearsExperience": 4
      }
    },
    {
      "id": "active-inference-model",
      "type": "project",
      "label": "Active Inference Modeling of Collective Behavior",
      "attributes": {
        "name": "Active Inference Modeling of Collective Behavior",
        "status": "Active",
        "startDate": "2023-01-15",
        "endDate": "2025-01-14",
        "funding": 750000,
        "fundingSource": "National Science Foundation",
        "description": "Developing computational models of collective behavior using the Active Inference framework"
      }
    },
    {
      "id": "ant-colony-study",
      "type": "project",
      "label": "Ant Colony Decision Making Study",
      "attributes": {
        "name": "Ant Colony Decision Making Study",
        "status": "Active",
        "startDate": "2023-06-01",
        "endDate": "2024-12-31",
        "funding": 250000,
        "fundingSource": "University Grant",
        "description": "Field study of ant colony decision-making processes in natural environments"
      }
    },
    {
      "id": "neural-basis",
      "type": "project",
      "label": "Neural Basis of Active Inference",
      "attributes": {
        "name": "Neural Basis of Active Inference",
        "status": "Planning",
        "startDate": "2024-01-01",
        "endDate": "2026-12-31",
        "funding": 1200000,
        "fundingSource": "NIH",
        "description": "Investigation of neural mechanisms underlying active inference in biological systems"
      }
    },
    {
      "id": "active-inference",
      "type": "concept",
      "label": "Active Inference",
      "attributes": {
        "name": "Active Inference",
        "field": "Computational Neuroscience",
        "description": "Framework for understanding perception and action based on free energy minimization",
        "keyPapers": [
          "10.1038/nn.2635",
          "10.1016/j.tics.2009.04.005"
        ]
      }
    },
    {
      "id": "collective-behavior",
      "type": "concept",
      "label": "Collective Behavior",
      "attributes": {
        "name": "Collective Behavior",
        "field": "Biology",
        "description": "Emergent properties and dynamics of group behavior in social organisms",
        "keyPapers": [
          "10.1016/j.tree.2018.01.003"
        ]
      }
    },
    {
      "id": "swarm-intelligence",
      "type": "concept",
      "label": "Swarm Intelligence",
      "attributes": {
        "name": "Swarm Intelligence",
        "field": "Computer Science",
        "description": "Collective problem-solving abilities emerging from local interactions",
        "keyPapers": [
          "10.1007/s11721-007-0004-y"
        ]
      }
    },
    {
      "id": "ant-tracking",
      "type": "equipment",
      "label": "Ant Tracking System",
      "attributes": {
        "name": "Ant Tracking System",
        "type": "Imaging",
        "status": "Operational",
        "location": "Main Lab",
        "cost": 75000,
        "purchaseDate": "2023-02-15",
        "maintenanceSchedule": "Monthly"
      }
    },
    {
      "id": "neural-recording",
      "type": "equipment",
      "label": "Neural Recording Setup",
      "attributes": {
        "name": "Neural Recording Setup",
        "type": "Electrophysiology",
        "status": "Operational",
        "location": "Neuroscience Lab",
        "cost": 150000,
        "purchaseDate": "2023-05-01",
        "maintenanceSchedule": "Weekly"
      }
    },
    {
      "id": "computation-cluster",
      "type": "equipment",
      "label": "High Performance Computing Cluster",
      "attributes": {
        "name": "High Performance Computing Cluster",
        "type": "Computing",
        "status": "Operational",
        "location": "Server Room",
        "cost": 200000,
        "purchaseDate": "2022-11-01",
        "maintenanceSchedule": "Monthly"
      }
    },
    {
      "id": "paper-2023a",
      "type": "publication",
      "label": "Active Inference Framework for Collective Behavior Analysis",
      "attributes": {
        "title": "Active Inference Framework for Collective Behavior Analysis",
        "authors": [
          "alice",
          "carol",
          "david"
        ],
        "journal": "Nature Computational Science",
        "year": 2023,
        "doi": "10.1038/s41467-023-0001-1",
        "citations": 15
      }
    },
    {
      "id": "paper-2023b",
      "type": "publication",
      "label": "Decision Making Patterns in Ant Colonies: A Field Study",
      "attributes": {
        "title": "Decision Making Patterns in Ant Colonies: A Field Study",
        "authors": [
          "bob",
          "emma",
          "frank"
        ],
        "journal": "Behavioral Ecology",
        "year": 2023,
        "doi": "10.1093/beheco/2023-0002",
        "citations": 8
      }
    },
    {
      "id": "paper-2024",
      "type": "publication",
      "label": "Computational Models of Active Inference in Social Insects",
      "attributes": {
        "title": "Computational Models of Active Inference in Social Insects",
        "authors": [
          "alice",
          "bob",
          "carol",
          "david"
        ],
        "journal": "PLOS Computational Biology",
        "year": 2024,
        "doi": "10.1371/journal.pcbi.2024-0001",
        "citations": 3
      }
    }
  ],
  "links": [
    {
      "source": "alice",
      "target": "active-inference-model",
      "type": "leads",
      "attributes": {
        "role": "Principal Investigator",
        "timeCommitment": 0.4
      }
    },
    {
      "source": "bob",
      "target": "ant-colony-study",
      "type": "leads",
      "attributes": {
        "role": "Principal Investigator",
        "timeCommitment": 0.5
      }
    },
    {
      "source": "carol",
      "target": "active-inference-model",
      "type": "contributes",
      "attributes": {
        "role": "Lead Developer",
        "timeCommitment": 0.6
      }
    },
    {
      "source": "david",
      "target": "active-inference-model",
      "type": "contributes",
      "attributes": {
        "role": "Data Analyst",
        "timeCommitment": 0.8
      }
    },
    {
      "source": "emma",
      "target": "ant-colony-study",
      "type": "contributes",
      "attributes": {
        "role": "Field Researcher",
        "timeCommitment": 0.7
      }
    },
    {
      "source": "frank",
      "target": "ant-colony-study",
      "type": "contributes",
      "attributes": {
        "role": "Lab Manager",
        "timeCommitment": 0.3
      }
    },
    {
      "source": "bob",
      "target": "active-inference-model",
      "type": "contributes_to",
      "attributes": {
        "role": "Co-Investigator",
        "startDate": "2022-03-15"
      }
    },
    {
      "source": "carol",
      "target": "active-inference-model",
      "type": "contributes_to",
      "attributes": {
        "role": "Lead Researcher",
        "startDate": "2022-09-01"
      }
    },
    {
      "source": "david",
      "target": "ant-colony-study",
      "type": "contributes_to",
      "attributes": {
        "role": "Behavioral Consultant",
        "startDate": "2024-02-10",
        "timeCommitment": "25%"
      }
    },
    {
      "source": "grace",
      "target": "ant-colony-study",
      "type": "contributes_to",
      "attributes": {
        "role": "Lab Technician",
        "startDate": "2023-01-10"
      }
    },
    {
      "source": "frank",
      "target": "ant-colony-study",
      "type": "contributes_to",
      "attributes": {
        "role": "Mathematical Modeling",
        "startDate": "2022-11-15"
      }
    },
    {
      "source": "emma",
      "target": "ant-colony-study",
      "type": "contributes_to",
      "attributes": {
        "role": "Algorithm Developer",
        "startDate": "2024-01-05"
      }
    },
    {
      "source": "alice",
      "target": "david",
      "type": "mentors",
      "attributes": {
        "type": "PhD Advisor",
        "startDate": "2022-09-01"
      }
    },
    {
      "source": "bob",
      "target": "emma",
      "type": "mentors",
      "attributes": {
        "type": "PhD Advisor",
        "startDate": "2022-09-01"
      }
    },
    {
      "source": "alice",
      "target": "carol",
      "type": "mentors",
      "attributes": {
        "type": "Postdoc Advisor",
        "startDate": "2023-01-15"
      }
    },
    {
      "source": "frank",
      "target": "emma",
      "type": "co_advises",
      "attributes": {
        "startDate": "2022-09-01"
      }
    },
    {
      "source": "carol",
      "target": "alice",
      "type": "reports_to",
      "attributes": {
        "startDate": "2022-01-15"
      }
    },
    {
      "source": "david",
      "target": "bob",
      "type": "reports_to",
      "attributes": {
        "startDate": "2021-09-01"
      }
    },
    {
      "source": "emma",
      "target": "alice",
      "type": "reports_to",
      "attributes": {
        "startDate": "2022-09-01"
      }
    },
    {
      "source": "grace",
      "target": "bob",
      "type": "reports_to",
      "attributes": {
        "startDate": "2020-05-15"
      }
    },
    {
      "source": "active-inference-model",
      "target": "active-inference",
      "type": "applies",
      "attributes": {
        "centrality": "Core",
        "innovation": "Novel application to collective behavior"
      }
    },
    {
      "source": "ant-colony-study",
      "target": "collective-behavior",
      "type": "applies",
      "attributes": {
        "centrality": "Core",
        "innovation": "Field validation of theoretical predictions"
      }
    },
    {
      "source": "active-inference",
      "target": "collective-behavior",
      "type": "relates_to",
      "attributes": {
        "relationship": "Theoretical framework application",
        "strength": "Strong"
      }
    },
    {
      "source": "ant-colony-study",
      "target": "ant-tracking",
      "type": "uses",
      "attributes": {
        "frequency": "Daily",
        "priority": "High"
      }
    },
    {
      "source": "active-inference-model",
      "target": "computation-cluster",
      "type": "uses",
      "attributes": {
        "frequency": "Continuous",
        "priority": "High"
      }
    },
    {
      "source": "neural-basis",
      "target": "neural-recording",
      "type": "uses",
      "attributes": {
        "frequency": "Daily",
        "priority": "High"
      }
    },
    {
      "source": "alice",
      "target": "paper-2023a",
      "type": "authored",
      "attributes": {
        "contributionType": "corresponding author",
        "contributionPercentage": 40
      }
    },
    {
      "source": "bob",
      "target": "paper-2023a",
      "type": "authored",
      "attributes": {
        "contributionType": "co-author",
        "contributionPercentage": 30
      }
    },
    {
      "source": "carol",
      "target": "paper-2023a",
      "type": "authored",
      "attributes": {
        "contributionType": "co-author",
        "contributionPercentage": 30
      }
    },
    {
      "source": "bob",
      "target": "paper-2023b",
      "type": "authored",
      "attributes": {
        "contributionType": "corresponding author",
        "contributionPercentage": 50
      }
    },
    {
      "source": "emma",
      "target": "paper-2023b",
      "type": "authored",
      "attributes": {
        "contributionType": "co-author",
        "contributionPercentage": 30
      }
    },
    {
      "source": "frank",
      "target": "paper-2023b",
      "type": "authored",
      "attributes": {
        "contributionType": "co-author",
        "contributionPercentage": 20
      }
    },
    {
      "source": "alice",
      "target": "paper-2024",
      "type": "authored",
      "attributes": {
        "contributionType": "co-author",
        "contributionPercentage": 25
      }
    },
    {
      "source": "bob",
      "target": "paper-2024",
      "type": "authored",
      "attributes": {
        "contributionType": "co-author",
        "contributionPercentage": 30
      }
    },
    {
      "source": "carol",
      "target": "paper-2024",
      "type": "authored",
      "attributes": {
        "contributionType": "co-author",
        "contributionPercentage": 30
      }
    },
    {
      "source": "david",
      "target": "paper-2024",
      "type": "authored",
      "attributes": {
        "contributionType": "co-author",
        "contributionPercentage": 30
      }
    },
    {
      "source": "grace",
      "target": "paper-2024",
      "type": "authored",
      "attributes": {
        "contributionType": "co-author",
        "contributionPercentage": 20
      }
    },
    {
      "source": "paper-2023a",
      "target": "active-inference-model",
      "type": "results_from",
      "attributes": {
        "contribution": "Primary theoretical framework"
      }
    },
    {
      "source": "paper-2023b",
      "target": "ant-colony-study",
      "type": "results_from",
      "attributes": {
        "contribution": "Initial field study findings"
      }
    },
    {
      "source": "paper-2024",
      "target": "active-inference-model",
      "type": "results_from",
      "attributes": {
        "contribution": "Computational modeling results"
      }
    },
    {
      "source": "paper-2024",
      "target": "ant-colony-study",
      "type": "results_from",
      "attributes": {
        "contribution": "Empirical validation"
      }
    },
    {
      "source": "paper-2023a",
      "target": "active-inference",
      "type": "discusses",
      "attributes": {
        "depth": "comprehensive"
      }
    },
    {
      "source": "paper-2023b",
      "target": "collective-behavior",
      "type": "discusses",
      "attributes": {
        "depth": "substantial"
      }
    },
    {
      "source": "paper-2024",
      "target": "swarm-intelligence",
      "type": "discusses",
      "attributes": {
        "depth": "comprehensive"
      }
    }
  ]
};

// Color mapping function
function getColorByType(type) {
  const colors = {
    person: '#4285F4',     // Google Blue
    project: '#EA4335',    // Google Red
    organization: '#FBBC04', // Google Yellow
    place: '#34A853',      // Google Green
    concept: '#9C27B0',    // Purple
    event: '#FF9800',      // Orange
    article: '#795548',    // Brown
    technology: '#607D8B', // Blue Grey
    default: '#9E9E9E'     // Grey
  };
  
  return colors[type] || colors.default;
}

// Initialize graph with data
function initializeGraph(data) {
  const container = document.getElementById('graph');
  if (!container) {
    console.error('Graph container not found');
    return;
  }
  
  // Calculate dimensions
  const containerWidth = container.clientWidth || 800;
  const containerHeight = container.clientHeight || 600;
  const width = Math.min(containerWidth, window.innerWidth - 50);
  const height = Math.min(containerHeight, window.innerHeight - 200);
  
  // Create SVG container
  const svg = d3.select('#graph')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height])
    .attr('preserveAspectRatio', 'xMidYMid meet');
  
  // Add a rect to capture zoom events
  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent');
  
  // Set up zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  
  svg.call(zoom);
  
  // Create container group for zoom
  const g = svg.append('g');
  
  // Add defs for markers (arrowheads)
  const defs = svg.append('defs');
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#999');
  
  // Create force simulation
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(40));
  
  // Create container for links
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(data.links)
    .join('line')
    .attr('class', 'link')
    .attr('marker-end', 'url(#arrowhead)');
  
  // Create container for nodes
  const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(data.nodes)
    .join('g')
    .attr('class', 'node')
    .attr('data-id', d => d.id)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Add circles to nodes
  node.append('circle')
    .attr('r', 8)
    .attr('fill', d => getColorByType(d.type));
  
  // Add text labels to nodes
  node.append('text')
    .text(d => d.label)
    .attr('x', 12)
    .attr('y', 4)
    .attr('font-family', 'Helvetica, Arial, sans-serif')
    .attr('font-size', '12px')
    .attr('text-anchor', 'start');
  
  // Add title tooltips
  node.append('title')
    .text(d => `${d.label} (${d.type})`);
  
  // Update positions on simulation tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
  
  // Add filter controls
  const typeFilters = document.getElementById('type-filters');
  if (typeFilters) {
    const entityTypes = [...new Set(data.nodes.map(d => d.type))];
    entityTypes.forEach(type => {
      const filterDiv = document.createElement('div');
      filterDiv.className = 'filter-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `filter-${type}`;
      checkbox.checked = true;
      checkbox.addEventListener('change', updateFilters);
      
      const label = document.createElement('label');
      label.htmlFor = `filter-${type}`;
      label.textContent = type;
      label.style.color = getColorByType(type);
      
      filterDiv.appendChild(checkbox);
      filterDiv.appendChild(label);
      typeFilters.appendChild(filterDiv);
    });
  }
  
  function updateFilters() {
    const typeFilters = document.getElementById('type-filters');
    if (!typeFilters) return;
    
    const visibleTypes = [];
    Array.from(typeFilters.querySelectorAll('input')).forEach(input => {
      if (input.checked) {
        const type = input.id.replace('filter-', '');
        visibleTypes.push(type);
      }
    });
    
    node.classed('hidden', d => !visibleTypes.includes(d.type));
    link.classed('hidden', d => {
      const sourceNode = data.nodes.find(node => node.id === (d.source.id || d.source));
      const targetNode = data.nodes.find(node => node.id === (d.target.id || d.target));
      return !sourceNode || !targetNode || 
             !visibleTypes.includes(sourceNode.type) || 
             !visibleTypes.includes(targetNode.type);
    });
  }
  
  // Setup zoom controls
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomResetBtn = document.getElementById('zoom-reset');
  const clearFiltersBtn = document.getElementById('clear-filters');
  
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.75);
    });
  }
  
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      const typeFilters = document.getElementById('type-filters');
      if (typeFilters) {
        Array.from(typeFilters.querySelectorAll('input')).forEach(input => {
          input.checked = true;
        });
        updateFilters();
      }
    });
  }
  
  // Implement node selection functionality
  node.on('click', (event, d) => {
    // Reset all nodes and links
    node.classed('selected', false).classed('neighbor', false);
    link.classed('highlighted', false);
    
    // Highlight selected node
    d3.select(event.currentTarget).classed('selected', true);
    
    // Find and highlight connected nodes and links
    link.each(function(l) {
      if ((l.source.id === d.id || l.source === d.id) || 
          (l.target.id === d.id || l.target === d.id)) {
        d3.select(this).classed('highlighted', true);
        const otherId = (l.source.id === d.id || l.source === d.id) ? 
          (l.target.id || l.target) : (l.source.id || l.source);
        d3.select('[data-id="' + otherId + '"]').classed('neighbor', true);
      }
    });
  });
  
  // Double-click to open entity page
  node.on('dblclick', (event, d) => {
    window.location.href = d.id + '.html';
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
}

// Initialize the visualization when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeGraph(data);
});