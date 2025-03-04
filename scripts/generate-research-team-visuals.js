const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createCanvas } = require('canvas');
const d3 = require('d3');

const OUTPUT_DIR = path.join(__dirname, '../output/research-team');
const VISUALS_DIR = path.join(OUTPUT_DIR, 'visuals');

// Ensure visuals directory exists
if (!fs.existsSync(VISUALS_DIR)) {
  fs.mkdirSync(VISUALS_DIR, { recursive: true });
}

/**
 * Generate all visual outputs for the research team data
 */
async function generateVisuals() {
  console.log('Generating research team visualizations...');

  try {
    // 1. Generate graph visualization from DOT
    console.log('Generating graph visualization...');
    execSync(`dot -Tpng "${path.join(OUTPUT_DIR, 'graph/research-team.dot')}" -o "${path.join(VISUALS_DIR, 'research-team-graph.png')}"`);
    execSync(`dot -Tsvg "${path.join(OUTPUT_DIR, 'graph/research-team.dot')}" -o "${path.join(VISUALS_DIR, 'research-team-graph.svg')}"`);

    // 2. Load and parse JSON data
    console.log('Loading research team data...');
    const jsonData = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'raw/research-team.json'), 'utf8'));

    // 3. Generate vector space visualization
    console.log('Generating vector space visualization...');
    await generateVectorSpaceVisualization(jsonData);

    // 4. Generate temporal heatmap
    console.log('Generating temporal heatmap...');
    await generateTemporalHeatmap(jsonData);

    // 5. Generate impact analysis chart
    console.log('Generating impact analysis chart...');
    await generateImpactChart(jsonData);

    // 6. Generate cluster visualization
    console.log('Generating cluster visualization...');
    await generateClusterVisualization(jsonData);

    // 7. Generate network overview
    console.log('Generating network overview...');
    await generateNetworkOverview(jsonData);

    console.log('All visualizations generated successfully!');
    
  } catch (error) {
    console.error('Error generating visualizations:', error);
    process.exit(1);
  }
}

/**
 * Generate a 2D visualization of the vector space
 */
async function generateVectorSpaceVisualization(data) {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // Extract entities with vector embeddings
  const entities = data.entities.filter(e => e.attributes.vector);
  
  // Use t-SNE or UMAP for dimensionality reduction (simplified here)
  const points = entities.map((e, i) => ({
    x: e.attributes.vector.embedding[0] * 400 + 400,
    y: e.attributes.vector.embedding[1] * 300 + 300,
    cluster: e.attributes.vector.cluster,
    id: e.id
  }));

  // Draw background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, 800, 600);

  // Draw title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Vector Space Visualization', 20, 30);

  // Draw legend
  const clusters = [...new Set(points.map(p => p.cluster))];
  clusters.forEach((cluster, i) => {
    const y = 50 + i * 20;
    ctx.fillStyle = getClusterColor(cluster);
    ctx.beginPath();
    ctx.arc(30, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(cluster, 45, y + 4);
  });

  // Draw points
  points.forEach(point => {
    // Draw connection lines to centroid
    const centroid = points.find(p => p.cluster === point.cluster && p.id.includes('centroid'));
    if (centroid) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(centroid.x, centroid.y);
      ctx.strokeStyle = getClusterColor(point.cluster, 0.2);
      ctx.stroke();
    }

    // Draw point
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = getClusterColor(point.cluster);
    ctx.fill();
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.fillText(point.id, point.x + 7, point.y + 4);
  });

  // Save visualization
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(VISUALS_DIR, 'vector-space.png'), buffer);
}

/**
 * Generate a temporal heatmap visualization
 */
async function generateTemporalHeatmap(data) {
  const canvas = createCanvas(1000, 400);
  const ctx = canvas.getContext('2d');

  const evolution = data.metadata.temporal_analysis.knowledge_evolution;
  const timeframes = evolution.map(e => e.timeframe);
  const cellWidth = 900 / timeframes.length;
  const cellHeight = 30;

  // Draw background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1000, 400);

  // Draw title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Knowledge Evolution Timeline', 20, 30);

  // Draw heatmap cells
  evolution.forEach((event, i) => {
    const x = 50 + i * cellWidth;
    event.key_developments.forEach((dev, j) => {
      const y = 50 + j * cellHeight;
      
      // Heat color based on impact score
      const intensity = Math.floor(event.impact_score * 255);
      ctx.fillStyle = `rgb(${intensity}, ${Math.floor(intensity * 0.8)}, 255)`;
      ctx.fillRect(x, y, cellWidth - 2, cellHeight - 2);
      
      // Add text
      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';
      ctx.fillText(dev, x + 4, y + cellHeight - 8);
    });
    
    // Add timeframe labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(event.timeframe, x, 30);
  });

  // Draw legend
  const legendY = 350;
  const gradient = ctx.createLinearGradient(50, legendY, 200, legendY);
  gradient.addColorStop(0, 'rgb(0, 0, 255)');
  gradient.addColorStop(1, 'rgb(255, 204, 255)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(50, legendY, 150, 20);
  
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.fillText('Low Impact', 50, legendY + 35);
  ctx.fillText('High Impact', 150, legendY + 35);

  // Save visualization
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(VISUALS_DIR, 'temporal-heatmap.png'), buffer);
}

/**
 * Generate impact analysis chart
 */
async function generateImpactChart(data) {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');

  // Get publication entities
  const publications = data.entities.filter(e => e.type === 'publication');
  
  // Sort by impact
  publications.sort((a, b) => 
    (b.attributes.impact_metrics?.citation_network?.impact_score || 0) -
    (a.attributes.impact_metrics?.citation_network?.impact_score || 0)
  );

  // Draw background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 400);

  // Draw title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Publication Impact Analysis', 20, 30);

  // Draw bars
  const barWidth = 600 / publications.length;
  publications.forEach((pub, i) => {
    const impact = pub.attributes.impact_metrics?.citation_network?.impact_score || 0;
    const height = impact * 300;
    
    // Draw bar
    ctx.fillStyle = `hsl(210, 80%, ${50 + impact * 20}%)`;
    ctx.fillRect(100 + i * barWidth, 350 - height, barWidth - 4, height);
    
    // Add impact score
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.fillText(impact.toFixed(2), 100 + i * barWidth, 345 - height);
    
    // Add labels
    ctx.save();
    ctx.translate(100 + i * barWidth + barWidth/2, 360);
    ctx.rotate(-Math.PI/4);
    ctx.fillText(pub.id, 0, 0);
    ctx.restore();
  });

  // Draw axes
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(90, 50);
  ctx.lineTo(90, 350);
  ctx.lineTo(750, 350);
  ctx.stroke();

  // Add axis labels
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.save();
  ctx.translate(30, 200);
  ctx.rotate(-Math.PI/2);
  ctx.fillText('Impact Score', 0, 0);
  ctx.restore();
  ctx.fillText('Publications', 400, 390);

  // Save visualization
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(VISUALS_DIR, 'impact-analysis.png'), buffer);
}

/**
 * Generate cluster visualization
 */
async function generateClusterVisualization(data) {
  const canvas = createCanvas(1000, 600);
  const ctx = canvas.getContext('2d');

  const clusters = data.metadata.cluster_analysis;
  
  // Draw background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1000, 600);

  // Draw title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Research Cluster Analysis', 20, 30);

  // Draw clusters
  let y = 50;
  clusters.forEach(cluster => {
    // Cluster header
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(cluster.name, 50, y);
    
    // Cluster metrics
    ctx.font = '12px Arial';
    ctx.fillText(`Coherence: ${cluster.coherence.toFixed(2)}`, 50, y + 20);
    
    // Draw members
    const memberY = y + 40;
    cluster.members.forEach((member, i) => {
      const x = 50 + (i % 3) * 300;
      const localY = memberY + Math.floor(i / 3) * 60;
      
      // Member box
      ctx.fillStyle = getClusterColor(cluster.name, 0.2);
      ctx.fillRect(x, localY, 280, 50);
      
      // Member info
      const entity = data.entities.find(e => e.id === member);
      if (entity) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(entity.id, x + 10, localY + 20);
        ctx.font = '10px Arial';
        ctx.fillText(`Type: ${entity.type}`, x + 10, localY + 35);
        
        // Add vector info if available
        if (entity.attributes.vector) {
          ctx.fillText(`Centroid Distance: ${entity.attributes.vector.centroid_distance.toFixed(2)}`, x + 10, localY + 45);
        }
      }
    });
    
    y += 40 + Math.ceil(cluster.members.length / 3) * 60 + 30;
  });

  // Save visualization
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(VISUALS_DIR, 'cluster-analysis.png'), buffer);
}

/**
 * Generate network overview visualization
 */
async function generateNetworkOverview(data) {
  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1200, 800);

  // Draw title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Research Network Overview', 20, 30);

  // Calculate network statistics
  const stats = {
    totalEntities: data.entities.length,
    entityTypes: new Map(),
    totalLinks: 0,
    linkTypes: new Map()
  };

  // Collect entity statistics
  data.entities.forEach(entity => {
    stats.entityTypes.set(
      entity.type,
      (stats.entityTypes.get(entity.type) || 0) + 1
    );
  });

  // Draw entity type distribution
  ctx.font = '14px Arial';
  ctx.fillText('Entity Distribution:', 50, 70);
  
  let y = 90;
  for (const [type, count] of stats.entityTypes) {
    const barWidth = count * 20;
    ctx.fillStyle = getTypeColor(type, 0.7);
    ctx.fillRect(50, y, barWidth, 20);
    ctx.fillStyle = '#333';
    ctx.fillText(`${type} (${count})`, 60 + barWidth, y + 15);
    y += 30;
  }

  // Draw network metrics
  y += 20;
  ctx.fillStyle = '#333';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Network Metrics:', 50, y);
  y += 25;
  ctx.font = '12px Arial';
  
  const metrics = data.metadata.graph_metrics;
  const metricLabels = {
    density: 'Graph Density',
    clustering_coefficient: 'Clustering Coefficient',
    average_path_length: 'Average Path Length'
  };

  Object.entries(metrics).forEach(([key, value]) => {
    ctx.fillText(`${metricLabels[key]}: ${value.toFixed(3)}`, 50, y);
    y += 20;
  });

  // Draw temporal evolution summary
  const evolution = data.metadata.temporal_analysis.knowledge_evolution;
  y += 20;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Temporal Evolution:', 50, y);
  y += 25;
  ctx.font = '12px Arial';

  evolution.forEach(event => {
    ctx.fillText(`${event.timeframe} (Impact: ${event.impact_score.toFixed(2)})`, 50, y);
    y += 20;
  });

  // Save visualization
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(VISUALS_DIR, 'network-overview.png'), buffer);
}

/**
 * Get a color for a cluster
 */
function getClusterColor(clusterName, alpha = 1) {
  const colors = {
    'core-ml-concepts': `rgba(66, 133, 244, ${alpha})`,
    'applied-ml': `rgba(219, 68, 55, ${alpha})`,
    'research-outputs': `rgba(15, 157, 88, ${alpha})`,
    'infrastructure': `rgba(244, 180, 0, ${alpha})`
  };
  return colors[clusterName] || `rgba(128, 128, 128, ${alpha})`;
}

/**
 * Get a color for an entity type
 */
function getTypeColor(type, alpha = 1) {
  const colors = {
    'person': `rgba(66, 133, 244, ${alpha})`,
    'project': `rgba(219, 68, 55, ${alpha})`,
    'publication': `rgba(15, 157, 88, ${alpha})`,
    'equipment': `rgba(244, 180, 0, ${alpha})`,
    'knowledge-area': `rgba(171, 71, 188, ${alpha})`,
    'facility': `rgba(0, 172, 193, ${alpha})`
  };
  return colors[type] || `rgba(128, 128, 128, ${alpha})`;
}

// Run if executed directly
if (require.main === module) {
  generateVisuals().catch(console.error);
}

module.exports = { generateVisuals }; 