const { createEnhancedResearchTeamDataset, createEnhancedResearchTeamSubset } = require('./fixtures/research-team-llm');

describe('Enhanced Research Team Export Tests', () => {
  let ultralink;
  
  beforeEach(() => {
    ultralink = createEnhancedResearchTeamDataset();
  });
  
  test('should export to JSON with vector metadata', () => {
    const json = ultralink.toJSON();
    
    // Verify knowledge area vector metadata
    const mlTheory = json.entities.find(e => e.id === 'machine-learning-theory');
    expect(mlTheory.attributes.vector).toBeDefined();
    expect(mlTheory.attributes.vector.embedding).toHaveLength(4);
    expect(mlTheory.attributes.vector.cluster).toBe('core-ml-concepts');
    
    // Verify project LLM insights
    const visionProject = json.entities.find(e => e.id === 'computer-vision-project');
    expect(visionProject.attributes.llm_insights).toBeDefined();
    expect(visionProject.attributes.llm_insights.key_findings).toHaveLength(2);
    
    // Verify graph metadata
    expect(json.metadata).toBeDefined();
    expect(json.metadata.cluster_analysis).toHaveLength(2);
  });
  
  test('should export to CSV with flattened vector data', () => {
    const csv = ultralink.toCSV();
    const lines = csv.split('\n');
    
    // Header should include vector and LLM metadata columns
    const header = lines[0];
    expect(header).toContain('vector_embedding');
    expect(header).toContain('vector_cluster');
    expect(header).toContain('llm_insights_confidence');
    
    // Data rows should contain flattened vector and LLM data
    const dataRows = lines.slice(1);
    const mlTheoryRow = dataRows.find(row => row.includes('machine-learning-theory'));
    expect(mlTheoryRow).toContain('core-ml-concepts');
    
    const visionProjectRow = dataRows.find(row => row.includes('computer-vision-project'));
    expect(visionProjectRow).toContain('0.89'); // confidence score
  });
  
  test('should export to GraphML with vector attributes', () => {
    const graphml = ultralink.toGraphML();
    
    // GraphML should include vector metadata as node attributes
    expect(graphml).toContain('<key id="vector_embedding" for="node" attr.name="vector_embedding"');
    expect(graphml).toContain('<key id="vector_cluster" for="node" attr.name="vector_cluster"');
    
    // Verify node data includes vector attributes
    expect(graphml).toContain('<data key="vector_embedding">[0.23,0.45,-0.12,0.78]</data>');
    expect(graphml).toContain('<data key="vector_cluster">core-ml-concepts</data>');
  });
  
  test('should export subsets while preserving vector metadata', () => {
    const technicalSubset = createEnhancedResearchTeamSubset('technical');
    const json = technicalSubset.toJSON();
    
    // Technical subset should include vector metadata for relevant entities
    const mlTheory = json.entities.find(e => e.id === 'machine-learning-theory');
    expect(mlTheory.attributes.vector).toBeDefined();
    expect(mlTheory.attributes.vector.embedding).toHaveLength(4);
    
    // Should include project LLM insights
    const visionProject = json.entities.find(e => e.id === 'computer-vision-project');
    expect(visionProject.attributes.llm_insights).toBeDefined();
    
    // Should preserve graph metadata
    expect(json.metadata.cluster_analysis).toBeDefined();
  });
  
  test('should handle large vector embeddings in exports', () => {
    // Add an entity with a large vector embedding
    ultralink.entities.get('machine-learning-theory').attributes.vector.embedding = 
      Array.from({ length: 768 }, () => Math.random() - 0.5);
    
    // Test JSON export
    const json = ultralink.toJSON();
    expect(json.entities.find(e => e.id === 'machine-learning-theory')
      .attributes.vector.embedding).toHaveLength(768);
    
    // Test CSV export - should handle large vectors gracefully
    const csv = ultralink.toCSV();
    expect(csv).toContain('vector_embedding');
    
    // Test GraphML export - should encode large vectors properly
    const graphml = ultralink.toGraphML();
    expect(graphml).toContain('vector_embedding');
  });
  
  test('should export temporal metadata correctly', () => {
    const json = ultralink.toJSON();
    
    // Verify temporal analysis data
    expect(json.metadata.temporal_analysis).toBeDefined();
    expect(json.metadata.temporal_analysis.knowledge_evolution).toHaveLength(2);
    
    // Check CSV export of temporal data
    const csv = ultralink.toCSV();
    expect(csv).toContain('2021-Q1');
    expect(csv).toContain('2022-Q2');
    
    // Check GraphML export of temporal attributes
    const graphml = ultralink.toGraphML();
    expect(graphml).toContain('temporal_analysis');
  });
  
  test('should handle special characters in LLM-generated content', () => {
    // Add content with special characters
    ultralink.entities.get('computer-vision-project').attributes.llm_insights.key_findings.push({
      statement: 'Test with <special> & "characters" & \'quotes\'',
      confidence: 0.95
    });
    
    // Verify JSON escaping
    const json = ultralink.toJSON();
    expect(() => JSON.stringify(json)).not.toThrow();
    const jsonString = JSON.stringify(json);
    expect(jsonString).toContain('Test with <special> & \\"characters\\" & \'quotes\'');
    
    // Verify CSV escaping
    const csv = ultralink.toCSV();
    expect(csv).toContain('"Test with <special> & ""characters"" & \'quotes\'"');
    
    // Verify GraphML escaping
    const graphml = ultralink.toGraphML();
    expect(graphml).toContain('&lt;special&gt;');
    expect(graphml).toContain('&amp;');
  });
}); 