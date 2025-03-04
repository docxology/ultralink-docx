/**
 * Research Team Export Integration Tests
 * 
 * These tests verify that the research team dataset can be correctly exported
 * to all supported formats (Obsidian, Bayesian Network, HTML Website) and that
 * the exported data maintains all relationships and attributes.
 */

const path = require('path');
const fs = require('fs');
const { UltraLink } = require('../../src/ultralink');
const BayesianGraphExporter = require('../../src/exporters/specialized/bayesian-graph');
const HTMLWebsiteExporter = require('../../src/exporters/specialized/html-website');
const ObsidianKnowledgeBaseExporter = require('../../src/exporters/specialized/obsidian-knowledge-base');
const { createResearchTeamDataset } = require('../test-datasets');
const { getSystemOutputPath } = require('../test-utils');

// System name for organizing output
const researchSystem = 'research-team';

describe('Research Team Export Tests', () => {
  let ultralink;
  
  beforeEach(() => {
    ultralink = new UltraLink();
    
    // Add researchers
    ultralink.addEntity('alice', 'researcher', {
      name: 'Alice Chen',
      role: 'Principal Investigator',
      department: 'Biology',
      email: 'alice.chen@example.edu',
      publications: 42
    });
    
    ultralink.addEntity('bob', 'researcher', {
      name: 'Bob Smith',
      role: 'Postdoc',
      department: 'Biology',
      email: 'bob.smith@example.edu',
      publications: 18
    });
    
    // Add projects
    ultralink.addEntity('desert-ecology', 'project', {
      name: 'Desert Ecology Study',
      title: 'Desert Ecology Study',
      startDate: '2023-01-15',
      budget: 150000,
      status: 'Active'
    });
    
    ultralink.addEntity('climate-impact', 'project', {
      name: 'Climate Impact Assessment',
      title: 'Climate Impact Assessment',
      startDate: '2022-08-10',
      budget: 220000,
      status: 'Active'
    });
    
    // Add relationships
    ultralink.addLink('alice', 'desert-ecology', 'leads', {
      startDate: '2023-01-15',
      role: 'Principal Investigator'
    });
    
    ultralink.addLink('alice', 'climate-impact', 'contributes_to', {
      startDate: '2022-10-01',
      role: 'Consultant'
    });
    
    ultralink.addLink('bob', 'desert-ecology', 'works_on', {
      startDate: '2023-02-01',
      role: 'Data Analyst'
    });
    
    ultralink.addLink('bob', 'alice', 'reports_to', {
      startDate: '2023-02-01'
    });
  });
  
  test('HTML Website Export', () => {
    // Generate HTML website for research team
    const htmlFiles = ultralink.toHTMLWebsite({
      title: 'Research Team Portal',
      description: 'Interactive visualization of research team relationships',
      theme: 'academic'
    });
    
    // Save files for inspection
    const outputDir = getSystemOutputPath(researchSystem, 'html-website');
    Object.entries(htmlFiles).forEach(([filename, content]) => {
      fs.writeFileSync(path.join(outputDir, filename), content);
    });
    
    // Verify output
    expect(Object.keys(htmlFiles)).toContain('index.html');
    expect(Object.keys(htmlFiles)).toContain('alice.html');
    expect(Object.keys(htmlFiles)).toContain('bob.html');
    expect(Object.keys(htmlFiles)).toContain('desert-ecology.html');
    expect(Object.keys(htmlFiles)).toContain('climate-impact.html');
    
    // Check index.html content
    expect(htmlFiles['index.html']).toContain('<title>Research Team Portal</title>');
    expect(htmlFiles['index.html']).toContain('Interactive visualization of research team relationships');
    expect(htmlFiles['index.html']).toContain('d3.v7.min.js');
    
    // Check entity page content
    expect(htmlFiles['alice.html']).toContain('<title>Alice Chen - Research Team Portal</title>');
    expect(htmlFiles['alice.html']).toContain('Principal Investigator');
    expect(htmlFiles['alice.html']).toContain('Biology');
    
    // Check for academic theme-specific CSS
    expect(htmlFiles['index.html']).toContain('background-color: #7b1fa2');
    expect(htmlFiles['index.html']).toContain('font-family: \'Palatino Linotype\'');
  });
  
  test('GraphML Export', () => {
    // Generate GraphML
    const graphml = ultralink.toGraphML({ includeAllAttributes: true });
    
    // Save for inspection
    const outputDir = getSystemOutputPath(researchSystem, 'graphml');
    fs.writeFileSync(path.join(outputDir, 'research-team.graphml'), graphml);
    
    // Verify output
    expect(graphml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(graphml).toContain('<graphml xmlns="http://graphml.graphdrawing.org/xmlns"');
    expect(graphml).toContain('<graph id="G" edgedefault="directed">');
    
    // Verify nodes
    expect(graphml).toContain('<node id="alice">');
    expect(graphml).toContain('<node id="bob">');
    expect(graphml).toContain('<node id="desert-ecology">');
    expect(graphml).toContain('<node id="climate-impact">');
    
    // Verify edges
    expect(graphml).toContain('<edge source="alice" target="desert-ecology">');
    expect(graphml).toContain('<edge source="alice" target="climate-impact">');
    expect(graphml).toContain('<edge source="bob" target="desert-ecology">');
    expect(graphml).toContain('<edge source="bob" target="alice">');
    
    // Verify attribute data
    expect(graphml).toContain('<data key="name">Alice Chen</data>');
    expect(graphml).toContain('<data key="role">Principal Investigator</data>');
    expect(graphml).toContain('<data key="department">Biology</data>');
  });
  
  test('Obsidian Export', () => {
    // Generate Obsidian files
    const obsidian = ultralink.toObsidian({ 
      includeMetadata: true, 
      includeAttributes: true,
      includeRelationships: true,
      backlinks: true
    });
    
    // Save for inspection
    const outputDir = getSystemOutputPath(researchSystem, 'obsidian');
    Object.entries(obsidian).forEach(([filename, content]) => {
      fs.writeFileSync(path.join(outputDir, filename), content);
    });
    
    // Verify files were generated
    expect(Object.keys(obsidian)).toContain('alice.md');
    expect(Object.keys(obsidian)).toContain('bob.md');
    expect(Object.keys(obsidian)).toContain('desert-ecology.md');
    expect(Object.keys(obsidian)).toContain('climate-impact.md');
    
    // Check for basic content
    const aliceContent = obsidian['alice.md'];
    expect(aliceContent).toContain('Alice Chen');
  });
  
  test('CSV Export', () => {
    // Generate CSV
    const csv = ultralink.toCSV();
    
    // Save for inspection
    const outputDir = getSystemOutputPath(researchSystem, 'csv');
    fs.writeFileSync(path.join(outputDir, 'entities.csv'), csv.entities);
    fs.writeFileSync(path.join(outputDir, 'relationships.csv'), csv.relationships);
    
    // Check entities CSV
    const entitiesLines = csv.entities.split('\n');
    const entitiesHeader = entitiesLines[0];
    
    expect(entitiesHeader).toContain('id');
    expect(entitiesHeader).toContain('type');
    expect(entitiesHeader).toContain('name');
    expect(entitiesHeader).toContain('role');
    expect(entitiesHeader).toContain('department');
    
    // Check data rows
    expect(entitiesLines.length).toBeGreaterThan(1);
    expect(entitiesLines.some(line => line.includes('alice') && line.includes('Alice Chen'))).toBe(true);
    expect(entitiesLines.some(line => line.includes('bob') && line.includes('Bob Smith'))).toBe(true);
    
    // Check relationships CSV
    const relationshipsLines = csv.relationships.split('\n');
    const relationshipsHeader = relationshipsLines[0];
    
    expect(relationshipsHeader).toContain('source');
    expect(relationshipsHeader).toContain('target');
    expect(relationshipsHeader).toContain('type');
    
    // Check data rows
    expect(relationshipsLines.length).toBeGreaterThan(1);
    expect(relationshipsLines.some(line => 
      line.includes('alice,desert-ecology,leads')
    )).toBe(true);
    expect(relationshipsLines.some(line => 
      line.includes('bob,alice,reports_to')
    )).toBe(true);
  });
  
  test('Full Blob Export', () => {
    // Generate and save full blob
    const blob = ultralink.toFullBlob();
    
    // Save for inspection
    const outputDir = getSystemOutputPath(researchSystem, 'full-blob');
    fs.writeFileSync(path.join(outputDir, 'research-team.blob'), JSON.stringify(blob, null, 2));
    
    // Create a new instance and import
    const newUltralink = new UltraLink();
    newUltralink.fromFullBlob(blob);
    
    // Verify data was imported correctly
    expect(newUltralink.entities.size).toBe(ultralink.entities.size);
    expect(newUltralink.relationships.size).toBe(ultralink.relationships.size);
    
    // Verify specific entity
    const alice = newUltralink.getEntity('alice');
    expect(alice).toBeDefined();
    expect(alice.attributes.name).toBe('Alice Chen');
    expect(alice.attributes.role).toBe('Principal Investigator');
    
    // Verify relationships
    const aliceRelationships = newUltralink.getRelationships('alice');
    expect(aliceRelationships.some(r => r.target === 'desert-ecology' && r.type === 'leads')).toBe(true);
    expect(aliceRelationships.some(r => r.target === 'climate-impact' && r.type === 'contributes_to')).toBe(true);
  });
}); 