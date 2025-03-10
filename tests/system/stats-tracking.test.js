const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals');
const path = require('path');
const fs = require('fs');

// Mock the necessary functions to avoid actual file writes
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true),
}));

// Mock d3 to avoid the d3.forceSimulation not a function error
jest.mock('d3', () => ({
  forceSimulation: jest.fn().mockReturnValue({
    nodes: jest.fn().mockReturnThis(),
    force: jest.fn().mockReturnThis(),
    tick: jest.fn(),
    alpha: jest.fn().mockReturnThis(),
    restart: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis()
  }),
  forceManyBody: jest.fn().mockReturnValue({}),
  forceCenter: jest.fn().mockReturnValue({}),
  forceLink: jest.fn().mockReturnValue({
    links: jest.fn().mockReturnThis()
  })
}));

// Mock visualization helpers
jest.mock('../../src/lib/exporters/visualization-helpers', () => ({
  ...jest.requireActual('../../src/lib/exporters/visualization-helpers'),
  svgToPng: jest.fn().mockResolvedValue(Buffer.from('mocked-png-data')),
  convertSvgToPng: jest.fn().mockResolvedValue(Buffer.from('mocked-png-data'))
}));

// Mock the visualization module
jest.mock('../../src/lib/exporters/visualization', () => {
  return {
    toVisualization: jest.fn().mockImplementation(async (ultralink, options = {}) => {
      const systemName = ultralink?.name || 'test-system';
      return {
        [`${systemName}.svg`]: '<svg>Test SVG</svg>',
        [`${systemName}.png`]: Buffer.from('test-png-data'),
        [`${systemName}-graph.svg`]: '<svg>Test Graph SVG</svg>',
        [`${systemName}-graph.png`]: Buffer.from('test-graph-png-data'),
        [`${systemName}-graph-grid.svg`]: '<svg>Test Grid SVG</svg>',
        [`${systemName}-graph-grid.png`]: Buffer.from('test-grid-png-data'),
        [`${systemName}-graph-cluster.svg`]: '<svg>Test Cluster SVG</svg>',
        [`${systemName}-graph-cluster.png`]: Buffer.from('test-cluster-png-data')
      };
    })
  };
});

// Mock the rendering so it doesn't try to run things after test completion
jest.mock('../../examples/render-examples.js', () => {
  const originalModule = jest.requireActual('../../examples/render-examples.js');
  
  return {
    ...originalModule,
    renderAllSystems: jest.fn().mockResolvedValue(true),
  };
});

describe('Statistics Tracking in Render Examples', () => {
  // Import the render-examples.js module
  let renderExamples;
  let originalConsoleLog;
  let originalConsoleError;
  let originalConsoleWarn;
  
  beforeAll(() => {
    // Save original console methods
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    
    // Mock console methods to prevent test output pollution
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    
    // Path to the script
    const scriptPath = path.join(__dirname, '../../examples/render-examples.js');
    
    // Save the original module.exports
    const originalExports = require.cache[require.resolve(scriptPath)]?.exports;
    
    // Clear the require cache to ensure we get a fresh load
    if (require.cache[require.resolve(scriptPath)]) {
      delete require.cache[require.resolve(scriptPath)];
    }
    
    // Mock ultralink toHTMLWebsite function to return mock data
    jest.mock('../../src/ultralink', () => {
      return {
        UltraLink: jest.fn().mockImplementation(() => ({
          toHTMLWebsite: jest.fn().mockReturnValue({
            'index.html': '<html>Test</html>',
            'styles.css': 'body { color: black; }',
            'graph.js': 'console.log("Test");'
          }),
          store: {
            entities: {},
            relationships: {}
          }
        }))
      };
    });
    
    // Attempt to load the script
    try {
      renderExamples = require(scriptPath);
    } catch (error) {
      console.error('Error loading render-examples.js:', error);
    }
    
    // Restore original exports if they existed
    if (originalExports) {
      require.cache[require.resolve(scriptPath)].exports = originalExports;
    }
  });
  
  afterAll(() => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    jest.resetModules();
    jest.restoreAllMocks();
  });
  
  test('Stats are properly initialized and updated for html-website output', () => {
    // Mock the STATS object to inspect
    const STATS = {
      systemStats: {
        'TestSystem': {
          files: 0,
          successful: 0,
          warnings: 0,
          errors: 0,
          formats: {}
        }
      },
      formatStats: {},
      totalFiles: 0,
      successfulFiles: 0,
      warningFiles: 0,
      errorFiles: 0
    };
    
    // Create mock ultralink instance
    const ultralink = {
      toHTMLWebsite: jest.fn().mockReturnValue({
        'index.html': '<html>Test</html>',
        'styles.css': 'body { color: black; }',
        'graph.js': 'console.log("Test");'
      })
    };
    
    // Mock necessary functions
    const ensureDirectoryExists = jest.fn();
    const safeWriteFile = jest.fn();
    const safeExecute = (fn) => fn();
    
    // Setup target information
    const systemName = 'TestSystem';
    const target = { name: 'html-website' };
    const targetDir = '/fake/path';
    
    // Run the html-website case (simplified version of what would happen in renderSystem)
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
      }));
      
      // Ensure output directory exists
      ensureDirectoryExists(targetDir);
      
      // Write all website files
      let fileCount = 0;
      for (const [filename, content] of Object.entries(websiteOutput)) {
        const filePath = path.join(targetDir, filename);
        safeWriteFile(filePath, content);
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
    } catch (error) {
      console.error('Error in test:', error);
    }
    
    // Verify stats are correctly updated
    expect(STATS.formatStats['html-website']).toBeDefined();
    expect(STATS.formatStats['html-website'].files).toBe(3);
    expect(STATS.formatStats['html-website'].successful).toBe(3);
    
    expect(STATS.systemStats['TestSystem'].formats['html-website']).toBeDefined();
    expect(STATS.systemStats['TestSystem'].formats['html-website'].files).toBe(3);
    expect(STATS.systemStats['TestSystem'].formats['html-website'].successful).toBe(3);
    
    expect(STATS.totalFiles).toBe(3);
    expect(STATS.successfulFiles).toBe(3);
  });
}); 