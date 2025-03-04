/**
 * Research Team Integration Tests
 * 
 * Tests to verify UltraLink can handle complex research team dataset
 */

const { createResearchTeamDataset, createResearchTeamSubset } = require('../fixtures/research-team');

describe('Research Team Dataset', () => {
  let dataset;
  
  beforeEach(() => {
    dataset = createResearchTeamDataset();
  });
  
  it('should create a complete research team dataset', () => {
    expect(dataset).toBeDefined();
    expect(dataset.entities.size).toBeGreaterThan(0);
    expect(dataset.relationships.size).toBeGreaterThan(0);
    
    // Test for specific entities that should exist
    expect(dataset.getEntity('alice-chen')).toBeDefined();
    expect(dataset.getEntity('computer-vision-project')).toBeDefined();
    expect(dataset.getEntity('vision-paper-2022')).toBeDefined();
    expect(dataset.getEntity('gpu-cluster')).toBeDefined();
    expect(dataset.getEntity('machine-learning-theory')).toBeDefined();
  });
  
  it('should have correct relationships between entities', () => {
    // Get Alice's relationships
    const aliceRelationships = dataset.getLinks('alice-chen');
    expect(aliceRelationships.length).toBeGreaterThan(0);
    
    // Check specific relationships
    const leadsProject = aliceRelationships.some(rel => 
      rel.type === 'leads' && rel.target === 'computer-vision-project'
    );
    expect(leadsProject).toBe(true);
    
    const mentorsCarol = aliceRelationships.some(rel => 
      rel.type === 'mentors' && rel.target === 'carol-jones'
    );
    expect(mentorsCarol).toBe(true);
  });
  
  it('should correctly identify backlinks', () => {
    // Get backlinks to a project
    const projectBacklinks = dataset.getLinks('computer-vision-project', { incoming: true });
    expect(projectBacklinks.length).toBeGreaterThan(0);
    
    // Verify backlinks from team members to the project
    const aliceLeadsProject = projectBacklinks.some(rel => 
      rel.source === 'alice-chen' && rel.type === 'leads'
    );
    expect(aliceLeadsProject).toBe(true);
    
    const carolContributesToProject = projectBacklinks.some(rel => 
      rel.source === 'carol-jones' && rel.type === 'contributes_to'
    );
    expect(carolContributesToProject).toBe(true);
  });
  
  it('should filter entities by type', () => {
    // Find all people
    const people = Array.from(dataset.entities.values()).filter(entity => entity.type === 'person');
    expect(people.length).toBeGreaterThan(5); // We know there are multiple people
    
    // Verify all results are actually people
    people.forEach(person => {
      expect(person.type).toBe('person');
    });
    
    // Find all projects
    const projects = Array.from(dataset.entities.values()).filter(entity => entity.type === 'project');
    expect(projects.length).toBeGreaterThan(2); // We know there are multiple projects
    
    // Verify all results are actually projects
    projects.forEach(project => {
      expect(project.type).toBe('project');
    });
  });
  
  it('should filter entities by attribute', () => {
    // Find active entities
    const activeEntities = Array.from(dataset.entities.values())
      .filter(entity => entity.attributes && entity.attributes.status === 'active');
    expect(activeEntities.length).toBeGreaterThan(0);
    
    // Find entities with specific expertise
    const mlExperts = Array.from(dataset.entities.values())
      .filter(entity => 
        entity.type === 'person' && 
        entity.attributes.expertise && 
        entity.attributes.expertise.includes('Machine Learning')
      );
    expect(mlExperts.length).toBeGreaterThan(0);
    
    // Verify Alice is among ML experts
    const aliceFound = mlExperts.some(expert => expert.id === 'alice-chen');
    expect(aliceFound).toBe(true);
  });
  
  it('should create valid subsets of data', () => {
    // Test people subset
    const peopleSubset = createResearchTeamSubset('people');
    expect(peopleSubset).toBeDefined();
    expect(peopleSubset.entities.size).toBeGreaterThan(0);
    
    // Verify only people are included
    for (const [_, entity] of peopleSubset.entities) {
      expect(entity.type).toBe('person');
    }
    
    // Test projects subset
    const projectsSubset = createResearchTeamSubset('projects');
    expect(projectsSubset).toBeDefined();
    
    // Verify projects and people are included
    const hasProjects = Array.from(projectsSubset.entities.values())
      .some(entity => entity.type === 'project');
    const hasPeople = Array.from(projectsSubset.entities.values())
      .some(entity => entity.type === 'person');
    
    expect(hasProjects).toBe(true);
    expect(hasPeople).toBe(true);
  });
  
  it('should export and import the complex dataset', () => {
    // Export to JSON
    const json = dataset.toJSON();
    expect(json).toBeDefined();
    expect(json.entities.length).toBe(dataset.entities.size);
    expect(json.relationships.length).toBe(Object.keys(dataset.links).length);
    
    // Create a new instance and import
    const { UltraLink } = require('../../src/index');
    const newDataset = new UltraLink();
    
    // Import the blob by manually creating entities and links
    json.entities.forEach(entity => {
      newDataset.createEntity(entity.type, entity.id, entity.attributes || {});
    });
    
    json.relationships.forEach(rel => {
      newDataset.createLink(rel.source, rel.target, rel.type);
    });
    
    // Verify imported data
    expect(newDataset.entities.size).toBe(dataset.entities.size);
    
    // Check specific entity was imported correctly
    const alice = newDataset.entities.get('alice-chen');
    expect(alice).toBeDefined();
    expect(alice.attributes.name).toBe('Alice Chen');
    expect(alice.attributes.expertise).toContain('Machine Learning');
  });
}); 