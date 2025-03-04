const fs = require('fs');
const path = require('path');
const { UltraLink } = require('../../src');
const { setupLogging, getSystemOutputPath } = require('../test-utils');

// Set up logging for this test
const logger = setupLogging('html-website-export-test');

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
    
    Object.entries(htmlFiles).forEach(([filename, content]) => {
      fs.writeFileSync(path.join(websiteDir, filename), content);
    });
    
    logger.info(`Saved HTML Website to ${websiteDir}`);
    
    // Verify the output
    expect(Object.keys(htmlFiles)).toContain('index.html');
    expect(Object.keys(htmlFiles)).toContain('saguaro.html');
    expect(Object.keys(htmlFiles)).toContain('kangaroo-rat.html');
    
    // Check index.html content
    expect(htmlFiles['index.html']).toContain('<title>Desert Ecosystem</title>');
    expect(htmlFiles['index.html']).toContain('Interactive visualization of desert ecosystem relationships');
    expect(htmlFiles['index.html']).toContain('d3.v7.min.js');
    expect(htmlFiles['index.html']).toContain('const data =');
    
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
    
    // Generate HTML Website with custom options
    logger.info('Generating HTML Website with custom options');
    const htmlFiles = ultralink.toHTMLWebsite({
      title: 'Project Management',
      description: 'Project task tracking visualization',
      theme: 'dark',
      includeSearch: true,
      includeFilters: true,
      customCSS: '.task { background-color: rgba(33, 150, 243, 0.1); }',
      customJS: 'console.log("Custom JS loaded");'
    });
    
    // Save the files for inspection
    const websiteDir = getSystemOutputPath(projectSystem, 'html-website-custom');
    
    Object.entries(htmlFiles).forEach(([filename, content]) => {
      fs.writeFileSync(path.join(websiteDir, filename), content);
    });
    
    logger.info(`Saved custom HTML Website to ${websiteDir}`);
    
    // Verify the output
    expect(Object.keys(htmlFiles)).toContain('index.html');
    expect(Object.keys(htmlFiles)).toContain('project.html');
    expect(Object.keys(htmlFiles)).toContain('task1.html');
    expect(Object.keys(htmlFiles)).toContain('task2.html');
    
    // Check custom theme and options
    expect(htmlFiles['index.html']).toContain('--bg-color: #121212');
    expect(htmlFiles['index.html']).toContain('search-box');
    expect(htmlFiles['index.html']).toContain('type-filters');
    expect(htmlFiles['index.html']).toContain('.task { background-color: rgba(33, 150, 243, 0.1); }');
    expect(htmlFiles['index.html']).toContain('console.log("Custom JS loaded");');
    
    // Check entity pages with custom theme
    expect(htmlFiles['task1.html']).toContain('--bg-color: #121212');
    expect(htmlFiles['task1.html']).toContain('console.log("Custom JS loaded");');
  });
}); 