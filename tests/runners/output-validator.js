/**
 * Output Validator
 * 
 * A unified validation system for checking the integrity and correctness
 * of rendered UltraLink outputs across different formats.
 */

const fs = require('fs').promises;
const path = require('path');
const assert = require('assert').strict;
const xml2js = require('xml2js');
const csv = require('csv-parser');
const { createReadStream } = require('fs');

/**
 * Validation utility class for UltraLink outputs
 */
class OutputValidator {
  /**
   * Creates a new OutputValidator instance
   * @param {string} outputDir - Directory containing output files
   */
  constructor(outputDir) {
    this.outputDir = outputDir;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  /**
   * Adds a test result to the results collection
   * @param {string} name - Name of the test
   * @param {boolean} passed - Whether the test passed
   * @param {Object} details - Additional details about the test
   */
  addResult(name, passed, details = {}) {
    this.results.total++;
    if (passed) this.results.passed++;
    else this.results.failed++;
    
    this.results.tests.push({
      name,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Validates a JSON output file
   * @param {string} filePath - Path to the JSON file
   */
  async validateJSON(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Basic structure validation
      assert(data, 'JSON data should exist');
      
      // Entities validation
      if (data.entities) {
        assert(Array.isArray(data.entities), 'Entities should be an array');
        this.addResult('json-entities-array', true);
        
        if (data.entities.length > 0) {
          // Check first entity for structure
          const entity = data.entities[0];
          assert(entity.id, 'Entity should have an ID');
          assert(entity.type, 'Entity should have a type');
          this.addResult('json-entity-structure', true);
        }
      }
      
      // Relationships validation
      if (data.relationships) {
        assert(Array.isArray(data.relationships), 'Relationships should be an array');
        this.addResult('json-relationships-array', true);
        
        if (data.relationships.length > 0) {
          // Check first relationship for structure
          const relationship = data.relationships[0];
          assert(relationship.source, 'Relationship should have a source');
          assert(relationship.target, 'Relationship should have a target');
          assert(relationship.type, 'Relationship should have a type');
          this.addResult('json-relationship-structure', true);
        }
      }
      
      // Metadata validation
      if (data.metadata) {
        assert(typeof data.metadata === 'object', 'Metadata should be an object');
        this.addResult('json-metadata-object', true);
      }
      
      this.addResult('json-validation', true, { path: filePath });
    } catch (error) {
      this.addResult('json-validation', false, { 
        path: filePath,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Validates a GraphML output file
   * @param {string} filePath - Path to the GraphML file
   */
  async validateGraphML(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // Validate XML syntax
      const parser = new xml2js.Parser();
      const data = await parser.parseStringPromise(content);
      
      // Basic structure validation
      assert(data.graphml, 'Should have graphml root element');
      assert(data.graphml.graph, 'Should have graph element');
      this.addResult('graphml-basic-structure', true);
      
      // Check graph attributes
      const graph = data.graphml.graph[0];
      assert(graph.$.edgedefault, 'Graph should have edgedefault attribute');
      this.addResult('graphml-graph-attributes', true);
      
      // Check nodes
      if (graph.node) {
        assert(Array.isArray(graph.node), 'Nodes should be an array');
        
        if (graph.node.length > 0) {
          // Check first node for structure
          const node = graph.node[0];
          assert(node.$.id, 'Node should have an ID');
          this.addResult('graphml-node-structure', true);
        }
      }
      
      // Check edges
      if (graph.edge) {
        assert(Array.isArray(graph.edge), 'Edges should be an array');
        
        if (graph.edge.length > 0) {
          // Check first edge for structure
          const edge = graph.edge[0];
          assert(edge.$.source, 'Edge should have a source');
          assert(edge.$.target, 'Edge should have a target');
          this.addResult('graphml-edge-structure', true);
        }
      }
      
      this.addResult('graphml-validation', true, { path: filePath });
    } catch (error) {
      this.addResult('graphml-validation', false, { 
        path: filePath,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Validates a CSV output file
   * @param {string} filePath - Path to the CSV file
   */
  async validateCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      let rowCount = 0;
      
      createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
          rowCount++;
        })
        .on('end', () => {
          try {
            // Check that we have data
            assert(rowCount > 0, 'CSV should have at least one row of data');
            this.addResult('csv-has-data', true, { rowCount });
            
            // Check that first row has expected structure
            if (results.length > 0) {
              const firstRow = results[0];
              assert(Object.keys(firstRow).length > 0, 'CSV should have columns');
              this.addResult('csv-has-columns', true, { 
                columnCount: Object.keys(firstRow).length 
              });
            }
            
            this.addResult('csv-validation', true, { path: filePath });
            resolve();
          } catch (error) {
            this.addResult('csv-validation', false, { 
              path: filePath,
              error: error.message 
            });
            reject(error);
          }
        })
        .on('error', (error) => {
          this.addResult('csv-validation', false, { 
            path: filePath,
            error: error.message 
          });
          reject(error);
        });
    });
  }

  /**
   * Validates an Obsidian output directory
   * @param {string} dirPath - Path to the Obsidian directory
   */
  async validateObsidian(dirPath) {
    try {
      // Check if directory exists
      const stats = await fs.stat(dirPath);
      assert(stats.isDirectory(), 'Obsidian output should be a directory');
      
      // Check contents
      const files = await fs.readdir(dirPath);
      assert(files.length > 0, 'Obsidian directory should contain files');
      this.addResult('obsidian-has-files', true, { fileCount: files.length });
      
      // Check for markdown files
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      assert(markdownFiles.length > 0, 'Obsidian directory should contain .md files');
      this.addResult('obsidian-has-markdown', true, { 
        markdownCount: markdownFiles.length 
      });
      
      // Check content of a markdown file
      if (markdownFiles.length > 0) {
        const content = await fs.readFile(path.join(dirPath, markdownFiles[0]), 'utf8');
        assert(content.length > 0, 'Markdown file should have content');
        
        // Check for frontmatter
        const hasFrontmatter = content.startsWith('---');
        this.addResult('obsidian-has-frontmatter', hasFrontmatter);
        
        // Check for wikilinks
        const hasWikilinks = content.includes('[[');
        this.addResult('obsidian-has-wikilinks', hasWikilinks);
      }
      
      this.addResult('obsidian-validation', true, { path: dirPath });
    } catch (error) {
      this.addResult('obsidian-validation', false, { 
        path: dirPath,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Validates an HTML output file
   * @param {string} filePath - Path to the HTML file
   */
  async validateHTML(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // Basic HTML validation
      assert(content.includes('<!DOCTYPE html>') || content.includes('<html'), 
        'Should have HTML document structure');
      this.addResult('html-basic-structure', true);
      
      // Check for required elements
      assert(content.includes('<head>'), 'Should have head element');
      assert(content.includes('<body>'), 'Should have body element');
      this.addResult('html-required-elements', true);
      
      // Check for visualization elements
      const hasVisualization = 
        content.includes('<svg') || 
        content.includes('<canvas') || 
        content.includes('visualization');
      
      this.addResult('html-has-visualization', hasVisualization);
      
      // Check for scripts
      assert(content.includes('<script'), 'Should have script elements');
      this.addResult('html-has-scripts', true);
      
      this.addResult('html-validation', true, { path: filePath });
    } catch (error) {
      this.addResult('html-validation', false, { 
        path: filePath,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Validates a Timeline JSON output file
   * @param {string} filePath - Path to the timeline JSON file
   */
  async validateTimeline(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Basic timeline validation
      assert(data, 'Timeline data should exist');
      
      // Check for events
      if (data.events) {
        assert(Array.isArray(data.events), 'Events should be an array');
        this.addResult('timeline-events-array', true);
        
        if (data.events.length > 0) {
          // Check first event for structure
          const event = data.events[0];
          assert(event.start_date, 'Event should have a start_date');
          assert(event.text, 'Event should have text content');
          this.addResult('timeline-event-structure', true);
        }
      }
      
      // Check for eras if present
      if (data.eras) {
        assert(Array.isArray(data.eras), 'Eras should be an array');
        this.addResult('timeline-eras-array', true);
      }
      
      this.addResult('timeline-validation', true, { path: filePath });
    } catch (error) {
      this.addResult('timeline-validation', false, { 
        path: filePath,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Generates a report of all validation results
   * @returns {Object} Validation report
   */
  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      outputDir: this.outputDir,
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        success_rate: this.results.total > 0 ? 
          (this.results.passed / this.results.total * 100).toFixed(2) + '%' : 
          'N/A'
      },
      tests: this.results.tests
    };
  }
}

module.exports = OutputValidator; 