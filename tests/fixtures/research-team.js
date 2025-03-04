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
  ultralink.addEntity('alice-chen', 'person', {
    name: 'Alice Chen',
    title: 'Principal Investigator',
    expertise: ['Machine Learning', 'Computer Vision', 'Research Management'],
    status: 'active'
  });
  
  ultralink.addEntity('bob-smith', 'person', {
    name: 'Bob Smith',
    title: 'Senior Researcher',
    expertise: ['Natural Language Processing', 'Deep Learning'],
    status: 'active'
  });
  
  ultralink.addEntity('carol-jones', 'person', {
    name: 'Carol Jones',
    title: 'PhD Student',
    expertise: ['Computer Vision', 'Image Processing'],
    status: 'active'
  });
  
  ultralink.addEntity('david-lee', 'person', {
    name: 'David Lee',
    title: 'Research Assistant',
    expertise: ['Data Analysis', 'Statistical Methods'],
    status: 'active'
  });
  
  ultralink.addEntity('emma-wilson', 'person', {
    name: 'Emma Wilson',
    title: 'Lab Manager',
    expertise: ['Project Management', 'Research Administration'],
    status: 'active'
  });
  
  ultralink.addEntity('frank-miller', 'person', {
    name: 'Frank Miller',
    title: 'Visiting Researcher',
    expertise: ['Reinforcement Learning', 'Robotics'],
    status: 'active'
  });
  
  // Create knowledge areas
  ultralink.addEntity('machine-learning-theory', 'knowledge-area', {
    name: 'Machine Learning Theory',
    description: 'Theoretical foundations of machine learning algorithms',
    status: 'active'
  });
  
  ultralink.addEntity('computer-vision', 'knowledge-area', {
    name: 'Computer Vision',
    description: 'Processing and analyzing visual data',
    status: 'active'
  });
  
  ultralink.addEntity('nlp', 'knowledge-area', {
    name: 'Natural Language Processing',
    description: 'Processing and analyzing natural language',
    status: 'active'
  });
  
  // Create projects
  ultralink.addEntity('computer-vision-project', 'project', {
    name: 'Advanced Computer Vision Project',
    description: 'Research on novel computer vision algorithms for low-light conditions',
    start_date: '2021-01-15',
    status: 'active'
  });
  
  ultralink.addEntity('nlp-project', 'project', {
    name: 'NLP Understanding Project',
    description: 'Research on contextual understanding in NLP models',
    start_date: '2021-03-10',
    status: 'active'
  });
  
  ultralink.addEntity('ml-theory-project', 'project', {
    name: 'ML Theory Advancement',
    description: 'Theoretical research on convergence properties of ML algorithms',
    start_date: '2022-01-05',
    status: 'planning'
  });
  
  // Create publications
  ultralink.addEntity('vision-paper-2022', 'publication', {
    title: 'Novel Approaches to Low-Light Computer Vision',
    authors: ['Alice Chen', 'Carol Jones'],
    publication_date: '2022-06-15',
    journal: 'Journal of Computer Vision Research',
    status: 'published'
  });
  
  ultralink.addEntity('nlp-paper-2022', 'publication', {
    title: 'Contextual Understanding in Large Language Models',
    authors: ['Bob Smith', 'David Lee'],
    publication_date: '2022-08-22',
    journal: 'Computational Linguistics Journal',
    status: 'published'
  });
  
  // Create equipment
  ultralink.addEntity('gpu-cluster', 'equipment', {
    name: 'GPU Computing Cluster',
    description: 'High-performance GPU cluster for ML research',
    acquisition_date: '2020-11-30',
    status: 'operational'
  });
  
  ultralink.addEntity('dataset-server', 'equipment', {
    name: 'Dataset Storage Server',
    description: 'High-capacity storage for research datasets',
    acquisition_date: '2021-02-15',
    status: 'operational'
  });
  
  // Create relationships between people and projects
  ultralink.addLink('alice-chen', 'computer-vision-project', 'leads');
  ultralink.addLink('bob-smith', 'nlp-project', 'leads');
  ultralink.addLink('carol-jones', 'computer-vision-project', 'contributes_to');
  ultralink.addLink('david-lee', 'nlp-project', 'contributes_to');
  ultralink.addLink('emma-wilson', 'computer-vision-project', 'manages');
  ultralink.addLink('emma-wilson', 'nlp-project', 'manages');
  ultralink.addLink('frank-miller', 'computer-vision-project', 'contributes_to');
  
  // Create mentorship relationships
  ultralink.addLink('alice-chen', 'carol-jones', 'mentors');
  ultralink.addLink('bob-smith', 'david-lee', 'mentors');
  
  // Create knowledge area expertise
  ultralink.addLink('alice-chen', 'machine-learning-theory', 'has_expertise_in');
  ultralink.addLink('alice-chen', 'computer-vision', 'has_expertise_in');
  ultralink.addLink('bob-smith', 'machine-learning-theory', 'has_expertise_in');
  ultralink.addLink('bob-smith', 'nlp', 'has_expertise_in');
  ultralink.addLink('carol-jones', 'computer-vision', 'has_expertise_in');
  ultralink.addLink('david-lee', 'nlp', 'has_expertise_in');
  ultralink.addLink('frank-miller', 'machine-learning-theory', 'has_expertise_in');
  
  // Create project-knowledge area relationships
  ultralink.addLink('computer-vision-project', 'computer-vision', 'focuses_on');
  ultralink.addLink('computer-vision-project', 'machine-learning-theory', 'applies');
  ultralink.addLink('nlp-project', 'nlp', 'focuses_on');
  ultralink.addLink('nlp-project', 'machine-learning-theory', 'applies');
  ultralink.addLink('ml-theory-project', 'machine-learning-theory', 'focuses_on');
  
  // Create publication relationships
  ultralink.addLink('vision-paper-2022', 'computer-vision-project', 'resulted_from');
  ultralink.addLink('nlp-paper-2022', 'nlp-project', 'resulted_from');
  ultralink.addLink('alice-chen', 'vision-paper-2022', 'authored');
  ultralink.addLink('carol-jones', 'vision-paper-2022', 'authored');
  ultralink.addLink('bob-smith', 'nlp-paper-2022', 'authored');
  ultralink.addLink('david-lee', 'nlp-paper-2022', 'authored');
  
  // Create equipment usage relationships
  ultralink.addLink('computer-vision-project', 'gpu-cluster', 'uses');
  ultralink.addLink('nlp-project', 'gpu-cluster', 'uses');
  ultralink.addLink('computer-vision-project', 'dataset-server', 'uses');
  ultralink.addLink('nlp-project', 'dataset-server', 'uses');
  
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
          // Use addEntity instead of directly setting in the map
          ultralink.addEntity(entity.id, entity.type, entity.attributes);
        }
      }
      break;
      
    case 'projects':
      // Include projects and related people
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'project' || entity.type === 'person') {
          // Use addEntity instead of directly setting in the map
          ultralink.addEntity(entity.id, entity.type, entity.attributes);
        }
      }
      
      // Add project-person relationships
      for (const [entityId, links] of fullDataset.links.entries()) {
        if (ultralink.entities.has(entityId)) {
          for (const link of links) {
            if (ultralink.entities.has(link.target)) {
              ultralink.addLink(entityId, link.target, link.type);
            }
          }
        }
      }
      break;
      
    case 'publications':
      // Include publications and authors
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'publication' || entity.type === 'person') {
          // Use addEntity instead of directly setting in the map
          ultralink.addEntity(entity.id, entity.type, entity.attributes);
        }
      }
      
      // Add publication-author relationships
      for (const [entityId, links] of fullDataset.links.entries()) {
        if (ultralink.entities.has(entityId)) {
          for (const link of links) {
            if (ultralink.entities.has(link.target) && link.type === 'authored') {
              ultralink.addLink(entityId, link.target, link.type);
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