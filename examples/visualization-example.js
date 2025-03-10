/**
 * UltraLink Visualization Example
 * 
 * This example demonstrates how to generate visualizations in different formats
 * using the UltraLink visualization module.
 */

const fs = require('fs');
const path = require('path');
const { UltraLink } = require('../src');

// Create a new UltraLink instance
const ultralink = new UltraLink();

// Create a social network dataset
function createSocialNetwork() {
  // Create people
  ultralink.addEntity('Alice', 'person', {
    name: 'Alice Chen',
    age: 32,
    profession: 'Data Scientist',
    interests: ['Machine Learning', 'Visualization', 'Music'],
    bio: 'Alice is a data scientist specializing in network analysis and visualization.'
  });

  ultralink.addEntity('Bob', 'person', {
    name: 'Bob Smith',
    age: 28,
    profession: 'Software Engineer',
    interests: ['Programming', 'Gaming', 'Hiking'],
    bio: 'Bob is a software engineer with expertise in graph algorithms.'
  });

  ultralink.addEntity('Charlie', 'person', {
    name: 'Charlie Davis',
    age: 35,
    profession: 'UX Designer',
    interests: ['User Experience', 'Graphic Design', 'Photography'],
    bio: 'Charlie creates intuitive user interfaces for data-heavy applications.'
  });

  ultralink.addEntity('Diana', 'person', {
    name: 'Diana Wong',
    age: 40,
    profession: 'Project Manager',
    interests: ['Team Coordination', 'Strategic Planning', 'Travel'],
    bio: 'Diana manages cross-functional teams working on data visualization projects.'
  });

  // Create projects
  ultralink.addEntity('NetworkViz', 'project', {
    name: 'Network Visualization Tool',
    description: 'A tool for visualizing complex network data',
    startDate: '2023-03-15',
    status: 'In Progress'
  });
  
  ultralink.addEntity('DataInsights', 'project', {
    name: 'Data Insights Platform',
    description: 'Analytics platform for extracting insights from large datasets',
    startDate: '2022-11-01',
    status: 'Completed'
  });

  // Create technologies
  ultralink.addEntity('D3js', 'technology', {
    name: 'D3.js',
    description: 'JavaScript library for data visualization',
    website: 'https://d3js.org'
  });
  
  ultralink.addEntity('Cytoscape', 'technology', {
    name: 'Cytoscape.js',
    description: 'Graph theory library for visualization and analysis',
    website: 'https://js.cytoscape.org'
  });
  
  ultralink.addEntity('React', 'technology', {
    name: 'React',
    description: 'JavaScript library for building user interfaces',
    website: 'https://reactjs.org'
  });

  // Create relationships
  // Team connections
  ultralink.addLink('Alice', 'Bob', 'collaborates_with');
  ultralink.addLink('Bob', 'Alice', 'collaborates_with');
  ultralink.addLink('Alice', 'Charlie', 'collaborates_with');
  ultralink.addLink('Charlie', 'Alice', 'collaborates_with');
  ultralink.addLink('Diana', 'Alice', 'manages');
  ultralink.addLink('Alice', 'Diana', 'reports_to');
  ultralink.addLink('Bob', 'Charlie', 'collaborates_with');
  ultralink.addLink('Charlie', 'Bob', 'collaborates_with');
  ultralink.addLink('Diana', 'Bob', 'manages');
  ultralink.addLink('Bob', 'Diana', 'reports_to');
  ultralink.addLink('Diana', 'Charlie', 'manages');
  ultralink.addLink('Charlie', 'Diana', 'reports_to');
  
  // Project assignments
  ultralink.addLink('Alice', 'NetworkViz', 'works_on', { role: 'Lead Data Scientist' });
  ultralink.addLink('Bob', 'NetworkViz', 'works_on', { role: 'Backend Developer' });
  ultralink.addLink('Charlie', 'NetworkViz', 'works_on', { role: 'UX Designer' });
  ultralink.addLink('Diana', 'NetworkViz', 'manages_project');
  
  ultralink.addLink('Alice', 'DataInsights', 'works_on', { role: 'Data Analyst' });
  ultralink.addLink('Bob', 'DataInsights', 'works_on', { role: 'Frontend Developer' });

  // Technology usage
  ultralink.addLink('NetworkViz', 'D3js', 'uses_technology');
  ultralink.addLink('NetworkViz', 'Cytoscape', 'uses_technology');
  ultralink.addLink('NetworkViz', 'React', 'uses_technology');
  ultralink.addLink('DataInsights', 'D3js', 'uses_technology');
  ultralink.addLink('DataInsights', 'React', 'uses_technology');

  return ultralink;
}

// Generate visualizations in different formats
async function generateVisualizations() {
  try {
    console.log('Creating social network dataset...');
    createSocialNetwork();
    
    const outputDir = path.join(__dirname, 'output', 'visualizations');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate SVG visualization
    console.log('Generating SVG visualization...');
    const svgResult = await ultralink.toVisualization({ 
      format: 'svg',
      layout: 'force',
      style: 'default',
      width: 800,
      height: 600,
      includeLabels: true,
      title: 'Social Network Visualization'
    });
    
    fs.writeFileSync(path.join(outputDir, 'social-network.svg'), svgResult.data);
    console.log(`Saved SVG to ${path.join(outputDir, 'social-network.svg')}`);
    
    // Generate PNG visualization
    console.log('Generating PNG visualization...');
    const pngResult = await ultralink.toVisualization({ 
      format: 'png',
      layout: 'force',
      style: 'colorful',
      width: 1200,
      height: 900,
      includeLabels: true,
      title: 'Social Network Visualization (Colorful)'
    });
    
    fs.writeFileSync(path.join(outputDir, 'social-network.png'), pngResult.data);
    console.log(`Saved PNG to ${path.join(outputDir, 'social-network.png')}`);
    
    // Generate radial layout PNG visualization
    console.log('Generating radial layout PNG visualization...');
    const radialResult = await ultralink.toVisualization({ 
      format: 'png',
      layout: 'radial',
      style: 'colorful',
      width: 1200,
      height: 900,
      includeLabels: true,
      title: 'Social Network Visualization (Radial)'
    });
    
    fs.writeFileSync(path.join(outputDir, 'social-network-radial.png'), radialResult.data);
    console.log(`Saved radial PNG to ${path.join(outputDir, 'social-network-radial.png')}`);
    
    // Generate D3.js visualization
    console.log('Generating D3.js visualization...');
    const d3Result = await ultralink.toVisualization({ 
      format: 'd3',
      style: 'colorful',
      title: 'Interactive Social Network Visualization',
      description: 'This is an interactive visualization of a social network created with D3.js',
      includeControls: true
    });
    
    fs.writeFileSync(path.join(outputDir, 'social-network-d3.html'), d3Result.data);
    console.log(`Saved D3.js visualization to ${path.join(outputDir, 'social-network-d3.html')}`);
    
    // Generate Cytoscape.js visualization
    console.log('Generating Cytoscape.js visualization...');
    const cytoscapeResult = await ultralink.toVisualization({ 
      format: 'cytoscape',
      style: 'default',
      title: 'Interactive Graph Visualization with Cytoscape.js',
      description: 'This is an interactive visualization created with Cytoscape.js',
      includeControls: true
    });
    
    fs.writeFileSync(path.join(outputDir, 'social-network-cytoscape.html'), cytoscapeResult.data);
    console.log(`Saved Cytoscape.js visualization to ${path.join(outputDir, 'social-network-cytoscape.html')}`);
    
    console.log('All visualizations generated successfully!');
  } catch (error) {
    console.error('Error generating visualizations:', error);
  }
}

// Run the visualization generation
generateVisualizations(); 