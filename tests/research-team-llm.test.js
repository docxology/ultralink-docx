const { createEnhancedResearchTeamDataset, createEnhancedResearchTeamSubset } = require('./fixtures/research-team-llm');

describe('Enhanced Research Team Dataset with LLM Metadata', () => {
  let ultralink;
  
  beforeEach(() => {
    ultralink = createEnhancedResearchTeamDataset();
  });
  
  test('should have vector metadata for knowledge areas', () => {
    const mlTheory = ultralink.entities.get('machine-learning-theory');
    const computerVision = ultralink.entities.get('computer-vision');
    
    expect(mlTheory.attributes.vector).toBeDefined();
    expect(mlTheory.attributes.vector.embedding).toHaveLength(4);
    expect(mlTheory.attributes.vector.cluster).toBe('core-ml-concepts');
    
    expect(computerVision.attributes.vector).toBeDefined();
    expect(computerVision.attributes.vector.embedding).toHaveLength(4);
    expect(computerVision.attributes.vector.similar_concepts).toHaveLength(2);
  });
  
  test('should have LLM insights for projects', () => {
    const visionProject = ultralink.entities.get('computer-vision-project');
    
    expect(visionProject.attributes.llm_insights).toBeDefined();
    expect(visionProject.attributes.llm_insights.key_findings).toHaveLength(2);
    expect(visionProject.attributes.llm_insights.critical_parameters).toHaveProperty('learning_rate');
    expect(visionProject.attributes.llm_insights.risk_assessment.technical_risks).toHaveLength(2);
  });
  
  test('should have research impact metrics for publications', () => {
    const paperVision = ultralink.entities.get('vision-paper-2022');
    
    expect(paperVision.attributes.impact_metrics).toBeDefined();
    expect(paperVision.attributes.impact_metrics.citation_network.vector).toHaveLength(4);
    expect(paperVision.attributes.impact_metrics.methodology_assessment).toHaveProperty('novelty_score');
  });
  
  test('should have collaboration metrics for team members', () => {
    const alice = ultralink.entities.get('alice-chen');
    
    expect(alice.attributes.collaboration_metrics).toBeDefined();
    expect(alice.attributes.collaboration_metrics.expertise_vector).toHaveLength(4);
    expect(alice.attributes.collaboration_metrics.team_impact.mentorship_effectiveness).toBeGreaterThan(0);
  });
  
  test('should have resource utilization analytics', () => {
    const gpuCluster = ultralink.entities.get('gpu-cluster');
    
    expect(gpuCluster.attributes.utilization_analytics).toBeDefined();
    expect(gpuCluster.attributes.utilization_analytics.usage_patterns.peak_times).toHaveLength(2);
    expect(gpuCluster.attributes.utilization_analytics.optimization_recommendations).toHaveLength(1);
  });
  
  test('should have knowledge graph metadata', () => {
    expect(ultralink.metadata).toBeDefined();
    expect(ultralink.metadata.graph_metrics).toHaveProperty('density');
    expect(ultralink.metadata.cluster_analysis).toHaveLength(2);
    expect(ultralink.metadata.temporal_analysis.knowledge_evolution).toHaveLength(2);
  });
});

describe('Enhanced Research Team Subsets', () => {
  test('should create technical subset', () => {
    const subset = createEnhancedResearchTeamSubset('technical');
    
    // Should include projects, knowledge areas, and equipment
    expect(subset.entities.get('computer-vision-project')).toBeDefined();
    expect(subset.entities.get('machine-learning-theory')).toBeDefined();
    expect(subset.entities.get('gpu-cluster')).toBeDefined();
    
    // Should not include people
    expect(subset.entities.get('alice-chen')).toBeUndefined();
  });
  
  test('should create collaboration subset', () => {
    const subset = createEnhancedResearchTeamSubset('collaboration');
    
    // Should include people and entities with collaboration metrics
    expect(subset.entities.get('alice-chen')).toBeDefined();
    expect(subset.entities.get('alice-chen').attributes.collaboration_metrics).toBeDefined();
    
    // Should not include equipment
    expect(subset.entities.get('gpu-cluster')).toBeUndefined();
  });
  
  test('should create impact subset', () => {
    const subset = createEnhancedResearchTeamSubset('impact');
    
    // Should include publications and entities with impact metrics
    expect(subset.entities.get('vision-paper-2022')).toBeDefined();
    expect(subset.entities.get('vision-paper-2022').attributes.impact_metrics).toBeDefined();
    
    // Should not include people without impact metrics
    expect(subset.entities.get('bob-smith')).toBeUndefined();
  });
  
  test('should throw error for invalid aspect', () => {
    expect(() => {
      createEnhancedResearchTeamSubset('invalid-aspect');
    }).toThrow('Unknown aspect: invalid-aspect');
  });
  
  test('should preserve metadata in subsets', () => {
    const subset = createEnhancedResearchTeamSubset('technical');
    expect(subset.metadata).toBeDefined();
    expect(subset.metadata.graph_metrics).toHaveProperty('density');
  });
}); 