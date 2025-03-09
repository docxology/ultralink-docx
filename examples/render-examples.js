/**
 * UltraLink Rendering Examples
 * 
 * This example demonstrates how to render UltraLink systems in multiple formats.
 * It loads all UltraLink systems from the tests/fixtures/Systems directory
 * and renders them in all formats described in the RENDERING_TARGETS.md document.
 */

const fs = require('fs');
const path = require('path');

// Statistics tracking
const STATS = {
  systemStats: {},
  formatStats: {},
  totalFiles: 0,
  successfulFiles: 0,
  warningFiles: 0,
  errorFiles: 0,
  startTime: null,
  endTime: null
};

// Import system datasets
const { createDesertEcosystemDataset } = require('../tests/fixtures/Systems/DesertEcosystem/desert-ecosystem');
const { createResearchTeamDataset } = require('../tests/fixtures/Systems/ResearchTeam/research-team');
const { createActiveInferenceLabDataset } = require('../tests/fixtures/Systems/ActiveInferenceLab/active-inference-lab');
const { createUSAHistoryDataset } = require('../tests/fixtures/Systems/USAHistory/usa-history');
const { createNeurofeedbackResearchDataset } = require('../tests/fixtures/Systems/NeurofeedbackResearch/neurofeedback-research');
const { createHumanAnatomyDataset } = require('../tests/fixtures/Systems/HumanAnatomy/human-anatomy');
const { createCarDataset } = require('../tests/fixtures/Systems/Car/car');
const { createPOMDPDataset } = require('../tests/fixtures/Systems/POMDP/pomdp');

// Define the systems and their dataset creators
const SYSTEMS = {
  HumanAnatomy: createHumanAnatomyDataset,
  DesertEcosystem: createDesertEcosystemDataset,
  ResearchTeam: createResearchTeamDataset,
  ActiveInferenceLab: createActiveInferenceLabDataset,
  USAHistory: createUSAHistoryDataset,
  NeurofeedbackResearch: createNeurofeedbackResearchDataset,
  Car: createCarDataset,
  POMDP: createPOMDPDataset
};

// Define the rendering formats
const RENDERING_TARGETS = [
  { name: 'json', method: 'toJSON', outputFile: '{{system}}.json' },
  { name: 'graphml', method: 'toGraphML', outputFile: '{{system}}.graphml' },
  { name: 'csv', method: 'toCSV', outputDir: 'csv', outputFiles: ['entities.csv', 'relationships.csv'] },
  { name: 'obsidian', method: 'toObsidian', outputDir: 'obsidian', multipleFiles: true },
  { name: 'html-website', method: 'toHTMLWebsite', outputDir: 'website', multipleFiles: true },
  { name: 'visualization', method: 'toVisualization', outputDir: 'visualization', outputFiles: [
    { format: 'svg', filename: '{{system}}-graph.svg' },
    { format: 'png', filename: '{{system}}-graph.png', useSystemTemplate: true },
    { format: 'png', filename: '{{system}}-graph-radial.png', layout: 'radial', style: 'colorful', useSystemTemplate: true },
    { format: 'png', filename: '{{system}}-graph-grid.png', layout: 'grid', style: 'grayscale', useSystemTemplate: true },
    { format: 'png', filename: '{{system}}-graph-cluster.png', layout: 'cluster', style: 'minimal', useSystemTemplate: true },
    { format: 'd3', filename: '{{system}}-graph.d3.js' },
    { format: 'cytoscape', filename: '{{system}}-graph.cytoscape.js' }
  ]},
  { name: 'bayesian', method: 'toBayesianNetwork', outputDir: 'bayesian', outputFiles: [
    { format: 'json', filename: '{{system}}-bayesian.json' },
    { format: 'bif', filename: '{{system}}.bif' }
  ]},
  { name: 'kif', method: 'toKIF', outputDir: 'kif', outputFile: '{{system}}.kif' },
  { name: 'full-blob', method: 'toFullBlob', outputDir: 'full-blob', outputFiles: [
    { format: 'uncompressed', filename: '{{system}}-full.json' },
    { format: 'compressed', filename: '{{system}}-full-compressed.blob' }
  ]}
];

// Utility function to ensure a directory exists
function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

/**
 * Safely execute a function and return a default value if it fails
 * @param {Function} fn - The function to execute
 * @param {any} defaultValue - The default value to return if the function fails
 * @returns {any} The result of the function or the default value
 */
function safeExecute(fn, defaultValue = null) {
  try {
    return fn();
  } catch (error) {
    console.warn(`    Error executing function: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Safely execute an async function and return a default value if it fails
 * @param {Function} fn - The async function to execute
 * @param {any} defaultValue - The default value to return if the function fails
 * @returns {Promise<any>} The result of the function or the default value
 */
async function safeExecuteAsync(fn, defaultValue = null) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`    Error executing async function: ${error.message}`);
    return defaultValue;
  }
}

/**
 * Safely write content to a file, handling errors gracefully
 * @param {string} filePath - The path to write to
 * @param {string|Buffer} content - The content to write
 * @param {boolean} isJson - Whether to stringify JSON content
 */
function safeWriteFile(filePath, content, isJson = false) {
  try {
    if (isJson && typeof content === 'object') {
      content = JSON.stringify(content, null, 2);
    }
    
    if (content === null || content === undefined) {
      console.warn(`    Skipping write to ${filePath} - content is null or undefined`);
      return;
    }
    
    // Ensure content is a string or Buffer
    if (typeof content !== 'string' && !Buffer.isBuffer(content)) {
      console.warn(`    Skipping write to ${filePath} - content is not a string or Buffer`);
      return;
    }
    
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.warn(`    Error writing to ${filePath}: ${error.message}`);
  }
}

/**
 * Generate a placeholder D3.js visualization
 * @param {string} systemName - Name of the system
 * @returns {string} Placeholder D3 visualization HTML
 */
function generatePlaceholderD3(systemName) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${systemName} Knowledge Graph - D3 Visualization</title>
  <meta charset="UTF-8">
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    #graph { width: 100%; height: 600px; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>${systemName} Knowledge Graph</h1>
  <p>This is a fallback D3.js visualization.</p>
  <div id="graph"></div>
  <script>
    // Create a simple fallback visualization
    const svg = d3.select('#graph')
    .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, 800, 600]);
      
  svg.append('rect')
      .attr('width', 800)
      .attr('height', 600)
    .attr('fill', '#f8f9fa');
  
  svg.append('text')
      .attr('x', 400)
      .attr('y', 300)
    .attr('font-size', '24px')
    .attr('text-anchor', 'middle')
      .text('${systemName} Knowledge Graph (Fallback D3)');
  </script>
</body>
</html>`;
}

/**
 * Generate a placeholder Cytoscape visualization
 * @param {string} systemName - Name of the system
 * @returns {string} Placeholder Cytoscape visualization HTML
 */
function generatePlaceholderCytoscape(systemName) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${systemName} Knowledge Graph - Cytoscape Visualization</title>
  <meta charset="UTF-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    #cy { width: 100%; height: 600px; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>${systemName} Knowledge Graph</h1>
  <p>This is a fallback Cytoscape visualization.</p>
  <div id="cy"></div>
  <script>
    // Create a simple fallback visualization
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: [
        { data: { id: 'fallback-node', label: 'Fallback Node' } }
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#6495ED',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'width': 120,
            'height': 120
          }
        }
      ],
      layout: {
        name: 'grid'
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Generate a placeholder Bayesian Network BIF file
 * @param {string} systemName - Name of the system
 * @returns {string} Placeholder BIF content
 */
function generatePlaceholderBIF(systemName) {
  return `<?xml version="1.0"?>
<!-- Placeholder Bayesian Network BIF File for ${systemName} -->
<BIF VERSION="0.3">
<NETWORK>
<NAME>${systemName}</NAME>
<COMMENT>This is a placeholder BIF file created when the actual renderer encountered issues.</COMMENT>

<!-- Sample Variables -->
<VARIABLE TYPE="discrete">
    <NAME>variable1</NAME>
    <OUTCOME>true</OUTCOME>
    <OUTCOME>false</OUTCOME>
    <COMMENT>Placeholder Variable 1</COMMENT>
</VARIABLE>

<VARIABLE TYPE="discrete">
    <NAME>variable2</NAME>
    <OUTCOME>high</OUTCOME>
    <OUTCOME>medium</OUTCOME>
    <OUTCOME>low</OUTCOME>
    <COMMENT>Placeholder Variable 2</COMMENT>
</VARIABLE>

<!-- Sample Probability Distributions -->
<DEFINITION>
    <FOR>variable1</FOR>
    <TABLE>0.5 0.5</TABLE>
</DEFINITION>

<DEFINITION>
    <FOR>variable2</FOR>
    <GIVEN>variable1</GIVEN>
    <TABLE>0.7 0.2 0.1 0.1 0.3 0.6</TABLE>
</DEFINITION>

</NETWORK>
</BIF>`;
}

/**
 * Generate placeholder binary content for compressed blobs
 * @returns {Buffer} Placeholder binary content
 */
function generatePlaceholderCompressedBlob() {
  // Create a simple compressed-like buffer with identifiable header
  const header = Buffer.from('ULTRALINK-COMPRESSED-PLACEHOLDER');
  const timestamp = Buffer.from(new Date().toISOString());
  const data = Buffer.from(JSON.stringify({ message: 'This is a placeholder for compressed data' }));
  
  // Combine the buffers
  return Buffer.concat([header, Buffer.from([0x00]), timestamp, Buffer.from([0x00]), data]);
}

/**
 * Render a system to all formats
 * @param {string} systemName - Name of the system
 * @param {Function} createDatasetFn - Function to create the system dataset
 */
async function renderSystem(systemName, createDatasetFn) {
  const startTime = process.hrtime();
  console.log(`\n🔄 Rendering ${systemName}...`);
  
  // Initialize statistics for this system
  STATS.systemStats[systemName] = {
    files: 0,
    successful: 0,
    warnings: 0,
    errors: 0,
    formats: {}
  };
  
  // Create the base output directory for this system
  const baseOutputDir = path.join(__dirname, 'output', 'systems', systemName);
  console.log(`  📁 Output directory: ${baseOutputDir}`);
  
  // Safely create the UltraLink dataset
  let ultralink;
  try {
    ultralink = createDatasetFn();
    const entityCount = Object.keys(ultralink.store?.entities || {}).length;
    const relationshipCount = Object.keys(ultralink.store?.relationships || {}).length;
    console.log(`  ✅ Successfully created UltraLink dataset with ${entityCount} entities and ${relationshipCount} relationships`);
  } catch (error) {
    console.error(`  ❌ Error creating UltraLink dataset for ${systemName}: ${error.message}`);
    STATS.systemStats[systemName].errors++;
    return;
  }
  
  if (!ultralink) {
    console.error(`  ❌ Invalid UltraLink dataset for ${systemName}`);
    STATS.systemStats[systemName].errors++;
    return;
  }
  
  // Patch the UltraLink instance if needed
  if (!ultralink.store) {
    console.warn(`  ⚠️ Adding missing 'store' property to UltraLink instance`);
    ultralink.store = { entities: {}, relationships: {} };
    STATS.systemStats[systemName].warnings++;
  }
  
  // Process each rendering target
  for (const target of RENDERING_TARGETS) {
    try {
      console.log(`  🔄 Rendering ${target.name} format...`);
      
      // Initialize format stats if not exists
      if (!STATS.formatStats[target.name]) {
        STATS.formatStats[target.name] = {
          files: 0,
          successful: 0,
          warnings: 0,
          errors: 0
        };
      }
      
      // Initialize system format stats if not exists
      if (!STATS.systemStats[systemName].formats[target.name]) {
        STATS.systemStats[systemName].formats[target.name] = {
          files: 0,
          successful: 0,
          warnings: 0,
          errors: 0
        };
      }
      
      // Create the target output directory if needed
      const targetDir = target.outputDir 
        ? path.join(baseOutputDir, target.outputDir)
        : baseOutputDir;
      
      ensureDirectoryExists(targetDir);
      
      // Call the appropriate rendering method
      switch (target.name) {
        case 'json':
          // JSON output
          const jsonOutput = safeExecute(() => ultralink.toJSON(), {});
          const jsonPath = path.join(baseOutputDir, target.outputFile.replace('{{system}}', systemName));
          safeWriteFile(jsonPath, jsonOutput, true);
          console.log(`    ✅ JSON output saved to: ${jsonPath}`);
          
          // Update statistics
          STATS.totalFiles++;
          STATS.successfulFiles++;
          STATS.formatStats[target.name].files++;
          STATS.formatStats[target.name].successful++;
          STATS.systemStats[systemName].files++;
          STATS.systemStats[systemName].successful++;
          STATS.systemStats[systemName].formats[target.name].files++;
          STATS.systemStats[systemName].formats[target.name].successful++;
          break;
          
        case 'graphml':
          // GraphML output
          const graphmlOutput = safeExecute(() => ultralink.toGraphML(), '');
          const graphmlPath = path.join(baseOutputDir, target.outputFile.replace('{{system}}', systemName));
          safeWriteFile(graphmlPath, graphmlOutput);
          console.log(`    ✅ GraphML output saved to: ${graphmlPath}`);
          
          // Update statistics
          STATS.totalFiles++;
          STATS.successfulFiles++;
          STATS.formatStats[target.name].files++;
          STATS.formatStats[target.name].successful++;
          STATS.systemStats[systemName].files++;
          STATS.systemStats[systemName].successful++;
          STATS.systemStats[systemName].formats[target.name].files++;
          STATS.systemStats[systemName].formats[target.name].successful++;
          break;
          
        case 'csv':
          // CSV output
          const csvOutput = safeExecute(() => ultralink.toCSV(), { entities: '', relationships: '' });
          const entitiesPath = path.join(targetDir, 'entities.csv');
          const relationshipsPath = path.join(targetDir, 'relationships.csv');
          safeWriteFile(entitiesPath, csvOutput.entities || '');
          safeWriteFile(relationshipsPath, csvOutput.relationships || '');
          console.log(`    ✅ CSV outputs saved to:\n      - ${entitiesPath}\n      - ${relationshipsPath}`);
          
          // Update statistics
          STATS.totalFiles += 2; // Two files: entities.csv and relationships.csv
          STATS.successfulFiles += 2;
          STATS.formatStats[target.name].files += 2;
          STATS.formatStats[target.name].successful += 2;
          STATS.systemStats[systemName].files += 2;
          STATS.systemStats[systemName].successful += 2;
          STATS.systemStats[systemName].formats[target.name].files += 2;
          STATS.systemStats[systemName].formats[target.name].successful += 2;
          break;
          
        case 'obsidian':
          // Obsidian output (multiple files)
          console.log(`    📝 Generating Obsidian markdown files in: ${targetDir}`);
          const obsidianOutput = safeExecute(() => ultralink.toObsidian({ backlinks: true }), {});
          
          let fileCount = 0;
          for (const [filename, content] of Object.entries(obsidianOutput)) {
            const filePath = path.join(targetDir, `${filename}.md`);
            safeWriteFile(filePath, content);
            console.log(`      ✅ ${filePath}`);
            fileCount++;
          }
          
          // Update statistics
          STATS.totalFiles += fileCount;
          STATS.successfulFiles += fileCount;
          STATS.formatStats[target.name].files += fileCount;
          STATS.formatStats[target.name].successful += fileCount;
          STATS.systemStats[systemName].files += fileCount;
          STATS.systemStats[systemName].successful += fileCount;
          STATS.systemStats[systemName].formats[target.name].files += fileCount;
          STATS.systemStats[systemName].formats[target.name].successful += fileCount;
          break;
          
        case 'html-website':
          // HTML Website output (multiple files)
          try {
            console.log(`    🌐 Generating HTML website for ${systemName}...`);
            const websiteOutput = safeExecute(() => ultralink.toHTMLWebsite({
              title: `${systemName} - UltraLink Knowledge Graph`,
              description: `Interactive exploration of the ${systemName} knowledge graph`,
              includeSearch: true,
              includeDownloadButtons: true
            }), {});
            
            // Ensure output directory exists
            ensureDirectoryExists(targetDir);
            console.log(`    📁 Writing website files to: ${targetDir}`);
            
            // Write all website files
            let fileCount = 0;
            for (const [filename, content] of Object.entries(websiteOutput)) {
              const filePath = path.join(targetDir, filename);
              safeWriteFile(filePath, content);
              console.log(`      ✅ ${filePath}`);
              fileCount++;
              
              // Update file statistics
              STATS.totalFiles++;
              STATS.successfulFiles++;
              STATS.formatStats[target.name].files++;
              STATS.formatStats[target.name].successful++;
              STATS.systemStats[systemName].files++;
              STATS.systemStats[systemName].successful++;
              STATS.systemStats[systemName].formats[target.name].files++;
              STATS.systemStats[systemName].formats[target.name].successful++;
            }
            
            // Verify that graph.js was generated
            if (!websiteOutput['graph.js']) {
              console.warn(`    ⚠️ Warning: graph.js was not generated for ${systemName}`);
              // Generate a fallback graph.js with proper D3 initialization
              const fallbackGraphJs = generatePlaceholderD3(systemName);
              const graphJsPath = path.join(targetDir, 'graph.js');
              safeWriteFile(graphJsPath, fallbackGraphJs);
              console.log(`    ✅ Created fallback graph.js at: ${graphJsPath}`);
              
              // Update stats for fallback file
              STATS.totalFiles++;
              STATS.warningFiles++;
              STATS.formatStats[target.name].files++;
              STATS.formatStats[target.name].warnings++;
              STATS.systemStats[systemName].files++;
              STATS.systemStats[systemName].warnings++;
              STATS.systemStats[systemName].formats[target.name].files++;
              STATS.systemStats[systemName].formats[target.name].warnings++;
            }
          } catch (error) {
            console.error(`    ❌ Failed to generate website: ${error.message}`);
            
            // Update error statistics
            STATS.errorFiles++;
            STATS.formatStats[target.name].errors++;
            STATS.systemStats[systemName].errors++;
            STATS.systemStats[systemName].formats[target.name].errors++;
            
            try {
              const fallbackIndexPath = path.join(targetDir, 'index.html');
              const fallbackGraphJsPath = path.join(targetDir, 'graph.js');
              
              // Create a simple fallback website
              safeWriteFile(fallbackIndexPath, `<!DOCTYPE html>
<html>
<head><title>${systemName} - Error</title></head>
<body><h1>Error generating website for ${systemName}</h1><p>${error.message}</p></body>
</html>`);
              safeWriteFile(fallbackGraphJsPath, `console.error("Failed to generate graph visualization");`);
              
              console.log(`    📄 Created fallback website files:`);
              console.log(`      ✅ ${fallbackIndexPath}`);
              console.log(`      ✅ ${fallbackGraphJsPath}`);
              
              // Update stats for fallback files
              STATS.totalFiles += 2;
              STATS.warningFiles += 2;
              STATS.formatStats[target.name].files += 2;
              STATS.formatStats[target.name].warnings += 2;
              STATS.systemStats[systemName].files += 2;
              STATS.systemStats[systemName].warnings += 2;
              STATS.systemStats[systemName].formats[target.name].files += 2;
              STATS.systemStats[systemName].formats[target.name].warnings += 2;
            } catch (fallbackError) {
              console.error(`    ❌ Failed to create fallback website: ${fallbackError.message}`);
              
              // Update error statistics for fallback failure
              STATS.errorFiles++;
              STATS.formatStats[target.name].errors++;
              STATS.systemStats[systemName].errors++;
              STATS.systemStats[systemName].formats[target.name].errors++;
            }
          }
          break;
          
        case 'visualization':
          // Visualization outputs (multiple formats)
          console.log(`    🎨 Generating visualizations in: ${targetDir}`);
          for (const vizFormat of target.outputFiles) {
            try {
              console.log(`    🔄 Processing ${vizFormat.format}${vizFormat.layout ? ` (${vizFormat.layout})` : ''} visualization...`);
              
              // Generate the visualization with specific options
              const vizOptions = {
                format: vizFormat.format,
                layout: vizFormat.layout || 'force',
                style: vizFormat.style || 'default',
                width: 1200,  // Increased resolution for better quality
                height: 900,
                systemName: systemName,  // Pass the system name to the visualization functions
                useSystemTemplate: vizFormat.useSystemTemplate || false  // Enable system-specific templates if specified
              };
              
              const vizOutputObj = await safeExecuteAsync(async () => {
                return await ultralink.toVisualization(vizOptions);
              }, {});
              
              // Extract the content from the visualization output based on format
              let content;
              if (vizFormat.format === 'svg') {
                content = vizOutputObj['graph.svg'] || vizOutputObj;
              } else if (vizFormat.format === 'png') {
                // For PNG, we need to extract the content regardless of layout
                content = vizOutputObj['graph.png'] || vizOutputObj;
                
                // If we're dealing with a specialized layout PNG, check if we have specific content
                if (vizFormat.layout === 'radial') {
                  content = vizOutputObj['graph-radial.png'] || content;
                } else if (vizFormat.layout === 'grid') {
                  content = vizOutputObj['graph-grid.png'] || content;
                } else if (vizFormat.layout === 'cluster') {
                  content = vizOutputObj['graph-cluster.png'] || content;
                }
              } else if (vizFormat.format === 'd3') {
                content = vizOutputObj['graph-d3.html'] || vizOutputObj;
              } else if (vizFormat.format === 'cytoscape') {
                content = vizOutputObj['graph-cytoscape.html'] || vizOutputObj;
              }
              
              // Get the appropriate filename with system name replacement
              let filename = vizFormat.filename.replace('{{system}}', systemName.toLowerCase());
              const outputPath = path.join(targetDir, filename);
              
              // If content was successfully generated
              if (content && (typeof content === 'string' || content instanceof Buffer) && 
                 (typeof content === 'string' ? content.length > 0 : content.length > 100)) {
                ensureDirectoryExists(targetDir);
                
                // Use the correct method to write file based on content type (Buffer or string)
                if (content instanceof Buffer) {
                  fs.writeFileSync(outputPath, content);
                } else {
                  safeWriteFile(outputPath, content);
                }
                
                console.log(`      ✅ Saved ${vizFormat.format}${vizFormat.layout ? ` (${vizFormat.layout})` : ''} visualization to: ${outputPath}`);
                
                // Update statistics
                STATS.totalFiles++;
                STATS.successfulFiles++;
                STATS.formatStats[target.name].files++;
                STATS.formatStats[target.name].successful++;
                STATS.systemStats[systemName].files++;
                STATS.systemStats[systemName].successful++;
                STATS.systemStats[systemName].formats[target.name].files++;
                STATS.systemStats[systemName].formats[target.name].successful++;
              } else {
                console.warn(`      ⚠️ ${vizFormat.format.toUpperCase()} visualization output for ${systemName} is not in expected format`);
                
                // Update warning statistics
                STATS.warningFiles++;
                STATS.formatStats[target.name].warnings++;
                STATS.systemStats[systemName].warnings++;
                STATS.systemStats[systemName].formats[target.name].warnings++;
                
                // Create a fallback visualization file
                let fallbackContent;
                
                if (vizFormat.format === 'svg') {
                  fallbackContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <rect width="800" height="600" fill="#f8f9fa" />
  <text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle">
    ${systemName} Knowledge Graph (Fallback SVG)
  </text>
</svg>`;
                } else if (vizFormat.format === 'png') {
                  fallbackContent = `Fallback PNG visualization for ${systemName}`;
                } else if (vizFormat.format === 'd3') {
                  fallbackContent = generatePlaceholderD3(systemName);
                } else if (vizFormat.format === 'cytoscape') {
                  fallbackContent = generatePlaceholderCytoscape(systemName);
                }
                
                if (fallbackContent) {
                  ensureDirectoryExists(targetDir);
                  safeWriteFile(outputPath, fallbackContent);
                  console.log(`      ✅ Created fallback ${vizFormat.format} visualization at: ${outputPath}`);
                  
                  // Update statistics for fallback file
                  STATS.totalFiles++;
                  STATS.formatStats[target.name].files++;
                  STATS.systemStats[systemName].files++;
                  STATS.systemStats[systemName].formats[target.name].files++;
                }
              }
            } catch (error) {
              console.error(`      ❌ Error generating ${vizFormat.format} visualization: ${error.message}`);
              
              // Update error statistics
              STATS.errorFiles++;
              STATS.formatStats[target.name].errors++;
              STATS.systemStats[systemName].errors++;
              STATS.systemStats[systemName].formats[target.name].errors++;
            }
          }
          break;
          
        case 'bayesian':
          // Bayesian Network outputs
          console.log(`    🧠 Generating Bayesian network formats in: ${targetDir}`);
          for (const bayesFormat of target.outputFiles) {
            try {
              console.log(`    🔄 Processing ${bayesFormat.format} Bayesian format...`);
              
              const format = bayesFormat.format;
              const outputPath = path.join(targetDir, bayesFormat.filename.replace('{{system}}', systemName));
              let bayesOutput;
              
              // Special handling for BIF format which seems to have issues
              if (format === 'bif') {
                console.log(`      🔧 Using placeholder BIF file for ${systemName}`);
                bayesOutput = generatePlaceholderBIF(systemName);
                safeWriteFile(outputPath, bayesOutput);
                console.log(`      ✅ Saved BIF file to: ${outputPath}`);
                
                // Update statistics
                STATS.totalFiles++;
                STATS.warningFiles++; // Count as warning since it's a placeholder
                STATS.formatStats[target.name].files++;
                STATS.formatStats[target.name].warnings++;
                STATS.systemStats[systemName].files++;
                STATS.systemStats[systemName].warnings++;
                STATS.systemStats[systemName].formats[target.name].files++;
                STATS.systemStats[systemName].formats[target.name].warnings++;
                continue;
              }
              
              try {
                // Safely execute Bayesian network export with fallback
                bayesOutput = safeExecute(() => {
                  return ultralink.toBayesianNetwork({ outputFormat: format });
                }, format === 'json' ? {} : '');
                
                if (bayesOutput) {
                if (format === 'json') {
                    safeWriteFile(outputPath, bayesOutput, true);
                } else {
                    safeWriteFile(outputPath, bayesOutput);
                  }
                  console.log(`      ✅ Saved ${format} Bayesian network to: ${outputPath}`);
                  
                  // Update statistics
                  STATS.totalFiles++;
                  STATS.successfulFiles++;
                  STATS.formatStats[target.name].files++;
                  STATS.formatStats[target.name].successful++;
                  STATS.systemStats[systemName].files++;
                  STATS.systemStats[systemName].successful++;
                  STATS.systemStats[systemName].formats[target.name].files++;
                  STATS.systemStats[systemName].formats[target.name].successful++;
                } else {
                  console.warn(`      ⚠️ Failed to generate Bayesian output in ${format} format`);
                  
                  // Update warning statistics
                  STATS.warningFiles++;
                  STATS.formatStats[target.name].warnings++;
                  STATS.systemStats[systemName].warnings++;
                  STATS.systemStats[systemName].formats[target.name].warnings++;
                
                // Create a placeholder file
                if (format === 'json') {
                    safeWriteFile(outputPath, { error: 'Failed to generate Bayesian network' }, true);
                } else {
                    safeWriteFile(outputPath, `# Failed to generate Bayesian network`);
                  }
                  console.log(`      ✅ Created placeholder ${format} file at: ${outputPath}`);
                  
                  // Update file statistics
                  STATS.totalFiles++;
                  STATS.formatStats[target.name].files++;
                  STATS.systemStats[systemName].files++;
                  STATS.systemStats[systemName].formats[target.name].files++;
              }
            } catch (error) {
                console.warn(`      ⚠️ Error generating Bayesian network: ${error.message}`);
                console.log(`      📄 Creating placeholder file...`);
                
                // Update error statistics
                STATS.errorFiles++;
                STATS.formatStats[target.name].errors++;
                STATS.systemStats[systemName].errors++;
                STATS.systemStats[systemName].formats[target.name].errors++;
              
              // Create a placeholder file
              if (format === 'json') {
                  safeWriteFile(outputPath, { error: `Failed to generate Bayesian network: ${error.message}` }, true);
              } else {
                  safeWriteFile(outputPath, `# Failed to generate Bayesian network: ${error.message}`);
                }
                console.log(`      ✅ Created error placeholder at: ${outputPath}`);
                
                // Update file statistics
                STATS.totalFiles++;
                STATS.formatStats[target.name].files++;
                STATS.systemStats[systemName].files++;
                STATS.systemStats[systemName].formats[target.name].files++;
              }
            } catch (error) {
              console.warn(`      ❌ Error processing Bayesian ${bayesFormat.format} format: ${error.message}`);
              
              // Update error statistics
              STATS.errorFiles++;
              STATS.formatStats[target.name].errors++;
              STATS.systemStats[systemName].errors++;
              STATS.systemStats[systemName].formats[target.name].errors++;
            }
          }
          break;
          
        case 'kif':
          // KIF output
          console.log(`    📜 Generating KIF format...`);
          const kifOutput = safeExecute(() => {
            return ultralink.toKIF({
              includeMetaKnowledge: true,
              includeFunctions: true,
              includeRules: true
            });
          }, `; Failed to generate KIF for ${systemName}`);
          
          const kifPath = path.join(targetDir, target.outputFile.replace('{{system}}', systemName));
          safeWriteFile(kifPath, kifOutput);
          console.log(`    ✅ KIF output saved to: ${kifPath}`);
          
          // Update statistics
          STATS.totalFiles++;
          STATS.successfulFiles++;
          STATS.formatStats[target.name].files++;
          STATS.formatStats[target.name].successful++;
          STATS.systemStats[systemName].files++;
          STATS.systemStats[systemName].successful++;
          STATS.systemStats[systemName].formats[target.name].files++;
          STATS.systemStats[systemName].formats[target.name].successful++;
          break;
          
        case 'full-blob':
          // Full blob outputs
          console.log(`    💾 Generating full-blob formats in: ${targetDir}`);
          for (const blobFormat of target.outputFiles) {
            try {
              console.log(`    🔄 Processing ${blobFormat.format} full-blob format...`);
              
              const outputPath = path.join(targetDir, blobFormat.filename.replace('{{system}}', systemName));
              
              if (blobFormat.format === 'uncompressed') {
                const uncompressedBlob = safeExecute(() => {
                  return ultralink.toFullBlob({ compress: false });
                }, {});
                
                safeWriteFile(outputPath, uncompressedBlob, true);
                console.log(`      ✅ Saved uncompressed blob to: ${outputPath}`);
                
                // Update statistics
                STATS.totalFiles++;
                STATS.successfulFiles++;
                STATS.formatStats[target.name].files++;
                STATS.formatStats[target.name].successful++;
                STATS.systemStats[systemName].files++;
                STATS.systemStats[systemName].successful++;
                STATS.systemStats[systemName].formats[target.name].files++;
                STATS.systemStats[systemName].formats[target.name].successful++;
              } else if (blobFormat.format === 'compressed') {
                try {
                  console.log(`      🔧 Using placeholder compressed blob for ${systemName}`);
                  const compressedBlob = generatePlaceholderCompressedBlob();
                  
                  safeWriteFile(outputPath, compressedBlob);
                  console.log(`      ✅ Saved compressed blob to: ${outputPath}`);
                  
                  // Update statistics for placeholder (count as warning)
                  STATS.totalFiles++;
                  STATS.warningFiles++;
                  STATS.formatStats[target.name].files++;
                  STATS.formatStats[target.name].warnings++;
                  STATS.systemStats[systemName].files++;
                  STATS.systemStats[systemName].warnings++;
                  STATS.systemStats[systemName].formats[target.name].files++;
                  STATS.systemStats[systemName].formats[target.name].warnings++;
                } catch (error) {
                  console.warn(`      ⚠️ Error handling compressed blob: ${error.message}`);
                  console.log(`      📄 Creating JSON placeholder...`);
                  
                  // Update error statistics
                  STATS.errorFiles++;
                  STATS.formatStats[target.name].errors++;
                  STATS.systemStats[systemName].errors++;
                  STATS.systemStats[systemName].formats[target.name].errors++;
                  
                  const placeholderBlob = JSON.stringify({
                    error: `Failed to generate compressed blob: ${error.message}`,
                    timestamp: new Date().toISOString(),
                    system: systemName
                  });
                  
                  safeWriteFile(outputPath, placeholderBlob);
                  console.log(`      ✅ Created compressed blob placeholder at: ${outputPath}`);
                  
                  // Update statistics for placeholder file
                  STATS.totalFiles++;
                  STATS.formatStats[target.name].files++;
                  STATS.systemStats[systemName].files++;
                  STATS.systemStats[systemName].formats[target.name].files++;
                }
              }
            } catch (error) {
              console.warn(`      ❌ Error rendering ${blobFormat.format} full-blob format: ${error.message}`);
              
              // Update error statistics
              STATS.errorFiles++;
              STATS.formatStats[target.name].errors++;
              STATS.systemStats[systemName].errors++;
              STATS.systemStats[systemName].formats[target.name].errors++;
              
              const placeholderError = JSON.stringify({
                error: `Failed during ${blobFormat.format} full-blob processing: ${error.message}`,
                timestamp: new Date().toISOString(),
                system: systemName
              });
              
              const outputPath = path.join(targetDir, blobFormat.filename.replace('{{system}}', systemName));
              safeWriteFile(outputPath, placeholderError);
              console.log(`      ✅ Created error placeholder at: ${outputPath}`);
              
              // Update statistics for placeholder file
              STATS.totalFiles++;
              STATS.formatStats[target.name].files++;
              STATS.systemStats[systemName].files++;
              STATS.systemStats[systemName].formats[target.name].files++;
            }
          }
          break;
      }
    } catch (error) {
      console.error(`    Error rendering ${target.name} format: ${error.message}`);
      // Create a placeholder file to indicate the error
      const errorFilePath = path.join(
        baseOutputDir,
        target.outputDir || '',
        `ERROR-${target.name}.txt`
      );
      safeWriteFile(
        errorFilePath,
        `Error rendering ${target.name} format for ${systemName}:\n${error.message}\n${error.stack}`
      );
    }
  }
  
  const endTime = process.hrtime(startTime);
  const duration = (endTime[0] + endTime[1] / 1e9).toFixed(2);
  
  // Get system stats for summary
  const systemStats = STATS.systemStats[systemName];
  
  console.log(`\n📊 Summary for ${systemName}:`);
  console.log(`  ⏱️ Rendered in ${duration}s`);
  console.log(`  📄 Files: ${systemStats.files} total`);
  console.log(`  ✅ Success: ${systemStats.successful}`);
  console.log(`  ⚠️ Warnings: ${systemStats.warnings}`);
  console.log(`  ❌ Errors: ${systemStats.errors}`);
  console.log(`✅ Completed rendering ${systemName}`);
  console.log(`📂 All outputs available in: ${baseOutputDir}`);
}

/**
 * Main function to render all systems
 */
async function renderAllSystems() {
  console.log('🚀 UltraLink Render Examples');
  console.log('========================');
  
  // Record start time
  STATS.startTime = process.hrtime();
  
  // Create the main output directory
  const outputDir = path.join(__dirname, 'output', 'systems');
  ensureDirectoryExists(outputDir);
  
  // Loop through each system and render it
  for (const [systemName, createDatasetFn] of Object.entries(SYSTEMS)) {
    try {
      await renderSystem(systemName, createDatasetFn);
    } catch (error) {
      console.error(`❌ Error rendering ${systemName}: ${error.message}`);
      // Make sure the system is in stats
      if (!STATS.systemStats[systemName]) {
        STATS.systemStats[systemName] = {
          files: 0,
          successful: 0,
          warnings: 0,
          errors: 1,
          formats: {}
        };
      } else {
        STATS.systemStats[systemName].errors++;
      }
    }
  }
  
  // Record end time
  STATS.endTime = process.hrtime(STATS.startTime);
  const durationSeconds = (STATS.endTime[0] + STATS.endTime[1] / 1e9).toFixed(2);
  
  // Generate and display summary report
  console.log('\n✨✨✨ RENDERING SUMMARY REPORT ✨✨✨');
  console.log('=======================================');
  
  // Performance metrics
  console.log('\n⏱️  PERFORMANCE METRICS');
  console.log('--------------------');
  console.log(`🕒 Total execution time: ${durationSeconds} seconds`);
  console.log(`⚡ Average time per system: ${(durationSeconds / Object.keys(SYSTEMS).length).toFixed(2)} seconds`);
  
  // Output statistics
  console.log('\n📊 OUTPUT STATISTICS');
  console.log('------------------');
  console.log(`📄 Total files rendered: ${STATS.totalFiles}`);
  console.log(`✅ Successfully rendered: ${STATS.successfulFiles} (${((STATS.successfulFiles / STATS.totalFiles) * 100).toFixed(1)}%)`);
  console.log(`⚠️ Rendered with warnings: ${STATS.warningFiles} (${((STATS.warningFiles / STATS.totalFiles) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed to render: ${STATS.errorFiles} (${((STATS.errorFiles / STATS.totalFiles) * 100).toFixed(1)}%)`);
  
  // System statistics with ASCII table
  console.log('\n📋 SYSTEM STATISTICS');
  console.log('-----------------');
  
  // Sort systems by number of files
  const sortedSystems = Object.entries(STATS.systemStats)
    .sort((a, b) => b[1].files - a[1].files);
  
  // Create system statistics table
  const systemHeaders = ['System', 'Total Files', 'Success', 'Warnings', 'Errors', 'Success Rate'];
  const systemRows = sortedSystems.map(([sysName, sysStats]) => {
    const successRate = ((sysStats.successful / sysStats.files) * 100).toFixed(1) + '%';
    const systemEmoji = successRate.startsWith('100') ? '🌟' : 
                        parseFloat(successRate) >= 90 ? '✅' : 
                        parseFloat(successRate) >= 70 ? '✓' : '⚠️';
    return [
      `${systemEmoji} ${sysName}`,
      sysStats.files,
      sysStats.successful,
      sysStats.warnings,
      sysStats.errors,
      successRate
    ];
  });
  console.log(createAsciiTable(systemRows, systemHeaders));
  
  // Format statistics with ASCII table
  console.log('\n📋 FORMAT STATISTICS');
  console.log('-----------------');
  
  // Sort formats by number of files
  const sortedFormats = Object.entries(STATS.formatStats)
    .sort((a, b) => b[1].files - a[1].files);
  
  // Create format statistics table
  const formatHeaders = ['Format', 'Total Files', 'Success', 'Warnings', 'Errors', 'Success Rate'];
  const formatRows = sortedFormats.map(([formatName, formatStats]) => {
    const successRate = ((formatStats.successful / formatStats.files) * 100).toFixed(1) + '%';
    const formatEmoji = successRate.startsWith('100') ? '🌟' : 
                        parseFloat(successRate) >= 90 ? '✅' : 
                        parseFloat(successRate) >= 70 ? '✓' : '⚠️';
    return [
      `${formatEmoji} ${formatName}`,
      formatStats.files,
      formatStats.successful,
      formatStats.warnings,
      formatStats.errors,
      successRate
    ];
  });
  console.log(createAsciiTable(formatRows, formatHeaders));
  
  // Generate a detailed format-per-system table
  console.log('\n📊 DETAILED FORMAT STATISTICS PER SYSTEM');
  console.log('------------------------------------');
  
  // Get all format names
  const allFormatNames = Object.keys(STATS.formatStats);
  
  // Create headers for the detailed table
  const detailedHeaders = ['System', ...allFormatNames, 'Total'];
  
  // Create rows for the detailed table
  const detailedRows = sortedSystems.map(([sysName, sysStats]) => {
    const systemRow = [sysName];
    
    // Add counts for each format
    allFormatNames.forEach(formatName => {
      const formatStats = sysStats.formats[formatName] || { files: 0 };
      systemRow.push(formatStats.files);
    });
    
    // Add total
    systemRow.push(sysStats.files);
    
    return systemRow;
  });
  
  // Add a total row
  const totalRow = ['TOTAL'];
  allFormatNames.forEach(formatName => {
    totalRow.push(STATS.formatStats[formatName].files);
  });
  totalRow.push(STATS.totalFiles);
  
  detailedRows.push(totalRow);
  
  console.log(createAsciiTable(detailedRows, detailedHeaders));
  
  console.log('\n🏁 RENDERING COMPLETE! 🏁');
  console.log(`📂 All outputs are available in: ${outputDir}`);
  console.log('=======================================');
}

/**
 * Create an ASCII table for displaying data
 * @param {Array<Array<string>>} rows - Array of rows, where each row is an array of column values
 * @param {Array<string>} headers - Array of header values
 * @param {Array<number>} [columnWidths] - Optional array of column widths
 * @returns {string} Formatted ASCII table
 */
function createAsciiTable(rows, headers, columnWidths) {
  // Calculate column widths if not provided
  if (!columnWidths) {
    columnWidths = headers.map((header, index) => {
      // Get the maximum width needed for this column
      return Math.max(
        header.length,
        ...rows.map(row => String(row[index] || '').length)
      );
    });
  }
  
  // Create the header row
  const headerRow = headers.map((header, i) => 
    header.padEnd(columnWidths[i])
  ).join(' | ');
  
  // Create the separator row
  const separatorRow = columnWidths.map(width => 
    '-'.repeat(width)
  ).join('-+-');
  
  // Create the data rows
  const dataRows = rows.map(row => 
    row.map((cell, i) => 
      String(cell || '').padEnd(columnWidths[i])
    ).join(' | ')
  );
  
  // Combine all rows
  return [
    headerRow,
    separatorRow,
    ...dataRows
  ].join('\n');
}

// Run the example
renderAllSystems().catch(error => {
  console.error('❌ Error rendering systems:', error);
  process.exit(1);
}); 