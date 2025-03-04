/**
 * System Tests - Rendering
 * 
 * Tests the rendering of all systems into various output formats.
 * Each system is rendered into JSON, GraphML, CSV, Obsidian, HTML, and visualization formats.
 * All outputs are stored in system-specific subfolders.
 */

const fs = require('fs');
const path = require('path');
const { createDesertEcosystemDataset } = require('../fixtures/Systems/DesertEcosystem/desert-ecosystem');
const { createResearchTeamDataset } = require('../fixtures/Systems/ResearchTeam/research-team');
const { createActiveInferenceLabDataset } = require('../fixtures/Systems/ActiveInferenceLab/active-inference-lab');
const OutputValidator = require('../runners/output-validator');

// Configure paths
const OUTPUT_DIR = path.join(process.cwd(), 'output/systems');

// Define the systems and their dataset creators
const SYSTEMS = {
  ResearchTeam: createResearchTeamDataset,
  DesertEcosystem: createDesertEcosystemDataset,
  ActiveInferenceLab: createActiveInferenceLabDataset
};

// Formats to render
const FORMATS = [
  'json',
  'graphml', 
  'obsidian',
  'html-website',
  'visualization',
  'csv'
];

// Visualization formats
const VIZ_FORMATS = [
  'png',
  'svg',
  'd3',
  'cytoscape'
];

// HTML themes to test
const HTML_THEMES = [
  'default',
  'dark',
  'light',
  'academic',
  'ocean'
];

// Ensure output directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Create system output directories
beforeAll(() => {
  ensureDirectoryExists(OUTPUT_DIR);
  
  Object.keys(SYSTEMS).forEach(systemName => {
    const systemDir = path.join(OUTPUT_DIR, systemName);
    ensureDirectoryExists(systemDir);
    
    FORMATS.forEach(format => {
      const formatDir = path.join(systemDir, format);
      ensureDirectoryExists(formatDir);
      
      // Create visualization subdirectories
      if (format === 'visualization') {
        VIZ_FORMATS.forEach(vizFormat => {
          ensureDirectoryExists(path.join(formatDir, vizFormat));
        });
      }
      
      // Create theme subdirectories for HTML website
      if (format === 'html-website') {
        HTML_THEMES.forEach(theme => {
          ensureDirectoryExists(path.join(formatDir, theme));
        });
      }
    });
  });
});

describe('System Rendering Tests', () => {
  // Test each system
  Object.entries(SYSTEMS).forEach(([systemName, createSystem]) => {
    describe(`${systemName} Rendering`, () => {
      let system;
      
      beforeAll(() => {
        // Create the system dataset
        system = createSystem();
        expect(system).toBeDefined();
        expect(system.entities.size).toBeGreaterThan(0);
      });
      
      // Test each format
      FORMATS.forEach(format => {
        describe(`${format} format`, () => {
          const outputPath = path.join(OUTPUT_DIR, systemName, format);
          
          it(`should render ${systemName} to ${format} format`, () => {
            let outputFiles = [];
            
            switch (format) {
              case 'json':
                const jsonPath = path.join(outputPath, `${systemName.toLowerCase()}.json`);
                fs.writeFileSync(jsonPath, system.toJSON());
                outputFiles.push(jsonPath);
                break;
                
              case 'graphml':
                const graphmlPath = path.join(outputPath, `${systemName.toLowerCase()}.graphml`);
                fs.writeFileSync(graphmlPath, system.toGraphML({
                  includeAllAttributes: true,
                  prettyPrint: true
                }));
                outputFiles.push(graphmlPath);
                break;
                
              case 'obsidian':
                const obsidianFiles = system.toObsidian({
                  includeBacklinks: true,
                  includeType: true,
                  includeAttributes: true
                });
                
                // Save each markdown file
                Object.entries(obsidianFiles).forEach(([filename, content]) => {
                  const filePath = path.join(outputPath, filename);
                  fs.writeFileSync(filePath, content);
                  outputFiles.push(filePath);
                });
                break;
                
              case 'csv':
                const csvFiles = system.toCSV();
                Object.entries(csvFiles).forEach(([filename, content]) => {
                  const filePath = path.join(outputPath, filename);
                  fs.writeFileSync(filePath, content);
                  outputFiles.push(filePath);
                });
                break;
                
              case 'html-website':
                // Test each theme
                HTML_THEMES.forEach(theme => {
                  const themeDir = path.join(outputPath, theme);
                  ensureDirectoryExists(themeDir);
                  ensureDirectoryExists(path.join(themeDir, 'styles'));
                  
                  const htmlFiles = system.toHTMLWebsite({
                    title: `${systemName} Knowledge Graph`,
                    description: `Interactive visualization of ${systemName} relationships`,
                    theme: theme
                  });
                  
                  // Save all generated files
                  Object.entries(htmlFiles).forEach(([filename, content]) => {
                    const filePath = path.join(themeDir, filename);
                    const fileDir = path.dirname(filePath);
                    ensureDirectoryExists(fileDir);
                    fs.writeFileSync(filePath, content);
                    outputFiles.push(filePath);
                  });
                });
                break;
                
              case 'visualization':
                // Generate visualizations in different formats
                VIZ_FORMATS.forEach(vizFormat => {
                  const vizDir = path.join(outputPath, vizFormat);
                  ensureDirectoryExists(vizDir);
                  
                  const vizFiles = system.toVisualization({
                    format: vizFormat,
                    layout: 'force-directed',
                    style: 'default'
                  });
                  
                  // Save visualization files
                  Object.entries(vizFiles).forEach(([filename, content]) => {
                    const filePath = path.join(vizDir, filename);
                    fs.writeFileSync(filePath, content);
                    outputFiles.push(filePath);
                  });
                });
                break;
            }
            
            // Validate outputs
            outputFiles.forEach(filePath => {
              expect(fs.existsSync(filePath)).toBe(true);
              const stats = fs.statSync(filePath);
              expect(stats.size).toBeGreaterThan(0);
            });
          });
          
          // Add format-specific validation tests
          it(`should validate ${format} output structure`, () => {
            switch (format) {
              case 'json':
                const jsonPath = path.join(outputPath, `${systemName.toLowerCase()}.json`);
                const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                expect(jsonContent).toHaveProperty('entities');
                expect(jsonContent).toHaveProperty('relationships');
                break;
                
              case 'graphml':
                const graphmlPath = path.join(outputPath, `${systemName.toLowerCase()}.graphml`);
                const graphmlContent = fs.readFileSync(graphmlPath, 'utf8');
                expect(graphmlContent).toMatch(/<graphml/);
                expect(graphmlContent).toMatch(/<graph/);
                expect(graphmlContent).toMatch(/<node/);
                break;
                
              case 'html-website':
                HTML_THEMES.forEach(theme => {
                  const indexPath = path.join(outputPath, theme, 'index.html');
                  expect(fs.existsSync(indexPath)).toBe(true);
                  const htmlContent = fs.readFileSync(indexPath, 'utf8');
                  expect(htmlContent).toMatch(/<html/);
                  expect(htmlContent).toMatch(/<body/);
                  expect(htmlContent).toContain(systemName);
                });
                break;
                
              case 'visualization':
                VIZ_FORMATS.forEach(vizFormat => {
                  const vizDir = path.join(outputPath, vizFormat);
                  const files = fs.readdirSync(vizDir);
                  expect(files.length).toBeGreaterThan(0);
                  files.forEach(file => {
                    expect(file.endsWith(`.${vizFormat}`)).toBe(true);
                  });
                });
                break;
            }
          });
        });
      });
    });
  });
}); 