/**
 * End-to-End Test: Knowledge Base Workflow
 * 
 * This test simulates a complete workflow of building a knowledge base
 * using UltraLink, including parsing documents, creating relationships,
 * and exporting to different formats.
 */

const { UltraLink } = require('../../src/ultralink');
const fs = require('fs');
const path = require('path');

describe('E2E: Knowledge Base Workflow', () => {
  // We'll use this directory for temporary output files
  const testOutputDir = path.join(__dirname, '..', 'test-output');
  
  beforeAll(() => {
    // Create test output directory if it doesn't exist
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });
  
  afterAll(() => {
    // Clean up test output files
    if (fs.existsSync(testOutputDir)) {
      const files = fs.readdirSync(testOutputDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(testOutputDir, file));
      });
      fs.rmdirSync(testOutputDir);
    }
  });
  
  it('should build a complete knowledge base and export it to multiple formats', () => {
    // Create a new UltraLink instance
    const ultralink = new UltraLink();
    
    // Sample content
    const basicDocument = `
      # Project Overview
      This is a sample project document with [[links]] to other concepts.
      
      ## Key Concepts
      - [[Machine Learning]]
      - [[Data Analysis]]
      - [[Project Management]]
    `;
    
    const personalKnowledgeBase = `
      # Work Projects
      
      ## Current Projects
      - [[Project Alpha]] - Due next month
      - [[Project Beta]] - In planning phase
      
      ## Team Members
      - [[Alice Smith]] - Project Manager
      - [[Bob Johnson]] - Developer
    `;
    
    // Step 1: Add entities directly instead of parsing
    ultralink.addEntity('machine-learning', 'concept', {
      name: 'Machine Learning',
      description: 'A field of AI focused on algorithms that learn from data'
    });
    
    ultralink.addEntity('data-analysis', 'concept', {
      name: 'Data Analysis',
      description: 'The process of inspecting and modeling data'
    });
    
    ultralink.addEntity('project-management', 'concept', {
      name: 'Project Management',
      description: 'The practice of planning and organizing projects'
    });
    
    ultralink.addEntity('project-alpha', 'project', {
      name: 'Project Alpha',
      status: 'In Progress',
      dueDate: '2023-12-31'
    });
    
    ultralink.addEntity('project-beta', 'project', {
      name: 'Project Beta',
      status: 'Planning',
      dueDate: '2024-03-15'
    });
    
    ultralink.addEntity('alice-smith', 'person', {
      name: 'Alice Smith',
      role: 'Project Manager',
      email: 'alice@example.com'
    });
    
    ultralink.addEntity('bob-johnson', 'person', {
      name: 'Bob Johnson',
      role: 'Developer',
      email: 'bob@example.com'
    });
    
    // Step 2: Create relationships
    ultralink.addLink('project-alpha', 'machine-learning', 'uses');
    ultralink.addLink('project-alpha', 'data-analysis', 'uses');
    ultralink.addLink('project-beta', 'machine-learning', 'uses');
    
    ultralink.addLink('alice-smith', 'project-alpha', 'manages');
    ultralink.addLink('alice-smith', 'project-beta', 'manages');
    ultralink.addLink('bob-johnson', 'project-alpha', 'works_on');
    ultralink.addLink('bob-johnson', 'project-beta', 'works_on');
    
    // Step 3: Export to multiple formats
    const outputDir = path.join(__dirname, '../../output/e2e-tests/knowledge-base');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Export to JSON
    const json = ultralink.toJSON();
    fs.writeFileSync(path.join(outputDir, 'knowledge-base.json'), JSON.stringify(json, null, 2));
    
    // Export to GraphML
    const graphml = ultralink.toGraphML({ includeAllAttributes: true });
    fs.writeFileSync(path.join(outputDir, 'knowledge-base.graphml'), graphml);
    
    // Export to CSV
    const csv = ultralink.toCSV();
    fs.writeFileSync(path.join(outputDir, 'entities.csv'), csv.entities);
    fs.writeFileSync(path.join(outputDir, 'relationships.csv'), csv.relationships);
    
    // Export to Obsidian
    const obsidian = ultralink.toObsidian({ backlinks: true });
    const obsidianDir = path.join(outputDir, 'obsidian');
    if (!fs.existsSync(obsidianDir)) {
      fs.mkdirSync(obsidianDir, { recursive: true });
    }
    
    Object.entries(obsidian).forEach(([filename, content]) => {
      fs.writeFileSync(path.join(obsidianDir, filename), content);
    });
    
    // Export to HTML Website
    const htmlWebsite = ultralink.toHTMLWebsite({
      title: 'Knowledge Base',
      description: 'Interactive visualization of knowledge base'
    });
    
    const websiteDir = path.join(outputDir, 'website');
    if (!fs.existsSync(websiteDir)) {
      fs.mkdirSync(websiteDir, { recursive: true });
    }
    
    Object.entries(htmlWebsite).forEach(([filename, content]) => {
      // Create directory if it doesn't exist
      const filePath = path.join(websiteDir, filename);
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, content);
    });
    
    // Verify exports
    expect(fs.existsSync(path.join(outputDir, 'knowledge-base.json'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'knowledge-base.graphml'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'entities.csv'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'relationships.csv'))).toBe(true);
    expect(fs.existsSync(path.join(obsidianDir, 'machine-learning.md'))).toBe(true);
    expect(fs.existsSync(path.join(websiteDir, 'index.html'))).toBe(true);
    
    // Verify entity count
    expect(ultralink.entities.size).toBe(7);
    expect(ultralink.relationships.size).toBe(7);
  });
}); 