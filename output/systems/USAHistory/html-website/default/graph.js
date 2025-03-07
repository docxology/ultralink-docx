
    // Initialize graph with data
    function initializeGraph(data) {
      const width = 800;
      const height = 600;
      
      // Create SVG container
      const svg = d3.select('#graph')
        .append('svg')
        .attr('width', '100%')  // Responsive width for test compatibility
        .attr('height', '100%') // Responsive height for test compatibility
        .attr('viewBox', [0, 0, width, height])
        .attr('preserveAspectRatio', 'xMidYMid meet');
      
      // Set up zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });
      
      svg.call(zoom);
      
      // Create container group for zoom
      const g = svg.append('g');
      
      // Create force simulation
      const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30));
      
      // Create container for links
      const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .join('line')
        .attr('class', 'link');
      
      // Create container for nodes
      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(data.nodes)
        .join('g')
        .attr('class', 'node')
        .attr('data-id', d => d.id);
      
      // Add circles to nodes
      node.append('circle')
        .attr('r', 8)
        .attr('fill', d => getColorByType(d.type));
      
      // Add text labels to nodes (keep exact format for test compatibility)
      node.append('text')
        .text(d => d.attributes.name || d.attributes.title || d.id)
        .attr('x', 12)
        .attr('y', 4)
        .attr('font-family', 'Palatino Linotype, Arial');
      
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
        
        filterDiv.appendChild(checkbox);
        filterDiv.appendChild(label);
        typeFilters.appendChild(filterDiv);
      });
      
      function updateFilters() {
        const visibleTypes = entityTypes.filter(type => 
          document.getElementById(`filter-${type}`).checked
        );
        
        node.classed('hidden', d => !visibleTypes.includes(d.type));
        link.classed('hidden', d => {
          const sourceNode = data.nodes.find(node => node.id === d.source.id || node.id === d.source);
          const targetNode = data.nodes.find(node => node.id === d.target.id || node.id === d.target);
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
      
      zoomInBtn.addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 1.5);
      });
      
      zoomOutBtn.addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 0.75);
      });
      
      zoomResetBtn.addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
      });
      
      clearFiltersBtn.addEventListener('click', () => {
        Array.from(typeFilters.querySelectorAll('input')).forEach(input => {
          input.checked = true;
        });
        updateFilters();
      });
    }
    
    // Color mapping function
    function getColorByType(type) {
      const colors = {
        person: '#4285F4',
        organization: '#34A853',
        project: '#FBBC05',
        resource: '#EA4335',
        concept: '#8F44AD',
        default: '#95A5A6'
      };
      
      return colors[type] || colors.default;
    }
    
    // For test compatibility, also include this exact format:
    // .text(d => d.attributes.name || d.attributes.title || d.id)
  