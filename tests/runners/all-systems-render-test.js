/**
 * All Systems Render Test Runner
 * 
 * This module provides a comprehensive test suite that renders and validates
 * all Systems of Interest in the project. It automatically discovers all systems
 * in the tests/fixtures/Systems directory, renders them in all supported formats,
 * and validates the outputs.
 */

const fs = require('fs').promises;
const path = require('path');
const { createDesertEcosystemDataset } = require('../fixtures/Systems/DesertEcosystem/desert-ecosystem');
const { createResearchTeamDataset } = require('../fixtures/Systems/ResearchTeam/research-team');
const OutputValidator = require('./output-validator');

// Configure paths
const SYSTEMS_DIR = path.join(__dirname, '../fixtures/Systems');
const OUTPUT_DIR = path.join(__dirname, '../../output/systems');
const LOG_DIR = path.join(__dirname, '../../logs/systems');

// Formats to render
const FORMATS = [
  'json',
  'graphml',
  'csv',
  'obsidian'
];

/**
 * Logger utility for detailed test execution tracking
 */
class SystemsLogger {
  constructor(systemName) {
    this.systemName = systemName;
    this.logs = [];
    this.startTime = Date.now();
  }

  log(message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    this.logs.push(entry);
    console.log(`[${this.systemName}] ${message}`);
  }

  async save() {
    const logFile = path.join(LOG_DIR, `${this.systemName}-${Date.now()}.log`);
    const content = this.logs.map(entry => 
      `[${entry.timestamp}] ${entry.message}\n${entry.data ? entry.data + '\n' : ''}`
    ).join('\n');
    
    await fs.mkdir(path.dirname(logFile), { recursive: true });
    await fs.writeFile(logFile, content);
  }
}

/**
 * Discovers all systems in the Systems directory
 * @returns {Promise<Array<string>>} Array of system names
 */
async function discoverSystems() {
  try {
    const entries = await fs.readdir(SYSTEMS_DIR, { withFileTypes: true });
    // Return only directory names and filter out README.md
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    console.error('Error discovering systems:', error);
    return [];
  }
}

/**
 * Creates an instance of a system by name
 * @param {string} systemName - Name of the system to create
 * @returns {Promise<Object>} UltraLink instance populated with the system data
 */
async function createSystem(systemName) {
  switch(systemName) {
    case 'DesertEcosystem':
      return createDesertEcosystemDataset();
    case 'ResearchTeam':
      return createResearchTeamDataset();
    default:
      throw new Error(`Unknown system: ${systemName}`);
  }
}

/**
 * Renders a system in all supported formats
 * @param {string} systemName - Name of the system to render
 * @param {Object} system - UltraLink instance populated with the system data
 * @param {SystemsLogger} logger - Logger instance for detailed logging
 * @returns {Promise<Object>} Object containing paths to all rendered outputs
 */
async function renderSystem(systemName, system, logger) {
  logger.log(`Starting render for ${systemName}`);
  
  const systemOutputDir = path.join(OUTPUT_DIR, systemName);
  await fs.mkdir(systemOutputDir, { recursive: true });
  
  const outputPaths = {};
  
  for (const format of FORMATS) {
    try {
      logger.log(`Rendering ${format} format`);
      
      let outputPath;
      let output;
      
      switch (format) {
        case 'json':
          output = await system.toJSON({ pretty: true });
          outputPath = path.join(systemOutputDir, `${systemName}.json`);
          if (typeof output !== 'string') {
            output = JSON.stringify(output, null, 2);
          }
          await fs.writeFile(outputPath, output);
          break;
          
        case 'graphml':
          output = await system.toGraphML();
          outputPath = path.join(systemOutputDir, `${systemName}.graphml`);
          await fs.writeFile(outputPath, output);
          break;
          
        case 'csv':
          const csvDir = path.join(systemOutputDir, 'csv');
          await fs.mkdir(csvDir, { recursive: true });
          
          const entityCsv = await system.toCSV({ type: 'entities' });
          await fs.writeFile(path.join(csvDir, 'entities.csv'), entityCsv);
          
          const relationshipCsv = await system.toCSV({ type: 'relationships' });
          await fs.writeFile(path.join(csvDir, 'relationships.csv'), relationshipCsv);
          
          outputPath = csvDir;
          break;
          
        case 'obsidian':
          const obsidianFiles = await system.toObsidian();
          const obsidianDir = path.join(systemOutputDir, 'obsidian');
          await fs.mkdir(obsidianDir, { recursive: true });
          
          // Write each file to the obsidian directory
          for (const [id, content] of Object.entries(obsidianFiles)) {
            const filePath = path.join(obsidianDir, `${id}.md`);
            await fs.writeFile(filePath, content);
          }
          
          outputPath = obsidianDir;
          break;
      }
      
      outputPaths[format] = outputPath;
      logger.log(`Successfully rendered ${format} to ${outputPath}`);
    } catch (error) {
      logger.log(`Error rendering ${format}: ${error.message}`);
      throw error;
    }
  }
  
  logger.log(`Completed rendering all formats for ${systemName}`);
  return outputPaths;
}

/**
 * Validates the rendered outputs for a system
 * @param {string} systemName - Name of the system to validate
 * @param {Object} outputPaths - Object containing paths to all rendered outputs
 * @param {SystemsLogger} logger - Logger instance for detailed logging
 * @returns {Promise<Object>} Validation results
 */
async function validateSystemOutputs(systemName, outputPaths, logger) {
  logger.log(`Starting validation for ${systemName}`);
  
  const validator = new OutputValidator(path.join(OUTPUT_DIR, systemName));
  
  try {
    // Validate JSON output
    logger.log('Validating JSON output');
    await validator.validateJSON(outputPaths.json);
    
    // Validate GraphML output
    logger.log('Validating GraphML output');
    await validator.validateGraphML(outputPaths.graphml);
    
    // Validate CSV output
    logger.log('Validating CSV output');
    await validator.validateCSV(path.join(outputPaths.csv, 'entities.csv'));
    await validator.validateCSV(path.join(outputPaths.csv, 'relationships.csv'));
    
    // Validate Obsidian output
    logger.log('Validating Obsidian output');
    await validator.validateObsidian(outputPaths.obsidian);
    
    logger.log('Validation complete');
    
    return validator.generateReport();
  } catch (error) {
    logger.log(`Validation error: ${error.message}`);
    throw error;
  }
}

/**
 * Main function to run tests for all systems
 */
async function runAllSystemsTests() {
  console.log('Starting All Systems Render Tests');
  
  try {
    // Create output and log directories
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(LOG_DIR, { recursive: true });
    
    // Discover all systems
    const systems = await discoverSystems();
    console.log(`Discovered ${systems.length} systems: ${systems.join(', ')}`);
    
    const results = {};
    
    // Process each system
    for (const systemName of systems) {
      const logger = new SystemsLogger(systemName);
      
      try {
        // Create the system
        logger.log(`Creating ${systemName} system`);
        const system = await createSystem(systemName);
        
        // Render the system in all formats
        logger.log(`Rendering ${systemName} in all formats`);
        const outputPaths = await renderSystem(systemName, system, logger);
        
        // Validate the outputs
        logger.log(`Validating ${systemName} outputs`);
        const validationResults = await validateSystemOutputs(systemName, outputPaths, logger);
        
        results[systemName] = {
          success: true,
          validation: validationResults
        };
        
        logger.log(`${systemName} testing completed successfully`);
      } catch (error) {
        logger.log(`Error processing ${systemName}: ${error.message}`);
        
        results[systemName] = {
          success: false,
          error: error.message
        };
      }
      
      // Save logs
      await logger.save();
    }
    
    // Write summary report
    const summaryReport = {
      timestamp: new Date().toISOString(),
      systems: Object.keys(results).length,
      successful: Object.values(results).filter(r => r.success).length,
      failed: Object.values(results).filter(r => !r.success).length,
      results
    };
    
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'all-systems-test-report.json'),
      JSON.stringify(summaryReport, null, 2)
    );
    
    console.log('All Systems Tests Complete');
    console.log(`Successful: ${summaryReport.successful}, Failed: ${summaryReport.failed}`);
    
    return summaryReport;
  } catch (error) {
    console.error('Fatal error running all systems tests:', error);
    throw error;
  }
}

// If this script is run directly, execute the tests
if (require.main === module) {
  runAllSystemsTests()
    .then(results => {
      if (results.failed > 0) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = {
  runAllSystemsTests,
  discoverSystems,
  createSystem,
  renderSystem,
  validateSystemOutputs
}; 