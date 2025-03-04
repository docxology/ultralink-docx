const fs = require('fs');
const path = require('path');
const { createEnhancedResearchTeamDataset } = require('../tests/fixtures/research-team-llm');

// Create output directories if they don't exist
const BASE_OUTPUT_DIR = path.join(__dirname, '../output/research-team');
const LOGS_DIR = path.join(__dirname, '../logs/research-team');

// Define output silos
const OUTPUT_SILOS = {
  raw: path.join(BASE_OUTPUT_DIR, 'raw'),           // Raw data exports (JSON, CSV)
  graph: path.join(BASE_OUTPUT_DIR, 'graph'),       // Graph visualizations
  documents: path.join(BASE_OUTPUT_DIR, 'docs'),    // Document formats (PDF, HTML)
  knowledge: path.join(BASE_OUTPUT_DIR, 'knowledge'),// Knowledge base (Obsidian)
  visuals: path.join(BASE_OUTPUT_DIR, 'visuals'),   // Visual exports (PNG, SVG)
  temporal: path.join(BASE_OUTPUT_DIR, 'temporal')  // Temporal analysis outputs
};

// Create all directories
[LOGS_DIR, ...Object.values(OUTPUT_SILOS)].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Initialize logging
const logStream = fs.createWriteStream(path.join(LOGS_DIR, 'pipeline.log'), { flags: 'a' });
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  logStream.write(logMessage);
  console.log(logMessage);
};

// HTML Template for research team visualization
const generateHtml = (data) => `
<!DOCTYPE html>
<html>
<head>
  <title>Research Team Analysis</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .entity { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .vector-viz { background: #f5f5f5; padding: 10px; }
    .temporal { color: #666; }
    .llm-insight { background: #e1f5fe; padding: 10px; margin: 5px 0; }
  </style>
</head>
<body>
  <h1>Research Team Knowledge Graph</h1>
  ${data.entities.map(entity => `
    <div class="entity">
      <h2>${entity.id}</h2>
      <p>Type: ${entity.type}</p>
      ${entity.attributes.vector ? `
        <div class="vector-viz">
          <h3>Vector Embedding</h3>
          <pre>${JSON.stringify(entity.attributes.vector, null, 2)}</pre>
        </div>
      ` : ''}
      ${entity.attributes.llm_insights ? `
        <div class="llm-insight">
          <h3>LLM Insights</h3>
          <pre>${JSON.stringify(entity.attributes.llm_insights, null, 2)}</pre>
        </div>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>`;

// GraphViz DOT template for graph visualization
const generateDot = (ultralink) => `
digraph ResearchTeam {
  rankdir=LR;
  node [shape=box, style=rounded];
  ${Array.from(ultralink.entities.values()).map(e => 
    `"${e.id}" [label="${e.id}\\n(${e.type})"];`
  ).join('\n  ')}
  ${Array.from(ultralink.entities.keys()).flatMap(sourceId => {
    const links = ultralink.getLinks(sourceId);
    return Array.from(links).map(link => 
      `"${sourceId}" -> "${link.target}" [label="${link.type}"];`
    );
  }).join('\n  ')}
}`;

async function runPipeline() {
  try {
    log('Starting Research Team Pipeline');
    
    // Create the enhanced dataset
    log('Creating enhanced research team dataset');
    const ultralink = createEnhancedResearchTeamDataset();
    
    // 1. Raw Data Exports
    log('Generating raw data exports');
    
    // JSON Export
    const jsonOutput = ultralink.toJSON();
    fs.writeFileSync(
      path.join(OUTPUT_SILOS.raw, 'research-team.json'),
      JSON.stringify(jsonOutput, null, 2)
    );
    
    // CSV Export
    const csvOutput = ultralink.toCSV();
    fs.writeFileSync(
      path.join(OUTPUT_SILOS.raw, 'research-team.csv'),
      csvOutput
    );
    
    // 2. Graph Exports
    log('Generating graph exports');
    
    // GraphML Export
    const graphmlOutput = ultralink.toGraphML();
    fs.writeFileSync(
      path.join(OUTPUT_SILOS.graph, 'research-team.graphml'),
      graphmlOutput
    );
    
    // DOT Export for visualization
    const dotOutput = generateDot(ultralink);
    fs.writeFileSync(
      path.join(OUTPUT_SILOS.graph, 'research-team.dot'),
      dotOutput
    );
    
    // 3. Document Exports
    log('Generating document exports');
    
    // HTML Export
    const htmlOutput = generateHtml(jsonOutput);
    fs.writeFileSync(
      path.join(OUTPUT_SILOS.documents, 'research-team.html'),
      htmlOutput
    );
    
    // 4. Knowledge Base Export
    log('Generating knowledge base');
    
    // Obsidian Export
    const obsidianOutput = ultralink.toObsidian();
    const obsidianDir = path.join(OUTPUT_SILOS.knowledge, 'obsidian');
    if (!fs.existsSync(obsidianDir)) {
      fs.mkdirSync(obsidianDir);
    }
    
    for (const [filename, content] of Object.entries(obsidianOutput)) {
      fs.writeFileSync(
        path.join(obsidianDir, `${filename}.md`),
        content
      );
    }
    
    // 5. Temporal Analysis Exports
    log('Generating temporal analysis');
    
    // Timeline Export
    const timeline = {
      events: jsonOutput.metadata.temporal_analysis.knowledge_evolution,
      metadata: {
        start_date: '2021-Q1',
        end_date: '2023-Q4'
      }
    };
    
    fs.writeFileSync(
      path.join(OUTPUT_SILOS.temporal, 'timeline.json'),
      JSON.stringify(timeline, null, 2)
    );
    
    // Generate temporal HTML view
    const timelineHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Research Evolution Timeline</title>
      <style>
        .timeline { margin: 20px; padding: 20px; }
        .event { border-left: 2px solid #666; padding: 10px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="timeline">
        ${timeline.events.map(event => `
          <div class="event">
            <h3>${event.timeframe}</h3>
            <p>Impact Score: ${event.impact_score}</p>
            <ul>
              ${event.key_developments.map(dev => `<li>${dev}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </body>
    </html>`;
    
    fs.writeFileSync(
      path.join(OUTPUT_SILOS.temporal, 'timeline.html'),
      timelineHtml
    );
    
    // 6. Generate shell script for creating visualizations
    // This script will use external tools to generate PNG and PDF outputs
    const visualizationScript = `#!/bin/bash
# Generate PNG from DOT
dot -Tpng "${path.join(OUTPUT_SILOS.graph, 'research-team.dot')}" -o "${path.join(OUTPUT_SILOS.visuals, 'research-team-graph.png')}"

# Generate PDF from HTML (requires wkhtmltopdf)
wkhtmltopdf "${path.join(OUTPUT_SILOS.documents, 'research-team.html')}" "${path.join(OUTPUT_SILOS.documents, 'research-team.pdf')}"
wkhtmltopdf "${path.join(OUTPUT_SILOS.temporal, 'timeline.html')}" "${path.join(OUTPUT_SILOS.temporal, 'timeline.pdf')}"

# Generate PNG from HTML (requires wkhtmltoimage)
wkhtmltoimage "${path.join(OUTPUT_SILOS.documents, 'research-team.html')}" "${path.join(OUTPUT_SILOS.visuals, 'research-team.png')}"
wkhtmltoimage "${path.join(OUTPUT_SILOS.temporal, 'timeline.html')}" "${path.join(OUTPUT_SILOS.visuals, 'timeline.png')}"
`;
    
    fs.writeFileSync(
      path.join(BASE_OUTPUT_DIR, 'generate-visuals.sh'),
      visualizationScript,
      { mode: 0o755 }
    );
    
    log('Pipeline completed successfully');
    log('To generate visual outputs (PNG, PDF), run the generate-visuals.sh script');
    
  } catch (error) {
    log(`Error in pipeline: ${error.message}`);
    log(error.stack);
    process.exit(1);
  }
}

runPipeline().catch(error => {
  log(`Fatal error in pipeline: ${error.message}`);
  log(error.stack);
  process.exit(1);
}); 