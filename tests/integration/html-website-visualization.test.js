/**
 * HTML Website Visualization Integration Test
 * 
 * This test verifies that the HTML website export includes a properly functioning graph visualization.
 */

const { UltraLink } = require('../../src');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { fileURLToPath } = require('node:url');
const { JSDOM, VirtualConsole } = require('jsdom');

async function openExport(directory, graph) {
  for (const [filename, content] of Object.entries(graph.toHTMLWebsite())) {
    const destination = path.join(directory, filename);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
  }

  const errors = [];
  const virtualConsole = new VirtualConsole().on('jsdomError', error => errors.push(error.message));
  const dom = await JSDOM.fromFile(path.join(directory, 'index.html'), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole
  });
  if (dom.window.document.readyState !== 'complete') {
    await new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true }));
  }
  return { dom, errors };
}

function search(window, query) {
  const input = window.document.querySelector('#search-box');
  input.value = query;
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  return [...window.document.querySelectorAll('.entity-item:not([hidden]) a')];
}

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
    fs.rmSync(tempDir, { recursive: true });
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
    
    // The page loads the bundled D3 asset rather than requiring a CDN.
    expect(indexHtml).toContain('<script src="d3@7.min.js"></script>');
    expect(websiteOutput['d3@7.min.js']).toContain('https://d3js.org');
    const license = path.resolve(require.resolve('d3'), '../../LICENSE');
    expect(websiteOutput['d3-LICENSE.txt']).toBe(fs.readFileSync(license, 'utf8'));
    
    // Verify that index.html has the graph container
    expect(indexHtml).toContain('<div id="graph"></div>');
    
    // Verify that index.html loads the graph.js script after the container
    const graphScriptPosition = indexHtml.indexOf('<script src="graph.js"></script>');
    const graphContainerPosition = indexHtml.indexOf('<div id="graph"></div>');
    expect(graphScriptPosition).toBeGreaterThan(graphContainerPosition);
  });

  test('search matches relationship types and nested attributes on both endpoints', async () => {
    ultralink.addRelationship('Alice', 'Bob', 'approves_design', {
      records: [{ folder: 'blue binder' }]
    });
    const { dom, errors } = await openExport(tempDir, ultralink);
    try {
      const names = query => search(dom.window, query).map(link => link.textContent.trim());
      expect(names(' Blue Binder ')).toEqual(['Alice', 'Bob']);
      expect(names('approves_design')).toEqual(['Alice', 'Bob']);
      expect(names('data scientist')).toEqual(['Alice']);
      expect(names('NOT IN GRAPH')).toEqual([]);
      expect(names('')).toEqual(['Alice', 'Bob', 'Charlie', 'Project X']);
      expect(errors).toEqual([]);
    } finally {
      dom.window.close();
    }
  });

  test('a quoted entity ID preserves search and links to the actual detail page', async () => {
    const id = 'design "draft"';
    ultralink.addEntity(id, 'task', { name: 'Design Draft' });
    ultralink.addRelationship('Alice', id, 'reviews');
    const { dom, errors } = await openExport(tempDir, ultralink);
    try {
      const [result, unexpected] = search(dom.window, id);
      expect(unexpected).toBeUndefined();
      expect(result.textContent.trim()).toBe('Design Draft');
      const detailPath = path.join(tempDir, `${id}.html`);
      expect(fileURLToPath(result.href)).toBe(detailPath);
      expect(fs.readFileSync(detailPath, 'utf8')).toContain('<h1>Design Draft</h1>');
      expect(search(dom.window, 'NOT IN GRAPH')).toEqual([]);

      const details = await JSDOM.fromFile(path.join(tempDir, 'Alice.html'));
      try {
        const relationship = [...details.window.document.querySelectorAll('.relationships a')]
          .find(link => link.textContent.trim() === 'Design Draft');
        expect(fileURLToPath(relationship.href)).toBe(detailPath);
      } finally {
        details.window.close();
      }
      expect(errors).toEqual([]);
    } finally {
      dom.window.close();
    }
  });

  test('find in graph reveals the selected type without clearing other filters', async () => {
    ultralink.addEntity('Reference', 'document');
    const { dom, errors } = await openExport(tempDir, ultralink);
    try {
      const { document, getComputedStyle } = dom.window;
      const projectFilter = document.querySelector('#filter-project');
      const documentFilter = document.querySelector('#filter-document');
      const project = document.querySelector('.node[data-id="ProjectX"]');
      const reference = document.querySelector('.node[data-id="Reference"]');
      projectFilter.click();
      documentFilter.click();
      expect(getComputedStyle(project).display).toBe('none');

      search(dom.window, 'secret project')[0].parentElement.querySelector('button').click();

      expect(projectFilter.checked).toBe(true);
      expect(documentFilter.checked).toBe(false);
      expect(document.querySelector('.node.selected')).toBe(project);
      expect(getComputedStyle(project).display).not.toBe('none');
      expect(getComputedStyle(reference).display).toBe('none');
      const highlighted = [...document.querySelectorAll('.link.highlighted')];
      expect(highlighted).toHaveLength(3);
      expect(highlighted.map(edge => getComputedStyle(edge).display)).not.toContain('none');
      expect(errors).toEqual([]);
    } finally {
      dom.window.close();
    }
  });
}); 
