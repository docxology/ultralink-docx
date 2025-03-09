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
  ultralink.createEntity('person', 'Alice', {
    name: 'Alice Chen',
    age: 32,
    profession: 'Data Scientist',
    interests: ['Machine Learning', 'Visualization', 'Music'],
    bio: 'Alice is a data scientist specializing in network analysis and visualization.'
  });

  ultralink.createEntity('person', 'Bob', {
    name: 'Bob Smith',
    age: 28,
    profession: 'Software Engineer',
    interests: ['Programming', 'Gaming', 'Hiking'],
    bio: 'Bob is a software engineer with expertise in graph algorithms.'
  });

  ultralink.createEntity('person', 'Charlie', {
    name: 'Charlie Davis',
    age: 35,
    profession: 'UX Designer',
    interests: ['User Experience', 'Graphic Design', 'Photography'],
    bio: 'Charlie creates intuitive user interfaces for data-heavy applications.'
  });

  ultralink.createEntity('person', 'Diana', {
    name: 'Diana Wong',
    age: 40,
    profession: 'Project Manager',
    interests: ['Team Coordination', 'Strategic Planning', 'Travel'],
    bio: 'Diana manages cross-functional teams working on data visualization projects.'
  });

  // Create projects
  ultralink.createEntity('project', 'NetworkViz', {
    name: 'Network Visualization Tool',
    description: 'A tool for visualizing complex network data',
    startDate: '2023-03-15',
    status: 'In Progress'
  });
  
  ultralink.createEntity('project', 'DataInsights', {
    name: 'Data Insights Platform',
    description: 'Analytics platform for extracting insights from large datasets',
    startDate: '2022-11-01',
    status: 'Completed'
  });

  // Create technologies
  ultralink.createEntity('technology', 'D3js', {
    name: 'D3.js',
    description: 'JavaScript library for data visualization',
    website: 'https://d3js.org'
  });
  
  ultralink.createEntity('technology', 'Cytoscape', {
    name: 'Cytoscape.js',
    description: 'Graph theory library for visualization and analysis',
    website: 'https://js.cytoscape.org'
  });
  
  ultralink.createEntity('technology', 'React', {
    name: 'React',
    description: 'JavaScript library for building user interfaces',
    website: 'https://reactjs.org'
  });

  // Create relationships
  // Team connections
  ultralink.createBidirectionalLink('Alice', 'Bob', 'collaborates_with');
  ultralink.createBidirectionalLink('Alice', 'Charlie', 'collaborates_with');
  ultralink.createBidirectionalLink('Diana', 'Alice', 'manages');
  ultralink.createBidirectionalLink('Bob', 'Charlie', 'collaborates_with');
  ultralink.createBidirectionalLink('Diana', 'Bob', 'manages');
  ultralink.createBidirectionalLink('Diana', 'Charlie', 'manages');
  
  // Project assignments
  ultralink.createLink('Alice', 'NetworkViz', 'works_on', { role: 'Lead Data Scientist' });
  ultralink.createLink('Bob', 'NetworkViz', 'works_on', { role: 'Backend Developer' });
  ultralink.createLink('Charlie', 'NetworkViz', 'works_on', { role: 'UX Designer' });
  ultralink.createLink('Diana', 'NetworkViz', 'manages_project');
  
  ultralink.createLink('Alice', 'DataInsights', 'works_on', { role: 'Data Analyst' });
  ultralink.createLink('Bob', 'DataInsights', 'works_on', { role: 'Frontend Developer' });
  
  // Technology usage
  ultralink.createLink('NetworkViz', 'D3js', 'uses_technology');
  ultralink.createLink('NetworkViz', 'Cytoscape', 'uses_technology');
  ultralink.createLink('NetworkViz', 'React', 'uses_technology');
  ultralink.createLink('DataInsights', 'D3js', 'uses_technology');
  ultralink.createLink('DataInsights', 'React', 'uses_technology');

  return ultralink;
}

// Ensure output directory exists
const outputDir = path.join(__dirname, 'output', 'visualizations');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate and save visualizations
async function generateVisualizations() {
  console.log('Creating social network dataset...');
  createSocialNetwork();
  console.log('Dataset created with entities and relationships.');
  
  // Generate SVG visualization
  console.log('Generating SVG visualization...');
  const svgOutput = await ultralink.toVisualization({ 
    format: 'svg',
    width: 1000,
    height: 800
  });
  fs.writeFileSync(path.join(outputDir, 'social-network.svg'), svgOutput['graph.svg']);
  console.log('SVG visualization saved to output/visualizations/social-network.svg');

  // Generate PNG visualization
  console.log('Generating PNG visualization...');
  try {
    const pngOutput = await ultralink.toVisualization({ 
      format: 'png',
      width: 1000,
      height: 800
    });
    fs.writeFileSync(path.join(outputDir, 'social-network.png'), pngOutput['graph.png']);
    console.log('PNG visualization saved to output/visualizations/social-network.png');
  } catch (error) {
    console.error('Error generating PNG visualization:', error.message);
    console.log('PNG generation requires the "sharp" library. Install with: npm install sharp');
  }

  // Generate D3 visualization
  console.log('Generating D3 visualization...');
  const d3Output = await ultralink.toVisualization({ 
    format: 'd3',
    width: 1000,
    height: 800
  });
  fs.writeFileSync(path.join(outputDir, 'social-network-d3.html'), d3Output['graph-d3.html']);
  console.log('D3 visualization saved to output/visualizations/social-network-d3.html');

  // Generate Cytoscape visualization
  console.log('Generating Cytoscape visualization...');
  const cytoOutput = await ultralink.toVisualization({ 
    format: 'cytoscape',
    width: 1000,
    height: 800
  });
  fs.writeFileSync(path.join(outputDir, 'social-network-cytoscape.html'), cytoOutput['graph-cytoscape.html']);
  console.log('Cytoscape visualization saved to output/visualizations/social-network-cytoscape.html');

  // Generate visualizations with different layouts
  console.log('Generating visualizations with different layouts...');
  
  // Grid layout
  const gridSvgOutput = await ultralink.toVisualization({ 
    format: 'svg',
    layout: 'grid',
    width: 1000,
    height: 800
  });
  fs.writeFileSync(path.join(outputDir, 'social-network-grid.svg'), gridSvgOutput['graph.svg']);
  console.log('Grid layout visualization saved to output/visualizations/social-network-grid.svg');
  
  // Radial layout
  const radialSvgOutput = await ultralink.toVisualization({ 
    format: 'svg',
    layout: 'radial',
    width: 1000,
    height: 800
  });
  fs.writeFileSync(path.join(outputDir, 'social-network-radial.svg'), radialSvgOutput['graph.svg']);
  console.log('Radial layout visualization saved to output/visualizations/social-network-radial.svg');

  console.log('\nAll visualizations have been generated successfully.');
  console.log('Open the HTML files in a web browser to see the interactive visualizations.');
}

// Run the example
generateVisualizations().catch(error => {
  console.error('Error generating visualizations:', error);
}); 