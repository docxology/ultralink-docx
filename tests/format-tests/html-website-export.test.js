const fs = require('fs');
const path = require('path');
const os = require('os');
const { JSDOM } = require('jsdom');
const { UltraLink } = require('../../src');
const { setupLogging, getSystemOutputPath } = require('../test-utils');

// Set up logging for this test
const logger = setupLogging('html-website-export-test');

function writeWebsite(directory, files) {
  for (const [filename, content] of Object.entries(files)) {
    const destination = path.join(directory, filename);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
  }
}

describe('HTML Website Export', () => {
  // System names for organizing output
  const desertSystem = 'desert-ecosystem';
  const projectSystem = 'project-management';
  
  // Clean up after tests
  afterAll(() => {
    logger.info('Cleaning up test resources');
    // We'll keep the output files for inspection
  });
  
  test('Basic HTML Website export structure', () => {
    logger.info('Setting up test dataset');
    
    // Create a simple dataset
    const ultralink = new UltraLink();
    
    // Add some entities
    ultralink.addEntity(
      'desert',
      'ecosystem',
      {
        name: 'Desert',
        climate: 'arid',
        averageRainfall: '< 250mm per year'
      }
    );
    
    ultralink.addEntity(
      'saguaro',
      'plant',
      {
        name: 'Saguaro Cactus',
        scientificName: 'Carnegiea gigantea',
        height: 'up to 12m',
        lifespan: '150-200 years'
      }
    );
    
    ultralink.addEntity(
      'kangaroo-rat',
      'animal',
      {
        name: 'Kangaroo Rat',
        scientificName: 'Dipodomys',
        diet: 'seeds, plants',
        adaptation: 'can survive without drinking water'
      }
    );
    
    // Add relationships
    ultralink.addLink(
      'saguaro',
      'desert',
      'lives_in'
    );
    
    ultralink.addLink(
      'kangaroo-rat',
      'desert',
      'lives_in'
    );
    
    ultralink.addLink(
      'kangaroo-rat',
      'saguaro',
      'shelters_near'
    );
    
    // Generate HTML Website
    logger.info('Generating HTML Website');
    const htmlFiles = ultralink.toHTMLWebsite({
      title: 'Desert Ecosystem',
      description: 'Interactive visualization of desert ecosystem relationships'
    });
    
    // Save the files for inspection
    const websiteDir = getSystemOutputPath(desertSystem, 'html-website');
    writeWebsite(websiteDir, htmlFiles);
    
    logger.info(`Saved HTML Website to ${websiteDir}`);
    
    // Verify the output
    expect(Object.keys(htmlFiles)).toContain('index.html');
    expect(Object.keys(htmlFiles)).toContain('saguaro.html');
    expect(Object.keys(htmlFiles)).toContain('kangaroo-rat.html');
    
    // Check index.html content
    expect(htmlFiles['index.html']).toContain('<title>Desert Ecosystem</title>');
    expect(htmlFiles['index.html']).toContain('Interactive visualization of desert ecosystem relationships');
    expect(htmlFiles['index.html']).toContain('d3@7');
    expect(htmlFiles['index.html']).toContain('<script src="graph.js"></script>');
    const graph = JSON.parse(htmlFiles['graph.js'].match(/^const data = ([\s\S]+?);\n/m)[1]);
    expect(graph.nodes.map(node => node.id)).toEqual(['desert', 'saguaro', 'kangaroo-rat']);
    expect(graph.links).toHaveLength(3);
    expect(graph.links).toContainEqual({
      source: 'kangaroo-rat', target: 'saguaro', type: 'shelters_near', attributes: {}
    });
    
    // Check entity page content
    expect(htmlFiles['saguaro.html']).toContain('<title>Saguaro Cactus - Desert Ecosystem</title>');
    expect(htmlFiles['saguaro.html']).toContain('scientificName');
    expect(htmlFiles['saguaro.html']).toContain('Carnegiea gigantea');
    expect(htmlFiles['saguaro.html']).toContain('lives_in');
    expect(htmlFiles['saguaro.html']).toContain('href="desert.html"');
  });
  
  test('Custom theme and options in HTML Website', () => {
    logger.info('Setting up test dataset with custom options');
    
    // Create a dataset
    const ultralink = new UltraLink();
    
    // Add some entities
    ultralink.addEntity(
      'project',
      'project',
      {
        name: 'UltraLink Project',
        status: 'active',
        priority: 'high'
      }
    );
    
    ultralink.addEntity(
      'task1',
      'task',
      {
        name: 'Implement HTML Export',
        status: 'completed',
        assignee: 'Developer A'
      }
    );
    
    ultralink.addEntity(
      'task2',
      'task',
      {
        name: 'Create Test Suite',
        status: 'in-progress',
        assignee: 'Developer B'
      }
    );
    
    // Add relationships
    ultralink.addLink(
      'task1',
      'project',
      'part_of'
    );
    
    ultralink.addLink(
      'task2',
      'project',
      'part_of'
    );
    
    ultralink.addLink(
      'task2',
      'task1',
      'depends_on'
    );
    
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ultralink-custom-'));
    const customCSS = path.join(temp, 'tasks.css');
    const customJS = path.join(temp, 'tasks.js');
    const css = '.task { background-color: rgba(33, 150, 243, 0.1); }';
    const js = 'document.body.dataset.customLoaded = "yes";';
    fs.writeFileSync(customCSS, css);
    fs.writeFileSync(customJS, js);
    let htmlFiles;
    try {
      htmlFiles = ultralink.toHTMLWebsite({
        title: 'Project Management',
        description: 'Project task tracking visualization',
        theme: 'dark',
        includeSearch: true,
        includeFilters: true,
        customCSS,
        customJS
      });
    } finally {
      fs.unlinkSync(customCSS);
      fs.unlinkSync(customJS);
      fs.rmdirSync(temp);
    }
    
    // Save the files for inspection
    const websiteDir = getSystemOutputPath(projectSystem, 'html-website-custom');
    writeWebsite(websiteDir, htmlFiles);
    
    logger.info(`Saved custom HTML Website to ${websiteDir}`);
    
    // Verify the output
    expect(Object.keys(htmlFiles)).toContain('index.html');
    expect(Object.keys(htmlFiles)).toContain('project.html');
    expect(Object.keys(htmlFiles)).toContain('task1.html');
    expect(Object.keys(htmlFiles)).toContain('task2.html');
    
    expect(htmlFiles['styles/dark.css']).toContain('--bg-color: #202124');
    expect(htmlFiles['custom.css']).toBe(css);
    expect(htmlFiles['custom.js']).toBe(js);
    for (const filename of ['index.html', 'task1.html']) {
      const dom = new JSDOM(htmlFiles[filename]);
      try {
        const document = dom.window.document;
        expect([...document.querySelectorAll('link[rel="stylesheet"]')].map(link => link.getAttribute('href')))
          .toEqual(['styles.css', 'styles/dark.css', 'custom.css']);
        expect(document.querySelector('script[src="custom.js"]')).not.toBeNull();
        if (filename === 'index.html') {
          expect(document.querySelector('input[type="search"]#search-box')).not.toBeNull();
          expect(document.querySelector('#type-filters')).not.toBeNull();
        }
      } finally {
        dom.window.close();
      }
    }
    const withoutControls = ultralink.toHTMLWebsite({ includeSearch: false, includeFilters: false });
    expect(withoutControls['index.html']).not.toMatch(/id="(?:search-box|type-filters)"/);
  });
}); 
