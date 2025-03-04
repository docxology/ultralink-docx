/**
 * HTML Website Features Integration Test
 * 
 * This test verifies that all the enhanced HTML website features are working correctly,
 * including responsive design, zoom and pan controls, improved entity details display,
 * title fallback for name, and mobile-friendly layout.
 */

const path = require('path');
const fs = require('fs');
const { UltraLink } = require('../../src');
const { getSystemOutputPath } = require('../test-utils');

// System name for organizing output
const testSystem = 'html-features-test';

describe('HTML Website Features', () => {
  let ultralink;
  let htmlFiles;
  
  beforeEach(() => {
    ultralink = new UltraLink();
    
    // Add entities with different attribute patterns
    
    // Entity with name attribute
    ultralink.addEntity('entity1', 'person', {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com'
    });
    
    // Entity with title but no name attribute
    ultralink.addEntity('entity2', 'project', {
      title: 'Project Alpha',
      status: 'Active',
      priority: 'High'
    });
    
    // Entity with neither name nor title
    ultralink.addEntity('entity3', 'resource', {
      type: 'Document',
      url: 'https://example.com/doc'
    });
    
    // Add relationships with attributes
    ultralink.addLink('entity1', 'entity2', 'manages', {
      role: 'Project Manager',
      since: '2023-01-15'
    });
    
    ultralink.addLink('entity1', 'entity3', 'created', {
      date: '2023-02-10'
    });
    
    ultralink.addLink('entity2', 'entity3', 'contains', {
      section: 'Documentation'
    });
    
    // Generate HTML website with each theme
    htmlFiles = ultralink.toHTMLWebsite({
      title: 'HTML Features Test',
      description: 'Testing HTML website features',
      theme: 'default'
    });
    
    // Save files for manual inspection if needed
    const outputDir = getSystemOutputPath(testSystem, 'html-website');
    Object.entries(htmlFiles).forEach(([filename, content]) => {
      fs.writeFileSync(path.join(outputDir, filename), content);
    });
  });
  
  test('should include zoom and pan controls', () => {
    // Check for zoom controls in index.html
    expect(htmlFiles['index.html']).toContain('<div class="zoom-controls">');
    expect(htmlFiles['index.html']).toContain('<button class="zoom-btn" id="zoom-in">+</button>');
    expect(htmlFiles['index.html']).toContain('<button class="zoom-btn" id="zoom-reset">⟳</button>');
    expect(htmlFiles['index.html']).toContain('<button class="zoom-btn" id="zoom-out">−</button>');
    
    // Check for zoom behavior setup
    expect(htmlFiles['index.html']).toContain('zoom = d3.zoom()');
    expect(htmlFiles['index.html']).toContain('.scaleExtent([0.1, 4])');
    expect(htmlFiles['index.html']).toContain('svg.call(zoom)');
    
    // Check for zoom event handlers
    expect(htmlFiles['index.html']).toContain('zoomInBtn.addEventListener');
    expect(htmlFiles['index.html']).toContain('zoomOutBtn.addEventListener');
    expect(htmlFiles['index.html']).toContain('zoomResetBtn.addEventListener');
  });
  
  test('should include clear filters button', () => {
    // Check for clear filters button
    expect(htmlFiles['index.html']).toContain('<button class="btn" id="clear-filters">Clear Filters</button>');
    
    // Check for event handler
    expect(htmlFiles['index.html']).toContain('clearFiltersBtn.addEventListener');
    expect(htmlFiles['index.html']).toContain('Array.from(typeFilters.querySelectorAll(\'input\')).forEach(input => {');
    expect(htmlFiles['index.html']).toContain('input.checked = true');
  });
  
  test('should use responsive SVG with viewBox', () => {
    // Check for responsive SVG attributes
    expect(htmlFiles['index.html']).toContain('.attr(\'width\', \'100%\')');
    expect(htmlFiles['index.html']).toContain('.attr(\'height\', \'100%\')');
    expect(htmlFiles['index.html']).toContain('.attr(\'viewBox\', [0, 0, width, height])');
    expect(htmlFiles['index.html']).toContain('.attr(\'preserveAspectRatio\', \'xMidYMid meet\')');
    
    // Check for responsive media queries
    expect(htmlFiles['index.html']).toContain('@media (max-width: 768px)');
    expect(htmlFiles['index.html']).toContain('flex-direction: column');
  });
  
  test('should use title as fallback for name', () => {
    // Check index.html for title fallback in entity list rendering
    expect(htmlFiles['index.html']).toContain('const name = entity.attributes.name || entity.attributes.title || entity.id;');
    
    // Check entity2.html (project with title but no name)
    expect(htmlFiles['entity2.html']).toContain('<title>Project Alpha - HTML Features Test</title>');
    expect(htmlFiles['entity2.html']).toContain('<h1>Project Alpha</h1>');
  });
  
  test('should have improved entity detail pages with sections', () => {
    // Check entity1.html for entity sections
    expect(htmlFiles['entity1.html']).toContain('<div class="entity-section">');
    
    // Check for attribute table styling
    expect(htmlFiles['entity1.html']).toContain('class="attribute-table"');
    expect(htmlFiles['entity1.html']).toContain('background: rgba(255, 255, 255, 0.05)');
    
    // Check for relationship item styling
    expect(htmlFiles['entity1.html']).toContain('class="relationship-item"');
    expect(htmlFiles['entity1.html']).toContain('relationship-attributes');
  });
  
  test('should generate different themes correctly', () => {
    // Generate HTML website with dark theme
    const darkThemeFiles = ultralink.toHTMLWebsite({
      title: 'Dark Theme Test',
      description: 'Testing dark theme',
      theme: 'dark'
    });
    
    // Check dark theme specific CSS
    expect(darkThemeFiles['index.html']).toContain('--text-color: #e8eaed');
    expect(darkThemeFiles['index.html']).toContain('--bg-color: #202124');
    expect(darkThemeFiles['index.html']).toContain('background: rgba(32, 33, 36, 0.8)');
    
    // Generate HTML website with academic theme
    const academicThemeFiles = ultralink.toHTMLWebsite({
      title: 'Academic Theme Test',
      description: 'Testing academic theme',
      theme: 'academic'
    });
    
    // Check academic theme specific CSS
    expect(academicThemeFiles['index.html']).toContain('background-color: #7b1fa2');
    expect(academicThemeFiles['index.html']).toContain('font-family: \'Palatino Linotype\'');
  });
  
  test('should support interactive relationship navigation', () => {
    // Check for interactive relationship links
    expect(htmlFiles['index.html']).toContain('window.selectEntityById = (id) => {');
    expect(htmlFiles['index.html']).toContain('href="javascript:void(0)" onclick="selectEntityById');
    
    // Check that node is highlighted and centered on selection
    expect(htmlFiles['index.html']).toContain('svg.transition().duration(500)');
    expect(htmlFiles['index.html']).toContain('const x = width / 2 - scale * selectedNode.x');
  });
  
  test('should properly handle entities without name or title', () => {
    // Check entity3.html (resource with neither name nor title)
    expect(htmlFiles['entity3.html']).toContain('<title>entity3 - HTML Features Test</title>');
    expect(htmlFiles['entity3.html']).toContain('<h1>entity3</h1>');
    
    // Make sure it's still referenced correctly in index page
    expect(htmlFiles['index.html']).toContain('.text(d => d.attributes.name || d.attributes.title || d.id)');
  });
  
  test('should include relationship attributes in details view', () => {
    // Check entity1.html for displayed relationship attributes
    expect(htmlFiles['entity1.html']).toContain('<div class="relationship-attributes">');
    expect(htmlFiles['entity1.html']).toContain('<strong>role:</strong> Project Manager');
    expect(htmlFiles['entity1.html']).toContain('<strong>since:</strong> 2023-01-15');
    
    // Check entity2.html for displayed relationship attributes
    expect(htmlFiles['entity2.html']).toContain('<strong>section:</strong> Documentation');
  });
}); 