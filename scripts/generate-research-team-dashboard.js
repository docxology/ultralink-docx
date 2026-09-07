/**
 * Research Team dashboard generator — thin orchestrator.
 *
 * Dashboard HTML/CSS/GraphML generation lives in src/research-team/dashboard.js;
 * the research-team dataset lives in src/research-team/dataset-llm.js.
 */
const path = require('path');
const { createEnhancedResearchTeamDataset } = require('../src/research-team/dataset-llm');
const { generateDashboard, generateNetworkOverview } = require('../src/research-team/dashboard');

const outputDir = path.join(__dirname, '../output/research-team/dashboard');

// Initialize UltraLink with research team data
const ultralink = createEnhancedResearchTeamDataset();

// Generate network overview visualization, then the dashboard
generateNetworkOverview(ultralink, outputDir);
generateDashboard(ultralink, outputDir, path.join(__dirname, 'dashboard.js'));

console.log('Dashboard generated successfully!');
console.log(`Open ${path.join(outputDir, 'index.html')} in your browser to view the dashboard.`);
