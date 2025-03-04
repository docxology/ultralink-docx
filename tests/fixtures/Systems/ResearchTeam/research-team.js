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
  const alice = ultralink.addEntity('alice-chen', 'person', {
    name: 'Alice Chen',
    title: 'Principal Investigator',
    expertise: ['Machine Learning', 'Computer Vision', 'Neural Networks'],
    email: 'alice.chen@research.org',
    joinDate: '2018-01-15',
    status: 'active'
  });
  
  const bob = ultralink.addEntity('bob-smith', 'person', {
    name: 'Bob Smith',
    title: 'Senior Researcher',
    expertise: ['Natural Language Processing', 'Deep Learning'],
    email: 'bob.smith@research.org',
    joinDate: '2019-03-01',
    status: 'active'
  });
  
  const carol = ultralink.addEntity('carol-jones', 'person', {
    name: 'Carol Jones',
    title: 'PhD Student',
    expertise: ['Reinforcement Learning', 'Robotics'],
    email: 'carol.jones@research.org',
    joinDate: '2020-09-01',
    status: 'active',
    advisor: 'alice-chen'
  });
  
  // NEW TEAM MEMBERS
  const david = ultralink.addEntity('david-patel', 'person', {
    name: 'David Patel',
    title: 'Postdoctoral Researcher',
    expertise: ['Federated Learning', 'Privacy-Preserving AI', 'Distributed Systems'],
    email: 'david.patel@research.org',
    joinDate: '2021-02-15',
    status: 'active'
  });
  
  const elena = ultralink.addEntity('elena-rodriguez', 'person', {
    name: 'Elena Rodriguez',
    title: 'Research Assistant',
    expertise: ['Data Visualization', 'Statistical Analysis'],
    email: 'elena.rodriguez@research.org',
    joinDate: '2022-06-01',
    status: 'active'
  });
  
  const frank = ultralink.addEntity('frank-zhang', 'person', {
    name: 'Frank Zhang',
    title: 'Visiting Researcher',
    expertise: ['Quantum Computing', 'Algorithm Design'],
    email: 'frank.zhang@partner-university.edu',
    joinDate: '2023-01-10',
    status: 'active',
    endDate: '2023-12-31'
  });
  
  const grace = ultralink.addEntity('grace-kim', 'person', {
    name: 'Grace Kim',
    title: 'Lab Manager',
    expertise: ['Research Administration', 'Grant Writing'],
    email: 'grace.kim@research.org',
    joinDate: '2019-07-15',
    status: 'active'
  });
  
  // Research Projects
  const projectVision = ultralink.addEntity('computer-vision-project', 'project', {
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
  
  const projectNLP = ultralink.addEntity('nlp-project', 'project', {
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
  
  // NEW PROJECTS
  const projectFederated = ultralink.addEntity('federated-learning-project', 'project', {
    title: 'Privacy-Preserving Federated Learning',
    description: 'Developing techniques for training models across distributed data sources while preserving privacy',
    startDate: '2022-03-01',
    endDate: '2025-02-28',
    status: 'active',
    budget: 650000,
    objectives: [
      'Reduce communication overhead in federated systems',
      'Enhance privacy guarantees beyond differential privacy',
      'Deploy to real-world healthcare applications'
    ]
  });
  
  const projectQuantum = ultralink.addEntity('quantum-ml-project', 'project', {
    title: 'Quantum Approaches to Machine Learning',
    description: 'Exploring quantum computing advantages for select machine learning problems',
    startDate: '2023-01-15',
    endDate: '2024-12-31',
    status: 'active',
    budget: 800000,
    objectives: [
      'Develop quantum algorithms for ML acceleration',
      'Benchmark against classical approaches',
      'Identify practical quantum advantage use cases'
    ]
  });
  
  const projectRobotics = ultralink.addEntity('adaptive-robotics-project', 'project', {
    title: 'Adaptive Robotics Control',
    description: 'Developing reinforcement learning approaches for adaptive robot control in unstructured environments',
    startDate: '2021-09-01',
    endDate: '2024-08-31',
    status: 'active',
    budget: 550000,
    objectives: [
      'Create sample-efficient RL algorithms for robotics',
      'Implement transfer learning between simulation and real-world',
      'Demonstrate robust performance in dynamic environments'
    ]
  });
  
  // Publications
  const paperVision = ultralink.addEntity('vision-paper-2022', 'publication', {
    title: 'Novel Approaches to Low-Light Computer Vision',
    authors: ['alice-chen', 'carol-jones'],
    venue: 'International Conference on Computer Vision 2022',
    year: 2022,
    doi: '10.1234/vision2022',
    citations: 45,
    abstract: 'This paper presents innovative techniques for computer vision in low-light conditions...'
  });
  
  const paperNLP = ultralink.addEntity('nlp-paper-2023', 'publication', {
    title: 'Context-Aware Language Understanding in Multi-Domain Settings',
    authors: ['bob-smith', 'alice-chen'],
    venue: 'ACL 2023',
    year: 2023,
    doi: '10.1234/acl2023',
    citations: 12,
    abstract: 'We propose a novel approach to context-aware language understanding...'
  });
  
  // NEW PUBLICATIONS
  const paperFederated = ultralink.addEntity('federated-paper-2023', 'publication', {
    title: 'Communication-Efficient Federated Learning with Adaptive Compression',
    authors: ['david-patel', 'alice-chen', 'frank-zhang'],
    venue: 'International Conference on Machine Learning 2023',
    year: 2023,
    doi: '10.1234/icml2023',
    citations: 8,
    abstract: 'This paper introduces a novel compression technique for federated learning that adaptively adjusts to network conditions and data heterogeneity...'
  });
  
  const paperRobotics = ultralink.addEntity('robotics-paper-2022', 'publication', {
    title: 'Sim-to-Real Transfer for Robotic Manipulation via Adaptive Domain Randomization',
    authors: ['carol-jones', 'alice-chen'],
    venue: 'Robotics: Science and Systems 2022',
    year: 2022,
    doi: '10.1234/rss2022',
    citations: 31,
    abstract: 'We present a new approach to sim-to-real transfer learning for robotic manipulation tasks that leverages adaptive domain randomization...'
  });
  
  const paperQuantum = ultralink.addEntity('quantum-paper-2023', 'publication', {
    title: 'Quantum Circuit Learning for Computer Vision Tasks',
    authors: ['frank-zhang', 'david-patel'],
    venue: 'Quantum Machine Intelligence Journal',
    year: 2023,
    doi: '10.1234/qmi2023',
    citations: 5,
    abstract: 'This study explores the application of parameterized quantum circuits for image classification tasks, demonstrating advantages in specific constrained scenarios...'
  });
  
  const paperSurvey = ultralink.addEntity('survey-paper-2023', 'publication', {
    title: 'A Comprehensive Survey of Privacy-Preserving Machine Learning Techniques',
    authors: ['david-patel', 'bob-smith', 'alice-chen'],
    venue: 'ACM Computing Surveys',
    year: 2023,
    doi: '10.1234/surveys2023',
    citations: 78,
    abstract: 'This survey provides a comprehensive overview of privacy-preserving machine learning techniques, including differential privacy, federated learning, secure multi-party computation, and homomorphic encryption...'
  });
  
  // Equipment and Resources
  const gpuCluster = ultralink.addEntity('gpu-cluster', 'equipment', {
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
  
  const robotLab = ultralink.addEntity('robotics-lab', 'facility', {
    name: 'Robotics Laboratory',
    description: 'Advanced robotics testing and development facility',
    location: 'Building B, Room 305',
    equipment: ['robot-arm-1', 'motion-capture-system'],
    capacity: 10,
    status: 'active'
  });
  
  // NEW EQUIPMENT AND RESOURCES
  const quantumComputer = ultralink.addEntity('quantum-computer', 'equipment', {
    name: 'Quantum Computing Access',
    description: 'Cloud access to IBM Quantum systems',
    location: 'Remote/Cloud',
    specifications: {
      qubits: 127,
      access: 'Priority research queue',
      quota: '20 hours/month'
    },
    status: 'operational',
    acquisitionDate: '2022-11-01',
    contractRenewal: '2024-10-31'
  });
  
  const hpcCluster = ultralink.addEntity('hpc-cluster', 'equipment', {
    name: 'University High-Performance Computing Cluster',
    description: 'Shared computing facility for computation-intensive research',
    location: 'Data Center Building C',
    specifications: {
      cores: 4096,
      memory: '16TB',
      storage: '1PB',
      interconnect: 'InfiniBand'
    },
    status: 'operational',
    accessLevel: 'shared'
  });
  
  const dataCollectionSystem = ultralink.addEntity('data-collection-system', 'equipment', {
    name: 'Field Data Collection System',
    description: 'Mobile sensors and data collection equipment for field research',
    location: 'Equipment Room 105',
    specifications: {
      sensors: ['environmental', 'biometric', 'geospatial'],
      storage: '2TB',
      battery: '72 hours'
    },
    status: 'operational',
    purchaseDate: '2022-05-15'
  });
  
  const conferenceRoom = ultralink.addEntity('conference-room', 'facility', {
    name: 'Research Team Conference Room',
    description: 'Meeting and presentation space with advanced AV equipment',
    location: 'Building A, Room 210',
    equipment: ['projector', 'video-conferencing', 'interactive-whiteboard'],
    capacity: 20,
    status: 'active'
  });
  
  const visualizationLab = ultralink.addEntity('visualization-lab', 'facility', {
    name: 'Data Visualization Laboratory',
    description: 'Specialized facility for immersive data visualization',
    location: 'Building B, Room 410',
    equipment: ['vr-headsets', 'large-format-displays', '3d-projection'],
    capacity: 8,
    status: 'active'
  });
  
  // Knowledge Areas
  const mlTheory = ultralink.addEntity('machine-learning-theory', 'knowledge-area', {
    name: 'Machine Learning Theory',
    description: 'Fundamental theoretical concepts in machine learning',
    topics: [
      'Statistical Learning',
      'Optimization',
      'Information Theory'
    ]
  });
  
  const computerVision = ultralink.addEntity('computer-vision', 'knowledge-area', {
    name: 'Computer Vision',
    description: 'Visual information processing and understanding',
    topics: [
      'Object Detection',
      'Image Segmentation',
      'Visual Recognition'
    ]
  });
  
  const nlp = ultralink.addEntity('nlp', 'knowledge-area', {
    name: 'Natural Language Processing',
    description: 'Processing and understanding of human language',
    topics: [
      'Text Understanding',
      'Machine Translation',
      'Language Generation'
    ]
  });
  
  // NEW KNOWLEDGE AREAS
  const privacyML = ultralink.addEntity('privacy-ml', 'knowledge-area', {
    name: 'Privacy-Preserving Machine Learning',
    description: 'Techniques for ensuring privacy in machine learning systems',
    topics: [
      'Differential Privacy',
      'Federated Learning',
      'Secure Multi-Party Computation',
      'Homomorphic Encryption'
    ]
  });
  
  const quantumML = ultralink.addEntity('quantum-ml', 'knowledge-area', {
    name: 'Quantum Machine Learning',
    description: 'Intersection of quantum computing and machine learning',
    topics: [
      'Quantum Neural Networks',
      'Quantum Kernels',
      'Quantum Circuit Learning',
      'Quantum Advantage in ML'
    ]
  });
  
  const robotics = ultralink.addEntity('robotics', 'knowledge-area', {
    name: 'Robotics',
    description: 'Design, construction, and operation of robots',
    topics: [
      'Robot Control',
      'Perception',
      'Path Planning',
      'Human-Robot Interaction'
    ]
  });
  
  const rlTheory = ultralink.addEntity('reinforcement-learning', 'knowledge-area', {
    name: 'Reinforcement Learning',
    description: 'Learning through interaction with an environment',
    topics: [
      'Value-Based Methods',
      'Policy Gradient Methods',
      'Model-Based RL',
      'Multi-Agent RL'
    ]
  });
  
  // Funding Sources
  const nsf = ultralink.addEntity('nsf-grant', 'funding', {
    name: 'NSF Research Grant',
    description: 'National Science Foundation grant for foundational research',
    amount: 1200000,
    startDate: '2021-01-01',
    endDate: '2024-12-31',
    grantNumber: 'NSF-2021-1234',
    type: 'federal'
  });
  
  const industryPartner = ultralink.addEntity('tech-partner', 'funding', {
    name: 'Tech Industry Partnership',
    description: 'Research partnership with major technology company',
    amount: 500000,
    startDate: '2022-07-01',
    endDate: '2024-06-30',
    contractNumber: 'IND-2022-789',
    type: 'industry'
  });
  
  const universityFunding = ultralink.addEntity('university-fund', 'funding', {
    name: 'University Research Excellence Fund',
    description: 'Internal university funding for promising research directions',
    amount: 250000,
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    grantNumber: 'UNI-2023-456',
    type: 'internal'
  });
  
  // Establish Relationships
  
  // Project Leadership and Participation
  ultralink.addLink(alice.id, projectVision.id, 'leads');
  ultralink.addLink(alice.id, projectNLP.id, 'contributes_to');
  ultralink.addLink(bob.id, projectNLP.id, 'leads');
  ultralink.addLink(carol.id, projectVision.id, 'contributes_to');
  
  // NEW PROJECT RELATIONSHIPS
  ultralink.addLink(david.id, projectFederated.id, 'leads');
  ultralink.addLink(alice.id, projectFederated.id, 'contributes_to');
  ultralink.addLink(frank.id, projectQuantum.id, 'leads');
  ultralink.addLink(david.id, projectQuantum.id, 'contributes_to');
  ultralink.addLink(carol.id, projectRobotics.id, 'leads');
  ultralink.addLink(elena.id, projectRobotics.id, 'contributes_to');
  ultralink.addLink(elena.id, projectVision.id, 'contributes_to');
  ultralink.addLink(david.id, projectNLP.id, 'contributes_to');
  ultralink.addLink(bob.id, projectFederated.id, 'contributes_to');
  
  // Mentorship
  ultralink.addLink(alice.id, carol.id, 'mentors');
  ultralink.addLink(alice.id, david.id, 'mentors');
  ultralink.addLink(bob.id, elena.id, 'mentors');
  ultralink.addLink(david.id, elena.id, 'mentors');
  ultralink.addLink(carol.id, elena.id, 'mentors'); // Peer mentorship
  
  // Publication Authorship
  ultralink.addLink(alice.id, paperVision.id, 'authored');
  ultralink.addLink(carol.id, paperVision.id, 'authored');
  ultralink.addLink(bob.id, paperNLP.id, 'authored');
  ultralink.addLink(alice.id, paperNLP.id, 'authored');
  
  // NEW PUBLICATION AUTHORSHIP
  ultralink.addLink(david.id, paperFederated.id, 'authored');
  ultralink.addLink(alice.id, paperFederated.id, 'authored');
  ultralink.addLink(frank.id, paperFederated.id, 'authored');
  ultralink.addLink(carol.id, paperRobotics.id, 'authored');
  ultralink.addLink(alice.id, paperRobotics.id, 'authored');
  ultralink.addLink(frank.id, paperQuantum.id, 'authored');
  ultralink.addLink(david.id, paperQuantum.id, 'authored');
  ultralink.addLink(david.id, paperSurvey.id, 'authored');
  ultralink.addLink(bob.id, paperSurvey.id, 'authored');
  ultralink.addLink(alice.id, paperSurvey.id, 'authored');
  
  // Project-Publication Relationships
  ultralink.addLink(projectVision.id, paperVision.id, 'produced');
  ultralink.addLink(projectNLP.id, paperNLP.id, 'produced');
  
  // NEW PROJECT-PUBLICATION RELATIONSHIPS
  ultralink.addLink(projectFederated.id, paperFederated.id, 'produced');
  ultralink.addLink(projectFederated.id, paperSurvey.id, 'produced');
  ultralink.addLink(projectRobotics.id, paperRobotics.id, 'produced');
  ultralink.addLink(projectQuantum.id, paperQuantum.id, 'produced');
  
  // Resource Usage
  ultralink.addLink(projectVision.id, gpuCluster.id, 'uses');
  ultralink.addLink(projectNLP.id, gpuCluster.id, 'uses');
  ultralink.addLink(carol.id, robotLab.id, 'uses');
  
  // NEW RESOURCE USAGE
  ultralink.addLink(projectFederated.id, gpuCluster.id, 'uses');
  ultralink.addLink(projectFederated.id, hpcCluster.id, 'uses');
  ultralink.addLink(projectQuantum.id, quantumComputer.id, 'uses');
  ultralink.addLink(projectQuantum.id, hpcCluster.id, 'uses');
  ultralink.addLink(projectRobotics.id, robotLab.id, 'uses');
  ultralink.addLink(projectRobotics.id, dataCollectionSystem.id, 'uses');
  ultralink.addLink(elena.id, visualizationLab.id, 'uses');
  ultralink.addLink(david.id, hpcCluster.id, 'uses');
  ultralink.addLink(frank.id, quantumComputer.id, 'uses');
  
  // Knowledge Area Relationships
  ultralink.addLink(mlTheory.id, computerVision.id, 'foundational_for');
  ultralink.addLink(mlTheory.id, nlp.id, 'foundational_for');
  ultralink.addLink(alice.id, computerVision.id, 'expertise_in');
  ultralink.addLink(bob.id, nlp.id, 'expertise_in');
  ultralink.addLink(carol.id, mlTheory.id, 'expertise_in');
  
  // NEW KNOWLEDGE AREA RELATIONSHIPS
  ultralink.addLink(mlTheory.id, privacyML.id, 'foundational_for');
  ultralink.addLink(mlTheory.id, quantumML.id, 'foundational_for');
  ultralink.addLink(mlTheory.id, rlTheory.id, 'foundational_for');
  ultralink.addLink(rlTheory.id, robotics.id, 'foundational_for');
  ultralink.addLink(david.id, privacyML.id, 'expertise_in');
  ultralink.addLink(david.id, mlTheory.id, 'expertise_in');
  ultralink.addLink(frank.id, quantumML.id, 'expertise_in');
  ultralink.addLink(carol.id, rlTheory.id, 'expertise_in');
  ultralink.addLink(carol.id, robotics.id, 'expertise_in');
  ultralink.addLink(alice.id, privacyML.id, 'expertise_in');
  ultralink.addLink(bob.id, privacyML.id, 'expertise_in');
  ultralink.addLink(elena.id, computerVision.id, 'expertise_in');
  
  // Project-Knowledge Area Relationships
  ultralink.addLink(projectVision.id, computerVision.id, 'applies');
  ultralink.addLink(projectVision.id, mlTheory.id, 'applies');
  ultralink.addLink(projectNLP.id, nlp.id, 'applies');
  ultralink.addLink(projectNLP.id, mlTheory.id, 'applies');
  
  // NEW PROJECT-KNOWLEDGE AREA RELATIONSHIPS
  ultralink.addLink(projectFederated.id, privacyML.id, 'applies');
  ultralink.addLink(projectFederated.id, mlTheory.id, 'applies');
  ultralink.addLink(projectQuantum.id, quantumML.id, 'applies');
  ultralink.addLink(projectQuantum.id, mlTheory.id, 'applies');
  ultralink.addLink(projectRobotics.id, robotics.id, 'applies');
  ultralink.addLink(projectRobotics.id, rlTheory.id, 'applies');
  
  // Funding Relationships
  ultralink.addLink(nsf.id, projectVision.id, 'funds');
  ultralink.addLink(nsf.id, projectRobotics.id, 'funds');
  ultralink.addLink(industryPartner.id, projectFederated.id, 'funds');
  ultralink.addLink(industryPartner.id, projectNLP.id, 'funds');
  ultralink.addLink(universityFunding.id, projectQuantum.id, 'funds');
  
  // Administrative Relationships
  ultralink.addLink(grace.id, projectVision.id, 'administers');
  ultralink.addLink(grace.id, projectNLP.id, 'administers');
  ultralink.addLink(grace.id, projectFederated.id, 'administers');
  ultralink.addLink(grace.id, projectQuantum.id, 'administers');
  ultralink.addLink(grace.id, projectRobotics.id, 'administers');
  
  // Publication Citations
  ultralink.addLink(paperSurvey.id, paperFederated.id, 'cites');
  ultralink.addLink(paperSurvey.id, paperVision.id, 'cites');
  ultralink.addLink(paperSurvey.id, paperNLP.id, 'cites');
  ultralink.addLink(paperRobotics.id, paperVision.id, 'cites');
  ultralink.addLink(paperQuantum.id, paperSurvey.id, 'cites');
  
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