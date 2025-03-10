// Graph visualization data
const data = {
  "nodes": [
    {
      "id": "linear_regression_model",
      "type": "model",
      "label": "Linear Regression Model",
      "attributes": {
        "name": "Linear Regression Model",
        "description": "A statistical model that examines the linear relationship between a dependent variable and independent variables",
        "domain": "statistics",
        "model_type": "regression",
        "assumptions": [
          "Linearity",
          "Independence of errors",
          "Homoscedasticity",
          "Normality of errors",
          "No multicollinearity"
        ]
      }
    },
    {
      "id": "dataset",
      "type": "data",
      "label": "Sample Dataset",
      "attributes": {
        "name": "Sample Dataset",
        "description": "Data used for building and validating the linear regression model",
        "data_points": 100,
        "features": [
          "x1",
          "x2",
          "x3"
        ],
        "target": "y",
        "split": {
          "training": 0.7,
          "testing": 0.3
        }
      }
    },
    {
      "id": "dependent_variable",
      "type": "variable",
      "label": "Dependent Variable (Y)",
      "attributes": {
        "name": "Dependent Variable (Y)",
        "symbol": "Y",
        "description": "The target variable to be predicted",
        "data_type": "continuous",
        "variance": 25.5,
        "mean": 50.2
      }
    },
    {
      "id": "independent_variable_x1",
      "type": "variable",
      "label": "Independent Variable X1",
      "attributes": {
        "name": "Independent Variable X1",
        "symbol": "X₁",
        "description": "First predictor variable",
        "data_type": "continuous",
        "variance": 12.3,
        "mean": 25.7
      }
    },
    {
      "id": "independent_variable_x2",
      "type": "variable",
      "label": "Independent Variable X2",
      "attributes": {
        "name": "Independent Variable X2",
        "symbol": "X₂",
        "description": "Second predictor variable",
        "data_type": "continuous",
        "variance": 8.7,
        "mean": 15.3
      }
    },
    {
      "id": "independent_variable_x3",
      "type": "variable",
      "label": "Independent Variable X3",
      "attributes": {
        "name": "Independent Variable X3",
        "symbol": "X₃",
        "description": "Third predictor variable",
        "data_type": "continuous",
        "variance": 5.2,
        "mean": 10.1
      }
    },
    {
      "id": "intercept",
      "type": "parameter",
      "label": "Intercept",
      "attributes": {
        "name": "Intercept",
        "symbol": "β₀",
        "description": "The y-intercept of the regression line",
        "value": 12.5,
        "standard_error": 1.2,
        "p_value": 0.001
      }
    },
    {
      "id": "coefficient_x1",
      "type": "parameter",
      "label": "Coefficient for X1",
      "attributes": {
        "name": "Coefficient for X1",
        "symbol": "β₁",
        "description": "The slope parameter for X1",
        "value": 2.3,
        "standard_error": 0.5,
        "p_value": 0.002
      }
    },
    {
      "id": "coefficient_x2",
      "type": "parameter",
      "label": "Coefficient for X2",
      "attributes": {
        "name": "Coefficient for X2",
        "symbol": "β₂",
        "description": "The slope parameter for X2",
        "value": 1.7,
        "standard_error": 0.3,
        "p_value": 0.008
      }
    },
    {
      "id": "coefficient_x3",
      "type": "parameter",
      "label": "Coefficient for X3",
      "attributes": {
        "name": "Coefficient for X3",
        "symbol": "β₃",
        "description": "The slope parameter for X3",
        "value": 0.8,
        "standard_error": 0.2,
        "p_value": 0.015
      }
    },
    {
      "id": "error_term",
      "type": "parameter",
      "label": "Error Term",
      "attributes": {
        "name": "Error Term",
        "symbol": "ε",
        "description": "The random error term in the regression model",
        "distribution": "normal",
        "mean": 0,
        "variance": 4.2
      }
    },
    {
      "id": "model_metrics",
      "type": "metrics",
      "label": "Model Quality Metrics",
      "attributes": {
        "name": "Model Quality Metrics",
        "description": "Statistical measures of model fit",
        "r_squared": 0.82,
        "adjusted_r_squared": 0.81,
        "f_statistic": 145.3,
        "f_p_value": 0.00001,
        "aic": 523.7,
        "bic": 537.2,
        "rmse": 2.05,
        "mae": 1.67
      }
    },
    {
      "id": "prediction",
      "type": "process",
      "label": "Regression Prediction",
      "attributes": {
        "name": "Regression Prediction",
        "description": "Process to generate predictions using the linear regression model",
        "formula": "Y = β₀ + β₁X₁ + β₂X₂ + β₃X₃ + ε",
        "steps": [
          "Collect feature values (X₁, X₂, X₃)",
          "Multiply each feature by its coefficient",
          "Sum all terms including the intercept",
          "Output the predicted value of Y"
        ]
      }
    },
    {
      "id": "training",
      "type": "process",
      "label": "Model Training",
      "attributes": {
        "name": "Model Training",
        "description": "Process to estimate model parameters from training data",
        "method": "Ordinary Least Squares (OLS)",
        "objective": "Minimize the sum of squared errors",
        "steps": [
          "Split data into training and testing sets",
          "Calculate coefficients using OLS formula",
          "Evaluate model fit on training data",
          "Validate model on testing data",
          "Calculate model quality metrics"
        ]
      }
    },
    {
      "id": "diagnostic_tests",
      "type": "process",
      "label": "Model Diagnostics",
      "attributes": {
        "name": "Model Diagnostics",
        "description": "Statistical tests to validate model assumptions",
        "tests": [
          {
            "name": "Durbin-Watson Test",
            "purpose": "Test for autocorrelation of residuals",
            "value": 2.05,
            "interpretation": "No significant autocorrelation"
          },
          {
            "name": "Breusch-Pagan Test",
            "purpose": "Test for heteroscedasticity",
            "value": 3.2,
            "p_value": 0.35,
            "interpretation": "Homoscedasticity assumption holds"
          },
          {
            "name": "Shapiro-Wilk Test",
            "purpose": "Test for normality of residuals",
            "value": 0.97,
            "p_value": 0.23,
            "interpretation": "Residuals approximately normal"
          },
          {
            "name": "Variance Inflation Factor",
            "purpose": "Test for multicollinearity",
            "values": {
              "X₁": 1.3,
              "X₂": 1.5,
              "X₃": 1.2
            },
            "interpretation": "No significant multicollinearity"
          }
        ]
      }
    }
  ],
  "links": [
    {
      "source": "linear_regression_model",
      "target": "dataset",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "dependent_variable",
      "type": "predicts",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "independent_variable_x1",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "independent_variable_x2",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "independent_variable_x3",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "intercept",
      "type": "has_parameter",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "coefficient_x1",
      "type": "has_parameter",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "coefficient_x2",
      "type": "has_parameter",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "coefficient_x3",
      "type": "has_parameter",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "error_term",
      "type": "includes",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "model_metrics",
      "type": "evaluated_by",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "prediction",
      "type": "performs",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "training",
      "type": "undergoes",
      "attributes": {}
    },
    {
      "source": "linear_regression_model",
      "target": "diagnostic_tests",
      "type": "validated_by",
      "attributes": {}
    },
    {
      "source": "coefficient_x1",
      "target": "independent_variable_x1",
      "type": "applies_to",
      "attributes": {}
    },
    {
      "source": "coefficient_x2",
      "target": "independent_variable_x2",
      "type": "applies_to",
      "attributes": {}
    },
    {
      "source": "coefficient_x3",
      "target": "independent_variable_x3",
      "type": "applies_to",
      "attributes": {}
    },
    {
      "source": "training",
      "target": "model_metrics",
      "type": "produces",
      "attributes": {}
    },
    {
      "source": "diagnostic_tests",
      "target": "model_metrics",
      "type": "validates",
      "attributes": {}
    },
    {
      "source": "prediction",
      "target": "dependent_variable",
      "type": "estimates",
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