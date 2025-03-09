/**
 * System-specific Content Visualization Generator
 * 
 * This module creates PNG visualizations for different system types
 * with embedded templated summaries and system-specific content.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Map of system types to their visualization configurations
const SYSTEM_TEMPLATES = {
  neurofeedback: {
    title: 'Neurofeedback Research System',
    summary: 'A system for analyzing EEG neurofeedback research data, including alpha and SMR training protocols for ADHD and anxiety treatments.',
    nodeTypes: ['EEG Data', 'Alpha Training', 'SMR Training', 'ADHD Treatment', 'Anxiety Treatment'],
    colorScheme: ['#4682b4', '#3cb371', '#9370db', '#ff7f50', '#da70d6'],
    metrics: [
      { label: 'Training Sessions', value: '42' },
      { label: 'Success Rate', value: '78%' },
      { label: 'Avg. Session Duration', value: '45 min' }
    ]
  },
  neurofeedbackresearch: {
    title: 'Neurofeedback Research System',
    summary: 'A comprehensive system for analyzing EEG neurofeedback research data, protocols, and treatment outcomes.',
    nodeTypes: ['EEG Data', 'Alpha Training', 'SMR Training', 'ADHD Treatment', 'Anxiety Treatment'],
    colorScheme: ['#4682b4', '#3cb371', '#9370db', '#ff7f50', '#da70d6'],
    metrics: [
      { label: 'Training Sessions', value: '42' },
      { label: 'Success Rate', value: '78%' },
      { label: 'Avg. Session Duration', value: '45 min' }
    ]
  },
  car: {
    title: 'Automotive System Model',
    summary: 'A knowledge graph representing automotive systems, including engine, electrical, wheel, and interior subsystems and their relationships.',
    nodeTypes: ['Sedan Model', 'Engine System', 'Electrical System', 'Wheel System', 'Interior System'],
    colorScheme: ['#4682b4', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'],
    metrics: [
      { label: 'Components', value: '214' },
      { label: 'Subsystems', value: '18' },
      { label: 'Connections', value: '342' }
    ]
  },
  pomdp: {
    title: 'POMDP Model Visualization',
    summary: 'Partially Observable Markov Decision Process model with observation, state, and action spaces, plus transition and observation matrices.',
    nodeTypes: ['POMDP Model', 'Observation Space', 'State Space', 'Action Space', 'A Matrix', 'B Matrix'],
    colorScheme: ['#4682b4', '#3cb371', '#9370db', '#ff7f50', '#da70d6', '#20b2aa'],
    metrics: [
      { label: 'States', value: '12' },
      { label: 'Actions', value: '8' },
      { label: 'Observations', value: '10' }
    ]
  },
  humananatomy: {
    title: 'Human Anatomy System',
    summary: 'A comprehensive knowledge graph of human anatomical systems, organs, tissues, and their functional relationships.',
    nodeTypes: ['Organ System', 'Organ', 'Tissue', 'Cell Type', 'Function'],
    colorScheme: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'],
    metrics: [
      { label: 'Systems', value: '8' },
      { label: 'Major Organs', value: '24' },
      { label: 'Tissue Types', value: '4' },
      { label: 'Cell Types', value: '200+' }
    ]
  },
  desertecosystem: {
    title: 'Desert Ecosystem Model',
    summary: 'A knowledge graph representing desert flora, fauna, environmental factors, and their ecological relationships.',
    nodeTypes: ['Plants', 'Animals', 'Environmental Factors', 'Adaptations', 'Interactions'],
    colorScheme: ['#d35400', '#f39c12', '#e67e22', '#7f8c8d', '#16a085'],
    metrics: [
      { label: 'Plant Species', value: '48' },
      { label: 'Animal Species', value: '37' },
      { label: 'Climate Factors', value: '12' },
      { label: 'Adaptations', value: '64' }
    ]
  },
  researchteam: {
    title: 'Research Team Collaboration Network',
    summary: 'A knowledge graph representing research team members, projects, publications, resources, and collaboration networks.',
    nodeTypes: ['Researchers', 'Projects', 'Publications', 'Resources', 'Topics'],
    colorScheme: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'],
    metrics: [
      { label: 'Team Members', value: '7' },
      { label: 'Active Projects', value: '5' },
      { label: 'Publications', value: '12' },
      { label: 'Research Areas', value: '8' }
    ]
  },
  activeinferencelab: {
    title: 'Active Inference Research Lab',
    summary: 'A knowledge graph representing active inference research, including models, experiments, team members, and findings.',
    nodeTypes: ['Researchers', 'Models', 'Experiments', 'Concepts', 'Publications'],
    colorScheme: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'],
    metrics: [
      { label: 'Team Members', value: '7' },
      { label: 'Active Projects', value: '3' },
      { label: 'Publications', value: '5' },
      { label: 'Research Years', value: '4' }
    ]
  },
  usahistory: {
    title: 'USA History Knowledge Graph',
    summary: 'A comprehensive knowledge graph of United States historical events, figures, periods, and their relationships.',
    nodeTypes: ['Events', 'People', 'Time Periods', 'Documents', 'Locations'],
    colorScheme: ['#1f77b4', '#d62728', '#2ca02c', '#9467bd', '#8c564b'],
    metrics: [
      { label: 'Major Events', value: '120' },
      { label: 'Historical Figures', value: '85' },
      { label: 'Time Periods', value: '15' },
      { label: 'Key Documents', value: '24' }
    ]
  },
  default: {
    title: 'Knowledge Graph System',
    summary: 'A general knowledge graph system representing entities and their relationships with customizable node and edge properties.',
    nodeTypes: ['System Core', 'Entity Type A', 'Entity Type B', 'Entity Type C', 'Entity Type D'],
    colorScheme: ['#4682b4', '#3cb371', '#ff7f50', '#9370db', '#da70d6'],
    metrics: [
      { label: 'Entities', value: '124' },
      { label: 'Relationships', value: '357' },
      { label: 'Properties', value: '42' }
    ]
  }
};

/**
 * Generate a system-specific visualization with templated summary as PNG
 * 
 * @param {string} systemType - Type of system to visualize
 * @param {Object} options - Visualization options
 * @param {number} options.width - Width of the output PNG
 * @param {number} options.height - Height of the output PNG
 * @param {string} options.outputDir - Directory to save the output PNG
 * @param {string} options.filename - Filename for the output PNG
 * @param {string} options.layout - Layout style ('force', 'radial', 'grid', 'cluster')
 * @param {string} options.style - Visual style ('default', 'colorful', 'grayscale', 'minimal') 
 * @returns {Promise<string>} Path to the generated PNG file
 */
async function generateSystemVisualization(systemType, options = {}) {
  // Normalize system type to lowercase for template lookup
  const normalizedSystemType = systemType.toLowerCase();
  
  // Get template for the system type (default if not found)
  const template = SYSTEM_TEMPLATES[normalizedSystemType] || SYSTEM_TEMPLATES.default;
  
  // Set defaults
  const width = options.width || 1200;
  const height = options.height || 900;
  const outputDir = options.outputDir || path.join(process.cwd(), 'output', 'visualizations');
  const filename = options.filename || `${normalizedSystemType}-system-visualization.png`;
  const layout = options.layout || 'force';
  const style = options.style || 'default';
  
  // Create output directory if it doesn't exist
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Generate SVG visualization with templated summary
  const svgString = generateSystemSVG(systemType, template, width, height, layout, style);
  
  // Convert SVG to PNG
  const pngBuffer = await sharp(Buffer.from(svgString))
    .resize({
      width: width,
      height: height,
      fit: 'contain'
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      quality: 100
    })
    .withMetadata({
      density: 300 // High density for better quality
    })
    .toBuffer();
  
  // Save PNG to file
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, pngBuffer);
  
  console.log(`Generated system visualization for ${systemType} at: ${outputPath}`);
  
  return outputPath;
}

/**
 * Generate SVG string with system-specific visualization and templated summary
 * 
 * @param {string} systemType - Type of system
 * @param {Object} template - System template configuration
 * @param {number} width - Width of the SVG
 * @param {number} height - Height of the SVG
 * @param {string} layout - Layout style ('force', 'radial', 'grid', 'cluster')
 * @param {string} style - Visual style ('default', 'colorful', 'grayscale', 'minimal')
 * @returns {string} SVG string
 */
function generateSystemSVG(systemType, template, width, height, layout = 'force', style = 'default') {
  // Normalize system type for display
  const displaySystemType = systemType.charAt(0).toUpperCase() + systemType.slice(1).toLowerCase();
  
  // Adjust colors based on style
  let colorScheme = [...template.colorScheme];
  if (style === 'grayscale') {
    colorScheme = colorScheme.map(() => ['#333', '#555', '#777', '#999', '#bbb'][Math.floor(Math.random() * 5)]);
  } else if (style === 'minimal') {
    colorScheme = colorScheme.map(() => '#456');
  } else if (style === 'colorful') {
    // Enhance saturation for colorful style
    colorScheme = colorScheme.map(color => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgb(${Math.min(r + 20, 255)}, ${Math.min(g + 20, 255)}, ${Math.min(b + 20, 255)})`;
    });
  }
  
  // Start SVG with required namespace and styling
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f5f7fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c3cfe2;stop-opacity:1" />
    </linearGradient>
    <style>
      text { font-family: Arial, sans-serif; }
      .title { font-size: 24px; font-weight: bold; fill: #333; }
      .summary { font-size: 14px; fill: #555; }
      .node-label { font-size: 14px; fill: white; font-weight: bold; }
      .metric-label { font-size: 12px; fill: #555; }
      .metric-value { font-size: 14px; fill: #333; font-weight: bold; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGradient)" />
  
  <!-- Content area -->
  <rect x="40" y="40" width="${width-80}" height="${height-80}" rx="10" fill="#fff" stroke="#ddd" stroke-width="1" />
  
  <!-- Title and system info -->
  <text x="60" y="80" class="title">${template.title}</text>
  <text x="60" y="110" class="summary">${template.summary}</text>
  
  <!-- System date and info -->
  <text x="${width-60}" y="80" text-anchor="end" font-size="14" fill="#666">Generated: ${new Date().toLocaleDateString()}</text>
  <text x="${width-60}" y="100" text-anchor="end" font-size="14" fill="#666">System ID: ${systemType.toUpperCase()}-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}</text>
  <text x="${width-60}" y="120" text-anchor="end" font-size="14" fill="#666">Layout: ${layout} / Style: ${style}</text>
  
  <!-- Visualization area -->
  <g transform="translate(0, 50)">`;
  
  // Add system-specific visualization based on layout
  switch(layout) {
    case 'radial':
      svg += generateRadialLayout(template, width, height, colorScheme);
      break;
    case 'grid':
      svg += generateGridLayout(template, width, height, colorScheme);
      break;
    case 'cluster':
      svg += generateClusterLayout(template, width, height, colorScheme);
      break;
    case 'force':
    default:
      svg += generateForceLayout(template, width, height, colorScheme);
      break;
  }
  
  // Add metrics panel
  svg += `
  <!-- Metrics panel -->
  <rect x="${width-280}" y="${height-220}" width="220" height="140" rx="5" fill="#f8f9fa" stroke="#ddd" stroke-width="1" />
  <text x="${width-270}" y="${height-190}" font-size="16" fill="#333" font-weight="bold">System Metrics</text>
  `;
  
  // Add metrics
  template.metrics.forEach((metric, index) => {
    const y = height - 160 + (index * 30);
    svg += `
    <text x="${width-270}" y="${y}" class="metric-label">${metric.label}:</text>
    <text x="${width-120}" y="${y}" class="metric-value">${metric.value}</text>
    `;
  });
  
  // Close SVG
  svg += `
  </g>
</svg>`;
  
  return svg;
}

/**
 * Generate a force-directed layout visualization
 */
function generateForceLayout(template, width, height, colorScheme) {
  const centerX = width / 2;
  const centerY = height / 2;
  const mainNodeRadius = 50;
  const subNodeRadius = 35;
  
  let nodesAndLinks = `
  <!-- System nodes (Force Layout) -->
  <g class="nodes">
    <!-- Main node -->
    <g class="node" transform="translate(${centerX}, ${centerY})">
      <circle r="${mainNodeRadius}" fill="${colorScheme[0]}" stroke="#333" stroke-width="2"></circle>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" class="node-label">${template.nodeTypes[0]}</text>
    </g>`;
  
  // Generate sub-nodes in a semi-random pattern around the main node
  const subNodeCount = template.nodeTypes.length - 1;
  const radius = 220; // Base distance from center
  
  for (let i = 0; i < subNodeCount; i++) {
    // Add some variation to the positions
    const angle = (i * 2 * Math.PI) / subNodeCount + (Math.random() * 0.3);
    const distance = radius + (Math.random() * 70 - 35);
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    
    nodesAndLinks += `
    <g class="node" transform="translate(${x}, ${y})">
      <circle r="${subNodeRadius - (Math.random() * 10)}" fill="${colorScheme[i+1]}" stroke="#333" stroke-width="1.5"></circle>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" class="node-label">${template.nodeTypes[i+1]}</text>
    </g>`;
  }
  
  nodesAndLinks += `
  </g>
  
  <!-- System links (Force Layout) -->
  <g class="links">`;
  
  // Generate links from main node to sub-nodes
  for (let i = 0; i < subNodeCount; i++) {
    const angle = (i * 2 * Math.PI) / subNodeCount + (Math.random() * 0.3);
    const distance = radius + (Math.random() * 70 - 35);
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    
    nodesAndLinks += `
    <path d="M${centerX},${centerY} L${x},${y}" stroke="#666" stroke-width="2" stroke-opacity="0.6" fill="none"></path>`;
  }
  
  // Generate some connections between sub-nodes
  for (let i = 0; i < subNodeCount; i++) {
    // Connect to a random number of other nodes (1-3)
    const connectionsCount = Math.floor(Math.random() * 3) + 1;
    
    for (let c = 0; c < connectionsCount; c++) {
      const j = (i + c + 1) % subNodeCount;
      
      const angle1 = (i * 2 * Math.PI) / subNodeCount + (Math.random() * 0.3);
      const distance1 = radius + (Math.random() * 70 - 35);
      const x1 = centerX + distance1 * Math.cos(angle1);
      const y1 = centerY + distance1 * Math.sin(angle1);
      
      const angle2 = (j * 2 * Math.PI) / subNodeCount + (Math.random() * 0.3);
      const distance2 = radius + (Math.random() * 70 - 35);
      const x2 = centerX + distance2 * Math.cos(angle2);
      const y2 = centerY + distance2 * Math.sin(angle2);
      
      // Only add some connections to avoid clutter
      if (Math.random() > 0.6) {
        nodesAndLinks += `
        <path d="M${x1},${y1} L${x2},${y2}" stroke="#999" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="5,5" fill="none"></path>`;
      }
    }
  }
  
  nodesAndLinks += `
  </g>`;
  
  return nodesAndLinks;
}

/**
 * Generate a radial layout visualization
 */
function generateRadialLayout(template, width, height, colorScheme) {
  const centerX = width / 2;
  const centerY = height / 2;
  const mainNodeRadius = 60;
  const subNodeRadius = 40;
  
  let nodesAndLinks = `
  <!-- System nodes (Radial Layout) -->
  <g class="nodes">
    <!-- Main node -->
    <g class="node" transform="translate(${centerX}, ${centerY})">
      <circle r="${mainNodeRadius}" fill="${colorScheme[0]}" stroke="#333" stroke-width="2"></circle>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" class="node-label">${template.nodeTypes[0]}</text>
    </g>`;
  
  // Generate sub-nodes in a perfect circle around the main node
  const subNodeCount = template.nodeTypes.length - 1;
  const radius = 250; // Fixed distance from center for perfect circle
  
  for (let i = 0; i < subNodeCount; i++) {
    const angle = (i * 2 * Math.PI) / subNodeCount;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    nodesAndLinks += `
    <g class="node" transform="translate(${x}, ${y})">
      <circle r="${subNodeRadius}" fill="${colorScheme[i+1]}" stroke="#333" stroke-width="1.5"></circle>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" class="node-label">${template.nodeTypes[i+1]}</text>
    </g>`;
  }
  
  nodesAndLinks += `
  </g>
  
  <!-- System links (Radial Layout) -->
  <g class="links">`;
  
  // Generate links from main node to sub-nodes
  for (let i = 0; i < subNodeCount; i++) {
    const angle = (i * 2 * Math.PI) / subNodeCount;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    nodesAndLinks += `
    <path d="M${centerX},${centerY} L${x},${y}" stroke="#666" stroke-width="2" stroke-opacity="0.6" fill="none"></path>`;
  }
  
  // Generate ring connecting all sub-nodes
  nodesAndLinks += `
  <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#999" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="5,5"></circle>`;
  
  nodesAndLinks += `
  </g>`;
  
  return nodesAndLinks;
}

/**
 * Generate a grid layout visualization
 */
function generateGridLayout(template, width, height, colorScheme) {
  const centerX = width / 2;
  const centerY = height / 2;
  const mainNodeRadius = 50;
  const subNodeRadius = 35;
  
  let nodesAndLinks = `
  <!-- System nodes (Grid Layout) -->
  <g class="nodes">
    <!-- Main node -->
    <g class="node" transform="translate(${centerX}, ${centerY})">
      <rect x="-60" y="-60" width="120" height="120" rx="10" fill="${colorScheme[0]}" stroke="#333" stroke-width="2"></rect>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" class="node-label">${template.nodeTypes[0]}</text>
    </g>`;
  
  // Calculate grid dimensions
  const subNodeCount = template.nodeTypes.length - 1;
  const cols = Math.ceil(Math.sqrt(subNodeCount));
  const rows = Math.ceil(subNodeCount / cols);
  
  // Calculate grid coordinates
  const startX = centerX - (((cols - 1) * 200) / 2);
  const startY = centerY - (((rows - 1) * 150) / 2);
  
  // Place nodes in grid, skipping the center position
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip if we've placed all nodes
      if (index >= subNodeCount) continue;
      
      const x = startX + (col * 200);
      const y = startY + (row * 150);
      
      // Skip the center position (where the main node is)
      if (Math.abs(x - centerX) < 50 && Math.abs(y - centerY) < 50) {
        continue;
      }
      
      nodesAndLinks += `
      <g class="node" transform="translate(${x}, ${y})">
        <rect x="-45" y="-35" width="90" height="70" rx="5" fill="${colorScheme[index+1]}" stroke="#333" stroke-width="1.5"></rect>
        <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" class="node-label">${template.nodeTypes[index+1]}</text>
      </g>`;
      
      index++;
    }
  }
  
  nodesAndLinks += `
  </g>
  
  <!-- System links (Grid Layout) -->
  <g class="links">`;
  
  // Reset index for links
  index = 0;
  
  // Generate links from main node to sub-nodes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip if we've processed all nodes
      if (index >= subNodeCount) continue;
      
      const x = startX + (col * 200);
      const y = startY + (row * 150);
      
      // Skip the center position
      if (Math.abs(x - centerX) < 50 && Math.abs(y - centerY) < 50) {
        continue;
      }
      
      nodesAndLinks += `
      <path d="M${centerX},${centerY} L${x},${y}" stroke="#666" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="5,5" fill="none"></path>`;
      
      index++;
    }
  }
  
  nodesAndLinks += `
  </g>`;
  
  return nodesAndLinks;
}

/**
 * Generate a cluster layout visualization
 */
function generateClusterLayout(template, width, height, colorScheme) {
  const centerX = width / 2;
  const centerY = height / 2;
  const mainNodeRadius = 70;
  const subNodeRadius = 30;
  
  let nodesAndLinks = `
  <!-- System nodes (Cluster Layout) -->
  <g class="nodes">
    <!-- Main node -->
    <g class="node" transform="translate(${centerX}, ${centerY})">
      <circle r="${mainNodeRadius}" fill="${colorScheme[0]}" stroke="#333" stroke-width="2"></circle>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" class="node-label">${template.nodeTypes[0]}</text>
    </g>`;
  
  // Generate clusters of sub-nodes
  const subNodeCount = template.nodeTypes.length - 1;
  const clusterCount = Math.min(3, subNodeCount);
  const nodesPerCluster = Math.ceil(subNodeCount / clusterCount);
  
  // Create clusters
  for (let c = 0; c < clusterCount; c++) {
    const clusterAngle = (c * 2 * Math.PI) / clusterCount;
    const clusterDistance = 220;
    const clusterX = centerX + clusterDistance * Math.cos(clusterAngle);
    const clusterY = centerY + clusterDistance * Math.sin(clusterAngle);
    
    // Add nodes to cluster
    for (let i = 0; i < nodesPerCluster; i++) {
      const nodeIndex = c * nodesPerCluster + i;
      if (nodeIndex >= subNodeCount) continue;
      
      const nodeAngle = clusterAngle + ((i * 2 * Math.PI) / (nodesPerCluster * 3)) - Math.PI/4;
      const nodeDistance = 80;
      const x = clusterX + nodeDistance * Math.cos(nodeAngle);
      const y = clusterY + nodeDistance * Math.sin(nodeAngle);
      
      nodesAndLinks += `
      <g class="node" transform="translate(${x}, ${y})">
        <circle r="${subNodeRadius}" fill="${colorScheme[nodeIndex+1]}" stroke="#333" stroke-width="1.5"></circle>
        <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" class="node-label">${template.nodeTypes[nodeIndex+1]}</text>
      </g>`;
    }
  }
  
  nodesAndLinks += `
  </g>
  
  <!-- System links (Cluster Layout) -->
  <g class="links">`;
  
  // Create cluster centers (invisible)
  for (let c = 0; c < clusterCount; c++) {
    const clusterAngle = (c * 2 * Math.PI) / clusterCount;
    const clusterDistance = 220;
    const clusterX = centerX + clusterDistance * Math.cos(clusterAngle);
    const clusterY = centerY + clusterDistance * Math.sin(clusterAngle);
    
    // Link from main node to cluster
    nodesAndLinks += `
    <path d="M${centerX},${centerY} L${clusterX},${clusterY}" stroke="#666" stroke-width="2.5" stroke-opacity="0.6" fill="none"></path>`;
    
    // Add nodes to cluster and link them
    for (let i = 0; i < nodesPerCluster; i++) {
      const nodeIndex = c * nodesPerCluster + i;
      if (nodeIndex >= subNodeCount) continue;
      
      const nodeAngle = clusterAngle + ((i * 2 * Math.PI) / (nodesPerCluster * 3)) - Math.PI/4;
      const nodeDistance = 80;
      const x = clusterX + nodeDistance * Math.cos(nodeAngle);
      const y = clusterY + nodeDistance * Math.sin(nodeAngle);
      
      // Link from cluster center to node
      nodesAndLinks += `
      <path d="M${clusterX},${clusterY} L${x},${y}" stroke="#999" stroke-width="1.5" stroke-opacity="0.4" fill="none"></path>`;
    }
  }
  
  nodesAndLinks += `
  </g>`;
  
  return nodesAndLinks;
}

/**
 * Generate and save system-specific visualizations for all known system types
 * 
 * @param {Object} options - Options for visualization generation
 * @returns {Promise<Object>} Object mapping system types to output file paths
 */
async function generateAllSystemVisualizations(options = {}) {
  const results = {};
  
  for (const systemType of Object.keys(SYSTEM_TEMPLATES)) {
    // Skip the default template when generating all
    if (systemType === 'default') continue;
    
    const outputPath = await generateSystemVisualization(systemType, options);
    results[systemType] = outputPath;
  }
  
  return results;
}

module.exports = {
  generateSystemVisualization,
  generateAllSystemVisualizations,
  generateSystemSVG,
  SYSTEM_TEMPLATES
}; 