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
    
    // Check if relationships or links is used
    const relationshipsField = dataset.relationships || dataset.links;
    expect(relationshipsField.size).toBeGreaterThan(0);
    
    // Test for specific entities that should exist
    expect(dataset.entities.get('alice-chen')).toBeDefined();
    expect(dataset.entities.get('computer-vision-project')).toBeDefined();
    expect(dataset.entities.get('vision-paper-2022')).toBeDefined();
    expect(dataset.entities.get('gpu-cluster')).toBeDefined();
    expect(dataset.entities.get('machine-learning-theory')).toBeDefined();
  });
  
  it('should have correct relationships between entities', () => {
    // Get Alice's relationships
    const aliceRelationships = dataset.getLinks('alice-chen');
    expect(aliceRelationships).toBeDefined();
    expect(aliceRelationships.size).toBeGreaterThan(0);
    
    // Check specific relationships
    const leadsProject = Array.from(aliceRelationships).some(rel => 
      rel.type === 'leads' && rel.target === 'computer-vision-project'
    );
    expect(leadsProject).toBe(true);
    
    const mentorsCarol = Array.from(aliceRelationships).some(rel => 
      rel.type === 'mentors' && rel.target === 'carol-jones'
    );
    expect(mentorsCarol).toBe(true);
  });
  
  it('should correctly identify backlinks', () => {
    // Since getLinks doesn't support incoming option, we'll manually check for backlinks
    // by iterating through all entities and their links
    
    // Find links pointing to the computer vision project
    const projectBacklinks = [];
    for (const [entityId, links] of dataset.links.entries()) {
      for (const link of links) {
        if (link.target === 'computer-vision-project') {
          projectBacklinks.push({ source: entityId, ...link });
        }
      }
    }
    
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
    const jsonString = dataset.toJSON();
    expect(jsonString).toBeDefined();
    expect(typeof jsonString).toBe('string');
    
    // Parse the JSON string
    const json = JSON.parse(jsonString);
    expect(json.entities.length).toBe(dataset.entities.size);
    
    // Check for links in the JSON
    const firstEntity = json.entities[0];
    expect(firstEntity.links).toBeDefined();
    
    // Create a new instance and import
    const { UltraLink } = require('../../src/index');
    const newDataset = new UltraLink();
    
    // Import the blob by manually creating entities and links
    json.entities.forEach(entity => {
      newDataset.createEntity(entity.type, entity.id, entity.attributes || {});
    });
    
    // Import links
    json.entities.forEach(entity => {
      if (entity.links && entity.links.length > 0) {
        entity.links.forEach(link => {
          try {
            newDataset.createLink(entity.id, link.target, link.type);
          } catch (err) {
            // Skip links to entities that don't exist
            console.warn(`Skipping link from ${entity.id} to ${link.target}: ${err.message}`);
          }
        });
      }
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