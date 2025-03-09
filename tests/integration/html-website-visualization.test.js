/**
 * HTML Website Visualization Integration Test
 * 
 * This test verifies that the HTML website export includes a properly functioning graph visualization.
 */

const { UltraLink } = require('../../src');
const fs = require('fs');
const path = require('path');
const os = require('os');
const rimraf = require('rimraf');

describe('HTML Website Visualization Tests', () => {
  let tempDir;
  let ultralink;

  beforeEach(() => {
    // Create a temporary directory for test outputs
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ultralink-html-test-'));
    
    // Create a new UltraLink instance with test data
    ultralink = new UltraLink();
    
    // Add entities
    ultralink.addEntity('Alice', 'person', {
      name: 'Alice',
      description: 'Data scientist'
    });
    
    ultralink.addEntity('Bob', 'person', {
      name: 'Bob',
      description: 'Software engineer'
    });
    
    ultralink.addEntity('Charlie', 'person', {
      name: 'Charlie',
      description: 'Designer'
    });
    
    ultralink.addEntity('ProjectX', 'project', {
      name: 'Project X',
      description: 'A secret project'
    });
    
    // Add relationships
    ultralink.addRelationship('Alice', 'Bob', 'collaborates_with');
    ultralink.addRelationship('Bob', 'Charlie', 'collaborates_with');
    ultralink.addRelationship('Charlie', 'Alice', 'collaborates_with');
    ultralink.addRelationship('Alice', 'ProjectX', 'manages');
    ultralink.addRelationship('Bob', 'ProjectX', 'works_on');
    ultralink.addRelationship('Charlie', 'ProjectX', 'works_on');
  });
  
  afterEach(() => {
    // Clean up the temporary directory after tests
    rimraf.sync(tempDir);
  });
  
  test('HTML website should include graph.js with proper graph data', async () => {
    // Generate HTML website
    const websiteOutput = ultralink.toHTMLWebsite({
      title: 'Test Knowledge Graph',
      description: 'Test description'
    });
    
    // Save the output to the temp directory
    Object.entries(websiteOutput).forEach(([filename, content]) => {
      fs.writeFileSync(path.join(tempDir, filename), content);
    });
    
    // Verify that graph.js exists
    expect(fs.existsSync(path.join(tempDir, 'graph.js'))).toBe(true);
    
    // Read graph.js content
    const graphJs = fs.readFileSync(path.join(tempDir, 'graph.js'), 'utf-8');
    
    // Verify that graph.js contains the correct data
    expect(graphJs).toContain('initializeGraph');
    expect(graphJs).toContain('d3.forceSimulation');
    
    // Check for nodes data
    expect(graphJs).toMatch(/["']id["']\s*:\s*["']Alice["']/);
    expect(graphJs).toMatch(/["']id["']\s*:\s*["']Bob["']/);
    expect(graphJs).toMatch(/["']id["']\s*:\s*["']Charlie["']/);
    expect(graphJs).toMatch(/["']id["']\s*:\s*["']ProjectX["']/);
    
    // Check for D3.js initialization
    expect(graphJs).toContain('const data = {');
    expect(graphJs).toMatch(/["']nodes["']/);
    expect(graphJs).toMatch(/["']links["']/);
    
    // Verify index.html includes the graph.js script
    const indexHtml = fs.readFileSync(path.join(tempDir, 'index.html'), 'utf-8');
    expect(indexHtml).toContain('<script src="graph.js"></script>');
    expect(indexHtml).toContain('<div id="graph"></div>');
  });
  
  test('graph.js should contain D3.js visualization initialization code', () => {
    // Generate HTML website
    const websiteOutput = ultralink.toHTMLWebsite();
    
    // Get graph.js content
    const graphJs = websiteOutput['graph.js'];
    
    // Check graph.js contains D3.js initialization code
    expect(graphJs).toContain('const data = {');
    expect(graphJs).toContain('initializeGraph(data)');
    
    // Verify it includes styling information
    expect(graphJs).toContain('getColorByType');
    
    // Verify it includes force simulation code
    expect(graphJs).toContain('d3.forceSimulation');
    expect(graphJs).toContain('.force(');
  });
  
  test('HTML website should correctly initialize the visualization on load', () => {
    // Generate HTML website
    const websiteOutput = ultralink.toHTMLWebsite();
    
    // Get index.html content
    const indexHtml = websiteOutput['index.html'];
    
    // Verify that index.html loads D3.js
    expect(indexHtml).toContain('<script src="https://d3js.org/d3.v7.min.js"></script>');
    
    // Verify that index.html has the graph container
    expect(indexHtml).toContain('<div id="graph"></div>');
    
    // Verify that index.html loads the graph.js script after the container
    const graphScriptPosition = indexHtml.indexOf('<script src="graph.js"></script>');
    const graphContainerPosition = indexHtml.indexOf('<div id="graph"></div>');
    expect(graphScriptPosition).toBeGreaterThan(graphContainerPosition);
  });
}); 