const { UltraLink } = require('../src');

/**
 * Create a Desert Ecosystem dataset for testing
 * @returns {UltraLink} Populated UltraLink instance
 */
function createDesertEcosystemDataset() {
  const ultralink = new UltraLink();

  // Add organisms
  ultralink.addEntity('saguaro', 'organism', {
    name: 'Saguaro Cactus',
    scientificName: 'Carnegiea gigantea',
    type: 'plant',
    height: '15-50 feet',
    lifespan: '150-200 years'
  });

  ultralink.addEntity('kangaroo-rat', 'organism', {
    name: 'Kangaroo Rat',
    scientificName: 'Dipodomys',
    type: 'mammal',
    weight: '100-150g',
    nocturnal: true
  });

  // Add environmental factors
  ultralink.addEntity('aridity', 'environmental_factor', {
    name: 'Aridity',
    description: 'Extremely dry conditions with minimal rainfall',
    annualRainfall: '3-15 inches'
  });

  // Add relationships
  ultralink.addLink('saguaro', 'aridity', 'adapts_to', {
    mechanism: 'Water storage in stem',
    efficiency: 0.95
  });

  ultralink.addLink('kangaroo-rat', 'aridity', 'adapts_to', {
    mechanism: 'Metabolic water production',
    efficiency: 0.88
  });

  return ultralink;
}

/**
 * Create a Research Team dataset for testing
 * @returns {UltraLink} Populated UltraLink instance
 */
function createResearchTeamDataset() {
  const ultralink = new UltraLink();

  // Add researchers
  ultralink.addEntity('alice-chen', 'researcher', {
    name: 'Alice Chen',
    title: 'Principal Investigator',
    expertise: ['machine learning', 'computer vision'],
    publications: 45
  });

  // Add projects
  ultralink.addEntity('nlp-project', 'project', {
    name: 'Advanced NLP Models',
    status: 'active',
    startDate: '2023-01-15',
    budget: 500000
  });

  // Add papers
  ultralink.addEntity('ml-paper', 'publication', {
    title: 'Novel Approaches in Machine Learning',
    status: 'published',
    date: '2023-06-01',
    citations: 12
  });

  // Add relationships
  ultralink.addLink('alice-chen', 'nlp-project', 'leads', {
    role: 'Principal Investigator',
    startDate: '2023-01-15'
  });

  ultralink.addLink('alice-chen', 'ml-paper', 'authored', {
    contribution: 'Lead author',
    date: '2023-06-01'
  });

  return ultralink;
}

/**
 * Create a performance test dataset of specified size
 * @param {Object} config Configuration object with entity and relationship counts
 * @returns {UltraLink} Populated UltraLink instance
 */
function createPerformanceDataset({ entities, relationships }) {
  const ultralink = new UltraLink();
  
  // Add entities
  for (let i = 0; i < entities; i++) {
    ultralink.addEntity(`entity-${i}`, 'test_entity', {
      name: `Test Entity ${i}`,
      value: Math.random(),
      timestamp: new Date().toISOString()
    });
  }

  // Add relationships
  for (let i = 0; i < relationships; i++) {
    const source = `entity-${Math.floor(Math.random() * entities)}`;
    const target = `entity-${Math.floor(Math.random() * entities)}`;
    
    ultralink.addLink(source, target, 'test_relationship', {
      weight: Math.random(),
      timestamp: new Date().toISOString()
    });
  }

  return ultralink;
}

module.exports = {
  createDesertEcosystemDataset,
  createResearchTeamDataset,
  createPerformanceDataset
}; 