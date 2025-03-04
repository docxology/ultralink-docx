/**
 * UltraLink Testing Utilities
 * Provides helper functions for running and analyzing tests
 */

const fs = require('fs');
const path = require('path');
const { UltraLink } = require('../src');
const config = require('./test-config');

/**
 * Creates a test logger for detailed test output
 * @param {string} testName - Name of the test
 * @param {Object} options - Logger options
 * @returns {Object} Logger object
 */
function createTestLogger(testName, options = {}) {
  const {
    logToConsole = true,
    logToFile = true,
    logLevel = 'info', // 'debug', 'info', 'warn', 'error'
    logFilePath = path.join(__dirname, '../logs', `${testName}-${Date.now()}.log`)
  } = options;
  
  // Ensure logs directory exists
  const logsDir = path.dirname(logFilePath);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  // Log levels
  const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
  
  const currentLevel = LOG_LEVELS[logLevel] || LOG_LEVELS.info;
  
  // Log entry prefixes
  const prefixes = {
    debug: '🔍 DEBUG',
    info: 'ℹ️ INFO',
    warn: '⚠️ WARN',
    error: '❌ ERROR'
  };
  
  // Create log entries
  const logs = [];
  
  // Logger methods
  const logger = {
    debug: (message, data) => log('debug', message, data),
    info: (message, data) => log('info', message, data),
    warn: (message, data) => log('warn', message, data),
    error: (message, data) => log('error', message, data),
    
    // Additional helper methods
    group: (label) => {
      if (logToConsole) console.group(label);
      logs.push({ level: 'group', message: label, timestamp: new Date() });
    },
    groupEnd: () => {
      if (logToConsole) console.groupEnd();
      logs.push({ level: 'groupEnd', timestamp: new Date() });
    },
    
    // Get all logs
    getLogs: () => logs,
    
    // Save logs to file
    saveLogs: () => {
      if (logToFile) {
        const logContent = logs.map(entry => {
          if (entry.level === 'group') return `\n=== ${entry.message} ===\n`;
          if (entry.level === 'groupEnd') return '\n';
          
          const timestamp = entry.timestamp.toISOString();
          const prefix = prefixes[entry.level] || '';
          const dataStr = entry.data ? `\n${JSON.stringify(entry.data, null, 2)}` : '';
          
          return `[${timestamp}] ${prefix}: ${entry.message}${dataStr}`;
        }).join('\n');
        
        fs.writeFileSync(logFilePath, logContent);
        return logFilePath;
      }
      return null;
    }
  };
  
  // Internal log function
  function log(level, message, data) {
    if (LOG_LEVELS[level] < currentLevel) return;
    
    const entry = {
      level,
      message,
      data,
      timestamp: new Date()
    };
    
    logs.push(entry);
    
    if (logToConsole) {
      const prefix = prefixes[level] || '';
      console.log(`${prefix} ${message}`);
      if (data) console.dir(data, { depth: null });
    }
  }
  
  return logger;
}

/**
 * Creates a test harness for running specific component tests
 * @param {string} componentName - Name of the component being tested
 * @param {Object} options - Test options
 * @returns {Object} Test harness object
 */
function createTestHarness(componentName, options = {}) {
  const {
    createFixture = () => new UltraLink(),
    cleanupFixture = () => {},
    logOptions = {}
  } = options;
  
  const logger = createTestLogger(componentName, logOptions);
  let fixture = null;
  
  const harness = {
    logger,
    
    // Setup test fixture
    setup: () => {
      logger.info(`Setting up test for ${componentName}`);
      fixture = createFixture();
      logger.debug('Fixture created', fixture);
      return fixture;
    },
    
    // Run a specific test case
    runTest: async (testName, testFn) => {
      logger.group(`Test: ${testName}`);
      try {
        if (!fixture) fixture = harness.setup();
        
        logger.info(`Running test: ${testName}`);
        const startTime = Date.now();
        const result = await testFn(fixture, logger);
        const duration = Date.now() - startTime;
        
        logger.info(`Test completed in ${duration}ms`);
        logger.debug('Test result', result);
        
        return { success: true, result, duration };
      } catch (error) {
        logger.error(`Test failed: ${error.message}`, error);
        return { success: false, error, message: error.message };
      } finally {
        logger.groupEnd();
      }
    },
    
    // Run multiple test cases
    runTests: async (tests) => {
      logger.info(`Running ${tests.length} tests for ${componentName}`);
      const results = { 
        component: componentName,
        total: tests.length,
        passed: 0,
        failed: 0,
        tests: []
      };
      
      for (const test of tests) {
        const testResult = await harness.runTest(test.name, test.test);
        
        if (testResult.success) {
          results.passed++;
        } else {
          results.failed++;
        }
        
        results.tests.push({
          name: test.name,
          status: testResult.success ? 'passed' : 'failed',
          ...testResult
        });
      }
      
      const logPath = logger.saveLogs();
      
      console.log(`\n📊 Test Results for ${componentName}:`);
      console.log(`Total: ${results.total}`);
      console.log(`Passed: ${results.passed}`);
      console.log(`Failed: ${results.failed}`);
      
      if (logPath) {
        console.log(`📝 Full logs saved to: ${logPath}`);
      }
      
      return results;
    },
    
    // Get current fixture
    getFixture: () => fixture,
    
    // Reset fixture
    resetFixture: () => {
      if (fixture) {
        logger.info('Resetting test fixture');
        cleanupFixture(fixture);
      }
      fixture = createFixture();
      logger.debug('Fixture reset', fixture);
      return fixture;
    },
    
    // Clean up
    cleanup: () => {
      logger.info('Cleaning up test resources');
      if (fixture) {
        cleanupFixture(fixture);
        fixture = null;
      }
      logger.saveLogs();
    }
  };
  
  return harness;
}

/**
 * Creates a test dataset for specific test scenarios
 * @param {string} datasetName - Name of the dataset
 * @param {Object} options - Dataset options
 * @returns {Object} UltraLink instance with test data
 */
function createTestDataset(datasetName, options = {}) {
  const ultralink = new UltraLink();
  
  switch (datasetName) {
    case 'minimal':
      // Create minimal dataset with just a few entities
      ultralink.addEntity('entity1', 'test', { name: 'Test Entity 1' });
      ultralink.addEntity('entity2', 'test', { name: 'Test Entity 2' });
      ultralink.addLink('entity1', 'entity2', 'relates_to');
      break;
      
    case 'desert-ecosystem':
      // Import the desert ecosystem dataset
      const desertDataset = require('./test-datasets').createDesertEcosystemDataset();
      
      // Add entities
      for (const entity of desertDataset.entities) {
        ultralink.addEntity(entity.id, entity.type, entity.attributes);
      }
      
      // Add relationships
      for (const rel of desertDataset.relationships) {
        ultralink.addLink(rel.source, rel.target, rel.type, rel.attributes);
      }
      break;
      
    case 'research-team':
      // Import the research team dataset
      const researchDataset = require('./test-datasets').createResearchTeamDataset();
      
      // Add entities
      for (const entity of researchDataset.entities) {
        ultralink.addEntity(entity.id, entity.type, entity.attributes);
      }
      
      // Add relationships
      for (const rel of researchDataset.relationships) {
        ultralink.addLink(rel.source, rel.target, rel.type, rel.attributes);
      }
      break;
      
    default:
      throw new Error(`Unknown dataset: ${datasetName}`);
  }
  
  return ultralink;
}

/**
 * Set up logging for tests
 * @param {string} testName - Name of the test for log file naming
 * @returns {Object} Logger object with info, warn, error methods
 */
function setupLogging(testName) {
  const logDir = path.join(__dirname, '../logs');
  
  // Ensure log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(logDir, `${testName}.log`);
  
  // Create or clear the log file
  fs.writeFileSync(logFile, `=== ${testName} Log ===\n\n`, { encoding: 'utf8' });
  
  // Create a simple logger
  const logger = {
    info: (message) => {
      const logMessage = `[INFO] ${new Date().toISOString()}: ${message}\n`;
      fs.appendFileSync(logFile, logMessage, { encoding: 'utf8' });
      console.log(message);
    },
    warn: (message) => {
      const logMessage = `[WARN] ${new Date().toISOString()}: ${message}\n`;
      fs.appendFileSync(logFile, logMessage, { encoding: 'utf8' });
      console.warn(message);
    },
    error: (message) => {
      const logMessage = `[ERROR] ${new Date().toISOString()}: ${message}\n`;
      fs.appendFileSync(logFile, logMessage, { encoding: 'utf8' });
      console.error(message);
    }
  };
  
  return logger;
}

/**
 * Creates a system-specific output directory and returns the path
 * @param {string} systemName - Name of the system (e.g., 'desert-ecosystem', 'research-team')
 * @param {string} formatName - Name of the export format (e.g., 'html', 'obsidian', 'graphml')
 * @returns {string} Path to the system-specific output directory
 */
function getSystemOutputPath(systemName, formatName) {
  const outputDir = path.join(__dirname, '../output', systemName, formatName);
  
  // Ensure the directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  return outputDir;
}

module.exports = {
  createTestLogger,
  createTestHarness,
  createTestDataset,
  config,
  setupLogging,
  getSystemOutputPath
}; 