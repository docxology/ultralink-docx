/**
 * Research Team Test Fixtures
 * 
 * This module provides test data for a research team scenario that demonstrates
 * UltraLink's capabilities across different export formats. The example includes:
 * - Team members with roles, expertise, and relationships
 * - Research projects with dependencies and milestones
 * - Publications and their authors
 * - Equipment and resources
 * - Knowledge areas and their relationships
 */

const { UltraLink } = require('../../../../src');

/**
 * Create a complete research team dataset
 * @returns {UltraLink} Populated UltraLink instance
 */
function createResearchTeamDataset() {
  const ultralink = new UltraLink();
  
  // Team Members
  const alice = ultralink.createEntity('person', 'alice-chen', {
    name: 'Alice Chen',
    title: 'Principal Investigator',
    expertise: ['Machine Learning', 'Computer Vision', 'Neural Networks'],
    email: 'alice.chen@research.org',
    joinDate: '2018-01-15',
    status: 'active'
  });
  
  const bob = ultralink.createEntity('person', 'bob-smith', {
    name: 'Bob Smith',
    title: 'Senior Researcher',
    expertise: ['Natural Language Processing', 'Deep Learning'],
    email: 'bob.smith@research.org',
    joinDate: '2019-03-01',
    status: 'active'
  });
  
  const carol = ultralink.createEntity('person', 'carol-jones', {
    name: 'Carol Jones',
    title: 'PhD Student',
    expertise: ['Reinforcement Learning', 'Robotics'],
    email: 'carol.jones@research.org',
    joinDate: '2020-09-01',
    status: 'active',
    advisor: 'alice-chen'
  });
  
  // Research Projects
  const projectVision = ultralink.createEntity('project', 'computer-vision-project', {
    title: 'Advanced Computer Vision Systems',
    description: 'Developing next-generation computer vision systems using deep learning',
    startDate: '2021-01-01',
    endDate: '2023-12-31',
    status: 'active',
    budget: 500000,
    objectives: [
      'Improve object detection accuracy',
      'Develop real-time processing capabilities',
      'Create robust low-light performance'
    ]
  });
  
  const projectNLP = ultralink.createEntity('project', 'nlp-project', {
    title: 'Natural Language Understanding',
    description: 'Advanced NLP techniques for context-aware language understanding',
    startDate: '2021-06-01',
    endDate: '2024-05-31',
    status: 'active',
    budget: 400000,
    objectives: [
      'Enhance contextual understanding',
      'Improve multilingual capabilities',
      'Develop efficient training methods'
    ]
  });
  
  // Publications
  const paperVision = ultralink.createEntity('publication', 'vision-paper-2022', {
    title: 'Novel Approaches to Low-Light Computer Vision',
    authors: ['alice-chen', 'carol-jones'],
    venue: 'International Conference on Computer Vision 2022',
    year: 2022,
    doi: '10.1234/vision2022',
    citations: 45,
    abstract: 'This paper presents innovative techniques for computer vision in low-light conditions...'
  });
  
  const paperNLP = ultralink.createEntity('publication', 'nlp-paper-2023', {
    title: 'Context-Aware Language Understanding in Multi-Domain Settings',
    authors: ['bob-smith', 'alice-chen'],
    venue: 'ACL 2023',
    year: 2023,
    doi: '10.1234/acl2023',
    citations: 12,
    abstract: 'We propose a novel approach to context-aware language understanding...'
  });
  
  // Equipment and Resources
  const gpuCluster = ultralink.createEntity('equipment', 'gpu-cluster', {
    name: 'High-Performance GPU Cluster',
    description: 'NVIDIA DGX A100 cluster for deep learning research',
    location: 'Server Room A',
    specifications: {
      gpus: 8,
      memory: '320GB',
      storage: '10TB'
    },
    status: 'operational',
    purchaseDate: '2021-01-15',
    maintenanceSchedule: 'quarterly'
  });
  
  const robotLab = ultralink.createEntity('facility', 'robotics-lab', {
    name: 'Robotics Laboratory',
    description: 'Advanced robotics testing and development facility',
    location: 'Building B, Room 305',
    equipment: ['robot-arm-1', 'motion-capture-system'],
    capacity: 10,
    status: 'active'
  });
  
  // Knowledge Areas
  const mlTheory = ultralink.createEntity('knowledge-area', 'machine-learning-theory', {
    name: 'Machine Learning Theory',
    description: 'Fundamental theoretical concepts in machine learning',
    topics: [
      'Statistical Learning',
      'Optimization',
      'Information Theory'
    ]
  });
  
  const computerVision = ultralink.createEntity('knowledge-area', 'computer-vision', {
    name: 'Computer Vision',
    description: 'Visual information processing and understanding',
    topics: [
      'Object Detection',
      'Image Segmentation',
      'Visual Recognition'
    ]
  });
  
  const nlp = ultralink.createEntity('knowledge-area', 'nlp', {
    name: 'Natural Language Processing',
    description: 'Processing and understanding of human language',
    topics: [
      'Text Understanding',
      'Machine Translation',
      'Language Generation'
    ]
  });
  
  // Establish Relationships
  
  // Project Leadership and Participation
  ultralink.createLink(alice.id, projectVision.id, 'leads');
  ultralink.createLink(alice.id, projectNLP.id, 'contributes_to');
  ultralink.createLink(bob.id, projectNLP.id, 'leads');
  ultralink.createLink(carol.id, projectVision.id, 'contributes_to');
  
  // Mentorship
  ultralink.createLink(alice.id, carol.id, 'mentors');
  
  // Publication Authorship
  ultralink.createLink(alice.id, paperVision.id, 'authored');
  ultralink.createLink(carol.id, paperVision.id, 'authored');
  ultralink.createLink(bob.id, paperNLP.id, 'authored');
  ultralink.createLink(alice.id, paperNLP.id, 'authored');
  
  // Project-Publication Relationships
  ultralink.createLink(projectVision.id, paperVision.id, 'produced');
  ultralink.createLink(projectNLP.id, paperNLP.id, 'produced');
  
  // Resource Usage
  ultralink.createLink(projectVision.id, gpuCluster.id, 'uses');
  ultralink.createLink(projectNLP.id, gpuCluster.id, 'uses');
  ultralink.createLink(carol.id, robotLab.id, 'uses');
  
  // Knowledge Area Relationships
  ultralink.createLink(mlTheory.id, computerVision.id, 'foundational_for');
  ultralink.createLink(mlTheory.id, nlp.id, 'foundational_for');
  ultralink.createLink(alice.id, computerVision.id, 'expertise_in');
  ultralink.createLink(bob.id, nlp.id, 'expertise_in');
  ultralink.createLink(carol.id, mlTheory.id, 'expertise_in');
  
  // Project-Knowledge Area Relationships
  ultralink.createLink(projectVision.id, computerVision.id, 'applies');
  ultralink.createLink(projectVision.id, mlTheory.id, 'applies');
  ultralink.createLink(projectNLP.id, nlp.id, 'applies');
  ultralink.createLink(projectNLP.id, mlTheory.id, 'applies');
  
  return ultralink;
}

/**
 * Create a subset of the research team data for specific test cases
 * @param {String} subset - Type of subset to create ('people', 'projects', 'publications')
 * @returns {UltraLink} UltraLink instance with subset of data
 */
function createResearchTeamSubset(subset) {
  const ultralink = new UltraLink();
  const fullDataset = createResearchTeamDataset();
  
  switch (subset) {
    case 'people':
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'person') {
          ultralink.entities.set(entity.id, entity);
        }
      }
      break;
      
    case 'projects':
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'project' || entity.type === 'person') {
          ultralink.entities.set(entity.id, entity);
        }
      }
      break;
      
    case 'publications':
      for (const entity of fullDataset.entities.values()) {
        if (entity.type === 'publication' || entity.type === 'person') {
          ultralink.entities.set(entity.id, entity);
        }
      }
      break;
      
    default:
      throw new Error(`Unknown subset type: ${subset}`);
  }
  
  return ultralink;
}

module.exports = {
  createResearchTeamDataset,
  createResearchTeamSubset
}; 