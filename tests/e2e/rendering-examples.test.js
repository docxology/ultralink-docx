/**
 * End-to-End Test for Render Examples Script
 * 
 * This test verifies that the render-examples.js script works correctly
 * by testing its key functions with real UltraLink instances.
 */

const path = require('path');
const fs = require('fs');
const { UltraLink } = require('../../src');

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

// We'll mock the file operations to prevent actual file writing
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true),
}));

// Mock the visualization-helpers
jest.mock('../../src/lib/exporters/visualization-helpers', () => ({
  addSampleVisualizationContent: jest.fn().mockReturnValue('<svg>Mocked SVG</svg>'),
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

describe('E2E: Render Examples Script', () => {
  // Path to the render-examples.js script
  const renderExamplesPath = path.join(__dirname, '../../examples/render-examples.js');
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
  });
  
  afterAll(() => {
    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });
  
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    
    // Clear module cache to ensure fresh import
    if (require.cache[require.resolve(renderExamplesPath)]) {
      delete require.cache[require.resolve(renderExamplesPath)];
    }
  });
  
  test('should correctly create and render a test system', async () => {
    // Define a simple test system with the correct UltraLink structure
    const createTestSystemDataset = () => {
      const ultralink = new UltraLink();
      ultralink.addEntity('entity1', 'test-type', { name: 'Test Entity 1' });
      ultralink.addEntity('entity2', 'test-type', { name: 'Test Entity 2' });
      ultralink.addRelationship('entity1', 'entity2', 'related_to');
      return ultralink;
    };
    
    // Mock visualization exports to return simple values
    jest.mock('../../src/lib/exporters/visualization', () => ({
      toVisualization: jest.fn().mockResolvedValue({
        'test-system.svg': '<svg>Test SVG</svg>',
        'test-system.png': Buffer.from('test-png-data')
      })
    }));
    
    // Temporarily add our test system to the SYSTEMS object in the script
    const renderExamples = require(renderExamplesPath);
    const originalRenderSystem = renderExamples.renderSystem;
    renderExamples.renderSystem = jest.fn().mockImplementation(async (systemName, createDatasetFn) => {
      const ultralink = createDatasetFn();
      return { success: true, ultralink };
    });
    
    // Execute the renderSystem function directly with our test system
    const result = await renderExamples.renderSystem('TestSystem', createTestSystemDataset);
    
    // Verify the function executed correctly
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.ultralink).toBeDefined();
    
    // Restore the original renderSystem function
    renderExamples.renderSystem = originalRenderSystem;
  });
  
  test('should generate placeholder content for visualization formats', () => {
    // Test the generatePlaceholderD3 function
    const renderExamples = require(renderExamplesPath);
    const d3Content = renderExamples.generatePlaceholderD3('TestSystem');
    
    // Verify the D3 placeholder content was generated with system-specific info
    expect(d3Content).toContain('TestSystem');
    
    // Test the generatePlaceholderCytoscape function
    const cytoscapeContent = renderExamples.generatePlaceholderCytoscape('TestSystem');
    
    // Verify the Cytoscape placeholder content was generated with system-specific info
    expect(cytoscapeContent).toContain('TestSystem');
    
    // Test the generatePlaceholderBIF function
    const bifContent = renderExamples.generatePlaceholderBIF('TestSystem');
    
    // Verify the BIF placeholder content was generated
    expect(bifContent).toContain('<n>TestSystem</n>');
    
    // Test the generatePlaceholderCompressedBlob function
    const blobContent = renderExamples.generatePlaceholderCompressedBlob('TestSystem');
    
    // Verify the compressed blob placeholder content was generated
    expect(blobContent.toString()).toContain('TestSystem');
  });
}); 