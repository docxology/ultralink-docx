// Graph visualization data
const data = {
  "nodes": [
    {
      "id": "pomdp_model",
      "type": "model",
      "label": "Active Inference POMDP Model",
      "attributes": {
        "name": "Active Inference POMDP Model",
        "description": "A Partially Observable Markov Decision Process implemented with Active Inference",
        "domain": "computational_neuroscience",
        "model_type": "discrete",
        "discount_factor": 0.95,
        "horizon": 10,
        "time_steps": 100
      }
    },
    {
      "id": "observation_space",
      "type": "space",
      "label": "Observation Space",
      "attributes": {
        "name": "Observation Space",
        "symbol": "o",
        "dimensions": [
          3,
          1
        ],
        "description": "The set of possible observations an agent can perceive",
        "observations": [
          {
            "id": "o1",
            "name": "Observation 1",
            "description": "Low sensory input"
          },
          {
            "id": "o2",
            "name": "Observation 2",
            "description": "Medium sensory input"
          },
          {
            "id": "o3",
            "name": "Observation 3",
            "description": "High sensory input"
          }
        ]
      }
    },
    {
      "id": "state_space",
      "type": "space",
      "label": "Latent State Space",
      "attributes": {
        "name": "Latent State Space",
        "symbol": "s",
        "dimensions": [
          5,
          1
        ],
        "description": "The set of possible hidden states the environment can be in",
        "states": [
          {
            "id": "s1",
            "name": "State 1",
            "description": "Very low state value"
          },
          {
            "id": "s2",
            "name": "State 2",
            "description": "Low state value"
          },
          {
            "id": "s3",
            "name": "State 3",
            "description": "Medium state value"
          },
          {
            "id": "s4",
            "name": "State 4",
            "description": "High state value"
          },
          {
            "id": "s5",
            "name": "State 5",
            "description": "Very high state value"
          }
        ]
      }
    },
    {
      "id": "action_space",
      "type": "space",
      "label": "Action Space",
      "attributes": {
        "name": "Action Space",
        "symbol": "a",
        "dimensions": [
          2,
          1
        ],
        "description": "The set of possible actions an agent can take",
        "actions": [
          {
            "id": "a1",
            "name": "Action 1",
            "description": "Decrease value"
          },
          {
            "id": "a2",
            "name": "Action 2",
            "description": "Increase value"
          }
        ]
      }
    },
    {
      "id": "a_matrix",
      "type": "matrix",
      "label": "Observation Likelihood Matrix",
      "attributes": {
        "name": "Observation Likelihood Matrix",
        "symbol": "A",
        "dimensions": [
          3,
          5
        ],
        "description": "Maps hidden states to observations (likelihood mapping)",
        "matrix_type": "likelihood",
        "matrix_data": [
          [
            0.8,
            0.3,
            0.1,
            0,
            0
          ],
          [
            0.2,
            0.6,
            0.7,
            0.3,
            0.1
          ],
          [
            0,
            0.1,
            0.2,
            0.7,
            0.9
          ]
        ],
        "precision": 0.9,
        "column_labels": [
          "s1",
          "s2",
          "s3",
          "s4",
          "s5"
        ],
        "row_labels": [
          "o1",
          "o2",
          "o3"
        ]
      }
    },
    {
      "id": "b_matrix",
      "type": "matrix",
      "label": "State Transition Matrix",
      "attributes": {
        "name": "State Transition Matrix",
        "symbol": "B",
        "dimensions": [
          5,
          5,
          2
        ],
        "description": "Defines the dynamics of state transitions based on actions",
        "matrix_type": "transition",
        "matrix_data": [
          [
            [
              0.9,
              0.2,
              0,
              0,
              0
            ],
            [
              0.1,
              0.7,
              0.2,
              0,
              0
            ],
            [
              0,
              0.1,
              0.7,
              0.2,
              0
            ],
            [
              0,
              0,
              0.1,
              0.7,
              0.1
            ],
            [
              0,
              0,
              0,
              0.1,
              0.9
            ]
          ],
          [
            [
              0.9,
              0.1,
              0,
              0,
              0
            ],
            [
              0.1,
              0.7,
              0.1,
              0,
              0
            ],
            [
              0,
              0.2,
              0.7,
              0.1,
              0
            ],
            [
              0,
              0,
              0.2,
              0.7,
              0.1
            ],
            [
              0,
              0,
              0,
              0.2,
              0.9
            ]
          ]
        ],
        "action_labels": [
          "a1",
          "a2"
        ],
        "column_labels": [
          "s1",
          "s2",
          "s3",
          "s4",
          "s5"
        ],
        "row_labels": [
          "s1",
          "s2",
          "s3",
          "s4",
          "s5"
        ]
      }
    },
    {
      "id": "c_matrix",
      "type": "matrix",
      "label": "Preference Matrix",
      "attributes": {
        "name": "Preference Matrix",
        "symbol": "C",
        "dimensions": [
          3,
          1
        ],
        "description": "Specifies the agent preferences over observations (as log probabilities)",
        "matrix_type": "preference",
        "matrix_data": [
          [
            -3
          ],
          [
            0
          ],
          [
            3
          ]
        ],
        "row_labels": [
          "o1",
          "o2",
          "o3"
        ],
        "precision": 1
      }
    },
    {
      "id": "d_matrix",
      "type": "matrix",
      "label": "Initial State Prior",
      "attributes": {
        "name": "Initial State Prior",
        "symbol": "D",
        "dimensions": [
          5,
          1
        ],
        "description": "Defines the prior distribution over initial states",
        "matrix_type": "prior",
        "matrix_data": [
          [
            0.2
          ],
          [
            0.2
          ],
          [
            0.4
          ],
          [
            0.1
          ],
          [
            0.1
          ]
        ],
        "row_labels": [
          "s1",
          "s2",
          "s3",
          "s4",
          "s5"
        ]
      }
    },
    {
      "id": "e_matrix",
      "type": "matrix",
      "label": "Policy Prior",
      "attributes": {
        "name": "Policy Prior",
        "symbol": "E",
        "dimensions": [
          2,
          1
        ],
        "description": "Defines the prior distribution over policies/actions",
        "matrix_type": "policy_prior",
        "matrix_data": [
          [
            0.5
          ],
          [
            0.5
          ]
        ],
        "row_labels": [
          "a1",
          "a2"
        ]
      }
    }
  ],
  "links": [
    {
      "source": "pomdp_model",
      "target": "observation_space",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "pomdp_model",
      "target": "state_space",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "pomdp_model",
      "target": "action_space",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "pomdp_model",
      "target": "a_matrix",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "pomdp_model",
      "target": "b_matrix",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "pomdp_model",
      "target": "c_matrix",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "pomdp_model",
      "target": "d_matrix",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "pomdp_model",
      "target": "e_matrix",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "a_matrix",
      "target": "observation_space",
      "type": "maps_from",
      "attributes": {}
    },
    {
      "source": "a_matrix",
      "target": "state_space",
      "type": "maps_to",
      "attributes": {}
    },
    {
      "source": "b_matrix",
      "target": "state_space",
      "type": "maps_from",
      "attributes": {}
    },
    {
      "source": "b_matrix",
      "target": "state_space",
      "type": "maps_to",
      "attributes": {}
    },
    {
      "source": "b_matrix",
      "target": "action_space",
      "type": "conditioned_on",
      "attributes": {}
    },
    {
      "source": "c_matrix",
      "target": "observation_space",
      "type": "evaluates",
      "attributes": {}
    },
    {
      "source": "d_matrix",
      "target": "state_space",
      "type": "distributes_over",
      "attributes": {}
    },
    {
      "source": "e_matrix",
      "target": "action_space",
      "type": "distributes_over",
      "attributes": {}
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