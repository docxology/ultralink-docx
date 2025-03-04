/**
 * Research Team Test Fixtures
 * 
 * Provides test data for a research team dataset with various entity types
 * and relationships between them.
 */

const { UltraLink } = require('../../src');

/**
 * Create a research team dataset with various entity types and relationships
 * @returns {UltraLink} Populated UltraLink instance
 */
function createResearchTeamDataset() {
  const ultralink = new UltraLink();
  
  // Create people
  ultralink.createEntity('person', 'alice-chen', {
    name: 'Alice Chen',
    title: 'Principal Investigator',
    expertise: ['Machine Learning', 'Computer Vision', 'Research Management'],
    status: 'active'
  });
  
  ultralink.createEntity('person', 'bob-smith', {
    name: 'Bob Smith',
    title: 'Senior Researcher',
    expertise: ['Natural Language Processing', 'Deep Learning'],
    status: 'active'
  });
  
  ultralink.createEntity('person', 'carol-jones', {
    name: 'Carol Jones',
    title: 'PhD Student',
    expertise: ['Computer Vision', 'Image Processing'],
    status: 'active'
  });
  
  ultralink.createEntity('person', 'david-lee', {
    name: 'David Lee',
    title: 'Research Assistant',
    expertise: ['Data Analysis', 'Statistical Methods'],
    status: 'active'
  });
  
  ultralink.createEntity('person', 'emma-wilson', {
    name: 'Emma Wilson',
    title: 'Lab Manager',
    expertise: ['Project Management', 'Research Administration'],
    status: 'active'
  });
  
  ultralink.createEntity('person', 'frank-miller', {
    name: 'Frank Miller',
    title: 'Visiting Researcher',
    expertise: ['Reinforcement Learning', 'Robotics'],
    status: 'active'
  });
  
  // Create knowledge areas
  ultralink.createEntity('knowledge-area', 'machine-learning-theory', {
    name: 'Machine Learning Theory',
    description: 'Theoretical foundations of machine learning algorithms',
    status: 'active'
  });
  
  ultralink.createEntity('knowledge-area', 'computer-vision', {
    name: 'Computer Vision',
    description: 'Processing and analyzing visual data',
    status: 'active'
  });
  
  ultralink.createEntity('knowledge-area', 'nlp', {
    name: 'Natural Language Processing',
    description: 'Processing and analyzing natural language',
    status: 'active'
  });
  
  // Create projects
  ultralink.createEntity('project', 'computer-vision-project', {
    name: 'Advanced Computer Vision Project',
    description: 'Research on novel computer vision algorithms for low-light conditions',
    start_date: '2021-01-15',
    status: 'active'
  });
  
  ultralink.createEntity('project', 'nlp-project', {
    name: 'NLP Understanding Project',
    description: 'Research on contextual understanding in NLP models',
    start_date: '2021-03-10',
    status: 'active'
  });
  
  ultralink.createEntity('project', 'ml-theory-project', {
    name: 'ML Theory Advancement',
    description: 'Theoretical research on convergence properties of ML algorithms',
    start_date: '2022-01-05',
    status: 'planning'
  });
  
  // Create publications
  ultralink.createEntity('publication', 'vision-paper-2022', {
    title: 'Novel Approaches to Low-Light Computer Vision',
    authors: ['Alice Chen', 'Carol Jones'],
    publication_date: '2022-06-15',
    journal: 'Journal of Computer Vision Research',
    status: 'published'
  });
  
  ultralink.createEntity('publication', 'nlp-paper-2022', {
    title: 'Contextual Understanding in Large Language Models',
    authors: ['Bob Smith', 'David Lee'],
    publication_date: '2022-08-22',
    journal: 'Computational Linguistics Journal',
    status: 'published'
  });
  
  // Create equipment
  ultralink.createEntity('equipment', 'gpu-cluster', {
    name: 'GPU Computing Cluster',
    description: 'High-performance GPU cluster for ML research',
    acquisition_date: '2020-11-30',
    status: 'operational'
  });
  
  ultralink.createEntity('equipment', 'dataset-server', {
    name: 'Dataset Storage Server',
    description: 'High-capacity storage for research datasets',
    acquisition_date: '2021-02-15',
    status: 'operational'
  });
  
  // Create relationships between people and projects
  ultralink.createLink('alice-chen', 'computer-vision-project', 'leads');
  ultralink.createLink('bob-smith', 'nlp-project', 'leads');
  ultralink.createLink('carol-jones', 'computer-vision-project', 'contributes_to');
  ultralink.createLink('david-lee', 'nlp-project', 'contributes_to');
  ultralink.createLink('emma-wilson', 'computer-vision-project', 'manages');
  ultralink.createLink('emma-wilson', 'nlp-project', 'manages');
  ultralink.createLink('frank-miller', 'computer-vision-project', 'contributes_to');
  
  // Create mentorship relationships
  ultralink.createLink('alice-chen', 'carol-jones', 'mentors');
  ultralink.createLink('bob-smith', 'david-lee', 'mentors');
  
  // Create knowledge area expertise
  ultralink.createLink('alice-chen', 'machine-learning-theory', 'has_expertise_in');
  ultralink.createLink('alice-chen', 'computer-vision', 'has_expertise_in');
  ultralink.createLink('bob-smith', 'machine-learning-theory', 'has_expertise_in');
  ultralink.createLink('bob-smith', 'nlp', 'has_expertise_in');
  ultralink.createLink('carol-jones', 'computer-vision', 'has_expertise_in');
  ultralink.createLink('david-lee', 'nlp', 'has_expertise_in');
  ultralink.createLink('frank-miller', 'machine-learning-theory', 'has_expertise_in');
  
  // Create project-knowledge area relationships
  ultralink.createLink('computer-vision-project', 'computer-vision', 'focuses_on');
  ultralink.createLink('computer-vision-project', 'machine-learning-theory', 'applies');
  ultralink.createLink('nlp-project', 'nlp', 'focuses_on');
  ultralink.createLink('nlp-project', 'machine-learning-theory', 'applies');
  ultralink.createLink('ml-theory-project', 'machine-learning-theory', 'focuses_on');
  
  // Create publication relationships
  ultralink.createLink('vision-paper-2022', 'computer-vision-project', 'resulted_from');
  ultralink.createLink('nlp-paper-2022', 'nlp-project', 'resulted_from');
  ultralink.createLink('alice-chen', 'vision-paper-2022', 'authored');
  ultralink.createLink('carol-jones', 'vision-paper-2022', 'authored');
  ultralink.createLink('bob-smith', 'nlp-paper-2022', 'authored');
  ultralink.createLink('david-lee', 'nlp-paper-2022', 'authored');
  
  // Create equipment usage relationships
  ultralink.createLink('computer-vision-project', 'gpu-cluster', 'uses');
  ultralink.createLink('nlp-project', 'gpu-cluster', 'uses');
  ultralink.createLink('computer-vision-project', 'dataset-server', 'uses');
  ultralink.createLink('nlp-project', 'dataset-server', 'uses');
  
  return ultralink;
}

/**
 * Create a subset of the research team data focused on a specific aspect
 * @param {String} aspect - Aspect to focus on ('people', 'projects', 'publications')
 * @returns {UltraLink} UltraLink instance with focused subset
 */
function createResearchTeamSubset(aspect) {
  const ultralink = new UltraLink();
  const fullDataset = createResearchTeamDataset();
  
  switch (aspect) {
    case 'people':
      // Only include people entities
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'person') {
          // Use createEntity instead of directly setting in the map
          ultralink.createEntity(entity.type, entity.id, entity.attributes);
        }
      }
      break;
      
    case 'projects':
      // Include projects and related people
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'project' || entity.type === 'person') {
          // Use createEntity instead of directly setting in the map
          ultralink.createEntity(entity.type, entity.id, entity.attributes);
        }
      }
      
      // Add project-person relationships
      for (const [entityId, links] of fullDataset.links.entries()) {
        if (ultralink.entities.has(entityId)) {
          for (const link of links) {
            if (ultralink.entities.has(link.target)) {
              ultralink.createLink(entityId, link.target, link.type);
            }
          }
        }
      }
      break;
      
    case 'publications':
      // Include publications and authors
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'publication' || entity.type === 'person') {
          // Use createEntity instead of directly setting in the map
          ultralink.createEntity(entity.type, entity.id, entity.attributes);
        }
      }
      
      // Add publication-author relationships
      for (const [entityId, links] of fullDataset.links.entries()) {
        if (ultralink.entities.has(entityId)) {
          for (const link of links) {
            if (ultralink.entities.has(link.target) && link.type === 'authored') {
              ultralink.createLink(entityId, link.target, link.type);
            }
          }
        }
      }
      break;
      
    default:
      throw new Error(`Unknown aspect: ${aspect}`);
  }
  
  return ultralink;
}

module.exports = {
  createResearchTeamDataset,
  createResearchTeamSubset
}; 