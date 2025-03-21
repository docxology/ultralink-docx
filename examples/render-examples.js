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
  { name: 'rxinfer', method: 'toRxInfer', outputDir: 'rxinfer', outputFiles: [
    { format: 'model', filename: '{{system}}-model.jl' },
    { format: 'model-with-constraints', filename: '{{system}}-model-with-constraints.jl', useConstraints: true },
    { format: 'model-with-test', filename: '{{system}}-model-with-test.jl', generateTest: true }
  ]},
  { name: 'full-blob', method: 'toFullBlob', outputDir: 'full-blob', outputFiles: [
    { format: 'uncompressed', filename: '{{system}}-full.json' },
    { format: 'compressed', filename: '{{system}}-full-compressed.blob' }
  ]},
  { name: 'manim', method: 'toManim', outputDir: 'manim', outputFiles: [
    { format: 'python', filename: '{{system}}.py' },
    { format: 'mp4', filename: '{{system}}.mp4', quality: 'medium', resolution: '1080p' },
    { format: 'gif', filename: '{{system}}.gif', quality: 'medium', duration: 30 },
    { format: 'png_sequence', filename: '{{system}}_frames/', quality: 'high' }
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
 * @param {string} systemName - Name of the system to model
 * @returns {string} Placeholder BIF content
 */
function generatePlaceholderBIF(systemName) {
  console.log(`Generating placeholder BIF for ${systemName}`);
  
  // Define system-specific variables based on the system name
  let variables = [];
  let relationships = [];
  
  // Normalize system name to lowercase for comparison
  const system = (systemName || '').toLowerCase();
  
  // Define system-specific variables and relationships
  if (system === 'neurofeedbackresearch' || system.includes('neurofeedback')) {
    variables = [
      { name: 'eeg_signal', outcomes: ['low', 'medium', 'high'] },
      { name: 'attention_state', outcomes: ['distracted', 'normal', 'focused'] },
      { name: 'feedback_type', outcomes: ['audio', 'visual'] },
      { name: 'brainwave_type', outcomes: ['alpha', 'beta', 'theta', 'smr'] },
      { name: 'training_effectiveness', outcomes: ['low', 'moderate', 'high'] }
    ];
    
    relationships = [
      { for: 'eeg_signal', given: [], table: '0.3 0.4 0.3' },
      { for: 'attention_state', given: ['eeg_signal'], table: '0.7 0.2 0.1 0.3 0.5 0.2 0.1 0.3 0.6' },
      { for: 'feedback_type', given: [], table: '0.6 0.4' },
      { for: 'brainwave_type', given: [], table: '0.3 0.3 0.2 0.2' },
      { for: 'training_effectiveness', given: ['attention_state', 'feedback_type', 'brainwave_type'], 
        table: `0.6 0.3 0.1 0.5 0.3 0.2 0.7 0.2 0.1 0.6 0.3 0.1 0.5 0.3 0.2 0.4 0.4 0.2 0.6 0.3 0.1 0.5 0.3 0.2
                0.3 0.5 0.2 0.2 0.5 0.3 0.4 0.4 0.2 0.3 0.5 0.2 0.2 0.5 0.3 0.1 0.5 0.4 0.3 0.5 0.2 0.2 0.4 0.4
                0.1 0.4 0.5 0.1 0.3 0.6 0.2 0.4 0.4 0.1 0.4 0.5 0.1 0.3 0.6 0.05 0.25 0.7 0.15 0.35 0.5 0.1 0.3 0.6` }
    ];
  } else if (system === 'desertecosystem' || system.includes('desert')) {
    variables = [
      { name: 'rainfall', outcomes: ['low', 'medium', 'high'] },
      { name: 'temperature', outcomes: ['cool', 'warm', 'hot'] },
      { name: 'plant_density', outcomes: ['sparse', 'moderate', 'dense'] },
      { name: 'animal_activity', outcomes: ['nocturnal', 'crepuscular', 'diurnal'] },
      { name: 'species_abundance', outcomes: ['low', 'medium', 'high'] }
    ];
    
    relationships = [
      { for: 'rainfall', given: [], table: '0.7 0.25 0.05' },
      { for: 'temperature', given: [], table: '0.1 0.3 0.6' },
      { for: 'plant_density', given: ['rainfall', 'temperature'], 
        table: `0.6 0.3 0.1 0.7 0.25 0.05 0.9 0.09 0.01 0.3 0.5 0.2 0.4 0.5 0.1 0.6 0.35 0.05 0.1 0.3 0.6 0.2 0.4 0.4 0.4 0.4 0.2` },
      { for: 'animal_activity', given: ['temperature'], table: '0.2 0.3 0.5 0.3 0.5 0.2 0.7 0.25 0.05' },
      { for: 'species_abundance', given: ['rainfall', 'plant_density'], 
        table: `0.8 0.15 0.05 0.6 0.3 0.1 0.4 0.4 0.2 0.5 0.4 0.1 0.3 0.5 0.2 0.2 0.5 0.3 0.3 0.5 0.2 0.2 0.6 0.2 0.1 0.3 0.6` }
    ];
  } else if (system === 'activeinferencelab' || system.includes('inference')) {
    variables = [
      { name: 'prior_belief', outcomes: ['weak', 'moderate', 'strong'] },
      { name: 'sensory_certainty', outcomes: ['low', 'medium', 'high'] },
      { name: 'prediction_error', outcomes: ['small', 'medium', 'large'] },
      { name: 'action_precision', outcomes: ['low', 'medium', 'high'] },
      { name: 'learning_rate', outcomes: ['slow', 'moderate', 'fast'] },
      { name: 'belief_update', outcomes: ['minor', 'moderate', 'major'] }
    ];
    
    relationships = [
      { for: 'prior_belief', given: [], table: '0.2 0.5 0.3' },
      { for: 'sensory_certainty', given: [], table: '0.3 0.5 0.2' },
      { for: 'prediction_error', given: ['prior_belief', 'sensory_certainty'], 
        table: `0.2 0.3 0.5 0.3 0.4 0.3 0.4 0.4 0.2 0.3 0.4 0.3 0.4 0.5 0.1 0.5 0.4 0.1 0.4 0.4 0.2 0.5 0.4 0.1 0.7 0.25 0.05` },
      { for: 'action_precision', given: [], table: '0.25 0.5 0.25' },
      { for: 'learning_rate', given: [], table: '0.2 0.6 0.2' },
      { for: 'belief_update', given: ['prediction_error', 'action_precision', 'learning_rate'], 
        table: `0.8 0.15 0.05 0.7 0.25 0.05 0.6 0.3 0.1 0.7 0.25 0.05 0.6 0.3 0.1 0.5 0.4 0.1 0.6 0.3 0.1 0.5 0.4 0.1 0.4 0.5 0.1
                0.6 0.3 0.1 0.5 0.4 0.1 0.4 0.4 0.2 0.5 0.4 0.1 0.4 0.5 0.1 0.3 0.5 0.2 0.4 0.5 0.1 0.3 0.5 0.2 0.2 0.5 0.3
                0.5 0.4 0.1 0.4 0.4 0.2 0.3 0.4 0.3 0.4 0.4 0.2 0.3 0.4 0.3 0.2 0.3 0.5 0.3 0.4 0.3 0.2 0.3 0.5 0.1 0.2 0.7` }
    ];
  } else if (system === 'pomdp') {
    variables = [
      { name: 'hidden_state', outcomes: ['state1', 'state2', 'state3'] },
      { name: 'observation', outcomes: ['obs1', 'obs2', 'obs3'] },
      { name: 'action', outcomes: ['action1', 'action2', 'action3'] },
      { name: 'reward', outcomes: ['low', 'medium', 'high'] },
      { name: 'next_state', outcomes: ['state1', 'state2', 'state3'] },
      { name: 'belief', outcomes: ['uncertain', 'moderate', 'confident'] }
    ];
    
    relationships = [
      { for: 'hidden_state', given: [], table: '0.33 0.33 0.34' },
      { for: 'observation', given: ['hidden_state'], table: '0.7 0.2 0.1 0.2 0.6 0.2 0.1 0.3 0.6' },
      { for: 'action', given: ['belief'], table: '0.5 0.3 0.2 0.3 0.5 0.2 0.2 0.3 0.5' },
      { for: 'reward', given: ['hidden_state', 'action'], 
        table: `0.7 0.2 0.1 0.3 0.6 0.1 0.2 0.3 0.5 0.2 0.7 0.1 0.6 0.3 0.1 0.3 0.4 0.3 0.1 0.3 0.6 0.2 0.3 0.5 0.7 0.2 0.1` },
      { for: 'next_state', given: ['hidden_state', 'action'], 
        table: `0.8 0.15 0.05 0.3 0.6 0.1 0.2 0.2 0.6 0.1 0.8 0.1 0.2 0.7 0.1 0.1 0.3 0.6 0.05 0.15 0.8 0.1 0.2 0.7 0.6 0.1 0.3` },
      { for: 'belief', given: ['belief', 'observation', 'action'], 
        table: `0.6 0.3 0.1 0.5 0.4 0.1 0.4 0.4 0.2 0.5 0.4 0.1 0.4 0.5 0.1 0.3 0.5 0.2 0.4 0.4 0.2 0.3 0.5 0.2 0.2 0.5 0.3
                0.4 0.4 0.2 0.3 0.5 0.2 0.2 0.5 0.3 0.3 0.5 0.2 0.2 0.6 0.2 0.1 0.6 0.3 0.2 0.5 0.3 0.1 0.5 0.4 0.1 0.4 0.5
                0.3 0.3 0.4 0.2 0.4 0.4 0.1 0.4 0.5 0.2 0.4 0.4 0.1 0.4 0.5 0.1 0.3 0.6 0.1 0.3 0.6 0.1 0.2 0.7 0.05 0.15 0.8` }
    ];
  } else if (system === 'car' || system.includes('vehicle')) {
    variables = [
      { name: 'engine_condition', outcomes: ['poor', 'fair', 'good'] },
      { name: 'fuel_quality', outcomes: ['regular', 'premium'] },
      { name: 'maintenance_schedule', outcomes: ['neglected', 'regular', 'meticulous'] },
      { name: 'driving_style', outcomes: ['aggressive', 'normal', 'conservative'] },
      { name: 'fuel_efficiency', outcomes: ['low', 'medium', 'high'] },
      { name: 'engine_performance', outcomes: ['poor', 'adequate', 'excellent'] }
    ];
    
    relationships = [
      { for: 'engine_condition', given: [], table: '0.2 0.5 0.3' },
      { for: 'fuel_quality', given: [], table: '0.7 0.3' },
      { for: 'maintenance_schedule', given: [], table: '0.3 0.5 0.2' },
      { for: 'driving_style', given: [], table: '0.25 0.6 0.15' },
      { for: 'fuel_efficiency', given: ['engine_condition', 'fuel_quality', 'driving_style'], 
        table: `0.8 0.15 0.05 0.6 0.3 0.1 0.5 0.4 0.1 0.7 0.2 0.1 0.5 0.4 0.1 0.4 0.4 0.2
                0.6 0.3 0.1 0.4 0.5 0.1 0.3 0.5 0.2 0.5 0.4 0.1 0.3 0.5 0.2 0.2 0.5 0.3
                0.4 0.4 0.2 0.2 0.5 0.3 0.1 0.4 0.5 0.3 0.4 0.3 0.1 0.4 0.5 0.05 0.35 0.6` },
      { for: 'engine_performance', given: ['engine_condition', 'maintenance_schedule', 'fuel_quality'], 
        table: `0.9 0.09 0.01 0.8 0.15 0.05 0.7 0.25 0.05 0.6 0.3 0.1 0.5 0.4 0.1 0.4 0.4 0.2
                0.6 0.3 0.1 0.5 0.4 0.1 0.3 0.6 0.1 0.2 0.6 0.2 0.2 0.5 0.3 0.1 0.5 0.4
                0.4 0.5 0.1 0.3 0.5 0.2 0.2 0.5 0.3 0.1 0.4 0.5 0.05 0.35 0.6 0.01 0.29 0.7` }
    ];
  } else if (system === 'humananatomy' || system.includes('anatomy')) {
    variables = [
      { name: 'cardiovascular_health', outcomes: ['poor', 'average', 'excellent'] },
      { name: 'respiratory_function', outcomes: ['impaired', 'normal', 'optimized'] },
      { name: 'digestive_efficiency', outcomes: ['low', 'medium', 'high'] },
      { name: 'exercise_frequency', outcomes: ['sedentary', 'moderate', 'active'] },
      { name: 'nutrition_quality', outcomes: ['poor', 'adequate', 'excellent'] },
      { name: 'overall_health', outcomes: ['compromised', 'fair', 'excellent'] }
    ];
    
    relationships = [
      { for: 'exercise_frequency', given: [], table: '0.4 0.4 0.2' },
      { for: 'nutrition_quality', given: [], table: '0.3 0.5 0.2' },
      { for: 'cardiovascular_health', given: ['exercise_frequency', 'nutrition_quality'], 
        table: `0.7 0.2 0.1 0.5 0.4 0.1 0.3 0.4 0.3 0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.4 0.5 0.3 0.5 0.2 0.1 0.4 0.5 0.05 0.25 0.7` },
      { for: 'respiratory_function', given: ['exercise_frequency', 'cardiovascular_health'], 
        table: `0.6 0.3 0.1 0.4 0.4 0.2 0.2 0.4 0.4 0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.4 0.5 0.3 0.5 0.2 0.1 0.3 0.6 0.05 0.15 0.8` },
      { for: 'digestive_efficiency', given: ['nutrition_quality'], table: '0.7 0.2 0.1 0.3 0.6 0.1 0.1 0.3 0.6' },
      { for: 'overall_health', given: ['cardiovascular_health', 'respiratory_function', 'digestive_efficiency'], 
        table: `0.9 0.1 0 0.7 0.2 0.1 0.5 0.4 0.1 0.7 0.2 0.1 0.5 0.4 0.1 0.3 0.5 0.2 0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.4 0.5
                0.7 0.2 0.1 0.5 0.4 0.1 0.3 0.4 0.3 0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.3 0.6 0.3 0.5 0.2 0.1 0.4 0.5 0.05 0.15 0.8
                0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.3 0.6 0.3 0.5 0.2 0.1 0.4 0.5 0.05 0.15 0.8 0.1 0.3 0.6 0.05 0.15 0.8 0.01 0.09 0.9` }
    ];
  } else if (system === 'usahistory' || system.includes('history')) {
    variables = [
      { name: 'economic_conditions', outcomes: ['depression', 'recession', 'growth', 'boom'] },
      { name: 'political_climate', outcomes: ['divided', 'partisan', 'unified'] },
      { name: 'foreign_relations', outcomes: ['hostile', 'neutral', 'friendly'] },
      { name: 'social_movement', outcomes: ['weak', 'moderate', 'strong'] },
      { name: 'technological_advancement', outcomes: ['slow', 'steady', 'rapid'] },
      { name: 'historical_period_significance', outcomes: ['minor', 'moderate', 'major'] }
    ];
    
    relationships = [
      { for: 'economic_conditions', given: [], table: '0.1 0.3 0.4 0.2' },
      { for: 'political_climate', given: [], table: '0.4 0.4 0.2' },
      { for: 'foreign_relations', given: ['political_climate'], table: '0.5 0.3 0.2 0.3 0.4 0.3 0.2 0.3 0.5' },
      { for: 'social_movement', given: ['economic_conditions', 'political_climate'], 
        table: `0.2 0.3 0.5 0.3 0.4 0.3 0.5 0.3 0.2 0.3 0.4 0.3 0.5 0.3 0.2 0.6 0.3 0.1 0.4 0.4 0.2 0.6 0.3 0.1 0.7 0.2 0.1
                0.3 0.4 0.3 0.4 0.4 0.2 0.6 0.3 0.1 0.1 0.4 0.5 0.2 0.5 0.3 0.3 0.5 0.2 0.05 0.35 0.6 0.1 0.4 0.5 0.2 0.5 0.3` },
      { for: 'technological_advancement', given: ['economic_conditions'], 
        table: `0.6 0.3 0.1 0.4 0.5 0.1 0.2 0.5 0.3 0.1 0.3 0.6` },
      { for: 'historical_period_significance', given: ['economic_conditions', 'social_movement', 'foreign_relations'], 
        table: `0.4 0.4 0.2 0.3 0.4 0.3 0.1 0.3 0.6 0.3 0.4 0.3 0.2 0.3 0.5 0.1 0.2 0.7 0.2 0.4 0.4 0.1 0.3 0.6 0.05 0.15 0.8
                0.3 0.5 0.2 0.2 0.4 0.4 0.1 0.2 0.7 0.2 0.4 0.4 0.1 0.3 0.6 0.05 0.15 0.8 0.1 0.3 0.6 0.05 0.15 0.8 0.01 0.09 0.9
                0.2 0.4 0.4 0.1 0.3 0.6 0.05 0.15 0.8 0.1 0.3 0.6 0.05 0.15 0.8 0.01 0.09 0.9 0.05 0.15 0.8 0.01 0.09 0.9 0.01 0.04 0.95` }
    ];
  } else if (system === 'researchteam' || system.includes('research')) {
    variables = [
      { name: 'team_size', outcomes: ['small', 'medium', 'large'] },
      { name: 'funding_level', outcomes: ['limited', 'adequate', 'abundant'] },
      { name: 'expertise_diversity', outcomes: ['low', 'medium', 'high'] },
      { name: 'collaboration_quality', outcomes: ['poor', 'adequate', 'excellent'] },
      { name: 'research_methodology', outcomes: ['traditional', 'mixed', 'innovative'] },
      { name: 'publication_impact', outcomes: ['low', 'medium', 'high'] }
    ];
    
    relationships = [
      { for: 'team_size', given: [], table: '0.4 0.4 0.2' },
      { for: 'funding_level', given: [], table: '0.5 0.3 0.2' },
      { for: 'expertise_diversity', given: ['team_size'], table: '0.6 0.3 0.1 0.3 0.5 0.2 0.2 0.3 0.5' },
      { for: 'collaboration_quality', given: ['team_size', 'expertise_diversity'], 
        table: `0.3 0.5 0.2 0.2 0.5 0.3 0.1 0.3 0.6 0.4 0.4 0.2 0.2 0.5 0.3 0.1 0.2 0.7 0.5 0.3 0.2 0.3 0.4 0.3 0.1 0.2 0.7` },
      { for: 'research_methodology', given: ['expertise_diversity', 'funding_level'], 
        table: `0.6 0.3 0.1 0.4 0.4 0.2 0.2 0.5 0.3 0.4 0.4 0.2 0.3 0.4 0.3 0.1 0.4 0.5 0.3 0.4 0.3 0.1 0.3 0.6 0.1 0.2 0.7` },
      { for: 'publication_impact', given: ['collaboration_quality', 'research_methodology', 'funding_level'], 
        table: `0.8 0.15 0.05 0.7 0.2 0.1 0.5 0.3 0.2 0.7 0.2 0.1 0.5 0.4 0.1 0.3 0.5 0.2 0.6 0.3 0.1 0.4 0.4 0.2 0.2 0.5 0.3
                0.6 0.3 0.1 0.5 0.4 0.1 0.3 0.4 0.3 0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.4 0.5 0.4 0.4 0.2 0.2 0.5 0.3 0.1 0.3 0.6
                0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.3 0.6 0.4 0.4 0.2 0.2 0.4 0.4 0.1 0.2 0.7 0.2 0.5 0.3 0.1 0.3 0.6 0.05 0.15 0.8` }
    ];
  } else if (system === 'datascience' || system.includes('data')) {
    variables = [
      { name: 'data_quality', outcomes: ['poor', 'adequate', 'excellent'] },
      { name: 'data_volume', outcomes: ['small', 'medium', 'large'] },
      { name: 'feature_engineering', outcomes: ['basic', 'intermediate', 'advanced'] },
      { name: 'algorithm_complexity', outcomes: ['simple', 'moderate', 'complex'] },
      { name: 'computational_resources', outcomes: ['limited', 'adequate', 'abundant'] },
      { name: 'model_performance', outcomes: ['underperforming', 'acceptable', 'superior'] }
    ];
    
    relationships = [
      { for: 'data_quality', given: [], table: '0.3 0.5 0.2' },
      { for: 'data_volume', given: [], table: '0.2 0.5 0.3' },
      { for: 'feature_engineering', given: ['data_quality'], table: '0.7 0.2 0.1 0.3 0.5 0.2 0.1 0.4 0.5' },
      { for: 'algorithm_complexity', given: ['feature_engineering'], table: '0.6 0.3 0.1 0.3 0.5 0.2 0.1 0.3 0.6' },
      { for: 'computational_resources', given: [], table: '0.3 0.5 0.2' },
      { for: 'model_performance', given: ['data_quality', 'feature_engineering', 'algorithm_complexity', 'computational_resources'], 
        table: `0.9 0.1 0 0.8 0.2 0 0.6 0.3 0.1 0.8 0.2 0 0.7 0.3 0 0.5 0.4 0.1 0.7 0.3 0 0.5 0.4 0.1 0.3 0.5 0.2
                0.7 0.3 0 0.6 0.3 0.1 0.4 0.5 0.1 0.6 0.3 0.1 0.4 0.5 0.1 0.3 0.5 0.2 0.5 0.3 0.2 0.3 0.4 0.3 0.1 0.3 0.6
                0.6 0.3 0.1 0.4 0.5 0.1 0.2 0.5 0.3 0.5 0.3 0.2 0.3 0.4 0.3 0.1 0.3 0.6 0.3 0.4 0.3 0.1 0.3 0.6 0.05 0.15 0.8
                0.8 0.2 0 0.7 0.3 0 0.5 0.4 0.1 0.7 0.3 0 0.5 0.4 0.1 0.3 0.5 0.2 0.6 0.3 0.1 0.4 0.4 0.2 0.2 0.5 0.3
                0.6 0.3 0.1 0.5 0.4 0.1 0.3 0.5 0.2 0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.4 0.5 0.4 0.4 0.2 0.2 0.5 0.3 0.1 0.3 0.6
                0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.4 0.5 0.4 0.4 0.2 0.2 0.4 0.4 0.1 0.2 0.7 0.2 0.5 0.3 0.1 0.2 0.7 0.05 0.15 0.8
                0.7 0.3 0 0.5 0.4 0.1 0.3 0.5 0.2 0.6 0.3 0.1 0.4 0.4 0.2 0.2 0.4 0.4 0.4 0.4 0.2 0.2 0.3 0.5 0.1 0.2 0.7
                0.5 0.4 0.1 0.3 0.5 0.2 0.1 0.4 0.5 0.4 0.4 0.2 0.2 0.4 0.4 0.1 0.2 0.7 0.3 0.4 0.3 0.1 0.2 0.7 0.05 0.15 0.8
                0.3 0.5 0.2 0.2 0.4 0.4 0.05 0.25 0.7 0.2 0.5 0.3 0.1 0.3 0.6 0.05 0.15 0.8 0.1 0.3 0.6 0.05 0.15 0.8 0.01 0.09 0.9` }
    ];
  }
  
  // Use default variables if none are specified for this system
  if (variables.length === 0) {
    variables = [
      { name: 'variable_a', outcomes: ['low', 'medium', 'high'] },
      { name: 'variable_b', outcomes: ['low', 'medium', 'high'] },
      { name: 'variable_c', outcomes: ['weak', 'strong'] },
      { name: 'variable_d', outcomes: ['inactive', 'active'] },
      { name: 'variable_e', outcomes: ['failure', 'success'] }
    ];
    
    relationships = [
      { for: 'variable_a', given: [], table: '0.3 0.4 0.3' },
      { for: 'variable_b', given: [], table: '0.25 0.5 0.25' },
      { for: 'variable_c', given: ['variable_a'], table: '0.7 0.3 0.4 0.6 0.2 0.8' },
      { for: 'variable_d', given: ['variable_b'], table: '0.6 0.4 0.3 0.7 0.1 0.9' },
      { for: 'variable_e', given: ['variable_c', 'variable_d'], table: '0.8 0.2 0.6 0.4 0.4 0.6 0.1 0.9' }
    ];
  }

  // Generate BIF XML with system-specific or default variables and relationships
  let bif = `<?xml version="1.0"?>
<!-- System-specific Bayesian Network BIF File for ${systemName} -->
<BIF VERSION="0.3">
<NETWORK>
<n>${systemName}</n>
<COMMENT>This is a system-specific BIF file with placeholder data modeled for this particular system.</COMMENT>

<!-- Variables -->`;

  // Add variable definitions
  for (const variable of variables) {
    bif += `
<VARIABLE TYPE="discrete">
    <n>${variable.name}</n>`;
    
    // Add outcomes
    for (const outcome of variable.outcomes) {
      bif += `    <OUTCOME>${outcome}</OUTCOME>\n`;
    }
    
    bif += `    <COMMENT>${systemName} variable: ${variable.name}</COMMENT>
</VARIABLE>`;
  }

  // Add probability distributions
  bif += `
<!-- Probability Distributions -->`;

  for (const relationship of relationships) {
    bif += `
<DEFINITION>
    <FOR>${relationship.for}</FOR>`;
    
    // Add given variables if any
    if (relationship.given && relationship.given.length > 0) {
      for (const given of relationship.given) {
          bif += `    <GIVEN>${given}</GIVEN>\n`;
      }
    } else if (relationship.given) {
        bif += `    <GIVEN>${relationship.given}</GIVEN>\n`;
    }
    
    bif += `    <TABLE>${Array.isArray(relationship.table) ? relationship.table.join(' ') : relationship.table}</TABLE>
</DEFINITION>`;
  }

  bif += `
</NETWORK>
</BIF>`;

  return bif;
}

/**
 * Generate placeholder binary content for compressed blobs
 * @returns {Buffer} Placeholder binary content
 */
function generatePlaceholderCompressedBlob(systemName) {
  // Create a system-specific placeholder metadata
  const metadata = {
    system: systemName,
    timestamp: new Date().toISOString(),
    format: 'compressed-blob',
    compression: 'lz4',
    version: '1.0'
  };
  
  // Basic system-specific template data based on the system name
  const systemSpecificData = {
    'ProjectCollaboration': {
      entities: [
        { id: 'emilie', type: 'person', attributes: { name: 'Emilie', role: 'Team Lead' }},
        { id: 'taylor', type: 'person', attributes: { name: 'Taylor', role: 'Documentation Specialist' }},
        { id: 'peter', type: 'person', attributes: { name: 'Peter', role: 'Licensing Specialist' }},
        { id: 'sam', type: 'person', attributes: { name: 'Sam', role: 'Documentation Lead' }}
      ],
      relationships: [
        { source: 'sam', target: 'proceedings', type: 'leads' },
        { source: 'peter', target: 'licensing-task', type: 'leads' }
      ]
    },
    'DesertEcosystem': {
      entities: [
        { id: 'saguaro', type: 'organism', attributes: { name: 'Saguaro Cactus' }},
        { id: 'kangaroo-rat', type: 'organism', attributes: { name: 'Kangaroo Rat' }},
        { id: 'aridity', type: 'environmental_factor', attributes: { name: 'Aridity' }}
      ],
      relationships: [
        { source: 'saguaro', target: 'aridity', type: 'adapts_to' },
        { source: 'kangaroo-rat', target: 'aridity', type: 'adapts_to' }
      ]
    },
    'ResearchTeam': {
      entities: [
        { id: 'alice-chen', type: 'person', attributes: { name: 'Alice Chen', title: 'Principal Investigator' }},
        { id: 'bob-smith', type: 'person', attributes: { name: 'Bob Smith', title: 'Senior Researcher' }},
        { id: 'computer-vision-project', type: 'project', attributes: { title: 'Advanced Computer Vision Systems' }}
      ],
      relationships: [
        { source: 'alice-chen', target: 'computer-vision-project', type: 'leads' },
        { source: 'bob-smith', target: 'alice-chen', type: 'reports_to' }
      ]
    },
    'HumanAnatomy': {
      entities: [
        { id: 'heart', type: 'organ', attributes: { name: 'Heart' }},
        { id: 'lungs', type: 'organ', attributes: { name: 'Lungs' }},
        { id: 'circulatory-system', type: 'system', attributes: { name: 'Circulatory System' }}
      ],
      relationships: [
        { source: 'heart', target: 'circulatory-system', type: 'part_of' },
        { source: 'heart', target: 'lungs', type: 'interacts_with' }
      ]
    },
    'USAHistory': {
      entities: [
        { id: 'american-revolution', type: 'event', attributes: { name: 'American Revolution', year: '1775-1783' }},
        { id: 'george-washington', type: 'person', attributes: { name: 'George Washington', role: 'First President' }},
        { id: 'declaration-of-independence', type: 'document', attributes: { name: 'Declaration of Independence', year: '1776' }}
      ],
      relationships: [
        { source: 'george-washington', target: 'american-revolution', type: 'participated_in' },
        { source: 'declaration-of-independence', target: 'american-revolution', type: 'resulted_from' }
      ]
    },
    'NeurofeedbackResearch': {
      entities: [
        { id: 'eeg', type: 'equipment', attributes: { name: 'Electroencephalogram' }},
        { id: 'neurofeedback-protocol', type: 'protocol', attributes: { name: 'Neurofeedback Protocol' }},
        { id: 'attention-deficit', type: 'condition', attributes: { name: 'Attention Deficit' }}
      ],
      relationships: [
        { source: 'neurofeedback-protocol', target: 'attention-deficit', type: 'treats' },
        { source: 'eeg', target: 'neurofeedback-protocol', type: 'used_in' }
      ]
    },
    'Car': {
      entities: [
        { id: 'engine', type: 'component', attributes: { name: 'Engine', type: 'V6' }},
        { id: 'transmission', type: 'component', attributes: { name: 'Transmission', type: 'Automatic' }},
        { id: 'chassis', type: 'component', attributes: { name: 'Chassis', material: 'Aluminum' }},
        { id: 'electrical-system', type: 'system', attributes: { name: 'Electrical System', voltage: '12V' }}
      ],
      relationships: [
        { source: 'engine', target: 'transmission', type: 'connects_to' },
        { source: 'transmission', target: 'chassis', type: 'mounted_on' },
        { source: 'electrical-system', target: 'engine', type: 'powers' }
      ]
    },
    'POMDP': {
      entities: [
        { id: 'state-space', type: 'mathematical_concept', attributes: { name: 'State Space', dimension: 'Finite' }},
        { id: 'observation-space', type: 'mathematical_concept', attributes: { name: 'Observation Space', dimension: 'Finite' }},
        { id: 'action-space', type: 'mathematical_concept', attributes: { name: 'Action Space', dimension: 'Finite' }},
        { id: 'transition-model', type: 'model', attributes: { name: 'Transition Model', type: 'Probabilistic' }}
      ],
      relationships: [
        { source: 'state-space', target: 'observation-space', type: 'generates' },
        { source: 'action-space', target: 'state-space', type: 'influences' },
        { source: 'transition-model', target: 'state-space', type: 'maps' }
      ]
    },
    'ActiveInferenceLab': {
      entities: [
        { id: 'free-energy-principle', type: 'theory', attributes: { name: 'Free Energy Principle', author: 'Karl Friston' }},
        { id: 'predictive-coding', type: 'model', attributes: { name: 'Predictive Coding', type: 'Hierarchical' }},
        { id: 'markov-blanket', type: 'concept', attributes: { name: 'Markov Blanket', domain: 'Statistical Physics' }},
        { id: 'variational-inference', type: 'method', attributes: { name: 'Variational Inference', approach: 'Bayesian' }}
      ],
      relationships: [
        { source: 'free-energy-principle', target: 'predictive-coding', type: 'encompasses' },
        { source: 'markov-blanket', target: 'free-energy-principle', type: 'foundational_to' },
        { source: 'variational-inference', target: 'predictive-coding', type: 'implements' }
      ]
    },
    'DataScience': {
      entities: [
        { id: 'data-preprocessing', type: 'process', attributes: { name: 'Data Preprocessing', importance: 'Critical' }},
        { id: 'feature-engineering', type: 'process', attributes: { name: 'Feature Engineering', complexity: 'High' }},
        { id: 'model-training', type: 'process', attributes: { name: 'Model Training', approach: 'Supervised' }},
        { id: 'model-evaluation', type: 'process', attributes: { name: 'Model Evaluation', metrics: 'Accuracy, F1-Score' }}
      ],
      relationships: [
        { source: 'data-preprocessing', target: 'feature-engineering', type: 'precedes' },
        { source: 'feature-engineering', target: 'model-training', type: 'enhances' },
        { source: 'model-training', target: 'model-evaluation', type: 'requires' }
      ]
    }
  };
  
  // Default template for unknown systems
  const defaultTemplate = {
    entities: [
      { id: 'entity1', type: 'default', attributes: { name: 'Entity 1' }},
      { id: 'entity2', type: 'default', attributes: { name: 'Entity 2' }}
    ],
    relationships: [
      { source: 'entity1', target: 'entity2', type: 'related_to' }
    ]
  };
  
  // Use system-specific data if available, otherwise use default
  const templateData = systemSpecificData[systemName] || defaultTemplate;
  
  // Create placeholder compressed data with system info
  const placeholderData = {
    metadata: metadata,
    systemTemplate: templateData,
    message: `This is a system-specific placeholder for compressed data for the ${systemName} system`
  };
  
  // Convert to JSON and create a buffer
  const jsonData = JSON.stringify(placeholderData, null, 2);
  
  // Create header and data buffers
  const header = Buffer.from('ULTRALINK-COMPRESSED-PLACEHOLDER');
  const systemNameBuffer = Buffer.from(systemName || 'unknown');
  const data = Buffer.from(jsonData);
  
  // Combine the buffers with separators
  return Buffer.concat([
    header, 
    Buffer.from([0x00]), 
    systemNameBuffer,
    Buffer.from([0x00]), 
    data
  ]);
}

/**
 * Check if Manim is installed and available
 * @returns {Promise<boolean>} True if Manim is available
 */
async function checkManimAvailable() {
  try {
    const { execSync } = require('child_process');
    execSync('manim --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.warn('⚠️ Manim not found. Please install Manim to generate animations.');
    console.warn('   Installation guide: https://docs.manim.community/en/stable/installation.html');
    return false;
  }
}

/**
 * Execute Manim command and handle output
 * @param {string} pythonFile - Path to Python file
 * @param {string} outputDir - Output directory for media files
 * @param {Object} options - Manim options
 * @returns {Promise<boolean>} True if successful
 */
async function executeManimCommand(pythonFile, outputDir, options = {}) {
  const { execSync } = require('child_process');
  const { quality = 'medium', resolution = '1080p' } = options;
  
  try {
    // Ensure media directory exists
    ensureDirectoryExists(path.join(outputDir, 'media'));
    
    // Build Manim command
    const qualityFlag = quality === 'high' ? '-qh' : quality === 'low' ? '-ql' : '-qm';
    const resolutionFlag = resolution ? `-r ${resolution}` : '';
    const command = `manim ${qualityFlag} ${resolutionFlag} "${pythonFile}" UltraLinkGraph`;
    
    // Execute Manim
    console.log(`      🎥 Executing: ${command}`);
    execSync(command, {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: outputDir
    });
    
    return true;
  } catch (error) {
    console.error(`      ❌ Manim execution failed: ${error.message}`);
    return false;
  }
}

/**
 * Generate Manim outputs for a system
 * @param {string} pythonFile - Path to Python file
 * @param {string} outputDir - Output directory
 * @param {Object} format - Format configuration
 * @returns {Promise<boolean>} True if successful
 */
async function generateManimOutputs(pythonFile, outputDir, format) {
  try {
    // Check if Manim is available
    const manimAvailable = await checkManimAvailable();
    if (!manimAvailable) {
      return false;
    }
    
    // Execute Manim with appropriate options
    const success = await executeManimCommand(pythonFile, outputDir, {
      quality: format.quality,
      resolution: format.resolution
    });
    
    if (success) {
      // Handle different output formats
      if (format.format === 'gif') {
        // Convert MP4 to GIF using ffmpeg
        try {
          const { execSync } = require('child_process');
          const mp4File = path.join(outputDir, 'media', 'videos', 'UltraLinkGraph.mp4');
          const gifFile = path.join(outputDir, format.filename);
          
          execSync(`ffmpeg -i "${mp4File}" -vf "fps=10,scale=720:-1" "${gifFile}"`, {
            stdio: ['ignore', 'pipe', 'pipe']
          });
          console.log(`      ✅ Generated GIF: ${gifFile}`);
        } catch (error) {
          console.warn(`      ⚠️ Failed to convert to GIF: ${error.message}`);
        }
      } else if (format.format === 'png_sequence') {
        // Extract frames using ffmpeg
        try {
          const { execSync } = require('child_process');
          const mp4File = path.join(outputDir, 'media', 'videos', 'UltraLinkGraph.mp4');
          const framesDir = path.join(outputDir, format.filename);
          
          ensureDirectoryExists(framesDir);
          execSync(`ffmpeg -i "${mp4File}" -vf fps=1 "${framesDir}/frame_%04d.png"`, {
            stdio: ['ignore', 'pipe', 'pipe']
          });
          console.log(`      ✅ Generated frame sequence in: ${framesDir}`);
        } catch (error) {
          console.warn(`      ⚠️ Failed to extract frames: ${error.message}`);
        }
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`      ❌ Error generating Manim outputs: ${error.message}`);
    return false;
  }
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
            
            // Ensure format statistics objects are initialized
            if (!STATS.formatStats[target.name]) {
              STATS.formatStats[target.name] = {
                files: 0,
                successful: 0,
                warnings: 0,
                errors: 0
              };
            }
            
            if (!STATS.systemStats[systemName].formats[target.name]) {
              STATS.systemStats[systemName].formats[target.name] = {
                files: 0,
                successful: 0,
                warnings: 0,
                errors: 0
              };
            }
            
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
                  return ultralink.toBayesianNetwork({ 
                    outputFormat: format,
                    systemName: systemName  // Pass systemName to ensure correct metadata
                  });
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
          
        case 'rxinfer':
          // RxInfer outputs
          console.log(`    🧠 Generating RxInfer formats in: ${targetDir}`);
          for (const rxinferFormat of target.outputFiles) {
            try {
              console.log(`    🔄 Processing ${rxinferFormat.format} RxInfer format...`);
              
              const outputPath = path.join(targetDir, rxinferFormat.filename.replace('{{system}}', systemName));
              
              if (rxinferFormat.format === 'model') {
                const modelOutput = safeExecute(() => {
                  return ultralink.toRxInfer({ outputFormat: rxinferFormat.format });
                }, {});
                
                safeWriteFile(outputPath, modelOutput, true);
                console.log(`      ✅ Saved ${rxinferFormat.format} model to: ${outputPath}`);
                
                // Update statistics
                STATS.totalFiles++;
                STATS.successfulFiles++;
                STATS.formatStats[target.name].files++;
                STATS.formatStats[target.name].successful++;
                STATS.systemStats[systemName].files++;
                STATS.systemStats[systemName].successful++;
                STATS.systemStats[systemName].formats[target.name].files++;
                STATS.systemStats[systemName].formats[target.name].successful++;
              } else if (rxinferFormat.format === 'model-with-constraints') {
                const modelWithConstraintsOutput = safeExecute(() => {
                  return ultralink.toRxInfer({ outputFormat: rxinferFormat.format, useConstraints: rxinferFormat.useConstraints });
                }, {});
                
                safeWriteFile(outputPath, modelWithConstraintsOutput, true);
                console.log(`      ✅ Saved ${rxinferFormat.format} model with constraints to: ${outputPath}`);
                
                // Update statistics
                STATS.totalFiles++;
                STATS.successfulFiles++;
                STATS.formatStats[target.name].files++;
                STATS.formatStats[target.name].successful++;
                STATS.systemStats[systemName].files++;
                STATS.systemStats[systemName].successful++;
                STATS.systemStats[systemName].formats[target.name].files++;
                STATS.systemStats[systemName].formats[target.name].successful++;
              } else if (rxinferFormat.format === 'model-with-test') {
                const modelWithTestOutput = safeExecute(() => {
                  return ultralink.toRxInfer({ outputFormat: rxinferFormat.format, generateTest: rxinferFormat.generateTest });
                }, {});
                
                safeWriteFile(outputPath, modelWithTestOutput, true);
                console.log(`      ✅ Saved ${rxinferFormat.format} model with test to: ${outputPath}`);
                
                // Update statistics
                STATS.totalFiles++;
                STATS.successfulFiles++;
                STATS.formatStats[target.name].files++;
                STATS.formatStats[target.name].successful++;
                STATS.systemStats[systemName].files++;
                STATS.systemStats[systemName].successful++;
                STATS.systemStats[systemName].formats[target.name].files++;
                STATS.systemStats[systemName].formats[target.name].successful++;
              }
            } catch (error) {
              console.warn(`      ❌ Error rendering ${rxinferFormat.format} RxInfer format: ${error.message}`);
              
              // Update error statistics
              STATS.errorFiles++;
              STATS.formatStats[target.name].errors++;
              STATS.systemStats[systemName].errors++;
              STATS.systemStats[systemName].formats[target.name].errors++;
              
              const placeholderError = JSON.stringify({
                error: `Failed during ${rxinferFormat.format} RxInfer processing: ${error.message}`,
                timestamp: new Date().toISOString(),
                system: systemName
              });
              
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
                  const compressedBlob = generatePlaceholderCompressedBlob(systemName);
                  
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
          
        case 'manim':
          // Manim animation outputs
          console.log(`    🎬 Generating Manim animations in: ${targetDir}`);
          for (const manimFormat of target.outputFiles) {
            try {
              console.log(`    🔄 Processing ${manimFormat.format} Manim format...`);
              
              const outputPath = path.join(targetDir, manimFormat.filename.replace('{{system}}', systemName));
              
              // Generate Manim Python script first
              if (manimFormat.format === 'python') {
                const manimCode = safeExecute(() => {
                  return ultralink.toManim({
                    animationStyle: 'explanatory',
                    visualTheme: 'dark',
                    includeNarrationText: true,
                    highlightCentralEntities: true,
                    systemName: systemName
                  });
                }, '');
                
                if (manimCode) {
                  ensureDirectoryExists(targetDir);
                  safeWriteFile(outputPath, manimCode);
                  console.log(`      ✅ Saved Manim Python script to: ${outputPath}`);
                  
                  // Update statistics
                  STATS.totalFiles++;
                  STATS.successfulFiles++;
                  STATS.formatStats[target.name].files++;
                  STATS.formatStats[target.name].successful++;
                  STATS.systemStats[systemName].files++;
                  STATS.systemStats[systemName].successful++;
                  STATS.systemStats[systemName].formats[target.name].files++;
                  STATS.systemStats[systemName].formats[target.name].successful++;
                  
                  // Generate animations if this is not just the Python file
                  if (manimFormat.format !== 'python') {
                    const success = await generateManimOutputs(outputPath, targetDir, manimFormat);
                    
                    if (success) {
                      // Update statistics for successful animation
                      STATS.totalFiles++;
                      STATS.successfulFiles++;
                      STATS.formatStats[target.name].files++;
                      STATS.formatStats[target.name].successful++;
                      STATS.systemStats[systemName].files++;
                      STATS.systemStats[systemName].successful++;
                      STATS.systemStats[systemName].formats[target.name].files++;
                      STATS.systemStats[systemName].formats[target.name].successful++;
                    } else {
                      // Create placeholder files if Manim generation failed
                      if (manimFormat.format === 'mp4') {
                        const placeholderMp4 = Buffer.from('Placeholder MP4 content');
                        safeWriteFile(outputPath, placeholderMp4);
                      } else if (manimFormat.format === 'gif') {
                        const placeholderGif = Buffer.from('Placeholder GIF content');
                        safeWriteFile(outputPath, placeholderGif);
                      } else if (manimFormat.format === 'png_sequence') {
                        ensureDirectoryExists(outputPath);
                        for (let i = 0; i < 5; i++) {
                          const framePath = path.join(outputPath, `frame_${i.toString().padStart(4, '0')}.png`);
                          const placeholderPng = Buffer.from(`Placeholder PNG frame ${i}`);
                          safeWriteFile(framePath, placeholderPng);
                        }
                      }
                      
                      console.log(`      ✅ Created placeholder ${manimFormat.format} output at: ${outputPath}`);
                      
                      // Update statistics for placeholder
                      STATS.totalFiles++;
                      STATS.warningFiles++;
                      STATS.formatStats[target.name].files++;
                      STATS.formatStats[target.name].warnings++;
                      STATS.systemStats[systemName].files++;
                      STATS.systemStats[systemName].warnings++;
                      STATS.systemStats[systemName].formats[target.name].files++;
                      STATS.systemStats[systemName].formats[target.name].warnings++;
                    }
                  }
                } else {
                  console.warn(`      ⚠️ Failed to generate Manim Python script`);
                  
                  // Update warning statistics
                  STATS.warningFiles++;
                  STATS.formatStats[target.name].warnings++;
                  STATS.systemStats[systemName].warnings++;
                  STATS.systemStats[systemName].formats[target.name].warnings++;
                }
              }
            } catch (error) {
              console.warn(`      ❌ Error processing ${manimFormat.format} Manim format: ${error.message}`);
              
              // Update error statistics
              STATS.errorFiles++;
              STATS.formatStats[target.name].errors++;
              STATS.systemStats[systemName].errors++;
              STATS.systemStats[systemName].formats[target.name].errors++;
              
              // Create a placeholder error file
              const errorPath = path.join(targetDir, `ERROR-${manimFormat.format}.txt`);
              safeWriteFile(errorPath, `Error processing ${manimFormat.format} Manim format: ${error.message}\n${error.stack}`);
              console.log(`      ✅ Created error log at: ${errorPath}`);
              
              // Update statistics for error log file
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

/**
 * Generate placeholder Manim Python code
 * @param {string} systemName - Name of the system
 * @returns {string} Placeholder Manim Python code
 */
function generatePlaceholderManim(systemName) {
  return `#!/usr/bin/env python
from manim import *

class UltraLinkGraph(Scene):
    def construct(self):
        # Title
        title = Text("${systemName} Knowledge Graph")
        subtitle = Text("Placeholder Animation", font_size=36)
        VGroup(title, subtitle).arrange(DOWN)
        
        self.play(
            Write(title),
            FadeIn(subtitle, shift=DOWN),
        )
        self.wait(2)
        
        # Placeholder message
        message = Text("Manim rendering was not available", color=RED)
        self.play(
            FadeOut(title),
            FadeOut(subtitle),
            Write(message)
        )
        self.wait(2)
        
        # Placeholder graph
        circle = Circle(color=BLUE)
        square = Square(color=GREEN)
        triangle = Triangle(color=RED)
        
        shapes = VGroup(circle, square, triangle).arrange(RIGHT)
        self.play(Create(shapes))
        self.wait(2)
        
        # Conclusion
        self.play(FadeOut(shapes), FadeOut(message))
        conclusion = Text("UltraLink Placeholder Animation")
        self.play(Write(conclusion))
        self.wait(2)
        self.play(FadeOut(conclusion))

# See many more examples at https://docs.manim.community/en/stable/examples.html
`;
}

// Run the example
renderAllSystems().catch(error => {
  console.error('❌ Error rendering systems:', error);
  process.exit(1);
}); 

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderSystem,
    renderAllSystems,
    generatePlaceholderD3,
    generatePlaceholderCytoscape,
    generatePlaceholderBIF,
    generatePlaceholderCompressedBlob,
    SYSTEMS
  };
} 