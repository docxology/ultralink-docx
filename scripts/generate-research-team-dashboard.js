const fs = require('fs');
const path = require('path');
const { UltraLink } = require('../src');
const { createEnhancedResearchTeamDataset } = require('../tests/fixtures/research-team-llm');

// Create output directory
const outputDir = path.join(__dirname, '../output/research-team/dashboard');
fs.mkdirSync(outputDir, { recursive: true });

// Create assets directory
const assetsDir = path.join(outputDir, 'assets');
fs.mkdirSync(assetsDir, { recursive: true });

// Initialize UltraLink with research team data
const ultralink = createEnhancedResearchTeamDataset();

// Generate network overview visualization
function generateNetworkOverview() {
  const networkData = ultralink.toGraphML();
  fs.writeFileSync(path.join(assetsDir, 'network-overview.graphml'), networkData);
}

// Generate dashboard HTML
function generateDashboard() {
  const data = {
    entities: Array.from(ultralink.entities.values()),
    links: Array.from(ultralink.links.entries()).reduce((acc, [source, targets]) => {
      if (Array.isArray(targets)) {
        return acc.concat(targets.map(link => ({
          source,
          target: link.target,
          type: link.type,
          attributes: link.attributes
        })));
      }
      return acc;
    }, []),
    metadata: ultralink.metadata
  };

  const html = generateDashboardHTML(data);
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);

  // Copy dashboard.js
  fs.copyFileSync(
    path.join(__dirname, 'dashboard.js'),
    path.join(outputDir, 'dashboard.js')
  );

  // Generate styles.css
  const styles = generateStyles();
  fs.writeFileSync(path.join(outputDir, 'styles.css'), styles);
}

// Generate HTML template
function generateDashboardHTML(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Research Team Analysis Dashboard</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://d3.js.org/d3.v7.min.js"></script>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
  <nav class="sidebar">
    <div class="sidebar-header">
      <h2>Research Team Analysis</h2>
    </div>
    <ul class="nav-links">
      <li><a href="#overview" class="active">Network Overview</a></li>
      <li><a href="#vectors">Vector Space</a></li>
      <li><a href="#temporal">Temporal Analysis</a></li>
      <li><a href="#impact">Impact Analysis</a></li>
      <li><a href="#clusters">Cluster Analysis</a></li>
      <li><a href="#entities">Entity Explorer</a></li>
    </ul>
  </nav>

  <main class="content">
    <section id="overview" class="section active">
      <h2>Network Overview</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Network Statistics</h3>
          <div id="network-stats"></div>
        </div>
        <div class="metric-card">
          <h3>Entity Distribution</h3>
          <div id="entity-distribution"></div>
        </div>
      </div>
      <div class="visualization-container">
        <div id="network-viz"></div>
      </div>
    </section>

    <section id="vectors" class="section">
      <h2>Vector Space Analysis</h2>
      <div class="controls">
        <select id="vector-dimension">
          <option value="2d">2D View</option>
          <option value="3d">3D View</option>
        </select>
        <select id="vector-color">
          <option value="cluster">Color by Cluster</option>
          <option value="type">Color by Type</option>
        </select>
        <button id="reset-view">Reset View</button>
      </div>
      <div class="visualization-container">
        <div id="vector-space-interactive" class="vector-viz"></div>
      </div>
      <div class="details-panel">
        <h3>Selected Entity Details</h3>
        <div id="vector-details"></div>
      </div>
      <div class="vector-legend">
        <h3>Clusters</h3>
        <div id="cluster-legend"></div>
      </div>
    </section>

    <section id="temporal" class="section">
      <h2>Temporal Evolution</h2>
      <div class="controls">
        <div class="timeline-controls">
          <button id="play-timeline">Play Evolution</button>
          <input type="range" id="timeline-slider" min="0" max="100" value="0">
        </div>
      </div>
      <div class="visualization-container">
        <div id="temporal-viz"></div>
      </div>
      <div class="timeline-events">
        <h3>Key Developments</h3>
        <div id="timeline-details"></div>
      </div>
    </section>

    <section id="impact" class="section">
      <h2>Research Impact</h2>
      <div class="controls">
        <select id="impact-metric">
          <option value="citations">Citation Impact</option>
          <option value="influence">Influence Score</option>
          <option value="applications">Practical Applications</option>
        </select>
      </div>
      <div class="visualization-container">
        <div id="impact-viz"></div>
      </div>
      <div class="impact-details">
        <h3>Impact Analysis</h3>
        <div id="impact-details"></div>
      </div>
    </section>

    <section id="clusters" class="section">
      <h2>Research Clusters</h2>
      <div class="cluster-grid">
        <div class="cluster-viz">
          <div id="cluster-network"></div>
        </div>
        <div class="cluster-details">
          <h3>Cluster Information</h3>
          <div id="cluster-info"></div>
        </div>
      </div>
      <div class="cluster-members">
        <h3>Cluster Members</h3>
        <div id="cluster-members"></div>
      </div>
    </section>

    <section id="entities" class="section">
      <h2>Entity Explorer</h2>
      <div class="explorer-grid">
        <div class="entity-list">
          <div class="search-box">
            <input type="text" id="entity-search" placeholder="Search entities...">
            <select id="entity-type-filter">
              <option value="all">All Types</option>
              <option value="person">People</option>
              <option value="project">Projects</option>
              <option value="publication">Publications</option>
              <option value="equipment">Equipment</option>
              <option value="knowledge-area">Knowledge Areas</option>
            </select>
          </div>
          <div id="entity-list"></div>
        </div>
        <div class="entity-details">
          <div id="entity-details"></div>
        </div>
      </div>
    </section>
  </main>

  <script>
    window.researchData = ${JSON.stringify(data)};
  </script>
  <script src="dashboard.js"></script>
</body>
</html>`;
}

// Generate CSS styles
function generateStyles() {
  return `
    /* Dashboard Layout */
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }

    .sidebar {
      width: 250px;
      background: #fff;
      border-right: 1px solid #e9ecef;
      padding: 20px 0;
      box-shadow: 2px 0 5px rgba(0,0,0,0.05);
    }

    .sidebar-header {
      padding: 0 20px 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .sidebar-header h2 {
      margin: 0;
      color: #212529;
      font-size: 1.25rem;
    }

    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-links a {
      display: block;
      padding: 12px 20px;
      color: #495057;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .nav-links a:hover {
      background: #e9ecef;
      color: #212529;
    }

    .nav-links a.active {
      background: #e7f5ff;
      color: #228be6;
      font-weight: 500;
    }

    .content {
      flex: 1;
      padding: 30px;
      overflow-y: auto;
    }

    /* Sections */
    .section {
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .section.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Vector Space */
    .vector-viz {
      width: 100%;
      height: 500px;
      position: relative;
    }

    .details-panel {
      margin-top: 20px;
      padding: 15px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .vector-legend {
      margin-top: 20px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }

    .cluster-name {
      font-weight: 500;
      margin-right: 8px;
    }

    .entity-count {
      color: #666;
      font-size: 0.9em;
    }

    .detail-section {
      margin-bottom: 20px;
    }

    .detail-section h5 {
      margin: 10px 0 5px;
      color: #333;
    }

    .detail-section ul {
      margin: 0;
      padding-left: 20px;
    }

    .detail-section li {
      margin-bottom: 8px;
    }

    /* Cards and Grids */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .metric-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .visualization-container {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      min-height: 400px;
    }

    /* Controls */
    .controls {
      margin-bottom: 20px;
    }

    select, input, button {
      padding: 8px 12px;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      background: #fff;
      font-size: 14px;
    }

    button {
      background: #228be6;
      color: #fff;
      border: none;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    button:hover {
      background: #1c7ed6;
    }

    /* Entity Explorer */
    .explorer-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 20px;
    }

    .entity-list {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .search-box {
      margin-bottom: 20px;
    }

    .search-box input {
      width: 100%;
      margin-bottom: 10px;
    }

    .entity-item {
      padding: 10px;
      border-bottom: 1px solid #e9ecef;
      cursor: pointer;
    }

    .entity-item:hover {
      background: #f8f9fa;
    }

    .entity-type {
      font-size: 12px;
      color: #868e96;
      text-transform: uppercase;
    }

    .entity-details {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    /* Timeline */
    .timeline-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .timeline-slider {
      flex: 1;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      body {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e9ecef;
      }

      .explorer-grid {
        grid-template-columns: 1fr;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}

// Generate dashboard
generateNetworkOverview();
generateDashboard();

console.log('Dashboard generated successfully!');
console.log(`Open ${path.join(outputDir, 'index.html')} in your browser to view the dashboard.`); 